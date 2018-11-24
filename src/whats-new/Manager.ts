import * as vscode from "vscode";
import path = require("path");
import { WhatsNewPageBuilder } from "./PageBuilder";
import { ContentProvider } from "./ContentProvider";

export class WhatsNewManager {

    private extensionNameLowercase: string;
    private extensionName: string;
    private context: vscode.ExtensionContext;
    private contentProvider: ContentProvider;
    
    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }
    
    registerContentProvider(extensionName: string, contentProvider: ContentProvider): WhatsNewManager {
        this.extensionName = extensionName
        this.extensionNameLowercase = extensionName.toLowerCase();
        this.contentProvider = contentProvider;

        return this;
    }

    showPageInActivation() {
        const previousExtensionVersion = this.context.globalState.get<string>(`${this.extensionNameLowercase}.version`);

        const extension = vscode.extensions.getExtension(`alefragnani.${this.extensionNameLowercase}`)!;
        const actualExtensionVersion = extension.packageJSON.version;
        console.log(`${this.extensionNameLowercase} Version: ${actualExtensionVersion}`);
        this.showPageIfVersionDiffers(actualExtensionVersion, previousExtensionVersion);
    }

    /**
     * showPage
     */
    showPage() {

        // Create and show panel
        const panel = vscode.window.createWebviewPanel(`${this.extensionNameLowercase}.whatsNew`, 
            `What's New in ${this.extensionName}`, vscode.ViewColumn.One, { enableScripts: true });

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

        if (currentVersion) {
            this.context.globalState.update(`${this.extensionNameLowercase}.version`, currentVersion);
        }

        this.showPage();
    }

    getWebviewContentLocal(uri: vscode.Uri, scriptUri: vscode.Uri, logoUri: vscode.Uri): string {
        return WhatsNewPageBuilder.newBuilder(uri.fsPath)
            .updateScript(scriptUri)
            .updateLogo(logoUri)
            .updateHeader(this.contentProvider.provideHeader())
            .updateChangeLog(this.contentProvider.provideChangeLog())
            .updateSponsors(this.contentProvider.provideSponsors())
            .build();
    }
 }