import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getAllPropertiesAdmin, getRoomsByPropertyId, createRoom, updateRoom, deleteRoom } from '@/db/adminApi';
import { supabase } from '@/db/supabase';
import AdvancedRoomForm from '@/components/admin/AdvancedRoomForm';
import type { Property, Room } from '@/types/index';

export default function RoomManagement() {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const { toast } = useToast();

  const [property, setProperty] = useState<Property | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (propertyId) {
      loadPropertyAndRooms();

      // Set up real-time subscription for rooms table
      console.log('Setting up real-time subscription for property:', propertyId);
      
      const channel = supabase
        .channel(`admin-rooms-${propertyId}`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'rooms',
          filter: `property_id=eq.${propertyId}`
        }, (payload) => {
          console.log('Room change detected:', payload);
          
          // Update rooms list based on the change
          if (payload.eventType === 'INSERT') {
            setRooms(prev => [...prev, payload.new as Room]);
            toast({
              title: 'Room Added',
              description: 'A new room has been added',
            });
          } else if (payload.eventType === 'UPDATE') {
            setRooms(prev => prev.map(r => r.id === payload.new.id ? payload.new as Room : r));
            toast({
              title: 'Room Updated',
              description: 'Room has been updated',
            });
          } else if (payload.eventType === 'DELETE') {
            setRooms(prev => prev.filter(r => r.id !== payload.old.id));
            toast({
              title: 'Room Deleted',
              description: 'Room has been deleted',
            });
          }
        })
        .subscribe((status) => {
          console.log('Subscription status:', status);
        });

      // Cleanup subscription on unmount
      return () => {
        console.log('Cleaning up subscription');
        supabase.removeChannel(channel);
      };
    }
  }, [propertyId]);

  const loadPropertyAndRooms = async () => {
    setIsLoading(true);
    try {
      const properties = await getAllPropertiesAdmin();
      const foundProperty = properties.find(p => p.id === propertyId);
      if (foundProperty) {
        setProperty(foundProperty);
      }

      const roomsData = await getRoomsByPropertyId(propertyId!);
      console.log('Loaded rooms:', roomsData);
      setRooms(roomsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load property and rooms',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPropertyAndRooms();
    setIsRefreshing(false);
    toast({
      title: 'Refreshed',
      description: 'Room list has been refreshed',
    });
  };

  const handleOpenDialog = (room?: Room) => {
    setEditingRoom(room || null);
    setIsDialogOpen(true);
  };

  const handleSaveRoom = async (roomData: any) => {
    try {
      if (editingRoom) {
        const result = await updateRoom(editingRoom.id, roomData);
        if (!result.success) {
          throw new Error(result.error);
        }
      } else {
        const result = await createRoom(roomData);
        if (!result.success) {
          throw new Error(result.error);
        }
      }

      setIsDialogOpen(false);
      setEditingRoom(null);
      
      // Reload to ensure consistency
      await loadPropertyAndRooms();
    } catch (error: any) {
      throw error; // Let the form handle the error
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;

    try {
      const result = await deleteRoom(roomId);
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Room deleted successfully'
        });
        await loadPropertyAndRooms();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete room',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Property not found</p>
          <Button onClick={() => navigate('/admin/properties')} className="mt-4">
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/properties')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Room Management</h1>
            <p className="text-muted-foreground">{property.name}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">{property.total_floors || 1} Floors</Badge>
              <Badge variant="outline">{property.rooms_per_floor || 1} Rooms/Floor</Badge>
              <Badge variant="outline">Total: {property.total_rooms || 0} Rooms</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </div>
      </div>

      {/* Room List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No rooms added yet</p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Room
              </Button>
            </CardContent>
          </Card>
        ) : (
          rooms.map((room) => (
            <Card key={room.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      Room {room.room_number} - {room.room_type}
                    </CardTitle>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {!room.is_available && <Badge variant="destructive">Not Available</Badge>}
                      {room.is_available && <Badge variant="default">Available</Badge>}
                      {room.short_term_available && <Badge variant="secondary">Short Term</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(room)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteRoom(room.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Room Image */}
                {room.images && room.images.length > 0 && (
                  <div className="relative h-40 rounded-lg overflow-hidden">
                    <img
                      src={room.images[0]}
                      alt={`Room ${room.room_number}`}
                      className="w-full h-full object-cover"
                    />
                    {room.images.length > 1 && (
                      <Badge className="absolute bottom-2 right-2" variant="secondary">
                        +{room.images.length - 1} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Room Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Floor:</span>
                    <span className="font-medium">{room.floor_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seats:</span>
                    <span className="font-medium">{room.seats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rent/Seat:</span>
                    <span className="font-medium">₹{room.rent_per_seat}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Price:</span>
                    <span className="font-bold text-primary">₹{room.price}/month</span>
                  </div>
                </div>

                {/* Amenities */}
                {room.amenities && room.amenities.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.slice(0, 4).map((amenity, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {room.amenities.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{room.amenities.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Description */}
                {room.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 pt-2 border-t">
                    {room.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Advanced Room Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRoom ? 'Edit Room' : 'Add New Room'}
            </DialogTitle>
          </DialogHeader>
          {property && (
            <AdvancedRoomForm
              propertyId={propertyId!}
              room={editingRoom}
              maxFloors={property.total_floors || 1}
              onSave={handleSaveRoom}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingRoom(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
