'use strict';

import vscode = require('vscode');
import cp = require('child_process');
import path = require('path');
import fs = require('fs');

export function parseDocumentSymbolLocation(output: string): vscode.SymbolInformation[] {

	var items: vscode.SymbolInformation[] = new Array<vscode.SymbolInformation>();
	output.split(/\r?\n/)
		.forEach(function (value, index, array) {

			if (value != null && value != "") {

				let values = value.split(/ +/);

				let className: string = '';
				let methodName: string = '';
				let tag = values.shift();
				let line = parseInt(values.shift()) - 1;
				let filePath = values.shift();
				let kindStr = values.shift();
				let kind: vscode.SymbolKind;

				if (tag.indexOf('.') > 0) {
					className = tag.substr(1, tag.indexOf('.') - 1)
					methodName = tag.substring(tag.indexOf('.') + 1);
				} else {
					methodName = tag;
					kind = vscode.SymbolKind.Interface;
				}
				if ((kindStr == 'constructor') || (kindStr == 'destructor')) {
					kind = vscode.SymbolKind.Constructor;
				} else {
					kind = kind || vscode.SymbolKind.Method;
				}
				let rest = values.join(' ');

				let symbolInfo = new vscode.SymbolInformation(
					methodName, kind, new vscode.Range(line, 0, line, 0), undefined, className
				);

				items.push(symbolInfo);
			}

		});

	return items;
}

export function documentSymbolLocations(filename: string): Promise<vscode.SymbolInformation[]> {
	
	return new Promise<vscode.SymbolInformation[]>((resolve, reject) => {

		// discover
		let p = cp.execFile('global', ['-f', filename], { cwd: vscode.workspace.rootPath }, (err, stdout, stderr) => {
			try {
				if (err && (<any>err).code === 'ENOENT') {
					console.log('The "global" command is not available. Make sure it is on PATH');
				}
				if (err) return resolve(null);
				let result = stdout.toString();
				//console.log(result);
				let decls = <vscode.SymbolInformation[]>parseDocumentSymbolLocation(result);
				return resolve(decls);
			} catch (e) {
				reject(e);
			}
		});
	});
}

export class PascalDocumentSymbolProvider implements vscode.DocumentSymbolProvider {

	public provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): Thenable<vscode.SymbolInformation[]> {
		
		let fileName: string = document.fileName;
		return documentSymbolLocations(fileName).then(decls => {
			return decls;
		});
	}
}
