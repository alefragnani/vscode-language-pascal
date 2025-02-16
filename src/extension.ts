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
import { commands, SnippetString } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    Container.context = context;
    
    await registerWhatsNew();
    registerProviders();
    registerGenerateTags();
    registerWalkthrough();

    commands.registerCommand("pascal.newFile", async () => newFile());
    commands.registerCommand("pascal.newClassFile", async () => newClassFile());
    commands.registerCommand("pascal.newInterfaceFile", async () => newInterfaceFile());
    commands.registerCommand("pascal.newProgramFile", async () => newProgramFile());

    vscode.workspace.onDidGrantWorkspaceTrust(() => {
        registerProviders();
        registerGenerateTags();
    })
    
}

async function newFile() {
    const snippet = new SnippetString(
        "unit ${1:UnitName};\n\n" +
        "interface\n\n" +
        "uses\n" +
        "  Classes;\n\n" +
        "$0\n" +
        "implementation\n\n" +
        "end."
    );
    createNewFileFromSnippetString(snippet);
}

async function newClassFile() {
    const snippet = new SnippetString(
        "unit ${1:UnitName};\n\n" +
        "interface\n\n" +
        "uses\n" +
        "  Classes;\n\n" +
        "type\n" +
        "  T${2:ClassName} = class\n" +
        "  public\n" +
        "    constructor Create;\n" +
        "  end;\n\n" +
        "implementation\n\n" +
        "constructor T${2:ClassName}.Create;\n" +
        "begin\n" +
        "  inherited Create;\n" +
        "  $0\n" +
        "end;\n\n" +
        "end."
    );
    createNewFileFromSnippetString(snippet);
}

async function newInterfaceFile() {
    const snippet = new SnippetString(
        "unit ${1:UnitName};\n\n" +
        "interface\n\n" +
        "uses\n" +
        "  Classes;\n\n" +
        "type\n" +
        "  I${2:ClassName} = interface\n" +
        "    $0\n" +
        "  end;\n\n" +
        "implementation\n\n" +
        "end."
    );
    createNewFileFromSnippetString(snippet);
}

async function newProgramFile() {
    const snippet = new SnippetString(
        "program ${1:ProgramName};\n\n" +
        "uses\n" +
        "  Classes;\n\n" +
        "begin\n" +
        "  $0\n" +
        "end."
    );
    createNewFileFromSnippetString(snippet);
}

async function createNewFileFromSnippetString(content: SnippetString) {
    const document = await vscode.workspace.openTextDocument({ language: "pascal" });
    const editor = await vscode.window.showTextDocument(document);
    editor.insertSnippet(content);
}
