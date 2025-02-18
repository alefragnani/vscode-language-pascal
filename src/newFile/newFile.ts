/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { createNewFileFromSnippetString } from './createNewFileFromSnippetString';

export async function newFile() {
    const snippet = new vscode.SnippetString(
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
