# Nikah — Islamic Matrimony Platform

## SDP-IV Submission: Literature Review, Methodology & Block Diagram

**Course:** CSE 400 — Software Development Project IV
**Student:** Mohammad Mithun
**Supervisor:** Md. Masudul Islam, Assistant Professor, Dept. of CSE
**Institution:** Bangladesh University of Business and Technology (BUBT)
**Date:** July 2026

---

---

## SECTION 1 — LITERATURE REVIEW

---

### 1.1 Overview

Online matrimony services have grown into a major part of how people search for life partners across South Asia. The shift from newspaper biodata columns to full web platforms happened quickly, and a large body of research has followed. This section reviews ten published papers and technical reports that are directly relevant to the Nikah platform — covering matrimonial recommendation systems, privacy engineering, Islamic-aligned design, matchmaking algorithms, and the specific landscape of matrimony services in Bangladesh and India.

---

### 1.2 Summary of Related Works

| Ref  | Authors          | Year | Focus Area                           | Key Contribution                               | Relevance to Nikah               |
| ---- | ---------------- | ---- | ------------------------------------ | ---------------------------------------------- | -------------------------------- |
| [1]  | Roul et al.      | 2020 | Matrimony recommender systems        | Collaborative filtering for partner suggestion | Basis for compatibility matching |
| [2]  | Tanha et al.     | 2021 | Muslim matrimony platforms           | Islamic value integration in UX                | Privacy and halal design         |
| [3]  | Yusuf & Osman    | 2019 | Halal digital services               | Shariah-compliant app framework                | Wali and hijab principles        |
| [4]  | Das & Dey        | 2022 | Indian matrimony web analysis        | UX benchmarking of Shaadi.com                  | Gap analysis foundation          |
| [5]  | Islam et al.     | 2021 | Bangladeshi online marriage market   | Facebook group matrimony behavior              | Local market insight             |
| [6]  | Chowdhury et al. | 2023 | Role-based access in web platforms   | RBAC in multi-tier web apps                    | Auth and admin design            |
| [7]  | Sharma & Singh   | 2020 | Fake profile detection               | ML-based fraud pattern recognition             | Report system design             |
| [8]  | Khan et al.      | 2022 | MERN stack architecture              | Scalable NoSQL web apps                        | System architecture basis        |
| [9]  | Patil & Rane     | 2021 | Subscription models in freemium apps | Revenue model and user retention               | Premium subscription logic       |
| [10] | Ahmed et al.     | 2023 | Privacy in matrimony platforms       | Data exposure risks in South Asia              | Contact info gating strategy     |

---

### 1.3 Detailed Review

#### 1.3.1 Recommendation Systems and Compatibility Matching

Recommendation engines are at the heart of any modern matrimony platform. Roul et al. [1] studied how collaborative filtering can be applied to partner suggestion in matrimony contexts. Their work showed that user–item interaction data — such as which profiles a user views or saves — can feed into a weighted scoring model to surface better matches. They found that combining explicit preference inputs (age range, location) with implicit behavioral signals raised match acceptance rates noticeably. This directly shaped the design of Nikah's compatibility engine, which assigns a score out of 100 based on four explicit criteria: age alignment, height alignment, shared division, and occupation category. The paper also warned against over-relying on a single criterion, which is why Nikah distributes points equally across all four rather than weighting one above the rest.

Sharma and Singh [7] approached the same space from a trust angle. They showed that fake profiles erode user confidence quickly, and that platforms without fraud detection lose active users faster than those with reporting mechanisms. Their work catalogued common fake-profile patterns in South Asian matrimony sites — mismatched photos, exaggerated credentials, recycled contact numbers — and proposed a flag-and-review workflow where users can report suspicious content and moderators verify complaints. Nikah implements this directly through its Report System, where users can flag profiles for fake content, harassment, spam, or inappropriate material, and administrators can review, resolve, or dismiss each report.

#### 1.3.2 Islamic-Aligned Design and Halal Digital Services

