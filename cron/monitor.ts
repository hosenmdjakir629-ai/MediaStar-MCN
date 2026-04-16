import User from "../models/User.js";
import { getChannelVideos } from "../services/youtubeMonitorService.js";
import { detectIssues } from "../services/issueDetector.js";
import { sendAlertEmail } from "../services/emailService.js";

const runMonitor = async () => {
  const users = await User.find();

  for (const user of users) {
    if (!user.channelId) continue;
    
    try {
      const videos = await getChannelVideos(user.channelId);

      for (const video of videos) {
        const issue = await detectIssues(video, user);

        if (issue) {
          await sendAlertEmail(user, issue);
        }
      }
    } catch (error) {
      console.error(`Error monitoring channel ${user.channelId}:`, error);
    }
  }
};

export default runMonitor;
