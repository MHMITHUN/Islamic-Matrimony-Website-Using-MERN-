backup -- 01


# Nikah — Islamic Nikah Matrimony Platform

<br>

**CSE 400:** Software Development Project **IV**

<br>

## SUBMITTED BY

| Name | ID | Intake |
|------|----|--------|
| Mohammad Mithun | [Your ID Here] | [Your Intake Here] |

<br>

## Supervised By:

**Md. Masudul Islam**

*Assistant Professor,*

*Department of CSE*

<br>

---

### DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING
### BANGLADESH UNIVERSITY OF BUSINESS AND TECHNOLOGY (BUBT)

*June, 2026*

<br>

---

## Abstract

Nikah is a full-stack web platform for Islamic matrimony, built to serve the Bangladeshi Muslim community. It offers a private, secure space where individuals can create detailed biodata profiles, search for compatible partners, communicate through verified channels, and work toward Nikah — the Islamic marriage contract. The frontend uses React.js, the backend runs on Node.js with Express.js, data lives in MongoDB, and authentication is handled through Firebase. Three user roles exist: regular users, premium users, and administrators. The interface supports both English and Bangla, includes a dark mode, works across devices, and gives administrators a dashboard with analytics. The project covers the full spectrum of modern web development — frontend, backend, database design, authentication, and cloud deployment.

<br>

---

## List of Figures

| Sl.No. | Figure Name | Page |
|--------|-------------|------|
| 1 | System Architecture Diagram | 10 |
| 2 | Entity-Relationship (ER) Diagram | 11 |
| 3 | Use Case Diagram | 12 |
| 4 | Context Level Diagram (DFD-0) | 13 |
| 5 | Data Flow Diagram (DFD-1) | 14 |
| 6 | Database Schema Diagram | 15 |
| 7 | Authentication Flowchart | 16 |
| 8 | Home Page Interface | 22 |
| 9 | Biodata Listing Page | 22 |
| 10 | Biodata Details Page | 23 |
| 11 | User Dashboard | 23 |
| 12 | Admin Dashboard | 24 |

<br>

---

## Table of Contents

| Chapter | Title | Page |
|---------|-------|------|
| | **Abstract** | i |
| | **List of Figures** | ii |
| **Chapter 1** | **Introduction** | 1 |
| 1.1 | Problem Specification | 1 |
| 1.2 | Objectives | 2 |
| 1.3 | Flow of the Project | 3 |
| 1.4 | Organization of Project Report | 3 |
| **Chapter 2** | **Background** | 4 |
| 2.1 | Existing System Analysis | 4 |
| 2.2 | Supporting Literatures | 5 |
| **Chapter 3** | **System Analysis & Design** | 7 |
| 3.1 | Technology & Tools | 7 |
| 3.2 | Model & Diagram | 9 |
| 3.2.1 | Development Model (Agile Scrum) | 9 |
| 3.2.2 | System Architecture | 10 |
| 3.2.3 | Use Case Diagram | 11 |
| 3.2.4 | Context Level Diagram | 12 |
| 3.2.5 | Data Flow Diagram | 13 |
| 3.2.6 | Database Schema | 14 |
| 3.2.7 | Algorithms / Flowchart | 15 |
| **Chapter 4** | **Implementation** | 16 |
| 4.1 | Interface Design / Front-End | 16 |
| 4.2 | Back-End | 17 |
| 4.3 | Modules / Features | 18 |
| **Chapter 5** | **User Manual** | 19 |
| 5.1 | System Requirements | 19 |
| 5.1.1 | Hardware Requirements | 19 |
| 5.1.2 | Software Requirements | 19 |
| 5.2 | User Interfaces | 20 |
| 5.2.1 | Public Pages (Panel A) | 20 |
| 5.2.2 | User Dashboard (Panel B) | 21 |
| 5.2.3 | Admin Panel (Panel C) | 22 |
| 5.2.4 | Login Credentials | 22 |
| **Chapter 6** | **Conclusion** | 23 |
| 6.1 | Conclusion | 23 |
| 6.2 | Limitations | 24 |
| 6.3 | Future Works | 24 |
| | **References** | 25 |
| | **Appendix A** | 26 |

<br>

---

## Chapter 1

## INTRODUCTION

<br>

### 1.1 Problem Specification

Marriage holds a sacred place in Islam. The Prophet Muhammad (PBUH) said, *"When a man marries, he has fulfilled half of his religion"* (Bayhaqi). These days, most people turn to online platforms when searching for a life partner. But the existing options fall short for the Bangladeshi Muslim community in several ways.

Most matrimony sites like Shaadi.com and Muslima.com cater to a global audience and don't address Islamic values specifically. Features like family involvement, privacy in line with hijab principles, and religious compatibility are largely missing. Personal contact information often gets exposed without proper consent, which creates risks of harassment and data misuse.

Language is another barrier. The majority of Bangladeshi users prefer Bangla, yet most platforms operate in English. Pricing is also problematic — premium subscriptions cost more than what many can afford, and mobile optimization is poor despite mobile being the primary internet access point in Bangladesh. Fake profiles are common, and there is no reliable way to verify authenticity or report suspicious activity.

These issues pointed toward the need for a platform that is modern, secure, Islamically aligned, and built with Bangladeshi users in mind. That is the gap Nikah aims to fill.

<br>

### 1.2 Objectives

The project had several goals going in:

