import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Building2,
  FileText,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Calendar,
  Utensils,
  Tag,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAdmin } from '@/contexts/AdminContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Properties', href: '/admin/properties', icon: Building2 },
  { name: 'Mess Centers', href: '/admin/mess', icon: Utensils },
  { name: 'Coupons', href: '/admin/coupons', icon: Tag },
  { name: 'Blogs', href: '/admin/blogs', icon: FileText },
  { name: 'Visits', href: '/admin/visits', icon: Calendar },
  { name: 'Queries', href: '/admin/queries', icon: MessageSquare },
  { name: 'Chatbot Feedback', href: '/admin/chatbot-feedback', icon: MessageCircle }
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">RS</span>
          </div>
          <div>
            <h1 className="font-bold text-lg gradient-text">RoomSaathi</h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => mobile && setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="ml-auto"
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-border">
        <div className="mb-3 p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium text-foreground">{admin?.name}</p>
          <p className="text-xs text-muted-foreground">{admin?.email}</p>
          <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
            {admin?.role}
          </span>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden xl:fixed xl:inset-y-0 xl:flex xl:w-72 xl:flex-col border-r border-border bg-card">
        <Sidebar />
      </aside>

      {/* Mobile Header */}
      <div className="xl:hidden sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card px-4">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <Sidebar mobile />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">RS</span>
          </div>
          <span className="font-bold gradient-text">RoomSaathi Admin</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="xl:pl-72">
        <div className="p-4 xl:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
