import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router';
import IntersectObserver from '@/components/common/IntersectObserver';
import { StandaloneModeRedirect } from '@/components/common/StandaloneModeRedirect';
import { ChatbotWidget } from '@/components/chatbot/ChatbotWidget';
import { HangingNoteFeedback } from '@/components/feedback/HangingNoteFeedback';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { UpdateNotification } from '@/components/pwa/UpdateNotification';

import routes from './routes';

import { AuthProvider } from '@/contexts/AuthContext';
import { AdminProvider } from '@/contexts/AdminContext';
import { SearchFilterProvider } from '@/contexts/SearchFilterContext';
import { ChatbotProvider } from '@/contexts/ChatbotContext';
import { RouteGuard } from '@/components/common/RouteGuard';
import { Toaster } from '@/components/ui/toaster';

// Component to conditionally render website widgets based on route
const ConditionalWidgets: React.FC = () => {
  const location = useLocation();
  const isMobilePage = location.pathname.startsWith('/mobile') || location.pathname === '/welcome';
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Hide website widgets on mobile and admin pages */}
      {!isMobilePage && !isAdminPage && (
        <>
          <ChatbotWidget />
          <HangingNoteFeedback />
        </>
      )}
      {/* PWA features available on all pages */}
      <InstallPrompt />
      <UpdateNotification />
      <Toaster />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <SearchFilterProvider>
            <ChatbotProvider>
              <RouteGuard>
                <IntersectObserver />
                <StandaloneModeRedirect />
                <div className="flex flex-col min-h-screen">
                  <main className="flex-grow">
                    <Routes>
                    {routes.map((route, index) => (
                      <Route
                        key={index}
                        path={route.path}
                        element={route.element}
                      />
                    ))}
                    <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
                <ConditionalWidgets />
              </RouteGuard>
            </ChatbotProvider>
          </SearchFilterProvider>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
