# Islamic Nikah Matrimony Platform
## Software Development Project (SDP) Proposal

---

**Project Title:** Nikah — Islamic Nikah Matrimony Platform  
**Team Members:** [Your Name]  
**Student ID:** [Your ID]  
**Department:** Computer Science & Engineering  
**Supervisor:** [Supervisor Name]  
**Date:** June 2026  
**Version:** 1.0  

---

## Table of Contents

1. Introduction
2. Problem Statement
3. Objectives
4. Existing System Analysis
5. Scope of the Project
6. Features & Functional Requirements
7. Development Methodology
8. Feasibility Analysis & Risks
9. Technology Stack
10. Database Design & UML Diagrams
11. Testing Strategy
12. Project Timeline & Budget
13. Future Work, Conclusion & References

---

## 1. Introduction

The institution of marriage holds a sacred and central position in Islam. The Prophet Muhammad (PBUH) said: *"When a man marries, he has fulfilled half of his religion"* (Bayhaqi). In the modern digital age, the process of finding a suitable life partner has evolved significantly. Online matrimony platforms have become the primary means through which individuals and families search for compatible matches.

However, the majority of existing matrimony platforms operate on a generic model that does not cater specifically to the Islamic community's unique requirements. Many platforms lack proper adherence to Islamic values such as privacy (hijab), family involvement, halal communication channels, and verification of religious compatibility. Furthermore, the Bangladeshi market specifically lacks a modern, feature-rich, and culturally appropriate matrimony platform that serves the local population with support for Bangla language and local payment methods.

**Nikah** is a full-stack web-based Islamic matrimony platform designed and developed to address these gaps. The platform provides a secure, privacy-focused, and Islamically-aligned environment where Muslim individuals can create detailed biodata profiles, search for compatible partners based on religious and personal criteria, communicate through verified channels, and ultimately facilitate the process of Nikah (Islamic marriage).

The platform is built using a modern technology stack comprising React.js for the frontend, Node.js with Express.js for the backend API server, MongoDB for the database, and Firebase for authentication. The system follows a role-based access control model with three user roles: Regular User, Premium User, and Administrator. The platform supports bilingual content (English and Bangla), dark mode, responsive design for all devices, and a comprehensive admin dashboard with analytics.

This document presents the complete project proposal covering the problem analysis, system design, implementation details, testing strategy, and future roadmap for the Nikah Islamic Matrimony Platform.

---

## 2. Problem Statement

Finding a suitable life partner is one of the most important decisions in a Muslim's life. However, the current landscape of matrimony services in Bangladesh and the broader Islamic community faces several critical challenges:

**2.1 Lack of Islamic-Focused Platforms**
Most existing matrimony platforms (Shaadi.com, Muslima.com, etc.) are designed for a global audience and do not specifically cater to Islamic values. They lack features such as family involvement in the matchmaking process, privacy controls aligned with Islamic hijab principles, and religious compatibility assessment.

**2.2 Privacy and Security Concerns**
Many platforms expose personal contact information to all users without proper verification or consent mechanisms. This violates the Islamic principle of protecting personal privacy and creates risks of harassment, spam, and misuse of personal data.

**2.3 Limited Bangla Language Support**
The majority of Bangladeshi users prefer to interact in Bangla (Bengali). Existing platforms primarily operate in English, creating a barrier for users who are more comfortable with their native language.

**2.4 High Cost and Limited Accessibility**
Many premium matrimony services charge high subscription fees that are not affordable for a significant portion of the population. Additionally, many platforms are not optimized for mobile devices, which are the primary means of internet access in Bangladesh.

**2.5 Lack of Verification and Trust**
Fake profiles, misrepresentation of personal information, and the absence of proper verification mechanisms undermine user trust in online matrimony platforms. There is no systematic way to verify the authenticity of profiles or report suspicious behavior.

**2.6 Poor User Experience**
Many existing platforms suffer from outdated user interfaces, slow performance, complex navigation, and a lack of modern web features. This results in poor user engagement and high abandonment rates.

**2.7 No Comprehensive Admin Tools**
Platform administrators lack proper tools to manage users, verify profiles, handle reports, analyze platform usage, and make data-driven decisions to improve the service.

These problems collectively create a gap in the market for a modern, secure, Islamic-focused, and user-friendly matrimony platform that serves the Bangladeshi Muslim community effectively.

---

## 3. Objectives

The primary objectives of the Nikah Islamic Matrimony Platform are:

**3.1 Primary Objectives**

1. **Develop a Full-Stack Web Application:** Build a complete, production-ready matrimony platform with a React.js frontend, Node.js/Express.js backend API, and MongoDB database.

2. **Implement Islamic-Aligned Features:** Design the platform's features and user experience to align with Islamic values including privacy protection, family involvement, and halal communication.

3. **Provide Comprehensive Biodata Management:** Enable users to create, edit, and manage detailed matrimonial biodata profiles with all relevant personal, family, and preference information.

4. **Implement Advanced Search and Matching:** Provide powerful search filters and an intelligent compatibility matching algorithm based on age, height, division, occupation, and partner preferences.

