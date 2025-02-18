/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { createNewFileFromSnippetString } from './createNewFileFromSnippetString';

export async function newInterfaceFile() {
    const snippet = new vscode.SnippetString(
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
