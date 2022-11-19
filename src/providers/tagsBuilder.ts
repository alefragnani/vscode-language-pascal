/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

'use strict';

import cp = require('child_process');
import vscode = require('vscode');
import path = require('path');
import fs = require('fs');
import { AbstractProvider } from "./abstractProvider";

export class TagsBuilder {

    public generateTags(basePath: string, update: boolean, showMessage?: boolean): Promise<string> {

        return new Promise<string>((resolve, reject) => {

            let command: string = update ? "global" : "gtags";
            let params: string = update ? "--update" : "";

            if (!TagsBuilder.tagsAvailable(path.join(basePath, 'GTAGS'))) {
                command = "gtags";
                params = "";
            }

			const statusBar: vscode.Disposable = vscode.window.setStatusBarMessage("Generating tags...");
            cp.execFile(command, [params], { cwd: basePath }, (err, stdout, stderr) => {
                try {
					statusBar.dispose();

                    if (err && (<any>err).code === 'ENOENT') {
                        vscode.window.showInformationMessage(vscode.l10n.t('The {0} command is not available. Make sure it is on PATH', command));
                        resolve(vscode.l10n.t('The {0} command is not available. Make sure it is on PATH', command));
                        return;
                    }
                    if (err) {
                        vscode.window.showInformationMessage(vscode.l10n.t('Some error occured: {0}', err));
                        resolve(vscode.l10n.t('Some error occured: {0}', err));
                        return;
                    }
                    if (stderr) {
                        vscode.window.showInformationMessage(vscode.l10n.t('Some error occured: {0}', stderr));
                        resolve(vscode.l10n.t('Some error occured: {0}', stderr));
                        return;
                    }

					if (showMessage) {
						vscode.window.showInformationMessage(vscode.l10n.t('The tags where updated'));
					}
                    resolve("");
                    return;
                } catch (e) {
                    vscode.window.showInformationMessage(vscode.l10n.t('Some error occured: {0}', e));
                    reject(vscode.l10n.t('Some error occured: {0}', e));
                    return;
                }
            });

        });
    }
		
    public generateTagsForFile(fileName: string): Promise<string> {

        return new Promise<string>((resolve, reject) => {

			const basePath: string = AbstractProvider.basePathForFilename(fileName);
			const listTXT: string = path.join(basePath, 'GLIST');
			fs.writeFileSync(listTXT, fileName);

			cp.execFile('gtags', ["--accept-dotfiles", "-f", listTXT], { cwd: basePath }, (err, stdout, stderr) => {
                try {
                    if (err && (<any>err).code === 'ENOENT') {
                        vscode.window.showInformationMessage(vscode.l10n.t('The "global" command is not available. Make sure it is on PATH'));
                        resolve(vscode.l10n.t('The "global" command is not available. Make sure it is on PATH'));
                        return;
                    }
                    if (err) {
                        vscode.window.showInformationMessage(vscode.l10n.t('Some error occured: {0}', err));
                        resolve(vscode.l10n.t('Some error occured: {0}', err));
                        return;
                    }
                    if (stderr) {
                        vscode.window.showInformationMessage(vscode.l10n.t('Some error occured: {0}', stderr));
                        resolve(vscode.l10n.t('Some error occured: {0}', stderr));
                        return;
                    }

                    resolve("");
                    return;
                } catch (e) {
                    vscode.window.showInformationMessage(vscode.l10n.t('Some error occured: {0}', e));
                    reject(vscode.l10n.t('Some error occured: {0}', e));
                    return;
                }
            });

        });
    }

	public static tagsAvailable(basePath: string): boolean {
		return fs.existsSync(path.join(basePath, 'GTAGS'));
	}
		
	public static checkGlobalAvailable(context: vscode.ExtensionContext): Promise<boolean> {

		return new Promise<boolean>((resolve, reject) => {

			// test
			cp.execFile('global', [ '--help' ], { cwd: vscode.workspace.rootPath }, (err, stdout, stderr) => {
				try {

					// no error
					if (!err) {
						return resolve(true);
					}
					
					// error ?
					if (err) {

						if ((<any>err).code !== 'ENOENT') {
							return resolve(true);
						}

						// should ask?
						const ask: boolean = context.globalState.get<boolean>("askforGlobalAvailable", true);
						if (!ask) {
							return resolve(false);
						}

						const moreInfo = <vscode.MessageItem>{
							title: vscode.l10n.t("More Info")
						};
						const dontShowAgain = <vscode.MessageItem>{
							title: vscode.l10n.t("Don't show again")
						};

						vscode.window.showInformationMessage(vscode.l10n.t('The "global" command is not available. Make sure it is on PATH'), moreInfo, dontShowAgain).then(option => {

							if (typeof option === "undefined") {
								return resolve(false);
							}

							if (option.title === vscode.l10n.t("More Info")) {
								vscode.env.openExternal(vscode.Uri.parse("https://github.com/alefragnani/vscode-language-pascal#code-navigation"));
								return resolve(false);
							}

							if (option.title === vscode.l10n.t("Don't show again")) {
								context.globalState.update("askforGlobalAvailable", false);
								return resolve(false);
							}

							return resolve(false);
						});
					}
				} catch (e) {
					reject(e);
				}
			});

		});
	}
}
