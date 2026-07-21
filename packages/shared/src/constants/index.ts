export const POST_LIMITS = {
  TITLE_MIN_LENGTH: 5,
  TITLE_MAX_LENGTH: 120,
  BODY_MIN_LENGTH: 10,
  BODY_MAX_LENGTH: 1500,
  MAX_HTTPS_LINKS: 3,
} as const;

export const COMMENT_LIMITS = {
  BODY_MIN_LENGTH: 2,
  BODY_MAX_LENGTH: 300,
} as const;

export const RATE_LIMITS = {
  POST_COOLDOWN_SECONDS: 60,
  COMMENT_COOLDOWN_SECONDS: 15,
  REPORT_LIMIT_WINDOW_SECONDS: 600, // 10 minutes
  MAX_REPORTS_PER_WINDOW: 5,
  VOTE_LIMIT_WINDOW_SECONDS: 300, // 5 minutes
  MAX_VOTES_PER_WINDOW: 30,
} as const;

export const REPORT_REASONS = [
  'spam',
  'fake_news',
  'harassment',
  'violence',
  'duplicate',
  'other',
] as const;

export type ReportReason = typeof REPORT_REASONS[number];

export const POST_TYPES = [
  'eyewitness',
  'opinion',
  'event_update',
  'policy_review',
  'discussion',
] as const;

export type PostType = typeof POST_TYPES[number];

export const POST_TYPE_LABELS: Record<PostType, { label: string; icon: string; badgeClass: string }> = {
  eyewitness: {
    label: 'Eyewitness Account',
    icon: '👁️',
    badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  },
  opinion: {
    label: 'Personal Perspective',
    icon: '💬',
    badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  },
  event_update: {
    label: 'Event Update',
    icon: '📢',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
  policy_review: {
    label: 'Policy Review',
    icon: '📜',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  discussion: {
    label: 'Community Discussion',
    icon: '🌐',
    badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  },
};

export const CATEGORIES = [
  {
    slug: 'protest-gatherings',
    name: 'Demonstrations & Gatherings',
    description: 'Ground updates, peaceful rally announcements, schedules, and crowd reports at Jantar Mantar.',
  },
  {
    slug: 'civic-issues',
    name: 'Civic & Social Causes',
    description: 'Open dialogue on civil rights, environmental concerns, labor demands, student advocacy, and social causes.',
  },
  {
    slug: 'policy-reviews',
    name: 'Policy & Governance',
    description: 'Personal perspectives, constructive criticism, and concerns regarding public policies, bills, and government decisions.',
  },
  {
    slug: 'visitor-experiences',
    name: 'Visitor Accounts & Reviews',
    description: 'Personal reflections, crowd atmosphere, location logistics, and visitor experiences at Jantar Mantar.',
  },
  {
    slug: 'eyewitness-news',
    name: 'Eyewitness Event Updates',
    description: 'First-hand event summaries and observations published by citizens present on the scene.',
  },
  {
    slug: 'general',
    name: 'General Civic Forum',
    description: 'Broad community discussions, citizen participation, and public perspectives on civic affairs.',
  },
] as const;

export const REPORT_AUTO_HIDE_THRESHOLD = 5;

export const DANGEROUS_SCHEMES = [
  'javascript:',
  'data:',
  'blob:',
  'vbscript:',
  'ftp:',
  'file:',
  'http:',
] as const;

