import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, User, MapPin, Phone, MessageSquare, Eye, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getAllVisits, updateVisitStatus, deleteVisit } from '@/db/adminApi';
import { supabase } from '@/db/supabase';
import type { PropertyVisit } from '@/types/admin';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function Visits() {
  const [visits, setVisits] = useState<PropertyVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState<PropertyVisit | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deleteVisitId, setDeleteVisitId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  
  /* ---------------- Initial Load ---------------- */
  useEffect(() => {
    loadVisits();
  }, []);

  const loadVisits = async () => {
    setIsLoading(true);
    const data = await getAllVisits();
    setVisits(data);
    setIsLoading(false);
  };

  /* ---------------- Realtime Subscription ---------------- */
  useEffect(() => {
    const channel = supabase
      .channel('admin-property-visits')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'property_visits'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setVisits((prev) => [payload.new as PropertyVisit, ...prev]);
          }

          if (payload.eventType === 'UPDATE') {
            setVisits((prev) =>
              prev.map((visit) =>
                visit.id === payload.new.id
                  ? { ...visit, ...(payload.new as PropertyVisit) }
                  : visit
              )
            );
          }

          if (payload.eventType === 'DELETE') {
            setVisits((prev) =>
              prev.filter((visit) => visit.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /* ---------------- Actions ---------------- */
  const handleStatusChange = async (
    visitId: string,
    status: PropertyVisit['status']
  ) => {
    const result = await updateVisitStatus(visitId, status);

    if (result.success) {
      toast({
        title: 'Success',
        description: 'Visit status updated'
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to update status',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteVisit = async () => {
    if (!deleteVisitId) return;

    const result = await deleteVisit(deleteVisitId);

    if (result.success) {
      toast({
        title: 'Deleted',
        description: 'Visit deleted successfully'
      });
      setDeleteVisitId(null);
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to delete visit',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
      pending: { variant: 'outline', className: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20' },
      confirmed: { variant: 'default', className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' },
      completed: { variant: 'secondary', className: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20' },
      cancelled: { variant: 'destructive', className: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20' },
    };

    const config = variants[status] || variants.pending;
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredVisits = filterStatus === 'all' 
    ? visits 
    : visits.filter(visit => visit.status === filterStatus);

  const stats = {
    total: visits.length,
    pending: visits.filter(v => v.status === 'pending').length,
    confirmed: visits.filter(v => v.status === 'confirmed').length,
    completed: visits.filter(v => v.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Property Visits</h1>
        <p className="text-muted-foreground">Manage scheduled property visits and update their status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.confirmed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col @md:flex-row @md:items-center @md:justify-between gap-4">
            <div>
              <CardTitle>All Visits</CardTitle>
              <CardDescription>View and manage all scheduled property visits</CardDescription>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full @md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredVisits.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No visits found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visitor</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVisits.map((visit) => (
                    <motion.tr
                      key={visit.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group"
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{visit.visitor_name}</span>
                          <span className="text-sm text-muted-foreground">{visit.visitor_phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{visit.property?.name || 'N/A'}</span>
                          <span className="text-sm text-muted-foreground">
                            {visit.property?.locality}, {visit.property?.city}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(visit.visit_date), 'MMM dd, yyyy')}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {visit.visit_time}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={visit.status}
                          onValueChange={(value) => handleStatusChange(visit.id, value as any)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue>{getStatusBadge(visit.status)}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedVisit(visit);
                              setIsDetailsOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteVisitId(visit.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visit Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Visit Details</DialogTitle>
            <DialogDescription>Complete information about the scheduled visit</DialogDescription>
          </DialogHeader>
          {selectedVisit && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Visitor Name</span>
                  </div>
                  <p className="font-medium">{selectedVisit.visitor_name}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>Phone Number</span>
                  </div>
                  <p className="font-medium">{selectedVisit.visitor_phone}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Property</span>
                </div>
                <p className="font-medium">{selectedVisit.property?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedVisit.property?.type} • {selectedVisit.property?.locality}, {selectedVisit.property?.city}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Visit Date</span>
                  </div>
                  <p className="font-medium">{format(new Date(selectedVisit.visit_date), 'MMMM dd, yyyy')}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Visit Time</span>
                  </div>
                  <p className="font-medium">{selectedVisit.visit_time}</p>
                </div>
              </div>

              {selectedVisit.message && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span>Message</span>
                  </div>
                  <p className="text-sm bg-muted p-3 rounded-md">{selectedVisit.message}</p>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Status</div>
                <div>{getStatusBadge(selectedVisit.status)}</div>
              </div>

              <div className="text-xs text-muted-foreground pt-4 border-t">
                <p>Created: {format(new Date(selectedVisit.created_at), 'MMM dd, yyyy HH:mm')}</p>
                <p>Updated: {format(new Date(selectedVisit.updated_at), 'MMM dd, yyyy HH:mm')}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteVisitId} onOpenChange={() => setDeleteVisitId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Visit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this visit? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteVisit} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
