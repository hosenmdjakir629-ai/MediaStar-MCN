
/**
 * YouTube Data API v3 Service
 */

export interface YouTubeChannelData {
  id: string;
  title: string;
  customUrl: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    hiddenSubscriberCount: boolean;
    videoCount: string;
  };
}

export const fetchChannelDataByHandle = async (handle: string): Promise<YouTubeChannelData | null> => {
  const cleanHandle = handle.startsWith('@') ? handle.substring(1) : handle;

  // Mock Fallback Generator
  const getMockData = (): YouTubeChannelData => ({
    id: `UC${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    title: `${cleanHandle} (Official)`,
    customUrl: `@${cleanHandle}`,
    thumbnails: {
      default: { url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanHandle}` },
      medium: { url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanHandle}` },
      high: { url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanHandle}` },
    },
    statistics: {
      viewCount: Math.floor(Math.random() * 50000000 + 100000).toString(),
      subscriberCount: Math.floor(Math.random() * 1000000 + 10000).toString(),
      hiddenSubscriberCount: false,
      videoCount: Math.floor(Math.random() * 500 + 10).toString(),
    }
  });

  // Since backend is removed, we always return mock data
  return getMockData();
};
