'use strict';

import fs = require("fs");
import path = require("path");
import * as vscode from 'vscode';
import { TagsBuilder } from './tagsBuilder';

export class AbstractProvider {

    public generateTagsIfNeeded(): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {

            if (fs.existsSync(path.join(vscode.workspace.rootPath, "GTAGS"))) {
                resolve(true);
                return;
            }

            let autoGenerate: boolean = vscode.workspace.getConfiguration("pascal").get("tags.autoGenerate", true);
            if (!autoGenerate) {
                resolve(false);
                return;
            }

            let tagBuilder: TagsBuilder = new TagsBuilder();
            tagBuilder.generateTags(vscode.workspace.rootPath, false)
                .then((value: string) => {
                    resolve(value === "");
                    return;
                });
        });
    }
}