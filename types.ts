
export type Role = 'OWNER' | 'DELEGATE' | 'ADVISOR' | 'EMPLOYEE';

export type Priority = 'MUST' | 'SHOULD' | 'COULD' | 'WOULD';

export interface User {
  id: string;
  name: string;
  role: Role | string;
  email: string;
  avatar?: string;
  jobTitle?: string;
  departmentId?: string; // For Delegates
  assignedBlocks: number[]; // Array of Block IDs allowed to access
}

export interface DepartmentConfig {
  id: string;
  name: string;
  enabled: boolean;
  owner?: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export interface CompanyDetails {
  id: string;
  name: string;
  vat: string;
  visuraFile?: string;
  outputType?: 'Product' | 'Service' | 'Digital';
  geoPresence?: 'Local' | 'National' | 'Multinational';
  sizeClass?: 'Micro' | 'Small' | 'Medium' | 'Large';
  employeeCount?: string;
  isMain: boolean;
}

export interface OrganizationStructure {
  type: 'SINGLE' | 'GROUP';
  companies: CompanyDetails[];
  departments: DepartmentConfig[];
}

// Legacy compatibility
export interface Company {
  name: string;
  vat: string;
  employees: string;
  sector: string;
}

export interface BlockStatus {
  id: number;
  status: 'LOCKED' | 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  progress: number;
}

export interface DocumentDefinition {
  id: string;
  areaId: string; // 1.0, 2.0 etc
  areaName: string;
  code: string; // 1.1, 1.2
  name: string;
  priority: Priority;
  versionReq: string; // "Storico completo", "Ultimi 3 anni"
  recoveryMethod?: string;
}

export interface DocumentState {
  docId: string;
  status: 'MISSING' | 'UPLOADED' | 'ASSIGNED' | 'NOT_AVAILABLE';
  file?: string;
  uploadedAt?: string;
  assignedTo?: {
    name: string;
    email: string;
    role: string;
  };
}

// --- NOTIFICATIONS ---
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

// --- BLOCK 1 SPECIFIC TYPES (PROFILE) ---
export interface ProfileBlockData {
  // 1.1 Roles & Teams
  organigramAdherence: string;
  keyFigures: string;
  informalRoles: string;
  collaboratingTeams: string;
  externalPartners: string;
  distinctiveSkills: string;
  missingSkills: string;

  // 1.2 Company Culture
  individualRelationship: string;
  idealEnvironment: string;
  autonomyVsResults: string;
  rewardedBehaviors: string;
  toleratedBehaviors: string;
  internalCommunication: string;
  meetingManagement: string;
  workLifeBalance: string;
  diversityValue: string;
  changeReaction: string;
  digitalAttitude: string;

  // 1.3 Library
  library: LibraryItem[];
}

// --- BLOCK 2 SPECIFIC TYPES (IDENTITY) ---
export interface IdentityBlockData {
  // 2.1 Corporate Identity
  nameOrigin: string;
  visualEvolution: string;
  toneOfVoice: string;
  consistency: string;
  brandBookUsage: string;
  identityAdaptation: string;
  sustainabilityRealness: string;

  // 2.2 Timeline
  growthSteps: string;
  marketValidation: string;
  partnerships: string;
  governanceChanges: string;
  newMarkets: string;
  crises: string;
  significantEvents: string;
  growthStart: string;
  newServices: string;
  expansionFactors: string;
  threeKeyStages: string;

  // 2.3 Development Plans
  strategicPriorities: string;
  futureVision: string;
  targetMarkets: string;
  businessLinesEvolution: string;
  roadmapFormalization: string;
  obstacles: string;
  teamSharing: string;
  supportNeeded: string;
  businessModelChanges: string;
  goalMeasurement: string;

  // 2.4 Learned Lessons
  obsoleteBeliefs: string;
  formativeError: string;
  pivotMoment: string;
  experienceImpact: string;
  regrettedDecisions: string;
  crisisMoments: string;
  peopleRole: string;
  errorPattern: string;

  // 2.5 Risks
  strategicRisks: string;
  operationalRisks: string;
  materializedRisks: string;
  preventiveMeasures: string;
  underratedRisks: string;
  riskCommunication: string;
  riskMonitoring: string;
  riskManagementTools: string;
  formalRiskMapping: string;

