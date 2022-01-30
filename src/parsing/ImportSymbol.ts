/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { Symbol } from "antlr4-c3";

import { PackageSource } from "../PackageSource";
import { PackageSourceManager } from "../PackageSourceManager";

export class ImportSymbol extends Symbol {
    public importedSources: Set<PackageSource> = new Set();

    public constructor(name: string, private packageRoot: string, public fullImport: boolean) {
        super(name);

        const sources = PackageSourceManager.fromPackageId(this.name, this.packageRoot, this.fullImport);
        sources.forEach((source) => {
            this.importedSources.add(source);
        });
    }

}
