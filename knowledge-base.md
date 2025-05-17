# MVP Blueprint: Skool Course-Key Sharing Web App

> **Goal**  Launch, in ≤14 days, a web- and mobile-friendly hub where Skool.com creators can **publish** and **discover** course-share keys.  Keep scope razor-thin but include viral hooks; build on a stack that scales 10× with zero rewrites.

---

## Executive Summary

This blueprint details every element—personas, pain points, feature MoSCoW, data schema, 3-way stack comparison, 14-day sprint, KPIs, risks, and monetization options—needed for a solo founder to ship and grow the platform.  The **Balanced** stack (**Next.js + Supabase**) is recommended for its sweet spot of speed, SEO, and cost.  Viral accelerants include SEO-indexed listings, social share buttons, upvotes, and a public leaderboard.  After launch, revenue can emerge from featured listings, sponsorships, or premium analytics.

---

## 1 · User & Market Insights

### 1.1 Personas, Jobs-To-Be-Done (JTBD) & Viral Levers

| Persona                                 | Short Description                                             | JTBD                                                                        | Viral Lever                                                                                       |
| --------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Experienced Course Creator (Sharer)** | Runs a thriving Skool community; has polished course content. | Showcase expertise & help peers by sharing course templates.                | Shares their listing on social media; competes on public leaderboard; sports a contributor badge. |
| **Aspiring Course Builder (Seeker)**    | New(er) Skool user; wants to stand up a course fast.          | Find & import a proven template instead of building from scratch.           | When a template works, shares link in groups; may later become a Sharer.                          |
| **Community Curator / Growth Hacker**   | Affiliate, marketer, or manager watching trends.              | Discover popular templates to curate “Top X” lists or teach best practices. | Publishes roundup posts (Reddit, X, newsletters) with links back to site.                         |

### 1.2 Current Hacks & Pain Points

* **Scattered sharing** – Keys buried in Skool threads, Discord chats, or Google Sheets; no search.
* **External marketplaces** – Dozens of paid Skool templates on Etsy/Gumroad → fragmented, paywalled.
* **Manual networking** – DM swaps; impossible to gauge quality; no feedback loops.
* **Import confusion** – Newbies unsure how to use a key; friction lowers adoption.

### 1.3 Initial Outreach Communities

1. **Skool official & niche groups** – SEO-visible posts can also drive organic Google traffic.
2. **Facebook / Reddit course-creator groups** – Target makers already evaluating Skool.
3. **Indie Hackers & Product Hunt** – Amplify launch; attract builder-minded curators.
4. **Skool affiliates / coaches** – They want freebies to entice sign-ups; can seed content.

---

## 2 · Must-Have vs WOW Features (MoSCoW)

| Feature / Capability               | Priority        | Effort (est.) | Viral / Rationale                              |
| ---------------------------------- | --------------- | ------------- | ---------------------------------------------- |
| **Supabase Auth + Profiles**       | **Must**        | ≈1 day        | Quick signup; tracks attribution.              |
| **Post Course-Share Key (CRUD)**   | **Must**        | ≈2 days       | Core value; generates shareable detail URL.    |
| **Browse / List Keys**             | **Must**        | ≈1 day        | Public SEO-indexed feed → organic traffic.     |
| **Search by Keywords**             | **Must**        | ≈1 day        | Fast discovery of relevant templates.          |
| **Tagging & Tag Filter**           | **Should**      | ≈1 day        | Topic pages; deep-linkable for viral shares.   |
| **Key Detail Page + Copy Button**  | **Must**        | ≈1 day        | Clear “Copy & Import” CTA; high shareability.  |
| **Copy / Import Instructions**     | **Should**      | ≈0.5 day      | Lowers friction → more success stories.        |
| **Upvote / Like**                  | **Could**       | ≈1 day        | Social proof; powers “trending.”               |
| **Leaderboard of Top Sharers**     | **Could (WOW)** | ≈2 days       | Gamifies contributions; sparks self-promotion. |
| **Contributor Badges**             | **Could**       | ≈2 days       | Status symbols; encourages sharing.            |
| **Social Share Buttons**           | **Should**      | ≈0.5 day      | One-click virality.                            |
| **Moderation / Report Flag**       | **Should**      | ≈1 day        | Maintains quality & trust.                     |
| **Analytics Dashboard (Admin)**    | **Should**      | ≈1 day        | Tracks KPIs; informs iterations.               |
| Comments / follows / notifications | **Won’t**       | –             | Future engagement layer.                       |
| Direct Skool API integration       | **Won’t**       | –             | Manual import only (no official API).          |
| Monetization / payments            | **Won’t**       | –             | Focus on growth first.                         |

