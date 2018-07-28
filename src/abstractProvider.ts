'use strict';

import fs = require("fs");
import path = require("path");
import * as vscode from 'vscode';
import { TagsBuilder } from './tagsBuilder';

export class AbstractProvider {

    public static basePathForFilename(filename: string): string {
        let uriFilename: vscode.Uri = vscode.Uri.file(filename);
        if (vscode.workspace.workspaceFolders) {
            return vscode.workspace.getWorkspaceFolder(uriFilename).uri.fsPath;
        } else {
            return path.dirname(filename);             
        }

    }

    public generateTagsIfNeeded(filename): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {

            let uri: vscode.Uri = vscode.Uri.file(filename);
            if (vscode.workspace.getConfiguration("pascal", uri).get("codeNavigation", "workspace") === "workspace") {
                if (fs.existsSync(path.join(AbstractProvider.basePathForFilename(filename), "GTAGS"))) {
                    resolve(true);
                    return;
                }

                let autoGenerate: boolean = vscode.workspace.getConfiguration("pascal").get("tags.autoGenerate", true);
                if (!autoGenerate) {
                    resolve(false);
                    return;
                }

                let tagBuilder: TagsBuilder = new TagsBuilder();
                tagBuilder.generateTags(AbstractProvider.basePathForFilename(filename), false)
                    .then((value: string) => {
                        resolve(value === "");
                        return;
                    });
            } else {
                let tagBuilder: TagsBuilder = new TagsBuilder();
                tagBuilder.generateTagsForFile(filename)
                    .then((value: string) => {
                        resolve(value === "");
                        return;
                    });
            }
        });
    }
}