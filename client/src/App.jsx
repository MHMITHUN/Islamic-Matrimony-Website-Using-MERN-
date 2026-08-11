import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Components
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Public Pages
import Home from './pages/Home/Home';
import Biodatas from './pages/Biodatas/Biodatas';
import BiodataDetails from './pages/BiodataDetails/BiodataDetails';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminLogin from './pages/Auth/AdminLogin';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Checkout from './pages/Checkout/Checkout';
import Privacy from './pages/Privacy/Privacy';
import Terms from './pages/Terms/Terms';
import NotFound from './pages/NotFound/NotFound';
import Stories from './pages/Stories/Stories';
import Compare from './pages/Compare/Compare';
import WaliDecision from './pages/Wali/WaliDecision';
import GuidanceHub from './pages/Guidance/GuidanceHub';
import GuidanceArticle from './pages/Guidance/GuidanceArticle';

// User Dashboard Pages
import UserOverview from './pages/Dashboard/User/UserOverview';
import EditBiodata from './pages/Dashboard/User/EditBiodata';
import ViewBiodata from './pages/Dashboard/User/ViewBiodata';
import MyContactRequests from './pages/Dashboard/User/MyContactRequests';
import MyFavorites from './pages/Dashboard/User/MyFavorites';
import GotMarried from './pages/Dashboard/User/GotMarried';
import RecentlyViewed from './pages/Dashboard/User/RecentlyViewed';
import ActivityFeed from './pages/Dashboard/User/ActivityFeed';
import Settings from './pages/Dashboard/User/Settings';
import Messages from './pages/Dashboard/User/Messages';
import Notifications from './pages/Dashboard/User/Notifications';
import ProfileViews from './pages/Dashboard/User/ProfileViews';
import Matches from './pages/Dashboard/User/Matches';
import WaliPanel from './pages/Dashboard/User/WaliPanel';

