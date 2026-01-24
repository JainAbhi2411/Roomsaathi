import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import HeroSection from '@/components/home/HeroSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import PropertyTypesSection from '@/components/home/PropertyTypesSection';
import CitiesSection from '@/components/home/CitiesSection';
import FeaturedPropertiesSection from '@/components/home/FeaturedPropertiesSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import StatsSection from '@/components/home/StatsSection';
import CTASection from '@/components/home/CTASection';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedPropertiesSection />
        <Separator />
        <PropertyTypesSection />
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
