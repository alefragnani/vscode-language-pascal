// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as builder from './build';
import fs = require('fs');
import path = require('path');
import cp = require('child_process');
var opener = require('opener');
var iRiteChannel = vscode.window.createOutputChannel('iRite Information');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    
    interface EngineParams {
        engine: string;
        enginePath: string;
    }

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "iRite" is now active!');

    var optionRev = <vscode.MessageItem>{
                    title: "Get Revolution"
                };
    vscode.window.showInformationMessage('Revolution is required, would you like to download it?', optionRev).then(option => {
                    if (typeof option == 'undefined') {
                        return;
                    }
                    switch (option.title) {
                        case optionRev.title:
                            opener('https://www.ricelake.com/en-us/products/product-details/revolution-scale-software#/information');
                            break;
                        default:
                            break;
                    }
                    });

    iRiteChannel.show();
    
    vscode.commands.registerCommand('irite.build', () => {
    checkEngineDefined()
        .then((engineType) => {
            checkEnginePathDefined(engineType.toString())
                .then((engineParameters) => {
                    //got engine path and compiler from config, now init active window and push to iRiteProcessor
                    //iRiteProcessor takes argument of desired .src file path
                    let enginePath: string = vscode.workspace.getConfiguration('irite').get('build.enginePath', '');
                    let compilerPath: string = vscode.workspace.getConfiguration('irite').get('build.compilerPath', '');
                    let textEditor = vscode.window.activeTextEditor;
                    iRiteChannel.append("*************************************\n" + "*************************************\n" + "iRite Building: " + textEditor.document.fileName + "\n");
                    let filepath = textEditor.document.fileName;
                    var path = enginePath;

                    cp.execFile(path, [filepath, compilerPath, 'build'], function(error, data, stderr) { 
                        if (stderr != null){             
                        console.log(error);
                        console.log(stderr);
                        }   
                        iRiteChannel.append(data);   
                    });       
                 })
                .catch((error) => {
                    vscode.window.showErrorMessage(error);
                })
        })
        .catch((error) => {
            vscode.window.setStatusBarMessage('checkEngineDefined: ' + error, 5000);
        });
    });

    vscode.commands.registerCommand('irite.deploy', () => {
    checkEngineDefined()
        .then((engineType) => {
            checkEnginePathDefined(engineType.toString())
                .then((engineParameters) => {
                    //got engine path and compiler from config, now init active window and push to iRiteProcessor
                    //iRiteProcessor takes argument of desired .src file path
                    let enginePath: string = vscode.workspace.getConfiguration('irite').get('build.enginePath', '');
                    let compilerPath: string = vscode.workspace.getConfiguration('irite').get('build.compilerPath', '');
                    let textEditor = vscode.window.activeTextEditor;
                    iRiteChannel.append("*************************************\n" + "*************************************\n" + "iRite Deploying: " + textEditor.document.fileName + "\n");
                    let filepath = textEditor.document.fileName;
                    var path = enginePath;

                    cp.execFile(path, [filepath, compilerPath, 'deploy'], function(error, data, stderr) { 
                        if (stderr != null){             
                        console.log(error);
                        console.log(stderr);
                        }   
                        iRiteChannel.append(data);   
                    });
                             
                 })
                .catch((error) => {
                    vscode.window.showErrorMessage(error);
                })
        })
        .catch((error) => {
            vscode.window.setStatusBarMessage('checkEngineDefined: ' + error, 5000);
        });
    });

    function checkEngineDefined() {

        return new Promise((resolve, reject) => {
            let engineType: string = vscode.workspace.getConfiguration('irite').get('build.engine', '');
            if (engineType == '') {
                var optionRev = <vscode.MessageItem>{
                    title: "revolution"
                };
                var optionTest = <vscode.MessageItem>{
                    title: "Test"
                };
                vscode.window.showErrorMessage('The \"irite.build.engine\" setting is not defined. Do you want to download Revolution?', optionRev, optionTest).then(option => {
                    // nothing selected
                    if (typeof option == 'undefined') {
                        reject('undefined');
                        return;
                    }
                    switch (option.title) {
                        case optionRev.title:
                            opener('https://www.ricelake.com/en-us/products/product-details/revolution-scale-software#/information');
                            break;
                        case optionTest.title:
                            opener('http://www.ricelake.com');
                            break;
                        default:
                            break;
                    }
                    
                    reject('hyperlink');
                });
            } else {
                resolve(engineType);
            }
        });
    }

    function checkEnginePathDefined(engine: string) {

        return new Promise((resolve, reject) => {

            let enginePath: string = vscode.workspace.getConfiguration('irite').get('build.enginePath', '');
            if (enginePath == '') {
                reject('The \"irite.build.enginePath\" setting is not defined. Please configure.');
                return;
            }
            resolve(enginePath)
        });
    }
}