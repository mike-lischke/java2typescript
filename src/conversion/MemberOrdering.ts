/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import console from "console";

import { ContextType, MemberType as ContextMemberType } from "./types";

/**
 * A class and its associated data structures, for converting the `@typescript-eslint/member-ordering`
 * linter rule setting and applying it to a list of given type members.
 */

/** The structure of the `@typescript-eslint/member-ordering` linter rule setting. */
export interface IMemberOrderOptions {
    default?: OrderConfig;
    classes?: OrderConfig;
    classExpressions?: OrderConfig;
    interfaces?: OrderConfig;
    typeLiterals?: OrderConfig;
}

type OrderConfig = MemberType[] | ISortedOrderConfig | "never";

interface ISortedOrderConfig {
    memberTypes?: MemberType[] | "never";
    optionalityOrder?: "optional-first" | "required-first";
    order:
    | "alphabetically"
    | "alphabetically-case-insensitive"
    | "as-written"
    | "natural"
    | "natural-case-insensitive";
}

type MemberType = string | string[];
type Accessibility = "public" | "protected" | "private" | "#private";
type Scope = "static" | "instance" | "decorated" | "abstract";
type Kind = "call-signature" | "constructor" | "field" | "readonly-field" | "get" | "method" | "set"
    | "signature" | "readonly-signature" | "initialization";

/** The deconstructed member ordering settings. */
interface IExpandedOrderDetails {
    accessibility?: Accessibility;
    scope?: Scope;
    kind: Kind;
}

type ExpandedOrderList = IExpandedOrderDetails[][];

interface IMember {
    type: ContextMemberType;
    modifiers?: Set<string>;
}

export class MemberOrdering {
    #defaultList?: ExpandedOrderList;
    #classList?: ExpandedOrderList;
    #interfaceList?: ExpandedOrderList;
    #classExpressionList?: ExpandedOrderList;

    public constructor(options: IMemberOrderOptions) {
        this.#defaultList = this.convertOrderConfig(options.default);
        this.#classList = this.convertOrderConfig(options.classes);
        this.#interfaceList = this.convertOrderConfig(options.interfaces);
        this.#classExpressionList = this.convertOrderConfig(options.classExpressions);
    }

    /**
     * Applies the configured member ordering to the given list of members.
     *
     * @param members The members to sort.
     * @param context The context in which the members are defined.
     *
     * @returns The sorted list of members.
     */
    public apply = (members: IMember[], context: ContextType): IMember[] => {
        let orderList = this.#defaultList;
        if (context === ContextType.Class && this.#classList) {
            orderList = this.#classList;
        } else if (context === ContextType.Interface && this.#interfaceList) {
            orderList = this.#interfaceList;
        } else if (context === ContextType.ClassExpression && this.#classExpressionList) {
            orderList = this.#classExpressionList;
        }

        if (!orderList) {
            return members;
        }

        const result: IMember[] = [];
        orderList.forEach((orderGroup) => {
            const group: IMember[] = [];
            orderGroup.forEach((orderItem) => {
                if (orderItem.kind === "call-signature" || orderItem.kind === "get" || orderItem.kind === "set"
                    || orderItem.kind === "signature" || orderItem.kind === "readonly-signature") {
                    // These kinds cannot appear in code translated from Java.
                    return;
                }

                // Loop over the members list and find all entries that match the current order item.
                // Each match is moved to the result list and removed from the members list.
                while (true) {
                    // Find the next entry in the members list that matches the current order item.
                    const index = members.findIndex((member) => {
                        switch (orderItem.kind) {
                            case "constructor": {
                                if (member.type !== ContextMemberType.Constructor) {
                                    return false;
                                }

                                break;
                            }

                            case "field": {
                                if (member.type !== ContextMemberType.Field) {
                                    return false;
                                }

                                break;
                            }

                            case "readonly-field": {
                                if (member.type !== ContextMemberType.Field) {
                                    return false;
                                }

                                if (!member.modifiers?.has("readonly")) {
                                    return false;
                                }

                                break;
                            }

                            case "method": {
                                if (member.type !== ContextMemberType.Method) {
                                    return false;
                                }

                                break;
                            }

                            case "initialization": {
                                if (member.type !== ContextMemberType.Initializer) {
                                    return false;
                                }

                                break;
                            }

                            default:
                        }

                        if (orderItem.accessibility && !member.modifiers?.has(orderItem.accessibility)) {
                            return false;
                        }

                        switch (orderItem.scope) {
                            case "static": {
                                if (!member.modifiers?.has("static")) {
                                    return false;
                                }

                                break;
                            }

                            case "instance": {
                                if (member.modifiers?.has("static")) {
                                    return false;
                                }

                                break;
                            }

                            case "decorated": {
                                if (!member.modifiers?.has("decorated")) {
                                    return false;
                                }

                                break;
                            }

                            case "abstract": {
                                if (!member.modifiers?.has("abstract")) {
                                    return false;
                                }

                                break;
                            }

                            default:
                        }

                        return true;
                    });

                    if (index >= 0) {
                        group.push(members[index]);
                        members.splice(index, 1);
                    } else {
                        break;
                    }
                }
            });

            if (group.length > 0) {
                result.push(...group);
            }
        });

        // Some members may not have matched any order item, so add them to the end.
        return result.concat(members);
    };

    private convertOrderConfig(config: OrderConfig | undefined): ExpandedOrderList | undefined {
        if (!config || config === "never") {
            return undefined;
        }

        // TODO: handle additional SortedOrderConfig options (alphabetic order etc.).
        if (this.isSortedOrderConfig(config)) {
            console.warn("Sorted order configuration (in memberOrderOptions) not yet supported.");

            return undefined;
        }

        const expandedOrderList: ExpandedOrderList = config.map((orderItem) => {
            const list = Array.isArray(orderItem) ? orderItem : [orderItem];

            return list.map((item) => {
                const parts = item.split("-", 3);

                switch (parts.length) {
                    case 1: {
                        return {
                            kind: parts[0] as Kind,
                        };
                    }

                    case 2: {
                        return {
                            scope: parts[0] as Scope,
                            kind: parts[1] as Kind,
                        };
                    }

                    case 3: {
                        return {
                            accessibility: parts[0] as Accessibility,
                            scope: parts[1] as Scope,
                            kind: parts[2] as Kind,
                        };
                    }

                    default: {
                        throw new Error("Invalid member ordering configuration.");
                    }
                }
            });
        });

        return expandedOrderList;
    }

    private isSortedOrderConfig(config: unknown): config is ISortedOrderConfig {
        return (config as ISortedOrderConfig).order !== undefined;
    }
}
