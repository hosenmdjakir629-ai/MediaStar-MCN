import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const getAuthUrl = () => {
  const scopes = [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });
};

export const getTokens = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

export const getYoutubeData = async (tokens: any) => {
  oauth2Client.setCredentials(tokens);
  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
  
  const response = await youtube.channels.list({
    part: ['snippet', 'statistics'],
    mine: true,
  });

  return response.data;
};
