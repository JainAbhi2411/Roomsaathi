import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle2, XCircle, Bed, Home } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface RoomDetail {
  roomNumber: string;
  floor: number;
  type: 'Single' | 'Double' | 'Triple' | 'Quad';
  totalSeats: number;
  occupiedSeats: number;
  rentPerSeat: number;
  facilities: string[];
}

interface FloorPlanViewProps {
  propertyName: string;
  floors: number;
  roomsData: RoomDetail[];
}

export default function FloorPlanView({ propertyName, floors, roomsData }: FloorPlanViewProps) {
  // Group rooms by floor
  const roomsByFloor = Array.from({ length: floors }, (_, i) => {
    const floorNumber = i + 1;
    return {
      floor: floorNumber,
      rooms: roomsData.filter(room => room.floor === floorNumber)
    };
  });

  const getRoomStatusColor = (occupied: number, total: number) => {
    const availableSeats = total - occupied;
    if (availableSeats === 0) return 'bg-destructive/10 border-destructive';
    if (availableSeats <= 1) return 'bg-yellow-500/10 border-yellow-500';
    return 'bg-green-500/10 border-green-500';
  };

  const getRoomStatusText = (occupied: number, total: number) => {
    const available = total - occupied;
    if (available === 0) return 'Full';
    if (available === 1) return '1 seat left';
    return `${available} seats`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Floor Plan & Room Availability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {roomsByFloor.map(({ floor, rooms }) => (
          <div key={floor} className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="default" className="text-sm">
                Floor {floor}
              </Badge>
              <Separator className="flex-1" />
              <span className="text-sm text-muted-foreground">
                {rooms.length} rooms
              </span>
            </div>

            <div className="grid grid-cols-2 @md:grid-cols-3 xl:grid-cols-4 gap-4">
              {rooms.map((room) => {
                const availableSeats = room.totalSeats - room.occupiedSeats;
                const isAvailable = availableSeats > 0;

                return (
                  <Card 
                    key={room.roomNumber}
                    className={`overflow-hidden border-2 transition-all hover:shadow-md ${getRoomStatusColor(room.occupiedSeats, room.totalSeats)}`}
                  >
                    <CardContent className="p-4 space-y-3">
                      {/* Room Number */}
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">#{room.roomNumber}</span>
                        {isAvailable ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                      </div>

                      {/* Room Type */}
                      <Badge variant="outline" className="w-full justify-center">
                        {room.type} Sharing
                      </Badge>

                      {/* Occupancy */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Occupancy</span>
                          <span className="font-semibold">
                            {room.occupiedSeats}/{room.totalSeats}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full transition-all ${
                              availableSeats === 0 ? 'bg-destructive' : 
                              availableSeats <= 1 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${(room.occupiedSeats / room.totalSeats) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-center font-medium">
                          {getRoomStatusText(room.occupiedSeats, room.totalSeats)}
                        </p>
                      </div>

                      {/* Rent */}
                      <div className="pt-2 border-t">
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary">
                            ₹{room.rentPerSeat.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">per seat/month</div>
                        </div>
                      </div>

                      {/* Facilities */}
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Facilities:</p>
                        <div className="flex flex-wrap gap-1">
                          {room.facilities.slice(0, 3).map((facility, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {facility}
                            </Badge>
                          ))}
                          {room.facilities.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{room.facilities.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="flex flex-wrap gap-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500/20 border-2 border-green-500" />
            <span className="text-sm text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500/20 border-2 border-yellow-500" />
            <span className="text-sm text-muted-foreground">Almost Full</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-destructive/20 border-2 border-destructive" />
            <span className="text-sm text-muted-foreground">Full</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
