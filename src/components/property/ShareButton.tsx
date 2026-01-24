import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  propertyId: string;
  propertyName: string;
}

export default function ShareButton({ propertyId, propertyName }: ShareButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    setIsLoading(true);
    const url = `${window.location.origin}/property/${propertyId}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: propertyName,
          text: `Check out this property: ${propertyName}`,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          title: 'Link copied!',
          description: 'Property link copied to clipboard',
        });
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        toast({
          title: 'Error',
          description: 'Failed to share property',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleShare}
      disabled={isLoading}
    >
      <Share2 className="h-4 w-4" />
    </Button>
  );
}
