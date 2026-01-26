import { useState, useEffect } from 'react';
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/db/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tag, Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const CITIES = ['Sikar', 'Jaipur', 'Kota'];

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: 0,
    min_booking_amount: 0,
    max_discount: 0,
    valid_from: format(new Date(), 'yyyy-MM-dd'),
    valid_to: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    usage_limit: 100,
    active: true,
    applicable_cities: [] as string[]
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await getAllCoupons();
      setCoupons(data);
    } catch (error) {
      console.error('Error loading coupons:', error);
      toast({
        title: 'Error',
        description: 'Failed to load coupons',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_booking_amount: 0,
      max_discount: 0,
      valid_from: format(new Date(), 'yyyy-MM-dd'),
      valid_to: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      usage_limit: 100,
      active: true,
      applicable_cities: []
    });
    setEditingCoupon(null);
  };

  const handleEdit = (coupon: any) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_booking_amount: coupon.min_booking_amount || 0,
      max_discount: coupon.max_discount || 0,
      valid_from: format(new Date(coupon.valid_from), 'yyyy-MM-dd'),
      valid_to: format(new Date(coupon.valid_to), 'yyyy-MM-dd'),
      usage_limit: coupon.usage_limit || 0,
      active: coupon.active,
      applicable_cities: coupon.applicable_cities || []
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || formData.discount_value <= 0) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      const couponData = {
        ...formData,
        code: formData.code.toUpperCase(),
        max_discount: formData.max_discount || null,
        usage_limit: formData.usage_limit || null
      };

      const result = editingCoupon
        ? await updateCoupon(editingCoupon.id, couponData)
        : await createCoupon(couponData);

      if (result.success) {
        toast({
          title: 'Success',
          description: `Coupon ${editingCoupon ? 'updated' : 'created'} successfully`
        });
        setDialogOpen(false);
        resetForm();
        loadCoupons();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${editingCoupon ? 'update' : 'create'} coupon`,
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteCoupon(id);
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Coupon deleted successfully'
        });
        loadCoupons();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete coupon',
        variant: 'destructive'
      });
    }
  };

  const handleCityToggle = (city: string) => {
    if (formData.applicable_cities.includes(city)) {
      setFormData({
        ...formData,
        applicable_cities: formData.applicable_cities.filter(c => c !== city)
      });
    } else {
      setFormData({
        ...formData,
        applicable_cities: [...formData.applicable_cities, city]
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Discount Coupons</h1>
          <p className="text-muted-foreground">Manage mess booking discount coupons</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCoupon ? 'Edit' : 'Create'} Coupon</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Coupon Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="ROOMSAATHI50"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="discount_type">Discount Type *</Label>
                  <Select value={formData.discount_type} onValueChange={(value) => setFormData({ ...formData, discount_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter coupon description"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount_value">
                    Discount Value * {formData.discount_type === 'percentage' ? '(%)' : '(₹)'}
                  </Label>
                  <Input
                    id="discount_value"
                    type="number"
                    step="0.01"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="min_booking_amount">Min Booking Amount (₹)</Label>
                  <Input
                    id="min_booking_amount"
                    type="number"
                    value={formData.min_booking_amount}
                    onChange={(e) => setFormData({ ...formData, min_booking_amount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max_discount">Max Discount (₹) - Optional</Label>
                  <Input
                    id="max_discount"
                    type="number"
                    value={formData.max_discount}
                    onChange={(e) => setFormData({ ...formData, max_discount: parseFloat(e.target.value) || 0 })}
                    placeholder="Leave 0 for no limit"
                  />
                </div>

                <div>
                  <Label htmlFor="usage_limit">Usage Limit - Optional</Label>
                  <Input
                    id="usage_limit"
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: parseInt(e.target.value) || 0 })}
                    placeholder="Leave 0 for unlimited"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="valid_from">Valid From *</Label>
                  <Input
                    id="valid_from"
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="valid_to">Valid To *</Label>
                  <Input
                    id="valid_to"
                    type="date"
                    value={formData.valid_to}
                    onChange={(e) => setFormData({ ...formData, valid_to: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Applicable Cities</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {CITIES.map(city => (
                    <div key={city} className="flex items-center space-x-2">
                      <Checkbox
                        id={`city-${city}`}
                        checked={formData.applicable_cities.includes(city)}
                        onCheckedChange={() => handleCityToggle(city)}
                      />
                      <label htmlFor={`city-${city}`} className="text-sm cursor-pointer">
                        {city}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Leave unchecked to apply to all cities
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked as boolean })}
                />
                <label htmlFor="active" className="text-sm font-medium cursor-pointer">
                  Active
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingCoupon ? 'Update' : 'Create'} Coupon
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No coupons found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Min Amount</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Valid Period</TableHead>
                    <TableHead>Cities</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {coupon.code}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-primary">
                          {coupon.discount_type === 'percentage'
                            ? `${coupon.discount_value}%`
                            : `₹${coupon.discount_value}`}
                        </span>
                        {coupon.max_discount > 0 && (
                          <span className="text-xs text-muted-foreground ml-1">
                            (max ₹{coupon.max_discount})
                          </span>
                        )}
                      </TableCell>
                      <TableCell>₹{coupon.min_booking_amount || 0}</TableCell>
                      <TableCell>
                        <span className={coupon.usage_limit && coupon.used_count >= coupon.usage_limit ? 'text-destructive' : ''}>
                          {coupon.used_count || 0}
                          {coupon.usage_limit ? ` / ${coupon.usage_limit}` : ' / ∞'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {format(new Date(coupon.valid_from), 'MMM dd')} - {format(new Date(coupon.valid_to), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {coupon.applicable_cities && coupon.applicable_cities.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {coupon.applicable_cities.map((city: string) => (
                              <Badge key={city} variant="outline" className="text-xs">
                                {city}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">All Cities</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {coupon.active ? (
                          <Badge className="bg-green-500">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(coupon)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete coupon "{coupon.code}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(coupon.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Coupons</p>
              <p className="text-2xl font-bold">{coupons.length}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Active Coupons</p>
              <p className="text-2xl font-bold text-green-600">
                {coupons.filter(c => c.active).length}
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Usage</p>
              <p className="text-2xl font-bold">
                {coupons.reduce((acc, c) => acc + (c.used_count || 0), 0)}
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Expired</p>
              <p className="text-2xl font-bold text-orange-600">
                {coupons.filter(c => new Date(c.valid_to) < new Date()).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
