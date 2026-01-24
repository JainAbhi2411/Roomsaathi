import React, { lazy, Suspense } from 'react';
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
import TestAuthPage from './pages/TestAuthPage';
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
    name: 'Test Auth',
    path: '/test-auth',
    element: <TestAuthPage />,
    visible: false
  }
];

export default routes;
