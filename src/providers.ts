/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { languages, window, workspace } from "vscode";
import { Container } from "./container";
import { PascalDefinitionProvider } from "./providers/definitionProvider";
import { PascalDocumentSymbolProvider } from "./providers/documentSymbolProvider";
import { PascalReferenceProvider } from "./providers/referenceProvider";
import { TagsBuilder } from "./providers/tagsBuilder";
import { isVirtualWorkspace } from "./remote";

const documentSelector = [
    { language: 'pascal', scheme: 'file' },
    { language: 'pascal', scheme: 'untitled' }
];

export function registerProviders() {
    
    if (!workspace.isTrusted || isVirtualWorkspace) {
        return;
    }

    // language providers (requires workspace trust)
    TagsBuilder.checkGlobalAvailable(Container.context).then((value) => {
        if (value) {
            Container.context.subscriptions.push(languages.registerDocumentSymbolProvider(documentSelector, new PascalDocumentSymbolProvider()));
            
            const hasNoWorkspace = !workspace.workspaceFolders;
            const isSingleWorkspace: boolean = workspace.workspaceFolders && workspace.workspaceFolders.length === 1;
            const isMultirootWorkspace: boolean = workspace.workspaceFolders && workspace.workspaceFolders.length > 1;
            
            let canRegisterOtherProviders =    false;
            
            if (hasNoWorkspace) {
                canRegisterOtherProviders = false;
            }
            if (isSingleWorkspace) {
                canRegisterOtherProviders = (workspace.getConfiguration("pascal", 
                window.activeTextEditor.document.uri).get("codeNavigation", "workspace") === "workspace");
            } 
            if (isMultirootWorkspace) {
                canRegisterOtherProviders = true; 
            } 
            
            // does not register DEFINITION or REFERENCES if the user decides for "file based"
            if (canRegisterOtherProviders) {
                Container.context.subscriptions.push(languages.registerDefinitionProvider(documentSelector, new PascalDefinitionProvider()));
                Container.context.subscriptions.push(languages.registerReferenceProvider(documentSelector, new PascalReferenceProvider()));
            }
        }
    });
}
