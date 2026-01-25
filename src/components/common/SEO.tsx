import { Helmet } from 'react-helmet-async';
import type { SEOConfig } from '@/lib/seo';
import { defaultSEO, siteConfig } from '@/lib/seo';

interface SEOProps extends Partial<SEOConfig> {
  children?: React.ReactNode;
}

export default function SEO({
  title = defaultSEO.title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  canonical,
  ogType = defaultSEO.ogType,
  ogImage = defaultSEO.ogImage,
  ogUrl,
  twitterCard = defaultSEO.twitterCard,
  twitterImage,
  noindex = false,
  nofollow = false,
  children,
}: SEOProps) {
  const fullUrl = canonical ? `${siteConfig.url}${canonical}` : siteConfig.url;
  const imageUrl = ogImage || defaultSEO.ogImage;
  const twitterImageUrl = twitterImage || imageUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={siteConfig.author} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={fullUrl} />}
      
      {/* Robots Meta */}
      <meta 
        name="robots" 
        content={`${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`} 
      />
      <meta name="googlebot" content="index,follow" />
      <meta name="bingbot" content="index,follow" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={ogUrl || fullUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twitterImageUrl} />
      <meta name="twitter:site" content="@roomsaathi" />
      <meta name="twitter:creator" content="@roomsaathi" />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Geo Meta Tags */}
      <meta name="geo.region" content="IN-RJ" />
      <meta name="geo.placename" content="Rajasthan" />
      
      {/* Mobile Meta Tags */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteConfig.name} />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#f97316" />
      <meta name="msapplication-TileColor" content="#f97316" />
      
      {children}
    </Helmet>
  );
}
