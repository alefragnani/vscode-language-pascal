/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { commands } from 'vscode';
import { newFile } from '../newFile/newFile';
import { newClassFile } from '../newFile/newClassFile';
import { newInterfaceFile } from '../newFile/newInterfaceFile';
import { newProgramFile } from '../newFile/newProgramFile';
import { Container } from '../container';

export function registerNewFileCommands() {
    Container.context.subscriptions.push(
        commands.registerCommand("pascal.newFile", async () => newFile())
    );
    Container.context.subscriptions.push(
        commands.registerCommand("pascal.newClassFile", async () => newClassFile())
    );
    Container.context.subscriptions.push(
        commands.registerCommand("pascal.newInterfaceFile", async () => newInterfaceFile())
    );
    Container.context.subscriptions.push(
        commands.registerCommand("pascal.newProgramFile", async () => newProgramFile())
    );
}
