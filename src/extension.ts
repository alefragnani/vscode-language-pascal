// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as formatter from './formatter';
import fs = require('fs');
import path = require('path');
import cp = require('child_process');
var opener = require('opener');

// language providers
import { PascalDocumentSymbolProvider } from './documentSymbolProvider';
import { PascalDefinitionProvider } from './definitionProvider';
import { PascalReferenceProvider } from './referenceProvider';
import { TagsBuilder } from './tagsBuilder';
import { whatsNewUri, PageProvider } from "./pageProvider";
import { WhatsNew } from './WhatsNew';
import { WhatsNewReplacements } from "./WhatsNewReplacements";
import { WhatsNewPascal } from './WhatsNewPascal';

const documentSelector = [
    { language: 'pascal', scheme: 'file' },
    { language: 'pascal', scheme: 'untitled' }
];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    
    interface EngineParams {
        engine: string;
        enginePath: string;
        engineParameters: string;
        formatIndent: number;
        formatWrapLineLength: number;
    }

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    //console.log('Congratulations, your extension "pascal" is now active!');

    // language providers
    TagsBuilder.checkGlobalAvailable(context).then((value) => {
        if (value) {
            context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(documentSelector, new PascalDocumentSymbolProvider()));

            const hasNoWorkspace: boolean = !vscode.workspace.workspaceFolders;
            const isSingleWorkspace: boolean = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length === 1;
            const isMultirootWorkspace: boolean = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 1;

            let canRegisterOtherProviders: boolean =    false;

            if (hasNoWorkspace) {
                canRegisterOtherProviders = false;
            }
            if (isSingleWorkspace) {
                canRegisterOtherProviders = (vscode.workspace.getConfiguration("pascal", 
                    vscode.window.activeTextEditor.document.uri).get("codeNavigation", "workspace") === "workspace");
            } 
            if (isMultirootWorkspace) {
                canRegisterOtherProviders = true; 
            } 

            // does not register DEFINITION or REFERENCES if the user decides for "file based"
            if (canRegisterOtherProviders) {
                context.subscriptions.push(vscode.languages.registerDefinitionProvider(documentSelector, new PascalDefinitionProvider()));
                context.subscriptions.push(vscode.languages.registerReferenceProvider(documentSelector, new PascalReferenceProvider()));
            }
        }
    });

    let whatsNew: WhatsNew = new WhatsNewPascal(context);
    whatsNew.showPageInActivation();

    // // check version (previous)
    // const previousPascalVersion = context.globalState.get<string>("pascal.version");
    // // (atual)
    // const pascalExtension = vscode.extensions.getExtension("alefragnani.pascal")!;
    // const pascalVersion = pascalExtension.packageJSON.version;
    // console.log(`Pascal Version: ${pascalVersion}`);
    // showWhatsNewPage(pascalVersion, previousPascalVersion);


    let provider = new PageProvider(context);
    let registration = vscode.workspace.registerTextDocumentContentProvider('pascal', provider);
    vscode.commands.registerCommand('pascal.whatsNewPreviewHTML', () => {
		return vscode.commands.executeCommand('vscode.previewHtml', whatsNewUri, vscode.ViewColumn.Active, 'What\'s New in Pascal ').then((success) => {
		}, (reason) => {
			vscode.window.showErrorMessage(reason);
		});
    });

    // function showWhatsNewPage(currentVersion?: string, previousVersion?: string) {

    //     if ((previousVersion === currentVersion) && (currentVersion !== undefined)) {
    //         return;
    //     }

    //     if (currentVersion) {
    //         context.globalState.update("pascal.version", currentVersion);
    //     }


    //     // Create and show panel
    //     const panel = vscode.window.createWebviewPanel('pascal.whatsNew', "What's New", vscode.ViewColumn.One, { enableScripts: true });

    //     // // // And set its HTML content
    //     // panel.webview.html = getWebviewContent();

    //     // Get path to resource on disk
    //     const onDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'ui', 'whats-new.html'));
    //     const catGifSrc = onDiskPath.with({ scheme: 'vscode-resource' });

    //     // Local path to main script run in the webview
    //     const scriptPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'ui', 'main.css'));
    //     const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });        

    //     // Local path to main script run in the webview
    //     const logoPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'images', 'vscode-pascal-logo-readme.png'));
    //     const logoUri = logoPathOnDisk.with({ scheme: 'vscode-resource' });  
        
    //     panel.webview.html = getWebviewContentLocal(catGifSrc, scriptUri, logoUri);
    
    // }

    context.subscriptions.push(vscode.commands.registerCommand('pascal.whatsNew', () => whatsNew.showPage()));
    // context.subscriptions.push(vscode.commands.registerCommand('pascal.whatsNew', () => showWhatsNewPage()));
       

    // function getWebviewContent() {

    //     const logoPathOnDisk = vscode.Uri.file(path.join(context.extensionPath, 'images', 'vscode-pascal-logo-readme.png'));
    //     const logoUri = logoPathOnDisk.with({ scheme: 'vscode-resource' }); 

    //     return `<!DOCTYPE html>
    // <html lang="en">
    // <head>
    //     <meta charset="UTF-8">
    //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //     <title>Cat Coding</title>
    // </head>
    // <body>
    //     <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
    //     <img src="${logoUri}" width="300" />
    // </body>
    // </html>`;
    // }

    function getWebviewContentLocal(uri: vscode.Uri, scriptUri: vscode.Uri, logoUri: vscode.Uri): string {
        return fs.readFileSync(uri.fsPath).toString().replace("${scriptUri}", scriptUri.toString()).replace("${logoUri}", 
            logoUri.toString());
    }

    vscode.commands.registerCommand('pascal.generateTags', () => generateTags(false));
    vscode.commands.registerCommand('pascal.updateTags', () => generateTags(true));

    function generateTags(update: boolean) {

        if (!vscode.window.activeTextEditor) {
            vscode.window.showInformationMessage("Open a file first to generate tags");
            return;
        } 

        let tagBuilder: TagsBuilder = new TagsBuilder();
        let basePath: string = vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri).uri.fsPath;
        tagBuilder.generateTags(basePath, update, true);
    }

    vscode.commands.registerCommand('pascal.editFormatterParameters', () => {

        checkEngineDefined()
            .then((engineType) => {

                checkEngineParametersDefined(engineType.toString())
                    .then((engineParameters) => {

                        let engineParametersFile: string = engineParameters['engineParameters'];
                        if (engineParametersFile == '') {
                            var optionGenerate = <vscode.MessageItem>{
                                title: "Generate"
                            };
                            vscode.window.showErrorMessage('The \"pascal.formatter.engineParameters\" setting is not defined. Would you like to generate the default?', optionGenerate).then(option => {
                                // nothing selected
                                if (typeof option == 'undefined') {
                                    return;
                                }
                                if (option.title == "Generate") {
                                    engineParametersFile = generateDefaultEngineParameters(engineParameters['engine'],
                                        engineParameters['enginePath']);
                                    vscode.workspace.openTextDocument(engineParametersFile).then(doc => {
                                        vscode.window.showTextDocument(doc);
                                    });
                                } else {
                                    return;
                                }
                            });
                        } else {
                            vscode.workspace.openTextDocument(engineParametersFile).then(doc => {
                                vscode.window.showTextDocument(doc);
                            });
                        }
                    })
                    .catch((error) => {
                        vscode.window.showErrorMessage(error);
                    })
            })
            .catch((error) => {
                //reject(error);
                vscode.window.setStatusBarMessage('checkEngineDefined: ' + error, 5000);
            });

        function generateDefaultEngineParameters(engine: string, enginePath: string): string {

            let configFileName: string;

            if (engine == 'ptop') { // can be anyfilename.cfg
                configFileName = path.basename(enginePath, path.extname(enginePath)) + '.cfg';
                configFileName = path.join(path.dirname(enginePath), configFileName);
                
                let command: string = "\"" + enginePath + "\" -g " + configFileName;
                cp.exec(command);
            } else { // jcf -> must be JCFSettings.cfg
                configFileName = path.join(path.dirname(enginePath), 'JCFSettings.cfg');
                let jsonFile: string = fs.readFileSync(context.asAbsolutePath('jcfsettings.json'), 'UTF8');
                let xml = JSON.parse(jsonFile);
                
                console.log(xml.defaultConfig.join('\n'));
                fs.writeFileSync(configFileName, xml.defaultConfig.join('\n'));
            }

            return configFileName;
        }
    });


    // 
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(documentSelector, {
        provideDocumentFormattingEdits: (document, options) => {

            return new Promise((resolve, reject) => {

                checkEngineDefined()
                    .then((engineType) => {

                        checkEngineParametersDefined(engineType.toString())
                            .then((engineParameters) => {

                                let f: formatter.Formatter;
                                f = new formatter.Formatter(document, options);

                                let range: vscode.Range
                                range = new vscode.Range(
                                    0, 0,
                                    document.lineCount,
                                    document.lineAt(document.lineCount - 1).range.end.character
                                );

                                f.format(range, engineParameters['engine'], engineParameters['enginePath'], engineParameters['engineParameters'], engineParameters['formatIndent'], engineParameters['formatWrapLineLength'])
                                    .then((formattedXml) => {
                                        resolve([new vscode.TextEdit(range, formattedXml.toString())]);
                                    })
                                    .catch((error) => {
                                        console.log('format: ' + error);
                                        vscode.window.showErrorMessage('Error while formatting: ' + error);
                                    })
                            })
                            .catch((error) => {
                                //vscode.window.setStatusBarMessage('checkEngineParametersDefined: ' + error, 5000);
                                vscode.window.showErrorMessage(error);
                            })

                    })
                    .catch((error) => {
                        //reject(error);
                        vscode.window.setStatusBarMessage('checkEngineDefined: ' + error, 5000);
                    });
            });
        }
    }));

    context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider(documentSelector, {
        provideDocumentRangeFormattingEdits: (document, range, options) => {

            return new Promise((resolve, reject) => {

                checkEngineDefined()
                    .then((engineType) => {
                        
                        if (!engineSupportsRange(engineType.toString(), document, range)) {
                            reject('The selected engine \"' + engineType.toString() + '\" does not support selection.');
                            return;
                        }

                        checkEngineParametersDefined(engineType.toString())
                            .then((engineParameters) => {

                                let f: formatter.Formatter;
                                f = new formatter.Formatter(document, options);
                                f.format(range, engineParameters['engine'], engineParameters['enginePath'], engineParameters['engineParameters'], engineParameters['formatIndent'], engineParameters['formatWrapLineLength'])
                                    .then((formattedXml) => {
                                        resolve([new vscode.TextEdit(range, formattedXml.toString())]);
                                    })
                                    .catch((error) => {
                                        console.log('format: ' + error);
                                        vscode.window.showErrorMessage('Error while formatting: ' + error);
                                    })
                            })
                            .catch((error) => {
                                //vscode.window.setStatusBarMessage('checkEngineParametersDefined: ' + error, 5000);
                                vscode.window.showErrorMessage(error);
                            })

                    })
                    .catch((error) => {
                        //reject(error);
                        vscode.window.setStatusBarMessage('checkEngineDefined: ' + error, 5000);
                    });
            });
        }
    }));



    //
    function checkEngineDefined() {

        return new Promise((resolve, reject) => {

            let engineType: string = vscode.workspace.getConfiguration('pascal').get('formatter.engine', '');
            if (engineType == '') {
                var optionJCF = <vscode.MessageItem>{
                    title: "Jedi Code Format"
                };
                var optionPTOP = <vscode.MessageItem>{
                    title: "FreePascal PtoP"
                };
                vscode.window.showErrorMessage('The \"pascal.formatter.engine\" setting is not defined. Do you want to download some formatter tool first?', optionJCF, optionPTOP).then(option => {
                    // nothing selected
                    if (typeof option == 'undefined') {
                        reject('undefined');
                        return;
                    }

                    switch (option.title) {
                        case optionJCF.title:
                            opener('http://jedicodeformat.sourceforge.net/');
                            break;

                        case optionPTOP.title:
                            opener('http://www.freepascal.org/tools/ptop.var');
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



    function checkEngineParametersDefined(engine: string) {

        return new Promise((resolve, reject) => {

            let enginePath: string = vscode.workspace.getConfiguration('pascal').get('formatter.enginePath', '');
            if (enginePath == '') {
                reject('The \"pascal.formatter.enginePath\" setting is not defined. Please configure.');
                return;
            }

            let engineParameters: string = vscode.workspace.getConfiguration('pascal').get('formatter.engineParameters', '');

            let formatIndent: number = vscode.workspace.getConfiguration('pascal').get('format.indent', 0);
            let formatWrapLineLength: number = vscode.workspace.getConfiguration('pascal').get('format.wrapLineLength', 0);

            resolve({
                'engine': engine,
                'enginePath': enginePath,
                'engineParameters': engineParameters,
                'formatIndent': formatIndent,
                'formatWrapLineLength': formatWrapLineLength
            })
        });
    }
    
    function engineSupportsRange(engine:string, document: vscode.TextDocument, range: vscode.Range): boolean {
        
        if (engine == 'ptop') {
            return true;
        } else { // jcf
            return (range.start.character == 0) && 
                   (range.start.line == 0) && 
                   (range.end.line == document.lineCount - 1) &&
                   (range.end.character == document.lineAt(document.lineCount - 1).range.end.character);               
        }
    }
}