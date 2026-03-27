export interface Creator {
  id: string;
  name: string;
  channelName: string;
  subscribers: number;
  totalViews: number;
  videoCount?: number;
  revenue: number;
  niche: string;
  avatarUrl: string;
  status: 'Active' | 'Pending' | 'Suspended' | 'Processing';
  trend: 'up' | 'down' | 'flat';
  subscriberHistory?: number[];
  linkedChannelHandle?: string;
  youtubeChannelId?: string;
  isVerified?: boolean;
  lastSynced?: string;
  monetizationStatus?: 'Enabled' | 'Disabled';
  uploadPolicy?: string;
  email?: string;
  phone?: string;
  goal?: string;
  channel?: string;
  subs?: string;
  customDomain?: string;
  domainVerified?: boolean;
}

export interface AnalyticsData {
  date: string;
  views: number;
  revenue: number;
  subs: number;
}

export enum TabView {
  DASHBOARD = 'DASHBOARD',
  CREATORS = 'CREATORS',
  ANALYTICS = 'ANALYTICS',
  PAYOUTS = 'PAYOUTS',
  SETTINGS = 'SETTINGS',
  INTEGRATIONS = 'INTEGRATIONS',
  SUPPORT = 'SUPPORT',
  SYSTEM_LOGS = 'SYSTEM_LOGS',
  ADMIN_PANEL = 'ADMIN_PANEL',
  REPORTS = 'REPORTS',
  MARKETPLACE = 'MARKETPLACE',
  RESOURCES = 'RESOURCES',
  CONTENT_ID = 'CONTENT_ID',
  RECRUITMENT = 'RECRUITMENT',
  AI_TOOLS = 'AI_TOOLS',
  ONBOARDING = 'ONBOARDING',
  CALENDAR = 'CALENDAR',
  LEADERBOARD = 'LEADERBOARD',
  NOTIFICATIONS = 'NOTIFICATIONS',
  ADVANCED_FINANCIALS = 'ADVANCED_FINANCIALS',
  CRM = 'CRM',
  MULTI_PLATFORM = 'MULTI_PLATFORM',
  CHAT = 'CHAT',
  RBAC = 'RBAC',
  CREATOR_DASHBOARD = 'CREATOR_DASHBOARD',
  CREATOR_ANALYTICS = 'CREATOR_ANALYTICS',
  CREATOR_CONTENT = 'CREATOR_CONTENT',
  CREATOR_COMMUNITY = 'CREATOR_COMMUNITY',
  CREATOR_MONETIZATION = 'CREATOR_MONETIZATION',
  PAYMENT = 'PAYMENT',
}

export interface EarningsRecord {
  id: string;
  creatorId: string;
  month: string;
  adRevenue: number;
  brandDealRevenue: number;
  totalRevenue: number;
  status: 'Accrued' | 'Ready' | 'Paid';
}

export interface PayoutRequest {
  id: string;
  creatorId: string;
  amount: number;
  status: 'Pending' | 'Processing' | 'Paid' | 'Rejected';
  method: string;
  timestamp: string;
  processedAt?: string;
  reference?: string;
}

export interface CopyrightClaim {
  id: string;
  videoId: string;
  videoTitle: string;
  claimant: string;
  type: 'Audio' | 'Video' | 'Melody';
  status: 'Active' | 'Disputed' | 'Released' | 'Appealed';
  date: string;
  policy: 'Monetize' | 'Track' | 'Block';
  creatorId: string;
}

export interface ContentAsset {
  id: string;
  title: string;
  type: 'Web' | 'Music Video' | 'Sound Recording' | 'Episode';
  ownership: string;
  matches: number;
  dailyViews: number;
  status: 'Active' | 'Inactive';
}