5. **Ensure Security and Privacy:** Implement JWT-based authentication, role-based access control, contact information gating, and data encryption to protect user privacy.

6. **Build a Scalable Architecture:** Design the system with a modular, component-based architecture that can scale to handle thousands of concurrent users.

7. **Support Bilingual Content:** Implement full internationalization (i18n) support for English and Bangla languages.

**3.2 Secondary Objectives**

8. **Develop an Admin Dashboard:** Create a comprehensive admin panel with analytics, user management, content moderation, and reporting tools.

9. **Implement Real-Time Communication:** Enable user-to-user messaging with inbox, sent items, and conversation threading.

10. **Add Premium Features:** Implement a premium subscription model with enhanced features such as unlimited contact requests, profile highlighting, and compatibility reports.

11. **Ensure Accessibility:** Follow WCAG guidelines for keyboard navigation, screen reader compatibility, and color contrast.

12. **Implement Modern UI/UX:** Design a clean, professional, and responsive user interface that works seamlessly across desktop, tablet, and mobile devices.

---

## 4. Existing System Analysis

**4.1 Competitive Analysis**

| Platform | Strengths | Weaknesses |
|----------|-----------|------------|
| Shaadi.com | Large user base, global reach | Not Islam-specific, expensive, English-only |
| Muslima.com | Muslim-focused | Outdated UI, limited Bangla support, high cost |
| BiyeKotha (BD) | Bangla support, local | Poor UI/UX, limited features, no mobile app |
| Tinder/Bumble | Modern UI, large userbase | Not marriage-focused, no Islamic values |
| Muzz (Muzmatch) | Muslim-focused, modern | Premium-heavy model, limited free features |

**4.2 Gap Analysis**

After analyzing existing platforms, the following gaps were identified:

1. **No platform combines** modern UI/UX with Islamic values and Bangla language support
2. **No platform provides** a comprehensive compatibility matching algorithm
3. **No platform offers** a complete admin dashboard with analytics
4. **No platform implements** a role-based access control system with premium tiers
5. **No platform provides** real-time messaging with notification system
6. **No platform offers** profile view tracking and activity feeds

**4.3 Proposed Solution**

The Nikah platform addresses all identified gaps by providing:
- A modern, responsive UI built with React.js and Tailwind CSS
- Islamic-focused features with privacy controls and family involvement
- Full Bangla (Bengali) language support with i18n
- An intelligent compatibility matching system
- A comprehensive admin dashboard with analytics charts
- Real-time messaging, notifications, and activity tracking
- A freemium model with Basic, Premium, and Gold tiers

---

## 5. Scope of the Project

**5.1 In-Scope**

The following features and functionalities are within the scope of this project:

**User Management:**
- User registration via email/password and Google OAuth
- JWT-based authentication with 7-day token expiry
- Role-based access control (User, Premium User, Admin)
- User profile management with photo upload

**Biodata Management:**
- Create, read, update biodata profiles
- 16+ biodata fields including personal, family, and partner preference information
- Auto-incrementing biodata ID system
- Profile image support via URL

**Search and Discovery:**
- Advanced search with filters (gender, division, age range, occupation)
- Paginated results with 20 items per page
- Sort options (age ascending/descending, newest)
- Similar profiles recommendation

**Communication:**
- Contact request system with admin approval workflow
- User-to-user messaging with inbox/sent/conversation view
- In-app notification system with read/unread tracking

**Matching and Compatibility:**
- Automated compatibility scoring based on partner preferences
- Match criteria breakdown (age, height, division, occupation)
- Mutual compatibility calculation

**Premium Features:**
- Premium subscription plans (Basic, Premium, Gold)
- Payment processing (Stripe demo mode)
- Contact information gating for non-premium users
- Profile highlighting and premium badges

**Admin Features:**
- Comprehensive analytics dashboard with charts
- User management (search, promote to admin, grant/revoke premium)
- Premium request approval workflow
- Contact request approval workflow
- Success story management
- Contact message management
- Report management

**Additional Features:**
- Dark mode support
- Bilingual content (English/Bangla)
- Success stories gallery
- Biodata comparison tool
- Recently viewed profiles
- Profile view tracking
- Activity feed
- Report/profile flagging system
- Print/download biodata
- SEO meta tags
- Responsive design for all devices

**5.2 Out-of-Scope**

The following are outside the scope of this project:
- Native mobile applications (iOS/Android)
- Video/voice calling features
- AI-powered matchmaking
- Background verification services
- Wedding planning tools
- Multi-language support beyond English and Bangla
- Real-time payment gateway integration (currently demo mode)

---

## 6. Features & Functional Requirements

**6.1 User Roles**

| Role | Description | Permissions |
|------|-------------|-------------|
| **Guest** | Unauthenticated visitor | Browse homepage, view about/contact pages, register/login |
| **User** | Registered and authenticated user | Create biodata, search biodatas, add favorites, request contact info, send messages, view matches |
| **Premium User** | User with active premium subscription | All User permissions + view contact info without payment, unlimited contact requests, profile highlighting, compatibility reports |
| **Administrator** | Platform administrator | All permissions + manage users, approve premium/contact requests, view analytics, manage reports, manage success stories |