1. Build a complete matrimony platform with a React frontend, Node.js/Express backend, and MongoDB database.

2. Design features that respect Islamic values — privacy, family involvement, halal communication.

3. Let users create and manage detailed biodata profiles with personal, family, and preference information.

4. Provide search filters and a matching system based on age, height, location, and occupation.

5. Secure the platform with JWT authentication, role-based access control, and contact info gating.

6. Keep the architecture modular so it can scale as the user base grows.

7. Support both English and Bangla through internationalization.

Beyond these, I wanted to build a proper admin dashboard with analytics, enable user-to-user messaging, add a premium subscription model, and make sure the interface works well on desktop, tablet, and mobile.

<br>

### 1.3 Flow of the Project

I split the work into six phases:

**Phase 1 — Planning & Design (Weeks 1-2):** Gathered requirements, drew up use cases, designed the ER diagram, planned the architecture, and created wireframes in Figma.

**Phase 2 — Backend Development (Weeks 3-5):** Set up the MongoDB models with Mongoose, built the Express server, implemented JWT authentication, and created CRUD endpoints for all collections.

**Phase 3 — Frontend Development (Weeks 6-9):** Scaffolded the React project with Vite, configured routing with React Router DOM, styled with Tailwind CSS, connected the API through TanStack React Query, and built all pages.

**Phase 4 — Feature Enhancement (Weeks 10-11):** Added messaging between users, the notification system, the compatibility matching algorithm, profile view tracking, and premium subscription handling.

**Phase 5 — Testing & QA (Weeks 12-13):** Ran unit tests with Jest, integration tests with Postman, did UI testing, fixed bugs, checked accessibility, and optimized performance.

**Phase 6 — Deployment & Documentation (Weeks 14-15):** Deployed the backend to Vercel and the frontend to Netlify, configured environment variables, wrote this report, and prepared the presentation.

<br>

### 1.4 Organization of Project Report

The report has six chapters. Chapter 1 covers the problem and objectives. Chapter 2 looks at existing platforms and supporting literature. Chapter 3 covers the system design — technology choices, architecture, UML diagrams, database schema, and algorithms. Chapter 4 explains how everything was implemented on the frontend and backend. Chapter 5 is a user manual with system requirements and interface walkthroughs. Chapter 6 wraps up with conclusions, limitations, and future possibilities.

<br>

---

## Chapter 2

## BACKGROUND

<br>

### 2.1 Existing System Analysis

Before building Nikah, I looked at what was already out there to understand where the gaps were.

| Platform | Strengths | Weaknesses |
|----------|-----------|------------|
| Shaadi.com | Large user base, global reach | Not Islam-specific, expensive, English-only |
| Muslima.com | Muslim audience, international | Outdated interface, limited Bangla, costly |
| BiyeKotha (BD) | Bangla support, local focus | Poor UI, limited features, not mobile-friendly |
| Muzz (Muzmatch) | Muslim-focused, modern, app-based | Heavy premium model, few free features |
| Tinder / Bumble | Modern interface, large userbase | Not for marriage, no Islamic alignment |

The gaps I found:

- No platform brings together a modern interface, Islamic values, and Bangla support all at once.
- None offer a proper compatibility matching algorithm.
- Admin dashboards with analytics are absent across the board.
- Role-based access with premium tiers is not implemented.
- Real-time messaging and notification systems are missing.
- Profile view tracking and activity feeds are not provided.

Nikah addresses all of these. It combines a modern React/Tailwind interface with Islamic privacy controls, full Bangla support, a compatibility engine, an admin analytics dashboard, messaging, notifications, and a freemium subscription model.

<br>

### 2.2 Supporting Literatures

The work draws from several areas — Islamic teachings on marriage, modern web architecture patterns, authentication frameworks, and specific frontend and backend technologies.

**Islamic Foundations:** The platform respects hijab principles by gating contact information — it only gets revealed after a verified request. Biodata includes the father's and mother's names to involve families. Communication is structured and verifiable. The Prophet's hadith about marriage completing half of one's faith (Bayhaqi) is the underlying motivation.

**Architecture:** The system follows a three-tier pattern. The presentation layer is a React single-page application. The application layer is an Express REST API with modular routes. The data layer is MongoDB with Mongoose for schema management.

**Authentication:** Firebase handles user registration and login through email/password and Google OAuth. JWTs with a 7-day expiry are used for session management. A three-level RBAC system (user, premium user, admin) is enforced through Express middleware.

**Frontend Stack:** React 18 was the obvious choice given its ecosystem and community. Vite provides fast builds and hot module replacement. Tailwind CSS made styling and dark mode implementation straightforward. TanStack React Query handles server state with caching and automatic refetching. Framer Motion adds UI animations without much overhead.

**Backend Stack:** Node.js and Express 5 form the server foundation. Mongoose 9 provides the ODM layer for MongoDB. Stripe handles payment processing in demo mode. bcryptjs hashes passwords, and jsonwebtoken creates and verifies tokens.

**Database:** MongoDB Atlas offers a free cloud-hosted tier with auto-scaling. Twelve collections were designed with indexes on frequently queried fields for performance.

**Deployment:** Vercel hosts the backend as serverless functions with automatic HTTPS. Netlify serves the frontend with continuous deployment from GitHub.

<br>

---

## Chapter 3

## SYSTEM ANALYSIS & DESIGN

<br>

### 3.1 Technology & Tools

**3.1.1 Frontend Stack:**

