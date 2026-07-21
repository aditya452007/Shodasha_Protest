# UI & Design System Context

## Theme & Aesthetic
- **Visual Style**: Minimal, clean, modern, high contrast, dark-mode focused citizen journalism aesthetic.
- **Primary Color Palette**:
  - Background: Deep Dark Slate (`#0b0f19`, `#111827`)
  - Card Surfaces: Charcoal Slate (`#1f2937`)
  - Accent Color: Education Protest Amber/Orange (`#f97316`, `#ea580c`)
  - Urgency Accent: Crimson Red (`#ef4444`)
  - Text Primary: Crisp High-Contrast White (`#f9fafc`)
  - Text Secondary: Muted Gray (`#9ca3af`)
  - Border Subtlety: Dark Slate (`#374151`)

## Component Guidelines
- **Atomic Structure**:
  - `components/ui`: Buttons, Badges, Inputs, Textareas, Modals, Cards.
  - `components/post`: PostCard, PostList, VoteBar, ShareButton, PostFilterNav.
  - `components/comment`: CommentSection, CommentCard, CommentInput.
  - `components/report`: ReportModal.
  - `components/layout`: Header, Footer, CategoryNav, Container.

## UX Invariants
- Instant optimistic updates for Upvoting/Downvoting.
- Character counters for Post Title (120 max), Post Body (1500 max), Comment (300 max).
- Clear, accessible focus rings and high-contrast labels.
- Mobile-first responsive layout (collapsible category drawer/pills on small screens).
