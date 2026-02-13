import { useState } from 'react';
import { Plus, Trash2, GripVertical, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Policy {
  policy_title: string;
  policy_description: string;
  policy_icon: string;
  display_order: number;
}

interface PoliciesStepProps {
  policies: Policy[];
  onChange: (policies: Policy[]) => void;
}

const COMMON_POLICIES = [
  {
    title: 'No Smoking',
    description: 'Smoking is strictly prohibited inside the property premises.',
    icon: '🚭'
  },
  {
    title: 'No Pets',
    description: 'Pets are not allowed in the property.',
    icon: '🐾'
  },
  {
    title: 'Visitor Policy',
    description: 'Visitors are allowed between 9 AM to 9 PM with prior intimation.',
    icon: '👥'
  },
  {
    title: 'Noise Policy',
    description: 'Maintain silence after 10 PM to respect other residents.',
    icon: '🔇'
  },
  {
    title: 'Security Deposit',
    description: 'Refundable security deposit required at the time of check-in.',
    icon: '💰'
  },
  {
    title: 'Notice Period',
    description: 'One month notice period required before vacating.',
    icon: '📅'
  },
  {
    title: 'ID Proof Required',
    description: 'Valid government ID proof mandatory for registration.',
    icon: '🆔'
  },
  {
    title: 'Maintenance',
    description: 'Monthly maintenance charges applicable as per agreement.',
    icon: '🔧'
  }
];

export default function PoliciesStep({ policies, onChange }: PoliciesStepProps) {
  const [customPolicy, setCustomPolicy] = useState({
    title: '',
    description: '',
    icon: ''
  });

  const addPolicy = (title: string, description: string, icon: string) => {
    if (title.trim() && description.trim()) {
      const newPolicy: Policy = {
        policy_title: title,
        policy_description: description,
        policy_icon: icon || '📋',
        display_order: policies.length
      };
      onChange([...policies, newPolicy]);
    }
  };

  const removePolicy = (index: number) => {
    const updatedPolicies = policies.filter((_, i) => i !== index);
    // Reorder display_order
    const reorderedPolicies = updatedPolicies.map((policy, i) => ({
      ...policy,
      display_order: i
    }));
    onChange(reorderedPolicies);
  };

  const movePolicy = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === policies.length - 1)
    ) {
      return;
    }

    const newPolicies = [...policies];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newPolicies[index], newPolicies[targetIndex]] = [newPolicies[targetIndex], newPolicies[index]];
    
    // Update display_order
    const reorderedPolicies = newPolicies.map((policy, i) => ({
      ...policy,
      display_order: i
    }));
    onChange(reorderedPolicies);
  };

  const addCustomPolicy = () => {
    if (customPolicy.title.trim() && customPolicy.description.trim()) {
      addPolicy(customPolicy.title, customPolicy.description, customPolicy.icon);
      setCustomPolicy({ title: '', description: '', icon: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Property Policies</h3>
        <p className="text-sm text-muted-foreground">
          Define rules and policies for this property. These will be stored in the property_policies table.
        </p>
      </div>

      {/* Quick Add Common Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Add Common Policies</CardTitle>
          <CardDescription>Click to add standard property policies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {COMMON_POLICIES.map((policy, index) => {
              const isAdded = policies.some(p => p.policy_title === policy.title);
              return (
                <Button
                  key={index}
                  type="button"
                  variant={isAdded ? 'secondary' : 'outline'}
                  className="justify-start h-auto py-3 px-4"
                  onClick={() => {
                    if (isAdded) {
                      const policyIndex = policies.findIndex(p => p.policy_title === policy.title);
                      removePolicy(policyIndex);
                    } else {
                      addPolicy(policy.title, policy.description, policy.icon);
                    }
                  }}
                >
                  <div className="flex items-start gap-3 text-left w-full">
                    <span className="text-2xl flex-shrink-0">{policy.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold flex items-center gap-2">
                        {policy.title}
                        {isAdded && <span className="text-xs">✓</span>}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {policy.description}
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custom Policy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Custom Policy</CardTitle>
          <CardDescription>Add specific policies for your property</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <Label htmlFor="policy-title">Policy Title *</Label>
              <Input
                id="policy-title"
                placeholder="e.g., Parking Rules"
                value={customPolicy.title}
                onChange={(e) => setCustomPolicy({ ...customPolicy, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="policy-icon">Icon (Emoji)</Label>
              <Input
                id="policy-icon"
                placeholder="🅿️"
                value={customPolicy.icon}
                onChange={(e) => setCustomPolicy({ ...customPolicy, icon: e.target.value })}
                maxLength={2}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="policy-description">Policy Description *</Label>
            <Textarea
              id="policy-description"
              placeholder="Describe the policy in detail..."
              value={customPolicy.description}
              onChange={(e) => setCustomPolicy({ ...customPolicy, description: e.target.value })}
              rows={3}
            />
          </div>
          <Button type="button" onClick={addCustomPolicy} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Policy
          </Button>
        </CardContent>
      </Card>

      {/* Selected Policies */}
      {policies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Property Policies ({policies.length})</CardTitle>
            <CardDescription>Drag to reorder. These policies will be added to the database.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {policies.map((policy, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-muted rounded-lg"
                >
                  <div className="flex flex-col gap-1 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => movePolicy(index, 'up')}
                      disabled={index === 0}
                    >
                      ▲
                    </Button>
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => movePolicy(index, 'down')}
                      disabled={index === policies.length - 1}
                    >
                      ▼
                    </Button>
                  </div>
                  <span className="text-2xl flex-shrink-0 pt-2">{policy.policy_icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold mb-1">{policy.policy_title}</div>
                    <div className="text-sm text-muted-foreground">{policy.policy_description}</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Display Order: {policy.display_order + 1}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePolicy(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {policies.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No policies added yet. Select from common policies or add custom ones.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
