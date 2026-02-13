import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Component to redirect users to mobile interface when app is installed as PWA
 * Detects standalone mode and redirects from root to mobile home
 */
export const StandaloneModeRedirect: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if app is running in standalone mode (installed PWA)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true || // iOS
      document.referrer.includes('android-app://'); // Android

    // Check if user has seen welcome screen before
    const hasSeenWelcome = localStorage.getItem('roomsaathi_welcome_seen');

    // Only redirect if:
    // 1. App is in standalone mode (installed)
    // 2. User is on root path
    // 3. Not already on a mobile route
    if (isStandalone && location.pathname === '/') {
      // First time users see welcome screen, returning users go to mobile home
      if (!hasSeenWelcome) {
        navigate('/welcome', { replace: true });
      } else {
        navigate('/mobile', { replace: true });
      }
    }
  }, [location.pathname, navigate]);

  return null;
};
