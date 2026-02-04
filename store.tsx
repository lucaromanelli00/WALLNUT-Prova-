
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, User, Role, LibraryItem, Company, OrganizationStructure, DocumentState, TechBlockData, ProfileBlockData, IdentityBlockData, MarketBlockData, Notification, BlockStatus, CompanySnapshot, TeamMember } from './types';

const INITIAL_TECH_DATA: TechBlockData = {
  erpUsed: '',
  erpName: '',
  erpTechnicalAccess: '',
  erpAccessDetails: '',
  tools: [],
  internalSoftware: '',
  internalSoftwareDetails: '',
  updateFrequency: '',
  integratedTools: '',
  integratedToolsDetails: '',
  automations: '',
  automationsDetails: '',
  integrationRating: '',
  integrationRatingDetails: '',
  strategicDecider: '',
  decisionModel: '',
  implementationTime: '',
  conflicts: '',
  conflictsDetails: '',
  riskScenarios: '',
  dataBreach: '',
  dataBreachDetails: '',
  accessControl: '',
  indispensableTools: '',
  indispensableActivities: '',
  problematicTools: '',
  toolFeedback: {}
};

const INITIAL_PROFILE_DATA: ProfileBlockData = {
  organigramAdherence: '',
  organigramDivergence: '',
  keyFigures: '',
  collaboratingTeams: '',
  externalPartners: '',
  distinctiveSkills: '',
  missingSkills: '',
  individualRelationship: '',
  evaluationCriteria: '{"presence": 33, "autonomy": 33, "results": 34}', // Default balanced
  rewardedBehaviors: [],
  toleratedBehaviors: [],
  changeReaction: '',
  digitalAttitude: '',
  library: []
};

const INITIAL_IDENTITY_DATA: IdentityBlockData = {
  nameOrigin: '',
  visualEvolution: '',
  toneOfVoice: '',
  consistency: '',
  brandBookUsage: '',
  identityAdaptation: '',
  sustainabilityRealness: '',
  growthSteps: '',
  marketValidation: '',
  partnerships: '',
  governanceChanges: '',
  newMarkets: '',
  crises: '',
  significantEvents: '',
  growthStart: '',
  newServices: '',
  expansionFactors: '',
  threeKeyStages: '',
  strategicPriorities: '',
  futureVision: '',
  targetMarkets: '',
  businessLinesEvolution: '',
  roadmapFormalization: '',
  obstacles: '',
  teamSharing: '',
  supportNeeded: '',
  businessModelChanges: '',
  goalMeasurement: '',
  obsoleteBeliefs: '',
  formativeError: '',
  pivotMoment: '',
  experienceImpact: '',
  regrettedDecisions: '',
  crisisMoments: '',
  peopleRole: '',
  errorPattern: '',
  strategicRisks: '',
  operationalRisks: '',
  materializedRisks: '',
  preventiveMeasures: '',
  underratedRisks: '',
  riskCommunication: '',
  riskMonitoring: '',
  riskManagementTools: '',
  formalRiskMapping: '',
  financialPhilosophy: '',
  economicRiskAttitude: '',
  healthIndicators: '',
  financeStrategyAlignment: '',
  dataSharing: '',
  teamAwareness: '',
  pastCrises: '',
  financeFunctionImportance: '',
  financialRiskPolicy: '',
  debtStance: '',
  liquidityManagement: ''
};

const INITIAL_MARKET_DATA: MarketBlockData = {
  topTrends: '',
  trendIdentification: '',
  trendToStrategy: '',
  emergingPositioning: '',
  earlyTrend: '',
  missedTrend: '',
  unservedNeeds: '',
  // 3.2
  competitors: [],
  differentiation: '',
  monitoringStrategy: '',
  observedModels: '',
  // 3.3
  customers: [],
  idealCustomerPattern: '',
  targetEvolution: '',
  strategicCriteria: '',
  growthSegments: '',
  customerRelationship: '',
  // 3.4 (New)
  suppliers: [],
  suppliersEvolution: '',
  strategicSuppliers: '',
  supplierRelationships: '',
  // 3.5 (Shifted)
  impactingRegulations: '',
  complianceUpdate: '',
  developmentConditioning: '',
  complianceRoles: '',
  recentChanges: '',
  riskAreas: '',
  // 3.6 (Shifted)
  feedbackChannels: '',
  feedbackCollection: '',
  feedbackAnalysis: '',
  negativeResponseStrategy: '',
  recurringPerceptions: '',
  reputationManagement: '',
  // 3.7 (Shifted)
  proposalStakeholders: '',
  offerTypes: '',
  newOfferOrigin: '',
  valueGenerators: '',
  conversionRate: '',
  contractManagement: '',
  pricingStrategy: '',
  contractStandards: '',
  strategicPartnerships: '',
  satisfactionMonitoring: ''
};

