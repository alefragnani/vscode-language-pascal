/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

'use strict';

import fs = require("fs");
import path = require("path");
import * as vscode from 'vscode';
import { TagsBuilder } from './tagsBuilder';

export class AbstractProvider {

    public static basePathForFilename(filename: string): string {
        const uriFilename: vscode.Uri = vscode.Uri.file(filename);
        if (vscode.workspace.workspaceFolders) {
            return vscode.workspace.getWorkspaceFolder(uriFilename).uri.fsPath;
        } else {
            return path.dirname(filename);             
        }

    }

    public generateTagsIfNeeded(filename): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {

            const uri: vscode.Uri = vscode.Uri.file(filename);
            if (vscode.workspace.getConfiguration("pascal", uri).get("codeNavigation", "workspace") === "workspace") {
                if (fs.existsSync(path.join(AbstractProvider.basePathForFilename(filename), "GTAGS"))) {
                    resolve(true);
                    return;
                }

                const autoGenerate: boolean = vscode.workspace.getConfiguration("pascal").get("tags.autoGenerate", true);
                if (!autoGenerate) {
                    resolve(false);
                    return;
                }

                const tagBuilder: TagsBuilder = new TagsBuilder();
                tagBuilder.generateTags(AbstractProvider.basePathForFilename(filename), false)
                    .then((value: string) => {
                        resolve(value === "");
                        return;
                    });
            } else {
                const tagBuilder: TagsBuilder = new TagsBuilder();
                tagBuilder.generateTagsForFile(filename)
                    .then((value: string) => {
                        resolve(value === "");
                        return;
                    });
            }
        });
    }
}