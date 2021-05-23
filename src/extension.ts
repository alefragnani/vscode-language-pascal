/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

// language providers
import { PascalDocumentSymbolProvider } from './providers/documentSymbolProvider';
import { PascalDefinitionProvider } from './providers/definitionProvider';
import { PascalReferenceProvider } from './providers/referenceProvider';
import { TagsBuilder } from './providers/tagsBuilder';
import { Container } from './container';
import { registerWhatsNew } from './whats-new/commands';

const documentSelector = [
    { language: 'pascal', scheme: 'file' },
    { language: 'pascal', scheme: 'untitled' }
];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    Container.context = context;
    
    registerWhatsNew();

    if (!vscode.workspace.isTrusted) {
        return;
    }    
    
    // language providers (requires workspace trust)
    TagsBuilder.checkGlobalAvailable(context).then((value) => {
        if (value) {
            context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(documentSelector, new PascalDocumentSymbolProvider()));
            
            const hasNoWorkspace = !vscode.workspace.workspaceFolders;
            const isSingleWorkspace: boolean = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length === 1;
            const isMultirootWorkspace: boolean = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 1;
            
            let canRegisterOtherProviders =    false;
            
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

    vscode.commands.registerCommand('pascal.generateTags', () => generateTags(false));
    vscode.commands.registerCommand('pascal.updateTags', () => generateTags(true));

    function generateTags(update: boolean) {

        if (!vscode.window.activeTextEditor) {
            vscode.window.showInformationMessage("Open a file first to generate tags");
            return;
        } 

        const tagBuilder: TagsBuilder = new TagsBuilder();
        const basePath: string = vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri).uri.fsPath;
        tagBuilder.generateTags(basePath, update, true);
    }

}