# SEO Deployment Checklist

## Pre-Deployment Tasks

### 1. Update Domain Configuration
```typescript
// File: src/lib/seo.ts
export const siteConfig = {
  name: 'RoomSaathi',
  url: 'https://your-domain.com', // ⚠️ UPDATE THIS
  // ... rest of config
};
```

### 2. Update Robots.txt
```
# File: public/robots.txt
Sitemap: https://your-domain.com/sitemap.xml  # ⚠️ UPDATE THIS
```

### 3. Generate Sitemap
Run this code to generate sitemap.xml:
```typescript
import { generateSitemap } from '@/lib/sitemap';
import { getProperties } from '@/db/api';

const properties = await getProperties({});
const sitemap = generateSitemap(properties, []);
// Save to public/sitemap.xml
```

### 4. Verify All Pages Have SEO
- [x] HomePage
- [x] BrowsePropertiesPage
- [x] PropertyDetailsPage
- [x] FAQsPage
- [ ] BlogsPage (add if needed)
- [ ] AboutUsPage (add if needed)
- [ ] OurStoryPage (add if needed)
- [ ] OwnerFeaturesPage (add if needed)

---

## Post-Deployment Tasks

### 1. Google Search Console (Priority: HIGH)
1. Go to https://search.google.com/search-console
2. Add your property (domain)
3. Verify ownership (DNS or HTML file method)
4. Submit sitemap: `https://your-domain.com/sitemap.xml`
5. Request indexing for homepage
6. Request indexing for key pages:
   - /browse
   - /browse?city=Sikar
   - /browse?city=Jaipur
   - /browse?city=Kota
   - /faqs
   - /about

### 2. Google Analytics (Priority: HIGH)
1. Create GA4 property at https://analytics.google.com
2. Get tracking ID
3. Add to your site (if not already added)
4. Verify tracking is working

### 3. Google My Business (Priority: HIGH)
1. Create business profile at https://business.google.com
2. Add locations:
   - RoomSaathi Sikar
   - RoomSaathi Jaipur
   - RoomSaathi Kota
3. Add photos, hours, contact info
4. Verify each location

### 4. Bing Webmaster Tools (Priority: MEDIUM)
1. Go to https://www.bing.com/webmasters
2. Add your site
3. Verify ownership
4. Submit sitemap

### 5. Social Media Setup (Priority: MEDIUM)
1. Create accounts:
   - Facebook: facebook.com/roomsaathi
   - Twitter: @roomsaathi
   - Instagram: @roomsaathi
   - LinkedIn: linkedin.com/company/roomsaathi

2. Update siteConfig.social with actual URLs

### 6. Test SEO Implementation (Priority: HIGH)
1. **Rich Results Test**:
   - Go to https://search.google.com/test/rich-results
   - Test homepage
   - Test property page
   - Test FAQs page
   - Verify all structured data is valid

2. **Mobile-Friendly Test**:
   - Go to https://search.google.com/test/mobile-friendly
   - Test all key pages
   - Fix any issues

3. **PageSpeed Insights**:
   - Go to https://pagespeed.web.dev
   - Test homepage
   - Test browse page
   - Test property page
   - Aim for 90+ score

4. **Social Media Preview**:
   - Facebook: https://developers.facebook.com/tools/debug/
   - Twitter: https://cards-dev.twitter.com/validator
   - LinkedIn: https://www.linkedin.com/post-inspector/
   - Verify images and text appear correctly

### 7. Monitor & Track (Ongoing)
1. **Weekly Tasks**:
   - Check Google Search Console for errors
   - Monitor crawl stats
   - Check for manual actions
   - Review search queries

2. **Monthly Tasks**:
   - Analyze traffic in Google Analytics
   - Check keyword rankings
   - Review and update content
   - Generate new sitemap if properties added

3. **Quarterly Tasks**:
   - Comprehensive SEO audit
   - Update meta descriptions
   - Refresh old content
   - Build new backlinks

---

## Quick Verification Commands

### Check Robots.txt
```bash
curl https://your-domain.com/robots.txt
```

### Check Sitemap
```bash
curl https://your-domain.com/sitemap.xml
```

### Check Meta Tags
```bash
curl -s https://your-domain.com | grep -i "<meta"
```

---

## Common Issues & Solutions

### Issue: Pages not indexed
**Solution**: 
- Submit sitemap to Google Search Console
- Request indexing manually
- Check robots.txt isn't blocking
- Ensure pages are linked from homepage

### Issue: Wrong meta description in search
**Solution**:
- Update meta description
- Wait 1-2 weeks for Google to recrawl
- Request re-indexing in Search Console

### Issue: Structured data errors
**Solution**:
- Use Rich Results Test to identify errors
- Fix schema markup
- Re-submit for testing

### Issue: Slow page speed
**Solution**:
- Optimize images
- Enable compression
- Minimize JavaScript
- Use CDN

---

## SEO Performance Targets

### Month 1-3
- [ ] All pages indexed
- [ ] Appearing for brand searches ("RoomSaathi")
- [ ] 100+ organic visitors/month

### Month 4-6
- [ ] Ranking for long-tail keywords
- [ ] 500+ organic visitors/month
- [ ] 10+ keywords in top 50

### Month 7-12
- [ ] Ranking for competitive keywords
- [ ] 2,000+ organic visitors/month
- [ ] 50+ keywords in top 50
- [ ] Featured snippets

---

## Contact & Support

For SEO questions:
- Review SEO_OPTIMIZATION_GUIDE.md
- Check Google Search Console
- Consult with SEO specialist

---

**Last Updated**: 2026-01-24
