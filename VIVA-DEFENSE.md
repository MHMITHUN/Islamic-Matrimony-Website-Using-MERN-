# Nikah — Viva Defense Script (updated for the current build)

> Prepared for the SDP defense. Read the **Thesis** lines aloud — they are the
> spine of the whole defense. This version reflects **what is actually built
> today**, verified from the code (May 2025 sprint — Tazkiya, Marriage Journey,
> Guardian Portal, Sukoon, Bengali i18n, admin analytics are all live).
>
> **What changed since the last version:** the four flagships were pitched as
> "unique thoughts." They are now **implemented**. So the defense moves from
> *vision* to *demonstration* — every flagship below has real models, routes,
> and UI you can show live.

---

## 🏆 THE 4 FLAGSHIPS (lead with these — they are now BUILT)

The foundational Islamic features (deen matching, wali, verification, guidance)
are **table-stakes** — necessary but not enough to beat Biyeta. To win, Nikah
**reframes the product category** with four flagship platforms. Each is a
distinct category where Nikah is the FIRST mover, and each is now in the codebase.

### Flagship 1 — Family-First (Guardian-Led) ✅ BUILT
> **Thesis: *"Biyeta connects two singles. Nikah connects two families."***

Marriage in BD Muslim culture is between **families**, not just two people.
Nikah gives guardians their OWN logged-in portal — not just an approval click.

**Two real subsystems (know the difference — examiners confuse them):**
1. **Wali magic-link approval** — a per-contact-request consent gate. If a
   profile has `waliEnabled`, a contact request lands as `wali_pending` and a
   single-use token (`crypto.randomUUID()`) is generated. The guardian opens a
   **public** page (`/wali/approve/:token`, no login needed), sees the suitor's
   intent, and Approves/Declines. Contact info is shared **only after** approval.
   → `server/models/WaliApproval.js`, `server/routes/wali.js`,
   `server/routes/contactRequest.js`, `client/src/pages/Wali/WaliDecision.jsx`.
2. **Guardian Portal** — the full vision. A guardian *registers as a guardian
   role*, invites a ward by email, the ward approves the link, and then the
   guardian can **browse ranked matches on the ward's behalf, shortlist them,
   view the ward's incoming contact requests, and run family-to-family chat.**
   The `GuardianLink` model even carries a `permissions` object:
   `{ browse, shortlist, viewRequests, familyChat }`.
   → `server/models/GuardianLink.js`, `server/routes/guardian.js` (331 lines,
   14 endpoints), `client/src/pages/Dashboard/Guardian/*` (Overview, Wards,
   Browse, Shortlist, Requests, FamilyChat).

**Family-to-family chat is real:** `FamilyThread` + `Message.familyThreadId`,
with a two-pane chat UI (5s polling). Messages are signed `"Name (Guardian)"`.

**Business value & moat:** a **network effect** competitors cannot copy
overnight — every single user potentially onboards a family, multiplying
engagement and switching cost. Premium "guardian tier" is a clean revenue line.
And it is *product-market fit*: in BD Muslim culture the family decides, so a
product built around the family wins the culture Biyeta ignores.

**Demo:** guardian invites ward → ward approves via magic link → guardian
browses compatibility-ranked candidates → shortlists → family chat.

### Flagship 2 — Tazkiya Trust Network ✅ BUILT
> **Thesis: *"Biyeta verifies an ID. Nikah verifies a character."***

Trust is the **#1 pain** in this market — fake profiles are Biyeta's most
criticized weakness. Nikah turns trust into a **reputation graph**: members earn
a trust score through character endorsements from verified members **plus imam
attestations** (the Islamic concept of *tazkiya* — a person of good character
vouching for another).

**How the score works (know the numbers):**
- Everyone starts at **BASE = 5**.
- A **member endorsement** adds `round(endorser's trust / 5) + 1` — so a
  high-trust member's vouch is worth more than a newcomer's.
- An **imam attestation** adds a flat **10** — one imam ≈ a very high-trust
  member. *Imam endorsement is deliberately the heaviest weight.*
