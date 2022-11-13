/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";

import { SystemOutputStream } from "../io/SystemOutputStream";
import { Console } from "../io/Console";
import { PrintStream } from "../io/PrintStream";
import { Properties } from "../util/Properties";

/** User agent client hints are still experimental and hence there's no type definition yet. */

type EntropyHintType = "architecture" | "bitness" | "model" | "platform" | "platformVersion" | "fullVersionList";

interface IStandardHintValues {
    readonly brands: Array<{ brand: string; version: string }>;
    readonly mobile: boolean;
    readonly platform: string;
}

interface IEntropyHintValues extends IStandardHintValues {
    readonly architecture?: string;
    readonly bitness?: string;
    readonly model?: string;
    readonly platformVersion?: string;
    readonly fullVersionList?: Array<{ brand: string; version: string }>;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
interface NavigatorUAData extends IStandardHintValues {
    readonly getHighEntropyValues: (hints: EntropyHintType[]) => Promise<IEntropyHintValues>;
    readonly toJSON: () => string;
}

interface IUANavigator extends Navigator {
    userAgentData?: NavigatorUAData;
}

/** A partial implementation of Java's System type. */
export class System {
    private static consoleInstance: java.io.Console;
    private static errorStream: java.io.PrintStream;
    private static outputStream: java.io.PrintStream;

    private static readonly properties = new Properties();

    public static arraycopy<T>(src: T[], srcPos: number, dest: T[], destPos: number, count: number): void {
        dest.splice(destPos, count, ...src.slice(srcPos, srcPos + count));
    }

    public static console(): java.io.Console {
        return System.consoleInstance;
    }

    public static get err(): java.io.PrintStream {
        return System.errorStream;
    }

    public static get out(): java.io.PrintStream {
        return System.outputStream;
    }

    public static lineSeparator(): string {
        return this.getProperty("line.separator", "/");
    }

    public static getProperty(key: string): string | undefined;
    public static getProperty(key: string, def: string): string;
    public static getProperty(key: string, def?: string): string | undefined {
        if (def) {
            return this.properties.getProperty(key, def);
        }

        return this.properties.getProperty(key);
    }

    /**
     * Fills the system properties table with some defaults.
     */
    private static setDefaultProperties(): void {
        // Depending on the environment different sources are used to fill the standard values.
        // Version numbers are determined by the tool.
        System.properties.setProperty("java.version", "11"); // JRE version
        System.properties.setProperty("java.vendor", "java2ts"); // JRE vendor
        System.properties.setProperty("java.vendor.url", "https://github.com/mike-lischke/java2typescript");
        System.properties.setProperty("java.home", "./"); // Java installation directory
        System.properties.setProperty("java.vm.specification.version", "1.0.0"); // JVM specification version
        System.properties.setProperty("java.vm.specification.vendor", "Mike Lischke"); // JVM specification vendor
        System.properties.setProperty("java.vm.specification.name", "java2ts"); // JVM specification name
        System.properties.setProperty("java.vm.version", "1.0.0"); // JVM implementation version
        System.properties.setProperty("java.vm.vendor", "Mike Lischke"); // JVM implementation vendor
        System.properties.setProperty("java.vm.name", "java2ts"); // JVM implementation name
        System.properties.setProperty("java.specification.version", "11"); // JRE specification version
        System.properties.setProperty("java.specification.vendor", "Mike Lischke"); // JRE specification vendor
        System.properties.setProperty("java.specification.name", "java2ts"); // JRE specification name
        System.properties.setProperty("java.class.version", "55"); // Java class format version number
        System.properties.setProperty("java.class.path", "./"); // Java class path
        System.properties.setProperty("java.library.path", "./"); // List of paths to search when loading libraries
        System.properties.setProperty("java.compiler", "java2ts"); // Name of JIT compiler to use
        System.properties.setProperty("java.ext.dirs", "./"); // Path of extension directory or directories

        if (typeof navigator !== "undefined") {
            // Web browser environment.
            System.properties.setProperty("java.io.tmpdir", "./"); // Default temp file path

            const userAgentData = (navigator as IUANavigator).userAgentData;
            if (userAgentData) {
                void userAgentData.getHighEntropyValues(["architecture", "platform", "platformVersion"]).then((ua) => {
                    System.properties.setProperty("os.arch", ua.architecture ?? ""); // Operating system architecture
                    System.properties.setProperty("os.version", ua.platformVersion ?? ""); // Operating system version
                });
            } else {
                System.properties.setProperty("os.arch", ""); // Operating system architecture
                System.properties.setProperty("os.version", ""); // Operating system version
            }

            System.properties.setProperty("os.name", navigator.platform); // Operating system name
            System.properties.setProperty("line.separator", "/"); // Line separator ("\n" on UNIX)
            System.properties.setProperty("file.separator", ""); // File separator ("/" on UNIX)
            System.properties.setProperty("path.separator", ""); // Path separator (":" on UNIX)
            System.properties.setProperty("user.name", ""); // User's account name
            System.properties.setProperty("user.home", ""); // User's home directory
            System.properties.setProperty("user.dir", ""); // User's current working directory
        } else {
            // Must be Node JS then.
            void import("os").then((os) => {
                System.properties.setProperty("java.io.tmpdir", os.tmpdir());
                System.properties.setProperty("os.name", os.type());
                System.properties.setProperty("os.arch", os.arch());
                System.properties.setProperty("os.version", os.version());
                System.properties.setProperty("line.separator", os.EOL);
            });

            void import("path").then((path) => {
                System.properties.setProperty("file.separator", path.sep);
                System.properties.setProperty("path.separator", path.delimiter);
            });

            void import("process").then((process) => {
                System.properties.setProperty("user.name", process.env.USER ?? "");
                System.properties.setProperty("user.home", process.env.HOME ?? "");
                System.properties.setProperty("user.dir", process.cwd());
            });
        }
    }

    static {
        // Need to use the unqualified class names or initialization will break.
        System.consoleInstance = new Console();
        System.errorStream = new PrintStream(new SystemOutputStream(true));
        System.outputStream = new PrintStream(new SystemOutputStream(false));

        setImmediate(() => {
            System.setDefaultProperties();
        });
    }
}
