// SEO Configuration and Utilities

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  twitterImage?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export const defaultSEO: SEOConfig = {
  title: 'RoomSaathi - Find Your Perfect PG, Hostel, Flat & Accommodation in Sikar, Jaipur, Kota',
  description: 'Discover verified PG, hostels, flats, apartments, and rooms in Sikar, Jaipur, and Kota. RoomSaathi offers safe, affordable, and student-friendly accommodations with zero brokerage. Book your perfect home today!',
  keywords: 'PG in Sikar, hostel in Jaipur, flat in Kota, student accommodation, paying guest, rooms for rent, apartments, verified properties, zero brokerage, RoomSaathi',
  ogType: 'website',
  ogImage: 'https://roomsaathi.com/og-image.jpg',
  twitterCard: 'summary_large_image',
};

export const siteConfig = {
  name: 'RoomSaathi',
  url: 'https://roomsaathi.com',
  description: 'Find verified PG, hostels, flats, and accommodations in Sikar, Jaipur, and Kota',
  author: 'RoomSaathi',
  email: 'support@roomsaathi.com',
  phone: '+91 98765 43210',
  address: {
    street: '123 Main Road',
    city: 'Sikar',
    state: 'Rajasthan',
    postalCode: '332001',
    country: 'India',
  },
  social: {
    facebook: 'https://facebook.com/roomsaathi',
    twitter: 'https://twitter.com/roomsaathi',
    instagram: 'https://instagram.com/roomsaathi',
    linkedin: 'https://linkedin.com/company/roomsaathi',
  },
  cities: ['Sikar', 'Jaipur', 'Kota'],
  propertyTypes: ['PG', 'Flat', 'Apartment', 'Room', 'Hostel', 'Short Term Stay'],
};

// Generate structured data for Organization
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.twitter,
      siteConfig.social.instagram,
      siteConfig.social.linkedin,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.phone,
      contactType: 'Customer Service',
      email: siteConfig.email,
      availableLanguage: ['English', 'Hindi'],
    },
  };
}

// Generate structured data for LocalBusiness
export function generateLocalBusinessSchema(city: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteConfig.url}/#localbusiness-${city.toLowerCase()}`,
    name: `${siteConfig.name} - ${city}`,
    image: `${siteConfig.url}/og-image.jpg`,
    url: `${siteConfig.url}/browse?city=${city}`,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressRegion: 'Rajasthan',
      addressCountry: 'India',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: city === 'Sikar' ? '27.6119' : city === 'Jaipur' ? '26.9124' : '25.2138',
      longitude: city === 'Sikar' ? '75.1397' : city === 'Jaipur' ? '75.7873' : '75.8648',
    },
    priceRange: '₹₹',
    servesCuisine: 'Accommodation Services',
    areaServed: {
      '@type': 'City',
      name: city,
    },
  };
}

// Generate structured data for Property (Accommodation)
export function generatePropertySchema(property: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Accommodation',
    '@id': `${siteConfig.url}/property/${property.id}`,
    name: property.name,
    description: property.description,
    image: property.images || [],
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address,
      addressLocality: property.locality,
      addressRegion: property.city,
      addressCountry: 'India',
    },
    offers: {
      '@type': 'Offer',
      price: property.price_from,
      priceCurrency: 'INR',
      availability: property.availability_status === 'Available' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${siteConfig.url}/property/${property.id}`,
    },
    amenityFeature: property.amenities?.map((amenity: any) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity.amenity_name,
    })) || [],
    numberOfRooms: property.rooms?.length || 1,
    starRating: property.verified ? {
      '@type': 'Rating',
      ratingValue: '5',
      bestRating: '5',
    } : undefined,
  };
}

// Generate structured data for BreadcrumbList
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

// Generate structured data for FAQPage
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Generate structured data for Article (Blog)
export function generateArticleSchema(article: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${siteConfig.url}/blogs/${article.slug}`,
    headline: article.title,
    description: article.excerpt,
    image: article.image_url,
    datePublished: article.created_at,
    dateModified: article.updated_at,
    author: {
      '@type': 'Person',
      name: article.author_name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/blogs/${article.slug}`,
    },
  };
}

// Generate structured data for WebSite with SearchAction
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: {
      '@id': `${siteConfig.url}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/browse?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// Generate keywords for a page
export function generateKeywords(base: string[]): string {
  const commonKeywords = [
    'RoomSaathi',
    'accommodation',
    'verified properties',
    'zero brokerage',
    'student friendly',
    'safe housing',
    'Rajasthan',
  ];
  return [...base, ...commonKeywords].join(', ');
}

// Generate page title with site name
export function generateTitle(pageTitle: string): string {
  return `${pageTitle} | ${siteConfig.name}`;
}

// Generate meta description
export function generateDescription(content: string, maxLength = 160): string {
  if (content.length <= maxLength) return content;
  return `${content.substring(0, maxLength - 3)}...`;
}