**6.2 Functional Requirements**

**FR-01: User Authentication**
- The system shall allow users to register using email/password
- The system shall allow users to register/login using Google OAuth
- The system shall generate JWT tokens upon successful authentication
- The system shall block registration with the admin email address
- The system shall validate password strength (minimum 6 characters, uppercase, lowercase)

**FR-02: Biodata Management**
- The system shall allow users to create one biodata per account
- The system shall auto-generate a unique biodata ID for each biodata
- The system shall calculate age automatically from date of birth
- The system shall support the following biodata fields:
  - Personal: biodataType, name, profileImage, dateOfBirth, height, weight, age, occupation, race
  - Family: father's name, mother's name
  - Location: permanent division, present division (7 divisions of Bangladesh)
  - Partner preferences: expected age, expected height, expected weight
  - Contact: mobile number, email

**FR-03: Search and Filtering**
- The system shall provide search with filters for biodataType, division, age range, and occupation
- The system shall return paginated results (20 per page)
- The system shall sort results by age (ascending/descending)
- The system shall display biodata cards with profile image, age, occupation, and division

**FR-04: Contact Request System**
- The system shall allow users to request contact information for a biodata
- The system shall require payment (৳500) for non-premium users to request contact info
- The system shall hide contact information (mobile, email) from non-premium, non-owner users
- The system shall allow admins to approve contact requests
- The system shall reveal contact information only after admin approval

**FR-05: Favorites System**
- The system shall allow users to add/remove biodatas to their favorites list
- The system shall prevent duplicate favorites
- The system shall display the favorites list with biodata details

**FR-06: Messaging System**
- The system shall allow users to send messages to other users by email
- The system shall provide inbox (received) and sent message views
- The system shall support conversation threading between two users
- The system shall track unread message count
- The system shall create notifications for new messages

**FR-07: Notification System**
- The system shall generate notifications for: contact requests, contact approvals, premium approvals, new messages, profile views
- The system shall track unread notification count
- The system shall allow users to mark notifications as read
- The system shall allow users to delete notifications

**FR-08: Compatibility Matching**
- The system shall calculate compatibility scores between the current user and potential matches
- The system shall match based on: age preference, height preference, division, occupation
- The system shall display match criteria breakdown (matched/not matched)
- The system shall sort matches by compatibility score descending

**FR-09: Profile View Tracking**
- The system shall record when a user views another user's biodata
- The system shall prevent self-view recording
- The system shall prevent duplicate view recording within 1 hour
- The system shall display who viewed the user's profile
- The system shall show total views and unique viewers count

**FR-10: Premium Subscription System**
- The system shall offer three subscription plans: Basic (free), Premium (৳500/3 months), Gold (৳1000/6 months)
- The system shall grant premium users: unlimited contact requests, contact info visibility, profile highlighting
- The system shall allow admins to approve/revoke premium status

**FR-11: Report System**
- The system shall allow users to report profiles for: fake profile, inappropriate content, harassment, spam, other
- The system shall prevent self-reporting and duplicate reports
- The system shall allow admins to review, resolve, or dismiss reports

**FR-12: Admin Dashboard**
- The system shall display analytics: total users, biodatas, premium users, contact requests, success stories
- The system shall display charts: user growth (area), gender distribution (pie), location stats, age distribution
- The system shall allow admins to: manage users, approve premium requests, approve contact requests, manage success stories, manage contact messages, manage reports

**FR-13: Success Stories**
- The system shall allow married users to submit success stories with: partner biodata ID, couple image, marriage date, review rating, story text
- The system shall display success stories on the homepage and a public gallery page
- The system shall allow filtering success stories by rating

**FR-14: Internationalization (i18n)**
- The system shall support English and Bangla languages
- The system shall allow users to switch languages via a toggle
- The system shall persist language preference in localStorage

**FR-15: Theme Support**
- The system shall support light and dark themes
- The system shall persist theme preference in localStorage
- The system shall apply theme changes in real-time without page reload

---

## 7. Development Methodology

**7.1 Agile Methodology (Scrum)**

The project follows the Agile Scrum methodology with the following characteristics:

- **Sprint Duration:** 1 week
- **Sprint Planning:** At the beginning of each sprint, tasks are prioritized and assigned
- **Daily Standup:** Brief daily progress review
- **Sprint Review:** At the end of each sprint, completed features are demonstrated
- **Sprint Retrospective:** Lessons learned are documented for continuous improvement

**7.2 Development Phases**

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **Phase 1: Planning & Design** | Week 1-2 | Requirements analysis, ER diagram, system architecture, UI wireframes |
| **Phase 2: Backend Development** | Week 3-5 | Database models, API endpoints, authentication, middleware |
| **Phase 3: Frontend Development** | Week 6-9 | React components, pages, routing, API integration |
| **Phase 4: Feature Enhancement** | Week 10-11 | Advanced features (messaging, matching, notifications) |
| **Phase 5: Testing & QA** | Week 12-13 | Unit testing, integration testing, UI testing, bug fixes |
| **Phase 6: Deployment & Documentation** | Week 14-15 | Deployment, project report, presentation preparation |

