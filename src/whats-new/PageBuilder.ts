import { Uri } from "vscode";
import * as fs from "fs";
import { ChangeLogItem, ChangeLogKind, Sponsor, Header } from "./ContentProvider";

export class WhatsNewPageBuilder {

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

    updateExtensionDisplayName(extensionDisplayName: string) {
        this.htmlFile = this.htmlFile.replace(/\$\{extensionDisplayName\}/g, extensionDisplayName);
        return this;
    }

    updateExtensionName(extensionName: string) {
        this.htmlFile = this.htmlFile.replace(/\$\{extensionName\}/g, extensionName);
        return this;
    }

    updateExtensionVersion(extensionVersion: string) {
        this.htmlFile = this.htmlFile.replace("${extensionVersion}", extensionVersion);
        return this;
    }

    updateRepositoryUrl(repositoryUrl: string) {
        this.htmlFile = this.htmlFile.replace(/\$\{repositoryUrl\}/g, repositoryUrl);
        return this;
    }

    updateRepositoryIssues(repositoryIssues: string) {
        this.htmlFile = this.htmlFile.replace("${repositoryIssues}", repositoryIssues);
        return this;
    }

    updateRepositoryHomepage(repositoryHomepage: string) {
        this.htmlFile = this.htmlFile.replace("${repositoryHomepage}", repositoryHomepage);
        return this;
    }

    updateCSS(cssUrl: string): WhatsNewPageBuilder {
        this.htmlFile = this.htmlFile.replace("${cssUrl}", cssUrl);
        return this;
    }

    updateHeader(header: Header): WhatsNewPageBuilder {
        this.htmlFile = this.htmlFile.replace("${headerLogo}", header.logo.src);
        this.htmlFile = this.htmlFile.replace("${headerWidth}", header.logo.width.toString());
        this.htmlFile = this.htmlFile.replace("${headerHeight}", header.logo.height.toString());
        this.htmlFile = this.htmlFile.replace("${headerMessage}", header.message);
        return this;
    }

    updateChangeLog(changeLog: ChangeLogItem[]): WhatsNewPageBuilder {
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
    updateSponsors(sponsors: Sponsor[]): WhatsNewPageBuilder {
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

    public static newBuilder(htmlFile: string): WhatsNewPageBuilder {
        return new WhatsNewPageBuilder(htmlFile);
    }

}