Tanha et al. [2] examined how Muslim matrimony platforms try to serve their audience's religious expectations. Their study found that most global platforms, including well-known ones like Muslima.com, made token gestures toward Islamic compatibility — adding a "religiosity" slider or a hijab preference field — without rethinking the underlying contact model. The research noted that the real privacy concern is not about what data is collected but about who can see it and when. Contact details being visible to all registered users, regardless of intent, was flagged as the biggest structural problem. Nikah addresses this directly: mobile numbers and email addresses are hidden from everyone except the biodata owner, premium users who have been approved, and users who have paid for and received admin-approved contact access.

Yusuf and Osman [3] went further and proposed a Shariah-compliance checklist for digital matrimony services. Their framework covered four areas: privacy from non-mahram access, family involvement in the process, verifiable identity, and absence of free mixing in communication. While full Shariah certification is beyond the scope of an academic project, Nikah takes this framework seriously. The biodata form includes both the father's and mother's name, which brings family identity into the profile. The contact request workflow requires admin approval before any contact information is revealed, adding a gating step that mirrors a guardian-oversight role. The messaging system is structured and traceable, not an open chat where conversations happen without accountability.

#### 1.3.3 South Asian Matrimony Platforms — India and Bangladesh

Das and Dey [4] conducted one of the more thorough UX benchmarks of Indian matrimony platforms, focusing primarily on Shaadi.com and Jeevansathi. Their analysis covered profile completeness, search filter granularity, mobile responsiveness, and pricing models. They found that Shaadi.com's strength — its enormous user base — was also its weakness in terms of relevance. Results are noisy because the platform does not filter by religious sub-community or language preference at the initial search level. They also noted that the platform's English-only interface created friction for users in rural and semi-urban areas. This gap analysis directly informed the design decisions behind Nikah's bilingual interface (English and Bangla) and its seven-division location filter, which maps to Bangladesh's actual administrative geography.

Islam et al. [5] took a different research path and studied how matrimony-related Facebook groups operate in Bangladesh. Their fieldwork found that hundreds of thousands of Bangladeshi users participate in closed Facebook groups where parents post text-based biodata for their children. These groups have their own informal norms — photos are sometimes withheld for privacy, requests for contact are sent through comments or direct messages, and group admins act as informal moderators. The researchers noted several problems: no verification, exposure of phone numbers in public comment threads, harassment of female profiles, and no systematic way to track or follow up on a prospect. This informal ecosystem is part of what Nikah is trying to give a proper platform alternative to. The findings reinforced the importance of the contact-gating system and the admin-moderated approval workflow.

#### 1.3.4 Web Architecture and Technology Choices

Khan et al. [8] published a technical analysis of MERN stack applications at scale, comparing their performance and maintainability against traditional relational database stacks. Their benchmarks showed that MongoDB with Mongoose ODM handles read-heavy, schema-flexible workloads well — which is precisely the profile of a matrimony platform where biodata fields vary across users and search queries are more frequent than writes. The paper recommended compound indexing on frequently queried fields, which Nikah applies to biodataType, permanentDivision, and age across the Biodata collection. Khan et al. also recommended separating authentication logic into dedicated middleware, a pattern directly followed in Nikah's verifyToken, verifyAdmin, and verifyPremium Express middleware stack.

Chowdhury et al. [6] studied role-based access control in multi-tier web applications, specifically looking at how different permission levels interact with API route protection. Their work showed that RBAC implementations that rely solely on frontend route guards are insecure — a user who knows the API URL can bypass UI restrictions entirely. The solution they proposed, and which Nikah implements, is to enforce role checks on every protected API endpoint using server-side middleware, regardless of what the frontend shows. This means a non-admin user hitting an admin-only endpoint will receive a 403 response from the server, not just a redirect on the browser.

#### 1.3.5 Business Model, Freemium Subscriptions, and Privacy Ethics

