export declare class ReportsService {
    submitReport(reporterHash: string, reason: string, postId?: string, commentId?: string, details?: string): Promise<{
        id: string;
        createdAt: Date;
        postId: string | null;
        commentId: string | null;
        reporterHash: string;
        reason: string;
        details: string | null;
    } | undefined>;
}
export declare const reportsService: ReportsService;
//# sourceMappingURL=reports.service.d.ts.map