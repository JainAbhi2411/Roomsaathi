import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Heart, 
  Clock, 
  LogOut,
  ChevronRight,
  Home,
  Bell,
  Shield,
  HelpCircle,
  FileText,
  Loader2,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';
import type { Property, VisitSchedule } from '@/types';
import { motion } from 'motion/react';

export default function MobileProfilePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, signOut, loading: authLoading } = useAuth();
  
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [scheduledVisits, setScheduledVisits] = useState<VisitSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // Redirect to login if not authenticated
        navigate('/mobile/login', { replace: true });
      } else {
        loadUserData();
      }
    }
  }, [user, authLoading, navigate]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Load favorites
      const { data: favData } = await supabase
        .from('favorites')
        .select('property_id, properties(*)')
        .eq('user_session_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (favData) {
        const props = favData
          .map((f: any) => f.properties)
          .filter(Boolean) as Property[];
        setFavorites(props);
      }

      // Load scheduled visits
      const { data: visitData } = await supabase
        .from('visit_schedules')
        .select('*, properties(*)')
        .eq('user_id', user.id)
        .order('preferred_date', { ascending: true })
        .limit(10);

      if (visitData) {
        setScheduledVisits(visitData as VisitSchedule[]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: 'Logged Out',
        description: 'You have been logged out successfully',
      });
      navigate('/mobile/home', { replace: true });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: 'destructive',
      });
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center gap-3 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/mobile/home')}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Profile</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-20">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">
                    {getInitials(profile?.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{profile?.username || 'User'}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary" className="mt-1">
                    {profile?.role === 'admin' ? 'Admin' : 'User'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          <Card className="border-2">
            <CardContent className="pt-6 text-center">
              <Heart className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{favorites.length}</p>
              <p className="text-xs text-muted-foreground">Favorites</p>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="pt-6 text-center">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{scheduledVisits.length}</p>
              <p className="text-xs text-muted-foreground">Scheduled Visits</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Favorite Properties</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/mobile/favorites')}
              >
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {favorites.slice(0, 3).map((property) => (
                <Card
                  key={property.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/mobile/property/${property.id}`)}
                >
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                        {property.images?.[0] && (
                          <img
                            src={property.images[0]}
                            alt={property.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{property.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {property.locality}, {property.city}
                        </p>
                        <p className="text-sm font-semibold text-primary mt-1">
                          ₹{property.price_from.toLocaleString()}/month
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Scheduled Visits */}
        {scheduledVisits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-3">Scheduled Visits</h3>
            <div className="space-y-3">
              {scheduledVisits.slice(0, 3).map((visit) => (
                <Card key={visit.id} className="border-2">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">
                          {visit.property?.name || 'Property'}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(visit.preferred_date).toLocaleDateString()} at {visit.preferred_time}
                        </p>
                        <Badge
                          variant={
                            visit.status === 'confirmed'
                              ? 'default'
                              : visit.status === 'pending'
                              ? 'secondary'
                              : 'destructive'
                          }
                          className="mt-1"
                        >
                          {visit.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="border-2">
            <CardContent className="p-0">
              <MenuItem
                icon={<Home className="h-5 w-5" />}
                label="My Properties"
                onClick={() => navigate('/mobile/favorites')}
              />
              <Separator />
              <MenuItem
                icon={<Bell className="h-5 w-5" />}
                label="Notifications"
                onClick={() => toast({ title: 'Coming Soon', description: 'Notifications feature coming soon!' })}
              />
              <Separator />
              <MenuItem
                icon={<Shield className="h-5 w-5" />}
                label="Privacy Policy"
                onClick={() => navigate('/mobile/privacy-policy')}
              />
              <Separator />
              <MenuItem
                icon={<FileText className="h-5 w-5" />}
                label="Terms of Service"
                onClick={() => navigate('/mobile/terms-of-service')}
              />
              <Separator />
              <MenuItem
                icon={<HelpCircle className="h-5 w-5" />}
                label="Help & Support"
                onClick={() => navigate('/mobile/help-center')}
              />
              <Separator />
              <MenuItem
                icon={<LogOut className="h-5 w-5" />}
                label="Logout"
                onClick={handleLogout}
                className="text-destructive"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="flex items-center justify-around p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/mobile/home')}
            className="flex-col h-auto py-2"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/mobile/search')}
            className="flex-col h-auto py-2"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Search</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/mobile/favorites')}
            className="flex-col h-auto py-2"
          >
            <Heart className="h-5 w-5" />
            <span className="text-xs mt-1">Favorites</span>
          </Button>
          <Button
            variant="default"
            size="icon"
            className="flex-col h-auto py-2"
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  className = '',
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 hover:bg-accent transition-colors ${className}`}
    >
      {icon}
      <span className="flex-1 text-left font-medium">{label}</span>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </button>
  );
}
