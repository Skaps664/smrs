// Type definitions for the application

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface Startup {
  id: string
  userId: string
  name: string
  industry: string
  stage: string
  description?: string
  foundedDate: Date
  teamSize: number
  fundingStage?: string
  secpRegistered: boolean
  secpNumber?: string
  fbrRegistered: boolean
  fbrNumber?: string
  trademarkApplied: boolean
  trademarkStatus?: string
  website?: string
  socialMedia?: string
  location?: string
  createdAt: Date
  updatedAt: Date
}

export interface WeeklyTracker {
  id: string
  startupId: string
  startDate: Date
  endDate: Date
  milestonesAchieved: string[]
  newActivities: string[]
  challenges: string[]
  actionsTaken: string[]
  nextGoals: string[]
  supportNeeded: string[]
  createdAt: Date
  updatedAt: Date
}

export interface MonthlyTracker {
  id: string
  startupId: string
  month: Date
  summary: string
  keyAchievements: string[]
  majorChallenges: string[]
  lessonsLearned: string[]
  nextMonthPlans: string[]
  createdAt: Date
  updatedAt: Date
}

export interface KPI {
  id: string
  startupId: string
  date: Date
  category: string
  socialFollowers?: number
  reach?: number
  engagementRate?: number
  adSpend?: number
  leadsGenerated?: number
  ordersPlaced?: number
  unitsSold?: number
  revenue?: number
  profitMargin?: number
  customerReturnRate?: number
  featuresCompleted?: number
  prototypesTested?: number
  qaResults?: string
  suppliersOnboarded?: number
  employeesAdded?: number
  collaborators?: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Milestone {
  id: string
  startupId: string
  stage: string
  title: string
  description?: string
  criteria: string[]
  completed: boolean
  completedDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Document {
  id: string
  startupId: string
  name: string
  category: string
  fileUrl: string
  fileSize?: number
  fileType?: string
  expiryDate?: Date
  reminderSet: boolean
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface MentorFeedback {
  id: string
  startupId: string
  mentorName: string
  mentorEmail?: string
  meetingDate: Date
  meetingNotes: string
  feedback: string
  assignedTasks: string[]
  progressScore?: number
  createdAt: Date
  updatedAt: Date
}

export interface ValueProposition {
  id: string
  startupId: string
  versionName: string
  versionNumber: number
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  gainCreators: string[]
  productsServices: string[]
  painRelievers: string[]
  customerGains: string[]
  customerPains: string[]
  customerJobs: string[]
  notes?: string
  targetAudience?: string
  createdAt: Date
  updatedAt: Date
}

export interface ReportData {
  startup: Startup
  weeklyTrackers: WeeklyTracker[]
  monthlyTrackers: MonthlyTracker[]
  kpis: KPI[]
  milestones: Milestone[]
  documents: Document[]
  feedbacks: MentorFeedback[]
}
