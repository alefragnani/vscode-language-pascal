/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { newFile } from '../newFile/newFile';
import { newClassFile } from '../newFile/newClassFile';
import { newInterfaceFile } from '../newFile/newInterfaceFile';
import { newProgramFile } from '../newFile/newProgramFile';

export function registerNewFileCommands(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand("pascal.newFile", async () => newFile())
    );
    context.subscriptions.push(
        vscode.commands.registerCommand("pascal.newClassFile", async () => newClassFile())
    );
    context.subscriptions.push(
        vscode.commands.registerCommand("pascal.newInterfaceFile", async () => newInterfaceFile())
    );
    context.subscriptions.push(
        vscode.commands.registerCommand("pascal.newProgramFile", async () => newProgramFile())
    );
}
