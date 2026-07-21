import { describe, it, expect } from 'vitest';
import {
  createPostSchema,
  createCommentSchema,
  voteSchema,
  reportSchema,
} from '@shodasha/shared';

describe('Zod Request Validation Schemas', () => {
  it('should validate valid post creation payload', () => {
    const validPost = {
      title: 'DU VC Office Demonstration Schedule',
      body: 'Students gather at North Campus gate at 10 AM. Verified updates at https://du.ac.in/notice',
      categorySlug: 'protest-updates',
    };

    const res = createPostSchema.safeParse(validPost);
    expect(res.success).toBe(true);
  });

  it('should reject post title exceeding 120 characters', () => {
    const invalidPost = {
      title: 'A'.repeat(121),
      body: 'Valid post body content here.',
      categorySlug: 'general',
    };

    const res = createPostSchema.safeParse(invalidPost);
    expect(res.success).toBe(false);
  });

  it('should reject post body exceeding 1500 characters', () => {
    const invalidPost = {
      title: 'Valid Title',
      body: 'B'.repeat(1501),
      categorySlug: 'general',
    };

    const res = createPostSchema.safeParse(invalidPost);
    expect(res.success).toBe(false);
  });

  it('should reject comment body exceeding 300 characters', () => {
    const invalidComment = {
      body: 'C'.repeat(301),
    };

    const res = createCommentSchema.safeParse(invalidComment);
    expect(res.success).toBe(false);
  });

  it('should validate vote value (+1 or -1 only)', () => {
    expect(voteSchema.safeParse({ voteValue: 1 }).success).toBe(true);
    expect(voteSchema.safeParse({ voteValue: -1 }).success).toBe(true);
    expect(voteSchema.safeParse({ voteValue: 5 }).success).toBe(false);
  });

  it('should validate report payload with reason', () => {
    const reportPayload = {
      postId: '123e4567-e89b-12d3-a456-426614174000',
      reason: 'spam',
      details: 'Repeated promotional message',
    };

    const res = reportSchema.safeParse(reportPayload);
    expect(res.success).toBe(true);
  });
});
