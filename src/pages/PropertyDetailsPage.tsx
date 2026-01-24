import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router';
import { MapPin, Phone, Mail, User, ArrowLeft, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import type { PropertyWithDetails } from '@/types/index';
import { getPropertyById } from '@/db/api';
import VerifiedBadge from '@/components/property/VerifiedBadge';
import FavoriteButton from '@/components/property/FavoriteButton';
import ShareButton from '@/components/property/ShareButton';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<PropertyWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error('Failed to load property:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full mb-8 bg-muted" />
          <Skeleton className="h-12 w-3/4 mb-4 bg-muted" />
          <Skeleton className="h-24 w-full bg-muted" />
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
          <Button onClick={() => navigate('/')}>Back to Browse</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const priceDisplay = property.price_to
    ? `₹${property.price_from.toLocaleString()} - ₹${property.price_to.toLocaleString()}`
    : `₹${property.price_from.toLocaleString()}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Image Gallery */}
          {property.images.length > 0 && (
            <div className="mb-8">
              <Carousel className="w-full">
                <CarouselContent>
                  {property.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative h-96 xl:h-[500px] rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`${property.name} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {property.images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </>
                )}
              </Carousel>
            </div>
          )}

          {/* Property Header */}
          <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-4 mb-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-3xl xl:text-4xl font-bold">{property.name}</h1>
                <VerifiedBadge verified={property.verified} />
                <Badge variant="secondary">{property.type}</Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="h-5 w-5" />
                <span>{property.address}</span>
              </div>
              <div className="flex items-center gap-2 text-2xl xl:text-3xl font-bold text-primary">
                <IndianRupee className="h-7 w-7" />
                <span>{priceDisplay}</span>
                <span className="text-base font-normal text-muted-foreground">/month</span>
              </div>
            </div>
            <div className="flex gap-3">
              <FavoriteButton
                propertyId={property.id}
                isFavorite={property.is_favorite || false}
                onToggle={() => loadProperty(property.id)}
              />
              <ShareButton propertyId={property.id} propertyName={property.name} />
            </div>
          </div>

          <Separator className="my-6" />

          {/* Description */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>About this property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
            </CardContent>
          </Card>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                  {property.amenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center gap-2">
                      <span className="text-2xl">{amenity.amenity_icon}</span>
                      <span>{amenity.amenity_name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Room Details */}
          {property.rooms && property.rooms.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Room Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {property.rooms.map((room) => (
                    <div key={room.id} className="border border-border rounded-lg p-4">
                      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{room.room_type}</h3>
                          {room.description && (
                            <p className="text-muted-foreground mb-3">{room.description}</p>
                          )}
                          <div className="flex items-center gap-2 text-xl font-bold text-primary">
                            <IndianRupee className="h-5 w-5" />
                            <span>₹{room.price.toLocaleString()}</span>
                            <span className="text-sm font-normal text-muted-foreground">/month</span>
                          </div>
                        </div>
                        <Badge variant={room.available ? 'default' : 'secondary'}>
                          {room.available ? 'Available' : 'Not Available'}
                        </Badge>
                      </div>

                      {room.images.length > 0 && (
                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
                          {room.images.map((image, idx) => (
                            <div key={idx} className="relative h-32 rounded-lg overflow-hidden">
                              <img
                                src={image}
                                alt={`${room.room_type} - Image ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {room.specifications && Object.keys(room.specifications).length > 0 && (
                        <div className="bg-muted/50 rounded-lg p-4">
                          <h4 className="font-semibold mb-3">Specifications</h4>
                          <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 text-sm">
                            {Object.entries(room.specifications).map(([key, value]) => (
                              <div key={key}>
                                <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}: </span>
                                <span className="font-medium">
                                  {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                                </span>
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
          )}

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {property.owner_name && (
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{property.owner_name}</p>
                      {property.owner_details && (
                        <p className="text-sm text-muted-foreground">{property.owner_details}</p>
                      )}
                    </div>
                  </div>
                )}
                {property.contact_phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <a href={`tel:${property.contact_phone}`} className="hover:text-primary transition-colors">
                      {property.contact_phone}
                    </a>
                  </div>
                )}
                {property.contact_email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <a href={`mailto:${property.contact_email}`} className="hover:text-primary transition-colors">
                      {property.contact_email}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
