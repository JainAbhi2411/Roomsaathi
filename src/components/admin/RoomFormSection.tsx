import { useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface RoomFormData {
  room_type: string;
  price: number;
  description: string;
  images: string[];
  capacity: number;
  sharing_type: string;
  occupied_seats: number;
  room_size: number | null;
  has_attached_bathroom: boolean;
  has_balcony: boolean;
  furnishing_status: string;
  floor_number: number | null;
  room_number: string;
  seats: number;
  rent_per_seat: number | null;
  short_term_available: boolean;
  amenities: string[];
  is_available: boolean;
}

interface RoomFormSectionProps {
  rooms: RoomFormData[];
  onChange: (rooms: RoomFormData[]) => void;
}

const commonRoomAmenities = [
  'Bed', 'Mattress', 'Pillow', 'Blanket', 'Study Table', 'Chair',
  'Wardrobe', 'Fan', 'Light', 'Window', 'Curtains', 'Mirror',
  'Dustbin', 'Attached Bathroom', 'Balcony', 'AC'
];

export default function RoomFormSection({ rooms, onChange }: RoomFormSectionProps) {
  const addRoom = () => {
    const newRoom: RoomFormData = {
      room_type: '',
      price: 0,
      description: '',
      images: [],
      capacity: 1,
      sharing_type: 'Single',
      occupied_seats: 0,
      room_size: null,
      has_attached_bathroom: false,
      has_balcony: false,
      furnishing_status: 'Semi-Furnished',
      floor_number: null,
      room_number: '',
      seats: 1,
      rent_per_seat: null,
      short_term_available: false,
      amenities: [],
      is_available: true
    };
    onChange([...rooms, newRoom]);
  };

  const removeRoom = (index: number) => {
    onChange(rooms.filter((_, i) => i !== index));
  };

  const updateRoom = (index: number, field: keyof RoomFormData, value: any) => {
    const updatedRooms = rooms.map((room, i) => 
      i === index ? { ...room, [field]: value } : room
    );
    onChange(updatedRooms);
  };

  const toggleRoomAmenity = (roomIndex: number, amenity: string) => {
    const room = rooms[roomIndex];
    const amenities = room.amenities.includes(amenity)
      ? room.amenities.filter(a => a !== amenity)
      : [...room.amenities, amenity];
    updateRoom(roomIndex, 'amenities', amenities);
  };

  const handleRoomImagesChange = (roomIndex: number, value: string) => {
    const urls = value.split('\n').map(url => url.trim()).filter(url => url);
    updateRoom(roomIndex, 'images', urls);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Room Details</h3>
          <p className="text-sm text-muted-foreground">Add and manage room types for this property</p>
        </div>
        <Button type="button" onClick={addRoom} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </Button>
      </div>

      {rooms.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No rooms added yet. Click "Add Room" to create room types.
          </CardContent>
        </Card>
      )}

      {rooms.map((room, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base">Room {index + 1}</CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeRoom(index)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic Room Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Room Type *</Label>
                <Input
                  value={room.room_type}
                  onChange={(e) => updateRoom(index, 'room_type', e.target.value)}
                  placeholder="e.g., Single Room, Double Sharing"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Price (₹/month) *</Label>
                <Input
                  type="number"
                  value={room.price}
                  onChange={(e) => updateRoom(index, 'price', parseInt(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Sharing Type</Label>
                <Select
                  value={room.sharing_type}
                  onValueChange={(value) => updateRoom(index, 'sharing_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Double">Double Sharing</SelectItem>
                    <SelectItem value="Triple">Triple Sharing</SelectItem>
                    <SelectItem value="Four">Four Sharing</SelectItem>
                    <SelectItem value="Dormitory">Dormitory</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Total Seats/Capacity</Label>
                <Input
                  type="number"
                  value={room.seats}
                  onChange={(e) => updateRoom(index, 'seats', parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="space-y-2">
                <Label>Occupied Seats</Label>
                <Input
                  type="number"
                  value={room.occupied_seats}
                  onChange={(e) => updateRoom(index, 'occupied_seats', parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label>Rent per Seat (₹/month)</Label>
                <Input
                  type="number"
                  value={room.rent_per_seat || ''}
                  onChange={(e) => updateRoom(index, 'rent_per_seat', parseInt(e.target.value) || null)}
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2">
                <Label>Room Size (sq ft)</Label>
                <Input
                  type="number"
                  value={room.room_size || ''}
                  onChange={(e) => updateRoom(index, 'room_size', parseFloat(e.target.value) || null)}
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2">
                <Label>Furnishing Status</Label>
                <Select
                  value={room.furnishing_status}
                  onValueChange={(value) => updateRoom(index, 'furnishing_status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fully-Furnished">Fully Furnished</SelectItem>
                    <SelectItem value="Semi-Furnished">Semi Furnished</SelectItem>
                    <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Floor Number</Label>
                <Input
                  type="number"
                  value={room.floor_number || ''}
                  onChange={(e) => updateRoom(index, 'floor_number', parseInt(e.target.value) || null)}
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2">
                <Label>Room Number</Label>
                <Input
                  value={room.room_number}
                  onChange={(e) => updateRoom(index, 'room_number', e.target.value)}
                  placeholder="e.g., 101, A-12"
                />
              </div>
            </div>

            {/* Room Description */}
            <div className="space-y-2">
              <Label>Room Description</Label>
              <Textarea
                value={room.description}
                onChange={(e) => updateRoom(index, 'description', e.target.value)}
                placeholder="Describe the room features, facilities, etc."
                rows={3}
              />
            </div>

            {/* Room Features */}
            <div className="space-y-3">
              <Label>Room Features</Label>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`bathroom-${index}`}
                    checked={room.has_attached_bathroom}
                    onCheckedChange={(checked) => updateRoom(index, 'has_attached_bathroom', checked)}
                  />
                  <label htmlFor={`bathroom-${index}`} className="text-sm cursor-pointer">
                    Attached Bathroom
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`balcony-${index}`}
                    checked={room.has_balcony}
                    onCheckedChange={(checked) => updateRoom(index, 'has_balcony', checked)}
                  />
                  <label htmlFor={`balcony-${index}`} className="text-sm cursor-pointer">
                    Balcony
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`short-term-${index}`}
                    checked={room.short_term_available}
                    onCheckedChange={(checked) => updateRoom(index, 'short_term_available', checked)}
                  />
                  <label htmlFor={`short-term-${index}`} className="text-sm cursor-pointer">
                    Short Term Available
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`available-${index}`}
                    checked={room.is_available}
                    onCheckedChange={(checked) => updateRoom(index, 'is_available', checked)}
                  />
                  <label htmlFor={`available-${index}`} className="text-sm cursor-pointer">
                    Currently Available
                  </label>
                </div>
              </div>
            </div>

            {/* Room Amenities */}
            <div className="space-y-3">
              <Label>Room Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {commonRoomAmenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${index}-${amenity}`}
                      checked={room.amenities.includes(amenity)}
                      onCheckedChange={() => toggleRoomAmenity(index, amenity)}
                    />
                    <label htmlFor={`amenity-${index}-${amenity}`} className="text-sm cursor-pointer">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Images */}
            <div className="space-y-2">
              <Label>Room Images (URLs)</Label>
              <Textarea
                value={room.images.join('\n')}
                onChange={(e) => handleRoomImagesChange(index, e.target.value)}
                placeholder="Enter image URLs (one per line)"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Enter one image URL per line. These images will be shown in the room gallery.
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
