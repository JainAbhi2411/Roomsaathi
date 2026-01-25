import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import HeroSection from '@/components/home/HeroSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import CitiesSection from '@/components/home/CitiesSection';
import FeaturedPropertiesSection from '@/components/home/FeaturedPropertiesSection';
import CategoryBrowseSection from '@/components/home/CategoryBrowseSection';
import StudentInfoSection from '@/components/home/StudentInfoSection';
import StudentBenefitsSection from '@/components/home/StudentBenefitsSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import StatsSection from '@/components/home/StatsSection';
import CTASection from '@/components/home/CTASection';
import { Separator } from '@/components/ui/separator';
import SEO from '@/components/common/SEO';
import StructuredData from '@/components/common/StructuredData';
import { generateOrganizationSchema, generateWebSiteSchema, generateLocalBusinessSchema, generateKeywords } from '@/lib/seo';

export default function HomePage() {
  const structuredData = [
    generateOrganizationSchema(),
    generateWebSiteSchema(),
    generateLocalBusinessSchema('Sikar'),
    generateLocalBusinessSchema('Jaipur'),
    generateLocalBusinessSchema('Kota'),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="RoomSaathi - Find Your Perfect PG, Hostel, Flat & Accommodation in Sikar, Jaipur, Kota"
        description="Discover verified PG, hostels, flats, apartments, and rooms in Sikar, Jaipur, and Kota. RoomSaathi offers safe, affordable, and student-friendly accommodations with zero brokerage. Book your perfect home today!"
        keywords={generateKeywords([
          'PG in Sikar',
          'hostel in Jaipur',
          'flat in Kota',
          'student accommodation Rajasthan',
          'paying guest',
          'rooms for rent',
          'apartments for students',
          'verified properties',
          'zero brokerage',
          'affordable housing',
          'boys hostel',
          'girls PG',
          'furnished rooms',
        ])}
        canonical="/"
        ogType="website"
      >
        <StructuredData data={structuredData} />
      </SEO>
      
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedPropertiesSection />
        <Separator />
        <CategoryBrowseSection />
        <Separator />
        <StudentInfoSection />
        <Separator />
        <StudentBenefitsSection />
        <Separator />
        <HowItWorksSection />
        <Separator />
        <CitiesSection />
        <Separator />
        <WhyChooseUsSection />
        <Separator />
        <StatsSection />
        <Separator />
        <TestimonialsSection />
        <Separator />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
