import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Plus, Pencil, Trash2, Save, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getAllPropertiesAdmin, getRoomsByPropertyId, createRoom, updateRoom, deleteRoom } from '@/db/adminApi';
import { supabase } from '@/db/supabase';
import { useSupabaseUpload } from '@/hooks/use-supabase-upload';
import type { Property, Room } from '@/types/index';

export default function RoomManagement() {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const { toast } = useToast();
  
  const uploadHook = useSupabaseUpload({
    bucketName: 'property-images',
    path: 'rooms',
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 10,
    allowedMimeTypes: ['image/*'],
    supabase
  });

  const [property, setProperty] = useState<Property | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [roomForm, setRoomForm] = useState({
    floor_number: 1,
    room_number: '',
    room_type: '',
    seats: 1,
    rent_per_seat: 0,
    price: 0,
    short_term_available: false,
    available: true,
    description: '',
    amenities: [] as string[],
    images: [] as string[],
    specifications: {}
  });

  useEffect(() => {
    if (propertyId) {
      loadPropertyAndRooms();
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

  const handleOpenDialog = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setRoomForm({
        floor_number: room.floor_number || 1,
        room_number: room.room_number || '',
        room_type: room.room_type,
        seats: room.seats || 1,
        rent_per_seat: room.rent_per_seat || 0,
        price: room.price,
        short_term_available: room.short_term_available || false,
        available: room.available,
        description: room.description || '',
        amenities: room.amenities || [],
        images: room.images || [],
        specifications: room.specifications || {}
      });
    } else {
      setEditingRoom(null);
      setRoomForm({
        floor_number: 1,
        room_number: '',
        room_type: '',
        seats: 1,
        rent_per_seat: 0,
        price: 0,
        short_term_available: false,
        available: true,
        description: '',
        amenities: [],
        images: [],
        specifications: {}
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveRoom = async () => {
    if (!propertyId) return;

    try {
      const roomData = {
        property_id: propertyId,
        ...roomForm
      };

      if (editingRoom) {
        const result = await updateRoom(editingRoom.id, roomData);
        if (result.success) {
          toast({
            title: 'Success',
            description: 'Room updated successfully'
          });
        } else {
          throw new Error(result.error);
        }
      } else {
        const result = await createRoom(roomData);
        if (result.success) {
          toast({
            title: 'Success',
            description: 'Room created successfully'
          });
        } else {
          throw new Error(result.error);
        }
      }

      setIsDialogOpen(false);
      loadPropertyAndRooms();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save room',
        variant: 'destructive'
      });
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
        loadPropertyAndRooms();
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `rooms/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      setRoomForm(prev => ({
        ...prev,
        images: [...prev.images, publicUrl]
      }));
      
      toast({
        title: 'Success',
        description: 'Image uploaded successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload image',
        variant: 'destructive'
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setRoomForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setRoomForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const commonAmenities = [
    'AC', 'WiFi', 'Attached Bathroom', 'Balcony', 'Wardrobe', 
    'Study Table', 'Chair', 'Bed', 'Mattress', 'Fan', 
    'Window', 'Geyser', 'TV', 'Refrigerator'
  ];

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
              <Badge variant="outline">Total: {(property.total_floors || 1) * (property.rooms_per_floor || 1)} Rooms</Badge>
            </div>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="floor_number">Floor Number *</Label>
                  <Input
                    id="floor_number"
                    type="number"
                    min="1"
                    max={property.total_floors || 1}
                    value={roomForm.floor_number}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, floor_number: Number(e.target.value) }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room_number">Room Number *</Label>
                  <Input
                    id="room_number"
                    value={roomForm.room_number}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, room_number: e.target.value }))}
                    placeholder="e.g., 101, A1, etc."
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="room_type">Room Type *</Label>
                <Input
                  id="room_type"
                  value={roomForm.room_type}
                  onChange={(e) => setRoomForm(prev => ({ ...prev, room_type: e.target.value }))}
                  placeholder="e.g., Single, Double, Triple, Deluxe"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seats">Number of Seats *</Label>
                  <Input
                    id="seats"
                    type="number"
                    min="1"
                    value={roomForm.seats}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, seats: Number(e.target.value) }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rent_per_seat">Rent Per Seat (₹/month) *</Label>
                  <Input
                    id="rent_per_seat"
                    type="number"
                    min="0"
                    value={roomForm.rent_per_seat}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, rent_per_seat: Number(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Total Room Price (₹/month) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={roomForm.price}
                  onChange={(e) => setRoomForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Suggested: ₹{roomForm.seats * roomForm.rent_per_seat} ({roomForm.seats} seats × ₹{roomForm.rent_per_seat})
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={roomForm.description}
                  onChange={(e) => setRoomForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="Describe the room..."
                />
              </div>

              <div className="space-y-2">
                <Label>Room Amenities</Label>
                <div className="grid grid-cols-3 gap-2">
                  {commonAmenities.map(amenity => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${amenity}`}
                        checked={roomForm.amenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityToggle(amenity)}
                      />
                      <label
                        htmlFor={`amenity-${amenity}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Room Images</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="flex-1"
                    />
                  </div>
                  {roomForm.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {roomForm.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img src={img} alt={`Room ${index + 1}`} className="w-full h-20 object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="short_term_available"
                  checked={roomForm.short_term_available}
                  onCheckedChange={(checked) => setRoomForm(prev => ({ ...prev, short_term_available: checked as boolean }))}
                />
                <label
                  htmlFor="short_term_available"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Available for Short Term Stay
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="available"
                  checked={roomForm.available}
                  onCheckedChange={(checked) => setRoomForm(prev => ({ ...prev, available: checked as boolean }))}
                />
                <label
                  htmlFor="available"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Room Available for Booking
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSaveRoom}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Room
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {rooms.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No rooms added yet</p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Room
              </Button>
            </CardContent>
          </Card>
        ) : (
          rooms.map(room => (
            <Card key={room.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Room {room.room_number} - {room.room_type}
                      {!room.available && <Badge variant="destructive">Not Available</Badge>}
                      {room.short_term_available && <Badge variant="secondary">Short Term</Badge>}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Floor {room.floor_number} • {room.seats} Seats • ₹{room.rent_per_seat}/seat
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(room)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteRoom(room.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Pricing</p>
                    <p className="text-lg font-bold text-primary">₹{room.price}/month</p>
                    <p className="text-xs text-muted-foreground">₹{room.rent_per_seat} per seat × {room.seats} seats</p>
                  </div>

                  {room.description && (
                    <div>
                      <p className="text-sm font-medium mb-1">Description</p>
                      <p className="text-sm text-muted-foreground">{room.description}</p>
                    </div>
                  )}

                  {room.amenities && room.amenities.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Amenities</p>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.map(amenity => (
                          <Badge key={amenity} variant="outline">{amenity}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {room.images && room.images.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Images</p>
                      <div className="grid grid-cols-6 gap-2">
                        {room.images.map((img, index) => (
                          <img key={index} src={img} alt={`Room ${index + 1}`} className="w-full h-16 object-cover rounded" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
