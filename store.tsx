import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, User, Role, LibraryItem, Company, OrganizationStructure, DocumentState, TechBlockData, ProfileBlockData, IdentityBlockData, MarketBlockData, Notification } from './types';

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
  keyFigures: '',
  informalRoles: '',
  collaboratingTeams: '',
  externalPartners: '',
  distinctiveSkills: '',
  missingSkills: '',
  individualRelationship: '',
  idealEnvironment: '',
  autonomyVsResults: '',
  rewardedBehaviors: '',
  toleratedBehaviors: '',
  internalCommunication: '',
  meetingManagement: '',
  workLifeBalance: '',
  diversityValue: '',
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
  directCompetitors: '',
  differentiation: '',
  monitoringStrategy: '',
  observedModels: '',
  mainCustomers: '',
  idealCustomerPattern: '',
  targetEvolution: '',
  attractiveness: '',
  strategicCriteria: '',
  growthSegments: '',
  customerRelationship: '',
  impactingRegulations: '',
  complianceUpdate: '',
  developmentConditioning: '',
  complianceRoles: '',
  recentChanges: '',
  riskAreas: '',
  feedbackChannels: '',
  feedbackCollection: '',
  feedbackAnalysis: '',
  negativeResponseStrategy: '',
  recurringPerceptions: '',
  reputationManagement: '',
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

const INITIAL_STATE: AppState = {
  user: null,
  company: null,
  organization: null,
  onboardingComplete: false,
  blocks: {
    1: { id: 1, status: 'TODO', progress: 0 },
    2: { id: 2, status: 'LOCKED', progress: 0 },
    3: { id: 3, status: 'LOCKED', progress: 0 },
    4: { id: 4, status: 'LOCKED', progress: 0 },
    5: { id: 5, status: 'LOCKED', progress: 0 },
  },
  answers: {},
  documents: {},
  library: [],
  techData: INITIAL_TECH_DATA,
  profileData: INITIAL_PROFILE_DATA,
  identityData: INITIAL_IDENTITY_DATA,
  marketData: INITIAL_MARKET_DATA,
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wallnut_state_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure data objects exist if loading from an older state version
        if (!parsed.techData) parsed.techData = INITIAL_TECH_DATA;
        if (!parsed.profileData) parsed.profileData = INITIAL_PROFILE_DATA;
        if (!parsed.identityData) parsed.identityData = INITIAL_IDENTITY_DATA;
        if (!parsed.marketData) parsed.marketData = INITIAL_MARKET_DATA;
        if (!parsed.audioAnswers) parsed.audioAnswers = {};
        // Don't load notifications from storage
        parsed.notifications = [];
        setState(parsed);
      } catch (e) {
        console.error('Failed to load state', e);
      }
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('wallnut_state_v3', JSON.stringify(state));
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
    // Determine permissions based on role for demo
    let departmentId = undefined;
    let assignedBlocks: number[] = [];

    switch (role) {
      case 'OWNER':
        assignedBlocks = [1, 2, 3, 4, 5]; // Access everything
        break;
      case 'DELEGATE':
        departmentId = 'hr'; // Demo: Delegate is HR Manager
        assignedBlocks = [5]; // Only Execution/Processes
        break;
      case 'ADVISOR':
        assignedBlocks = [1, 2, 3, 4]; // Strategy blocks
        break;
      case 'EMPLOYEE':
        assignedBlocks = [5]; // Only interviews
        break;
    }

    setState(prev => {
      // If Owner, ensure all blocks are unlocked (TODO) instead of LOCKED
      const newBlocks = { ...prev.blocks };
      if (role === 'OWNER') {
         ([1, 2, 3, 4, 5] as const).forEach(id => {
            if (newBlocks[id].status === 'LOCKED') {
               newBlocks[id] = { ...newBlocks[id], status: 'TODO' };
            }
         });
      }

      return {
        ...prev,
        user: {
          id: 'u1',
          name: role === 'OWNER' ? 'Mario Rossi' : role === 'DELEGATE' ? 'Laura Bianchi' : role === 'ADVISOR' ? 'Carlo Verdi' : 'Giulia Neri',
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
    setState(prev => ({
      ...prev,
      user: {
        ...userData,
        id: 'u-owner-' + Date.now(),
        role: 'OWNER',
        assignedBlocks: [1, 2, 3, 4, 5],
        avatar: `https://ui-avatars.com/api/?name=${userData.name}&background=0F172A&color=fff`
      },
      organization: orgData,
      company: {
        name: mainCompany.name,
        vat: mainCompany.vat,
        sector: mainCompany.outputType || 'General',
        employees: mainCompany.employeeCount || 'N/A'
      },
      onboardingComplete: true,
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
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [key]: value }
    }));
  };

  const saveAudioAnswer = (key: string, base64: string) => {
    setState(prev => ({
      ...prev,
      audioAnswers: { ...prev.audioAnswers, [key]: base64 }
    }));
  };

  const updateTechData = (data: Partial<TechBlockData>) => {
    setState(prev => ({
      ...prev,
      techData: { ...prev.techData, ...data }
    }));
  };

  const updateProfileData = (data: Partial<ProfileBlockData>) => {
    setState(prev => ({
      ...prev,
      profileData: { ...prev.profileData, ...data }
    }));
  };

  const updateIdentityData = (data: Partial<IdentityBlockData>) => {
    setState(prev => ({
      ...prev,
      identityData: { ...prev.identityData, ...data }
    }));
  };

  const updateMarketData = (data: Partial<MarketBlockData>) => {
    setState(prev => ({
      ...prev,
      marketData: { ...prev.marketData, ...data }
    }));
  };

  const uploadDocument = (docId: string, fileName: string) => {
    setState(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docId]: {
          docId,
          status: 'UPLOADED',
          file: fileName,
          uploadedAt: new Date().toISOString()
        }
      }
    }));
    addNotification('success', 'Documento caricato correttamente.');
  };

  const assignDocument = (docId: string, assignee: { name: string, email: string, role: string }) => {
    setState(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docId]: {
          docId,
          status: 'ASSIGNED',
          assignedTo: assignee
        }
      }
    }));
    addNotification('success', `Task assegnato a ${assignee.name}`);
  };

  const markDocumentAsNotAvailable = (docId: string) => {
    setState(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docId]: {
          docId,
          status: 'NOT_AVAILABLE'
        }
      }
    }));
    addNotification('info', 'Documento segnato come non disponibile.');
  };

  const addLibraryItem = (item: LibraryItem) => {
    setState(prev => ({
      ...prev,
      library: [...prev.library, item]
    }));
    addNotification('success', 'Risorsa aggiunta alla Library');
  };

  const removeLibraryItem = (id: string) => {
    setState(prev => ({
      ...prev,
      library: prev.library.filter(i => i.id !== id)
    }));
    addNotification('info', 'Risorsa rimossa');
  };

  const resetApp = () => {
    localStorage.removeItem('wallnut_state_v3');
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
      removeNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