| Technology | Version | Role |
|------------|---------|------|
| React.js | 18.3.1 | UI framework |
| Vite | 7.2.4 | Build tool and dev server |
| React Router DOM | 7.10.1 | Client-side routing |
| Tailwind CSS | 3.4.17 | Styling |
| TanStack React Query | 5.90.12 | Data fetching and caching |
| Axios | 1.13.2 | HTTP client |
| Firebase | 12.6.0 | Authentication |
| Framer Motion | 12.23.25 | Animations |
| Recharts | 3.5.1 | Admin charts |
| React Icons | 5.5.0 | Icons |
| React Helmet Async | 2.0.5 | SEO meta tags |
| React Hot Toast | 2.6.0 | Toast notifications |
| SweetAlert2 | 11.26.3 | Alert dialogs |
| @fontsource/noto-sans-bengali | 5.2.11 | Bengali font |
| ESLint | 9.x | Code linting |
| Autoprefixer | 10.4.20 | CSS vendor prefixes |
| PostCSS | 8.4.49 | CSS processing |

**3.1.2 Backend Stack:**

| Technology | Version | Role |
|------------|---------|------|
| Node.js | 24.10.0 | Runtime |
| Express.js | 5.2.1 | Web framework |
| Mongoose | 9.0.0 | MongoDB ODM |
| jsonwebtoken | 9.0.3 | JWT creation and verification |
| bcryptjs | 3.0.3 | Password hashing |
| cors | 2.8.5 | Cross-origin requests |
| cookie-parser | 1.4.7 | Cookie handling |
| stripe | 20.0.0 | Payment processing |
| dotenv | 17.2.3 | Environment variables |

**3.1.3 Database:**

| Item | Details |
|------|---------|
| Provider | MongoDB Atlas (M0 free tier) |
| Collections | User, Biodata, ContactRequest, Favorite, SuccessStory, ContactMessage, Report, Notification, Message, Match, ProfileView, Subscription |

**3.1.4 Tools Used:**

| Tool | Purpose |
|------|---------|
| Git + GitHub | Version control |
| VS Code | Code editor |
| Postman | API testing |
| MongoDB Atlas Dashboard | Database management |
| Vercel | Backend deployment |
| Netlify | Frontend deployment |
| Firebase Console | Auth management |
| Figma | UI wireframes |

<br>

### 3.2 Model & Diagram

#### 3.2.1 Development Model (Agile Scrum)

I used Agile Scrum for this project. Each sprint ran for one week. At the start of each sprint, I planned and prioritized tasks. Daily standups kept me on track. At the end of each sprint, I reviewed what got built and noted lessons learned.

This approach worked well because requirements shifted as I went deeper into development. Having weekly deliverables forced me to ship working features incrementally rather than trying to build everything at once.

| Phase | Duration | What Came Out of It |
|-------|----------|---------------------|
| Planning & Design | Week 1-2 | Requirements, ER diagram, architecture, wireframes |
| Backend Development | Week 3-5 | Database models, API routes, auth, middleware |
| Frontend Development | Week 6-9 | React components, pages, routing, API integration |
| Feature Enhancement | Week 10-11 | Messaging, matching, notifications, subscriptions |
| Testing & QA | Week 12-13 | Unit/integration tests, bug fixes, optimization |
| Deployment & Docs | Week 14-15 | Live deployment, report writing, presentation |

<br>

#### 3.2.2 System Architecture

The system has three layers:

```
┌─────────────────────────────────┐     ┌──────────────────────────────────────────┐
│         Netlify (CDN)           │     │          Vercel (Serverless)              │
│  ┌───────────────────────────┐  │     │  ┌──────────────────────────────────┐   │
│  │     React SPA (Vite)      │  │ HTTP│  │     Express REST API Server      │   │
│  │                           │  │─────┼──▶│                                  │   │
│  │  - Component-based UI     │  │     │  │  - JWT Auth Middleware            │   │
│  │  - React Router v7        │  │     │  │  - Biodata CRUD                  │   │
│  │  - TanStack React Query   │  │     │  │  - Contact Request Management    │   │
│  │  - Tailwind CSS            │  │     │  │  - Stripe Payment                │   │
│  │  - Framer Motion           │  │     │  │  - Compatibility Matching        │   │
│  │  - i18n (EN/BN)           │  │     │  │  - Messaging & Notifications     │   │
│  │  - Dark Mode              │  │     │  │  - Admin Analytics API           │   │
│  └───────────────────────────┘  │     │  │  - RBAC (User/Admin/Premium)     │   │
└─────────────────────────────────┘     │  └──────────────┬───────────────────┘   │
                                        └─────────────────┼─────────────────────────┘
                                                          │
                                                ┌─────────▼──────────┐
                                                │   MongoDB Atlas    │
                                                │  (12 Collections)  │
                                                └────────────────────┘

          ┌─────────────────────────────────────────────────────────────┐
          │                  Firebase Authentication                   │
          │            (Email/Password + Google OAuth)                 │
          └─────────────────────────────────────────────────────────────┘
```

The frontend runs as a React SPA on Netlify and talks to the backend through Axios over HTTP. The backend is an Express API deployed on Vercel as serverless functions, handling business logic, auth, validation, and database operations. MongoDB Atlas stores all data across 12 collections. Firebase sits outside the main flow handling authentication.

<br>

#### 3.2.3 Use Case Diagram

Four actors interact with the system:

