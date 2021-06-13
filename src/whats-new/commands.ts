/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { commands } from "vscode";
import { Container } from "../container";
import { WhatsNewManager } from "../../vscode-whats-new/src/Manager";
import { PascalSocialMediaProvider, PascalContentProvider } from "./contentProvider";

export function registerWhatsNew() {
    const provider = new PascalContentProvider();
    const viewer = new WhatsNewManager(Container.context)
        .registerContentProvider("alefragnani", "pascal", provider)
        .registerSocialMediaProvider(new PascalSocialMediaProvider());
    viewer.showPageInActivation();
    Container.context.subscriptions.push(commands.registerCommand('pascal.whatsNew', () => viewer.showPage()));
    Container.context.subscriptions.push(commands.registerCommand('_pascal.whatsNewContextMenu', () => viewer.showPage()));
}