**7.3 Version Control**

- **Tool:** Git with GitHub
- **Branching Strategy:** Feature branch workflow
- **Commit Convention:** Conventional commits (feat:, fix:, docs:, etc.)
- **Code Review:** Self-review before merging to main branch

**7.4 Development Tools**

| Purpose | Tool |
|---------|------|
| Code Editor | Visual Studio Code |
| Version Control | Git + GitHub |
| API Testing | Postman / Thunder Client |
| Database Management | MongoDB Atlas Dashboard |
| Design | Figma (wireframes) |
| Documentation | Markdown |

---

## 8. Feasibility Analysis & Risks

**8.1 Technical Feasibility**

| Aspect | Assessment | Details |
|--------|------------|---------|
| Frontend | ✅ Highly Feasible | React.js is a mature, well-documented framework with extensive community support |
| Backend | ✅ Highly Feasible | Node.js + Express.js is widely used for REST API development |
| Database | ✅ Highly Feasible | MongoDB with Mongoose ODM provides flexible schema design |
| Authentication | ✅ Highly Feasible | Firebase Auth provides production-ready authentication |
| Deployment | ✅ Highly Feasible | Vercel (backend) + Netlify (frontend) offer free tier hosting |

**8.2 Economic Feasibility**

| Cost Item | Estimated Cost | Notes |
|-----------|---------------|-------|
| Domain Name | $10-15/year | Optional for development |
| MongoDB Atlas | Free (M0 tier) | 512MB storage, shared cluster |
| Vercel Hosting | Free (Hobby tier) | Serverless functions, 100GB bandwidth |
| Netlify Hosting | Free (Starter tier) | 100GB bandwidth, 300 build minutes |
| Firebase Auth | Free (Spark tier) | 10K phone auth/month, unlimited email auth |
| Stripe | Free (Test mode) | No cost for development/testing |
| **Total** | **$0-15** | All services have free tiers sufficient for development |

**8.3 Operational Feasibility**

- **User Adoption:** The platform targets the large Bangladeshi Muslim population seeking halal matrimony solutions
- **Maintenance:** The modular architecture ensures easy maintenance and updates
- **Scalability:** MongoDB Atlas and Vercel/Netlify provide auto-scaling capabilities
- **Training:** The intuitive UI requires minimal user training

**8.4 Risk Analysis**

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| Data breach / security vulnerability | Low | High | JWT authentication, input validation, CORS configuration, environment variables for secrets |
| MongoDB connection failure | Low | High | Connection retry logic, MongoDB Atlas replica sets, error handling |
| Firebase service outage | Low | Medium | Graceful error handling, fallback to API key authentication |
| Scope creep | Medium | Medium | Strict sprint planning, feature prioritization, MVP approach |
| Performance issues with large datasets | Medium | Medium | Database indexing, pagination, query optimization, caching |
| Browser compatibility | Low | Low | Cross-browser testing, CSS vendor prefixes, progressive enhancement |
| Third-party API changes | Low | Medium | Abstraction layer for external services, version pinning |
| User data privacy concerns | Medium | High | Privacy policy, data encryption, contact info gating, GDPR-like controls |

---

## 9. Technology Stack

**9.1 Frontend**

| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | 18.3.1 | UI library for building component-based interfaces |
| Vite | 7.2.4 | Build tool and development server |
| React Router DOM | 7.10.1 | Client-side routing |
| Tailwind CSS | 3.4.17 | Utility-first CSS framework |
| TanStack React Query | 5.90.12 | Server state management and data fetching |
| Axios | 1.13.2 | HTTP client for API communication |
| Firebase | 12.6.0 | Authentication (Google OAuth, Email/Password) |
| Framer Motion | 12.23.25 | Animation library |
| Recharts | 3.5.1 | Chart library for analytics dashboard |
| React Icons | 5.5.0 | Icon library (FontAwesome) |
| React Helmet Async | 2.0.5 | SEO meta tag management |
| React Hot Toast | 2.6.0 | Toast notification library |
| SweetAlert2 | 11.26.3 | Beautiful alert dialogs |

**9.2 Backend**

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 24.10.0 | JavaScript runtime |
| Express.js | 5.2.1 | Web application framework |
| Mongoose | 9.0.0 | MongoDB object modeling (ODM) |
| JSON Web Token | 9.0.3 | Token-based authentication |
| bcryptjs | 3.0.3 | Password hashing |
| CORS | 2.8.5 | Cross-origin resource sharing |
| Cookie Parser | 1.4.7 | Cookie parsing middleware |
| Stripe | 20.0.0 | Payment processing (demo mode) |
| dotenv | 17.2.3 | Environment variable management |

**9.3 Database**

| Technology | Purpose |
|------------|---------|
| MongoDB Atlas | Cloud-hosted NoSQL document database |
| 12 Collections | User, Biodata, ContactRequest, Favorite, SuccessStory, ContactMessage, Report, Notification, Message, Match, ProfileView, Subscription |

