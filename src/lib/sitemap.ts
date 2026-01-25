import { siteConfig } from './seo';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export function generateSitemap(properties: any[] = [], blogs: any[] = []): string {
  const urls: SitemapUrl[] = [
    // Static pages
    {
      loc: '/',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: '/browse',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'hourly',
      priority: 0.9,
    },
    {
      loc: '/about',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: '/our-story',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.6,
    },
    {
      loc: '/faqs',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.7,
    },
    {
      loc: '/blogs',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 0.8,
    },
    {
      loc: '/owner-features',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: '/contact',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.6,
    },
    {
      loc: '/favorites',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'always',
      priority: 0.5,
    },
  ];

  // Add city-specific pages
  siteConfig.cities.forEach(city => {
    urls.push({
      loc: `/browse?city=${city}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 0.8,
    });
  });

  // Add property type pages
  siteConfig.propertyTypes.forEach(type => {
    urls.push({
      loc: `/browse?type=${type}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 0.7,
    });
  });

  // Add property pages
  properties.forEach(property => {
    urls.push({
      loc: `/property/${property.id}`,
      lastmod: property.updated_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.8,
    });
  });

  // Add blog pages
  blogs.forEach(blog => {
    urls.push({
      loc: `/blogs/${blog.slug}`,
      lastmod: blog.updated_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.6,
    });
  });

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(url => `  <url>
    <loc>${siteConfig.url}${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return xml;
}

// Function to download sitemap (for manual generation)
export function downloadSitemap(properties: any[] = [], blogs: any[] = []) {
  const xml = generateSitemap(properties, blogs);
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
