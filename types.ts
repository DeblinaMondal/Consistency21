export interface Activity {
  id: string;
  text: string;
  completed: boolean;
}

export interface DayPlan {
  day: number;
  title: string;
  guidance: string;
  activities: string[]; // Raw strings from API
}

export interface DailyReport {
  day: number;
  completed: boolean; // Did they finish the main goal?
  activitiesCompleted: number[]; // Indices of completed activities
  notes: string;
  mood: number; // 1-10
  timestamp: number;
}

export interface FinalAnalysis {
  summary: string;
  consistencyScore: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  nextSteps: string;
}

export enum AppView {
  ONBOARDING = 'ONBOARDING',
  CALENDAR = 'CALENDAR',
  REPORT = 'REPORT',
}

export interface UserState {
  goal: string;
  plan: DayPlan[];
  reports: Record<number, DailyReport>; // Keyed by day number (1-21)
  finalAnalysis: FinalAnalysis | null;
  startDate: number;
}