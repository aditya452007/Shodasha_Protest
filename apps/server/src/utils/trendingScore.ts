export function calculateTrendingScore(
  upvotes: number,
  downvotes: number,
  commentCount: number,
  createdAt: Date
): number {
  const netVotes = Math.max(0, upvotes - downvotes);
  
  // Gravity time decay formula (Hacker News algorithm adapted)
  const now = new Date().getTime();
  const createdTime = new Date(createdAt).getTime();
  const hoursSinceCreation = Math.max(0, (now - createdTime) / (1000 * 60 * 60));

  const baseScore = (netVotes * 5) + (commentCount * 3);
  const gravity = 1.5;

  const score = (baseScore + 1) / Math.pow(hoursSinceCreation + 2, gravity);
  return Number(score.toFixed(4));
}
