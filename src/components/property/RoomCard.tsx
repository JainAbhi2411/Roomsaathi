import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  IndianRupee, Users, Bed, Bath, Maximize, Wind, CheckCircle2, 
  ChevronLeft, ChevronRight, Armchair, DoorOpen, Lamp, Wifi,
  Tv, Calendar, Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Room } from '@/types/index';

interface RoomCardProps {
  room: Room;
  index: number;
}

// Specification icons mapping
const specIcons: Record<string, React.ElementType> = {
  'size': Maximize,
  'bed': Bed,
  'bathroom': Bath,
  'ac': Wind,
  'furniture': Armchair,
};

// Furniture icons
const furnitureIcons: Record<string, React.ElementType> = {
  'Bed': Bed,
  'Almirah': DoorOpen,
  'Study Table': Armchair,
  'Chair': Armchair,
  'Shoe Rack': DoorOpen,
  'Lamp': Lamp,
  'TV': Tv,
  'WiFi': Wifi,
};

export default function RoomCard({ room, index }: RoomCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    if (room.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
    }
  };

  const prevImage = () => {
    if (room.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
    }
  };

  // Parse furniture string if it exists
  const furnitureList = room.specifications?.furniture 
    ? room.specifications.furniture.split(',').map(f => f.trim())
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-hover transition-all duration-300 border-2">
        {/* Room Image Gallery */}
        {room.images && room.images.length > 0 && (
          <div className="relative h-64 bg-muted">
            <img
              src={room.images[currentImageIndex]}
              alt={`${room.room_type} Room`}
              className="w-full h-full object-cover"
            />
            
            {/* Availability Badge */}
            <div className="absolute top-2.5 xl:p-4 left-4">
              <Badge 
                className={room.is_available 
                  ? "bg-success text-white" 
                  : "bg-destructive text-white"
                }
              >
                {room.is_available ? '✓ Available' : '✗ Not Available'}
              </Badge>
            </div>

            {/* Short Term Badge */}
            {room.short_term_available && (
              <div className="absolute top-2.5 xl:p-4 right-4">
                <Badge className="bg-accent text-accent-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  Short Term
                </Badge>
              </div>
            )}

            {/* Image Navigation */}
            {room.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm p-1.5 rounded-full hover:bg-background transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm p-1.5 rounded-full hover:bg-background transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                
                {/* Image Counter */}
                <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                  {currentImageIndex + 1} / {room.images.length}
                </div>
              </>
            )}
          </div>
        )}

        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-sm xl:text-lg xl:text-2xl font-bold mb-2">
                {room.room_type} Room
              </CardTitle>
              {room.room_number && (
                <p className="text-sm text-muted-foreground">
                  Room No: {room.room_number}
                  {room.floor_number && ` • Floor ${room.floor_number}`}
                </p>
              )}
            </div>
            
            {/* Price Display */}
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm xl:text-lg xl:text-2xl font-bold text-primary">
                <IndianRupee className="h-5 w-5" />
                <span>{room.price.toLocaleString()}</span>
              </div>
              {room.rent_per_seat && room.seats && (
                <p className="text-xs text-muted-foreground mt-1">
                  ₹{room.rent_per_seat.toLocaleString()}/seat
                </p>
              )}
              <p className="text-xs text-muted-foreground">per month</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Description */}
          {room.description && (
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {room.description}
              </p>
            </div>
          )}

          {/* Occupancy Info */}
          {room.seats && (
            <div className="flex items-center gap-2 xl:gap-2.5 xl:p-4 p-3 bg-secondary/30 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Occupancy</p>
                <p className="text-xs text-muted-foreground">
                  {room.seats} {room.seats === 1 ? 'person' : 'persons'}
                </p>
              </div>
            </div>
          )}

          <Separator />

          {/* Room Specifications */}
          {room.specifications && Object.keys(room.specifications).length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                Room Specifications
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(room.specifications).map(([key, value]) => {
                  if (!value || key === 'furniture') return null;
                  
                  const Icon = specIcons[key] || Info;
                  const displayValue = typeof value === 'boolean' 
                    ? (value ? 'Yes' : 'No')
                    : value;

                  return (
                    <div 
                      key={key}
                      className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg"
                    >
                      <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground capitalize">
                          {key.replace('_', ' ')}
                        </p>
                        <p className="text-sm font-medium truncate">
                          {displayValue}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Furniture & Amenities */}
          {(furnitureList.length > 0 || (room.amenities && room.amenities.length > 0)) && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Furniture & Amenities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {furnitureList.map((item, idx) => {
                    const Icon = furnitureIcons[item] || Armchair;
                    return (
                      <div
                        key={`furniture-${idx}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{item}</span>
                      </div>
                    );
                  })}
                  {room.amenities?.map((amenity, idx) => {
                    const Icon = furnitureIcons[amenity] || CheckCircle2;
                    return (
                      <div
                        key={`amenity-${idx}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/20 text-accent-foreground rounded-full text-sm"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Action Button */}
          <Button 
            className="w-full" 
            size="lg"
            disabled={!room.is_available}
          >
            {room.is_available ? 'Inquire Now' : 'Currently Unavailable'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
