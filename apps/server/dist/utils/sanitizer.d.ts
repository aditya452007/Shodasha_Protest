export declare function isStrictPlainText(text: string): boolean;
export declare function sanitizeToPlainText(text: string): string;
export declare function validateAndExtractHttpsLinks(bodyText: string): {
    valid: boolean;
    links: string[];
    error?: string;
};
export declare function hashContent(content: string): string;
//# sourceMappingURL=sanitizer.d.ts.map