// Admin Dashboard Pages
import AdminDashboard from './pages/Dashboard/Admin/AdminDashboard';
import ManageUsers from './pages/Dashboard/Admin/ManageUsers';
import ApprovedPremium from './pages/Dashboard/Admin/ApprovedPremium';
import ApprovedContacts from './pages/Dashboard/Admin/ApprovedContacts';
import AdminSuccessStories from './pages/Dashboard/Admin/AdminSuccessStories';
import ContactMessages from './pages/Dashboard/Admin/ContactMessages';
import ReportedProfiles from './pages/Dashboard/Admin/ReportedProfiles';
import VerificationRequests from './pages/Dashboard/Admin/VerificationRequests';
import ManageProviders from './pages/Dashboard/Admin/ManageProviders';
import ManageJourneys from './pages/Dashboard/Admin/ManageJourneys';
import GuardianRoute from './components/GuardianRoute';
import GuardianOverview from './pages/Dashboard/Guardian/GuardianOverview';
import GuardianWards from './pages/Dashboard/Guardian/GuardianWards';
import GuardianBrowse from './pages/Dashboard/Guardian/GuardianBrowse';
import GuardianShortlist from './pages/Dashboard/Guardian/GuardianShortlist';
import GuardianRequests from './pages/Dashboard/Guardian/GuardianRequests';
import FamilyChat from './pages/Dashboard/Guardian/FamilyChat';
import GuardianDecision from './pages/Guardian/GuardianDecision';
import MyGuardians from './pages/Dashboard/User/MyGuardians';
import TrustDashboard from './pages/Dashboard/User/TrustDashboard';
import ImamDashboard from './pages/Dashboard/Imam/ImamDashboard';
import ImamDirectory from './pages/ImamDirectory/ImamDirectory';
import KaziDirectory from './pages/KaziDirectory/KaziDirectory';
import CounselorDirectory from './pages/CounselorDirectory/CounselorDirectory';
import JourneyList from './pages/Dashboard/User/JourneyList';
import JourneyTracker from './pages/Dashboard/User/JourneyTracker';
import PremaritalCourse from './pages/Dashboard/User/PremaritalCourse';
import Sukoon from './pages/Sukoon/Sukoon';
import SukoonRequests from './pages/Dashboard/User/SukoonRequests';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    }
  }
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'biodatas', element: <Biodatas /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'login', element: <Login /> },
      { path: 'admin-login', element: <AdminLogin /> },
      { path: 'register', element: <Register /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'terms', element: <Terms /> },
      { path: 'stories', element: <Stories /> },
      { path: 'compare', element: <Compare /> },
      { path: 'wali/approve/:token', element: <WaliDecision /> },
      { path: 'guidance', element: <GuidanceHub /> },
      { path: 'guidance/:slug', element: <GuidanceArticle /> },
      { path: 'imams', element: <ImamDirectory /> },
      { path: 'kazi', element: <KaziDirectory /> },
      { path: 'counselors', element: <CounselorDirectory /> },
      { path: 'sukoon', element: <Sukoon /> },
      { path: 'guardian/link/:token', element: <GuardianDecision /> },
      {
        path: 'biodata/:id',
        element: (
          <PrivateRoute>
            <BiodataDetails />
          </PrivateRoute>
        )
      },
      {
        path: 'checkout/:biodataId',
        element: (
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        )
      }
    ]
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // User Dashboard Routes
      { index: true, element: <UserOverview /> },
      { path: 'overview', element: <UserOverview /> },
      { path: 'edit-biodata', element: <EditBiodata /> },
      { path: 'view-biodata', element: <ViewBiodata /> },
      { path: 'contact-requests', element: <MyContactRequests /> },
      { path: 'favorites', element: <MyFavorites /> },
      { path: 'got-married', element: <GotMarried /> },
      { path: 'recently-viewed', element: <RecentlyViewed /> },
      { path: 'activity', element: <ActivityFeed /> },
      { path: 'messages', element: <Messages /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'profile-views', element: <ProfileViews /> },
      { path: 'matches', element: <Matches /> },
      { path: 'wali', element: <WaliPanel /> },
      { path: 'guardian', element: <GuardianRoute><GuardianOverview /></GuardianRoute> },
      { path: 'guardian/wards', element: <GuardianRoute><GuardianWards /></GuardianRoute> },
      { path: 'guardian/browse', element: <GuardianRoute><GuardianBrowse /></GuardianRoute> },
      { path: 'guardian/shortlist', element: <GuardianRoute><GuardianShortlist /></GuardianRoute> },
      { path: 'guardian/requests', element: <GuardianRoute><GuardianRequests /></GuardianRoute> },
      { path: 'guardian/family-chat', element: <GuardianRoute><FamilyChat /></GuardianRoute> },
      { path: 'my-guardians', element: <MyGuardians /> },
      { path: 'trust', element: <TrustDashboard /> },
      { path: 'imam', element: <ImamDashboard /> },
      { path: 'journey', element: <JourneyList /> },
      { path: 'journey/:id', element: <JourneyTracker /> },
      { path: 'course', element: <PremaritalCourse /> },
      { path: 'sukoon-requests', element: <SukoonRequests /> },
      { path: 'settings', element: <Settings /> },

      // Admin Dashboard Routes
      {
        path: 'admin',
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        )
      },
      {
        path: 'admin/manage-users',
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        )
      },
      {
        path: 'admin/approved-premium',
        element: (
          <AdminRoute>
            <ApprovedPremium />
          </AdminRoute>
        )
      },
      {
        path: 'admin/approved-contacts',
        element: (
          <AdminRoute>
            <ApprovedContacts />
          </AdminRoute>
        )
      },
      {
        path: 'admin/verification-requests',
        element: (
          <AdminRoute>
            <VerificationRequests />
          </AdminRoute>
        )
      },
      {
        path: 'admin/providers',
        element: (
          <AdminRoute>
            <ManageProviders />
          </AdminRoute>
        )
      },
      {
        path: 'admin/journeys',
        element: (
          <AdminRoute>
            <ManageJourneys />
          </AdminRoute>
        )
      },
      {
        path: 'admin/contact-messages',
        element: (
          <AdminRoute>
            <ContactMessages />
          </AdminRoute>
        )
      },
      {
        path: 'admin/success-stories',
        element: (
          <AdminRoute>
            <AdminSuccessStories />
          </AdminRoute>
        )
      },
      {
        path: 'admin/reports',
        element: (
          <AdminRoute>
            <ReportedProfiles />
          </AdminRoute>
        )
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
            <RouterProvider router={router} />
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#333',
                  color: '#fff',
                },
                success: {
                  iconTheme: {
                    primary: '#2E7D32',
                    secondary: '#fff'
                  }
                },
                error: {
                  iconTheme: {
                    primary: '#C62828',
                    secondary: '#fff'
                  }
                }
              }}
            />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </LanguageProvider>
  </HelmetProvider>
  );
}

export default App;