const INITIAL_BLOCKS: { [key: number]: BlockStatus } = {
  1: { id: 1, status: 'TODO', progress: 0 },
  2: { id: 2, status: 'LOCKED', progress: 0 },
  3: { id: 3, status: 'LOCKED', progress: 0 },
  4: { id: 4, status: 'LOCKED', progress: 0 },
  5: { id: 5, status: 'LOCKED', progress: 0 },
};

const INITIAL_STATE: AppState = {
  user: null,
  company: null,
  organization: null,
  activeCompanyId: '',
  onboardingComplete: false,
  blocks: INITIAL_BLOCKS,
  answers: {},
  documents: {},
  library: [],
  techData: INITIAL_TECH_DATA,
  profileData: INITIAL_PROFILE_DATA,
  identityData: INITIAL_IDENTITY_DATA,
  marketData: INITIAL_MARKET_DATA,
  companySnapshots: {},
  audioAnswers: {},
  notifications: []
};

interface AppContextType extends AppState {
  login: (role: Role) => void;
  logout: () => void;
  registerOwner: (userData: User, orgData: OrganizationStructure) => void;
  updateCompany: (data: any) => void;
  completeOnboarding: () => void;
  updateBlockProgress: (blockId: number, progress: number, status?: 'IN_PROGRESS' | 'COMPLETED') => void;
  saveAnswer: (key: string, value: string) => void;
  saveAudioAnswer: (key: string, base64: string) => void;
  uploadDocument: (docId: string, fileName: string) => void;
  assignDocument: (docId: string, assignee: { name: string, email: string, role: string }) => void;
  markDocumentAsNotAvailable: (docId: string) => void;
  addLibraryItem: (item: LibraryItem) => void;
  removeLibraryItem: (id: string) => void;
  updateTechData: (data: Partial<TechBlockData>) => void;
  updateProfileData: (data: Partial<ProfileBlockData>) => void;
  updateIdentityData: (data: Partial<IdentityBlockData>) => void;
  updateMarketData: (data: Partial<MarketBlockData>) => void;
  resetApp: () => void;
  addNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  removeNotification: (id: string) => void;
  switchCompany: (companyId: string) => void;
  copyBlockData: (blockId: number, sourceCompanyId: string) => void;
  addTeamMember: (departmentId: string, member: TeamMember) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// KEY CHANGED TO FORCE CLEAN SLATE
const STORAGE_KEY = 'wallnut_prod_v2_clean';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrations/Safety checks for old data
        if (!parsed.techData) parsed.techData = INITIAL_TECH_DATA;
        if (!parsed.profileData) parsed.profileData = INITIAL_PROFILE_DATA;
        if (!parsed.identityData) parsed.identityData = INITIAL_IDENTITY_DATA;
        if (!parsed.marketData) parsed.marketData = INITIAL_MARKET_DATA;
        if (!parsed.companySnapshots) parsed.companySnapshots = {};
        parsed.notifications = [];
        setState(parsed);
      } catch (e) {
        console.error('Failed to load state', e);
      }
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setState(prev => ({
      ...prev,
      notifications: [...prev.notifications, { id, type, message }]
    }));
    
    // Auto dismiss
    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  };

  const removeNotification = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id)
    }));
  };

  const login = (role: Role) => {
    let departmentId = undefined;
    let assignedBlocks: number[] = [];

    switch (role) {
      case 'OWNER': assignedBlocks = [1, 2, 3, 4, 5]; break;
      case 'DELEGATE': departmentId = 'temp-dept-id'; assignedBlocks = [5]; break; 
      case 'ADVISOR': assignedBlocks = [1, 2, 3, 4]; break;
      case 'EMPLOYEE': assignedBlocks = [5]; break;
    }

    setState(prev => {
      const newBlocks = { ...prev.blocks };
      if (role === 'OWNER') {
         ([1, 2, 3, 4, 5] as const).forEach(id => {
            if (newBlocks[id].status === 'LOCKED') newBlocks[id] = { ...newBlocks[id], status: 'TODO' };
         });
      }

      return {
        ...prev,
        user: {
          id: 'u1',
          name: role === 'OWNER' ? 'Mario Rossi' : 'Utente',
          email: 'user@wallnut.ai',
          role: role,
          departmentId,
          assignedBlocks,
          avatar: `https://ui-avatars.com/api/?name=${role}&background=random`
        },
        blocks: role === 'OWNER' ? newBlocks : prev.blocks
      };
    });
    addNotification('success', `Benvenuto ${role === 'OWNER' ? 'Mario' : 'Utente'}! Accesso effettuato.`);
  };

  const registerOwner = (userData: User, orgData: OrganizationStructure) => {
    const mainCompany = orgData.companies.find(c => c.isMain) || orgData.companies[0];
    const initialSnapshots: Record<string, CompanySnapshot> = {};
    
    // Initialize snapshots for all companies
    orgData.companies.forEach(c => {
      initialSnapshots[c.id] = {
        techData: INITIAL_TECH_DATA,
        profileData: INITIAL_PROFILE_DATA,
        identityData: INITIAL_IDENTITY_DATA,
        marketData: INITIAL_MARKET_DATA,
        blocks: INITIAL_BLOCKS,
        documents: {}
      };
    });

    // Ensure departments have members array initialized
    const cleanDepartments = orgData.departments.map(d => ({
      ...d,
      members: d.members || []
    }));

    setState(prev => ({
      ...prev,
      user: {
        ...userData,
        id: 'u-owner-' + Date.now(),
        role: 'OWNER',
        assignedBlocks: [1, 2, 3, 4, 5],
        avatar: `https://ui-avatars.com/api/?name=${userData.name}&background=0F172A&color=fff`
      },
      organization: { ...orgData, departments: cleanDepartments },
      company: {
        name: mainCompany.name,
        vat: mainCompany.vat,
        sector: mainCompany.outputType || 'General',
        employees: mainCompany.employeeCount || 'N/A',
        logo: mainCompany.logo // Transfer the logo
      },
      activeCompanyId: mainCompany.id,
      companySnapshots: initialSnapshots,
      onboardingComplete: true,
      // Initialize active block state
      blocks: {
        ...prev.blocks,
        1: { ...prev.blocks[1], status: 'TODO' },
        2: { ...prev.blocks[2], status: 'TODO' },
        3: { ...prev.blocks[3], status: 'TODO' },
        4: { ...prev.blocks[4], status: 'TODO' },
        5: { ...prev.blocks[5], status: 'TODO' },
      }
    }));
    addNotification('success', 'Workspace creato con successo!');
  };

  const switchCompany = (companyId: string) => {
    setState(prev => {
      // 1. Save current state to snapshot
      const currentSnapshot: CompanySnapshot = {
        techData: prev.techData,
        profileData: prev.profileData,
        identityData: prev.identityData,
        marketData: prev.marketData,
        blocks: prev.blocks,
        documents: prev.documents
      };

      const updatedSnapshots = {
        ...prev.companySnapshots,
        [prev.activeCompanyId]: currentSnapshot
      };

      // 2. Load new company data
      const targetSnapshot = updatedSnapshots[companyId] || {
        techData: INITIAL_TECH_DATA,
        profileData: INITIAL_PROFILE_DATA,
        identityData: INITIAL_IDENTITY_DATA,
        marketData: INITIAL_MARKET_DATA,
        blocks: INITIAL_BLOCKS,
        documents: {}
      };

      // 3. Find company details for UI
      const companyDetails = prev.organization?.companies.find(c => c.id === companyId);

      return {
        ...prev,
        activeCompanyId: companyId,
        companySnapshots: updatedSnapshots,
        // Load data into active state
        techData: targetSnapshot.techData,
        profileData: targetSnapshot.profileData,
        identityData: targetSnapshot.identityData,
        marketData: targetSnapshot.marketData,
        blocks: targetSnapshot.blocks,
        documents: targetSnapshot.documents,
        // Update active company info
        company: companyDetails ? {
          name: companyDetails.name,
          vat: companyDetails.vat,
          sector: companyDetails.outputType || 'General',
          employees: companyDetails.employeeCount || 'N/A',
          logo: companyDetails.logo
        } : prev.company
      };
    });
    addNotification('info', 'Contesto aziendale aggiornato.');
  };

  const copyBlockData = (blockId: number, sourceCompanyId: string) => {
    setState(prev => {
      const sourceSnapshot = prev.companySnapshots[sourceCompanyId];
      
      if (!sourceSnapshot) {
        addNotification('error', 'Dati azienda sorgente non trovati.');
        return prev;
      }

      let updatedState = { ...prev };

      switch (blockId) {
        case 1:
          updatedState.profileData = { ...sourceSnapshot.profileData };
          break;
        case 2:
          updatedState.identityData = { ...sourceSnapshot.identityData };
          break;
        case 3:
          updatedState.marketData = { ...sourceSnapshot.marketData };
          break;
        case 4:
          updatedState.techData = { ...sourceSnapshot.techData };
          break;
      }

      return updatedState;
    });
    addNotification('success', 'Dati importati con successo!');
  };

  const logout = () => {
    setState(prev => ({ ...prev, user: null }));
  };

  const updateCompany = (data: any) => {
    setState(prev => ({ ...prev, company: { ...prev.company, ...data } }));
  };

  const completeOnboarding = () => {
    setState(prev => ({ ...prev, onboardingComplete: true }));
  };

  const updateBlockProgress = (blockId: number, progress: number, status?: 'IN_PROGRESS' | 'COMPLETED') => {
    setState(prev => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [blockId]: {
          ...prev.blocks[blockId],
          progress,
          status: status || (progress === 100 ? 'COMPLETED' : 'IN_PROGRESS')
        }
      }
    }));
    if (status === 'COMPLETED') {
        addNotification('success', `Blocco ${blockId} completato!`);
    } else {
        addNotification('info', 'Progressi salvati in bozza.');
    }
  };

  const saveAnswer = (key: string, value: string) => {
    setState(prev => ({ ...prev, answers: { ...prev.answers, [key]: value } }));
  };

  const saveAudioAnswer = (key: string, base64: string) => {
    setState(prev => ({ ...prev, audioAnswers: { ...prev.audioAnswers, [key]: base64 } }));
  };

  const uploadDocument = (docId: string, fileName: string) => {
    setState(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docId]: {
          ...prev.documents[docId],
          docId,
          status: 'UPLOADED',
          file: fileName,
          uploadedAt: new Date().toISOString()
        }
      }
    }));
    addNotification('success', 'Documento caricato con successo!');
  };

  const assignDocument = (docId: string, assignee: { name: string, email: string, role: string }) => {
    setState(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docId]: {
          ...prev.documents[docId],
          docId,
          status: 'ASSIGNED',
          assignedTo: assignee
        }
      }
    }));
    addNotification('success', `Documento assegnato a ${assignee.name}`);
  };

  const markDocumentAsNotAvailable = (docId: string) => {
    setState(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docId]: {
          ...prev.documents[docId],
          docId,
          status: 'NOT_AVAILABLE'
        }
      }
    }));
    addNotification('info', 'Documento segnato come non disponibile.');
  };

  const addLibraryItem = (item: LibraryItem) => {
    setState(prev => ({ ...prev, library: [...prev.library, item] }));
  };

  const removeLibraryItem = (id: string) => {
    setState(prev => ({ ...prev, library: prev.library.filter(i => i.id !== id) }));
  };

  const updateTechData = (data: Partial<TechBlockData>) => {
    setState(prev => ({ ...prev, techData: { ...prev.techData, ...data } }));
  };

  const updateProfileData = (data: Partial<ProfileBlockData>) => {
    setState(prev => ({ ...prev, profileData: { ...prev.profileData, ...data } }));
  };

  const updateIdentityData = (data: Partial<IdentityBlockData>) => {
    setState(prev => ({ ...prev, identityData: { ...prev.identityData, ...data } }));
  };

  const updateMarketData = (data: Partial<MarketBlockData>) => {
    setState(prev => ({ ...prev, marketData: { ...prev.marketData, ...data } }));
  };

  const addTeamMember = (departmentId: string, member: TeamMember) => {
    setState(prev => {
      if (!prev.organization) return prev;
      
      const updatedDepartments = prev.organization.departments.map(dept => {
        if (dept.id === departmentId) {
          return {
            ...dept,
            members: [...dept.members, member]
          };
        }
        return dept;
      });

      return {
        ...prev,
        organization: {
          ...prev.organization,
          departments: updatedDepartments
        }
      };
    });
    addNotification('success', `Invito inviato a ${member.email}`);
  };

  const resetApp = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(INITIAL_STATE);
    window.location.reload();
  };

  return (
    <AppContext.Provider value={{ 
      ...state, 
      login, 
      logout, 
      registerOwner, 
      updateCompany, 
      completeOnboarding, 
      updateBlockProgress,
      saveAnswer,
      saveAudioAnswer,
      uploadDocument,
      assignDocument,
      markDocumentAsNotAvailable,
      addLibraryItem,
      removeLibraryItem,
      updateTechData,
      updateProfileData,
      updateIdentityData,
      updateMarketData,
      resetApp,
      addNotification,
      removeNotification,
      switchCompany,
      copyBlockData,
      addTeamMember
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
