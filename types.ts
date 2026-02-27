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
  AI_STRATEGIST = 'AI_STRATEGIST',
  INTEGRATIONS = 'INTEGRATIONS',
  SETTINGS = 'SETTINGS',
  SUPPORT = 'SUPPORT'
}