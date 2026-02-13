import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight, Check, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  createProperty, 
  updateProperty,
  bulkCreateAmenities,
  bulkDeleteAmenities,
  bulkCreatePropertyPolicies,
  bulkDeletePropertyPolicies
} from '@/db/adminApi';
import type { Property } from '@/types/index';
import AdvancedPropertyForm from '@/components/admin/AdvancedPropertyForm';
import AmenitiesStep from '@/components/admin/property-form/AmenitiesStep';
import PoliciesStep from '@/components/admin/property-form/PoliciesStep';

interface PropertyFormWizardProps {
  property?: Property | null;
  onCancel: () => void;
}

interface Amenity {
  amenity_name: string;
  amenity_icon: string;
}

interface Policy {
  policy_title: string;
  policy_description: string;
  policy_icon: string;
  display_order: number;
}

const STEPS = [
  { id: 1, name: 'Property Details', description: 'Basic information and type-specific fields' },
  { id: 2, name: 'Amenities', description: 'Add property amenities' },
  { id: 3, name: 'Policies', description: 'Define property rules and policies' },
];

export default function PropertyFormWizard({ property, onCancel }: PropertyFormWizardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!property;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [propertyData, setPropertyData] = useState<any>(null);
  const [createdPropertyId, setCreatedPropertyId] = useState<string | null>(property?.id || null);
  
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);

  // Load existing amenities and policies if editing
  useEffect(() => {
    if (property?.id) {
      loadExistingData(property.id);
    }
  }, [property?.id]);

  const loadExistingData = async (propertyId: string) => {
    try {
      // Dynamically import to avoid circular dependencies
      const adminApi = await import('@/db/adminApi');
      
      // Load amenities
      const amenitiesData = await adminApi.getPropertyAmenities(propertyId);
      if (amenitiesData && amenitiesData.length > 0) {
        setAmenities(amenitiesData.map(a => ({
          amenity_name: a.amenity_name,
          amenity_icon: a.amenity_icon
        })));
      }

      // Load policies
      const policiesData = await adminApi.getPropertyPolicies(propertyId);
      if (policiesData && policiesData.length > 0) {
        setPolicies(policiesData.map(p => ({
          policy_title: p.policy_title,
          policy_description: p.policy_description,
          policy_icon: p.policy_icon || '📋',
          display_order: p.display_order || 0
        })));
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
    }
  };

  const handlePropertySave = async (data: any) => {
    setPropertyData(data);
    
    // If editing, save immediately and move to next step
    if (isEdit && property?.id) {
      try {
        setIsSaving(true);
        const result = await updateProperty(property.id, data);
        if (!result.success) {
          throw new Error(result.error);
        }
        setCreatedPropertyId(property.id);
        toast({
          title: 'Success',
          description: 'Property details updated successfully'
        });
        setCurrentStep(2);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to update property',
          variant: 'destructive'
        });
      } finally {
        setIsSaving(false);
      }
      return;
    }

    // If creating new, create property first
    try {
      setIsSaving(true);
      const result = await createProperty(data);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to create property');
      }
      
      setCreatedPropertyId(result.data.id);
      toast({
        title: 'Success',
        description: 'Property created successfully. Now add amenities and policies.'
      });
      setCurrentStep(2);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create property',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAmenitiesNext = async () => {
    if (!createdPropertyId) {
      toast({
        title: 'Error',
        description: 'Property must be created first',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSaving(true);

      // Delete existing amenities
      await bulkDeleteAmenities(createdPropertyId);

      // Create new amenities
      if (amenities.length > 0) {
        const amenitiesWithPropertyId = amenities.map(a => ({
          property_id: createdPropertyId,
          amenity_name: a.amenity_name,
          amenity_icon: a.amenity_icon
        }));
        
        const result = await bulkCreateAmenities(amenitiesWithPropertyId);
        if (!result.success) {
          throw new Error(result.error);
        }
      }

      toast({
        title: 'Success',
        description: 'Amenities saved successfully'
      });
      setCurrentStep(3);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save amenities',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePoliciesFinish = async () => {
    if (!createdPropertyId) {
      toast({
        title: 'Error',
        description: 'Property must be created first',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSaving(true);

      // Delete existing policies
      await bulkDeletePropertyPolicies(createdPropertyId);

      // Create new policies
      if (policies.length > 0) {
        const policiesWithPropertyId = policies.map(p => ({
          property_id: createdPropertyId,
          policy_title: p.policy_title,
          policy_description: p.policy_description,
          policy_icon: p.policy_icon,
          display_order: p.display_order
        }));
        
        const result = await bulkCreatePropertyPolicies(policiesWithPropertyId);
        if (!result.success) {
          throw new Error(result.error);
        }
      }

      toast({
        title: 'Success',
        description: isEdit 
          ? 'Property updated successfully with amenities and policies' 
          : 'Property created successfully with amenities and policies'
      });

      // Navigate to room management if property has rooms
      if (propertyData?.total_rooms && propertyData.total_rooms > 0) {
        toast({
          title: 'Next Step',
          description: 'Now add rooms to your property',
          duration: 3000
        });
        setTimeout(() => {
          navigate(`/admin/properties/${createdPropertyId}/rooms`);
        }, 1000);
      } else {
        navigate('/admin/properties');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save policies',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onCancel} disabled={isSaving}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {isEdit ? 'Edit Property' : 'Add New Property'}
          </h1>
          <p className="text-muted-foreground">
            {STEPS[currentStep - 1].description}
          </p>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                        currentStep > step.id
                          ? 'bg-primary text-primary-foreground'
                          : currentStep === step.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-sm font-medium">{step.name}</div>
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-24 h-1 mx-2 transition-colors ${
                        currentStep > step.id ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {currentStep === 1 && (
            <AdvancedPropertyForm
              property={property}
              onSave={handlePropertySave}
              onCancel={onCancel}
              hideButtons={true}
            />
          )}

          {currentStep === 2 && (
            <AmenitiesStep
              amenities={amenities}
              onChange={setAmenities}
            />
          )}

          {currentStep === 3 && (
            <PoliciesStep
              policies={policies}
              onChange={setPolicies}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                if (currentStep === 1) {
                  onCancel();
                } else {
                  setCurrentStep(currentStep - 1);
                }
              }}
              disabled={isSaving}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </Button>

            {currentStep === 1 && (
              <Button
                onClick={() => {
                  // Trigger form submission
                  const form = document.querySelector('form');
                  if (form) {
                    form.requestSubmit();
                  }
                }}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save & Continue'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}

            {currentStep === 2 && (
              <Button onClick={handleAmenitiesNext} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save & Continue'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}

            {currentStep === 3 && (
              <Button onClick={handlePoliciesFinish} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Finish'}
                <Save className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
