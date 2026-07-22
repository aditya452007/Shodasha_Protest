# Shodasha Civic Forum - UI Redesign & Component Checklist

> **Aesthetic Vision:** High-contrast Minimalist Editorial View (inspired by NYT, Monocle, The Guardian, Awwwards editorial sites)  
> **Color Mode:** 100% Light Mode with crisp black text (`#09090b`), paper background (`#ffffff`), and sharp 1px hairline grid borders (`#e4e4e7`).  
> **Anti-Slop Directives:** NO purple gradients, NO dark mesh blobs, NO glassmorphism backdrop blurs, NO generic glowing pill containers.

---

## 1. Skill Setup & Dials Configuration

- [x] Installed skills: `design-taste-frontend`, `ui-checklist`, `minimalist-ui`, `emil-design-eng`, `high-end-visual-design`, `hallmark` via `Skills.py`.
- [x] Design Read: "Editorial public civic publication platform for citizens and researchers in New Delhi, featuring a high-contrast minimalist light-mode language with crisp typography, structured grid layout, restrained motion, and anti-slop design."
- [x] Three Dials: `VARIANCE: 6`, `MOTION: 4`, `DENSITY: 4`.

---

## 2. Impeccable CLI Audit & Anti-Pattern Fixes

- [x] Fix `gray-on-color` anti-pattern in `PostCard.tsx` (replace `text-neutral-400` on `bg-red-50` with high-contrast `text-red-700`).
- [x] Fix `side-tab` anti-pattern in `CommentSection.tsx` (replace `border-l-2` side-bar with clean neutral hairline border).
- [x] Fix `border-accent-on-rounded` anti-pattern in `PostDetailPage.tsx` (replace `border-t-2` on rounded spinner with CSS spinner).

---

## 3. Component Completeness Checklist (Sourced from `ui-checklist` & `DESIGN.md`)

### A. Masthead & Header Navigation
- [x] Top utility strip: Live date, location tag (`Jantar Mantar, New Delhi`), civic status badge.
- [x] Brand Masthead: High-contrast serif title (`SHODASHA`), subtitle (`Jantar Mantar Public Civic Forum`).
- [x] Quick Command Palette (`SearchModal.tsx`): `Cmd+K` / `/` modal overlay for instant search & recent jumps.
- [x] Navigation: Single-line link layout (`Trending`, `Latest`, `Categories`, `Post Update`).
- [x] Mobile Drawer: Animated toggle menu for mobile screens.

### B. Editorial Hero & Feed Filter Bar
- [x] Hero Banner: Editorial layout with headline, subtext, civic statistics counter, and action buttons.
- [x] Feed View Toggle (`FeedViewToggle.tsx`): Switch between Compact Editorial List view and Cards view.
- [x] Filter Bar: Segmented sort toggle (`Trending`, `Latest`, `Top`) with solid black active pill.
- [x] Loading Skeletons: Shimmer cards matching actual card layout.

### C. Category Navigation (`CategoryNav.tsx`)
- [x] Horizontal scrollable topic tabs (`All Topics`, `Eyewitness Accounts`, `Peaceful Rallies`, `Policy & Law`, `Traffic & Access`, `Official Notices`).
- [x] Active state: Solid black badge pill.

### D. Feed Post Cards (`PostCard.tsx` & `VoteBar.tsx`)
- [x] Card Structure: 1px hairline border (`#e4e4e7`), 16px padding, smooth hover transition.
- [x] Estimated Reading Time: Display `3 min read` reading time badge per dispatch.
- [x] Share Action: Copy URL to clipboard with Toast Notification feedback.
- [x] Title & Excerpt: High-contrast serif headline, line-clamp excerpt text (`text-neutral-700`).
- [x] Vote Bar: Interactive upvote/downvote buttons, live count update, solid active state.

### E. Comment Section (`CommentSection.tsx`)
- [x] Comment Tree: Clean indentation without heavy side tabs.
- [x] Input Box: Editorial textarea with character counter, validation states, and submit button.
- [x] Comment Metadata: Author badge, relative timestamp, vote button per comment.

### F. Create Post Form (`/create/page.tsx`)
- [x] Form Layout: Clean editorial form with section headers.
- [x] Draft Recovery: LocalStorage auto-save draft banner.
- [x] Formatting Toolbar: Markdown quick formatting (Bold, Link, Quote, Header).
- [x] Form Fields: Category dropdown selector, Title input, Content editor, Tag inputs.

### G. Notification System (`Toast.tsx`)
- [x] Light-mode Toast portal for non-intrusive alerts (link copy, draft saved, error alerts).

### H. Directory Footer (`Footer.tsx`)
- [x] 4-Column Directory: Platform overview, Jantar Mantar location info, Topic index, Civic resources.
- [x] Bottom Bar: Copyright notice, privacy disclaimer, live clock.
