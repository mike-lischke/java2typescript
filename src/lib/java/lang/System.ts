/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";

import { SystemOutputStream } from "../io/SystemOutputStream";
import { JavaObject } from "./Object";

/** User agent client hints are still experimental and hence there's no type definition yet. */

type EntropyHintType = "architecture" | "bitness" | "model" | "platform" | "platformVersion" | "fullVersionList";

interface IStandardHintValues {
    readonly brands: Array<{ brand: string; version: string; }>;
    readonly mobile: boolean;
    readonly platform: string;
}

interface IEntropyHintValues extends IStandardHintValues {
    readonly architecture?: string;
    readonly bitness?: string;
    readonly model?: string;
    readonly platformVersion?: string;
    readonly fullVersionList?: Array<{ brand: string; version: string; }>;
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
export class System extends JavaObject {
    private static consoleInstance: java.io.Console;
    private static errorStream: java.io.PrintStream;
    private static outputStream: java.io.PrintStream;

    private static properties: java.util.Properties;

    public static arraycopy<T>(src: T[], srcPos: number, dest: T[], destPos: number, count: number): void {
        dest.splice(destPos, count, ...src.slice(srcPos, srcPos + count));
    }

    public static console(): java.io.Console {
        if (!this.consoleInstance) {
            this.consoleInstance = new java.io.Console();
        }

        return this.consoleInstance;
    }

    public static get err(): java.io.PrintStream {
        if (!this.errorStream) {
            this.errorStream = new java.io.PrintStream(new SystemOutputStream(true));
        }

        return this.errorStream;
    }

    public static get out(): java.io.PrintStream {
        if (!this.outputStream) {
            this.outputStream = new java.io.PrintStream(new SystemOutputStream(false));
        }

        return this.outputStream;
    }

    public static lineSeparator(): string {
        return this.getProperty("line.separator", "/");
    }

    public static getProperty(key: string): string | undefined;
    public static getProperty(key: string, def: string): string;
    public static getProperty(key: string, def?: string): string | undefined {
        if (!this.properties) {
            this.setDefaultProperties();
        }

        if (def) {
            return this.properties.getProperty(key, def);
        }

        return this.properties.getProperty(key);
    }

    /**
     * Fills the system properties table with some defaults.
     */
    private static setDefaultProperties(): void {
        this.properties = new java.util.Properties();

        // Depending on the environment different sources are used to fill the standard values.
        // Version numbers are determined by the tool.
        this.properties.setProperty("java.version", "11"); // JRE version
        this.properties.setProperty("java.vendor", "java2ts"); // JRE vendor
        this.properties.setProperty("java.vendor.url", "https://github.com/mike-lischke/java2typescript");
        this.properties.setProperty("java.home", "./"); // Java installation directory
        this.properties.setProperty("java.vm.specification.version", "1.0.0"); // JVM specification version
        this.properties.setProperty("java.vm.specification.vendor", "Mike Lischke"); // JVM specification vendor
        this.properties.setProperty("java.vm.specification.name", "java2ts"); // JVM specification name
        this.properties.setProperty("java.vm.version", "1.0.0"); // JVM implementation version
        this.properties.setProperty("java.vm.vendor", "Mike Lischke"); // JVM implementation vendor
        this.properties.setProperty("java.vm.name", "java2ts"); // JVM implementation name
        this.properties.setProperty("java.specification.version", "11"); // JRE specification version
        this.properties.setProperty("java.specification.vendor", "Mike Lischke"); // JRE specification vendor
        this.properties.setProperty("java.specification.name", "java2ts"); // JRE specification name
        this.properties.setProperty("java.class.version", "55"); // Java class format version number
        this.properties.setProperty("java.class.path", "./"); // Java class path
        this.properties.setProperty("java.library.path", "./"); // List of paths to search when loading libraries
        this.properties.setProperty("java.compiler", "java2ts"); // Name of JIT compiler to use
        this.properties.setProperty("java.ext.dirs", "./"); // Path of extension directory or directories

        if (typeof navigator !== "undefined") {
            // Web browser environment.
            this.properties.setProperty("java.io.tmpdir", "./"); // Default temp file path

            const userAgentData = (navigator as IUANavigator).userAgentData;
            if (userAgentData) {
                void userAgentData.getHighEntropyValues(["architecture", "platform", "platformVersion"]).then((ua) => {
                    this.properties.setProperty("os.arch", ua.architecture ?? ""); // Operating system architecture
                    this.properties.setProperty("os.version", ua.platformVersion ?? ""); // Operating system version
                });
            } else {
                this.properties.setProperty("os.arch", ""); // Operating system architecture
                this.properties.setProperty("os.version", ""); // Operating system version
            }

            this.properties.setProperty("os.name", navigator.platform); // Operating system name
            this.properties.setProperty("line.separator", "/"); // Line separator ("\n" on UNIX)
            this.properties.setProperty("file.separator", ""); // File separator ("/" on UNIX)
            this.properties.setProperty("path.separator", ""); // Path separator (":" on UNIX)
            this.properties.setProperty("user.name", ""); // User's account name
            this.properties.setProperty("user.home", ""); // User's home directory
            this.properties.setProperty("user.dir", ""); // User's current working directory
        } else {
            // Must be Node JS then.
            void import("os").then((os) => {
                this.properties.setProperty("java.io.tmpdir", os.tmpdir());
                this.properties.setProperty("os.name", os.type());
                this.properties.setProperty("os.arch", os.arch());
                this.properties.setProperty("os.version", os.version());
                this.properties.setProperty("line.separator", os.EOL);
            });

            void import("path").then((path) => {
                this.properties.setProperty("file.separator", path.sep);
                this.properties.setProperty("path.separator", path.delimiter);
            });

            void import("process").then((process) => {
                this.properties.setProperty("user.name", process.env.USER ?? "");
                this.properties.setProperty("user.home", process.env.HOME ?? "");
                this.properties.setProperty("user.dir", process.cwd());
            });
        }
    }
}
