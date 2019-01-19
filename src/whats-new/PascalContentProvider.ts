/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { ChangeLogItem, ChangeLogKind, Sponsor, ContentProvider, Header, Image } from "../../vscode-whats-new/src/ContentProvider";

export class WhatsNewPascalContentProvider implements ContentProvider {

    provideHeader(logoUrl: string): Header {
        return <Header>{logo: <Image> {src: logoUrl, height: 50, width: 50}, 
            message: `Edit your <b>Delphi</b> and <b>FreePascal</b> files with full
            <b>Syntax Highlighting</b> for files, forms and projects, with a huge set of <b>Snippets</b>, 
            <b>Code Formatters</b> and <b>Source Code Navigation</b>`};
    }

    provideChangeLog(): ChangeLogItem[] {
        let changeLog: ChangeLogItem[] = [];
        changeLog.push({kind: ChangeLogKind.NEW, message: "Adds <b>Multi-root</b> support"});
        changeLog.push({kind: ChangeLogKind.NEW, message: "Adds <b>Visual Studio Live Share</b> support"});
        changeLog.push({kind: ChangeLogKind.CHANGED, message: "Improvements in <b>Code Navigation</b>"});
        changeLog.push({kind: ChangeLogKind.CHANGED, message: `Update grammar based on Monaco Language PR 
            (<a title=\"Issue #43\" href=\"https://github.com/alefragnani/vscode-language-pascal/issues/43\">
            Issue #43</a>)`});
        changeLog.push({kind: ChangeLogKind.CHANGED, message: `The <b>Formatter</b> was extracted to its own 
            extension (<a title=\"Open Pascal Formatter\" href=\"https://github.com/alefragnani/vscode-pascal-formatter/\">
            Pascal Formatter</a>)`});
        changeLog.push({kind: ChangeLogKind.FIXED, message: `Final cursor position on some Snippets 
            (<a title=\"Issue #41\" href=\"https://github.com/alefragnani/vscode-language-pascal/issues/41\">
            Issue #41</a>)`});
        changeLog.push({kind: ChangeLogKind.FIXED, message: `Support <i>.lpr</i> files (Thanks to @BeRo1985 
            - <a title=\"Open PR #30\" href=\"https://github.com/alefragnani/vscode-language-pascal/pull/30\">
            PR #30</a>)`});
        return changeLog;
    }

    provideSponsors(): Sponsor[] {
        let sponsors: Sponsor[] = [];
        return sponsors
    }
   
}