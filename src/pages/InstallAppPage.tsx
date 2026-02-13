import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PWAInstructions } from '@/components/pwa/PWAInstructions';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

const InstallAppPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Install App - RoomSaathi</title>
        <meta name="description" content="Install the RoomSaathi mobile app for a better experience with offline access, faster loading, and instant updates." />
      </Helmet>
      
      <Header />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-4xl py-8">
          <PWAInstructions />
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default InstallAppPage;
