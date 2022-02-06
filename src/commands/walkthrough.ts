/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { commands } from "vscode";

function openExtensions(ids: string[]) {
    commands.executeCommand("workbench.extensions.action.showExtensionsWithIds", ids);
}

export function registerWalkthrough() {

    commands.registerCommand('_pascal.installDelphiThemes', () => openExtensions(["alefragnani.delphi-themes"]));
    commands.registerCommand('_pascal.installDelphiKeymap', () => openExtensions(["alefragnani.delphi-keybindings"]));
    commands.registerCommand('_pascal.installPascalFormatter', () => openExtensions(["alefragnani.pascal-formatter"]));
}