import React, { lazy, Suspense } from 'react';
import { Navigate } from 'react-router';
import HomePage from './pages/HomePage';
import BrowsePropertiesPage from './pages/BrowsePropertiesPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import OwnerFeaturesPage from './pages/OwnerFeaturesPage';
import BlogsPage from './pages/BlogsPage';
import AboutUsPage from './pages/AboutUsPage';
import OurStoryPage from './pages/OurStoryPage';
import FAQsPage from './pages/FAQsPage';
import HelpCenterPage from './pages/HelpCenterPage';
import HowToUsePage from './pages/HowToUsePage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TestAuthPage from './pages/TestAuthPage';
import MessCentersPage from './pages/MessCentersPage';
import MessDetailPage from './pages/MessDetailPage';
import InstallAppPage from './pages/InstallAppPage';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Properties from './pages/admin/Properties';
import PropertyForm from './pages/admin/PropertyForm';
import RoomManagement from './pages/admin/RoomManagement';
import Blogs from './pages/admin/Blogs';
import BlogForm from './pages/admin/BlogForm';
import Queries from './pages/admin/Queries';
import Visits from './pages/admin/UserVisits';
import MessCenters from './pages/admin/MessCenters';
import MessForm from './pages/admin/MessForm';
import Coupons from './pages/admin/Coupons';
import ChatbotFeedback from './pages/admin/ChatbotFeedback';
import PropertyListingRequests from './pages/admin/PropertyListingRequests';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';
import AdminLayout from './components/layouts/AdminLayout';
import WelcomePage from './pages/mobile/WelcomePage';
import MobileHomePage from './pages/mobile/MobileHomePage';
import ChatPage from './pages/mobile/ChatPage';
import MobilePropertyDetailPage from './pages/mobile/MobilePropertyDetailPage';
import MobileProfilePage from './pages/mobile/MobileProfilePage';
import MobileSearchPage from './pages/mobile/MobileSearchPage';
import MobileLoginPage from './pages/mobile/MobileLoginPage';
import MobileSignupPage from './pages/mobile/MobileSignupPage';
import MobileFavoritesPage from './pages/mobile/MobileFavoritesPage';
import MobilePrivacyPolicyPage from './pages/mobile/MobilePrivacyPolicyPage';
import MobileTermsOfServicePage from './pages/mobile/MobileTermsOfServicePage';
import MobileHelpCenterPage from './pages/mobile/MobileHelpCenterPage';
import type { ReactNode } from 'react';

// Lazy load BlogPostPage to avoid react-markdown loading issues
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));

