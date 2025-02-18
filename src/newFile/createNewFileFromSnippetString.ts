/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export async function createNewFileFromSnippetString(content: vscode.SnippetString) {
    const document = await vscode.workspace.openTextDocument({ language: "pascal" });
    const editor = await vscode.window.showTextDocument(document);
    editor.insertSnippet(content);
}
