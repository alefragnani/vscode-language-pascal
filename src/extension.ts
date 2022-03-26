/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

import { Container } from './container';
import { registerWhatsNew } from './whats-new/commands';
import { registerGenerateTags } from './commands/generateTags';
import { registerProviders } from './providers';
import { registerWalkthrough } from "./commands/walkthrough";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

    Container.context = context;
    
    await registerWhatsNew();
    registerProviders();
    registerGenerateTags();
    registerWalkthrough();

    vscode.workspace.onDidGrantWorkspaceTrust(() => {
        registerProviders();
        registerGenerateTags();
    })
    
}