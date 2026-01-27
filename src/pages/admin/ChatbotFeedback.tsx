import { useState, useEffect } from 'react';
import { MessageCircle, Trash2, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  DialogFooter,
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
import { getChatbotFeedbacks, updateChatbotFeedbackStatus, deleteChatbotFeedback } from '@/db/api';
import type { ChatbotFeedback } from '@/types/index';
import { useToast } from '@/hooks/use-toast';

export default function ChatbotFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<ChatbotFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<ChatbotFeedback | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'resolved'>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await getChatbotFeedbacks();
      setFeedbacks(data);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chatbot feedbacks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewFeedback = (feedback: ChatbotFeedback) => {
    setSelectedFeedback(feedback);
    setAdminNotes(feedback.admin_notes || '');
    setIsViewDialogOpen(true);

    // Mark as read if it's new
    if (feedback.status === 'new') {
      handleStatusChange(feedback.id, 'read');
    }
  };

  const handleStatusChange = async (id: string, status: 'new' | 'read' | 'resolved') => {
    try {
      await updateChatbotFeedbackStatus(id, status);
      setFeedbacks(prev =>
        prev.map(f => (f.id === id ? { ...f, status } : f))
      );
      toast({
        title: 'Status Updated',
        description: `Feedback marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedFeedback) return;

    try {
      await updateChatbotFeedbackStatus(selectedFeedback.id, selectedFeedback.status, adminNotes);
      setFeedbacks(prev =>
        prev.map(f => (f.id === selectedFeedback.id ? { ...f, admin_notes: adminNotes } : f))
      );
      toast({
        title: 'Notes Saved',
        description: 'Admin notes have been updated',
      });
      setIsViewDialogOpen(false);
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notes',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteFeedback = async () => {
    if (!feedbackToDelete) return;

    try {
      await deleteChatbotFeedback(feedbackToDelete);
      setFeedbacks(prev => prev.filter(f => f.id !== feedbackToDelete));
      toast({
        title: 'Deleted',
        description: 'Feedback has been deleted',
      });
      setIsDeleteDialogOpen(false);
      setFeedbackToDelete(null);
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete feedback',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="default" className="bg-blue-500"><Clock className="w-3 h-3 mr-1" />New</Badge>;
      case 'read':
        return <Badge variant="secondary"><Eye className="w-3 h-3 mr-1" />Read</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500"><CheckCircle className="w-3 h-3 mr-1" />Resolved</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredFeedbacks = statusFilter === 'all'
    ? feedbacks
    : feedbacks.filter(f => f.status === statusFilter);

  const stats = {
    total: feedbacks.length,
    new: feedbacks.filter(f => f.status === 'new').length,
    read: feedbacks.filter(f => f.status === 'read').length,
    resolved: feedbacks.filter(f => f.status === 'resolved').length,
  };

  return (
   
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageCircle className="w-8 h-8" />
            Chatbot Feedback
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage user queries and feedback from the chatbot
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">New</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Read</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.read}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4">
          <Label>Filter by Status:</Label>
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Loading feedbacks...</p>
              </CardContent>
            </Card>
          ) : filteredFeedbacks.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No feedback found</p>
              </CardContent>
            </Card>
          ) : (
            filteredFeedbacks.map(feedback => (
              <Card key={feedback.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{feedback.name}</CardTitle>
                      <CardDescription>
                        {feedback.email}
                        {feedback.phone && ` • ${feedback.phone}`}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(feedback.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Looking for:</p>
                    <p className="text-sm text-muted-foreground">{feedback.looking_for}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Problem/Query:</p>
                    <p className="text-sm text-muted-foreground">{feedback.problem}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      {new Date(feedback.created_at).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <Select
                        value={feedback.status}
                        onValueChange={(value: any) => handleStatusChange(feedback.id, value)}
                      >
                        <SelectTrigger className="w-[130px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewFeedback(feedback)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setFeedbackToDelete(feedback.id);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

    
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
            <DialogDescription>View and manage feedback information</DialogDescription>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="text-sm mt-1">{selectedFeedback.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm mt-1">{selectedFeedback.email}</p>
                </div>
              </div>
              {selectedFeedback.phone && (
                <div>
                  <Label>Phone</Label>
                  <p className="text-sm mt-1">{selectedFeedback.phone}</p>
                </div>
              )}
              <div>
                <Label>Looking for</Label>
                <p className="text-sm mt-1">{selectedFeedback.looking_for}</p>
              </div>
              <div>
                <Label>Problem/Query</Label>
                <p className="text-sm mt-1">{selectedFeedback.problem}</p>
              </div>
              <div>
                <Label>Status</Label>
                <div className="mt-1">{getStatusBadge(selectedFeedback.status)}</div>
              </div>
              <div>
                <Label htmlFor="admin-notes">Admin Notes</Label>
                <Textarea
                  id="admin-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this feedback..."
                  rows={4}
                  className="mt-1"
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Submitted: {new Date(selectedFeedback.created_at).toLocaleString()}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={handleSaveNotes}>Save Notes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the feedback.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFeedback} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
