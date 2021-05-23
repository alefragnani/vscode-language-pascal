/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { commands, window, workspace } from "vscode";
import { TagsBuilder } from "./providers/tagsBuilder";

export function registerCommands() {
    
    function generateTags(update: boolean) {

        if (!window.activeTextEditor) {
            window.showInformationMessage("Open a file first to generate tags");
            return;
        } 

        const tagBuilder: TagsBuilder = new TagsBuilder();
        const basePath: string = workspace.getWorkspaceFolder(window.activeTextEditor.document.uri).uri.fsPath;
        tagBuilder.generateTags(basePath, update, true);
    }    

    commands.registerCommand('pascal.generateTags', () => generateTags(false));
    commands.registerCommand('pascal.updateTags', () => generateTags(true));
}