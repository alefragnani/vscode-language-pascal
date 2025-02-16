/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { createNewFileFromSnippetString } from './createNewFileFromSnippetString';

export async function newProgramFile() {
    const snippet = new vscode.SnippetString(
        "program ${1:ProgramName};\n\n" +
        "uses\n" +
        "  Classes;\n\n" +
        "begin\n" +
        "  $0\n" +
        "end."
    );
    createNewFileFromSnippetString(snippet);
}
