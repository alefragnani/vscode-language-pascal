export enum ChangeLogKind { NEW = "NEW", CHANGED = "CHANGED", FIXED = "FIXED" };

export interface ChangeLogItem {
    kind: ChangeLogKind;
    message: string;
}

export interface Sponsor {
    title: string;
    link: string;
    image: string;
    width: number;
    message: string;
    extra: string;
}

export interface WhatsNewReplacements {
    headerMessage: string;
    changeLog: ChangeLogItem[];
    sponsors: Sponsor[];
}

export interface ContentProvider {
    provideHeader(): string;
    provideChangeLog(): ChangeLogItem[];
    provideSponsors(): Sponsor[];
}