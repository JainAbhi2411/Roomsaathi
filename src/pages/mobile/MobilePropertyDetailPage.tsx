import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Home,
  User,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  Square,
  Car,
  Wifi,
  Utensils,
  Shield,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';
import type { PropertyWithDetails, Room, Amenity } from '@/types';
import { motion, AnimatePresence } from 'motion/react';

export default function MobilePropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [property, setProperty] = useState<PropertyWithDetails | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  // Schedule visit form
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [visitPhone, setVisitPhone] = useState('');
  const [visitNotes, setVisitNotes] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);

  useEffect(() => {
    if (id) {
      loadPropertyDetails();
      checkFavoriteStatus();
    }
  }, [id]);

  const loadPropertyDetails = async () => {
    if (!id) return;

    try {
      setIsLoading(true);

      // Load property
      const { data: propData, error: propError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .maybeSingle();

      if (propError) throw propError;
      if (!propData) {
        toast({
          title: 'Error',
          description: 'Property not found',
          variant: 'destructive',
        });
        navigate('/mobile/home');
        return;
      }

      setProperty(propData as PropertyWithDetails);

      // Load rooms
      const { data: roomsData } = await supabase
        .from('rooms')
        .select('*')
        .eq('property_id', id)
        .order('price', { ascending: true });

      if (roomsData) {
        setRooms(roomsData as Room[]);
      }

      // Load amenities
      const { data: amenitiesData } = await supabase
        .from('amenities')
        .select('*')
        .eq('property_id', id);

      if (amenitiesData) {
        setAmenities(amenitiesData as Amenity[]);
      }
    } catch (error) {
      console.error('Error loading property:', error);
      toast({
        title: 'Error',
        description: 'Failed to load property details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    if (!id || !user) return;

    try {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('property_id', id)
        .eq('user_session_id', user.id)
        .maybeSingle();

      setIsFavorite(!!data);
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!id) return;

    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to save favorites',
        variant: 'destructive',
      });
      navigate('/mobile/login');
      return;
    }

    try {
      if (isFavorite) {
        // Remove from favorites
        await supabase
          .from('favorites')
          .delete()
          .eq('property_id', id)
          .eq('user_session_id', user.id);

        setIsFavorite(false);
        toast({
          title: 'Removed',
          description: 'Property removed from favorites',
        });
      } else {
        // Add to favorites
        const { error: insertError } = await supabase
          .from('favorites')
          .insert([{
            property_id: id,
            user_session_id: user.id,
          }] as any);

        if (insertError) throw insertError;

        setIsFavorite(true);
        toast({
          title: 'Saved',
          description: 'Property added to favorites',
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to update favorites',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    if (!property) return;

    const shareData = {
      title: property.name,
      text: `Check out this property: ${property.name}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link Copied',
          description: 'Property link copied to clipboard',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleScheduleVisit = async () => {
    if (!id || !user) {
      toast({
        title: 'Login Required',
        description: 'Please login to schedule a visit',
        variant: 'destructive',
      });
      navigate('/mobile/login');
      return;
    }

    if (!visitDate || !visitTime || !visitPhone) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsScheduling(true);

      const { error } = await supabase
        .from('visit_schedules')
        .insert([{
          user_id: user.id,
          property_id: id,
          preferred_date: visitDate,
          preferred_time: visitTime,
          phone: visitPhone,
          notes: visitNotes,
          status: 'pending',
        }] as any);

      if (error) throw error;

      toast({
        title: 'Visit Scheduled',
        description: 'Your visit has been scheduled successfully',
      });

      setShowScheduleDialog(false);
      setVisitDate('');
      setVisitTime('');
      setVisitPhone('');
      setVisitNotes('');
    } catch (error) {
      console.error('Error scheduling visit:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule visit',
        variant: 'destructive',
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const nextImage = () => {
    if (!property?.images) return;
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    if (!property?.images) return;
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Property not found</p>
          <Button onClick={() => navigate('/mobile/home')}>Go Back</Button>
        </div>
      </div>
    );
  }

  const allImages = [
    ...(property.images || []),
    ...rooms.flatMap(room => room.images || [])
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative h-64 bg-muted">
        {property.images && property.images.length > 0 ? (
          <>
            <img
              src={property.images[currentImageIndex]}
              alt={property.name}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setShowImageGallery(true)}
            />
            {property.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/80 px-3 py-1 rounded-full text-xs">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Title and Price */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge variant="secondary">{property.type}</Badge>
                {property.verified && (
                  <Badge className="bg-green-500">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold mb-2">{property.name}</h1>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{property.locality}, {property.city}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                ₹{property.price_from.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">per month</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Info */}
        {(property.bedrooms || property.bathrooms || property.property_size) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  {property.bedrooms && (
                    <div>
                      <Bed className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-sm font-semibold">{property.bedrooms}</p>
                      <p className="text-xs text-muted-foreground">Bedrooms</p>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div>
                      <Bath className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-sm font-semibold">{property.bathrooms}</p>
                      <p className="text-xs text-muted-foreground">Bathrooms</p>
                    </div>
                  )}
                  {property.property_size && (
                    <div>
                      <Square className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-sm font-semibold">{property.property_size}</p>
                      <p className="text-xs text-muted-foreground">sq ft</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-3">Description</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {property.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Amenities */}
        {amenities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-3">Amenities</h2>
                <div className="grid grid-cols-2 gap-3">
                  {amenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      <span className="text-sm">{amenity.amenity_name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Rooms */}
        {rooms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-3">Available Rooms</h2>
                <div className="space-y-3">
                  {rooms.map((room) => (
                    <div key={room.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold">{room.room_type}</h3>
                          {room.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {room.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">₹{room.price.toLocaleString()}</p>
                          <Badge
                            variant={room.is_available ? 'default' : 'secondary'}
                            className="mt-1"
                          >
                            {room.is_available ? 'Available' : 'Occupied'}
                          </Badge>
                        </div>
                      </div>
                      {room.images && room.images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto mt-2">
                          {room.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`${room.room_type} ${idx + 1}`}
                              className="w-20 h-20 rounded object-cover cursor-pointer"
                              onClick={() => {
                                setCurrentImageIndex(property.images.length + idx);
                                setShowImageGallery(true);
                              }}
                            />
                          ))}
                        </div>
                      )}
                      {room.specifications && Object.keys(room.specifications).length > 0 && (
                        <div className="mt-2 pt-2 border-t">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(room.specifications).map(([key, value]) => (
                              <div key={key}>
                                <span className="text-muted-foreground capitalize">
                                  {key.replace(/_/g, ' ')}:
                                </span>{' '}
                                <span className="font-medium">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Property Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-3">Property Details</h2>
              <div className="space-y-2 text-sm">
                <DetailRow label="Address" value={property.address} />
                <DetailRow label="City" value={property.city} />
                <DetailRow label="Locality" value={property.locality} />
                {property.pincode && <DetailRow label="Pincode" value={property.pincode} />}
                <DetailRow label="Availability" value={property.availability_status} />
                {property.furnishing_status && (
                  <DetailRow label="Furnishing" value={property.furnishing_status} />
                )}
                {property.parking_type && (
                  <DetailRow label="Parking" value={property.parking_type} />
                )}
                {property.food_included !== undefined && (
                  <DetailRow label="Food Included" value={property.food_included ? 'Yes' : 'No'} />
                )}
                {property.property_size && (
                  <DetailRow label="Property Size" value={`${property.property_size} sq ft`} />
                )}
                {property.total_floors && (
                  <DetailRow label="Total Floors" value={property.total_floors.toString()} />
                )}
                {property.floor_number && (
                  <DetailRow label="Floor Number" value={property.floor_number.toString()} />
                )}
                {property.property_age && (
                  <DetailRow label="Property Age" value={`${property.property_age} years`} />
                )}
                {property.facing_direction && (
                  <DetailRow label="Facing" value={property.facing_direction} />
                )}
                {property.water_supply && (
                  <DetailRow label="Water Supply" value={property.water_supply} />
                )}
                {property.power_backup && (
                  <DetailRow label="Power Backup" value="Available" />
                )}
                {property.lift_available && (
                  <DetailRow label="Lift" value="Available" />
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* PG Specific Details */}
        {property.type === 'PG' && (property.gender_preference || property.sharing_type || property.meal_options) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.55 }}
          >
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-3">PG Details</h2>
                <div className="space-y-2 text-sm">
                  {property.gender_preference && (
                    <DetailRow label="Gender Preference" value={property.gender_preference} />
                  )}
                  {property.sharing_type && (
                    <DetailRow label="Sharing Type" value={property.sharing_type} />
                  )}
                  {property.meal_options && property.meal_options.length > 0 && (
                    <DetailRow label="Meal Options" value={property.meal_options.join(', ')} />
                  )}
                  {property.meal_charges && (
                    <DetailRow label="Meal Charges" value={`₹${property.meal_charges}/month`} />
                  )}
                  {property.room_type && (
                    <DetailRow label="Room Type" value={property.room_type} />
                  )}
                  {property.attached_bathroom !== undefined && (
                    <DetailRow label="Attached Bathroom" value={property.attached_bathroom ? 'Yes' : 'No'} />
                  )}
                  {property.laundry_service !== undefined && (
                    <DetailRow label="Laundry Service" value={property.laundry_service ? 'Yes' : 'No'} />
                  )}
                  {property.gate_closing_time && (
                    <DetailRow label="Gate Closing Time" value={property.gate_closing_time} />
                  )}
                  {property.visitor_policy && (
                    <DetailRow label="Visitor Policy" value={property.visitor_policy} />
                  )}
                  {property.notice_period_days && (
                    <DetailRow label="Notice Period" value={`${property.notice_period_days} days`} />
                  )}
                  {property.lock_in_period_months && (
                    <DetailRow label="Lock-in Period" value={`${property.lock_in_period_months} months`} />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Flat/Apartment Specific Details */}
        {(property.type === 'Flat' || property.type === 'Apartment') && (property.carpet_area || property.built_up_area || property.maintenance_charges) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.55 }}
          >
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-3">Additional Details</h2>
                <div className="space-y-2 text-sm">
                  {property.carpet_area && (
                    <DetailRow label="Carpet Area" value={`${property.carpet_area} sq ft`} />
                  )}
                  {property.built_up_area && (
                    <DetailRow label="Built-up Area" value={`${property.built_up_area} sq ft`} />
                  )}
                  {property.balconies && (
                    <DetailRow label="Balconies" value={property.balconies.toString()} />
                  )}
                  {property.maintenance_charges && (
                    <DetailRow label="Maintenance" value={`₹${property.maintenance_charges}/month`} />
                  )}
                  {property.security_deposit_months && (
                    <DetailRow label="Security Deposit" value={`${property.security_deposit_months} months rent`} />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Hostel Specific Details */}
        {property.type === 'Hostel' && (property.total_capacity || property.hostel_gender || property.meal_plans) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.55 }}
          >
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-3">Hostel Details</h2>
                <div className="space-y-2 text-sm">
                  {property.total_capacity && (
                    <DetailRow label="Total Capacity" value={property.total_capacity.toString()} />
                  )}
                  {property.current_occupancy && (
                    <DetailRow label="Current Occupancy" value={property.current_occupancy.toString()} />
                  )}
                  {property.hostel_gender && (
                    <DetailRow label="Gender" value={property.hostel_gender} />
                  )}
                  {property.meal_plans && property.meal_plans.length > 0 && (
                    <DetailRow label="Meal Plans" value={property.meal_plans.join(', ')} />
                  )}
                  {property.warden_available !== undefined && (
                    <DetailRow label="Warden" value={property.warden_available ? 'Available' : 'Not Available'} />
                  )}
                  {property.study_room !== undefined && (
                    <DetailRow label="Study Room" value={property.study_room ? 'Available' : 'Not Available'} />
                  )}
                  {property.common_area !== undefined && (
                    <DetailRow label="Common Area" value={property.common_area ? 'Available' : 'Not Available'} />
                  )}
                  {property.security_hours && (
                    <DetailRow label="Security" value={property.security_hours} />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Short Term Stay Details */}
        {property.type === 'Short Term Stay' && (property.min_stay_duration || property.daily_rate || property.check_in_time) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.55 }}
          >
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-3">Stay Details</h2>
                <div className="space-y-2 text-sm">
                  {property.min_stay_duration && (
                    <DetailRow label="Min Stay" value={`${property.min_stay_duration} days`} />
                  )}
                  {property.max_stay_duration && (
                    <DetailRow label="Max Stay" value={`${property.max_stay_duration} days`} />
                  )}
                  {property.daily_rate && (
                    <DetailRow label="Daily Rate" value={`₹${property.daily_rate}`} />
                  )}
                  {property.weekly_rate && (
                    <DetailRow label="Weekly Rate" value={`₹${property.weekly_rate}`} />
                  )}
                  {property.monthly_rate && (
                    <DetailRow label="Monthly Rate" value={`₹${property.monthly_rate}`} />
                  )}
                  {property.check_in_time && (
                    <DetailRow label="Check-in Time" value={property.check_in_time} />
                  )}
                  {property.check_out_time && (
                    <DetailRow label="Check-out Time" value={property.check_out_time} />
                  )}
                  {property.cancellation_policy && (
                    <DetailRow label="Cancellation Policy" value={property.cancellation_policy} />
                  )}
                  {property.cleaning_service && (
                    <DetailRow label="Cleaning Service" value={property.cleaning_service} />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Video Tour */}
        {property.video_url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-3">Video Tour</h2>
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <iframe
                    src={property.video_url}
                    title={`${property.name} - Video Tour`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Contact Information */}
        {(property.contact_phone || property.contact_email || property.owner_name) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-3">Contact Information</h2>
                <div className="space-y-3">
                  {property.owner_name && (
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Owner</p>
                        <p className="font-medium">{property.owner_name}</p>
                      </div>
                    </div>
                  )}
                  {property.contact_phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <a
                          href={`tel:${property.contact_phone}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {property.contact_phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {property.contact_email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <a
                          href={`mailto:${property.contact_email}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {property.contact_email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
        <div className="flex gap-3">
          {property.contact_phone && (
            <Button
              variant="outline"
              className="flex-1"
              asChild
            >
              <a href={`tel:${property.contact_phone}`}>
                <Phone className="h-4 w-4 mr-2" />
                Call
              </a>
            </Button>
          )}
          <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
            <DialogTrigger asChild>
              <Button className="flex-1">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Visit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] rounded-lg">
              <DialogHeader>
                <DialogTitle>Schedule a Visit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Preferred Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={visitPhone}
                    onChange={(e) => setVisitPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any specific requirements or questions"
                    value={visitNotes}
                    onChange={(e) => setVisitNotes(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleScheduleVisit}
                  disabled={isScheduling}
                  className="w-full"
                >
                  {isScheduling ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    'Confirm Schedule'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Image Gallery Dialog */}
      <Dialog open={showImageGallery} onOpenChange={setShowImageGallery}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
          <div className="relative h-[80vh]">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-background/80"
              onClick={() => setShowImageGallery(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            {allImages.length > 0 && (
              <>
                <img
                  src={allImages[currentImageIndex]}
                  alt="Property"
                  className="w-full h-full object-contain"
                />
                {allImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 px-4 py-2 rounded-full">
                      {currentImageIndex + 1} / {allImages.length}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
