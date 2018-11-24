// common
export interface Image {
    src: string;
    width: number;
    height: number;
}

// header
export interface Header {
    logo: Image;
    message: string;
}

// changelog
export enum ChangeLogKind { NEW = "NEW", CHANGED = "CHANGED", FIXED = "FIXED" };

export interface ChangeLogItem {
    kind: ChangeLogKind;
    message: string;
}

// sponsor
export interface Sponsor {
    title: string;
    link: string;
    image: string;
    width: number;
    message: string;
    extra: string;
}

export interface ContentProvider {
    provideHeader(logoUrl: string): Header;
    provideChangeLog(): ChangeLogItem[];
    provideSponsors(): Sponsor[];
}