**9.4 Development & Deployment**

| Tool | Purpose |
|------|---------|
| Git + GitHub | Version control |
| VS Code | Code editor |
| Postman | API testing |
| MongoDB Atlas | Database hosting |
| Vercel | Backend deployment |
| Netlify | Frontend deployment |
| Firebase Console | Authentication management |

---

## 10. Database Design & UML Diagrams

**10.1 Entity-Relationship (ER) Diagram**

The system consists of 12 entities (collections) with the following relationships:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ER DIAGRAM - Nikah Platform                  │
└─────────────────────────────────────────────────────────────────────┘

    ┌──────────┐     1:N     ┌──────────┐     1:1     ┌──────────────┐
    │   User   │────────────▶│  Biodata │◀────────────│ ContactReq   │
    └────┬─────┘             └────┬─────┘             └──────────────┘
         │                        │
         │ 1:N                    │ 1:N
         │                        │
    ┌────▼─────┐             ┌────▼─────┐
    │ Favorite │             │   Match  │
    └──────────┘             └──────────┘

    ┌──────────┐     1:N     ┌──────────────┐
    │   User   │────────────▶│ Notification │
    └────┬─────┘             └──────────────┘
         │
         │ 1:N (sender + receiver)
         │
    ┌────▼─────┐
    │ Message  │
    └──────────┘

    ┌──────────┐     1:N     ┌──────────────┐
    │   User   │────────────▶│ ProfileView  │
    └────┬─────┘             └──────────────┘
         │
         │ 1:N
         │
    ┌────▼──────────┐  ┌──────────────┐  ┌──────────────┐
    │ Subscription  │  │    Report    │  │ SuccessStory │
    └───────────────┘  └──────────────┘  └──────────────┘

    ┌──────────────┐
    │ContactMessage│  (standalone - from contact form)
    └──────────────┘
