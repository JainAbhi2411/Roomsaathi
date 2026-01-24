import HomePage from './pages/HomePage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
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
    name: 'Property Details',
    path: '/property/:id',
    element: <PropertyDetailsPage />,
    visible: false
  },
  {
    name: 'Favorites',
    path: '/favorites',
    element: <FavoritesPage />
  }
];

export default routes;
