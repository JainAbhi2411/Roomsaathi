import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface PolicyFormData {
  policy_title: string;
  policy_description: string;
  policy_icon: string;
  display_order: number;
}

interface PoliciesFormSectionProps {
  policies: PolicyFormData[];
  onChange: (policies: PolicyFormData[]) => void;
}

const commonPolicyIcons = [
  'Clock', 'Users', 'CreditCard', 'Shield', 'Ban', 'CheckCircle',
  'AlertCircle', 'Info', 'FileText', 'Key', 'Home', 'Calendar'
];

export default function PoliciesFormSection({ policies, onChange }: PoliciesFormSectionProps) {
  const addPolicy = () => {
    onChange([...policies, {
      policy_title: '',
      policy_description: '',
      policy_icon: 'FileText',
      display_order: policies.length + 1
    }]);
  };

  const removePolicy = (index: number) => {
    const updatedPolicies = policies
      .filter((_, i) => i !== index)
      .map((policy, i) => ({ ...policy, display_order: i + 1 }));
    onChange(updatedPolicies);
  };

  const updatePolicy = (index: number, field: keyof PolicyFormData, value: string | number) => {
    const updatedPolicies = policies.map((policy, i) => 
      i === index ? { ...policy, [field]: value } : policy
    );
    onChange(updatedPolicies);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Property Policies</h3>
          <p className="text-sm text-muted-foreground">Define rules and policies for this property</p>
        </div>
        <Button type="button" onClick={addPolicy} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Policy
        </Button>
      </div>

      {policies.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No policies added yet. Click "Add Policy" to create property policies.
          </CardContent>
        </Card>
      )}

      {policies.map((policy, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base">Policy {index + 1}</CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removePolicy(index)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Policy Title</Label>
                <Input
                  value={policy.policy_title}
                  onChange={(e) => updatePolicy(index, 'policy_title', e.target.value)}
                  placeholder="e.g., Check-in & Check-out"
                />
              </div>

              <div className="space-y-2">
                <Label>Icon</Label>
                <Select
                  value={policy.policy_icon}
                  onValueChange={(value) => updatePolicy(index, 'policy_icon', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {commonPolicyIcons.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Policy Description</Label>
              <Textarea
                value={policy.policy_description}
                onChange={(e) => updatePolicy(index, 'policy_description', e.target.value)}
                placeholder="Describe the policy in detail..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
