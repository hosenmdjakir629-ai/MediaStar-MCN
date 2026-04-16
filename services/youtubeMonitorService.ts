import axios from "axios";

const API_KEY = process.env.YOUTUBE_API_KEY;

export const getChannelVideos = async (channelId: string) => {
  const res = await axios.get(
    `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date`
  );

  return res.data.items;
};
