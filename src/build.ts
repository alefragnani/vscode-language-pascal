import * as vscode from 'vscode';
import fs = require('fs');
import cp = require('child_process');
import os = require('os');
import npath = require('path');

export class Builder {

    constructor(private _document: vscode.TextDocument, private _options?: vscode.FormattingOptions) {
        this._options = this._options || {
            insertSpaces: false,
            tabSize: 2
        };

        if (typeof this._options.insertSpaces === 'undefined') {
            this._options.insertSpaces = false;
            this._options.tabSize = 2;
        }

        if (typeof this._options.tabSize != 'number' || isNaN(this._options.tabSize)) {
            this._options.tabSize = 2;
        }

        this._options.tabSize = Math.max(0, 2);
    }

    public format(range: vscode.Range, engine: string, path: string, parameters: string, indent: number, wrapLineLength: number) {

        return new Promise((resolve, reject) => {
        
            // entire document - if not range is provided
            range = range || new vscode.Range(
                0, 0,
                this._document.lineCount,
                this._document.lineAt(this._document.lineCount - 1).range.end.character
            );

            let textToFormat = this._document.getText(range);
            let tempFile: string = npath.join(os.tmpdir(), 'tmp.tmp.pas');
            let command: string;
            let tempFileOut: string = npath.join(os.tmpdir(), 'tmp.tmp.out');
            let configFileParameters: string = '';

            fs.writeFileSync(tempFile, textToFormat);

            if (textToFormat) {

                try {
                    
                    // 
                    if (engine == 'ptop') {
                        if (parameters != '') {
                            configFileParameters = ' -c ' + parameters; 
                        }
                        
                        let indentConfig: string = '';
                        if (indent > 0) {
                            indentConfig = ' -i ' + indent
                        }
                        
                        let wrapLineLengthConfig: string = '';
                        if (wrapLineLength > 0) {
                            wrapLineLengthConfig = ' -l ' + wrapLineLength
                        }
                        
                        command = "\"" + path + "\" " + configFileParameters + indentConfig + wrapLineLengthConfig + ' \"$file\" \"$outfile\" ';
                        command = command.replace('$file', tempFile);
                        command = command.replace('$outfile', tempFileOut);   
                    } else { // jcf
                        if (parameters != '') {
                            configFileParameters = ' -config=' + parameters; 
                        }
                        command = "\"" + path + "\" " + configFileParameters + '  -y -F \"$file\" ';
                        command = command.replace('$file', tempFile);
                    }
                    
                    console.log(command);
                    cp.exec(command, function(error, stdout, stderr) {
                        console.log('stdout' + stdout);
                        console.log('error' + error);
                        console.log('stderr' + stderr);
                        if (error) {
                            reject(stdout.toString());
                        }
                        else {
                            let formattedXml: string = fs.readFileSync(tempFileOut, 'utf8');
                            resolve(formattedXml);;
                        }
                    });

                } catch (err) {
                    reject(err.toString());
                }

            }
            // the parser didn't return anything we can use, show an error message and return
            else {
                reject('no text to format');
            }
        });

    }

}