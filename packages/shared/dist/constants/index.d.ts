export declare const POST_LIMITS: {
    readonly TITLE_MIN_LENGTH: 5;
    readonly TITLE_MAX_LENGTH: 120;
    readonly BODY_MIN_LENGTH: 10;
    readonly BODY_MAX_LENGTH: 1500;
    readonly MAX_HTTPS_LINKS: 3;
};
export declare const COMMENT_LIMITS: {
    readonly BODY_MIN_LENGTH: 2;
    readonly BODY_MAX_LENGTH: 300;
};
export declare const RATE_LIMITS: {
    readonly POST_COOLDOWN_SECONDS: 60;
    readonly COMMENT_COOLDOWN_SECONDS: 15;
    readonly REPORT_LIMIT_WINDOW_SECONDS: 600;
    readonly MAX_REPORTS_PER_WINDOW: 5;
    readonly VOTE_LIMIT_WINDOW_SECONDS: 300;
    readonly MAX_VOTES_PER_WINDOW: 30;
};
export declare const REPORT_REASONS: readonly ["spam", "fake_news", "harassment", "violence", "duplicate", "other"];
export type ReportReason = typeof REPORT_REASONS[number];
export declare const POST_TYPES: readonly ["eyewitness", "opinion", "event_update", "policy_review", "discussion"];
export type PostType = typeof POST_TYPES[number];
export declare const POST_TYPE_LABELS: Record<PostType, {
    label: string;
    icon: string;
    badgeClass: string;
}>;
export declare const CATEGORIES: readonly [{
    readonly slug: "protest-gatherings";
    readonly name: "Demonstrations & Gatherings";
    readonly description: "Ground updates, peaceful rally announcements, schedules, and crowd reports at Jantar Mantar.";
}, {
    readonly slug: "civic-issues";
    readonly name: "Civic & Social Causes";
    readonly description: "Open dialogue on civil rights, environmental concerns, labor demands, student advocacy, and social causes.";
}, {
    readonly slug: "policy-reviews";
    readonly name: "Policy & Governance";
    readonly description: "Personal perspectives, constructive criticism, and concerns regarding public policies, bills, and government decisions.";
}, {
    readonly slug: "visitor-experiences";
    readonly name: "Visitor Accounts & Reviews";
    readonly description: "Personal reflections, crowd atmosphere, location logistics, and visitor experiences at Jantar Mantar.";
}, {
    readonly slug: "eyewitness-news";
    readonly name: "Eyewitness Event Updates";
    readonly description: "First-hand event summaries and observations published by citizens present on the scene.";
}, {
    readonly slug: "general";
    readonly name: "General Civic Forum";
    readonly description: "Broad community discussions, citizen participation, and public perspectives on civic affairs.";
}];
export declare const REPORT_AUTO_HIDE_THRESHOLD = 5;
export declare const DANGEROUS_SCHEMES: readonly ["javascript:", "data:", "blob:", "vbscript:", "ftp:", "file:", "http:"];
//# sourceMappingURL=index.d.ts.map