```
GUEST:
  - Register (email/password or Google)
  - Login
  - Browse home page
  - View success stories
  - Contact us

REGISTERED USER:
  - Create / edit their biodata
  - View their own biodata
  - Search biodatas with filters
  - View biodata details
  - Add / remove favorites
  - Request contact info
  - Send and receive messages
  - View notifications
  - View compatibility matches
  - See who viewed their profile
  - View recently viewed profiles
  - View activity feed
  - Report a profile
  - Submit a success story
  - Compare biodatas
  - Change theme and language settings
  - Logout

PREMIUM USER:
  - Everything a regular user can do
  - View contact info without paying
  - Unlimited contact requests
  - Profile gets highlighted

ADMINISTRATOR:
  - View admin dashboard with charts
  - Manage users (search, promote, grant/revoke premium)
  - Approve premium requests
  - Approve contact requests
  - Manage success stories
  - Manage contact form messages
  - Handle reported profiles
```

<br>

#### 3.2.4 Context Level Diagram (DFD-0)

```
                              ┌──────────────────────┐
                              │                      │
                              │    Firebase Auth     │
                              │                      │
                              └──────────┬───────────┘
                                         │
                                    Auth Credentials
                                         │
                                         ▼
    ┌──────────────┐          ┌──────────────────────┐          ┌──────────────┐
    │              │  Requests │                      │ Queries  │              │
    │    Guest     │──────────▶│                      │─────────▶│   MongoDB    │
    │              │           │     NIKAH SYSTEM     │          │   Database   │
    └──────────────┘           │                      │◀─────────└──────────────┘
                               │  Islamic Matrimony   │
    ┌──────────────┐           │    Platform v1.0     │          ┌──────────────┐
    │              │  Requests │                      │ Payments │              │
    │  User/Admin  │──────────▶│                      │─────────▶│    Stripe    │
    │              │           └──────────────────────┘          │    (Demo)    │
    └──────────────┘                                           └──────────────┘
```

The system accepts requests from guests, users, and admins. It talks to Firebase for authentication, MongoDB for data storage, and Stripe for payment processing.

<br>

#### 3.2.5 Data Flow Diagram (DFD-1)

```
                    ┌─────────────────┐
                    │   User Auth     │
                    │   Subsystem     │◀──────────────────── Firebase Auth
                    └────────┬────────┘                             ▲
                             │                                      │
                             ▼                                      │
┌──────────────┐    ┌─────────────────┐    ┌───────────────────────────┐
│              │    │   Biodata       │    │     Contact Request       │
│   Guest      │───▶│   Management    │───▶│     Subsystem             │
│              │    │   Subsystem     │    │                           │
└──────────────┘    └────────┬────────┘    └──────────────┬────────────┘
                             │                            │
                             ▼                            ▼
                    ┌─────────────────┐    ┌───────────────────────────┐
                    │   Match/Search  │    │     Payment Subsystem     │
                    │   Subsystem     │    │     (Stripe)              │
                    └────────┬────────┘    └──────────────┬────────────┘
                             │                            │
                             ▼                            ▼
┌──────────────┐    ┌─────────────────┐    ┌───────────────────────────┐
│              │    │   Messaging &   │    │     Notification          │
│   Admin      │───▶│   Chat          │───▶│     Subsystem             │
│              │    │   Subsystem     │    │                           │
└──────────────┘    └────────┬────────┘    └──────────────┬────────────┘
                             │                            │
                             ▼                            ▼
                    ┌────────────────────────────────────────────────────┐
                    │              MongoDB Database (Atlas)              │
                    │  12 Collections                                   │
                    └────────────────────────────────────────────────────┘
```

The first-level DFD breaks the system into six subsystems: authentication, biodata management, contact requests, payment, messaging, and notifications. All of them read from and write to the same MongoDB database.

<br>

#### 3.2.6 Database Schema

Twelve MongoDB collections make up the database:

```
┌──────────────┐         1:N         ┌──────────────┐        1:1        ┌──────────────────┐
│              │─────────────────────▶│              │◀───────────────────│  ContactRequest  │
│    User      │                      │   Biodata    │                   │                  │
│              │                      │              │                   │  requesterId     │
│  email (PK)  │                      │  biodataId   │                   │  biodataId       │
│  name        │                      │  userId (FK) │                   │  status          │
│  role        │                      │  name        │                   │  paymentId       │
│  isPremium   │                      │  age         │                   └──────────────────┘
│  photoURL    │                      │  occupation  │
└──────┬───────┘                      │  division    │
       │                              │  mobileNumber│
       │ 1:N                          └──────┬───────┘
       │                                     │ 1:N
       ▼                                     ▼
┌──────────────┐                   ┌──────────────────┐
│  Favorite    │                   │      Match       │
│              │                   │                  │
│  userId (FK) │                   │  biodataId (FK)  │
│  biodataId   │                   │  matchedBiodata  │
└──────────────┘                   │  score           │
                                   └──────────────────┘
       ┌──────────────┐        1:N        ┌──────────────────┐
       │    User      │───────────────────▶│  Notification    │
       └──────┬───────┘                   │                  │
              │                           │  userId (FK)     │
              │ 1:N (sender + receiver)   │  type             │
              ▼                           │  isRead          │
       ┌──────────────────┐               └──────────────────┘
       │     Message      │
       │                  │
       │  senderId (FK)   │
       │  receiverId (FK) │
       │  content         │
       │  isRead          │
       └──────────────────┘

       ┌──────────────┐                   ┌──────────────────┐
       │  ProfileView │                   │  Subscription    │
       │              │                   │                  │
       │  viewerId    │                   │  userId (FK)     │
       │  viewedBiodata│                  │  plan            │
       └──────────────┘                   │  status          │
                                          │  endDate         │
       ┌──────────────┐    ┌──────────────┴────────┐  ┌──────────────────┐
       │   Report     │    │   SuccessStory        │  │ ContactMessage   │
       │              │    │                       │  │ (standalone)     │
       │  reporterId  │    │  selfBiodataId        │  │                  │
       │  biodataId   │    │  partnerBiodataId     │  │  name            │
       │  reason      │    │  marriageDate         │  │  email           │
       │  status      │    │  reviewStar           │  │  message         │
       └──────────────┘    └───────────────────────┘  └──────────────────┘
```

