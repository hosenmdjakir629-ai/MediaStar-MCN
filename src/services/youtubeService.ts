import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

export const getYouTubeData = async (userId: string, endpoint: string, params: Record<string, string>) => {
  const userDoc = await getDoc(doc(db, "users", userId));
  const userData = userDoc.data();
  const accessToken = userData?.youtubeAccessToken;

  if (!accessToken) {
    throw new Error("No YouTube access token found. Please connect your channel.");
  }

  const url = new URL(`${YOUTUBE_API_BASE}/${endpoint}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("YouTube API request failed");
  }

  return response.json();
};

export const fetchChannelStats = async (userId: string, channelId: string) => {
  return getYouTubeData(userId, "channels", {
    part: "statistics,snippet",
    id: channelId,
  });
};
