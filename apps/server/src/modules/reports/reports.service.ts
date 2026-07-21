import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { reports, posts, comments } from '../../db/schema/index.js';
import { REPORT_AUTO_HIDE_THRESHOLD } from '@shodasha/shared';

export class ReportsService {
  public async submitReport(
    reporterHash: string,
    reason: string,
    postId?: string,
    commentId?: string,
    details?: string
  ) {
    return await db.transaction(async (tx) => {
      // 1. Insert report record
      const [report] = await tx
        .insert(reports)
        .values({
          postId: postId || null,
          commentId: commentId || null,
          reporterHash,
          reason,
          details: details || null,
        })
        .returning();

      // 2. Handle post report
      if (postId) {
        const [targetPost] = await tx
          .select()
          .from(posts)
          .where(eq(posts.id, postId))
          .limit(1);

        if (targetPost) {
          const newReportCount = targetPost.reportCount + 1;
          const newStatus =
            newReportCount >= REPORT_AUTO_HIDE_THRESHOLD ? 'quarantined' : targetPost.status;

          await tx
            .update(posts)
            .set({
              reportCount: newReportCount,
              status: newStatus,
            })
            .where(eq(posts.id, postId));
        }
      }

      // 3. Handle comment report
      if (commentId) {
        const [targetComment] = await tx
          .select()
          .from(comments)
          .where(eq(comments.id, commentId))
          .limit(1);

        if (targetComment) {
          const newReportCount = targetComment.reportCount + 1;
          const newStatus =
            newReportCount >= REPORT_AUTO_HIDE_THRESHOLD ? 'hidden' : targetComment.status;

          await tx
            .update(comments)
            .set({
              reportCount: newReportCount,
              status: newStatus,
            })
            .where(eq(comments.id, commentId));
        }
      }

      return report;
    });
  }
}

export const reportsService = new ReportsService();
