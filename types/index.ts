// Type definitions for the application

export type UserRole = 'STARTUP' | 'MENTOR' | 'INVESTOR'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  currentStage?: string
  mentorCompany?: string
  mentorLinkedin?: string
  mentorLocation?: string
  investorPortfolio?: string
  investorLocation?: string
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

// Business Model Canvas Types
export interface CustomerSegment {
  segment: string
  description: string
  size?: string
  demographics?: string
  psychographics?: string
}

export interface ValuePropositionBMC {
  proposition: string
  problem: string
  solution: string
  uniqueness?: string
}

export interface Channel {
  channel: string
  phase: string
  type: string
  direct: boolean
}

export interface CustomerRelationship {
  type: string
  description: string
  strategy?: string
  automation?: boolean
}

export interface RevenueStream {
  stream: string
  type: string
  pricingModel: string
  frequency: string
}

export interface KeyResource {
  resource: string
  type: string
  ownership: string
  importance: string
}

export interface KeyActivity {
  activity: string
  category: string
  frequency: string
  owner?: string
}

export interface KeyPartnership {
  partner: string
  type: string
  value: string
  relationship?: string
}

export interface CostStructure {
  cost: string
  type: string
  fixed: boolean
  frequency: string
  importance: string
}

export interface BusinessModelCanvas {
  id: string
  startupId: string
  versionName: string
  versionNumber: number
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'TESTING'
  customerSegments: CustomerSegment[]
  valuePropositions: ValuePropositionBMC[]
  channels: Channel[]
  customerRelationships: CustomerRelationship[]
  revenueStreams: RevenueStream[]
  keyResources: KeyResource[]
  keyActivities: KeyActivity[]
  keyPartnerships: KeyPartnership[]
  costStructure: CostStructure[]
  notes?: string
  targetMarket?: string
  completionPercentage?: number
  createdAt: Date
  updatedAt: Date
}

export interface MarketResearchData {
  id?: string
  title: string
  tam: { value: number; currency: string; description: string }
  sam: { value: number; currency: string; description: string }
  som: { value: number; currency: string; description: string }
  swot: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  fourPs?: {
    product: {
      description: string
      features: string[]
      benefits: string[]
      differentiation: string
    }
    price: {
      strategy: string
      pricePoint: string
      costStructure: string
      competitorPricing: string
    }
    place: {
      channels: string[]
      distribution: string
      coverage: string
      locations: string[]
    }
    promotion: {
      strategies: string[]
      budget: string
      channels: string[]
      messaging: string
    }
  }
  portersForces?: {
    competitiveRivalry: {
      level: string
      factors: string[]
      description: string
    }
    supplierPower: {
      level: string
      factors: string[]
      description: string
    }
    buyerPower: {
      level: string
      factors: string[]
      description: string
    }
    threatOfSubstitutes: {
      level: string
      factors: string[]
      description: string
    }
    threatOfNewEntrants: {
      level: string
      factors: string[]
      description: string
    }
  }
  customerJourney?: {
    awareness: {
      touchpoints: string[]
      customerActions: string[]
      painPoints: string[]
      opportunities: string[]
    }
    consideration: {
      touchpoints: string[]
      customerActions: string[]
      painPoints: string[]
      opportunities: string[]
    }
    decision: {
      touchpoints: string[]
      customerActions: string[]
      painPoints: string[]
      opportunities: string[]
    }
    retention: {
      touchpoints: string[]
      customerActions: string[]
      painPoints: string[]
      opportunities: string[]
    }
    advocacy: {
      touchpoints: string[]
      customerActions: string[]
      painPoints: string[]
      opportunities: string[]
    }
  }
  targetAudience: {
    segments: string[]
    ageRanges: string[]
    genders: string[]
    locations: string[]
    industries: string[]
    incomeLevels: string[]
    behaviors: string[]
    painPoints: string[]
    personas?: Array<{
      name: string
      description: string
      demographics: string
      goals: string
    }>
  }
  competitorAnalysis: {
    directCompetitors: string[]
    indirectCompetitors: string[]
    marketGaps: string[]
  }
  marketTrends: string[]
  dataSources: string[]
  lastUpdated: string
}

export interface ReportData {
  startup: Startup
  weeklyTrackers: WeeklyTracker[]
  monthlyTrackers: MonthlyTracker[]
  kpis: KPI[]
  milestones: Milestone[]
  documents: Document[]
  feedbacks: MentorFeedback[]
  marketResearch?: MarketResearchData
}

export type InviteType = 'MENTOR' | 'INVESTOR'

export interface InviteLink {
  id: string
  startupId: string
  createdById: string
  inviteType: InviteType
  token: string
  email?: string
  expiresAt: Date
  usedAt?: Date
  usedBy?: string
  isActive: boolean
  createdAt: Date
}

export interface StartupMentorAccess {
  id: string
  startupId: string
  mentorId: string
  mentor?: User
  joinedAt: Date
}

export interface StartupInvestorAccess {
  id: string
  startupId: string
  investorId: string
  investor?: User
  joinedAt: Date
}