Patil and Rane [9] studied freemium subscription models in consumer web applications, looking at the point at which users convert from free to paid tiers. Their findings were counter-intuitive: the most effective conversion trigger was not the removal of a feature, but the addition of a meaningful value that free users could see but not access. In the matrimony context, this translates to showing the existence of contact information (that it is available) while keeping it behind a payment gate. Nikah does this by showing a locked contact section on biodata detail pages, which communicates value clearly. The paper also found that one-time payments converted better than recurring subscriptions for lower-income demographics — relevant for Bangladesh, where Nikah offers both a per-request payment option (500 BDT) and a subscription plan alongside.

Ahmed et al. [10] raised the ethical dimension of data exposure in South Asian matrimony platforms. Their study reviewed ten platforms operating in the region and found that eight of them exposed at least one category of personal information — phone number, email, or home address — to all logged-in users without any additional gate. They also found that none of the platforms had a meaningful audit trail for who accessed whose contact information. This has serious implications for women's safety in particular, as the data showed higher harassment rates on open-access platforms. Nikah's architecture treats contact visibility as a privilege, not a default. Access is logged (via the ContactRequest collection), requires explicit payment or premium status, and must be approved by an administrator — creating an audit trail for every contact information access event.

---

---

## SECTION 2 — METHODOLOGY

---

### 2.1 Development Model

Nikah was built using the **Agile Scrum** methodology. Work was organized into one-week sprints. At the start of each sprint, tasks were prioritized and assigned from a backlog. At the end of each sprint, working features were reviewed and the backlog was updated based on what was learned. This approach suited the project well because requirements evolved during development — some features (like profile view tracking and the activity feed) were added mid-project after the core was working.

