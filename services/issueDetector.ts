import Issue from "../models/Issue.js";
import { IUser } from "../models/User.js";

export const detectIssues = async (video: any, user: IUser) => {
  let issueType = null;

  // Example logic (extend later with Partner API)
  if (video.snippet.title.includes("Copyright")) {
    issueType = "Copyright Claim";
  }

  if (!issueType) return null;

  // Duplicate check
  const exists = await Issue.findOne({
    videoId: video.id.videoId,
    issueType
  });

  if (exists) return null;

  // Save issue
  const newIssue = await Issue.create({
    userId: user._id.toString(),
    videoId: video.id.videoId,
    issueType,
    title: video.snippet.title
  });

  return newIssue;
};