  // 2.6 Financial
  financialPhilosophy: string;
  economicRiskAttitude: string;
  healthIndicators: string;
  financeStrategyAlignment: string;
  dataSharing: string;
  teamAwareness: string;
  pastCrises: string;
  financeFunctionImportance: string;
  financialRiskPolicy: string;
  debtStance: string;
  liquidityManagement: string;
}

// --- BLOCK 3 SPECIFIC TYPES (MARKET) ---
export interface MarketBlockData {
  // 3.1 Market Trends
  topTrends: string;
  trendIdentification: string;
  trendToStrategy: string;
  emergingPositioning: string;
  earlyTrend: string;
  missedTrend: string;
  unservedNeeds: string;

  // 3.2 Competitors
  directCompetitors: string;
  differentiation: string;
  monitoringStrategy: string;
  observedModels: string;

  // 3.3 Customers
  mainCustomers: string;
  idealCustomerPattern: string;
  targetEvolution: string;
  attractiveness: string;
  strategicCriteria: string;
  growthSegments: string;
  customerRelationship: string;

  // 3.4 Regulations
  impactingRegulations: string;
  complianceUpdate: string;
  developmentConditioning: string;
  complianceRoles: string;
  recentChanges: string;
  riskAreas: string;

  // 3.5 Perception & Reviews
  feedbackChannels: string;
  feedbackCollection: string;
  feedbackAnalysis: string;
  negativeResponseStrategy: string;
  recurringPerceptions: string;
  reputationManagement: string;

  // 3.6 Offers & Partnerships
  proposalStakeholders: string;
  offerTypes: string;
  newOfferOrigin: string;
  valueGenerators: string;
  conversionRate: string;
  contractManagement: string;
  pricingStrategy: string;
  contractStandards: string;
  strategicPartnerships: string;
  satisfactionMonitoring: string;
}

// --- BLOCK 4 SPECIFIC TYPES (TECH) ---
export interface TechTool {
  id: string;
  domain: string; // Project Mgmt, CRM, etc.
  name: string;
  description: string;
  team: string;
}

export interface TechBlockData {
  // 4.1
  erpUsed: string; // 'yes' | 'no'
  erpName: string;
  erpTechnicalAccess: string;
  erpAccessDetails: string;
  tools: TechTool[];
  internalSoftware: string;
  internalSoftwareDetails: string;
  updateFrequency: string;
  integratedTools: string;
  integratedToolsDetails: string;
  automations: string;
  automationsDetails: string;
  integrationRating: string;
  integrationRatingDetails: string;
  // 4.2
  strategicDecider: string;
  decisionModel: string;
  implementationTime: string;
  conflicts: string;
  conflictsDetails: string;
  // 4.3
  riskScenarios: string;
  dataBreach: string;
  dataBreachDetails: string;
  accessControl: string;
  // 4.4
  indispensableTools: string;
  indispensableActivities: string;
  problematicTools: string;
  toolFeedback: Record<string, string>; // key: toolId, value: frequency
}

// Snapshot of data for a specific company
export interface CompanySnapshot {
  techData: TechBlockData;
  profileData: ProfileBlockData;
  identityData: IdentityBlockData;
  marketData: MarketBlockData;
  blocks: { [key: number]: BlockStatus };
  documents: { [key: string]: DocumentState };
}

export interface AppState {
  user: User | null;
  company: Company | null; // Currently active company basic info
  organization: OrganizationStructure | null;
  activeCompanyId: string; // ID of the company currently being edited
  onboardingComplete: boolean;
  
  // CURRENTLY LOADED DATA (Bound to UI)
  blocks: { [key: number]: BlockStatus };
  answers: { [key: string]: string }; 
  documents: { [key: string]: DocumentState }; 
  library: LibraryItem[];
  techData: TechBlockData; 
  profileData: ProfileBlockData; 
  identityData: IdentityBlockData; 
  marketData: MarketBlockData; 
  
  // STORAGE FOR MULTI-COMPANY
  companySnapshots: Record<string, CompanySnapshot>;

  audioAnswers: Record<string, string>; 
  notifications: Notification[];
}

export interface LibraryItem {
  id: string;
  title: string;
  type: string; // Book, Article, Person, Document
  link?: string;
  description?: string;
}

export interface ProcessItem {
  id: string;
  code: string;
  name: string;
  description?: string;
  assignedTo?: string; 
  status: 'PENDING' | 'INTERVIEW_READY' | 'COMPLETED';
}