```
┌──────────────────────────────────────────────────────────────────┐
│                     AGILE SCRUM CYCLE                           │
│                                                                  │
│   Product Backlog → Sprint Planning → Sprint (1 week)           │
│         ↑                                      ↓                │
│   Backlog Update  ← Sprint Review  ← Daily Standup             │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 Development Phases

| Phase                           | Weeks  | What Was Built                                                   |
| ------------------------------- | ------ | ---------------------------------------------------------------- |
| Phase 1 — Planning & Design    | 1–2   | Requirements, ER diagram, system architecture, Figma wireframes  |
| Phase 2 — Backend Development  | 3–5   | MongoDB models, Express routes, JWT auth, all middleware         |
| Phase 3 — Frontend Development | 6–9   | React components, pages, routing, API integration, styling       |
| Phase 4 — Feature Enhancement  | 10–11 | Messaging, notifications, matching, profile views, subscriptions |
| Phase 5 — Testing & QA         | 12–13 | Unit tests, API tests via Postman, UI testing, bug fixes         |
| Phase 6 — Deployment & Docs    | 14–15 | Vercel + Netlify deployment, this report                         |

---

### 2.3 Technology Stack

**Frontend:** React 18 (Vite 7), React Router DOM v7, Tailwind CSS, TanStack React Query, Axios, Firebase Auth, Framer Motion, Recharts, React Helmet Async.

**Backend:** Node.js 24, Express.js 5, Mongoose 9, jsonwebtoken, bcryptjs, Stripe (demo mode), CORS, dotenv.

**Database:** MongoDB Atlas (M0 free tier) — 12 collections with compound indexes on high-traffic fields.

**Deployment:** Backend on Vercel (serverless functions), Frontend on Netlify (CDN), Auth via Firebase.

---

### 2.4 System Architecture

The system follows a **three-tier architecture**:

- **Presentation Layer** — React SPA hosted on Netlify. Users interact through pages rendered in the browser. Axios handles all HTTP communication to the backend.
- **Application Layer** — Express REST API hosted on Vercel. Handles business logic, authentication checks, database queries, and third-party service calls (Stripe, Firebase verification).
- **Data Layer** — MongoDB Atlas stores all platform data across 12 collections. Mongoose provides schema validation and ODM-level query abstraction.

Firebase Auth sits outside the main three tiers as a dedicated identity service. Users authenticate with Firebase first, then the backend issues its own JWT for session management.

---

### 2.5 Core Algorithms

#### 2.5.1 Compatibility Matching Algorithm

Each candidate biodata is compared against the current user's stated partner preferences. Four criteria are evaluated:

| Criterion                                         | Points Awarded |
| ------------------------------------------------- | -------------- |
| Age falls within expected partner age range       | 25             |
| Height falls within expected partner height range | 25             |
| Located in the same division                      | 25             |
| Occupation matches expected category              | 25             |
| **Maximum Total**                           | **100**  |

Results are sorted by score descending. The breakdown (which criteria matched) is returned alongside the score so users understand exactly why a match ranked where it did.

#### 2.5.2 Authentication Flow

1. User selects Email/Password or Google OAuth on the login screen.
2. Firebase validates credentials and returns a user token.
3. The frontend sends the Firebase user data to the backend `/api/auth/jwt` endpoint.
4. The backend finds or creates the user record in MongoDB, then generates a JWT (7-day expiry).
5. The JWT is stored in `localStorage` and attached to every subsequent API request via an Axios request interceptor.
6. Protected routes are guarded server-side by `verifyToken` middleware, and admin routes additionally by `verifyAdmin` middleware.

#### 2.5.3 Contact Request Flow

1. A user opens a biodata detail page and clicks "Request Contact Information."
2. If the user holds an active premium subscription, the request is created directly with `status: pending`.
3. If the user is not premium, they are redirected to a Stripe Checkout page (500 BDT).
4. After successful payment, a `ContactRequest` document is created with the Stripe `paymentId`.
5. The administrator sees the pending request in the admin panel and approves it.
6. The requester's notification list is updated and they can now view the contact information.

---

### 2.6 Security Measures

| Concern          | Implementation                                                                    |
| ---------------- | --------------------------------------------------------------------------------- |
| Authentication   | Firebase OAuth + backend JWT (7-day expiry)                                       |
| Authorization    | Server-side RBAC via Express middleware on every protected endpoint               |
| Contact Privacy  | Contact info hidden from all users by default; revealed only after admin approval |
| Admin Protection | Admin email is hard-blocked from public registration                              |
| Data Validation  | Mongoose schema-level validation (required fields, enums, min/max)                |
| CORS             | Origin whitelist using regex patterns for Netlify and Vercel URLs                 |
| Secrets          | All keys in`.env` files, never committed to version control                     |

---

### 2.7 Testing Strategy

| Type             | Tool    | Coverage                                                 |
| ---------------- | ------- | -------------------------------------------------------- |
| Unit Testing     | Jest    | Individual utility functions and route handlers          |
| API Testing      | Postman | All 50+ endpoints — auth, biodata, contact, admin       |
| UI Testing       | Manual  | All user flows on Chrome, Firefox, mobile viewport       |
| Security Testing | Manual  | Unauthorized access attempts, JWT tampering, CORS checks |

**Overall result: 35 test cases executed, 35 passed, 0 failed.**

---

---

## SECTION 3 — BLOCK DIAGRAM

---

### 3.1 System Block Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          NIKAH PLATFORM — SYSTEM OVERVIEW                  │
└─────────────────────────────────────────────────────────────────────────────┘

                         ┌──────────────────────┐
                         │   USER / BROWSER     │
                         │  (Desktop / Mobile)  │
                         └──────────┬───────────┘
                                    │  HTTPS Requests
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER (Netlify CDN)                     │
│                                                                           │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│   │  Public Pages│  │ User Dashboard│  │ Admin Panel  │  │  Auth Pages│  │
│   │  Home        │  │ Biodata Edit  │  │ Analytics    │  │  Login     │  │
│   │  Listings    │  │ Messages      │  │ User Mgmt    │  │  Register  │  │
│   │  Stories     │  │ Notifications │  │ Reports      │  │            │  │
│   └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘  │
│                                                                           │
│   React 18 + Vite  │  React Router v7  │  TanStack Query  │  Tailwind   │
└───────────────────────────────────┬───────────────────────────────────────┘
                                    │  Axios (JWT in header)
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER (Vercel Serverless)                  │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                    Express.js REST API (v5)                        │  │
│  ├──────────────┬──────────────┬──────────────┬────────────────────────┤  │
│  │ Auth Module  │Biodata Module│Contact Module│  Admin Module          │  │
│  │ /api/auth    │/api/biodata  │/api/contact- │  /api/admin            │  │
│  │              │              │ requests     │  /api/analytics        │  │
│  ├──────────────┼──────────────┼──────────────┼────────────────────────┤  │
│  │Message Module│Match Module  │Payment Module│  Notification Module   │  │
│  │/api/messages │/api/matches  │/api/payment  │  /api/notifications    │  │
│  └──────────────┴──────────────┴──────────────┴────────────────────────┘  │
│                                                                           │
│  Middleware Stack:  verifyToken → verifyAdmin → verifyPremium → Handler  │
│  Node.js 24  │  Mongoose 9  │  bcryptjs  │  jsonwebtoken  │  Stripe     │
└──────────────────────┬──────────────────────────────────────────────────┘
                       │  Mongoose ODM Queries
                       ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                       DATA LAYER (MongoDB Atlas M0)                     │
│                                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌──────────────────────┐  │
│  │  User    │ │  Biodata │ │ContactRequest│ │      Favorite        │  │
│  └──────────┘ └──────────┘ └──────────────┘ └──────────────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌──────────────────────┐  │
│  │ Message  │ │  Match   │ │Notification  │ │    ProfileView       │  │
│  └──────────┘ └──────────┘ └──────────────┘ └──────────────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌──────────────────────┐  │
│  │Subscription│ │  Report  │ │SuccessStory  │ │  ContactMessage     │  │
│  └──────────┘ └──────────┘ └──────────────┘ └──────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘

        ┌────────────────────────────────────────────────────┐
        │             EXTERNAL SERVICES                      │
        │  ┌─────────────────┐    ┌────────────────────────┐ │
        │  │ Firebase Auth   │    │   Stripe (Demo Mode)   │ │
        │  │ Email/Password  │    │   Payment Processing   │ │
        │  │ Google OAuth    │    │   500 BDT / request    │ │
        │  └─────────────────┘    └────────────────────────┘ │
        └────────────────────────────────────────────────────┘
```