I added indexes on fields that get queried often — email, biodataId, biodataType, division, age — to keep things fast as the data grows.

<br>

#### 3.2.7 Algorithms / Flowchart

**Compatibility Matching:**

The matching algorithm compares a user's partner preferences against each opposite-gender biodata and assigns a score out of 100:

```
[START]
    │
    ▼
Get current user's biodata and partner preferences
    │
    ▼
Fetch all opposite-gender biodatas
    │
    ▼
For each candidate biodata:
    │
    ├── Age within expected range?       → +25 points
    ├── Height within expected range?    → +25 points
    ├── Same division?                   → +25 points
    └── Same occupation category?        → +25 points
    │
    ▼
Store score and breakdown (which criteria matched)
    │
    ▼
Sort by score descending
    │
    ▼
Return ranked matches
    │
    ▼
[END]
```

Each criterion is worth 25 points, so a perfect match scores 100. The breakdown is returned alongside the score so users can see exactly what matched and what did not.

**Authentication Flow:**

```
User visits site → Clicks Login/Register
    │
    ▼
Chooses method: Email/Password or Google OAuth
    │
    ▼
Firebase validates credentials
    │
    ├── Failed → Show error message
    │
    └── Success → Send user data to backend JWT endpoint
                      │
                      ▼
              Server creates/updates user in MongoDB
                      │
                      ▼
              Server generates JWT (7-day expiry)
                      │
                      ▼
              Token stored in localStorage
                      │
                      ▼
              User redirected to dashboard
```

**Contact Request Flow:**

```
User views biodata → Clicks "Request Contact Information"
    │
    ├── Premium user? → Create request directly
    │
    └── Not premium? → Redirect to Stripe Checkout
                           │
                           ▼
                       Payment completed (500 BDT)
                           │
                           ▼
                       Create contact request with paymentId
    │
    ▼
Status: pending → Admin notified
    │
    ▼
Admin reviews and approves
    │
    ▼
User can now view the contact information
```

<br>

---

## Chapter 4

## IMPLEMENTATION

<br>

### 4.1 Interface Design / Front-End

The frontend was built with React 18 and Vite 7. I organized the UI into pages (route-level components), layouts (shared structures like the main layout with navbar/footer and the dashboard layout with sidebar), and reusable components.

**Routing:** I used React Router DOM v7 with `createBrowserRouter`. Public routes live under `MainLayout`, protected dashboard routes under `DashboardLayout`. Wrapper components (`PrivateRoute`, `AdminRoute`) guard access based on authentication status and role.

**State Management:** Three React contexts handle global state:
- **AuthContext** — tracks the Firebase user, the JWT token, the user's role, and loading state.
- **ThemeContext** — toggles between light and dark mode, persists the choice in localStorage, and checks the system preference as a fallback.
- **LanguageContext** — switches between English and Bangla using JSON translation files, persists the preference.

**Server State:** TanStack React Query manages all API data. I set a stale time of 5 minutes to cut down on unnecessary requests, allowed one retry on failure, and disabled refetch on window focus.

**Styling:** Tailwind CSS with `darkMode: 'class'` handles all styling. The color scheme uses green tones that fit the Islamic theme. Transitions are smooth with `transition-colors duration-300`.

**API Layer:** An Axios instance with the base URL pulled from `VITE_API_URL`. A request interceptor attaches the JWT from localStorage and the language preference in the `Accept-Language` header. A response interceptor clears the token on 401 errors.

**UI Libraries:** Framer Motion for page transitions and hover effects. React Helmet Async for per-page SEO meta tags. React Hot Toast for notifications. SweetAlert2 for confirmation dialogs. Recharts for admin analytics charts (area, pie, bar).

<br>

### 4.2 Back-End

The backend is an Express 5 application with a modular route structure.

**Server Setup:** CORS is configured with regex patterns to allow Netlify and Vercel URLs. The app parses JSON bodies and cookies. Fifteen route modules mount under `/api/`. A global 404 handler and an error handler catch anything that falls through.

**Authentication Middleware:** Three middleware functions control access:
- `verifyToken` — extracts the JWT from the `Authorization` header, verifies it, and attaches decoded user data to `req.user`. It also fetches fresh user data from MongoDB so role and premium status are always current.
- `verifyAdmin` — checks that the user has `role: 'admin'` in the database. Returns 403 if not.
- `verifyPremium` — checks that the user has `isPremium: true`. Also returns 403 if not.

**Route Modules:** Sixteen route files handle specific domains:

