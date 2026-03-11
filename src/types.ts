export enum TabView {
  DASHBOARD = 'Dashboard',
  CREATORS = 'Creators',
  ANALYTICS = 'Analytics',
  PAYOUTS = 'Payouts',
  SETTINGS = 'Settings',
  AI_STRATEGIST = 'AI Strategist',
  INTEGRATIONS = 'Integrations',
  SUPPORT = 'Support',
  SYSTEM_LOGS = 'System Logs',
  ADMIN_PANEL = 'Admin Panel',
  REPORTS = 'Reports',
  MARKETPLACE = 'Marketplace',
  RESOURCES = 'Resources',
  CONTENT_ID = 'Content ID',
  RECRUITMENT = 'Recruitment',
  AI_TOOLS = 'AI Tools',
  ONBOARDING = 'Onboarding',
  CALENDAR = 'Calendar',
  LEADERBOARD = 'Leaderboard',
  NOTIFICATIONS = 'Notifications',
  ADVANCED_FINANCIALS = 'Advanced Financials',
  CRM = 'CRM',
  MULTI_PLATFORM = 'Multi-Platform',
  CHAT = 'Chat',
  RBAC = 'RBAC',
  CREATOR_DASHBOARD = 'Creator Dashboard',
  CREATOR_ANALYTICS = 'Creator Analytics',
  CREATOR_CONTENT = 'Creator Content',
  CREATOR_COMMUNITY = 'Creator Community',
  CREATOR_MONETIZATION = 'Creator Monetization',
}

export interface AnalyticsData {
  id: string;
  month: string;
  revenue: number;
  views: number;
  subscribers: number;
  cpm: number;
}

export interface Creator {
  id: string;
  name: string;
  channelName: string;
  subscribers: number;
  totalViews: number;
  videoCount: number;
  revenue: number;
  niche: string;
  avatarUrl: string;
  status: 'Active' | 'Pending' | 'Suspended' | 'Inactive';
  trend: 'up' | 'down' | 'flat';
  linkedChannelHandle?: string;
  youtubeChannelId?: string;
  isVerified?: boolean;
  subscriberHistory?: number[];
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
