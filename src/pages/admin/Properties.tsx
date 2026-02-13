import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, MapPin, IndianRupee, Eye, EyeOff, DoorOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { getAllPropertiesAdmin, deleteProperty, updateProperty } from '@/db/adminApi';
import { supabase } from '@/db/supabase';
import type { Property } from '@/types/index';
import { useToast } from '@/hooks/use-toast';

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProperties();

    // Set up real-time subscription for properties table
    const channel = supabase
      .channel('admin-properties-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => {
        loadProperties();
      })
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadProperties = async () => {
    setIsLoading(true);
    const data = await getAllPropertiesAdmin();
    setProperties(data);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteProperty(id);
    if (result.success) {
      toast({
        title: 'Success',
        description: 'Property deleted successfully'
      });
      loadProperties();
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to delete property',
        variant: 'destructive'
      });
    }
  };

  const handlePublishToggle = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    console.log('Toggling publish status:', { id, currentStatus, newStatus });
    
    // Optimistically update UI
    setProperties(prev => 
      prev.map(p => p.id === id ? { ...p, published: newStatus } as Property : p)
    );
    
    try {
      const result = await updateProperty(id, { published: newStatus } as any);
      
      if (result.success) {
        toast({
          title: 'Success',
          description: `Property ${newStatus ? 'published' : 'unpublished'} successfully`
        });
        // Reload to ensure consistency
        await loadProperties();
      } else {
        // Revert optimistic update on error
        setProperties(prev => 
          prev.map(p => p.id === id ? { ...p, published: currentStatus } as Property : p)
        );
        toast({
          title: 'Error',
          description: result.error || 'Failed to update property',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      // Revert optimistic update on error
      setProperties(prev => 
        prev.map(p => p.id === id ? { ...p, published: currentStatus } as Property : p)
      );
      toast({
        title: 'Error',
        description: error.message || 'Failed to update property',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Properties</h1>
          <p className="text-muted-foreground">Manage all property listings</p>
        </div>
        <Link to="/admin/properties/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </Link>
      </div>

      {/* Properties Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted" />
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No properties found</p>
            <Link to="/admin/properties/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Property
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Property Image */}
                <div className="relative h-48 bg-muted">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Eye className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-foreground line-clamp-1 flex-1">
                      {property.name}
                    </h3>
                    <div className="flex items-center gap-2 ml-2">
                      {(property as any).published ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Switch
                        checked={(property as any).published || false}
                        onCheckedChange={() => handlePublishToggle(property.id, (property as any).published || false)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{property.locality}, {property.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <IndianRupee className="h-4 w-4" />
                      <span>₹{property.price_from.toLocaleString()}/month</span>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{property.type}</Badge>
                      {property.verified && (
                        <Badge className="bg-green-500">Verified</Badge>
                      )}
                      {(property as any).published ? (
                        <Badge className="bg-blue-500">Published</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/admin/properties/edit/${property.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Link to={`/admin/properties/${property.id}/rooms`}>
                      <Button variant="outline" size="sm">
                        <DoorOpen className="h-4 w-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Property</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{property.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(property.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
