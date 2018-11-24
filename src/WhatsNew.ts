'use strict';

import * as vscode from "vscode";
import fs = require('fs');
import path = require("path");
import { WhatsNewHTML } from "./WhatsNewHTML";
import { WhatsNewReplacements } from "./WhatsNewReplacements";

export class WhatsNew {

    private extensionNameLowercase: string;
    public extensionName: string;
    public installedVersion: string;
    public context: vscode.ExtensionContext;

    public replacements: WhatsNewReplacements; 
    
    constructor(extensionName: string, context: vscode.ExtensionContext) {
        this.extensionName = extensionName;
        this.extensionNameLowercase = extensionName.toLowerCase();
        this.context = context;
    }

    showPageInActivation() {
        const previousExtensionVersion = this.context.globalState.get<string>(`${this.extensionNameLowercase}.version`);

        // (atual)
        const extension = vscode.extensions.getExtension(`alefragnani.${this.extensionNameLowercase}`)!;
        const actualExtensionVersion = extension.packageJSON.version;
        console.log(`${this.extensionNameLowercase} Version: ${actualExtensionVersion}`);
        this.showPageIfVersionDiffers(actualExtensionVersion, previousExtensionVersion);
    }

    /**
     * showPage
     */
    showPage(currentVersion?: string) {
        if (currentVersion) {
            this.context.globalState.update(`${this.extensionNameLowercase}.version`, currentVersion);
        }

        // Create and show panel
        const panel = vscode.window.createWebviewPanel(`${this.extensionNameLowercase}.whatsNew`, 
            `What's New in ${this.extensionName}`, vscode.ViewColumn.One, { enableScripts: true });

        // // // And set its HTML content
        // panel.webview.html = getWebviewContent();

        // Get path to resource on disk
        const onDiskPath = vscode.Uri.file(path.join(this.context.extensionPath, 'ui', 'whats-new.html'));
        const catGifSrc = onDiskPath.with({ scheme: 'vscode-resource' });

        // Local path to main script run in the webview
        const scriptPathOnDisk = vscode.Uri.file(path.join(this.context.extensionPath, 'ui', 'main.css'));
        const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });        

        // Local path to main script run in the webview
        const logoPathOnDisk = vscode.Uri.file(path.join(this.context.extensionPath, 'images', `vscode-${this.extensionNameLowercase}-logo-readme.png`));
        const logoUri = logoPathOnDisk.with({ scheme: 'vscode-resource' });  
        
        panel.webview.html = this.getWebviewContentLocal(catGifSrc, scriptUri, logoUri);
    }

    showPageIfVersionDiffers(currentVersion: string, previousVersion: string) {
        if ((previousVersion === currentVersion)) {
            return;
        }

        this.showPage(currentVersion);
    }

    getWebviewContentLocal(uri: vscode.Uri, scriptUri: vscode.Uri, logoUri: vscode.Uri): string {

        // basic components (css)

        // logo

        // header message

        // changelog

        // 

        return WhatsNewHTML.WhatsNewHTML(uri.fsPath)
            .updateScript(scriptUri)
            .updateLogo(logoUri)
            .updateHeader(this.replacements.headerMessage)
            .updateChangeLog(this.replacements.changeLog)
            .updateSponsors(this.replacements.sponsors)
            .build();
            // .updateChangeLog(this.changeLog)
            // .updateSponsors(this.sponsors)

        // return fs.readFileSync(uri.fsPath).toString().replace("${scriptUri}", scriptUri.toString()).replace("${logoUri}", 
        //     logoUri.toString());
    }

    // replaceHeader(message: string): string {
    //     return "";
    // }

    // replaceChangeLog(type: string, description: string): string {
    //     return ""
    // }

    // replaceSponsors(): string {
    //     return ""
    // }
 }