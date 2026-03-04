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
  linkedChannelHandle?: string;
  lastSynced?: string;
  monetizationStatus?: 'Enabled' | 'Disabled';
  uploadPolicy?: string;
}

export interface AnalyticsData {
  date: string;
  views: number;
  revenue: number;
  subs: number;
}

export interface AIStrategyResponse {
  titleIdeas: string[];
  descriptionOptimization: string;
  tags: string[];
  contentGaps: string[];
}

export enum TabView {
  DASHBOARD = 'DASHBOARD',
  CREATORS = 'CREATORS',
  ANALYTICS = 'ANALYTICS',
  PAYOUTS = 'PAYOUTS',
  SETTINGS = 'SETTINGS',
  AI_STRATEGIST = 'AI_STRATEGIST',
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
}
