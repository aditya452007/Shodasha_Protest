import { describe, it, expect } from 'vitest';
import { calculateTrendingScore } from '../src/utils/trendingScore.js';

describe('Trending Score Calculator', () => {
  it('should assign higher score to posts with more upvotes and comments', () => {
    const now = new Date();
    const scoreLow = calculateTrendingScore(2, 0, 1, now);
    const scoreHigh = calculateTrendingScore(20, 1, 10, now);
    expect(scoreHigh).toBeGreaterThan(scoreLow);
  });

  it('should decay score over time', () => {
    const freshDate = new Date();
    const oldDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    const scoreFresh = calculateTrendingScore(10, 0, 5, freshDate);
    const scoreOld = calculateTrendingScore(10, 0, 5, oldDate);

    expect(scoreFresh).toBeGreaterThan(scoreOld);
  });
});
