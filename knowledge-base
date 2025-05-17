# MVP Blueprint: Skool Course‑Key Sharing Web App

**Executive Summary**
This blueprint details a two‑week plan for a solo founder to launch a web‑ and mobile‑friendly directory where Skool.com creators can publish and discover shareable course keys. It prioritizes fast development with a **Next.js + Supabase** stack, ships only essential CRUD, search, and tagging features, and bakes in viral hooks like shareable pages and gamified leaderboards. A staged 14‑day sprint, clear success metrics, and mitigation strategies ensure that the MVP can go live quickly, attract early adopters from existing Skool and course‑creator communities, and scale smoothly to 10 × traffic without rewrites—setting the foundation for future monetization through promoted listings, sponsorships, and premium analytics.

---

## 1 · User & Market Insights

### Target personas & JTBD

* **Experienced Course Creator (Sharer)** — wants recognition and to help peers by sharing proven course structures. *Viral lever:* promotes their listing to followers.
* **Aspiring Course Builder (Seeker)** — needs ready‑made templates to jump‑start a new course. *Viral lever:* shares valuable finds with peers.
* **Community Curator / Growth Hacker** — scouts trending templates to showcase or analyze. *Viral lever:* publishes “Top 10” lists that link back to the site.

### Current hacks & pain points

* Scattered forum posts or Google Sheets; no central search.
* Template sales on Etsy/Gumroad behind paywalls.
* Reliance on personal networks; no feedback or quality signals.

### Initial outreach communities

1. **Skool official & topical groups**
2. **Facebook / Reddit course‑creator forums**
3. **Indie Hackers & Product Hunt** makers
4. **Skool affiliates / coaches** eager for new user incentives

---

## 2 · Must‑Have vs WOW Features (MoSCoW)

| Feature / Capability             | Priority        | Effort   | Notes / Viral Hooks                                                    |
| -------------------------------- | --------------- | -------- | ---------------------------------------------------------------------- |
| User auth + profiles (Supabase)  | **Must**        |  ≈1 day  | Required to post; minimal friction; public profiles enable recognition |
| Post a course‑share key          | **Must**        |  ≈2 days | Core CRUD; shareable detail URL                                        |
| Browse list of keys              | **Must**        |  ≈1 day  | SEO‑indexable public page                                              |
| Search by keyword                | **Must**        |  ≈1 day  | Postgres full‑text                                                     |
| Tagging & filter                 | **Should**      |  ≈1 day  | Enables topic niches & viral tag links                                 |
| Copy / import instructions       | **Should**      |  ≈½ day  | Reduces friction to use keys                                           |
| Basic upvote / like              | **Could**       |  ≈1 day  | Social proof; prepares for trending list                               |
| Leaderboard of top sharers       | **Could (WOW)** |  ≈2 days | Gamifies contributions; sharers brag externally                        |
| Contributor badges               | **Could**       |  ≈2 days | Further gamification                                                   |
| Social share buttons             | **Should**      |  ≈½ day  | One‑click virality                                                     |
| Moderation / report              | **Should**      |  ≈1 day  | Protects quality & safety                                              |
| Analytics dashboard              | **Should**      |  ≈1 day  | Track KPIs                                                             |
| Comments, follows, notifications | **Won’t (v1)**  | —        | Nice‑to‑have, defer                                                    |
| Any Skool API integration        | **Won’t**       | —        | Manual import only                                                     |
| Monetization/payments            | **Won’t**       | —        | Focus on engagement first                                              |

---

## 3 · Technical Requirements

### CRUD (CourseKeys)

* **Latency:** < 500 ms typical; 99 % uptime goal.
* **10 × peak:** Tens of writes & thousands of reads/day—well within Supabase free/pro tiers.
* **Schema:** `CourseKeys(id, title, description, share_key, tags[], author_id, created_at)`; `Users` profile table; optional `Likes`, `Reports`.

### Search & Filter

* Postgres full‑text on `title + description`; GIN index on `tags[]`.
* < 1 s queries; scalable to \~100 k rows before requiring external search.

### Authentication

* Supabase Auth (email magic‑link ± Google OAuth).
* RLS policies so users only edit their content; admin flag for moderation.

### Analytics

* External (Plausible / GA) for traffic.
* Optional `KeyEvents` table (`view`, `copy`, `like`) for trending logic.

---

## 4 · Tech‑Stack Options

| Approach                              | Dev Velocity    | Cost @ 10k MAU | SEO & SSR              | Ecosystem                |
| ------------------------------------- | --------------- | -------------- | ---------------------- | ------------------------ |
| **“Turbo Speed”** SPA + Supabase      | Fastest         | ≈ \$25/mo      | Weak SEO (client‑only) | Simple but limits growth |
| **“Balanced”** Next.js + Supabase     | **Recommended** | ≈ \$50‑70/mo   | Good SEO via SSR/ISR   | Strong DX & scale        |
| **“Enterprise‑ready”** micro‑services | Slow            | \$100‑300/mo   | Good                   | Overkill for solo MVP    |

**Why Balanced?** Combines quick dev, SEO for organic virality, server routes for future features, and easy Supabase scaling.

---

## 5 · Recommendation Logic

Next.js + Supabase lets a solo founder ship the core app in under two weeks while keeping pages crawlable for search‑driven growth. Built‑in auth, instant Postgres APIs, and Vercel edge caching handle a 10 × viral spike without rewrites. The stack is flexible for adding leaderboards, badges, or premium analytics later, and upgrades linearly (Supabase Pro tier, Vercel Pro) as the user base grows.

---

## 6 · 14‑Day Delivery Plan

| Day       | Focus & Key Tasks                                               |
| --------- | --------------------------------------------------------------- |
| **1‑2**   | Project scaffold, Supabase setup, hello‑world query             |
| **3‑5**   | Build auth, post form, list view, detail page                   |
| **6‑7**   | Implement search, tags, initial seed content                    |
| **8**     | Friends‑&‑family beta, collect bug + UX feedback                |
| **9‑10**  | Fixes, mobile polish, add likes or share buttons, add analytics |
| **11**    | Write FAQ, prep launch posts, final content pass                |
| **12**    | Public launch (Skool forum, FB groups, X, PH)                   |
| **13‑14** | Triage feedback, patch bugs, measure KPIs                       |

### Success metrics

* Sign‑ups & **keys shared** (target ≥ 20 in week 1)
* DAU/WAU & retention
* Page‑share / referral traffic (viral coefficient)

### Top risks & mitigations

* **Empty library:** seed content pre‑launch
* **Spam:** login‑gated posting, report button, manual moderation
* **Scaling:** easy Supabase/Vercel upgrades
* **Skool changes:** keep import manual, build rapport with Skool team

---

## 7 · Appendix

### Skool context

* No public API; sharing keys is manual & TOS‑compliant.
* Analog: Canvas LMS “Commons” shows demand for template hubs.

### Early monetization ideas

1. **Promoted listings / featured tags**
2. **Community sponsorships / newsletter slots**
3. **Premium analytics & trend reports**
4. (Later) Paid template marketplace with revenue‑share
