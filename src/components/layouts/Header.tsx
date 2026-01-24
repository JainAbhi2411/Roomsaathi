import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Heart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative">
            {/* Hanging string */}
            <div className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 -translate-y-4 bg-muted-foreground/30" />
            
            {/* Logo with hanging animation */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="animate-swing"
            >
              <span className="text-2xl font-bold gradient-text">RoomSaathi</span>
            </motion.div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/browse" className="text-sm font-medium transition-colors hover:text-primary">
            Browse Properties
          </Link>
          <Link to="/favorites" className="text-sm font-medium transition-colors hover:text-primary">
            Favorites
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link to="/favorites">
              <Heart className="mr-2 h-4 w-4" />
              My Favorites
            </Link>
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4 mt-8">
              <Link to="/" className="text-lg font-medium transition-colors hover:text-primary">
                Home
              </Link>
              <Link to="/browse" className="text-lg font-medium transition-colors hover:text-primary">
                Browse Properties
              </Link>
              <Link to="/favorites" className="text-lg font-medium transition-colors hover:text-primary">
                Favorites
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
