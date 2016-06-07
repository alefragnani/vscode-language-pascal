"use strict";
var vscode = require('vscode');
var fs = require('fs');
var cp = require('child_process');
var os = require('os');
var npath = require('path');
var Formatter = (function () {
    function Formatter(_document, _options) {
        this._document = _document;
        this._options = _options;
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
    Formatter.prototype.format = function (range, engine, path, parameters, indent, wrapLineLength) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // entire document - if not range is provided
            range = range || new vscode.Range(0, 0, _this._document.lineCount, _this._document.lineAt(_this._document.lineCount - 1).range.end.character);
            var textToFormat = _this._document.getText(range);
            var tempFile = npath.join(os.tmpdir(), 'tmp.tmp.pas');
            var command;
            var tempFileOut = npath.join(os.tmpdir(), 'tmp.tmp.out');
            var configFileParameters = '';
            fs.writeFileSync(tempFile, textToFormat);
            if (textToFormat) {
                try {
                    // 
                    if (engine == 'ptop') {
                        if (parameters != '') {
                            configFileParameters = ' -c ' + parameters;
                        }
                        var indentConfig = '';
                        if (indent > 0) {
                            indentConfig = ' -i ' + indent;
                        }
                        var wrapLineLengthConfig = '';
                        if (wrapLineLength > 0) {
                            wrapLineLengthConfig = ' -l ' + wrapLineLength;
                        }
                        command = "\"" + path + "\" " + configFileParameters + indentConfig + wrapLineLengthConfig + ' \"$file\" \"$outfile\" ';
                        command = command.replace('$file', tempFile);
                        command = command.replace('$outfile', tempFileOut);
                    }
                    else {
                        if (parameters != '') {
                            configFileParameters = ' -config=' + parameters;
                        }
                        command = "\"" + path + "\" " + configFileParameters + '  -y -F \"$file\" ';
                        command = command.replace('$file', tempFile);
                    }
                    console.log(command);
                    cp.exec(command, function (error, stdout, stderr) {
                        console.log('stdout' + stdout);
                        console.log('error' + error);
                        console.log('stderr' + stderr);
                        if (error) {
                            reject(stdout.toString());
                        }
                        else {
                            var formattedXml = fs.readFileSync(tempFileOut, 'utf8');
                            resolve(formattedXml);
                            ;
                        }
                    });
                }
                catch (err) {
                    reject(err.toString());
                }
            }
            else {
                reject('no text to format');
            }
        });
    };
    return Formatter;
}());
exports.Formatter = Formatter;