// Loading component for lazy-loaded routes
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />
  },
  {
    name: 'Browse Properties',
    path: '/browse',
    element: <BrowsePropertiesPage />
  },
  {
    name: 'Property Details',
    path: '/property/:id',
    element: <PropertyDetailsPage />,
    visible: false
  },
  {
    name: 'Favorites',
    path: '/favorites',
    element: <FavoritesPage />
  },
  {
    name: 'Owner Features',
    path: '/owner-features',
    element: <OwnerFeaturesPage />,
    visible: false
  },
  {
    name: 'Blogs',
    path: '/blogs',
    element: <BlogsPage />,
    visible: false
  },
  {
    name: 'Blog Post',
    path: '/blog/:id',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <BlogPostPage />
      </Suspense>
    ),
    visible: false
  },
  {
    name: 'About Us',
    path: '/about',
    element: <AboutUsPage />,
    visible: false
  },
  {
    name: 'Our Story',
    path: '/our-story',
    element: <OurStoryPage />,
    visible: false
  },
  {
    name: 'FAQs',
    path: '/faqs',
    element: <FAQsPage />,
    visible: false
  },
  {
    name: 'Help Center',
    path: '/help-center',
    element: <HelpCenterPage />,
    visible: false
  },
  {
    name: 'How to Use',
    path: '/how-to-use',
    element: <HowToUsePage />,
    visible: false
  },
  {
    name: 'Contact',
    path: '/contact',
    element: <ContactPage />,
    visible: false
  },
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
    visible: false
  },
  {
    name: 'Terms of Service',
    path: '/terms',
    element: <TermsOfServicePage />,
    visible: false
  },
  {
    name: 'Privacy Policy',
    path: '/privacy',
    element: <PrivacyPolicyPage />,
    visible: false
  },
  {
    name: 'Test Auth',
    path: '/test-auth',
    element: <TestAuthPage />,
    visible: false
  },
  {
    name: 'Mess Centers',
    path: '/mess',
    element: <MessCentersPage />,
    visible: false
  },
  {
    name: 'Mess Detail',
    path: '/mess/:id',
    element: <MessDetailPage />,
    visible: false
  },
  {
    name: 'Install App',
    path: '/install',
    element: <InstallAppPage />,
    visible: false
  },
  // Mobile App Routes
  {
    name: 'Welcome',
    path: '/welcome',
    element: <WelcomePage />,
    visible: false
  },
  {
    name: 'Mobile Home',
    path: '/mobile',
    element: <MobileHomePage />,
    visible: false
  },
  {
    name: 'Mobile Chat',
    path: '/mobile/chat',
    element: <ChatPage />,
    visible: false
  },
  {
    name: 'Mobile Property Detail',
    path: '/mobile/property/:id',
    element: <MobilePropertyDetailPage />,
    visible: false
  },
  {
    name: 'Mobile Profile',
    path: '/mobile/profile',
    element: <MobileProfilePage />,
    visible: false
  },
  {
    name: 'Mobile Search',
    path: '/mobile/search',
    element: <MobileSearchPage />,
    visible: false
  },
  {
    name: 'Mobile Login',
    path: '/mobile/login',
    element: <MobileLoginPage />,
    visible: false
  },
  {
    name: 'Mobile Signup',
    path: '/mobile/signup',
    element: <MobileSignupPage />,
    visible: false
  },
  {
    name: 'Mobile Favorites',
    path: '/mobile/favorites',
    element: <MobileFavoritesPage />,
    visible: false
  },
  {
    name: 'Mobile Privacy Policy',
    path: '/mobile/privacy-policy',
    element: <MobilePrivacyPolicyPage />,
    visible: false
  },
  {
    name: 'Mobile Terms of Service',
    path: '/mobile/terms-of-service',
    element: <MobileTermsOfServicePage />,
    visible: false
  },
  {
    name: 'Mobile Help Center',
    path: '/mobile/help-center',
    element: <MobileHelpCenterPage />,
    visible: false
  },
  // Admin Routes
  {
    name: 'Admin Root',
    path: '/admin',
    element: (
      <ProtectedAdminRoute>
        <Navigate to="/admin/dashboard" replace />
      </ProtectedAdminRoute>
    ),
    visible: false
  },
  {
    name: 'Admin Login',
    path: '/admin/login',
    element: <AdminLogin />,
    visible: false
  },
  {
    name: 'Admin Dashboard',
    path: '/admin/dashboard',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout>
          <Dashboard />
        </AdminLayout>
      </ProtectedAdminRoute>
    ),
    visible: false
  },
  {
    name: 'Admin Properties',
    path: '/admin/properties',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout>
          <Properties />
        </AdminLayout>
      </ProtectedAdminRoute>
    ),
    visible: false
  },
  {
    name: 'New Property',
    path: '/admin/properties/new',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout>
          <PropertyForm />
        </AdminLayout>
      </ProtectedAdminRoute>
    ),
    visible: false
  },
  {
    name: 'Edit Property',
    path: '/admin/properties/edit/:id',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout>
          <PropertyForm />
        </AdminLayout>
      </ProtectedAdminRoute>
    ),
    visible: false
  },
  {
    name: 'Room Management',
    path: '/admin/properties/:propertyId/rooms',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout>
          <RoomManagement />
        </AdminLayout>
      </ProtectedAdminRoute>
    ),
    visible: false
  },
  {
    name: 'Admin Blogs',
    path: '/admin/blogs',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout>
          <Blogs />
        </AdminLayout>
      </ProtectedAdminRoute>
    ),
    visible: false
  },
  {
    name: 'New Blog',
    path: '/admin/blogs/new',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout>
          <BlogForm />
        </AdminLayout>
      </ProtectedAdminRoute>
    ),
    visible: false
  },
  {
    name: 'Edit Blog',
    path: '/admin/blogs/edit/:id',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout>
          <BlogForm />
        </AdminLayout>
      </ProtectedAdminRoute>
    ),
    visible: false
  },
  {
    name: 'Admin Queries',
    path: '/admin/queries',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout>
          <Queries />
        </AdminLayout>
      </ProtectedAdminRoute>
    ),
    visible: false
  },
  {
    name: 'Admin Property Listing Requests',
    path: '/admin/listing-requests',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout>
          <PropertyListingRequests />
        </AdminLayout>
      </ProtectedAdminRoute>
    ),
    visible: false
  },
  {
    name: 'Admin Visits',
    path: '/admin/visits',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout>
          <Visits />
        </AdminLayout>
      </ProtectedAdminRoute>
    ),
    visible: false
  },
  {
    name: 'Admin Mess Centers',
    path: '/admin/mess',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout>
          <MessCenters />
        </AdminLayout>
      </ProtectedAdminRoute>
    ),
    visible: false
  },
  {
    name: 'New Mess Center',
    path: '/admin/mess/new',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout>
          <MessForm />
        </AdminLayout>
      </ProtectedAdminRoute>
    ),
    visible: false
  },
  {
    name: 'Edit Mess Center',
    path: '/admin/mess/edit/:id',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout>
          <MessForm />
        </AdminLayout>
      </ProtectedAdminRoute>
    ),
    visible: false
  },
  {
    name: 'Admin Coupons',
    path: '/admin/coupons',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout>
          <Coupons />
        </AdminLayout>
      </ProtectedAdminRoute>
    ),
    visible: false
  },
  {
    name: 'Chatbot Feedback',
    path: '/admin/chatbot-feedback',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout>
          <ChatbotFeedback />
        </AdminLayout>
      </ProtectedAdminRoute>
    ),
    visible: false
  }
];

export default routes;
