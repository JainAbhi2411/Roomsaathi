import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router';
import IntersectObserver from '@/components/common/IntersectObserver';
import { ChatbotWidget } from '@/components/chatbot/ChatbotWidget';
import { HangingNoteFeedback } from '@/components/feedback/HangingNoteFeedback';

import routes from './routes';

import { AuthProvider } from '@/contexts/AuthContext';
import { AdminProvider } from '@/contexts/AdminContext';
import { SearchFilterProvider } from '@/contexts/SearchFilterContext';
import { ChatbotProvider } from '@/contexts/ChatbotContext';
import { RouteGuard } from '@/components/common/RouteGuard';
import { Toaster } from '@/components/ui/toaster';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <SearchFilterProvider>
            <ChatbotProvider>
              <RouteGuard>
                <IntersectObserver />
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
                <ChatbotWidget />
                <HangingNoteFeedback />
                <Toaster />
              </RouteGuard>
            </ChatbotProvider>
          </SearchFilterProvider>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
