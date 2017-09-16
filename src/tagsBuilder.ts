'use strict';

import cp = require('child_process');
import vscode = require('vscode');
import path = require('path');
import fs = require('fs');
var opener = require('opener');

export class TagsBuilder {

	public generateTags(rootPath: string, update: boolean): void {

		let command: string = update ? "global" : "gtags";
		let params: string = update ? "--update" : "";

		if (!fs.existsSync(path.join(rootPath, 'GTAGS'))) {
			command = "gtags";
			params = "";
		}

		let p = cp.execFile(command, [ params ], { cwd: rootPath }, (err, stdout, stderr) => {
			try {
				if (err && (<any>err).code === 'ENOENT') {
					vscode.window.showInformationMessage('The ' + command + ' command is not available. Make sure it is on PATH');
					return;
				}
				if (err) {
					vscode.window.showInformationMessage('Some error occured: ' + err);
					return;
				}
				if (stderr) {
					vscode.window.showInformationMessage('Some error occured: ' + stderr);
					return;
				}

				vscode.window.showInformationMessage('The tags where updated');
				return;
			} catch (e) {
				vscode.window.showInformationMessage('Some error occured: ' + e);
				return;
			}
		});
	}

    public generateTagsPromise(rootPath: string, update: boolean): Promise<string> {

        return new Promise<string>((resolve, reject) => {

            let command: string = update ? "global" : "gtags";
            let params: string = update ? "--update" : "";

            if (!TagsBuilder.tagsAvailable(path.join(rootPath, 'GTAGS'))) {
                command = "gtags";
                params = "";
            }

            let p = cp.execFile(command, [params], { cwd: rootPath }, (err, stdout, stderr) => {
                try {
                    if (err && (<any>err).code === 'ENOENT') {
                        vscode.window.showInformationMessage('The ' + command + ' command is not available. Make sure it is on PATH');
                        resolve('The ' + command + ' command is not available. Make sure it is on PATH');
                        return;
                    }
                    if (err) {
                        vscode.window.showInformationMessage('Some error occured: ' + err);
                        resolve('Some error occured: ' + err);
                        return;
                    }
                    if (stderr) {
                        vscode.window.showInformationMessage('Some error occured: ' + stderr);
                        resolve('Some error occured: ' + stderr);
                        return;
                    }

                    vscode.window.showInformationMessage('The tags where updated');
                    resolve("");
                    return;
                } catch (e) {
                    vscode.window.showInformationMessage('Some error occured: ' + e);
                    reject('Some error occured: ' + e);
                    return;
                }
            });

        });
    }
		

	public static tagsAvailable(rootPath: string): boolean {
		return fs.existsSync(path.join(rootPath, 'GTAGS'));
	}
		
	public static checkGlobalAvailable(context: vscode.ExtensionContext): Promise<boolean> {

		return new Promise<boolean>((resolve, reject) => {

			// test
			let p = cp.execFile('global', [ '--help' ], { cwd: vscode.workspace.rootPath }, (err, stdout, stderr) => {
				try {

					// no error
					if (!err) {
						return resolve(true);
					}
					
					// error ?
					if (err) {

						if ((<any>err).code != 'ENOENT') {
							return resolve(true);
						}

						// should ask?
						let ask: boolean = context.globalState.get<boolean>("askforGlobalAvailable", true);
						if (!ask) {
							return resolve(false);
						}

						let moreInfo = <vscode.MessageItem>{
							title: "More Info"
						};
						let dontShowAgain = <vscode.MessageItem>{
							title: "Don't show again"
						};

						vscode.window.showInformationMessage('The "global" command is not available. Make sure it is on PATH', moreInfo, dontShowAgain).then(option => {

							if (typeof option === "undefined") {
								return resolve(false);
							}

							if (option.title === "More Info") {
								opener("https://github.com/alefragnani/vscode-language-pascal#code-navigation");
								return resolve(false);
							}

							if (option.title === "Don't show again") {
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
