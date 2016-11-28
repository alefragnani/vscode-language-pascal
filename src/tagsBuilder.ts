'use strict';

import cp = require('child_process');
import vscode = require('vscode');
import path = require('path');
import fs = require('fs');

export class TagsBuilder {

	public generateTags(rootPath: string, update: boolean): void {

        let command: string = update ? "global" : "gtags";
        let params: string = update ? "--update" : "";

		let p = cp.execFile(command, [params], { cwd: rootPath }, (err, stdout, stderr) => {
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
}
