import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useToast } from '@/hooks/use-toast';
import { getAllPropertiesAdmin } from '@/db/adminApi';
import type { Property } from '@/types/index';
import PropertyFormWizard from '@/components/admin/PropertyFormWizard';

export default function PropertyForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEdit = !!id;

  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      loadProperty();
    }
  }, [id, isEdit]);

  const loadProperty = async () => {
    setIsLoading(true);
    try {
      const properties = await getAllPropertiesAdmin();
      const foundProperty = properties.find(p => p.id === id);
      if (foundProperty) {
        setProperty(foundProperty);
      } else {
        toast({
          title: 'Error',
          description: 'Property not found',
          variant: 'destructive'
        });
        navigate('/admin/properties');
      }
    } catch (error) {
      console.error('Error loading property:', error);
      toast({
        title: 'Error',
        description: 'Failed to load property',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/properties');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading property...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <PropertyFormWizard
        property={property}
        onCancel={handleCancel}
      />
    </div>
  );
}
