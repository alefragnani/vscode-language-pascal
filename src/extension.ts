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
import { commands } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    Container.context = context;
    
    await registerWhatsNew();
    registerProviders();
    registerGenerateTags();
    registerWalkthrough();

    commands.registerCommand("pascal.newFile", async () => newFile());

    vscode.workspace.onDidGrantWorkspaceTrust(() => {
        registerProviders();
        registerGenerateTags();
    })
    
}

async function regularNewFile() {
    const doc = await vscode.workspace.openTextDocument(
        { language: "pascal", content: "program HelloWorld;\nbegin\n  WriteLn('Hello, World!');\nend." });
    await vscode.window.showTextDocument(doc);
}
async function newFile() {
    const doc = await vscode.workspace.openTextDocument({ language: "pascal" });
    const editor = await vscode.window.showTextDocument(doc);

    const snippet = new vscode.SnippetString(
        "program ${1:ProgramName};\n" +
        "begin\n" +
        "  WriteLn('${2:Hello, World!}');\n" +
        "end."
    );

    editor.insertSnippet(snippet);
}
