import { Request, Response } from 'express';
import * as googleAuth from '../utils/googleAuth';

export const getAuthUrlEndpoint = async (req: Request, res: Response) => {
  try {
    const url = googleAuth.getAuthUrl();
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
};

export const authCallback = async (req: Request, res: Response) => {
  const { code } = req.query;
  try {
    const tokens = await googleAuth.getTokens(code as string);
    // In a real app, you would save these tokens to the user's document
    // For now, we'll just send a success message to the opener
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', tokens: ${JSON.stringify(tokens)} }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send('Authentication failed');
  }
};

const VALID_API_KEY = 'AIzaSyCD1m6VKuh9YZW0s22-S0PLKBaL_5p7JZY';
const VALID_CHANNEL_ID = 'UCBT2xQUYrJfk3jZt-tsZ6ow';

const validateYouTubeConfig = (apiKey: string | undefined, channelId: string | undefined) => {
  if (!apiKey || !channelId) {
    return 'YouTube API Key or Channel ID not configured';
  }
  if (apiKey === VALID_API_KEY || channelId === VALID_CHANNEL_ID) {
    return 'Please configure your own YouTube API Key and Channel ID. Placeholder values detected.';
  }
  return null;
};

export const getStats = async (req: Request, res: Response) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.CHANNEL_ID;

  const configError = validateYouTubeConfig(apiKey, channelId);
  if (configError) {
    return res.status(200).json({ 
      success: false, 
      message: configError 
    });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${apiKey}`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle "API not enabled" or "Forbidden" errors with mock data
      if (response.status === 403) {
        console.warn('YouTube API access forbidden or not enabled. Returning mock data for demo purposes.');
        return res.status(200).json({
          success: true,
          isMock: true,
          message: 'YouTube Data API v3 access is restricted or not enabled. Showing demo data.',
          data: {
            title: 'OrbitX Demo Channel',
            description: 'This is a demo channel showing mock data because the YouTube API is not enabled.',
            thumbnails: {
              default: { url: 'https://picsum.photos/seed/youtube/120/90' },
              medium: { url: 'https://picsum.photos/seed/youtube/320/180' },
              high: { url: 'https://picsum.photos/seed/youtube/480/360' }
            },
            statistics: {
              viewCount: '1250000',
              subscriberCount: '45000',
              videoCount: '124'
            }
          }
        });
      }

      throw new Error(`YouTube API responded with status: ${response.status}. Reason: ${errorData.error?.message || 'Unknown'}`);
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return res.status(200).json({ 
        success: false, 
        message: 'Channel not found' 
      });
    }

    const channel = data.items[0];
    res.json({
      success: true,
      data: {
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnails: channel.snippet.thumbnails,
        statistics: channel.statistics
      }
    });
  } catch (error) {
    console.error('Error fetching YouTube stats:', error);
    res.status(200).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to fetch YouTube statistics' 
    });
  }
};

export const getVideos = async (req: Request, res: Response) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.CHANNEL_ID;
  const configError = validateYouTubeConfig(apiKey, channelId);
  if (configError) {
    return res.status(200).json({ error: configError });
  }
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=6`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 403) {
        console.warn('YouTube API access forbidden or not enabled for videos. Returning mock data.');
        return res.json([
          {
            id: { videoId: 'demo1' },
            snippet: {
              title: 'How to Grow Your YouTube Channel in 2024',
              description: 'Learn the latest strategies for YouTube growth.',
              thumbnails: { medium: { url: 'https://picsum.photos/seed/vid1/320/180' } },
              publishedAt: new Date().toISOString()
            }
          },
          {
            id: { videoId: 'demo2' },
            snippet: {
              title: '10 Tips for Better Video Editing',
              description: 'Improve your editing workflow with these simple tips.',
              thumbnails: { medium: { url: 'https://picsum.photos/seed/vid2/320/180' } },
              publishedAt: new Date().toISOString()
            }
          },
          {
            id: { videoId: 'demo3' },
            snippet: {
              title: 'The Future of Content Creation',
              description: 'Exploring how AI is changing the landscape.',
              thumbnails: { medium: { url: 'https://picsum.photos/seed/vid3/320/180' } },
              publishedAt: new Date().toISOString()
            }
          }
        ]);
      }

      return res.status(200).json({ 
        error: `YouTube API Error: ${errorData.error?.message || 'Unknown'}` 
      });
    }

    const data = await response.json();
    const videoIds = (data.items || []).map((item: any) => item.id.videoId).join(',');
    
    if (!videoIds) {
      return res.json([]);
    }

    // Fetch video details (including duration)
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=snippet,contentDetails`;
    const videosResponse = await fetch(videosUrl);
    const videosData = await videosResponse.json();
    
    res.json(videosData.items || []);
  } catch (err) {
    res.status(200).json({ error: (err as Error).message });
  }
};

export const searchVideos = async (req: Request, res: Response) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || apiKey === VALID_API_KEY) {
    return res.status(200).json({ error: 'YouTube API Key not configured or invalid' });
  }
  try {
    const q = encodeURIComponent(req.params.query as string);
    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${q}&part=snippet&maxResults=6`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 403) {
        console.warn('YouTube API access forbidden for search. Returning mock results.');
        return res.json([
          {
            id: { videoId: 'search1' },
            snippet: {
              title: `Search Result for "${req.params.query}"`,
              description: 'This is a mock search result because the YouTube API is not enabled.',
              thumbnails: { medium: { url: 'https://picsum.photos/seed/search1/320/180' } },
              publishedAt: new Date().toISOString()
            }
          },
          {
            id: { videoId: 'search2' },
            snippet: {
              title: 'Another Demo Video',
              description: 'Enable the YouTube API to see real search results.',
              thumbnails: { medium: { url: 'https://picsum.photos/seed/search2/320/180' } },
              publishedAt: new Date().toISOString()
            }
          }
        ]);
      }

      return res.status(200).json({ 
        error: `YouTube API Error: ${errorData.error?.message || 'Unknown'}` 
      });
    }

    const data = await response.json();
    res.json(data.items || []);
  } catch (err) {
    res.status(200).json({ error: (err as Error).message });
  }
};

export const getMcnChannels = async (req: Request, res: Response) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || apiKey === VALID_API_KEY) {
    return res.status(200).json({ error: 'YouTube API Key not configured or invalid' });
  }
  try {
    const ids = req.body.channels || [];
    let results = [];
    for (let id of ids) {
      const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${id}&key=${apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`YouTube API MCN Error for ${id}:`, JSON.stringify(errorData, null, 2));
        continue; // Skip failed channels
      }

      const data = await response.json();
      if (data.items && data.items[0]) {
        results.push(data.items[0]);
      }
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
