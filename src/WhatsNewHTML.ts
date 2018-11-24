'use strict';

import { Uri } from "vscode";
import * as fs from "fs";
import { ChangeLogItem, ChangeLogKind, Sponsor } from "./WhatsNewReplacements";

export class WhatsNewHTML {

    private htmlFile: string;

    private getBadgeFromChangeLogKind(kind: ChangeLogKind): string {
        switch (kind) {
            case ChangeLogKind.NEW:
                return "added";
        
            case ChangeLogKind.CHANGED:
                return "changed";
            
            case ChangeLogKind.FIXED:
                return "fixed";
        
            default:
                break;
        }
    }

    constructor(htmlFile: string) {
        this.htmlFile = fs.readFileSync(htmlFile).toString();
    }

    updateScript(scriptUri: Uri): WhatsNewHTML {
        this.htmlFile = this.htmlFile.replace("${scriptUri}", scriptUri.toString());
        return this;
    }

    updateLogo(logoUri: Uri): WhatsNewHTML {
        this.htmlFile = this.htmlFile.replace("${logoUri}", logoUri.toString());
        return this;
    }

    updateHeader(headerMessage: string): WhatsNewHTML {
        this.htmlFile = this.htmlFile.replace("${headerMessage}", headerMessage);
        return this;
    }

    updateChangeLog(changeLog: ChangeLogItem[]): WhatsNewHTML {
        let changeLogString: string = "";

        for (const cl of changeLog) {
            const badge: string = this.getBadgeFromChangeLogKind(cl.kind);
            changeLogString = changeLogString.concat(
                `<li><span class="changelog__badge changelog__badge--${badge}">${cl.kind}</span>
                    ${cl.message}
                </li>`
            )           
        }
        this.htmlFile = this.htmlFile.replace("${changeLog}", changeLogString);
        return this;
    }
    updateSponsors(sponsors: Sponsor[]): WhatsNewHTML {
        let sponsorsString: string = "";

        for (const sp of sponsors) {
            sponsorsString = sponsorsString.concat(
                `<a title="${sp.title}" href="${sp.link}">
                    <img src="${sp.image}" width="${sp.width}%"/>
                </a>
                ${sp.message} 
                ${sp.extra}`
            )           
        }
        this.htmlFile = this.htmlFile.replace("${sponsors}", sponsorsString);
        return this;
    }

    build(): string {
        return this.htmlFile.toString();
    }

    public static WhatsNewHTML(htmlFile: string): WhatsNewHTML {
        return new WhatsNewHTML(htmlFile);
    }

}