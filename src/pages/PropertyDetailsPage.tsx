import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useParams, useNavigate, Link } from 'react-router';
import { 
  MapPin, Phone, Mail, User, ArrowLeft, IndianRupee, Calendar, 
  Wifi, Car, Utensils, Dumbbell, Shield, Zap, Droplet, Wind,
  Tv, Refrigerator, WashingMachine, CheckCircle2, Users, Bed,
  Bath, Maximize, Home, MapPinned, School, ShoppingBag, Hospital,
  Bus, Coffee, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { PropertyWithDetails, Property } from '@/types/index';
import { getPropertyById, getProperties } from '@/db/api';
import VerifiedBadge from '@/components/property/VerifiedBadge';
import FavoriteButton from '@/components/property/FavoriteButton';
import ShareButton from '@/components/property/ShareButton';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

// Amenity icons mapping
const amenityIcons: Record<string, React.ElementType> = {
  'WiFi': Wifi,
  'Parking': Car,
  'Mess/Kitchen': Utensils,
  'Gym': Dumbbell,
  'Security': Shield,
  'Power Backup': Zap,
  'Water Supply': Droplet,
  'AC': Wind,
  'TV': Tv,
  'Refrigerator': Refrigerator,
  'Laundry': WashingMachine,
  'Geyser': Droplet,
};

// Room type data with images
const roomTypeImages: Record<string, string> = {
  'Single': 'https://miaoda-site-img.s3cdn.medo.dev/images/2e273e6d-09f8-4dcb-806e-4698e8295177.jpg',
  'Double': 'https://miaoda-site-img.s3cdn.medo.dev/images/e10f6ba5-bc93-4df3-800a-7354c322ac79.jpg',
  'Triple': 'https://miaoda-site-img.s3cdn.medo.dev/images/f11d4a6d-ccca-4857-93ec-b89bbe7a2fa2.jpg',
};

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<PropertyWithDetails | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadProperty(id);
    }
  }, [id]);

  const loadProperty = async (propertyId: string) => {
    setLoading(true);
    try {
      const data = await getPropertyById(propertyId);
      setProperty(data);
      
      // Load similar properties
      if (data) {
        const similar = await getProperties({ 
          city: data.city, 
          type: data.type 
        });
        setSimilarProperties(similar.filter(p => p.id !== propertyId).slice(0, 4));
      }
    } catch (error) {
      console.error('Failed to load property:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full mb-8 bg-muted" />
          <div className="grid xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <Skeleton className="h-12 w-3/4 mb-4 bg-muted" />
              <Skeleton className="h-24 w-full bg-muted" />
            </div>
            <div>
              <Skeleton className="h-64 w-full bg-muted" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Property not found</h1>
          <Button onClick={() => navigate('/browse')}>Back to Browse</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const priceDisplay = property.price_to
    ? `₹${property.price_from.toLocaleString()} - ₹${property.price_to.toLocaleString()}`
    : `Starting from ₹${property.price_from.toLocaleString()}`;

  // Neighborhood highlights (mock data - in real app, this would come from database)
  const neighborhoodHighlights = [
    { icon: School, label: 'Educational Institutes', distance: '500m' },
    { icon: ShoppingBag, label: 'Shopping Centers', distance: '1.2km' },
    { icon: Hospital, label: 'Hospitals', distance: '800m' },
    { icon: Bus, label: 'Bus Stand', distance: '300m' },
    { icon: Coffee, label: 'Cafes & Restaurants', distance: '200m' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Grid Layout */}
            <div className="grid xl:grid-cols-3 gap-8">
              {/* Left Side - Images and Details */}
              <div className="xl:col-span-2 space-y-8">
                {/* Image Gallery */}
                {property.images.length > 0 && (
                  <div className="relative">
                    <div 
                      className="relative h-96 xl:h-[500px] rounded-2xl overflow-hidden cursor-pointer group"
                      onClick={() => setIsGalleryOpen(true)}
                    >
                      <img
                        src={property.images[currentImageIndex]}
                        alt={`${property.name} - Image ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      
                      {/* Image Counter */}
                      <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
                        {currentImageIndex + 1} / {property.images.length}
                      </div>

                      {/* Navigation Arrows */}
                      {property.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm p-2 rounded-full hover:bg-background transition-colors"
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm p-2 rounded-full hover:bg-background transition-colors"
                          >
                            <ChevronRight className="h-6 w-6" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Strip */}
                    {property.images.length > 1 && (
                      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {property.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                              index === currentImageIndex
                                ? 'border-primary scale-105'
                                : 'border-transparent hover:border-border'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Property Header */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl xl:text-4xl font-bold">{property.name}</h1>
                        <VerifiedBadge verified={property.verified} />
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4" />
                        <span>{property.locality}, {property.city}</span>
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {property.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <FavoriteButton propertyId={property.id} isFavorite={property.is_favorite || false} />
                      <ShareButton propertyId={property.id} propertyName={property.name} />
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-primary">{priceDisplay}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {property.description}
                  </p>
                </div>

                <Separator />

                {/* Property Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      Property Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 @md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Property Type</p>
                        <p className="font-semibold">{property.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">City</p>
                        <p className="font-semibold">{property.city}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Locality</p>
                        <p className="font-semibold">{property.locality}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Availability</p>
                        <p className="font-semibold">{property.availability_status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Verified</p>
                        <p className="font-semibold">{property.verified ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Full Address</p>
                      <p className="font-medium">{property.address}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Amenities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 @md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {property.amenities.map((amenity, index) => {
                          const Icon = amenityIcons[amenity.amenity_name] || CheckCircle2;
                          return (
                            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                              <span className="text-sm font-medium">{amenity.amenity_name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Rooms Information */}
                {property.rooms && property.rooms.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bed className="h-5 w-5" />
                        Available Rooms
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {property.rooms.map((room) => (
                          <Card key={room.id} className="overflow-hidden">
                            <div className="grid @md:grid-cols-[200px_1fr] gap-4">
                              {/* Room Image */}
                              <div className="relative h-48 @md:h-full">
                                <img
                                  src={room.images[0] || roomTypeImages[room.room_type] || property.images[0]}
                                  alt={room.room_type}
                                  className="w-full h-full object-cover"
                                />
                                {!room.available && (
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <Badge variant="destructive">Not Available</Badge>
                                  </div>
                                )}
                              </div>

                              {/* Room Details */}
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h3 className="text-xl font-bold mb-1">{room.room_type} Sharing</h3>
                                    {room.description && (
                                      <p className="text-sm text-muted-foreground">{room.description}</p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-primary">
                                      ₹{room.price.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-muted-foreground">per month</div>
                                  </div>
                                </div>

                                {/* Room Specifications */}
                                {room.specifications && (
                                  <div className="grid grid-cols-2 @md:grid-cols-4 gap-3 mb-4">
                                    {room.specifications.size && (
                                      <div className="flex items-center gap-2 text-sm">
                                        <Maximize className="h-4 w-4 text-muted-foreground" />
                                        <span>{room.specifications.size}</span>
                                      </div>
                                    )}
                                    {room.specifications.bed && (
                                      <div className="flex items-center gap-2 text-sm">
                                        <Bed className="h-4 w-4 text-muted-foreground" />
                                        <span>{room.specifications.bed}</span>
                                      </div>
                                    )}
                                    {room.specifications.bathroom && (
                                      <div className="flex items-center gap-2 text-sm">
                                        <Bath className="h-4 w-4 text-muted-foreground" />
                                        <span>{room.specifications.bathroom}</span>
                                      </div>
                                    )}
                                    {room.specifications.ac && (
                                      <div className="flex items-center gap-2 text-sm">
                                        <Wind className="h-4 w-4 text-muted-foreground" />
                                        <span>AC</span>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {room.available && (
                                  <Button className="w-full @md:w-auto">
                                    Book This Room
                                  </Button>
                                )}
                              </CardContent>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Owner Contact */}
                {(property.owner_name || property.contact_phone || property.contact_email) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Contact Owner
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {property.owner_name && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Owner</p>
                            <p className="font-semibold">{property.owner_name}</p>
                          </div>
                        </div>
                      )}
                      {property.contact_phone && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Phone className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <a href={`tel:${property.contact_phone}`} className="font-semibold hover:text-primary">
                              {property.contact_phone}
                            </a>
                          </div>
                        </div>
                      )}
                      {property.contact_email && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <a href={`mailto:${property.contact_email}`} className="font-semibold hover:text-primary">
                              {property.contact_email}
                            </a>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Sidebar - Sticky */}
              <div className="xl:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Schedule Visit Card */}
                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-center">Schedule a Visit</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground text-center">
                        Book a visit to see this property in person
                      </p>
                      <Button className="w-full" size="lg">
                        <Calendar className="mr-2 h-5 w-5" />
                        Schedule Visit
                      </Button>
                      <Button variant="outline" className="w-full" size="lg">
                        <Phone className="mr-2 h-5 w-5" />
                        Call Now
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Neighborhood Highlights */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPinned className="h-5 w-5" />
                        Neighborhood
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {neighborhoodHighlights.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <item.icon className="h-4 w-4 text-primary" />
                              </div>
                              <span className="text-sm font-medium">{item.label}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{item.distance}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 relative h-48 rounded-lg overflow-hidden">
                        <img
                          src="https://miaoda-site-img.s3cdn.medo.dev/images/fb4d12c7-0396-4e46-80ff-0a9862daa359.jpg"
                          alt="Neighborhood Map"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Quick Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Property ID</span>
                        <span className="font-medium">#{property.id.slice(0, 8)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Listed</span>
                        <span className="font-medium">
                          {new Date(property.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="secondary">{property.availability_status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Similar Properties */}
            {similarProperties.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl xl:text-3xl font-bold mb-8">
                  Similar <span className="gradient-text">Properties</span>
                </h2>
                <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {similarProperties.map((similarProp) => (
                    <Link key={similarProp.id} to={`/property/${similarProp.id}`}>
                      <Card className="overflow-hidden hover:shadow-hover transition-all duration-300 group h-full">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={similarProp.images[0]}
                            alt={similarProp.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          {similarProp.verified && (
                            <div className="absolute top-3 right-3">
                              <VerifiedBadge verified={similarProp.verified} />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                            {similarProp.name}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                            <MapPin className="h-3 w-3" />
                            <span className="line-clamp-1">{similarProp.locality}, {similarProp.city}</span>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-primary">
                              ₹{similarProp.price_from.toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground">/month</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Image Gallery Modal */}
        <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
          <DialogContent className="max-w-6xl h-[90vh] p-0">
            <DialogHeader className="absolute top-4 left-4 right-4 z-10">
              <div className="flex items-center justify-between bg-background/90 backdrop-blur-sm rounded-lg p-4">
                <DialogTitle>
                  {property.name} - Image {currentImageIndex + 1} of {property.images.length}
                </DialogTitle>
                <button
                  onClick={() => setIsGalleryOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>
            <div className="relative h-full flex items-center justify-center bg-black">
              <img
                src={property.images[currentImageIndex]}
                alt={`${property.name} - Image ${currentImageIndex + 1}`}
                className="max-h-full max-w-full object-contain"
              />
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm p-3 rounded-full hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm p-3 rounded-full hover:bg-background transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}
