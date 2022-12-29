/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";

import { SystemOutputStream } from "../io/SystemOutputStream";
import { JavaObject } from "./Object";
import { S } from "../../templates";

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

    public static lineSeparator(): java.lang.String {
        return this.getProperty(S`line.separator`, S`/`);
    }

    public static getProperty(key: java.lang.String): java.lang.String | null;
    public static getProperty(key: java.lang.String, def: java.lang.String): java.lang.String;
    public static getProperty(key: java.lang.String, def?: java.lang.String): java.lang.String | null {
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
        this.properties.setProperty(S`java.version`, S`11`); // JRE version
        this.properties.setProperty(S`java.vendor`, S`java2ts`); // JRE vendor
        this.properties.setProperty(S`java.vendor.url`, S`https://github.com/mike-lischke/java2typescript`);
        this.properties.setProperty(S`java.home`, S`./`); // Java installation directory
        this.properties.setProperty(S`java.vm.specification.version`, S`1.0.0`); // JVM specification version
        this.properties.setProperty(S`java.vm.specification.vendor`, S`Mike Lischke`); // JVM specification vendor
        this.properties.setProperty(S`java.vm.specification.name`, S`java2ts`); // JVM specification name
        this.properties.setProperty(S`java.vm.version`, S`1.0.0`); // JVM implementation version
        this.properties.setProperty(S`java.vm.vendor`, S`Mike Lischke`); // JVM implementation vendor
        this.properties.setProperty(S`java.vm.name`, S`java2ts`); // JVM implementation name
        this.properties.setProperty(S`java.specification.version`, S`11`); // JRE specification version
        this.properties.setProperty(S`java.specification.vendor`, S`Mike Lischke`); // JRE specification vendor
        this.properties.setProperty(S`java.specification.name`, S`java2ts`); // JRE specification name
        this.properties.setProperty(S`java.class.version`, S`55`); // Java class format version number
        this.properties.setProperty(S`java.class.path`, S`./`); // Java class path
        this.properties.setProperty(S`java.library.path`, S`./`); // List of paths to search when loading libraries
        this.properties.setProperty(S`java.compiler`, S`java2ts`); // Name of JIT compiler to use
        this.properties.setProperty(S`java.ext.dirs`, S`./`); // Path of extension directory or directories

        if (typeof navigator !== "undefined") {
            // Web browser environment.
            this.properties.setProperty(S`java.io.tmpdir`, S`./`); // Default temp file path

            const userAgentData = (navigator as IUANavigator).userAgentData;
            if (userAgentData) {
                void userAgentData.getHighEntropyValues(["architecture", "platform", "platformVersion"]).then((ua) => {
                    this.properties.setProperty(S`os.arch`, S`${ua.architecture ?? ""}`);
                    this.properties.setProperty(S`os.version`, S`${ua.platformVersion ?? ""}`);
                });
            } else {
                this.properties.setProperty(S`os.arch`, S``); // Operating system architecture
                this.properties.setProperty(S`os.version`, S``); // Operating system version
            }

            this.properties.setProperty(S`os.name`, S`${navigator.platform}`); // Operating system name
            this.properties.setProperty(S`line.separator`, S`/`); // Line separator (S`\n" on UNIX)
            this.properties.setProperty(S`file.separator`, S``); // File separator (S`/" on UNIX)
            this.properties.setProperty(S`path.separator`, S``); // Path separator (S`:" on UNIX)
            this.properties.setProperty(S`user.name`, S``); // User's account name
            this.properties.setProperty(S`user.home`, S``); // User's home directory
            this.properties.setProperty(S`user.dir`, S``); // User's current working directory
        } else {
            // Must be Node JS then.
            void import("os").then((os) => {
                this.properties.setProperty(S`java.io.tmpdir`, S`${os.tmpdir()}`);
                this.properties.setProperty(S`os.name`, S`${os.type()}`);
                this.properties.setProperty(S`os.arch`, S`${os.arch()}`);
                this.properties.setProperty(S`os.version`, S`${os.version()}`);
                this.properties.setProperty(S`line.separator`, S`${os.EOL}`);
            });

            void import("path").then((path) => {
                this.properties.setProperty(S`file.separator`, S`${path.sep}`);
                this.properties.setProperty(S`path.separator`, S`${path.delimiter}`);
            });

            void import("process").then((process) => {
                this.properties.setProperty(S`user.name`, S`${process.env.USER ?? ""}`);
                this.properties.setProperty(S`user.home`, S`${process.env.HOME ?? ""}`);
                this.properties.setProperty(S`user.dir`, S`${process.cwd()}`);
            });
        }
    }
}