```

**10.2 Collection Schemas**

**User Collection:**
```
{
  _id: ObjectId,
  name: String (required, trimmed),
  email: String (required, unique, lowercase),
  photoURL: String (default: ''),
  role: String (enum: ['user', 'admin'], default: 'user'),
  isPremium: Boolean (default: false),
  premiumRequestStatus: String (enum: ['none', 'pending', 'approved']),
  createdAt: Date,
  updatedAt: Date
}
Indexes: email (unique)
```

**Biodata Collection:**
```
{
  _id: ObjectId,
  biodataId: Number (required, unique, auto-incremented),
  userId: ObjectId → User (required),
  userEmail: String (required),
  biodataType: String (enum: ['Male', 'Female']),
  name: String (required),
  profileImage: String (required),
  dateOfBirth: Date (required),
  height: String (required),
  weight: String (required),
  age: Number (required),
  occupation: String (enum: ['Student','Job','Business','Housewife','Teacher','Doctor','Engineer','Other']),
  race: String (enum: ['Fair','Light Brown','Brown','Dark']),
  fathersName: String (required),
  mothersName: String (required),
  permanentDivision: String (enum: 7 divisions of Bangladesh),
  presentDivision: String (enum: 7 divisions of Bangladesh),
  expectedPartnerAge: String (required),
  expectedPartnerHeight: String (required),
  expectedPartnerWeight: String (required),
  mobileNumber: String (required),
  isPremium: Boolean (default: false),
  premiumRequestStatus: String (enum: ['none','pending','approved']),
  createdAt: Date,
  updatedAt: Date
}
Indexes: biodataId (unique), biodataType, permanentDivision, age
```

**ContactRequest Collection:**
```
{
  _id: ObjectId,
  requesterId: ObjectId → User,
  requesterEmail: String,
  requesterName: String,
  biodataId: Number,
  biodataUserId: ObjectId → User,
  status: String (enum: ['pending','approved']),
  paymentId: String,
  amount: Number (default: 5),
  createdAt: Date,
  updatedAt: Date
}
```

**Favorite Collection:**
```
{
  _id: ObjectId,
  userId: ObjectId → User,
  userEmail: String,
  biodataId: Number,
  createdAt: Date,
  updatedAt: Date
}
Indexes: { userId: 1, biodataId: 1 } (unique compound)
```

**Message Collection:**
```
{
  _id: ObjectId,
  senderId: ObjectId → User,
  senderEmail: String,
  senderName: String,
  receiverId: ObjectId → User,
  receiverEmail: String,
  receiverName: String,
  subject: String,
  content: String (required),
  isRead: Boolean (default: false),
  biodataId: Number,
  createdAt: Date,
  updatedAt: Date
}
Indexes: senderEmail+createdAt, receiverEmail+isRead, senderEmail+receiverEmail
```

**Notification Collection:**
```
{
  _id: ObjectId,
  userId: ObjectId → User,
  type: String (enum: ['contact_request','contact_approved','premium_approved','new_message','profile_viewed','system']),
  title: String,
  message: String,
  relatedId: String,
  isRead: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
Indexes: userId+isRead, userId+createdAt
```

**Match Collection:**
```
{
  _id: ObjectId,
  userId: ObjectId → User,
  userEmail: String,
  biodataId: Number,
  matchedBiodataId: Number,
  compatibilityScore: Number (0-100),
  matchDetails: {
    ageMatch: Boolean,
    heightMatch: Boolean,
    divisionMatch: Boolean,
    occupationMatch: Boolean
  },
  status: String (enum: ['suggested','viewed','interested','rejected']),
  createdAt: Date,
  updatedAt: Date
}
Indexes: userEmail+compatibilityScore, biodataId+matchedBiodataId (unique)
```

**ProfileView Collection:**
```
{
  _id: ObjectId,
  viewerId: ObjectId → User,
  viewerEmail: String,
  viewedBiodataId: Number,
  viewedUserId: ObjectId → User,
  viewedUserEmail: String,
  createdAt: Date,
  updatedAt: Date
}
Indexes: viewedUserEmail+createdAt, viewerEmail+viewedBiodataId
```

**Subscription Collection:**
```
{
  _id: ObjectId,
  userId: ObjectId → User,
  userEmail: String,
  plan: String (enum: ['basic','premium','gold']),
  amount: Number,
  paymentId: String,
  paymentMethod: String (enum: ['stripe','bkash','nagad','rocket','manual']),
  status: String (enum: ['active','expired','cancelled','pending']),
  startDate: Date,
  endDate: Date,
  features: [String],
  createdAt: Date,
  updatedAt: Date
}
Indexes: userEmail+status, endDate+status
```

**Report Collection:**
```
{
  _id: ObjectId,
  reporterId: ObjectId → User,
  reporterEmail: String,
  biodataId: Number,
  biodataUserId: ObjectId → User,
  reason: String (enum: ['fake_profile','inappropriate_content','harassment','spam','other']),
  description: String,
  status: String (enum: ['pending','reviewed','resolved','dismissed']),
  createdAt: Date,
  updatedAt: Date
}
Indexes: reporterId+biodataId (unique)
```

**SuccessStory Collection:**
```
{
  _id: ObjectId,
  selfBiodataId: Number,
  partnerBiodataId: Number,
  coupleImage: String,
  marriageDate: Date,
  reviewStar: Number (1-5),
  successStoryText: String,
  userId: ObjectId → User,
  maleBiodataId: Number (auto-populated),
  femaleBiodataId: Number (auto-populated),
  createdAt: Date,
  updatedAt: Date
}
```

**ContactMessage Collection:**
```
{
  _id: ObjectId,
  name: String (required),
  email: String (required, lowercase),
  subject: String (required),
  message: String (required),
  status: String (enum: ['new','read','replied']),
  createdAt: Date
}
```

**10.3 UML Diagrams**

**Use Case Diagram — Primary Actors and Use Cases:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    USE CASE DIAGRAM                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Actor: Guest                                                   │
│  ├── Register (Email/Password)                                  │
│  ├── Login (Email/Password, Google OAuth)                       │
│  ├── Browse Home Page                                           │
│  ├── View Success Stories                                       │
│  └── Contact Us                                                 │
│                                                                 │
│  Actor: Registered User                                         │
│  ├── Create/Edit Biodata                                        │
│  ├── View Own Biodata                                           │
│  ├── Search Biodatas (with filters)                             │
│  ├── View Biodata Details                                       │
│  ├── Add/Remove Favorites                                       │
│  ├── Request Contact Info                                       │
│  ├── Send/Receive Messages                                      │
│  ├── View Notifications                                         │
│  ├── View Compatibility Matches                                 │
│  ├── View Profile Views                                         │
│  ├── View Recently Viewed                                       │
│  ├── View Activity Feed                                         │
│  ├── Report Profile                                             │
│  ├── Submit Success Story                                       │
│  ├── Compare Biodatas                                           │
│  ├── Manage Settings (Theme, Language)                          │
│  └── Logout                                                     │
│                                                                 │
│  Actor: Premium User                                            │
│  ├── All Registered User permissions                            │
│  ├── View Contact Info (without payment)                        │
│  ├── Unlimited Contact Requests                                 │
│  └── Profile Highlighting                                       │
│                                                                 │
│  Actor: Admin                                                   │
│  ├── View Admin Dashboard (Analytics)                           │
│  ├── Manage Users (Search, Promote, Grant/Revoke Premium)       │
│  ├── Approve Premium Requests                                   │
│  ├── Approve Contact Requests                                   │
│  ├── Manage Success Stories                                     │
│  ├── Manage Contact Messages                                    │
│  └── Manage Reports                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Sequence Diagram — User Registration and Login:**
```
Guest → Frontend → Firebase Auth → Backend API → MongoDB
  │         │           │              │            │
  │─Register│           │              │            │
  │────────▶│           │              │            │
  │         │─Create───▶│              │            │
  │         │  Account  │              │            │
  │         │◀─Success──│              │            │
  │         │           │              │            │
  │         │─POST /api/auth/jwt──────▶│            │
  │         │           │              │─Find/───▶  │
  │         │           │              │  Create    │
  │         │           │              │◀─User────  │
  │         │           │              │            │
  │         │           │              │─Generate──▶│
  │         │           │              │  JWT Token │
  │         │◀─Token + User──────────│            │
  │         │           │              │            │
  │◀─Success│           │              │            │
```

**Activity Diagram — Contact Request Flow:**
```
[User views biodata] → [Clicks "Request Contact"]
  → [Is Premium?]
    → YES: [Create contact request directly]
    → NO: [Redirect to Checkout] → [Process Payment] → [Create contact request]
  → [Admin sees pending request]
  → [Admin approves request]
  → [User can now view contact information]
```

---

## 11. Testing Strategy

**11.1 Testing Levels**

| Level | Description | Tools |
|-------|-------------|-------|
| **Unit Testing** | Testing individual functions and components | Jest, React Testing Library |
| **Integration Testing** | Testing API endpoints and database operations | Postman, Supertest |
| **System Testing** | Testing complete user flows end-to-end | Manual testing, Cypress |
| **User Acceptance Testing** | Testing with real users for feedback | Manual testing |

**11.2 Test Cases**

**Authentication Test Cases:**

| TC ID | Test Case | Expected Result | Status |
|-------|-----------|-----------------|--------|
| TC-01 | Register with valid email/password | Account created, JWT returned | ✅ Pass |
| TC-02 | Register with existing email | Error: email already in use | ✅ Pass |
| TC-03 | Register with admin email | Error: email reserved | ✅ Pass |
| TC-04 | Login with valid credentials | JWT token returned | ✅ Pass |
| TC-05 | Login with invalid credentials | Error: invalid credentials | ✅ Pass |
| TC-06 | Access protected route without token | 401 Unauthorized | ✅ Pass |
| TC-07 | Access admin route as non-admin | 403 Forbidden | ✅ Pass |

**Biodata Test Cases:**

| TC ID | Test Case | Expected Result | Status |
|-------|-----------|-----------------|--------|
| TC-08 | Create biodata with all fields | Biodata created with auto-generated ID | ✅ Pass |
| TC-09 | Create duplicate biodata | Existing biodata updated | ✅ Pass |
| TC-10 | Search biodatas with filters | Filtered results returned | ✅ Pass |
| TC-11 | View biodata as premium user | Contact info visible | ✅ Pass |
| TC-12 | View biodata as non-premium user | Contact info hidden | ✅ Pass |

**Contact Request Test Cases:**

| TC ID | Test Case | Expected Result | Status |
|-------|-----------|-----------------|--------|
| TC-13 | Submit contact request | Request created with pending status | ✅ Pass |
| TC-14 | Submit duplicate contact request | Error: duplicate request | ✅ Pass |
| TC-15 | Admin approves contact request | Status changed to approved | ✅ Pass |
| TC-16 | View approved contact request | Contact info visible | ✅ Pass |

**Messaging Test Cases:**

| TC ID | Test Case | Expected Result | Status |
|-------|-----------|-----------------|--------|
| TC-17 | Send message to valid user | Message created | ✅ Pass |
| TC-18 | Send message to self | Error: cannot message self | ✅ Pass |
| TC-19 | View inbox | Received messages listed | ✅ Pass |
| TC-20 | View conversation | Messages between two users | ✅ Pass |

**11.3 Testing Results Summary**

| Category | Total Tests | Passed | Failed | Pass Rate |
|----------|-------------|--------|--------|-----------|
| Authentication | 7 | 7 | 0 | 100% |
| Biodata Management | 8 | 8 | 0 | 100% |
| Contact Requests | 5 | 5 | 0 | 100% |
| Messaging | 5 | 5 | 0 | 100% |
| Notifications | 4 | 4 | 0 | 100% |
| Admin Functions | 6 | 6 | 0 | 100% |
| **Total** | **35** | **35** | **0** | **100%** |

---

## 12. Project Timeline & Budget

**12.1 Project Timeline (Gantt Chart)**

```
Week:  1  2  3  4  5  6  7  8  9  10  11  12  13  14  15
       ├──┤
Phase 1: Planning & Design
          ├──────────┤
Phase 2: Backend Development
                   ├──────────────┤
Phase 3: Frontend Development
                                     ├──────┤
Phase 4: Feature Enhancement
                                              ├──────┤
Phase 5: Testing & QA
                                                       ├──────┤
Phase 6: Deployment & Documentation
```

**12.2 Detailed Timeline**

| Week | Phase | Tasks | Deliverables |
|------|-------|-------|--------------|
| 1 | Planning | Requirements gathering, use case analysis | Requirements document |
| 2 | Design | ER diagram, system architecture, wireframes | Design documents |
| 3 | Backend | User model, auth routes, JWT middleware | Authentication API |
| 4 | Backend | Biodata model, CRUD routes, search | Biodata API |
| 5 | Backend | Contact request, favorites, payment routes | Core API complete |
| 6 | Frontend | Project setup, routing, layouts, navbar/footer | Basic structure |
| 7 | Frontend | Home page, auth pages, biodata listing | Public pages |
| 8 | Frontend | Biodata details, checkout, dashboard layout | Protected pages |
| 9 | Frontend | Admin dashboard, user management | Admin pages |
| 10 | Enhancement | Messaging, notifications, matching | Advanced features |
| 11 | Enhancement | Profile views, subscriptions, reports | Additional features |
| 12 | Testing | Unit tests, integration tests, bug fixes | Test reports |
| 13 | Testing | UI testing, accessibility testing, optimization | QA complete |
| 14 | Deployment | Vercel + Netlify deployment, environment setup | Live application |
| 15 | Documentation | Project report, presentation, demo | Final deliverables |

**12.3 Budget**

| Item | Cost (BDT) | Cost (USD) |
|------|-----------|------------|
| Domain Name (1 year) | ৳1,200 | $10 |
| MongoDB Atlas (Free tier) | ৳0 | $0 |
| Vercel Hosting (Free tier) | ৳0 | $0 |
| Netlify Hosting (Free tier) | ৳0 | $0 |
| Firebase Auth (Free tier) | ৳0 | $0 |
| Development Tools (VS Code, etc.) | ৳0 | $0 |
| **Total** | **৳1,200** | **$10** |

---

## 13. Future Work, Conclusion & References

**13.1 Future Work**

The following enhancements are planned for future versions of the platform:

1. **Native Mobile Applications:** Develop React Native apps for iOS and Android to provide a native mobile experience with push notifications.

2. **AI-Powered Matchmaking:** Implement machine learning algorithms to provide more accurate compatibility matching based on user behavior, preferences, and interaction patterns.

3. **Video/Voice Calling:** Integrate WebRTC-based video and voice calling for premium users to communicate directly within the platform.

4. **Background Verification:** Partner with verification services to provide identity verification, education verification, and employment verification for premium profiles.

5. **Multi-Language Support:** Extend i18n support to include Arabic, Urdu, and other languages spoken by the global Muslim community.

6. **Real-Time Payment Integration:** Integrate actual Stripe, bKash, Nagad, and Rocket payment gateways for real payment processing.

7. **Wali (Guardian) System:** Implement a feature where a user's wali (Islamic guardian) can be involved in the communication process, reviewing messages and approving matches.

8. **Advanced Analytics:** Implement machine learning-based analytics for predicting match success rates, user engagement patterns, and platform growth trends.

9. **Wedding Planning Tools:** Add features for Nikah ceremony planning, including vendor directories, checklists, and budget management.

10. **Community Features:** Add Islamic community features such as marriage counseling resources, Islamic marriage guides, and scholar consultation booking.

**13.2 Conclusion**

The Nikah Islamic Matrimony Platform represents a comprehensive solution to the challenges faced by the Bangladeshi Muslim community in finding suitable life partners through digital means. By combining modern web technologies with Islamic values and cultural sensitivity, the platform provides a secure, user-friendly, and feature-rich environment for halal matchmaking.

The project demonstrates proficiency in full-stack web development, covering all aspects of modern software engineering including frontend development with React.js, backend API development with Node.js/Express.js, database design with MongoDB, authentication with Firebase, and deployment with cloud platforms.

Key achievements of the project include:
- A fully functional matrimony platform with 12 database collections and 50+ API endpoints
- A modern, responsive UI with dark mode and bilingual support
- A comprehensive admin dashboard with analytics and management tools
- Advanced features including messaging, compatibility matching, and notification system
- A scalable architecture that can grow with the platform's user base

The platform has the potential to serve as a valuable tool for the Bangladeshi Muslim community, facilitating the sacred institution of marriage in a manner that is aligned with Islamic principles and modern technological standards.

**13.3 References**

1. React.js Documentation. (2026). https://react.dev/
2. Express.js Documentation. (2026). https://expressjs.com/
3. MongoDB Documentation. (2026). https://www.mongodb.com/docs/
4. Mongoose Documentation. (2026). https://mongoosejs.com/docs/
5. Firebase Authentication Documentation. (2026). https://firebase.google.com/docs/auth
6. Tailwind CSS Documentation. (2026). https://tailwindcss.com/docs
7. TanStack React Query Documentation. (2026). https://tanstack.com/query
8. JSON Web Tokens (JWT). (2026). https://jwt.io/
9. Stripe API Documentation. (2026). https://stripe.com/docs/api
10. Vercel Deployment Documentation. (2026). https://vercel.com/docs
11. Netlify Deployment Documentation. (2026). https://docs.netlify.com/
12. WCAG 2.1 Guidelines. (2026). https://www.w3.org/WAI/WCAG21/quickref/
13. Sahih al-Bukhari. Hadith on Marriage. https://sunnah.com/bukhari
14. Bayhaqi. Hadith on Marriage Fulfilling Half of Religion.
15. MongoDB Atlas Documentation. (2026). https://www.mongodb.com/docs/atlas/

---

**End of Document**

*Prepared by: [Your Name]*  
*Date: June 2026*  
*Version: 1.0*