| Module | Base Path | Auth |
|--------|-----------|------|
| Auth | `/api/auth` | Mixed |
| Biodata | `/api/biodata` | Mixed |
| Contact Requests | `/api/contact-requests` | Token |
| Contact Messages | `/api/contact-messages` | Public |
| Favorites | `/api/favorites` | Token |
| Messages | `/api/messages` | Token |
| Notifications | `/api/notifications` | Token |
| Matches | `/api/matches` | Token |
| Profile Views | `/api/profile-views` | Token |
| Subscriptions | `/api/subscriptions` | Mixed |
| Success Stories | `/api/success-stories` | Mixed |
| Reports | `/api/reports` | Mixed |
| Payment | `/api/payment` | Token |
| Stats | `/api/stats` | Mixed |
| Analytics | `/api/analytics` | Admin |
| Admin | `/api/admin` | Admin |

**Database Models:** Twelve Mongoose schemas with field validation (required fields, enums, min/max values), timestamps, and indexes on frequently queried fields.

**Security:** JWTs expire after 7 days. The admin email (`admin@islamicmatrimony.com`) cannot be used for registration. Contact info is hidden from non-premium users who do not own the biodata. CORS validates origin URLs with regex. All secrets are stored in environment variables.

<br>

### 4.3 Modules / Features

Fifteen core modules were implemented:

1. **User Authentication** — Firebase email/password and Google OAuth, JWT generation, password strength validation, admin email protection.

2. **Biodata Management** — Create and update biodata with 16+ fields, auto-incrementing biodata IDs, automatic age calculation from date of birth.

3. **Search & Discovery** — Filter by gender, division, age range, and occupation. Paginated results (20 per page). Sort by age or newest first.

4. **Contact Request System** — Request contact info with Stripe payment (500 BDT) for non-premium users. Admin approval workflow. Premium users bypass payment.

5. **Favorites System** — Add and remove bookmarked biodatas. Prevents duplicates.

6. **Messaging System** — Inbox, sent messages, and conversation threading between two users. Unread tracking. Generates notifications for new messages.

7. **Notification System** — Six notification types (contact request, contact approved, premium approved, new message, profile viewed, system). Unread badge, mark as read, mark all read, delete.

8. **Compatibility Matching** — Scores matches from 0 to 100 based on age, height, division, and occupation alignment. Shows a breakdown of which criteria matched.

9. **Profile View Tracking** — Records when someone views a profile. Prevents self-views and duplicate views within an hour. Shows total views and unique viewers.

10. **Premium Subscription** — Three plans (Basic free, Premium 500 BDT/3 months, Gold 1000 BDT/6 months). Stripe payment. Grants contact info access and profile highlighting.

11. **Report System** — Report profiles for fake content, inappropriate material, harassment, spam, or other reasons. Admin reviews and resolves or dismisses reports.

12. **Success Stories** — Married users can submit their story with partner biodata ID, couple photo, marriage date, rating, and text. Admin moderates submissions.

13. **Admin Dashboard** — Charts for user growth, gender distribution, location stats, and age distribution. User management, premium approval, contact approval, content moderation.

14. **Internationalization** — English and Bangla translations. Toggle in the UI. Preference saved to localStorage. Language sent as an HTTP header with API requests.

15. **Theme System** — Dark and light mode. Class-based toggling. Preference persisted in localStorage with system preference as fallback.

<br>

---

## Chapter 5

## USER MANUAL

<br>

### 5.1 System Requirements

#### 5.1.1 Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Processor | Intel Core i3 / AMD Ryzen 3 | Intel Core i5 / AMD Ryzen 5 |
| RAM | 4 GB | 8 GB |
| Storage | 1 GB free | 5 GB free |
| Display | 1366 x 768 | 1920 x 1080 |
| Internet | 2 Mbps | 10 Mbps |
| Device | Desktop, laptop, tablet, or phone | Any device with a modern browser |

#### 5.1.2 Software Requirements

**For Users:**

| Item | Requirement |
|------|-------------|
| OS | Windows 10+, macOS 11+, Linux, Android 10+, iOS 14+ |
| Browser | Chrome 90+, Firefox 90+, Safari 14+, Edge 90+ |
| JavaScript | Must be enabled |
| Internet | Required |

**For Local Development:**

| Item | Requirement |
|------|-------------|
| OS | Windows 10+, macOS 11+, Linux (Ubuntu 20.04+) |
| Node.js | v18+ (v24.10.0 recommended) |
| npm | v9+ |
| MongoDB | Atlas account (free tier) or local v6.0+ |
| IDE | VS Code (recommended) |
| Git | v2.30+ |
| Firebase | Console account with Auth enabled |

<br>

### 5.2 User Interfaces

#### 5.2.1 Public Pages (Panel A)

**Home Page:** Hero section with branding and call-to-action buttons ("Get Started", "Browse Biodatas"). Featured premium profiles displayed as cards. Statistics counter showing total users, biodatas, success stories, and marriages. A "How It Works" section. Gallery of success stories with couple photos and ratings. Footer with links and contact info.

**Login Page:** Email and password form with validation. Google OAuth button. Link to the registration page. Error messages shown as toasts.

**Registration Page:** Name, email, password, and confirm password fields. Password strength indicators. Google OAuth option. Link to the login page.

**Biodatas Listing Page:** Sidebar with filters (biodata type, division, age range, occupation). Grid of biodata cards showing profile image, name, age, occupation, and division. Pagination at 20 items per page. Sort options and premium badges.

