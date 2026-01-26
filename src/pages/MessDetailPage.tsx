import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMessCenterById, validateCoupon, createMessBooking, getActiveCoupons } from '@/db/api';
import type { MessCenter, MessCoupon } from '@/types/index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Utensils, MapPin, Star, Clock, Phone, Mail, CheckCircle2, Tag, Calendar, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function MessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messCenter, setMessCenter] = useState<MessCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<MessCoupon[]>([]);
  const [showCoupons, setShowCoupons] = useState(false);

  // Booking form state
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_phone: '',
    meal_plan: '',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    coupon_code: ''
  });
  const [couponApplied, setCouponApplied] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadMessCenter();
    }
  }, [id]);

  const loadMessCenter = async () => {
    try {
      setLoading(true);
      const data = await getMessCenterById(id!);
      setMessCenter(data);
      if (data) {
        const coupons = await getActiveCoupons(data.city);
        setAvailableCoupons(coupons);
      }
    } catch (error) {
      console.error('Error loading mess center:', error);
      toast({
        title: 'Error',
        description: 'Failed to load mess center details',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAmount = () => {
    if (!messCenter || !formData.meal_plan) return 0;
    return messCenter.pricing[formData.meal_plan as keyof typeof messCenter.pricing] || 0;
  };

  const handleApplyCoupon = async () => {
    if (!formData.coupon_code || !messCenter) return;

    try {
      const amount = calculateAmount();
      const result = await validateCoupon(formData.coupon_code, messCenter.id, amount, messCenter.city);
      setCouponApplied(result);
      toast({
        title: 'Coupon Applied!',
        description: `You saved ₹${result.discountAmount.toFixed(2)}`,
      });
    } catch (error: any) {
      toast({
        title: 'Invalid Coupon',
        description: error.message,
        variant: 'destructive'
      });
      setCouponApplied(null);
    }
  };

  const handleSubmitBooking = async () => {
    if (!messCenter) return;

    // Validation
    if (!formData.user_name || !formData.user_phone || !formData.meal_plan) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      setSubmitting(true);
      const totalAmount = calculateAmount();
      const discountAmount = couponApplied?.discountAmount || 0;
      const finalAmount = totalAmount - discountAmount;

      await createMessBooking({
        mess_id: messCenter.id,
        coupon_id: couponApplied?.coupon?.id,
        user_name: formData.user_name,
        user_email: formData.user_email || undefined,
        user_phone: formData.user_phone,
        meal_plan: formData.meal_plan,
        start_date: formData.start_date,
        total_amount: totalAmount,
        discount_amount: discountAmount,
        final_amount: finalAmount
      });

      toast({
        title: 'Booking Successful!',
        description: 'Your mess booking has been submitted. We will contact you shortly.',
      });

      setBookingDialogOpen(false);
      setFormData({
        user_name: '',
        user_email: '',
        user_phone: '',
        meal_plan: '',
        start_date: format(new Date(), 'yyyy-MM-dd'),
        coupon_code: ''
      });
      setCouponApplied(null);
    } catch (error: any) {
      toast({
        title: 'Booking Failed',
        description: error.message || 'Failed to submit booking',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!messCenter) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-12 text-center">
          <Utensils className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Mess Center Not Found</h3>
          <Button onClick={() => navigate('/mess')}>Back to Mess Centers</Button>
        </Card>
      </div>
    );
  }

  const totalAmount = calculateAmount();
  const discountAmount = couponApplied?.discountAmount || 0;
  const finalAmount = totalAmount - discountAmount;

  return (
    <div className="min-h-screen bg-background">
      {/* Promotional Banner on Detail Page */}
      <div className="bg-gradient-to-r from-accent via-accent/90 to-primary text-white py-4 xl:py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Tag className="w-6 h-6 xl:w-8 xl:h-8" />
              <div>
                <p className="font-bold text-base xl:text-lg">💰 Apply Coupon & Save Money!</p>
                <p className="text-sm text-white/90">Get instant discounts on your booking</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-white text-accent px-3 py-1 text-sm font-bold">ROOMSAATHI50</Badge>
              <Badge className="bg-white text-accent px-3 py-1 text-sm font-bold">MESS10</Badge>
              <Badge className="bg-white text-accent px-3 py-1 text-sm font-bold">STUDENT20</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/mess')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Mess Centers
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <Carousel className="w-full">
                <CarouselContent>
                  {messCenter.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative h-96">
                        <img
                          src={image}
                          alt={`${messCenter.name} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {messCenter.verified && index === 0 && (
                          <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground shadow-lg">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            RoomSaathi Verified
                          </Badge>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">{messCenter.name}</CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{messCenter.address}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Star className="w-5 h-5 fill-accent text-accent" />
                      <span className="font-semibold text-lg">{messCenter.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">Rating</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {messCenter.description && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">About</h3>
                    <p className="text-muted-foreground">{messCenter.description}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-lg mb-3">Meal Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {messCenter.meal_types.map((type, i) => (
                      <Badge key={i} variant="secondary" className="text-sm capitalize">
                        <Utensils className="w-3 h-3 mr-1" />
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Pricing</h3>
                  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    {Object.entries(messCenter.pricing).map(([key, value]) => (
                      <Card key={key} className="p-4 text-center">
                        <p className="text-sm text-muted-foreground capitalize mb-1">{key}</p>
                        <p className="text-xl font-bold text-primary">₹{value}</p>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Timings</h3>
                  <div className="space-y-2">
                    {Object.entries(messCenter.timings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="capitalize font-medium">{key}</span>
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {messCenter.amenities.map((amenity, i) => (
                      <Badge key={i} variant="outline" className="text-sm">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-primary" />
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    {messCenter.contact_phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${messCenter.contact_phone}`} className="hover:text-primary">
                          {messCenter.contact_phone}
                        </a>
                      </div>
                    )}
                    {messCenter.contact_email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${messCenter.contact_email}`} className="hover:text-primary">
                          {messCenter.contact_email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            {/* Promotional Card - Enhanced */}
            <Card className="bg-gradient-to-br from-primary via-primary/95 to-accent text-white overflow-hidden border-2 border-accent shadow-2xl">
              <CardContent className="p-6 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/20 rounded-full blur-xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-8 h-8 animate-bounce" />
                    <span className="text-xs font-semibold bg-accent text-accent-foreground px-2 py-1 rounded-full">
                      EXCLUSIVE OFFER
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">🎉 Special Discount!</h3>
                  <p className="text-sm text-white/95 mb-4 leading-relaxed">
                    Book with RoomSaathi and get <span className="font-bold text-accent">exclusive discounts</span> on your mess booking. 
                    Save up to <span className="font-bold text-accent">₹800 per month</span>!
                  </p>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4">
                    <p className="text-xs text-white/80 mb-2">Popular Coupons:</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-accent text-accent-foreground font-mono">ROOMSAATHI50</Badge>
                      <Badge className="bg-accent text-accent-foreground font-mono">MESS10</Badge>
                      <Badge className="bg-accent text-accent-foreground font-mono">STUDENT20</Badge>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full font-bold"
                    onClick={() => setShowCoupons(!showCoupons)}
                  >
                    {showCoupons ? 'Hide Coupons' : 'View All Available Coupons'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Available Coupons */}
            {showCoupons && availableCoupons.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-2 border-accent/30">
                  <CardHeader className="bg-accent/5">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Tag className="w-5 h-5 text-accent" />
                      Available Discount Coupons
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Click to apply coupon</p>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-4">
                    {availableCoupons.map(coupon => (
                      <motion.div
                        key={coupon.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 border-2 border-dashed border-accent/50 rounded-lg cursor-pointer hover:bg-accent/5 hover:border-accent transition-all"
                        onClick={() => {
                          setFormData({ ...formData, coupon_code: coupon.code });
                          setShowCoupons(false);
                          toast({
                            title: 'Coupon Selected',
                            description: `${coupon.code} has been applied to your booking form`,
                          });
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="font-mono text-base px-3 py-1">
                              {coupon.code}
                            </Badge>
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-accent">
                              {coupon.discount_type === 'percentage'
                                ? `${coupon.discount_value}% OFF`
                                : `₹${coupon.discount_value} OFF`}
                            </span>
                            {coupon.max_discount && coupon.discount_type === 'percentage' && (
                              <p className="text-xs text-muted-foreground">Max ₹{coupon.max_discount}</p>
                            )}
                          </div>
                        </div>
                        {coupon.description && (
                          <p className="text-sm text-muted-foreground mb-2">{coupon.description}</p>
                        )}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Min. booking: ₹{coupon.min_booking_amount}</span>
                          {coupon.usage_limit && (
                            <span>{coupon.usage_limit - coupon.used_count} uses left</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Booking Card */}
            <Card>
              <CardHeader>
                <CardTitle>Book This Mess</CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Book {messCenter.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="user_name">Full Name *</Label>
                        <Input
                          id="user_name"
                          value={formData.user_name}
                          onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                          placeholder="Enter your name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="user_phone">Phone Number *</Label>
                        <Input
                          id="user_phone"
                          type="tel"
                          value={formData.user_phone}
                          onChange={(e) => setFormData({ ...formData, user_phone: e.target.value })}
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div>
                        <Label htmlFor="user_email">Email (Optional)</Label>
                        <Input
                          id="user_email"
                          type="email"
                          value={formData.user_email}
                          onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                          placeholder="Enter your email"
                        />
                      </div>

                      <div>
                        <Label htmlFor="meal_plan">Meal Plan *</Label>
                        <Select value={formData.meal_plan} onValueChange={(value) => setFormData({ ...formData, meal_plan: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select meal plan" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(messCenter.pricing).map(([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {key.charAt(0).toUpperCase() + key.slice(1)} - ₹{value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="start_date">Start Date *</Label>
                        <Input
                          id="start_date"
                          type="date"
                          value={formData.start_date}
                          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                          min={format(new Date(), 'yyyy-MM-dd')}
                        />
                      </div>

                      <div>
                        <Label htmlFor="coupon_code">Coupon Code</Label>
                        <div className="flex gap-2">
                          <Input
                            id="coupon_code"
                            value={formData.coupon_code}
                            onChange={(e) => setFormData({ ...formData, coupon_code: e.target.value.toUpperCase() })}
                            placeholder="Enter coupon code"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleApplyCoupon}
                            disabled={!formData.coupon_code || !formData.meal_plan}
                          >
                            Apply
                          </Button>
                        </div>
                        {couponApplied && (
                          <p className="text-sm text-green-600 mt-1">
                            ✓ Coupon applied! You saved ₹{couponApplied.discountAmount.toFixed(2)}
                          </p>
                        )}
                      </div>

                      {formData.meal_plan && (
                        <Card className="bg-muted">
                          <CardContent className="p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Total Amount:</span>
                              <span className="font-semibold">₹{totalAmount}</span>
                            </div>
                            {discountAmount > 0 && (
                              <div className="flex justify-between text-sm text-green-600">
                                <span>Discount:</span>
                                <span className="font-semibold">-₹{discountAmount.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                              <span>Final Amount:</span>
                              <span className="text-primary">₹{finalAmount.toFixed(2)}</span>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <Button
                        className="w-full"
                        onClick={handleSubmitBooking}
                        disabled={submitting || !formData.user_name || !formData.user_phone || !formData.meal_plan}
                      >
                        {submitting ? 'Submitting...' : 'Confirm Booking'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
