'use strict';

import { ExtensionContext } from "vscode";
import { WhatsNew } from "./WhatsNew";
import { WhatsNewReplacements, ChangeLogItem, ChangeLogKind, Sponsor } from "./WhatsNewReplacements";
import { link } from "fs";

export class WhatsNewPascal extends WhatsNew {

    constructor(context: ExtensionContext) {
        super("Pascal", context); 
        this.prepare();
    }

    prepare() {
        const headerMessage: string = `Edit your <b>Delphi</b> and <b>FreePascal</b> files with full
            <b>Syntax Highlighting</b> for files, forms and projects, with a huge set of <b>Snippets</b>, 
            <b>Code Formatters</b> and <b>Source Code Navigation</b>`;

        // changelog
        let changeLog: ChangeLogItem[] = [];
        changeLog.push({kind: ChangeLogKind.NEW, message: "<b>Multi-root</b> support"});
        changeLog.push({kind: ChangeLogKind.NEW, message: "Visual Studio <b>Live Share</b> support"});
        changeLog.push({kind: ChangeLogKind.CHANGED, message: "Better <b>Code Navigation</b>"});
        changeLog.push({kind: ChangeLogKind.FIXED, message: `Support <i>.lpr</i> files (Thanks to @BeRo1985 
            - <a title=\"Open PR #30\" href=\"https://github.com/alefragnani/vscode-language-pascal/pulls/30\">
            PR #30</a>)</b>`});

        // sponsors
        let sponsors: Sponsor[] = [];
        // const sponsorCodeStream: Sponsor = <Sponsor>{
        //     title: "Try Codestream",
        //     link: "https://codestream.com/?utm_source=vscmarket&utm_medium=banner&utm_campaign=pascal",
        //     image: "https://raw.githubusercontent.com/alefragnani/oss-resources/master/images/sponsors/codestream-hi-res.png",
        //     width: 35,
        //     message: "<p>Use Slack inside VS Code and save your technical discussions where they belong - with your codebase.</p>",
        //     extra: 
        //         `<a title="Try CodeStream" href="https://codestream.com/?utm_source=vscmarket&utm_medium=banner&utm_campaign=projectmanager">
        //          Try CodeStream</a>` 
        // };
        // sponsors.push(sponsorCodeStream);

        // Header
        this.replacements = <WhatsNewReplacements>{headerMessage, changeLog, sponsors};
    }
    
}