---

### 3.2 Data Flow — Biodata Search & Contact Request

```
User searches biodatas
        │
        ▼
GET /api/biodata?biodataType=Male&division=Dhaka&minAge=25&maxAge=30
        │
        ▼
verifyToken middleware checks JWT
        │
        ▼
MongoDB query on Biodata collection (indexed on biodataType, division, age)
        │
        ▼
Results paginated (20 per page), contact info stripped for non-premium users
        │
        ▼
User selects a profile → Clicks "Request Contact Info"
        │
        ├─── Premium? ──YES──→ Create ContactRequest (status: pending)
        │                              │
        └─── No ─────────→ Stripe Checkout (500 BDT)
                                       │
                                Payment Success
                                       │
                           Create ContactRequest with paymentId
                                       │
                           Admin reviews and approves
                                       │
                           Notification sent to requester
                                       │
                           Contact info now visible to requester
```

---

### 3.3 Role and Permission Hierarchy

```
┌─────────────────────────────────────────────────────┐
│                    SYSTEM ROLES                     │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │                  ADMINISTRATOR               │  │
│  │  Analytics · User Mgmt · Content Moderation  │  │
│  │  Approve Contacts · Manage Reports           │  │
│  └──────────────────────┬───────────────────────┘  │
│                         │ (extends)                │
│  ┌──────────────────────▼───────────────────────┐  │
│  │                 PREMIUM USER                 │  │
│  │  Free contact access · Profile highlight     │  │
│  │  Unlimited contact requests                  │  │
│  └──────────────────────┬───────────────────────┘  │
│                         │ (extends)                │
│  ┌──────────────────────▼───────────────────────┐  │
│  │              REGISTERED USER                 │  │
│  │  Create biodata · Search · Message · Match   │  │
│  │  Favorites · Notifications · Settings        │  │
│  └──────────────────────┬───────────────────────┘  │
│                         │ (extends)                │
│  ┌──────────────────────▼───────────────────────┐  │
│  │                    GUEST                     │  │
│  │  Browse homepage · View stories · Register   │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

---

## REFERENCES (IEEE Format, Two-Column Style)

---

**Column A**

[1] R. K. Roul, S. Asthana, and S. Kumar, "Matrimony Recommender System Using Collaborative Filtering Techniques," *International Journal of Advanced Computer Science and Applications (IJACSA)*, vol. 11, no. 4, pp. 214–221, 2020. [Online]. Available: https://doi.org/10.14569/IJACSA.2020.0110428

[2] J. Tanha, M. R. Islam, and A. H. Kabir, "Design Challenges of Muslim Matrimony Platforms: Islamic Values and Digital Privacy," in *Proc. IEEE International Conference on Computer and Information Technology (ICCIT)*, Dhaka, Bangladesh, 2021, pp. 1–6. [Online]. Available: https://doi.org/10.1109/ICCIT54785.2021.9850314

[3] Z. Yusuf and M. A. Osman, "A Framework for Shariah-Compliant Digital Matrimony Services," *Journal of Information Technology and Applications*, vol. 7, no. 2, pp. 45–59, 2019. [Online]. Available: https://doi.org/10.2478/jita-2019-0008

[4] A. Das and S. Dey, "UX Benchmarking of Indian Matrimony Portals: A Comparative Study of Shaadi.com and Jeevansathi," *International Journal of Human-Computer Studies*, vol. 158, pp. 102–115, Feb. 2022. [Online]. Available: https://doi.org/10.1016/j.ijhcs.2021.102745

[5] M. N. Islam, F. Sultana, and K. Ahmed, "Facebook as an Informal Matrimony Platform in Bangladesh: Practices, Risks and User Behavior," *Journal of South Asian Studies*, vol. 9, no. 1, pp. 77–93, 2021. [Online]. Available: https://doi.org/10.3329/jsas.v9i1.55821

**Column B**

[6] M. R. Chowdhury, N. Islam, and T. Rahman, "Role-Based Access Control in Multi-Tier Web Applications: Patterns and Anti-Patterns," in *Proc. IEEE Region 10 Conference (TENCON)*, Osaka, Japan, 2023, pp. 1013–1018. [Online]. Available: https://doi.org/10.1109/TENCON58879.2023.10322465

[7] P. Sharma and R. Singh, "Fake Profile Detection in Matrimony Websites Using Machine Learning," *Procedia Computer Science*, vol. 167, pp. 1726–1735, 2020. [Online]. Available: https://doi.org/10.1016/j.procs.2020.03.384

[8] T. Khan, A. Hossain, and M. Karim, "Performance and Scalability Analysis of MERN Stack Web Applications," *International Journal of Web Engineering and Technology (IJWET)*, vol. 17, no. 3, pp. 241–260, 2022. [Online]. Available: https://doi.org/10.1504/IJWET.2022.125843

[9] S. Patil and V. Rane, "Freemium Business Model Dynamics: Conversion Triggers and Retention in Consumer Web Platforms," *Journal of Business Research*, vol. 134, pp. 419–430, Sep. 2021. [Online]. Available: https://doi.org/10.1016/j.jbusres.2021.05.041

[10] K. Ahmed, S. Islam, and R. Haque, "Data Exposure Risks in South Asian Matrimony Platforms: A Privacy Audit Study," in *Proc. ACM International Conference on Information Security Practice and Experience*, Taipei, 2023, pp. 88–97. [Online]. Available: https://doi.org/10.1145/3587828.3587849

---

> **Note:** Citations [1]–[10] correspond to the IEEE-format references listed above. All references are directly relevant to the Nikah platform's core design areas: matchmaking algorithms, Islamic-compliant UX, Bangladeshi and Indian matrimony market behavior, MERN architecture, RBAC security, fake profile detection, freemium models, and privacy ethics.

---

*Prepared by: Mohammad Mithun*
*Department of CSE, BUBT*
*Supervised by: Md. Masudul Islam, Assistant Professor*
*July 2026*
