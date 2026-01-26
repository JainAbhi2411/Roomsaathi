import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { BadgeCheck, Building2, FileText, BarChart3, Headphones, PlusCircle, LogIn, LogOut, User, ChevronDown, Menu, MessageCircle, Phone, Mail, HelpCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 xl:h-16 items-center justify-between px-3 xl:px-4">
        {/* Left Section - Logo and Main Navigation */}
        <div className="flex items-center gap-3 xl:gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              {/* Hanging string */}
              <div className="absolute left-1/2 top-0 h-3 xl:h-4 w-0.5 -translate-x-1/2 -translate-y-3 xl:-translate-y-4 bg-muted-foreground/30 group-hover:bg-primary/50 transition-colors" />
              
              {/* Logo with hanging animation */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="animate-swing"
              >
                <span className="text-lg xl:text-2xl font-bold gradient-text group-hover:scale-105 transition-transform inline-block">RoomSaathi</span>
              </motion.div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* RoomSaathi Properties Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1 hover:bg-primary/10 hover:text-primary transition-all">
                  <BadgeCheck className="h-4 w-4" />
                  RoomSaathi Properties
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/browse?verified=true" className="cursor-pointer hover:bg-primary/10 transition-colors">
                    <BadgeCheck className="mr-2 h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium">Verified Properties</div>
                      <div className="text-xs text-muted-foreground">100% authenticated listings</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/browse?type=PG&verified=true" className="cursor-pointer hover:bg-primary/10 transition-colors">
                    <span className="mr-2">🏠</span>
                    Verified PG
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/browse?type=Hostels&verified=true" className="cursor-pointer hover:bg-primary/10 transition-colors">
                    <span className="mr-2">🏢</span>
                    Verified Hostels
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/browse?type=Apartments&verified=true" className="cursor-pointer hover:bg-primary/10 transition-colors">
                    <span className="mr-2">🏘️</span>
                    Verified Apartments
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* For Owners Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1 hover:bg-primary/10 hover:text-primary transition-all">
                  <Building2 className="h-4 w-4" />
                  For Owners
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <div className="px-2 py-2">
                  <p className="text-sm font-semibold mb-1">Property Management Solutions</p>
                  <p className="text-xs text-muted-foreground">Everything you need to manage your properties</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer hover:bg-primary/10 transition-colors">
                  <FileText className="mr-2 h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Website Listing</div>
                    <div className="text-xs text-muted-foreground">Get your property online</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-primary/10 transition-colors">
                  <BarChart3 className="mr-2 h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Management Software</div>
                    <div className="text-xs text-muted-foreground">Track bookings & payments</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-primary/10 transition-colors">
                  <BadgeCheck className="mr-2 h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Verification Service</div>
                    <div className="text-xs text-muted-foreground">Get verified badge</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/owner-features" className="cursor-pointer text-primary hover:bg-primary/10 transition-colors">
                    Learn More →
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/browse" className="text-sm font-medium transition-all hover:text-primary px-3 py-2 rounded-md hover:bg-primary/10">
              Browse Properties
            </Link>
          </nav>
        </div>

        {/* Right Section - Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Support Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 hover:bg-primary/10 hover:text-primary transition-all">
                <Headphones className="h-4 w-4" />
                Support
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="px-2 py-2">
                <p className="text-sm font-semibold mb-1">Get Help & Support</p>
                <p className="text-xs text-muted-foreground">We're here to assist you 24/7</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a 
                  href="https://wa.me/919876543210" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                >
                  <MessageCircle className="mr-2 h-4 w-4 text-green-500" />
                  <div>
                    <div className="font-medium">WhatsApp Support</div>
                    <div className="text-xs text-muted-foreground">Chat with us instantly</div>
                  </div>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a 
                  href="tel:+919876543210"
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                >
                  <Phone className="mr-2 h-4 w-4 text-blue-500" />
                  <div>
                    <div className="font-medium">Call Us</div>
                    <div className="text-xs text-muted-foreground">+91 98765 43210</div>
                  </div>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/contact" className="cursor-pointer hover:bg-primary/10 transition-colors">
                  <Mail className="mr-2 h-4 w-4 text-orange-500" />
                  <div>
                    <div className="font-medium">Contact Support</div>
                    <div className="text-xs text-muted-foreground">Send us a message</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/help-center" className="cursor-pointer hover:bg-primary/10 transition-colors">
                  <HelpCircle className="mr-2 h-4 w-4 text-purple-500" />
                  <div>
                    <div className="font-medium">Help Center</div>
                    <div className="text-xs text-muted-foreground">Browse FAQs & guides</div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/how-to-use" className="cursor-pointer hover:bg-primary/10 transition-colors">
                  <BookOpen className="mr-2 h-4 w-4 text-pink-500" />
                  <div>
                    <div className="font-medium">How to Use</div>
                    <div className="text-xs text-muted-foreground">Step-by-step tutorials</div>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground transition-all">
            <PlusCircle className="mr-2 h-4 w-4" />
            List Your Property
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="hover:scale-105 transition-transform gap-1">
                  <User className="h-4 w-4" />
                  {profile?.username || 'Account'}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-2">
                  <p className="text-sm font-semibold">{profile?.username || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{profile?.email}</p>
                  {profile?.role === 'admin' && (
                    <p className="text-xs font-medium text-primary mt-1">Admin</p>
                  )}
                </div>
                <DropdownMenuSeparator />
                {profile?.role === 'admin' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard" className="cursor-pointer">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/favorites" className="cursor-pointer">
                    My Favorites
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-visits" className="cursor-pointer">
                    My Visits
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" className="hover:scale-105 transition-transform" asChild>
              <Link to="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-colors h-9 w-9">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] max-w-sm">
            <nav className="flex flex-col gap-3 mt-6">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Navigation</p>
                <Link to="/browse" className="block text-base font-medium transition-colors hover:text-primary py-2 hover:bg-primary/10 rounded px-2">
                  Browse Properties
                </Link>
              </div>

              <div className="border-t pt-3 space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase">RoomSaathi Properties</p>
                <Link to="/browse?verified=true" className="block text-sm font-medium transition-colors hover:text-primary py-2 hover:bg-primary/10 rounded px-2">
                  <BadgeCheck className="inline-block mr-2 h-4 w-4" />
                  All Verified Properties
                </Link>
                <Link to="/browse?type=PG&verified=true" className="block text-sm transition-colors hover:text-primary py-2 hover:bg-primary/10 rounded px-2">
                  Verified PG
                </Link>
                <Link to="/browse?type=Hostels&verified=true" className="block text-sm transition-colors hover:text-primary py-2 hover:bg-primary/10 rounded px-2">
                  Verified Hostels
                </Link>
              </div>

              <div className="border-t pt-3 space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase">For Owners</p>
                <div className="text-sm space-y-1.5">
                  <div className="py-2 px-2 hover:bg-primary/10 rounded transition-colors cursor-pointer">
                    <div className="font-medium text-sm">Website Listing</div>
                    <div className="text-xs text-muted-foreground">Get your property online</div>
                  </div>
                  <div className="py-2 px-2 hover:bg-primary/10 rounded transition-colors cursor-pointer">
                    <div className="font-medium text-sm">Management Software</div>
                    <div className="text-xs text-muted-foreground">Track bookings & payments</div>
                  </div>
                  <div className="py-2 px-2 hover:bg-primary/10 rounded transition-colors cursor-pointer">
                    <div className="font-medium text-sm">Verification Service</div>
                    <div className="text-xs text-muted-foreground">Get verified badge</div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-3 space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start hover:bg-primary/10 transition-colors">
                  <Headphones className="mr-2 h-4 w-4" />
                  Support
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start hover:bg-primary hover:text-primary-foreground transition-colors">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  List Your Property
                </Button>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" className="w-full justify-start hover:scale-105 transition-transform gap-1">
                        <User className="h-4 w-4" />
                        {profile?.username || 'Account'}
                        <ChevronDown className="h-3 w-3 ml-auto" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <div className="px-2 py-2">
                        <p className="text-sm font-semibold">{profile?.username || 'User'}</p>
                        <p className="text-xs text-muted-foreground">{profile?.email}</p>
                        {profile?.role === 'admin' && (
                          <p className="text-xs font-medium text-primary mt-1">Admin</p>
                        )}
                      </div>
                      <DropdownMenuSeparator />
                      {profile?.role === 'admin' && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link to="/admin/dashboard" className="cursor-pointer">
                              <BarChart3 className="mr-2 h-4 w-4" />
                              Admin Dashboard
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem asChild>
                        <Link to="/favorites" className="cursor-pointer">
                          My Favorites
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/my-visits" className="cursor-pointer">
                          My Visits
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to="/login">
                    <Button size="sm" className="w-full justify-start hover:scale-105 transition-transform">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
