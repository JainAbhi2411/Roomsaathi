import React from 'react';
import HomePage from './pages/HomePage';
import BrowsePropertiesPage from './pages/BrowsePropertiesPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import OwnerFeaturesPage from './pages/OwnerFeaturesPage';
import BlogsPage from './pages/BlogsPage';
import AboutUsPage from './pages/AboutUsPage';
import OurStoryPage from './pages/OurStoryPage';
import FAQsPage from './pages/FAQsPage';
import LoginPage from './pages/LoginPage';
import type { ReactNode } from 'react';

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
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
    visible: false
  }
];

export default routes;
