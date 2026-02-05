
export enum ViewState {
  HOME = 'HOME',
  SEARCHING = 'SEARCHING',
  DETAIL = 'DETAIL',
  PROFILE = 'PROFILE'
}

export type Language = 'en';
export type MembershipTier = 'Free' | 'Pro';

export interface IncentiveProgress {
  currentStreak: number; // Days
  totalOutsideCocoonReads: number;
  errorsCorrected: number;
  suggestionsAdopted: number;
  referrals: number;
}

export interface UserProfile {
  age: string;
  occupation: string;
  education: string;
  language: Language; // New
  membership: MembershipTier; // New
  incentives: IncentiveProgress; // New
}

export type TopicCategory = 'Policy' | 'Tech' | 'Economy' | 'Society' | 'International' | 'Science' | 'Culture';

export interface Fact {
  content: string;
  confidence: 'High' | 'Medium' | 'Low';
  timestamp?: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  x: number;
  y: number;
  fears: string;
  values: string;
  blindSpots: string;
  rationality: string;
}

export interface Term {
  term: string;
  definition: string;
}

export interface KnowledgeLink {
  title: string;
  description: string;
  type?: 'Case' | 'Academic' | 'Report'; // Changed Article to Case for International Cases
}

// New Types for Enhanced Detail View

export interface ControversyPrediction {
  score: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  reasoning: string;
}

export interface TrendPoint {
  date: string;
  sentiment: number;
  volume: number;
  event?: string;
}

export interface MissingIntel {
  question: string;
  whyCritical: string;
  trustedSource: string;
}

export interface RolePlayOption {
  text: string;
  consequence: string;
}

export interface RolePlayRound {
  situation: string;
  options: RolePlayOption[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface RolePlayData {
  mode: 'dilemma' | 'chat'; // New: Distinguish between Free and Pro modes
  roleName: string;
  context: string;
  
  // For 'dilemma' mode (Free)
  rounds?: RolePlayRound[]; 
  
  // For 'chat' mode (Pro)
  initialMessage?: string; 
  expertType?: 'Historical' | 'Academic' | 'Industry';
}

export interface DisciplinaryPerspective {
  discipline: string;
  insight: string;
}

export interface HistoricalParallel {
  event: string;
  year: string;
  similarity: string;
  lesson: string;
}

export interface TopicData {
  id: string;
  title: string;
  summary: string;
  newsNarrative?: string; // New: Longer journalistic story
  whyMatters: string;
  category: TopicCategory;
  isInternational?: boolean; // New: For Home Feed filtering/highlighting
  
  // Tab 1: Facts & Prediction
  facts: Fact[];
  dataCutoff: string;
  controversyPrediction?: ControversyPrediction;

  // Tab 2: Perspectives & Analysis
  // divergenceRating removed from UI but kept in type if needed for backend, effectively unused in display now
  divergenceRating?: number;
  perspectiveSummary?: string; 
  stakeholders?: Stakeholder[];
  trendAnalysis?: TrendPoint[];
  missingIntel?: MissingIntel[];
  rolePlay?: RolePlayData;

  // Tab 3: Extensions
  terms?: Term[];
  extensions?: KnowledgeLink[];
  disciplinaryPerspectives?: DisciplinaryPerspective[];
  historicalParallels?: HistoricalParallel[]; // New
  
  // Metadata
  sourceCount: number;
  lastUpdated: string;
  isAiGenerated?: boolean;
}

// Cocoon Report Data Structures
export interface CategoryScore {
  subject: string;
  score: number;
  fullMark: number;
}

export interface TrendInsight {
  globalThemes: { title: string; category: string }[];
  userTopTopics: { title: string; score: number; category: string }[]; // Changed from userTopCategories to specific topics
  userFocusSummary: string;
  globalSummary: string;
}

export interface CocoonReportData {
  radarData: CategoryScore[];
  totalReads: number;
  cocoonScore: number;
  blindSpots: string[];
  diversityLevel: 'Echo Chamber' | 'Filter Bubble' | 'Explorer' | 'Bridge Builder';
  recommendedTopic?: string;
  trendInsights: TrendInsight; // New
}