**Success Stories Page:** Gallery of stories with couple photos, marriage dates, star ratings, and descriptions. Filter by rating.

**Static Pages:** About, Contact (with form), Privacy Policy, Terms of Service.

#### 5.2.2 User Dashboard (Panel B)

**Overview:** Summary cards for biodata status, unread messages, favorites, and profile views. Recent activity feed. Quick action buttons.

**Edit Biodata:** Full form with 16+ fields. Age auto-calculates from date of birth. Division dropdown covers all 7 divisions of Bangladesh. Partner preference section.

**View Biodata:** Read-only view of the user's own profile. Print-friendly. Shows contact info.

**Messages:** Inbox tab with unread indicators. Sent tab. Conversation view. Compose form.

**Notifications:** List with type icons. Read/unread states. Mark all as read. Delete individual notifications.

**Matches:** Cards showing compatibility scores (0-100%) with breakdowns. Sorted by score.

**Favorites:** List of saved biodatas. Remove option.

**Contact Requests:** History of sent requests. Pending/approved status indicators.

**Profile Views:** List of who viewed the profile. Total and unique view counts.

**Recently Viewed:** Profiles the user looked at recently, stored in localStorage.

**Settings:** Dark/light toggle. Language toggle. Account info display.

**Got Married:** Success story submission form — partner biodata ID, couple image, marriage date, rating, story text.

#### 5.2.3 Admin Panel (Panel C)

**Dashboard:** Stat cards (users, biodatas, premiums, contact requests, success stories, revenue). Area chart for user growth (30 days). Pie chart for gender distribution. Bar chart for location stats. Age distribution chart. Recent activity table.

**Manage Users:** Search by name or email. Table with user details. Promote to admin, demote from admin. Grant or revoke premium.

**Approved Premium:** Premium approval history. Manage premium users.

**Approved Contacts:** Contact requests list. Approve pending requests.

**Success Stories:** Review submitted stories. Approve or reject.

**Contact Messages:** View form submissions. Delete messages.

**Reported Profiles:** List of reports with reasons. Review, resolve, or dismiss.

#### 5.2.4 Login Credentials

**Test User:**
- Email: user@test.com
- Password: User@123

**Test Admin:**
- Email: admin@islamicmatrimony.com
- Password: Admin@123

The system blocks registration attempts using the admin email for security.

<br>

---

## Chapter 6

## CONCLUSION

<br>

### 6.1 Conclusion

Nikah came together as a full-featured matrimony platform that addresses real gaps in the market for Bangladeshi Muslims. Looking back at what got built:

The platform has 12 database collections, over 50 API endpoints, and 15 functional modules spanning authentication, biodata management, search, messaging, matching, payments, and administration. The frontend works across devices, supports both English and Bangla, includes dark mode, and gives administrators proper analytics tools.

On the security side, JWT authentication with role-based access control keeps things locked down. Contact information is gated behind verified requests. The admin email is protected from public registration. CORS is configured to only allow trusted origins.

The platform is live — backend on Vercel, frontend on Netlify, database on MongoDB Atlas — all running on free tiers.

More importantly, the features were designed with Islamic values in mind. Privacy is respected through contact gating. Families are involved through biodata fields for parents' names. Communication happens through verified channels. The entire workflow is structured to facilitate halal matchmaking.

<br>

### 6.2 Limitations

No project is perfect, and there are things I would do differently or add given more time:

1. **No mobile app yet.** The web version is responsive, but native iOS and Android apps with push notifications would be better.

2. **Payments are in demo mode.** Stripe is wired up but not processing real transactions. Local gateways like bKash, Nagad, and Rocket are not integrated.

3. **No real-time features.** Messaging and notifications work on a request-response cycle. WebSockets would make chat instant.

4. **Matching is rule-based.** The algorithm compares four criteria with equal weight. Machine learning could give more nuanced recommendations.

5. **No identity verification.** The platform trusts whatever users enter. A verification system would build trust.

6. **Single admin level.** There is one admin role. A hierarchy with different permission levels would be more flexible.

7. **Only two languages.** English and Bangla are covered, but adding Arabic and Urdu would reach more people.

8. **No guardian (wali) system.** In Islamic marriage, a guardian is often involved. That workflow is not yet built.

<br>

### 6.3 Future Works

If this project continues, these are the things I would prioritize:

1. **Native mobile apps** using React Native for iOS and Android.

2. **AI-powered matchmaking** that learns from user behavior and interaction patterns.

3. **Video and voice calling** through WebRTC for premium users.

4. **Background verification** — identity, education, and employment checks for trusted profiles.

5. **More languages** — Arabic, Urdu, Hindi.

6. **Real payment integration** with Stripe, bKash, Nagad, and Rocket.

7. **Wali (guardian) system** where guardians can review messages and approve matches.

8. **Advanced analytics** using machine learning for match success prediction.

9. **Wedding planning tools** — vendor directories, checklists, budget management.

10. **Community features** — marriage counseling resources, Islamic marriage guides, scholar consultations.

11. **Real-time chat** with typing indicators, read receipts, and online status via WebSockets.

12. **Verified profile badges** for users who complete identity checks.

<br>

---

## References

1. React.js Documentation. (2026). *React.dev*. https://react.dev/

2. Express.js Documentation. (2026). *Expressjs.com*. https://expressjs.com/

