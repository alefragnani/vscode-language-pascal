/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

import { Container } from './container';
import { registerWhatsNew } from './whats-new/commands';
import { registerCommands } from './commands';
import { registerProviders } from './providers';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    Container.context = context;
    
    registerWhatsNew();

    if (vscode.workspace.isTrusted) {
        registerProviders();
        registerCommands();
    }    

    vscode.workspace.onDidGrantWorkspaceTrust(() => {
        registerProviders();
        registerCommands();
    })
    
}