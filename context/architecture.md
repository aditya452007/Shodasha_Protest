# Architecture Context

## Stack

| Layer      | Technology                              | Role                              |
| ---------- | --------------------------------------- | --------------------------------- |
| Frontend   | Next.js 16 + React 19 + TypeScript      | SSR & App Router UI layer         |
| Styling    | Tailwind CSS v4                         | Utility-first minimalist CSS system |
| State/Query| TanStack Query v5 + Zod                 | Client caching & state validation |
| API Server | Fastify + TypeScript                    | High-throughput REST API server   |
| Database   | PostgreSQL 16 + PgBouncer               | Primary relational datastore      |
| ORM        | Drizzle ORM                             | Type-safe zero-overhead query engine |
| Cache      | Redis 7                                 | Rate limiting, trending score, feeds |
| Realtime   | Server-Sent Events (SSE)                | Live update streaming channel     |
| Search     | PostgreSQL Full-Text Search (`tsvector`)| Native keyword search index       |
| Infra      | Docker + Docker Compose + Cloudflare    | Containerization & CDN/WAF proxy  |

## System Boundaries

- `apps/web/` — Next.js 16 App Router application
- `apps/server/` — Fastify TypeScript API server
- `packages/shared/` — Shared Zod schemas, constants, and TypeScript types
- `docker/` — Dockerfiles, PgBouncer configs, docker-compose configuration

## Storage Model

- **PostgreSQL**: Stores posts, comments, categories, votes, and reports.
- **PgBouncer**: Transaction-pooled proxy to Postgres handling high-concurrency connections efficiently.
- **Redis**: Strictly limited to rate-limiting sliding windows, duplicate submission hashes, hot post sorted sets, and homepage feed caching.

## Auth and Access Model

- **100% Anonymous**: No user accounts, registration, login, JWTs, or passwords.
- **Privacy-Preserving Fingerprinting**: `SHA256(Cookie UUID + LocalStorage UUID + IP + UserAgent)` for rate limiting and vote deduplication.

## Invariants

1. All incoming user content must be sanitized and rendered as plain text. `dangerouslySetInnerHTML` is strictly forbidden.
2. Only HTTPS URLs are allowed (max 3 per post).
3. Comments are plain text only, maximum 300 characters.
4. Posts are limited to 120 chars for title, 1500 chars for body.
5. Database connection must always route through PgBouncer connection pool.
6. Redis is ONLY used for trending cache, homepage cache, rate limiting, and hot posts.
7. Realtime updates MUST use Server-Sent Events (SSE), not WebSockets.
