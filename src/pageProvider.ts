'use strict';

import * as vscode from 'vscode';

export const whatsNewUri = vscode.Uri.parse('pascal://authority/whatsnew');
export class PageProvider implements vscode.TextDocumentContentProvider {

  constructor (public context: vscode.ExtensionContext) {

  }

  private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

  async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
    const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(
        this.context.asAbsolutePath('/ui/whats-new.html')));
    let text = doc.getText().replace(/{{root}}/g, vscode.Uri.file(this.context.asAbsolutePath('.')).toString());
    return text;
  }

  get onDidChange(): vscode.Event<vscode.Uri> {
    return this._onDidChange.event;
  }

  public update(uri: vscode.Uri) {
    this._onDidChange.fire(uri);
  }
}