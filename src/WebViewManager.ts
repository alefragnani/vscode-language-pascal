import { ContentProvider } from "./whats-new/ContentProvider";

export interface WebViewManager {
    registerContentProvider(extensionName: string, contentProvider: ContentProvider): WebViewManager;
    showPage();
    getWebviewContentLocal(path: string): string;
}

export interface WebViewWhatsNewManager extends WebViewManager{
    showPageInActivation();
    showPageIfVersionDiffers(currentVersion: string, previousVersion: string);
}