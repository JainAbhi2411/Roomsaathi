import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bed, Filter, Grid3x3, List, IndianRupee, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Room } from '@/types/index';
import RoomCard from './RoomCard';

interface RoomSpecificationsProps {
  rooms: Room[];
  propertyName: string;
}

export default function RoomSpecifications({ rooms, propertyName }: RoomSpecificationsProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterAvailability, setFilterAvailability] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price-low');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (!rooms || rooms.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Bed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Room Information Available</h3>
          <p className="text-sm text-muted-foreground">
            Room details for this property are currently being updated.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get unique room types
  const roomTypes = ['all', ...Array.from(new Set(rooms.map(r => r.room_type)))];

  // Filter rooms
  let filteredRooms = rooms;

  if (filterType !== 'all') {
    filteredRooms = filteredRooms.filter(room => room.room_type === filterType);
  }

  if (filterAvailability === 'available') {
    filteredRooms = filteredRooms.filter(room => room.available);
  } else if (filterAvailability === 'unavailable') {
    filteredRooms = filteredRooms.filter(room => !room.available);
  }

  // Sort rooms
  filteredRooms = [...filteredRooms].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'type':
        return a.room_type.localeCompare(b.room_type);
      case 'availability':
        return (b.available ? 1 : 0) - (a.available ? 1 : 0);
      default:
        return 0;
    }
  });

  // Calculate statistics
  const availableRooms = rooms.filter(r => r.available).length;
  const priceRange = rooms.length > 0 
    ? {
        min: Math.min(...rooms.map(r => r.price)),
        max: Math.max(...rooms.map(r => r.price))
      }
    : { min: 0, max: 0 };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Bed className="h-8 w-8 text-primary" />
              Room Specifications
            </h2>
            <p className="text-muted-foreground">
              Explore available rooms at {propertyName}
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Bed className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{rooms.length}</p>
                  <p className="text-xs text-muted-foreground">Total Rooms</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/20 rounded-lg">
                  <Users className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{availableRooms}</p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <IndianRupee className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-lg font-bold">₹{priceRange.min.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Starting From</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/30 to-secondary/10 border-secondary/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/40 rounded-lg">
                  <Filter className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{roomTypes.length - 1}</p>
                  <p className="text-xs text-muted-foreground">Room Types</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
              <div className="flex flex-wrap gap-3 flex-1">
                {/* Room Type Filter */}
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Room Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {roomTypes.slice(1).map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Availability Filter */}
                <Select value={filterAvailability} onValueChange={setFilterAvailability}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rooms</SelectItem>
                    <SelectItem value="available">Available Only</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort By */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="type">Room Type</SelectItem>
                    <SelectItem value="availability">Availability</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(filterType !== 'all' || filterAvailability !== 'all') && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-muted-foreground">Active Filters:</span>
                {filterType !== 'all' && (
                  <Badge variant="secondary">
                    Type: {filterType}
                  </Badge>
                )}
                {filterAvailability !== 'all' && (
                  <Badge variant="secondary">
                    {filterAvailability === 'available' ? 'Available Only' : 'Unavailable'}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilterType('all');
                    setFilterAvailability('all');
                  }}
                  className="h-6 px-2 text-xs"
                >
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Rooms Display */}
      {filteredRooms.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Rooms Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your filters to see more results.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setFilterType('all');
                setFilterAvailability('all');
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid xl:grid-cols-2 gap-6'
            : 'space-y-6'
        }>
          {filteredRooms.map((room, index) => (
            <RoomCard key={room.id} room={room} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
