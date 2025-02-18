/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { createNewFileFromSnippetString } from './createNewFileFromSnippetString';

export async function newClassFile() {
    const snippet = new vscode.SnippetString(
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
