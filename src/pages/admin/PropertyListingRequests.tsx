import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Building2, Eye, CheckCircle, XCircle, Clock, Phone, Mail, MapPin, Home, DollarSign, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/db/supabase';
import { updatePropertyListingRequestStatus } from '@/db/adminApi';
import type { PropertyListingRequest } from '@/types/index';

export default function PropertyListingRequests() {
  const [requests, setRequests] = useState<PropertyListingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<PropertyListingRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('property_listing_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching listing requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load listing requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, status: PropertyListingRequest['status']) => {
    setIsUpdating(true);
    try {
      const result = await updatePropertyListingRequestStatus(id, status, adminNotes);

      if (!result.success) {
        throw new Error(result.error || 'Failed to update request');
      }

      toast({
        title: 'Success',
        description: `Request ${status} successfully`,
      });

      await fetchRequests();
      setIsDetailModalOpen(false);
      setSelectedRequest(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: 'Error',
        description: 'Failed to update request',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const openDetailModal = (request: PropertyListingRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || '');
    setIsDetailModalOpen(true);
  };

  const getStatusBadge = (status: PropertyListingRequest['status']) => {
    const variants = {
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      contacted: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      approved: 'bg-green-500/10 text-green-500 border-green-500/20',
      rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
    };

    const icons = {
      pending: Clock,
      contacted: Phone,
      approved: CheckCircle,
      rejected: XCircle,
    };

    const Icon = icons[status];

    return (
      <Badge variant="outline" className={variants[status]}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    contacted: requests.filter(r => r.status === 'contacted').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Property Listing Requests</h1>
        <p className="text-muted-foreground">
          Manage property listing submissions from owners
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-500">{stats.contacted}</div>
            <p className="text-xs text-muted-foreground">Contacted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-500">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-500">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No listing requests yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{request.property_name}</h3>
                        {getStatusBadge(request.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Home className="h-4 w-4" />
                          <span>{request.property_type} • {request.city}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{request.locality}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{request.owner_phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{request.owner_email}</span>
                        </div>
                      </div>

                      {request.price_range_min && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span>
                            ₹{request.price_range_min.toLocaleString()}
                            {request.price_range_max && ` - ₹${request.price_range_max.toLocaleString()}`}
                            /month
                          </span>
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground">
                        Submitted: {new Date(request.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDetailModal(request)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Property Listing Request Details</DialogTitle>
            <DialogDescription>
              Review and manage this property listing request
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Status */}
              <div>
                <Label>Current Status</Label>
                <div className="mt-2">
                  {getStatusBadge(selectedRequest.status)}
                </div>
              </div>

              {/* Owner Details */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Owner Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <p className="font-medium">{selectedRequest.owner_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedRequest.owner_email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">{selectedRequest.owner_phone}</p>
                  </div>
                  {selectedRequest.owner_alternate_phone && (
                    <div>
                      <Label className="text-muted-foreground">Alternate Phone</Label>
                      <p className="font-medium">{selectedRequest.owner_alternate_phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Property Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Property Name</Label>
                    <p className="font-medium">{selectedRequest.property_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Type</Label>
                    <p className="font-medium">{selectedRequest.property_type}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">City</Label>
                    <p className="font-medium">{selectedRequest.city}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Locality</Label>
                    <p className="font-medium">{selectedRequest.locality}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Address</Label>
                    <p className="font-medium">{selectedRequest.address}</p>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              {(selectedRequest.total_rooms || selectedRequest.price_range_min) && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedRequest.total_rooms && (
                      <div>
                        <Label className="text-muted-foreground">Total Rooms</Label>
                        <p className="font-medium">{selectedRequest.total_rooms}</p>
                      </div>
                    )}
                    {selectedRequest.available_rooms && (
                      <div>
                        <Label className="text-muted-foreground">Available Rooms</Label>
                        <p className="font-medium">{selectedRequest.available_rooms}</p>
                      </div>
                    )}
                    {selectedRequest.price_range_min && (
                      <div>
                        <Label className="text-muted-foreground">Price Range</Label>
                        <p className="font-medium">
                          ₹{selectedRequest.price_range_min.toLocaleString()}
                          {selectedRequest.price_range_max && 
                            ` - ₹${selectedRequest.price_range_max.toLocaleString()}`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {selectedRequest.amenities && selectedRequest.amenities.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedRequest.description && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-sm text-muted-foreground">{selectedRequest.description}</p>
                </div>
              )}

              {/* Admin Notes */}
              <div className="space-y-3">
                <Label htmlFor="admin_notes">Admin Notes</Label>
                <Textarea
                  id="admin_notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this request..."
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {selectedRequest.status !== 'contacted' && (
                  <Button
                    variant="outline"
                    onClick={() => updateRequestStatus(selectedRequest.id, 'contacted')}
                    disabled={isUpdating}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Mark as Contacted
                  </Button>
                )}
                {selectedRequest.status !== 'approved' && (
                  <Button
                    variant="default"
                    onClick={() => updateRequestStatus(selectedRequest.id, 'approved')}
                    disabled={isUpdating}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                )}
                {selectedRequest.status !== 'rejected' && (
                  <Button
                    variant="destructive"
                    onClick={() => updateRequestStatus(selectedRequest.id, 'rejected')}
                    disabled={isUpdating}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
