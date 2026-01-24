import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addToFavorites, removeFromFavorites } from '@/db/api';
import { useToast } from '@/hooks/use-toast';

interface FavoriteButtonProps {
  propertyId: string;
  isFavorite: boolean;
  onToggle?: () => void;
}

export default function FavoriteButton({ propertyId, isFavorite: initialFavorite, onToggle }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      if (isFavorite) {
        await removeFromFavorites(propertyId);
        setIsFavorite(false);
        toast({
          title: 'Removed from favorites',
          description: 'Property removed from your favorites list',
        });
      } else {
        await addToFavorites(propertyId);
        setIsFavorite(true);
        toast({
          title: 'Added to favorites',
          description: 'Property added to your favorites list',
        });
      }
      onToggle?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update favorites',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isFavorite ? 'default' : 'outline'}
      size="icon"
      onClick={handleToggle}
      disabled={isLoading}
      className="transition-all"
    >
      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
    </Button>
  );
}