3. MongoDB Documentation. (2026). *Mongodb.com*. https://www.mongodb.com/docs/

4. Mongoose Documentation. (2026). *Mongoosejs.com*. https://mongoosejs.com/docs/

5. Firebase Authentication Documentation. (2026). *Firebase.google.com*. https://firebase.google.com/docs/auth

6. Tailwind CSS Documentation. (2026). *Tailwindcss.com*. https://tailwindcss.com/docs

7. TanStack React Query Documentation. (2026). *Tanstack.com*. https://tanstack.com/query

8. JSON Web Tokens (JWT). (2026). *Jwt.io*. https://jwt.io/

9. Stripe API Documentation. (2026). *Stripe.com*. https://stripe.com/docs/api

10. Vercel Deployment Documentation. (2026). *Vercel.com*. https://vercel.com/docs

11. Netlify Deployment Documentation. (2026). *Netlify.com*. https://docs.netlify.com/

12. WCAG 2.1 Guidelines. (2026). *W3.org*. https://www.w3.org/WAI/WCAG21/quickref/

13. Sahih al-Bukhari. Hadith on Marriage. *Sunnah.com*. https://sunnah.com/bukhari

14. Bayhaqi. Hadith on Marriage Fulfilling Half of Religion.

15. MongoDB Atlas Documentation. (2026). *Mongodb.com*. https://www.mongodb.com/docs/atlas/

16. React Router DOM Documentation. (2026). *Reactrouter.com*. https://reactrouter.com/

17. Framer Motion Documentation. (2026). *Framermotion.framer.website*. https://www.framer.com/motion/

18. Recharts Documentation. (2026). *Recharts.org*. https://recharts.org/

19. Vite Documentation. (2026). *Vite.dev*. https://vite.dev/

20. Stripe React Components Documentation. (2026). *Stripe.com*. https://stripe.com/docs/stripe-js/react

21. "What Is a Data Flow Diagram." *Lucidchart*. https://www.lucidchart.com/pages/data-flow-diagram

22. "What Are Database Schemas." *Educative.io*. https://www.educative.io/blog/what-are-database-schemas-examples

23. "System Architecture Tutorial." *Interviewbit.com*. https://www.interviewbit.com/blog/system-architecture/

24. "Use Case Diagram Tutorial." *Creately.com*. https://creately.com/guides/use-case-diagram-tutorial/

25. "Context Diagram Guide." *Miro.com*. https://miro.com/blog/context-diagram/

<br>

---

## Appendix A

### Glossary of Terms

| Term | Meaning |
|------|---------|
| Nikah | Islamic marriage contract |
| Biodata | A matrimonial profile with personal, family, and preference details |
| JWT | JSON Web Token — a compact token format for authentication |
| RBAC | Role-Based Access Control |
| REST API | A web API that follows REST conventions |
| MERN | MongoDB, Express, React, Node.js |
| ODM | Object Document Mapping — bridges code objects with database documents |
| i18n | Internationalization |
| CORS | Cross-Origin Resource Sharing — browser security mechanism |
| Stripe | Online payment processing platform |
| Firebase | Google's app platform (auth, database, hosting) |
| Vercel | Cloud platform for serverless and static deployment |
| Netlify | Cloud platform for frontend deployment |
| WCAG | Web Content Accessibility Guidelines |
| DFD | Data Flow Diagram |
| ER Diagram | Entity-Relationship Diagram |
| Hijab | Islamic concept of modesty and privacy |
| Wali | Islamic marriage guardian |
| Halal | Permissible under Islamic law |
| bKash / Nagad / Rocket | Mobile financial services in Bangladesh |

### Key API Endpoints

| Method | Endpoint | What It Does | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/jwt` | Create or get a JWT token | Public |
| GET | `/api/auth/me` | Get current user info | Token |
| GET | `/api/auth/admin/:email` | Check if user is admin | Token |
| GET | `/api/biodata` | List biodatas with filters | Public |
| GET | `/api/biodata/:biodataId` | Get one biodata | Mixed |
| POST | `/api/biodata` | Create or update biodata | Token |
| POST | `/api/contact-requests` | Request contact info | Token |
| GET | `/api/messages/inbox` | Get received messages | Token |
| POST | `/api/messages` | Send a message | Token |
| GET | `/api/notifications` | Get notifications | Token |
| GET | `/api/matches` | Get compatibility matches | Token |
| POST | `/api/payment/create-payment-intent` | Create a Stripe payment | Token |
| GET | `/api/stats/public` | Public platform stats | Public |
| GET | `/api/admin/users` | List all users | Admin |
| PATCH | `/api/admin/users/:id/make-admin` | Promote user to admin | Admin |

### Project Timeline

```
Week:  1   2   3   4   5   6   7   8   9   10  11  12  13  14  15
       ├───┤
Phase 1: Planning & Design
          ├──────────┤
Phase 2: Backend Development
                   ├──────────────────┤
Phase 3: Frontend Development
                                      ├──────────┤
Phase 4: Feature Enhancement
                                                 ├──────────┤
Phase 5: Testing & QA
                                                            ├──────────┤
Phase 6: Deployment & Documentation
```

---

**End of Document**

---

*Prepared by: Mohammad Mithun*
*Student, Department of Computer Science and Engineering*
*Bangladesh University of Business and Technology (BUBT)*
*Supervised by: Md. Masudul Islam, Assistant Professor, Department of CSE*
*Date: June 2026*
*Version: 1.0*
