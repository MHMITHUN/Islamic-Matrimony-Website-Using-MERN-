# 💍 Muslims Nikah - Islamic Matrimony Platform (Frontend)

<div align="center">

![Muslims Nikah Banner](https://i.postimg.cc/y8Wngdrn/screencapture-localhost-5174-2025-12-06-12-10-13.png)

### A Modern Islamic Matrimony Platform Connecting Muslims Worldwide

[![Live Site](https://img.shields.io/badge/Live%20Site-muslims--nikah--website.netlify.app-00C7B7?style=for-the-badge&logo=netlify)](https://muslims-nikah-website.netlify.app)
[![Backend](https://img.shields.io/badge/Backend-Vercel-000000?style=for-the-badge&logo=vercel)](https://nikah-website-ph-a-12.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/MHMITHUN/Matrimony-Website-Client--PH-A-12)

</div>

---

## 🌟 Overview

**Muslims Nikah** is a comprehensive Islamic matrimony platform designed to help Muslims find their life partners in accordance with Islamic principles. The platform offers a modern, secure, and user-friendly experience with advanced features including biodata management, contact request systems, premium memberships, and detailed analytics for administrators.

---

## ✨ Key Features

### 👥 User Features
- **🔐 Secure Authentication** - Firebase-powered authentication with email/password and social login
- **📝 Biodata Management** - Create, edit, and manage detailed matrimonial profiles
- **🔍 Advanced Search & Filters** - Filter biodatas by age, type, division, and more
- **💖 Favorites System** - Save and manage favorite profiles
- **📧 Contact Requests** - Request contact information with premium filtering
- **💳 Premium Membership** - Stripe-integrated payment system for premium features
- **🌙 Dark Mode** - Complete dark mode support across the entire application
- **📱 Responsive Design** - Seamless experience across all devices

### 👨‍💼 Admin Features
- **📊 Comprehensive Dashboard** - Real-time analytics and statistics
- **✅ Biodata Approval System** - Review and approve user biodatas
- **💰 Revenue Tracking** - Monitor subscription revenue and transactions
- **📖 Success Stories Management** - Curate and manage success stories
- **👥 User Management** - Manage user roles and permissions
- **🔒 Contact Request Oversight** - Monitor all contact requests

### 🎯 Additional Features
- **🎉 Success Stories** - Inspiring stories from couples who found their match
- **📈 Real-time Statistics** - Live counters for biodatas, marriages, and members
- **🔔 Toast Notifications** - Beautiful, non-intrusive user feedback
- **⚡ Fast Performance** - Optimized for speed and efficiency
- **🎨 Modern UI/UX** - Glassmorphism effects, gradients, and smooth animations

---

## 🛠️ Technology Stack

### Core Technologies
- **⚛️ React 18** - Modern UI library with hooks
- **⚡ Vite** - Lightning-fast build tool and dev server
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🌼 DaisyUI** - Tailwind CSS component library

### Key Libraries & Tools
- **🔥 Firebase** - Authentication and user management
- **🌐 React Router DOM v6** - Client-side routing
- **🔄 TanStack Query (React Query)** - Server state management
- **🌍 Axios** - HTTP client for API requests
- **💳 Stripe** - Payment processing integration
- **📅 React DatePicker** - Date selection components
- **🎭 React Icons** - Comprehensive icon library
- **📊 Recharts** - Data visualization for analytics
- **🔔 React Hot Toast** - Elegant toast notifications
- **🎨 React Helmet Async** - Dynamic document head management
- **🖼️ Swiper** - Modern touch slider
- **✨ AOS (Animate On Scroll)** - Scroll-based animations

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Firebase Account** (for authentication)
- **Stripe Account** (for payment processing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MHMITHUN/Matrimony-Website-Client--PH-A-12.git
   cd Matrimony-Website-Client--PH-A-12
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000
   
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   
   # Stripe
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   
   # Image Upload (Optional)
   VITE_IMGBB_API_KEY=your_imgbb_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
client/
├── public/               # Static assets
├── src/
│   ├── assets/          # Images, fonts, and other assets
│   ├── components/      # Reusable UI components
│   │   ├── Dashboard/   # Dashboard-specific components
│   │   ├── Home/        # Home page components
│   │   ├── Shared/      # Shared components (Navbar, Footer, etc.)
│   │   └── ...
│   ├── contexts/        # React Context providers
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Layout components
│   ├── pages/           # Page components
│   │   ├── Admin/       # Admin dashboard pages
│   │   ├── Auth/        # Authentication pages
│   │   ├── Biodatas/    # Biodata listing and details
│   │   ├── Dashboard/   # User dashboard pages
│   │   └── ...
│   ├── routes/          # Route configurations
│   ├── services/        # API service functions
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main App component
│   └── main.jsx         # Application entry point
├── .env                 # Environment variables
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.js       # Vite configuration
```

---

## 🎨 UI/UX Highlights

### Design Philosophy
- **Modern & Clean** - Minimalist design with focus on content
- **Islamic Aesthetics** - Color schemes and designs respecting Islamic values
- **Accessibility First** - WCAG compliant with keyboard navigation
- **Performance Optimized** - Lazy loading, code splitting, and optimized assets

### Design Features
- **Glassmorphism Effects** - Modern frosted glass UI elements
- **Gradient Backgrounds** - Beautiful color transitions
- **Smooth Animations** - AOS and custom CSS animations
- **Dark Mode** - Complete dark theme support with smooth transitions
- **Responsive Grid** - Mobile-first responsive design
- **Custom Components** - Beautifully crafted reusable components

### Screenshots

#### Home Page
![Home Page](https://i.postimg.cc/y8Wngdrn/screencapture-localhost-5174-2025-12-06-12-10-13.png)

#### Admin Analytics Dashboard
![Admin Analytics](https://i.postimg.cc/W1tSF3f0/screencapture-localhost-5174-dashboard-admin-2025-12-06-12-11-06.png)

#### Success Stories Management
![Success Stories](https://i.postimg.cc/3xW94Rbw/screencapture-localhost-5174-dashboard-admin-success-stories-2025-12-06-12-11-43.png)

---

## 🔑 Admin Access

### Test Admin Panel Features

You can explore the complete admin dashboard with full administrative privileges using these credentials:

**Admin Login Credentials:**
- **Email:** `admin@islamicmatrimony.com`
- **Password:** `Admin@123`

**Admin Features You Can Test:**
- 📊 View comprehensive analytics and statistics
- ✅ Approve/reject user biodatas
- 👥 Manage user roles and permissions
- 💰 Monitor revenue and transactions
- 📖 Review and approve success stories
- 📧 Oversee all contact requests

✨ **Feel free to test all admin functionalities!** These are demo credentials provided for evaluation purposes.

⚠️ **Note:** In a production environment, these credentials should be secured and changed immediately.

---

## 🌐 Live Deployment

- **Frontend (Client):** [https://muslims-nikah-website.netlify.app](https://muslims-nikah-website.netlify.app)
- **Backend (Server):** [https://nikah-website-ph-a-12.vercel.app](https://nikah-website-ph-a-12.vercel.app)

### Deployment Platforms
- **Frontend:** Netlify (Continuous Deployment from GitHub)
- **Backend:** Vercel (Serverless Functions)

---

## 📦 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

---

## 🔒 Security Features

- **Firebase Authentication** - Secure user authentication
- **JWT Tokens** - Secure API communication
- **Role-Based Access Control** - Admin, premium, and regular user roles
- **Input Validation** - Client-side and server-side validation
- **Secure Payment Processing** - Stripe integration with PCI compliance
- **Environment Variables** - Sensitive data protection

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Developer

**Mohammad Mithun**

- GitHub: [@MHMITHUN](https://github.com/MHMITHUN)
- Repository: [Client](https://github.com/MHMITHUN/Matrimony-Website-Client--PH-A-12) | [Server](https://github.com/MHMITHUN/Matrimony-Website-Server--PH-A-12)

---

## 🙏 Acknowledgments

- **Firebase** - For authentication services
- **Stripe** - For payment processing
- **Netlify** - For hosting and deployment
- **Tailwind CSS & DaisyUI** - For the beautiful UI components
- All contributors and users of Muslims Nikah

---

<div align="center">

### Made with ❤️ for the Muslim Community

**[Visit Live Site](https://muslims-nikah-website.netlify.app)** | **[View Backend](https://nikah-website-ph-a-12.vercel.app)** | **[Report Bug](https://github.com/MHMITHUN/Matrimony-Website-Client--PH-A-12/issues)**

</div>
