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

export class PascalReferenceProvider extends AbstractProvider implements vscode.ReferenceProvider {

	private parseReferenceLocation(output: string, filename: string): vscode.Location[] {

		const items: vscode.Location[] = new Array<vscode.Location>();
		output.split(/\r?\n/)
			.forEach(function (value, index, array) {

				if (value !== null && value !== "") {

					const values = value.split(/ +/).slice(1);

					// Create           2583 DelphiAST.pas      Result := FStack.Peek.AddChild(TSyntaxNode.Create(Typ));
					const line = parseInt(values.shift()) - 1;

					let filePath: string;
					const rest: string = values.join(' ');
					const idxProc = rest.match(/(\w|\s)+.pas\s+/gi);

					filePath = rest.substr(0, rest.indexOf(idxProc[ 0 ]) + idxProc[ 0 ].length - 1)
					filePath = path.join(AbstractProvider.basePathForFilename(filename), filePath);

					const definition = new vscode.Location(
						vscode.Uri.file(filePath), new vscode.Position(line, 0)
					);

					items.push(definition);
				}

			});

		return items;
	}

	private referenceLocations(word: string, filename: string): Promise<vscode.Location[]> {

		return new Promise<vscode.Location[]>((resolve, reject) => {

			this.generateTagsIfNeeded(filename)
				.then((value: boolean) => {
					if (value) {
						cp.execFile('global', [ '-rx', word ], { cwd: AbstractProvider.basePathForFilename(filename) }, (err, stdout, stderr) => {
							try {
								if (err && (<any>err).code === 'ENOENT') {
									console.log('The "global" command is not available. Make sure it is on PATH');
								}
								if (err) return resolve(null);
								const result = stdout.toString();
								// console.log(result);
								const locs = <vscode.Location[]>this.parseReferenceLocation(result, filename);
								return resolve(locs);
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

	public provideReferences(document: vscode.TextDocument, position: vscode.Position, context: vscode.ReferenceContext, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Location[]> {
		const fileName: string = document.fileName;
		const word = document.getText(document.getWordRangeAtPosition(position)).split(/\r?\n/)[0];
		return this.referenceLocations(word, fileName).then(locs => {
			return locs;
		});
	}
}
