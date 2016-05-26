"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var formatter = require('./formatter');
var fs = require('fs');
var path = require('path');
var cp = require('child_process');
//var opener = require('opener');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "iRite" is now active!');
    vscode.commands.registerCommand('irite.editFormatterParameters', function () {
        checkEngineDefined()
            .then(function (engineType) {
            checkEngineParametersDefined(engineType.toString())
                .then(function (engineParameters) {
                var engineParametersFile = engineParameters['engineParameters'];
                if (engineParametersFile == '') {
                    var optionGenerate = {
                        title: "Generate"
                    };
                    vscode.window.showErrorMessage('The \"irite.formatter.engineParameters\" setting is not defined. Would you like to generate the default?', optionGenerate).then(function (option) {
                        // nothing selected
                        if (typeof option == 'undefined') {
                            return;
                        }
                        if (option.title == "Generate") {
                            engineParametersFile = generateDefaultEngineParameters(engineParameters['engine'], engineParameters['enginePath']);
                            vscode.workspace.openTextDocument(engineParametersFile).then(function (doc) {
                                vscode.window.showTextDocument(doc);
                            });
                        }
                        else {
                            return;
                        }
                    });
                }
                else {
                    vscode.workspace.openTextDocument(engineParametersFile).then(function (doc) {
                        vscode.window.showTextDocument(doc);
                    });
                }
            })
                .catch(function (error) {
                vscode.window.showErrorMessage(error);
            });
        })
            .catch(function (error) {
            //reject(error);
            vscode.window.setStatusBarMessage('checkEngineDefined: ' + error, 5000);
        });
        function generateDefaultEngineParameters(engine, enginePath) {
            var configFileName;
            if (engine == 'ptop') {
                configFileName = path.basename(enginePath, path.extname(enginePath)) + '.cfg';
                configFileName = path.join(path.dirname(enginePath), configFileName);
                var command = "\"" + enginePath + "\" -g " + configFileName;
                cp.exec(command);
            }
            else {
                configFileName = path.join(path.dirname(enginePath), 'JCFSettings.cfg');
                var jsonFile = fs.readFileSync(context.asAbsolutePath('jcfsettings.json'), 'UTF8');
                var xml = JSON.parse(jsonFile);
                console.log(xml.defaultConfig.join('\n'));
                fs.writeFileSync(configFileName, xml.defaultConfig.join('\n'));
            }
            return configFileName;
        }
    });
    // 
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('irite', {
        provideDocumentFormattingEdits: function (document, options) {
            return new Promise(function (resolve, reject) {
                checkEngineDefined()
                    .then(function (engineType) {
                    checkEngineParametersDefined(engineType.toString())
                        .then(function (engineParameters) {
                        var f;
                        f = new formatter.Formatter(document, options);
                        var range;
                        range = new vscode.Range(0, 0, document.lineCount, document.lineAt(document.lineCount - 1).range.end.character);
                        f.format(range, engineParameters['engine'], engineParameters['enginePath'], engineParameters['engineParameters'], engineParameters['formatIndent'], engineParameters['formatWrapLineLength'])
                            .then(function (formattedXml) {
                            resolve([new vscode.TextEdit(range, formattedXml.toString())]);
                        })
                            .catch(function (error) {
                            console.log('format: ' + error);
                            vscode.window.showErrorMessage('Error while formatting: ' + error);
                        });
                    })
                        .catch(function (error) {
                        //vscode.window.setStatusBarMessage('checkEngineParametersDefined: ' + error, 5000);
                        vscode.window.showErrorMessage(error);
                    });
                })
                    .catch(function (error) {
                    //reject(error);
                    vscode.window.setStatusBarMessage('checkEngineDefined: ' + error, 5000);
                });
            });
        }
    }));
    context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider('irite', {
        provideDocumentRangeFormattingEdits: function (document, range, options) {
            return new Promise(function (resolve, reject) {
                checkEngineDefined()
                    .then(function (engineType) {
                    if (!engineSupportsRange(engineType.toString(), document, range)) {
                        reject('The selected engine \"' + engineType.toString() + '\" does not support selection.');
                        return;
                    }
                    checkEngineParametersDefined(engineType.toString())
                        .then(function (engineParameters) {
                        var f;
                        f = new formatter.Formatter(document, options);
                        f.format(range, engineParameters['engine'], engineParameters['enginePath'], engineParameters['engineParameters'], engineParameters['formatIndent'], engineParameters['formatWrapLineLength'])
                            .then(function (formattedXml) {
                            resolve([new vscode.TextEdit(range, formattedXml.toString())]);
                        })
                            .catch(function (error) {
                            console.log('format: ' + error);
                            vscode.window.showErrorMessage('Error while formatting: ' + error);
                        });
                    })
                        .catch(function (error) {
                        //vscode.window.setStatusBarMessage('checkEngineParametersDefined: ' + error, 5000);
                        vscode.window.showErrorMessage(error);
                    });
                })
                    .catch(function (error) {
                    //reject(error);
                    vscode.window.setStatusBarMessage('checkEngineDefined: ' + error, 5000);
                });
            });
        }
    }));
    //
    function checkEngineDefined() {
        return new Promise(function (resolve, reject) {
            var engineType = vscode.workspace.getConfiguration('irite').get('formatter.engine', '');
            if (engineType == '') {
                var optionJCF = {
                    title: "Jedi Code Format"
                };
                var optionPTOP = {
                    title: "Freeirite PtoP"
                };
                vscode.window.showErrorMessage('The \"irite.formatter.engine\" setting is not defined. Do you want to download some formatter tool first?', optionJCF, optionPTOP).then(function (option) {
                    // nothing selected
                    if (typeof option == 'undefined') {
                        reject('undefined');
                        return;
                    }
                    /*
                    switch (option.title) {
                        case optionJCF.title:
                            opener('http://jedicodeformat.sourceforge.net/');
                            break;
                        case optionPTOP.title:
                            opener('http://www.freeirite.org/tools/ptop.var');
                            break;
                        default:
                            break;
                    }
                    */
                    reject('hyperlink');
                });
            }
            else {
                resolve(engineType);
            }
        });
    }
    function checkEngineParametersDefined(engine) {
        return new Promise(function (resolve, reject) {
            var enginePath = vscode.workspace.getConfiguration('irite').get('formatter.enginePath', '');
            if (enginePath == '') {
                reject('The \"irite.formatter.enginePath\" setting is not defined. Please configure.');
                return;
            }
            var engineParameters = vscode.workspace.getConfiguration('irite').get('formatter.engineParameters', '');
            var formatIndent = vscode.workspace.getConfiguration('irite').get('format.indent', 0);
            var formatWrapLineLength = vscode.workspace.getConfiguration('irite').get('format.wrapLineLength', 0);
            resolve({
                'engine': engine,
                'enginePath': enginePath,
                'engineParameters': engineParameters,
                'formatIndent': formatIndent,
                'formatWrapLineLength': formatWrapLineLength
            });
        });
    }
    function engineSupportsRange(engine, document, range) {
        if (engine == 'ptop') {
            return true;
        }
        else {
            return (range.start.character == 0) &&
                (range.start.line == 0) &&
                (range.end.line == document.lineCount - 1) &&
                (range.end.character == document.lineAt(document.lineCount - 1).range.end.character);
        }
    }
}
exports.activate = activate;
