import { Link } from 'react-router';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="xl:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold gradient-text">RoomSaathi</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted companion for finding the perfect student accommodation in Sikar, Jaipur, and Kota.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/our-story" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Blogs
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/faqs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/help-center" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link to="/list-property" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  List Your Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Policies</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/service-terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Service Terms
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Guest Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/non-discrimination" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Non Discrimination Policy
                </Link>
              </li>
              <li>
                <Link to="/booking-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Booking Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Sikar, Jaipur, Kota, Rajasthan, India</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+917374035907">+91 7374035907</a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:jainabhi7374@gmail.com">jainabhi7374@gmail.com</a>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="font-semibold text-sm text-foreground mb-2">Operating Cities</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-background rounded-full text-xs font-medium">Sikar</span>
                <span className="px-3 py-1 bg-background rounded-full text-xs font-medium">Jaipur</span>
                <span className="px-3 py-1 bg-background rounded-full text-xs font-medium">Kota</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col @md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center @md:text-left">
              © 2026 RoomSaathi. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/sitemap" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Sitemap
              </Link>
              <Link to="/accessibility" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Accessibility
              </Link>
              <Link to="/cookie-policy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
