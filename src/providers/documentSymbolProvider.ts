/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

'use strict';

import vscode = require('vscode');
import cp = require('child_process');
import path = require('path');
import fs = require('fs');
import { AbstractProvider } from "./abstractProvider";

export class PascalDocumentSymbolProvider extends AbstractProvider implements vscode.DocumentSymbolProvider {

	private parseDocumentSymbolLocation(output: string): vscode.SymbolInformation[] {

		const items: vscode.SymbolInformation[] = new Array<vscode.SymbolInformation>();
		output.split(/\r?\n/)
			.forEach(function (value, index, array) {

				if (value !== null && value !== "") {

					const values = value.split(/ +/);

					let className = '';
					let methodName = '';
					const tag = values.shift();
					const line = parseInt(values.shift()) - 1;
					const kindStr = values.shift();
					let kind: vscode.SymbolKind;

					if (tag.indexOf('.') > 0) {
						className = tag.substr(1, tag.indexOf('.') - 1)
						methodName = tag.substring(tag.indexOf('.') + 1);
					} else {
						methodName = tag;
						kind = vscode.SymbolKind.Interface;
					}
					if ((kindStr === 'constructor') || (kindStr === 'destructor')) {
						kind = vscode.SymbolKind.Constructor;
					} else {
						kind = kind || vscode.SymbolKind.Method;
					}

					const symbolInfo = new vscode.SymbolInformation(
						methodName, kind, new vscode.Range(line, 0, line, 0), undefined, className
					);

					items.push(symbolInfo);
				}

			});

		return items;
	}

	private documentSymbolLocations(filename: string): Promise<vscode.SymbolInformation[]> {
		
		return new Promise<vscode.SymbolInformation[]>((resolve, reject) => {
	
			this.generateTagsIfNeeded(filename)
			.then((value: boolean) => {
				if (value) {
					// discover
					cp.execFile('global', ['-f', filename], { cwd: AbstractProvider.basePathForFilename(filename) }, (err, stdout, stderr) => {
						try {
							if (err && (<any>err).code === 'ENOENT') {
								console.log('The "global" command is not available. Make sure it is on PATH');
							}
							if (err) return resolve(null);
							const result = stdout.toString();
							const decls = <vscode.SymbolInformation[]>this.parseDocumentSymbolLocation(result);
							return resolve(decls);
						} catch (e) {
							reject(e);
						}
					});
				} else {
					return resolve (null);
				}
			});
		});
	}

	public provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): Thenable<vscode.SymbolInformation[]> {

		let fileName: string;

		// dirty for local
		if ((vscode.workspace.getConfiguration("pascal", null).get("codeNavigation", "file")) && document.isDirty) {
			const range: vscode.Range = new vscode.Range(
				0, 0,
				document.lineCount,
				document.lineAt(document.lineCount - 1).range.end.character
			);

			const textToFormat = document.getText(range);
			const tempFile: string = path.join(vscode.workspace.rootPath, '.vscode/GTEMP.pas');

			if (!fs.existsSync(path.join(vscode.workspace.rootPath, '.vscode'))) {
				fs.mkdirSync(path.join(vscode.workspace.rootPath, '.vscode'));
			}
			fs.writeFileSync(tempFile, textToFormat);
			fileName = tempFile;
		} else {
			fileName = document.fileName;
		}

		return this.documentSymbolLocations(fileName).then(decls => {
			return decls;
		});
	}
}
