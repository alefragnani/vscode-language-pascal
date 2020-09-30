/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { ChangeLogItem, ChangeLogKind, Sponsor, ContentProvider, Header, Image, IssueKind } from "../../vscode-whats-new/src/ContentProvider";

export class WhatsNewPascalContentProvider implements ContentProvider {

    provideHeader(logoUrl: string): Header {
        return <Header>{logo: <Image> {src: logoUrl, height: 50, width: 50}, 
            message: `Edit your <b>Delphi</b> and <b>FreePascal</b> files with full
            <b>Syntax Highlighting</b> for files, forms and projects, with a huge set of <b>Snippets</b>, 
            <b>Code Formatters</b> and <b>Source Code Navigation</b>`};
    }

    provideChangeLog(): ChangeLogItem[] {
        const changeLog: ChangeLogItem[] = [];

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "9.2.0", releaseDate: "October 2020" } });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Reopen providers repo",
                id: 67,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "<b>Find References</b> command not working",
                id: 68,
                kind: IssueKind.Issue
            }
        });

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "9.1.0", releaseDate: "August 2020" } });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Support Extension View Context Menu",
                id: 56,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Migrate from TSLint to ESLint",
                id: 63,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Security Alert: elliptic",
                id: 64,
                kind: IssueKind.PR,
                kudos: "dependabot"
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Security Alert: acorn",
                id: 58,
                kind: IssueKind.PR,
                kudos: "dependabot"
            }
        });

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "9.0.0", releaseDate: "February 2020" } });
        changeLog.push({
            kind: ChangeLogKind.CHANGED,
            detail: {
                message: "Task samples upgraded to v2",
                id: 54,
                kind: IssueKind.PR,
                kudos: "@Creativelaides"
            }
        });
        changeLog.push({
            kind: ChangeLogKind.INTERNAL,
            detail: {
                message: "Support VS Code package split",
                id: 55,
                kind: IssueKind.Issue
            }
        });

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "8.0.3", releaseDate: "May 2019" } });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Close parentheses missing for function and procedure snippets",
                id: 51,
                kind: IssueKind.PR,
                kudos: "@SpaceEEC"
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Security Alert: mixin-deep",
                id: 53,
                kind: IssueKind.PR,
                kudos: "dependabot"
            }
        });

        changeLog.push({ kind: ChangeLogKind.VERSION, detail: { releaseNumber: "8.0.0", releaseDate: "February 2019" } });
        changeLog.push({
            kind: ChangeLogKind.NEW,
            detail: {
                message: "Use new VSCode API - Open Resource in Browser",
                id: 46,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.CHANGED,
            detail: {
                message: "Update grammar based on Monaco Language PR",
                id: 43,
                kind: IssueKind.Issue
            }
        });
        changeLog.push({
            kind: ChangeLogKind.FIXED,
            detail: {
                message: "Final cursor position on some Snippets",
                id: 41,
                kind: IssueKind.Issue
            }
        });

        return changeLog;
    }

    provideSponsors(): Sponsor[] {
        const sponsors: Sponsor[] = [];
        return sponsors
    }
   
}