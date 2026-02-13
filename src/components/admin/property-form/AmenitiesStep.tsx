import { useState } from 'react';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Amenity {
  amenity_name: string;
  amenity_icon: string;
}

interface AmenitiesStepProps {
  amenities: Amenity[];
  onChange: (amenities: Amenity[]) => void;
}

const COMMON_AMENITIES = [
  { name: 'WiFi', icon: '📶' },
  { name: 'AC', icon: '❄️' },
  { name: 'TV', icon: '📺' },
  { name: 'Parking', icon: '🅿️' },
  { name: 'Gym', icon: '💪' },
  { name: 'Swimming Pool', icon: '🏊' },
  { name: 'Security', icon: '🔒' },
  { name: 'Power Backup', icon: '⚡' },
  { name: 'Lift', icon: '🛗' },
  { name: 'Water Supply', icon: '💧' },
  { name: 'Laundry', icon: '🧺' },
  { name: 'Kitchen', icon: '🍳' },
  { name: 'Refrigerator', icon: '🧊' },
  { name: 'Microwave', icon: '📻' },
  { name: 'Washing Machine', icon: '🌀' },
  { name: 'Geyser', icon: '🔥' },
  { name: 'Bed', icon: '🛏️' },
  { name: 'Wardrobe', icon: '👔' },
  { name: 'Study Table', icon: '📚' },
  { name: 'Chair', icon: '🪑' },
  { name: 'Fan', icon: '🌀' },
  { name: 'Light', icon: '💡' },
  { name: 'Balcony', icon: '🏞️' },
  { name: 'Garden', icon: '🌳' },
  { name: 'CCTV', icon: '📹' },
  { name: 'Fire Safety', icon: '🧯' },
  { name: 'Intercom', icon: '📞' },
  { name: 'Housekeeping', icon: '🧹' },
  { name: 'Meals', icon: '🍽️' },
  { name: 'RO Water', icon: '💧' }
];

export default function AmenitiesStep({ amenities, onChange }: AmenitiesStepProps) {
  const [customAmenity, setCustomAmenity] = useState({ name: '', icon: '' });

  const addAmenity = (name: string, icon: string) => {
    if (name.trim() && !amenities.some(a => a.amenity_name === name)) {
      onChange([...amenities, { amenity_name: name, amenity_icon: icon }]);
    }
  };

  const removeAmenity = (index: number) => {
    onChange(amenities.filter((_, i) => i !== index));
  };

  const addCustomAmenity = () => {
    if (customAmenity.name.trim()) {
      addAmenity(customAmenity.name, customAmenity.icon || '✨');
      setCustomAmenity({ name: '', icon: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Property Amenities</h3>
        <p className="text-sm text-muted-foreground">
          Select amenities available at this property. These will be stored in the amenities table.
        </p>
      </div>

      {/* Quick Add Common Amenities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Add Common Amenities</CardTitle>
          <CardDescription>Click to add popular amenities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {COMMON_AMENITIES.map((amenity) => {
              const isAdded = amenities.some(a => a.amenity_name === amenity.name);
              return (
                <Button
                  key={amenity.name}
                  type="button"
                  variant={isAdded ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => {
                    if (isAdded) {
                      const index = amenities.findIndex(a => a.amenity_name === amenity.name);
                      removeAmenity(index);
                    } else {
                      addAmenity(amenity.name, amenity.icon);
                    }
                  }}
                  className="gap-2"
                >
                  <span>{amenity.icon}</span>
                  <span>{amenity.name}</span>
                  {isAdded && <span className="text-xs">✓</span>}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custom Amenity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Custom Amenity</CardTitle>
          <CardDescription>Add amenities not in the list above</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="custom-amenity-name">Amenity Name</Label>
              <Input
                id="custom-amenity-name"
                placeholder="e.g., Rooftop Access"
                value={customAmenity.name}
                onChange={(e) => setCustomAmenity({ ...customAmenity, name: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomAmenity();
                  }
                }}
              />
            </div>
            <div className="w-32">
              <Label htmlFor="custom-amenity-icon">Icon (Emoji)</Label>
              <Input
                id="custom-amenity-icon"
                placeholder="🏠"
                value={customAmenity.icon}
                onChange={(e) => setCustomAmenity({ ...customAmenity, icon: e.target.value })}
                maxLength={2}
              />
            </div>
            <div className="flex items-end">
              <Button type="button" onClick={addCustomAmenity}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Amenities */}
      {amenities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Selected Amenities ({amenities.length})</CardTitle>
            <CardDescription>These amenities will be added to the database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{amenity.amenity_icon}</span>
                    <span className="font-medium">{amenity.amenity_name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAmenity(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {amenities.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No amenities added yet. Select from common amenities or add custom ones.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
