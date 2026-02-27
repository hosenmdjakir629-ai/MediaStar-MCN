
/**
 * YouTube Data API v3 Service
 */

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
// Using the provided API Key from environment or fallback
const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyA3laj29mmMOi65O1E4HHR0eNYmBk0iDqk';

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
  const apiKey = API_KEY;
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

  try {
    // If no key is present, return mock data immediately
    if (!apiKey || apiKey.includes('YOUR_API_KEY')) {
      console.warn("OrbitX MCN: No valid API_KEY found. Returning mock YouTube data.");
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return getMockData();
    }

    // Step 1: Use the search API to find the channel ID from the handle.
    const searchResponse = await fetch(
      `${YOUTUBE_API_BASE}/search?part=snippet&q=${cleanHandle}&type=channel&key=${apiKey}`
    );

    if (!searchResponse.ok) {
      throw new Error(`YouTube Search API error: ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();

    if (!searchData.items || searchData.items.length === 0) {
      // As a fallback, try the channels endpoint
      const channelResponse = await fetch(
        `${YOUTUBE_API_BASE}/channels?part=snippet,statistics&forHandle=${cleanHandle}&key=${apiKey}`
      );
      if (channelResponse.ok) {
         const channelData = await channelResponse.json();
         if (channelData.items && channelData.items.length > 0) {
           const item = channelData.items[0];
            return {
              id: item.id,
              title: item.snippet.title,
              customUrl: item.snippet.customUrl,
              thumbnails: item.snippet.thumbnails,
              statistics: item.statistics
            };
         }
      }
      return null;
    }
    
    const channelId = searchData.items[0].id.channelId;

    // Step 2: Fetch channel details using the obtained channel ID.
    const channelDetailsResponse = await fetch(
      `${YOUTUBE_API_BASE}/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
    );

    if (!channelDetailsResponse.ok) {
       throw new Error(`YouTube Channel Details API error: ${channelDetailsResponse.statusText}`);
    }

    const channelDetailsData = await channelDetailsResponse.json();
    
    if (channelDetailsData.items && channelDetailsData.items.length > 0) {
      const item = channelDetailsData.items[0];
      return {
        id: item.id,
        title: item.snippet.title,
        customUrl: item.snippet.customUrl,
        thumbnails: item.snippet.thumbnails,
        statistics: item.statistics
      };
    }

    return null;
  } catch (error) {
    console.error("OrbitX MCN: Error fetching YouTube data, falling back to mock.", error);
    // Return mock data on API failure to keep app usable
    return getMockData();
  }
};
