# Ember

A streak tracker and leaderboard for a group that wants to stay honest about who's actually showing up.

Ember pulls real activity from GitHub, LeetCode, and Hackatime into one place, scores it, and ranks everyone against each other. No self-reporting, no vibes, just what actually happened.

**Live:** https://ember-streak.vercel.app

## What it does

- Connect your GitHub, LeetCode, and Hackatime accounts, and disconnect them whenever, without losing your historical activity
- Activity syncs in automatically and gets logged, deduplicated against what's already stored
- Each platform's activity resolves into one unified score, "Embers"
- Hover a score on the leaderboard to see the per-platform breakdown behind it
- See where you rank, overall and per platform, across 1 day, 7 day, and 30 day windows
- A public leaderboard, so the group can actually compete
- Sign out, properly, session invalidated server-side, not just a cleared cookie

## How it's built

**Auth, hand-rolled.** Sessions, password hashing, and token generation were built from scratch rather than handed off to a managed provider. Password hashing uses bcrypt. Session tokens are generated with Node's built-in `crypto` module and only ever stored as a hash, the raw token lives in an `httpOnly` cookie and nowhere else.

**Three real integrations, three different shapes of problem:**
- **GitHub** — OAuth, then pulled via the Events API, grouped by consecutive same-repo activity, and compared against commit ranges to get real counts
- **Hackatime** — OAuth, same integration pattern as GitHub, applied to a different API shape
- **LeetCode** — no official public API, integrated against their internal GraphQL endpoint directly

**Database: Postgres, via Supabase.** Schema designed and written by hand, `users`, `platform_accounts`, `sessions`, `activity_log`, each with real foreign key relationships, not auto-generated. Activity is stored raw (including zero-activity entries), with scoring and filtering handled at query time rather than baked into storage.

**Scoring.** Each platform's activity resolves into Embers, GitHub by commit count, LeetCode by problem difficulty, Hackatime by coding hours, and a user's total is the sum across whichever platforms they've connected. Full breakdown in the docs page.

## Why

Built in a week to actually learn databases, sessions, and real third-party API integration, not by reading about them, by building something a real group of people would actually use and compete on.