import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

interface VerifiedBadgeProps {
  verified: boolean;
  className?: string;
}

export default function VerifiedBadge({ verified, className }: VerifiedBadgeProps) {
  if (!verified) return null;

  return (
    <Badge variant="default" className={`bg-primary text-primary-foreground ${className}`}>
      <CheckCircle2 className="mr-1 h-3 w-3" />
      RoomSaathi Verified
    </Badge>
  );
}
