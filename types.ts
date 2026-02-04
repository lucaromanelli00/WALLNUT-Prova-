
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

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface DepartmentConfig {
  id: string;
  name: string;
  companyId?: string; // Optional: ID of the company this department belongs to
  isExternal?: boolean; // Optional: Flag for external advisor management
  enabled?: boolean; // Kept for compatibility, but logic effectively treats them as enabled
  owner?: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  members: TeamMember[]; // List of invited employees/members
}

export interface CompanyDetails {
  id: string;
  name: string;
  vat: string;
  logo?: string; // Base64 string
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
  logo?: string;
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
  organigramAdherence: string; // "Sì, in modo coerente", "Parzialmente", "No, in modo significativo"
  organigramDivergence: string; // Follow-up text if not "Sì"
  keyFigures: string;
  collaboratingTeams: string;
  externalPartners: string; // JSON String storing Array<{ category: string, role: string }>
  distinctiveSkills: string;
  missingSkills: string;

  // 1.2 Company Culture
  individualRelationship: string; // Likert 1-5 stringified
  evaluationCriteria: string; // JSON String { presence: number, autonomy: number, results: number }
  rewardedBehaviors: string[]; // Array of strings (checkboxes)
  toleratedBehaviors: string[]; // Array of strings (checkboxes)
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

export interface MarketEntity {
  id: string;
  name: string;
  website?: string;
  // Specific fields
  attractiveness?: string; // Only for Customers: "Cosa vi rende attraenti per questo cliente?"
  differentiation?: string; // Only for Competitors: "In cosa vi differenziate..."
}

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
  competitors: MarketEntity[]; // Updated
  differentiation: string;
  monitoringStrategy: string;
  observedModels: string;

  // 3.3 Customers
  customers: MarketEntity[]; // Updated
  // Removed direct "mainCustomers" string as it is now a list
  idealCustomerPattern: string;
  targetEvolution: string;
  // Removed global "attractiveness" string as it is now per customer
  strategicCriteria: string;
  growthSegments: string;
  customerRelationship: string;

  // 3.4 Suppliers (New)
  suppliers: MarketEntity[];
  suppliersEvolution: string; // "Come è cambiato nel tempo il vostro target?"
  strategicSuppliers: string;
  supplierRelationships: string;

  // 3.5 Regulations (Shifted)
  impactingRegulations: string;
  complianceUpdate: string;
  developmentConditioning: string;
  complianceRoles: string;
  recentChanges: string;
  riskAreas: string;

  // 3.6 Perception & Reviews (Shifted)
  feedbackChannels: string;
  feedbackCollection: string;
  feedbackAnalysis: string;
  negativeResponseStrategy: string;
  recurringPerceptions: string;
  reputationManagement: string;

  // 3.7 Offers & Partnerships (Shifted)
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
  description?: string; // Made optional
  team?: string; // Made optional
  integration?: string; // "Sì" | "No" | "Non so"
  integratedWith?: string; // "Quali?"
}

export interface ToolFeedback {
  frequency: string;      // Quotidianamente; Settimanalmente; Occasionalmente; Non lo utilizzo.
  utility: string;        // Indispensable; Utile; Poco utile; Inutile.
  replaceability: string; // No, è unico; Sì, da uno strumento già presente; Non lo so.
  alternative?: string;   // Campo libero (optional)
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
  toolFeedback: Record<string, ToolFeedback>; // Changed from simple string to structured object
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
