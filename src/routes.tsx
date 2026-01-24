import HomePage from './pages/HomePage';
import BrowsePropertiesPage from './pages/BrowsePropertiesPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import OwnerFeaturesPage from './pages/OwnerFeaturesPage';
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
  }
];

export default routes;
