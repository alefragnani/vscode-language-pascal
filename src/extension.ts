/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import fs = require('fs');
import path = require('path');
import cp = require('child_process');

// language providers
import { PascalDocumentSymbolProvider } from './documentSymbolProvider';
import { PascalDefinitionProvider } from './definitionProvider';
import { PascalReferenceProvider } from './referenceProvider';
import { TagsBuilder } from './tagsBuilder';
import { WhatsNewManager } from '../vscode-whats-new/src/Manager';
import { WhatsNewPascalContentProvider } from './whats-new/PascalContentProvider';

const documentSelector = [
    { language: 'pascal', scheme: 'file' },
    { language: 'pascal', scheme: 'untitled' }
];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    
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

    let provider = new WhatsNewPascalContentProvider();
    let viewer = new WhatsNewManager(context).registerContentProvider("pascal", provider);
    viewer.showPageInActivation();
    context.subscriptions.push(vscode.commands.registerCommand('pascal.whatsNew', () => viewer.showPage()));

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

}