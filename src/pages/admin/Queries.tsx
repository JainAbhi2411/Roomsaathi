import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, Calendar, MessageSquare, Filter, Utensils, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { getAllQueries, updateQueryStatus } from '@/db/adminApi';
import { supabase } from '@/db/supabase';
import type { UserQuery } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

export default function Queries() {
  const [queries, setQueries] = useState<UserQuery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState<UserQuery | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [queryTypeFilter, setQueryTypeFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadQueries();

    // Set up real-time subscription for user_queries table
    const channel = supabase
      .channel('admin-queries-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_queries' }, () => {
        loadQueries();
      })
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadQueries = async () => {
    setIsLoading(true);
    const data = await getAllQueries();
    setQueries(data);
    setIsLoading(false);
  };

  const handleStatusChange = async (id: string, status: UserQuery['status']) => {
    const result = await updateQueryStatus(id, status);
    if (result.success) {
      toast({
        title: 'Success',
        description: 'Query status updated'
      });
      loadQueries();
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to update status',
        variant: 'destructive'
      });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedQuery) return;
    
    const result = await updateQueryStatus(selectedQuery.id, selectedQuery.status, adminNotes);
    if (result.success) {
      toast({
        title: 'Success',
        description: 'Notes saved successfully'
      });
      setSelectedQuery(null);
      setAdminNotes('');
      loadQueries();
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to save notes',
        variant: 'destructive'
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: UserQuery['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'resolved':
        return 'bg-green-500';
      case 'closed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getQueryTypeIcon = (queryType?: string) => {
    switch (queryType) {
      case 'mess_booking':
        return <Utensils className="h-4 w-4" />;
      case 'property':
        return <Home className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getQueryTypeLabel = (queryType?: string) => {
    switch (queryType) {
      case 'mess_booking':
        return 'Mess Booking';
      case 'property':
        return 'Property Query';
      case 'general':
        return 'General Query';
      default:
        return 'Query';
    }
  };

  const filteredQueries = queries.filter(query => {
    if (queryTypeFilter === 'all') return true;
    return query.query_type === queryTypeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Queries</h1>
          <p className="text-muted-foreground">Manage user inquiries and messages</p>
        </div>
        
        {/* Filter by Query Type */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={queryTypeFilter} onValueChange={setQueryTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Queries</SelectItem>
              <SelectItem value="property">Property Queries</SelectItem>
              <SelectItem value="mess_booking">Mess Bookings</SelectItem>
              <SelectItem value="general">General Queries</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Queries List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredQueries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {queryTypeFilter === 'all' ? 'No queries found' : `No ${getQueryTypeLabel(queryTypeFilter).toLowerCase()}s found`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredQueries.map((query, index) => (
            <motion.div
              key={query.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{query.name}</CardTitle>
                        <Badge className={getStatusColor(query.status)}>
                          {query.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getQueryTypeIcon(query.query_type)}
                          {getQueryTypeLabel(query.query_type)}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{query.email}</span>
                        </div>
                        {query.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            <span>{query.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(query.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <Select
                      value={query.status}
                      onValueChange={(value) => handleStatusChange(query.id, value as UserQuery['status'])}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Property or Mess Center Info */}
                    {query.query_type === 'mess_booking' && query.mess_center_name && (
                      <div className="bg-accent/10 border border-accent/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Utensils className="h-4 w-4 text-accent" />
                          <span className="font-semibold text-sm">Mess Center:</span>
                          <span className="text-sm">{query.mess_center_name}</span>
                        </div>
                      </div>
                    )}
                    {query.query_type === 'property' && query.property_name && (
                      <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-sm">Property:</span>
                          <span className="text-sm">{query.property_name}</span>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-semibold text-sm text-foreground mb-2">Message:</h4>
                      <p className="text-muted-foreground text-sm">{query.message}</p>
                    </div>
                    
                    {query.admin_notes && (
                      <div className="bg-muted p-3 rounded-lg">
                        <h4 className="font-semibold text-sm text-foreground mb-1">Admin Notes:</h4>
                        <p className="text-muted-foreground text-sm">{query.admin_notes}</p>
                      </div>
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedQuery(query);
                            setAdminNotes(query.admin_notes || '');
                          }}
                        >
                          {query.admin_notes ? 'Edit Notes' : 'Add Notes'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Admin Notes</DialogTitle>
                          <DialogDescription>
                            Add internal notes about this query
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Enter your notes here..."
                            rows={5}
                          />
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setSelectedQuery(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSaveNotes}>
                              Save Notes
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
