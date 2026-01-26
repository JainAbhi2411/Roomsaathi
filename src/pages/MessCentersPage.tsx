import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMessCenters } from '@/db/api';
import type { MessCenter } from '@/types/index';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Utensils, MapPin, Star, Clock, Phone, CheckCircle2, Sparkles, Tag } from 'lucide-react';
import { motion } from 'motion/react';

export default function MessCentersPage() {
  const [messCenters, setMessCenters] = useState<MessCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedLocality, setSelectedLocality] = useState<string>('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    loadMessCenters();
  }, [selectedCity, selectedLocality, verifiedOnly]);

  const loadMessCenters = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (selectedCity && selectedCity !== 'all') filters.city = selectedCity;
      if (selectedLocality && selectedLocality !== 'all') filters.locality = selectedLocality;
      if (verifiedOnly) filters.verified = true;

      const data = await getMessCenters(filters);
      setMessCenters(data);
    } catch (error) {
      console.error('Error loading mess centers:', error);
    } finally {
      setLoading(false);
    }
  };

  const localities = selectedCity && selectedCity !== 'all'
    ? [...new Set(messCenters.filter(m => m.city === selectedCity).map(m => m.locality))]
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Promotional Ad Banner - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary via-primary/90 to-accent text-white py-8 xl:py-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-32 h-32 xl:w-64 xl:h-64 bg-accent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-32 h-32 xl:w-64 xl:h-64 bg-white rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4 xl:gap-6 flex-1">
              <div className="bg-accent/20 p-3 xl:p-4 rounded-full animate-bounce">
                <Sparkles className="w-8 h-8 xl:w-12 xl:h-12 text-accent" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl xl:text-4xl font-bold mb-2 xl:mb-3">🎉 Special Offer for RoomSaathi Users!</h2>
                <p className="text-base xl:text-xl text-white/95 mb-2">
                  Book mess or tiffin service with RoomSaathi and get <span className="font-bold text-accent">exclusive discounts</span>
                </p>
                <p className="text-sm xl:text-base text-white/80">
                  ✓ Up to 20% OFF on monthly plans • ✓ ₹50-100 instant discount • ✓ Special student offers
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 bg-accent text-accent-foreground px-6 xl:px-8 py-3 xl:py-4 rounded-full font-bold shadow-2xl text-lg xl:text-xl">
                <Tag className="w-5 h-5 xl:w-6 xl:h-6" />
                <span>ROOMSAATHI50</span>
              </div>
              <p className="text-center text-sm text-white/90">Use this code to save ₹50!</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Secondary Promotional Strip */}
      <div className="bg-accent/10 border-y border-accent/20 py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 xl:gap-8 text-sm xl:text-base">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span className="font-medium">5+ Active Coupons</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-accent" />
              <span className="font-medium">Save up to ₹800/month</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="font-medium">Limited Time Offers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-6 xl:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-2xl xl:text-4xl font-bold mb-2 gradient-text">
              Mess & Tiffin Centers
            </h1>
            <p className="text-sm xl:text-base text-muted-foreground">
              Find the best mess and tiffin services near you with exclusive RoomSaathi discounts
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-4 xl:py-6" data-filters>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="Sikar">Sikar</SelectItem>
                  <SelectItem value="Jaipur">Jaipur</SelectItem>
                  <SelectItem value="Kota">Kota</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLocality} onValueChange={setSelectedLocality} disabled={!selectedCity || selectedCity === 'all'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Locality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Localities</SelectItem>
                  {localities.map(locality => (
                    <SelectItem key={locality} value={locality}>
                      {locality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant={verifiedOnly ? 'default' : 'outline'}
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className="w-full"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                RoomSaathi Verified
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCity('all');
                  setSelectedLocality('all');
                  setVerifiedOnly(false);
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mess Centers Grid */}
      <div className="container mx-auto px-4 pb-12">
        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-muted animate-pulse" />
                <CardContent className="p-6 space-y-3">
                  <div className="h-6 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : messCenters.length === 0 ? (
          <Card className="p-12 text-center">
            <Utensils className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Mess Centers Found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters to see more results
            </p>
            <Button onClick={() => {
              setSelectedCity('all');
              setSelectedLocality('all');
              setVerifiedOnly(false);
            }}>
              Clear All Filters
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {messCenters.map((mess, index) => (
              <motion.div
                key={mess.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/mess/${mess.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={mess.images[0] || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800'}
                        alt={mess.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {mess.verified && (
                        <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground shadow-lg">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full text-sm">
                        <Star className="w-3 h-3 fill-accent text-accent" />
                        <span className="font-semibold">{mess.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {mess.name}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{mess.locality}, {mess.city}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Utensils className="w-4 h-4 shrink-0" />
                          <span>{mess.meal_types.join(', ')}</span>
                        </div>

                        {mess.pricing.monthly && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 shrink-0 text-muted-foreground" />
                            <span className="font-semibold text-primary">
                              ₹{mess.pricing.monthly}/month
                            </span>
                          </div>
                        )}

                        {mess.contact_phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4 shrink-0" />
                            <span>{mess.contact_phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {mess.amenities.slice(0, 3).map((amenity, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {mess.amenities.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{mess.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        View Details & Book
                      </Button>

                      {/* Coupon Badge */}
                      <div className="mt-3 p-2 bg-accent/10 border border-accent/30 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground mb-1">Use coupon code</p>
                        <Badge className="bg-accent text-accent-foreground font-mono">
                          ROOMSAATHI50
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Coupon Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button
          size="lg"
          className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-2xl rounded-full px-6 py-6 flex items-center gap-3 animate-pulse"
          onClick={() => {
            const filterSection = document.querySelector('[data-filters]');
            filterSection?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <Tag className="w-5 h-5" />
          <div className="text-left">
            <div className="font-bold text-sm">View Coupons</div>
            <div className="text-xs opacity-90">Save up to ₹800</div>
          </div>
        </Button>
      </motion.div>
    </div>
  );
}
