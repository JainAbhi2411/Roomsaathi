import { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  title?: string;
  className?: string;
}

// Helper function to extract video ID and determine platform
const getVideoEmbedUrl = (url: string): { embedUrl: string; platform: string } | null => {
  // YouTube patterns
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    return {
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
      platform: 'youtube',
    };
  }

  // Vimeo patterns
  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      platform: 'vimeo',
    };
  }

  // Direct video URL (mp4, webm, ogg)
  if (/\.(mp4|webm|ogg)$/i.test(url)) {
    return {
      embedUrl: url,
      platform: 'direct',
    };
  }

  return null;
};

export default function VideoPlayer({ url, title = 'Property Video', className = '' }: VideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoInfo = getVideoEmbedUrl(url);

  if (!videoInfo) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-lg p-8 ${className}`}>
        <p className="text-muted-foreground">Invalid video URL</p>
      </div>
    );
  }

  const { embedUrl, platform } = videoInfo;

  if (platform === 'direct') {
    return (
      <div className={`relative rounded-lg overflow-hidden bg-black ${className}`}>
        <video
          controls
          className="w-full h-full"
          preload="metadata"
          onLoadedMetadata={() => setIsLoaded(true)}
        >
          <source src={embedUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden bg-muted ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Play className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Loading video...</p>
          </div>
        </div>
      )}
      <iframe
        src={embedUrl}
        title={title}
        className="w-full aspect-video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}