- Tiers: **bronze ≥ 10**, **silver ≥ 25**, **gold ≥ 50**.
- The score is recomputed on every endorsement / revoke, and cached on both the
  `User` and `Biodata` so directories can sort/filter by trust instantly.
  → engine: `server/lib/trust.js` (`computeTrust`, `weightOf`, `tierFor`).
  → model: `server/models/Endorsement.js` (categories: honest, prays_regularly,
  good_character, good_family, knowledgeable_deen).
  → imam attests via `server/routes/serviceProvider.js` `/attest/:biodataId`
  (guarded by `verifyImam`).
  → UI: `client/src/pages/Dashboard/User/TrustDashboard.jsx` (score ring +
  category breakdown + revoke), imam's `ImamDashboard.jsx` (Attestation
  Console), `TazkiyaBadge.jsx` on profiles.

**Business value & moat:** trust is the textbook **defensible moat** —
(1) **hard to fake** (it accumulates from real relationships),
(2) **viral** (you invite people to vouch for you → free acquisition),
(3) **monetizable** (premium Tazkiya-verified tier + paid imam partnerships).
It directly attacks Biyeta's #1 weakness and turns it into Nikah's #1 asset.

**Demo:** endorse a profile → tier rises → imam attests → big jump → revoke →
score recomputes live.

### Flagship 3 — Nikah Completion Platform (headline business model) ✅ BUILT
> **Thesis: *"Biyeta gets you a chat. Nikah gets you a nikah."***

Every app stops at "match + chat." Nikah takes you **all the way to the nikah**:
when an admin approves a contact, a **marriage journey auto-starts** and advances
through six real stages, each gated on a real artifact:

```
connected → supervised_intro → counseling → mahr_agreed → kazi_booked → nikah_registered
```

