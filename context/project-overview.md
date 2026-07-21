# Project Overview

## Overview

Shodasha Protest is a complete, production-ready anonymous citizen journalism platform focused on sharing, reading, discussing, voting on, and reporting updates related to education protests in Delhi. The platform is designed for open public participation while remaining secure, performant, scalable, privacy-conscious, and easy to maintain.

## Project Goals

1. **Anonymous Citizen Journalism**: Enable instant posting, commenting, and browsing of education protest updates in Delhi without registration, authentication, login, or admin dashboards.
2. **High Security & Privacy**: Enforce strict input validation, HTML stripping, URL scheme verification, anonymous fingerprinting, and zero storage of plain PII.
3. **High Performance & Concurrency**: Support 1,000+ concurrent users with <300ms cold responses and <100ms cached responses.
4. **Spam & Abuse Prevention**: Protect against automated bots and spammers using honeypots, duplicate content hashes, sliding-window rate limits, and community report thresholds.
5. **Realtime Engagement**: Serve live updates via Server-Sent Events (SSE) and fast full-text search (FTS) using PostgreSQL native indexes.

## Core User Flow

1. Visitor opens homepage (`/`), views top trending protest updates and category navigation.
2. Visitor filters by category or searches posts using full-text search (`/search?q=...`).
3. Visitor creates a post (`/create`) anonymously with title (max 120 chars), body (max 1500 chars), category, and optional HTTPS links (max 3).
4. Visitor reads post detail (`/posts/[id]`), views comments, and adds an anonymous plain-text comment (max 300 chars).
5. Visitor votes on posts (upvote/downvote) or reports inappropriate content.

## Target Audience

Delhi students, researchers, educators, activists, journalists, and concerned citizens seeking real-time, unfiltered, privacy-preserving education protest updates and discussions.

## Success Metrics

- **Performance**: Cold API response < 300 ms, Cached response < 100 ms.
- **Capacity**: Support 1,000 concurrent active users.
- **Security**: 0 XSS vulnerabilities, zero unhandled injections, strict Helmet + CSP compliance.
- **Quality**: 100% strict TypeScript types, full input validation with Zod schemas.
