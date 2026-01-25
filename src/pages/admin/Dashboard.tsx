import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Building2, FileText, MessageSquare, TrendingUp, Plus, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDashboardStats } from '@/db/adminApi';
import { supabase } from '@/db/supabase';
import type { DashboardStats } from '@/types/admin';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalBlogs: 0,
    totalQueries: 0,
    pendingQueries: 0,
    totalVisits: 0,
    pendingVisits: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();

    // Set up real-time subscriptions for all tables
    const channel = supabase
      .channel('admin-dashboard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => {
        loadStats();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, () => {
        loadStats();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_queries' }, () => {
        loadStats();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'property_visits' }, () => {
        loadStats();
      })
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    const data = await getDashboardStats();
    setStats(data);
    setIsLoading(false);
  };

  const statCards = [
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      icon: Building2,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      link: '/admin/properties'
    },
    {
      title: 'Total Blogs',
      value: stats.totalBlogs,
      icon: FileText,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      link: '/admin/blogs'
    },
    {
      title: 'Pending Visits',
      value: stats.pendingVisits,
      icon: Calendar,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      link: '/admin/visits'
    },
    {
      title: 'Total Visits',
      value: stats.totalVisits,
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      link: '/admin/visits'
    },
    {
      title: 'Pending Queries',
      value: stats.pendingQueries,
      icon: MessageSquare,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      link: '/admin/queries'
    },
    {
      title: 'Total Queries',
      value: stats.totalQueries,
      icon: TrendingUp,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      link: '/admin/queries'
    }
  ];

  const quickActions = [
    {
      title: 'Add Property',
      description: 'List a new property',
      icon: Building2,
      link: '/admin/properties/new',
      color: 'bg-blue-500'
    },
    {
      title: 'Create Blog',
      description: 'Write a new blog post',
      icon: FileText,
      link: '/admin/blogs/new',
      color: 'bg-green-500'
    },
    {
      title: 'View Visits',
      description: 'Manage property visits',
      icon: Calendar,
      link: '/admin/visits',
      color: 'bg-yellow-500'
    },
    {
      title: 'View Queries',
      description: 'Check user inquiries',
      icon: MessageSquare,
      link: '/admin/queries',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {isLoading ? '...' : stat.value}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </div>
                    <div className={`p-3 rounded-lg ${action.color}`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link to={action.link}>
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Activity tracking coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
