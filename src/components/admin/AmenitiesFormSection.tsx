import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface AmenityFormData {
  amenity_name: string;
  amenity_icon: string;
}

interface AmenitiesFormSectionProps {
  amenities: AmenityFormData[];
  onChange: (amenities: AmenityFormData[]) => void;
}

const commonIcons = [
  'Wifi', 'Car', 'Utensils', 'Tv', 'Dumbbell', 'Shield', 'Zap', 'Droplet',
  'Wind', 'Sofa', 'Bed', 'Bath', 'Home', 'Building', 'Trees', 'Sun'
];

export default function AmenitiesFormSection({ amenities, onChange }: AmenitiesFormSectionProps) {
  const addAmenity = () => {
    onChange([...amenities, { amenity_name: '', amenity_icon: 'Home' }]);
  };

  const removeAmenity = (index: number) => {
    onChange(amenities.filter((_, i) => i !== index));
  };

  const updateAmenity = (index: number, field: keyof AmenityFormData, value: string) => {
    const updatedAmenities = amenities.map((amenity, i) => 
      i === index ? { ...amenity, [field]: value } : amenity
    );
    onChange(updatedAmenities);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Property Amenities</h3>
          <p className="text-sm text-muted-foreground">Add amenities available at the property</p>
        </div>
        <Button type="button" onClick={addAmenity} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Amenity
        </Button>
      </div>

      {amenities.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No amenities added yet. Click "Add Amenity" to add property amenities.
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {amenities.map((amenity, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <div className="flex-1 space-y-3">
                  <div className="space-y-2">
                    <Label>Amenity Name</Label>
                    <Input
                      value={amenity.amenity_name}
                      onChange={(e) => updateAmenity(index, 'amenity_name', e.target.value)}
                      placeholder="e.g., WiFi, Parking"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Select
                      value={amenity.amenity_icon}
                      onValueChange={(value) => updateAmenity(index, 'amenity_icon', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {commonIcons.map((icon) => (
                          <SelectItem key={icon} value={icon}>
                            {icon}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAmenity(index)}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