- **Counseling stage** → book a counselor (journey-scoped booking).
- **Mahr stage** → a **mahr agreement module**: both parties set the amount/type
  (real Islamic categories: *Mahr-e-mithl*, *deferred/mu'ajjal*, etc.) and must
  **both confirm** before the journey advances. The mahr is the wife's Qur'anic
  right (4:4) — surfacing it transparently *before* commitment is itself Islamic
  value.
- **Kazi stage** → book a kazi; a confirmed booking unlocks the final stage.
- **Readiness** → a **5-module premarital course** (Purpose of Marriage,
  Choosing a Spouse, Mahr, Rights & Responsibilities, Conflict Resolution — each
  with Qur'an/hadith citations + a comprehension question) that issues a
  **marriage-readiness badge** on completion.
- **Final stage** → `nikah_registered`, journey marked complete, and a success
  story auto-created.

→ `server/models/MarriageJourney.js` (STAGES), `server/lib/journey.js`
(`createJourneyFromRequest`, idempotent), `server/routes/marriageJourney.js`
(forward-only guards), `MahrAgreement.js` + `routes/mahr.js`,
`CourseEnrollment.js` + `routes/course.js`, `Booking.js` + `routes/booking.js`.
→ UI: `JourneyTracker.jsx` (6-step stepper), `MahrWidget.jsx`,
`PremaritalCourse.jsx`, `BookingWidget.jsx`.

**The marketplace:** a shared **service-provider directory** of imams, kazis and
counselors (`/imams`, `/kazi`, `/counselors`), public "apply as provider",
admin approval + verify, and **pending-count badges** on the admin sidebar so new
applications surface instantly. → `server/models/ServiceProvider.js`,
`server/routes/serviceProvider.js`, `client/src/pages/{Imam,Kazi,Counselor}Directory/`,
`ManageProviders.jsx`.

**Business value & moat:** this is the biggest commercial move. Nikah stops
competing for a one-off subscription and starts capturing the **entire wedding
economy** — counselor commissions, kazi commissions, document services, and a
premium journey tier. The lifetime value of a couple goes from "one
subscription" to "the whole path to nikah." No competitor has this pipeline.

**Demo:** approve a contact → journey auto-starts → stepper advances through
counseling → mahr (both confirm) → course badge → kazi booked → nikah registered.

### Flagship 4 — Sukoon (Dignified Second-Marriage Channel) ✅ BUILT
> **Thesis: *"Everyone serves the first marriage. Nikah serves the ones Islam doesn't forget."***

A private, dignity-first channel for **divorcees, widows, and those seeking
polygyny** — a large, underserved, stigmatized market every competitor ignores.
Islam dignifies remarriage; Sukoon gives it a respectable home.

- Members opt into Sukoon and choose a **photo rule**: `blurred` /
  `verified_only` / `full`.
- On the `/sukoon` browse page, photos are **blurred and names masked**
  ("Member #51") until the member approves a **reveal request**.
- Reveal is a real consent flow: requester asks → target sees it in their
  `SukoonRequests` inbox → Approve pushes the requester into
  `sukoonRevealedTo[]` → identity unlocks for that person only.
  → `server/models/SukoonRevealRequest.js`, `server/routes/sukoon.js`,
  `client/src/pages/Sukoon/Sukoon.jsx`, `SukoonRequests.jsx`, `AdminSukoon.jsx`.

**Business value & moat:** a **high-intent, low-churn, under-served segment** —
these users are serious (not browsing for fun), so conversion and retention are
higher than the generic pool. First-mover in a category no one else will touch,
plus a premium Sukoon tier.

**Demo:** enable Sukoon → blurred browse → request reveal → member approves →
identity unlocks.

---

## Business model — one line per flagship (and the moat)

| # | Flagship | Revenue line | Why it's defensible |
|---|----------|--------------|---------------------|
| 1 | Family-First | Family accounts + premium guardian tier | Network effect — each user brings a family |
| 2 | Tazkiya | Premium verified tier + imam partnerships | Trust accumulates; can't be faked; viral |
| 3 | Completion | Counselor/kazi commissions + document services + premium journey | Captures the whole wedding economy, not a sub |
| 4 | Sukoon | Premium Sukoon tier | High-intent, under-served, low-churn segment |

**The one-sentence business thesis:** *Biyeta monetizes a subscription to a chat
box. Nikah monetizes the entire halal path from first profile to registered
nikah — so it earns at every stage a couple passes through.*

---

## The one-line thesis (memorize this)

> **"Other platforms are matrimony sites that happen to allow Muslims.
> Nikah is an Islamic marriage process that happens to use software."**

The weakness of every competitor: they treat "Muslim" as a *search filter*
bolted onto a generic dating engine. Nikah bakes Islamic requirements — wali
consent, deen matching, halal communication, verification, mahr, tazkiya — into
the **core flow**. That is the difference between **Islamic-by-filter** and
**Islamic-by-design**.

---

## Question 1 — How is Nikah different from other matrimony platforms?

### Five concrete pillars (name them one by one)

| # | Pillar | What competitors do | What Nikah does |
|---|--------|---------------------|-----------------|
| 1 | **Wali / guardian oversight in the contact flow** | Biyeta/Shaadi: none. Muzz: optional "chaperone". | Every contact to a wali-protected profile goes to the guardian via a single-use token; contact info is shared **only after** approval. Plus a full guardian portal (browse/shortlist/family-chat on the ward's behalf). |
| 2 | **Deen-compatibility algorithm** | Free-text search + age/location filters. Religion is a checkbox, never a scoring factor. | A weighted 0–100 score where **deen is the largest factor at 35%** (age 25, height 15, division 15, occupation 10). Inside deen: sect 40%, prayer 25%, commitment 25%, religious education 10%. |
| 3 | **Verified profile + Tazkiya trust** | Biyeta's fake-profile problem; weak verification elsewhere. | Three verification methods (NID / imam / community-leader) **plus** an earned character-trust graph (endorsements + imam *tazkiya*) with bronze/silver/gold tiers. |
| 4 | **Halal communication** | Open free-text chat from message one. | Respectful bilingual **message templates** (marriage-intent phrasing), optional **CC-the-wali**, and a `isTemplateMessage` flag persisted on the message. |
| 5 | **Islamic guidance hub + completion platform** | Matchmaking only. | A bilingual, referenced content hub (6 articles) **plus** the marriage-journey platform that takes a couple all the way to a registered nikah. |

### Competitor comparison (point to Table 1 in the report)

- **Shaadi.com** — generic, expensive, English-only, not Islam-specific.
- **Muslima.com** — Muslim audience but outdated, costly, weak Bangla.
- **Biyeta (BD)** — *the* closest competitor. Largest BD Muslim user base, but
  fake-profile complaints, weak verification, **no structured compatibility
  algorithm**, **no wali-in-the-loop**, **no trust graph**, **no journey beyond
  chat**, costly premium. ← lead with this one.
- **Muzz (Muzmatch)** — has a chaperone feature, but casual-dating framing,
  app-only, premium-heavy, weak Bangla.
- **Tinder/Bumble** — not for marriage, no Islamic alignment.

### The clincher sentence for Q1

> "We did not add Islamic features to a matrimony site. We built an Islamic
> marriage process and delivered it as software. Every competitor does matching
> first and Islam second; we do Islam first and matching second — and the
> matching itself is religion-weighted. Then we go further than any of them:
> we take the couple all the way to the nikah."

---

## Question 2 — What Islamic / halal value does the "Nikah" name actually create?

### Feature → Islamic principle mapping (point to Table 2 in the report)

| Module | Islamic principle (cite the source) |
|--------|--------------------------------------|
| **Deen-compatibility matching** | The Prophet (ﷺ) said: *"A woman is married for four things — her wealth, her lineage, her beauty and her religious commitment; so marry the religious one, you will prosper"* (Sahih al-Bukhari **5090**). **Our algorithm is the code implementation of this hadith** — religion is the #1 scoring factor (35%). |
| **Wali (guardian) oversight** | A valid nikah requires the wali's consent (Qur'an **4:25**; *"there is no marriage without a wali"* — Abu Dawud). We model it as a **real approval workflow** (token + decision page), not a label — and a full guardian portal on top. |
| **Contact gating (hijab)** | Personal contact info is hidden until an approved/verified/premium request — modesty and consent, never casual exposure. |
| **Halal communication** | Bilingual templates + wali-CC discourage casual mixing (the haram pattern). Intent = marriage from the first message. |
| **Mahr agreement module** | The mahr is the wife's Qur'anic right (Qur'an **4:4**). We don't just ask a preference — we provide a **both-party-confirmed agreement** with real Islamic mahr types, *before* commitment. |
| **Tazkiya trust network** | *Tazkiya* — a respected person vouching for another's character — is an established Islamic practice. Imam attestations carry the highest weight, exactly as a community's imam would in real life. |
| **Profile verification** | Deception (*ghish*) is haram. NID/imam verification combats fake profiles. |
| **Premarital course + guidance hub** | *Sadaqah jariyah* — education on halal marriage as continuous charity. |
| **Sukoon (second-marriage channel)** | Islam dignifies remarriage; the Prophet (ﷺ) married widows and divorcees. Sukoon gives that dignity a respectable, private home. |

### The killer line for Q2 (say this verbatim)

> "Our matching algorithm is not just code — it is the direct implementation of
> the Prophet's command to prioritize religion in a spouse (Bukhari 5090). And
> we didn't stop at matching: every Islamic requirement — wali consent, mahr,
> tazkiya, halal communication — is built into the **process**, not bolted on as
> a filter. That is our unique Islamic value."

### Supporting frame

- The hadith *"marriage completes half of one's religion"* (al-Bayhaqi) is the
  motivation: a tool that helps Muslims complete that half *halal*ly is itself
  an act of worship.
- Wali oversight is modeled as a **real workflow** (magic-link approval +
  guardian portal), not a marketing claim.
- The **deen-weighted matching** is the headline; the journey, tazkiya, and
  Sukoon are how we extend Islamic value *beyond* the match.

---

## The tech stack (examiners always ask — know it cold)

| Layer | Stack |
|-------|-------|
| **Backend** | Node.js + **Express 5.2** + **Mongoose 9 / MongoDB**. Auth via **JWT** (`jsonwebtoken`) + `bcryptjs`. Payments via **Stripe** (server) + `@stripe/react-stripe-js` (client). Google auth via **Firebase**. |
| **Frontend** | **React 18.3** + **Vite 7** + **react-router-dom 7**. Server state via **@tanstack/react-query 5** (no Redux — Query + Context). HTTP via `axios`. |
| **UI** | **shadcn/ui** pattern on **Radix UI** primitives + **Tailwind CSS 3.4** + `class-variance-authority`. Icons: `lucide-react` + `react-icons`. Animation: `framer-motion`. Charts: **recharts** (admin analytics). |
| **i18n** | A custom, dependency-free `useLanguage` hook (`LanguageContext.jsx`) with full **Bengali** (`bn.json`, ~1000 lines, complete key parity) + `LanguageToggle`. Bengali typography via `@fontsource/noto-sans-bengali`. |
| **Architecture** | REST API (`/api/*`), role-based middleware (`verifyAdmin`, `verifyImam`, `verifyGuardian`), Mongoose models in `server/models/`, business logic in `server/lib/` (e.g. `compatibility.js`, `trust.js`, `journey.js`). |

**Why these choices (defend if asked):** React Query gives a caching server-state layer without Redux's boilerplate; shadcn/Radix gives accessible, ownable components instead of a heavy UI framework; a custom i18n hook avoids the `react-i18next` dependency while keeping full Bengali coverage; Mongoose keeps the schema logic explainable (important — the matching and trust *are* the schema).

---

## Anticipated follow-up questions (with crisp answers)

**Q: Is the wali feature only for women?**
A: No. Any member can enable wali oversight. It defaults to the Islamic model
(the bride's guardian), but the architecture is gender-neutral and opt-in — so
it serves everyone while respecting fiqh.

**Q: How is "halal communication" actually enforced — can't people just type anything?**
A: We don't censor; we *nudge and structure*. The first message is scaffolded
by a respectful template (`server/routes/message.js` TEMPLATES); the sender can
CC the wali; an etiquette banner sets expectations. Combined with contact gating
and wali oversight, the default interaction is purposeful. Guardrails, not
censorship — an honest, defensible answer.

**Q: Isn't the Islamic part just a filter, like every other site?**
A: No. A filter is applied *after* the matching engine runs. Here religion is
*inside* the scoring function, weighted highest (35%) — and inside *deen*
itself, sect/prayer/commitment are sub-weighted. That is the difference between
filtering results and ranking by religion.

**Q: How do you handle fake profiles? (Biyeta's weakness)**
A: **Two layers.** (1) Profile verification — NID / imam / community-leader
reference, admin-approved, badge shown. (2) The **Tazkiya trust network** — a
character score from endorsements + imam attestations, so the *community* itself
signals who is trustworthy, not just an ID check.

**Q: Why these exact match weights (35/25/15/15/10)?**
A: Deen is dominant because the hadith gives it primacy; age and location are
practical must-haves; height/occupation are tie-breakers. The weights are a
deliberate, transparent, **tunable** design decision — and they live in one
constant (`WEIGHTS` in `server/lib/compatibility.js`).

**Q: Does the matching work for old profiles that didn't fill the Deen fields?**
A: Yes — every factor is guarded and the score is **self-normalizing**: it
divides only by the weights actually computable, so a profile without Deen data
is matched on the secular factors *without penalty*. Backward-compatible by
design.

**Q: How does the Tazkiya trust score stay accurate over time?**
A: It recomputes on every endorsement and every revoke (event-driven), and an
endorsement's weight is **frozen at submit time** (snapshot of the endorser's
trust then) — so you can't inflate a friend's score later by gaming your own.
Revoking an endorsement immediately drops it out (soft delete, `status='revoked'`).

**Q: Is the guardian portal a real product or just an approval button?**
A: It's a real product. A guardian registers as a `guardian` role, gets linked
to a ward through a consent flow, and then has a full dashboard: browse
compatibility-ranked candidates on the ward's behalf, shortlist them, see the
ward's contact requests, and family-to-family chat. The `GuardianLink` model
even carries per-capability permissions.

**Q: What actually happens when a contact is approved?**
A: An admin approves the contact request → `createJourneyFromRequest()` auto-
starts a marriage journey at the `connected` stage → the couple advances through
counseling → mahr (both confirm) → kazi booked → nikah registered, with a
readiness course and badge along the way. The journey is idempotent (one per
contact request).

**Q: Is wali / guardian email delivery real?**
A: The token mechanism and approval flow are fully real. Email *sending* is
stubbed in the demo (no SMTP key); the magic link is surfaced in the member's
dashboard to copy/forward manually. Honestly documented as a demo limitation.

**Q: Where's the actual code for X?**
A: Know these paths cold (see the next section).

---

## Demo script (the ~7-minute walk-through — built around what's LIVE)

1. **Biodata → Deen & Islamic Profile** (30s)
   Show marital status, sect, prayer frequency, religious commitment, mahr
   preference. *Say:* "Every profile captures religious detail — not just age
   and photo."

2. **Matches → Deen chip + the 35% weighting** (30s)
   Point to the Deen Match indicator. *Say:* "Religion is the largest scoring
   factor — Bukhari 5090 implemented as code in `lib/compatibility.js`."

3. **Tazkiya Trust Dashboard** (60s) ← *NEW, flagship*
   Open `/dashboard/trust`. Show the score ring + tier (bronze/silver/gold) +
   category breakdown. Endorse a profile from the public profile page → come
   back → score rises. Switch to imam dashboard → attest → big jump. Revoke →
   recomputes. *Say:* "Trust as a reputation graph — Biyeta's #1 weakness,
   turned into our moat."

4. **Guardian Portal** (60s) ← *NEW, flagship*
   Log in as a guardian → invite a ward (copy magic link) → approve → browse
   ranked candidates for the ward → shortlist → open family chat.
   *Say:* "We connect two families, not two singles."

5. **Marriage Journey tracker** (75s) ← *NEW, flagship*
   Approve a contact (admin) → journey auto-starts → walk the stepper:
   counseling booking → mahr agreement (both confirm) → premarital course badge
   → kazi booked → nikah registered. *Say:* "Biyeta gets you a chat. We get you
   a nikah — and capture the wedding economy."

6. **Sukoon channel** (45s) ← *NEW, flagship*
   Open `/sukoon` → blurred photos + masked names → request reveal → switch to
   the member's SukoonRequests inbox → approve → identity unlocks.
   *Say:* "A dignified home for the segment everyone else ignores."

7. **Wali approval + Verification + Guidance** (60s)
   Enable wali oversight → copy magic link → open the public approval page →
   approve. Then submit verification → admin approve → badge. Then `/guidance` →
   "Choosing a Spouse" → point to the Bukhari 5090 reference.
   *Say:* "Guardian consent, anti-fake trust, and cited guidance — all real."

8. **(If time) Admin analytics + Bengali toggle** (30s)
   Admin dashboard → recharts (user growth, gender split) + pending-count
   badges. Hit the EN/বাংলা toggle → the whole app flips, including the
   service directories. *Say:* "Operationally complete, and bilingual end-to-end."

---

## "Where's the actual code for X?" (verified paths — memorize these)

| Feature | File(s) |
|---------|---------|
| **Deen matching algorithm** | `server/lib/compatibility.js` (`calculateCompatibility`, `deenSubFactor`, `WEIGHTS`). *Note:* `server/routes/match.js` only imports it. |
| **Islamic biodata fields** | `server/models/Biodata.js` (the "Islamic / Deen Profile" block). |
| **Wali magic-link flow** | `server/models/WaliApproval.js`, `server/routes/wali.js`, gating in `server/routes/contactRequest.js`, `client/src/pages/Wali/WaliDecision.jsx`. |
| **Guardian portal** | `server/models/GuardianLink.js`, `server/routes/guardian.js`, `server/models/{Shortlist,FamilyThread}.js`, `client/src/pages/Dashboard/Guardian/*`. |
| **Tazkiya trust** | `server/lib/trust.js`, `server/models/Endorsement.js`, `server/routes/endorsement.js`, imam `/attest` in `server/routes/serviceProvider.js`, `client/src/pages/Dashboard/User/TrustDashboard.jsx`. |
| **Verification** | `server/routes/biodata.js` (`/request-verification`) + `server/routes/admin.js` (approve/reject) + `client/src/pages/Dashboard/Admin/VerificationRequests.jsx`. |
| **Marriage journey** | `server/models/MarriageJourney.js` (STAGES), `server/lib/journey.js`, `server/routes/marriageJourney.js`, auto-start in `server/routes/admin.js` (`/approve-contact/:id`), `client/src/pages/Dashboard/User/JourneyTracker.jsx`. |
| **Mahr agreement** | `server/models/MahrAgreement.js`, `server/routes/mahr.js`, `client/src/components/journey/MahrWidget.jsx`. |
| **Premarital course** | `server/models/CourseEnrollment.js`, `server/routes/course.js`, `client/src/data/premaritalCourse.js`, `client/src/pages/Dashboard/User/PremaritalCourse.jsx`. |
| **Service marketplace** | `server/models/ServiceProvider.js`, `server/routes/serviceProvider.js`, `client/src/pages/{Imam,Kazi,Counselor}Directory/`, `client/src/pages/Dashboard/Admin/ManageProviders.jsx`. |
| **Bookings** | `server/models/Booking.js`, `server/routes/booking.js`, `client/src/components/journey/BookingWidget.jsx`. |
| **Sukoon** | `server/models/SukoonRevealRequest.js`, `server/routes/sukoon.js`, `client/src/pages/Sukoon/Sukoon.jsx`, `client/src/pages/Dashboard/User/SukoonRequests.jsx`. |
| **Halal communication** | `server/routes/message.js` (TEMPLATES, `/templates`, `waliCC`), `server/models/Message.js` (`isTemplateMessage`). |
| **Guidance hub** | `client/src/data/guidanceArticles.js` + `client/src/pages/Guidance/`. |
| **i18n / Bengali** | `client/src/contexts/LanguageContext.jsx` (`useLanguage`), `client/src/i18n/{en,bn}.json`, `client/src/components/LanguageToggle.jsx`. |
| **Admin analytics** | `client/src/pages/Dashboard/Admin/AdminDashboard.jsx` (recharts), pending counts in `server/routes/admin.js` (`/pending-counts`). |

---

## If they ask "what's NOT done" (be honest — it builds credibility)

- **Native mobile app** — the web app is responsive, but there's no iOS/Android app.
- **Real payments** — bookings auto-confirm with a stub `pi_demo_*` id; no live
  Stripe/bKash/Nagad charge in the demo.
- **Certificate is a print screen** — completing the journey/course sets a real
  `certificateIssued` flag, but there's no generated PDF/kabinnama document
  (only a `window.print()` panel). No PDF library in the repo.
- **Real-time chat** — messages use request-response polling (5s), not WebSockets.
- **Email sending is stubbed** — wali/guardian magic links are generated and
  surfaced for copy/paste; no SMTP wired (the token mechanism itself is real).
- **Sukoon blur is page-scoped** — blur + name masking is enforced on the
  `/sukoon` browse page, but the direct biodata detail route (`/api/biodata/:id`)
  does not yet apply Sukoon masking. Flagged as partial.
- **Trust is rule-based, not ML** — endorsements/weights are transparent and
  explainable, not a learned model. A deliberate, defensible choice, flagged as
  future work.
- **Admin can't moderate endorsements** — admins handle verification requests
  and providers, but there's no admin panel yet to list/revoke endorsements
  (members can revoke their own).
- **Guardian permission flags are modeled but not individually enforced** —
  routes check that *an* approved link exists, not each specific capability
  (browse/shortlist/etc.).

**Closing line:** "We were honest about scope. What IS done is the hard part —
four category-defining platforms, an Islamic-by-design core, full Bengali, and
an admin backend — and the limitations are deployment wiring (payments, email,
PDF, WebSockets), not missing product thinking."

---

## Final checklist before you walk in

- [ ] Memorize the **one-line thesis** and the **Bukhari 5090 → 35% deen** link.
- [ ] Know the **four flagships** + one business-moat sentence each.
- [ ] Know the **match weights** (35/25/15/15/10) and that the code is in
      `server/lib/compatibility.js`.
- [ ] Know the **trust tiers** (bronze 10 / silver 25 / gold 50) and that an
      **imam endorsement = 10**.
- [ ] Know the **six journey stages** in order.
- [ ] Have the **demo seed logins** ready (member, guardian, imam, admin) and
      the Gold-tier demo profile (`mhmmithun1@gmail.com`).
- [ ] Be ready to **point at real files** — use the table above.