---

## 3 · Technical Requirements

### 3.1 CRUD Slice

* **Schema** `CourseKeys(id UUID, title text, description text, share_key text, tags text[], author_id UUID → Users.id, created_at timestamp)`
* **Indexes** full-text (`title, description`), GIN on `tags[]`.
* **Targets** <500 ms queries, 99 % uptime.
* **10× Viral Peak** ≈200 inserts + 1 k reads/hr → well under Supabase Pro capacity.

### 3.2 Search & Filter

* Postgres Full-Text Search; combine with tag filter (`WHERE tags @> '{marketing}'`).
* Sub-1 s response until >100 k rows; then consider Algolia/Meili.

### 3.3 Authentication & Profiles

* Supabase email magic-link + optional Google OAuth.
* RLS policies: users touch only their rows; founder flagged as admin.
* `Profiles(user_id PK, name, avatar_url, bio, join_date)`.

### 3.4 Analytics & Events

* External traffic analytics (Plausible/GA).
* Optional table `KeyEvents(id, key_id, user_id?, event_type, ts)` for views, copies, likes.

---

## 4 · Tech-Stack Comparison

| Approach                        | Dev Velocity | Cost @10 k MAU | SEO / SSR            | Notes                                           |
| ------------------------------- | ------------ | -------------- | -------------------- | ----------------------------------------------- |
| **Turbo** SPA + Supabase        | ⚡ Fastest    | ≈\$25-50/mo    | Weak SEO             | Pure client; limits organic growth.             |
| **Balanced** Next.js + Supabase | **✅ High**   | ≈\$50-70/mo    | Strong SEO (ISR/SSR) | **Recommended** – best mix of speed + virality. |
| Enterprise Micro-services       | 🐢 Slow      | \$100-300/mo   | Strong SEO           | Overkill for solo MVP.                          |

**Balanced Wins**: SSR for crawlable pages, API routes for upgrades, minimal DevOps overhead, linear scaling via Supabase/Vercel plan bumps.

---

## 5 · 14-Day Delivery Sprint Plan

| Day       | Focus                                                           | Deliverable / Milestone          |
| --------- | --------------------------------------------------------------- | -------------------------------- |
| **1-2**   | Project scaffold (Next.js), Supabase project, schema, auth test | “Hello DB” query ✅               |
| **3-5**   | Build: signup/login, post form, list page, detail page          | End-to-end CRUD ✅                |
| **6-7**   | Add search, tag filter; seed 10 real/dummy keys                 | MVP feature-complete             |
| **8**     | Friends-&-Family beta                                           | Collect bugs + UX feedback       |
| **9-10**  | Fixes; add social share & likes; integrate analytics            | Viral hooks live                 |
| **11**    | Write FAQ, prepare launch copy/screens                          | Launch assets ready              |
| **12**    | Public launch (Skool forum, FB, Reddit, X, Product Hunt)        | Site live; monitor spike         |
| **13-14** | Bug-fix, KPI review, minor UX tweaks                            | v1.0 stable; next-sprint backlog |

### KPIs to Track

* **Creators signed up** & **keys shared** (goal ≥ 20 in week 1)
* **DAU / WAU**, retention %
* **Share-origin traffic** (referrals from social/forums)

### Top Risks → Mitigations

| Risk                     | Mitigation                                              |
| ------------------------ | ------------------------------------------------------- |
| Empty library            | Seed templates pre-launch; spotlight requested topics.  |
| Spam / low-quality posts | Login-gated posting; report button; manual moderation.  |
| Sudden scaling           | Upgrade Supabase & Vercel tiers; enable ISR caching.    |
| Skool policy change      | Manual import model; maintain dialogue with Skool team. |

---

## 6 · Appendix

### 6.1 Skool Context

* No public API; sharing keys is TOS-friendly.
* Analogy: Canvas LMS “Commons” validates demand for template hubs.

### 6.2 Early Monetization Ideas

1. **Promoted / Featured listings** (premium tags or homepage spotlight)
2. **Sponsorship banners & newsletter slots**
3. **Creator analytics dashboard** (import counts, trending searches)
4. **Future:** Paid-template marketplace w/ Stripe & rev-share

---

> **Action Item:** Kick off Day-1 tasks—spin up Supabase, create `CourseKeys` & `Profiles` tables, and push initial Next.js repo to Vercel.
