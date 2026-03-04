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
  status: 'Active' | 'Pending' | 'Inactive';
  trend: 'up' | 'down' | 'flat';
  linkedChannelHandle?: string;
}
