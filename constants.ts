
import { ProcessItem, DocumentDefinition } from './types';

export const ROLES = {
  OWNER: 'Owner',
  DELEGATE: 'Delegato',
  ADVISOR: 'Advisor',
  EMPLOYEE: 'Dipendente',
};

export const BLOCK_TITLES = {
  1: 'Profilo aziendale e struttura organizzativa',
  2: 'Dimensioni, ciclo di vita e identità',
  3: 'Ambiente Esterno',
  4: 'Tecnologia',
  5: 'Execution (Processi)',
};

export const MOCK_PROCESSES: ProcessItem[] = [
  { id: 'p1', code: '1.1.1', name: 'Gestione Risorse Umane - Onboarding', status: 'PENDING' },
  { id: 'p2', code: '1.2.1', name: 'Ciclo Attivo - Fatturazione', status: 'PENDING' },
  { id: 'p3', code: '2.1.4', name: 'Sviluppo Prodotto - Design Review', status: 'PENDING' },
  { id: 'p4', code: '3.0.1', name: 'Marketing - Campagne Social', status: 'PENDING' },
];

// Mapping specific Document IDs to Warning Messages from the PDF
export const NA_WARNINGS: Record<string, { notification: string, cta: string }> = {
  // Fatture XML (Mapped to 2.1)
  '2.1': {
    notification: "Senza le fatture di acquisto/vendita non possiamo analizzare i costi reali, individuare spese ottimizzabili o valutare incentivi legati ai costi sostenuti e ai flussi di incasso.",
    cta: "Carica le fatture per sbloccare analisi costi e liquidità"
  },
  // Bilancio Civilistico (2.22)
  '2.22': {
    notification: "Senza il bilancio non possiamo valutare la solidità economico-finanziaria dell’azienda né supportarti correttamente nell’accesso a credito e incentivi.",
    cta: "Carica il bilancio per sbloccare l’analisi finanziaria completa"
  },
  // Bilancio Analitico (2.37)
  '2.37': {
    notification: "Senza il bilancio analitico non possiamo attribuire correttamente margini e costi alle attività né simulare impatti economici realistici.",
    cta: "Carica il bilancio analitico per migliorare la precisione delle analisi"
  },
  // Report Aging Crediti (2.16)
  '2.16': {
    notification: "Senza questo documento non possiamo valutare il rischio legato ai ritardi di pagamento dei clienti né l’impatto sulla liquidità.",
    cta: "Carica il report crediti per sbloccare l’analisi del rischio clienti"
  },
  // Report Aging Debiti (2.21)
  '2.21': {
    notification: "Senza il report debiti non possiamo analizzare correttamente l’equilibrio tra incassi e pagamenti né individuare tensioni di cassa.",
    cta: "Carica il report debiti per completare l’analisi di liquidità"
  },
  // LUL (2.2)
  '2.2': {
    notification: "Senza il Libro Unico del Lavoro non possiamo valutare incentivi su assunzioni, formazione o costo del lavoro.",
    cta: "Carica il LUL per sbloccare incentivi su lavoro e formazione"
  },
  // DURC (2.31)
  '2.31': {
    notification: "Senza un DURC valido non possiamo verificare l’accesso a bandi, incentivi o agevolazioni che richiedono regolarità contributiva.",
    cta: "Carica il DURC per verificare le opportunità di incentivo attivabili"
  },
  // Piano Industriale (1.10)
  '1.10': {
    notification: "Senza i piani di sviluppo non possiamo allineare incentivi e scenari di crescita alle reali priorità strategiche dell’azienda.",
    cta: "Carica i piani di sviluppo per sbloccare le opportunità future"
  },
  // CV Dipendenti (3.37)
  '3.37': {
    notification: "Senza i CV non possiamo verificare l’ammissibilità a incentivi legati a competenze, profili professionali o requisiti anagrafici.",
    cta: "Carica i CV per sbloccare gli incentivi sul personale"
  },
  // Training Plan (3.14)
  '3.14': {
    notification: "Senza un piano formativo non possiamo valutare correttamente incentivi e fondi dedicati alla formazione.",
    cta: "Carica il piano formativo per sbloccare gli incentivi sulla formazione"
  },
  // Company Profile (4.1)
  '4.1': {
    notification: "Senza una descrizione chiara dell’azienda e dell’offerta non possiamo analizzare il posizionamento competitivo né le opportunità di crescita.",
    cta: "Carica il company profile per sbloccare l’analisi di mercato"
  },
  // Sales Deck (4.15)
  '4.15': {
    notification: "Senza i materiali commerciali non possiamo valutare correttamente messaggi, proposta di valore e coerenza con il mercato.",
    cta: "Carica i materiali per completare l’analisi di posizionamento"
  },
  // Sito Web (Assuming 4.22 placeholder or mapped to generic marketing)
  // Contratti vendita (2.14, 6.15)
  '2.14': {
    notification: "Senza i contratti di vendita non possiamo valutare vincoli, dipendenze critiche o rischi legati ai principali clienti.",
    cta: "Carica i contratti per sbloccare l’analisi del rischio clienti"
  },
  '6.15': {
    notification: "Senza i contratti di vendita non possiamo valutare vincoli, dipendenze critiche o rischi legati ai principali clienti.",
    cta: "Carica i contratti per sbloccare l’analisi del rischio clienti"
  },
  // Licenze Software (6.11)
  '6.11': {
    notification: "Senza i contratti software non possiamo analizzare correttamente rinnovi, penali o licenze inutilizzate.",
    cta: "Carica i contratti software per ottimizzare i costi IT"
  },
  // Elenco strumenti (Assuming 5.7 IT Asset Management)
  '5.7': {
    notification: "Senza l’elenco degli strumenti utilizzati non possiamo confrontare costi, utilizzo reale e possibili ridondanze.",
    cta: "Completa l’elenco strumenti per sbloccare l’analisi IT"
  },
  // Certificazioni (6.2)
  '6.2': {
    notification: "Senza queste certificazioni non possiamo valutare il livello di conformità né l’impatto su clienti strutturati e accesso al credito.",
    cta: "Carica le certificazioni per sbloccare l’analisi ESG"
  },
  // Sicurezza / GDPR (6.4)
  '6.4': {
    notification: "Senza la documentazione normativa non possiamo valutare rischi di non conformità né impatti reputazionali o contrattuali.",
    cta: "Carica la documentazione per completare l’analisi di compliance"
  },
  // Codice Etico / 231 (6.3)
  '6.3': {
    notification: "Senza questi documenti non possiamo valutare pienamente il profilo ESG e i requisiti richiesti da clienti e partner strutturati.",
    cta: "Carica la documentazione di governance per completare l’analisi ESG"
  }
};

export const DOCUMENTS_DB: DocumentDefinition[] = [
  // 1.0 Strategy & Governance
  { id: '1.1', areaId: 'strategy', areaName: 'Strategy & Governance', code: '1.1', name: 'Registro Verbali CdA', priority: 'COULD', versionReq: 'Storico completo' },
  { id: '1.2', areaId: 'strategy', areaName: 'Strategy & Governance', code: '1.2', name: 'Libro Soci', priority: 'WOULD', versionReq: 'Storico completo' },
  { id: '1.3', areaId: 'strategy', areaName: 'Strategy & Governance', code: '1.3', name: 'Libro Assemblee', priority: 'COULD', versionReq: 'Storico completo' },
  { id: '1.4', areaId: 'strategy', areaName: 'Strategy & Governance', code: '1.4', name: 'Libro CdA', priority: 'COULD', versionReq: 'Storico completo' },
  { id: '1.5', areaId: 'strategy', areaName: 'Strategy & Governance', code: '1.5', name: 'Libro Collegio Sindacale', priority: 'COULD', versionReq: 'Storico completo' },
  { id: '1.6', areaId: 'strategy', areaName: 'Strategy & Governance', code: '1.6', name: 'Registro Revisori', priority: 'WOULD', versionReq: 'Storico completo' },
  { id: '1.7', areaId: 'strategy', areaName: 'Strategy & Governance', code: '1.7', name: 'Statuto Societario', priority: 'MUST', versionReq: 'Storico completo' },
  { id: '1.8', areaId: 'strategy', areaName: 'Strategy & Governance', code: '1.8', name: 'Atto costitutivo', priority: 'MUST', versionReq: 'Unico documento' },
  { id: '1.9', areaId: 'strategy', areaName: 'Strategy & Governance', code: '1.9', name: 'Libro delle delibere assembleari', priority: 'COULD', versionReq: 'Storico completo' },
  { id: '1.10', areaId: 'strategy', areaName: 'Strategy & Governance', code: '1.10', name: 'Piano Industriale', priority: 'MUST', versionReq: 'Ultima versione' }, // CHANGED TO MUST
  { id: '1.11', areaId: 'strategy', areaName: 'Strategy & Governance', code: '1.11', name: 'Analisi SWOT', priority: 'WOULD', versionReq: 'Ultima versione' },
  { id: '1.12', areaId: 'strategy', areaName: 'Strategy & Governance', code: '1.12', name: 'Analisi Portafoglio (BCG Matrix)', priority: 'WOULD', versionReq: 'Ultima versione' },

  // 2.0 AFC
  { id: '2.1', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.1', name: 'Fatture XML attive e passive', priority: 'MUST', versionReq: 'Ultimi 3 anni' }, // CHANGED TO MUST
  { id: '2.2', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.2', name: 'Libro unico del lavoro', priority: 'MUST', versionReq: 'Ultimi 3 anni' },
  { id: '2.3', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.3', name: 'Registro Operazioni Contabili (LIBRO GIORNALE)', priority: 'MUST', versionReq: 'Ultimi 3 anni' },
  { id: '2.4', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.4', name: 'Dichiarazioni annuali IVA', priority: 'MUST', versionReq: 'Ultimi 3 anni' },
  { id: '2.5', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.5', name: 'Dichiarazione annuale IRES', priority: 'MUST', versionReq: 'Ultimi 3 anni' },
  { id: '2.6', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.6', name: 'Dichiarazione annuale IRAP', priority: 'SHOULD', versionReq: 'Ultimi 3 anni' },
  { id: '2.7', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.7', name: 'Dichiarazione 770', priority: 'MUST', versionReq: 'Ultimi 3 anni' },
  { id: '2.8', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.8', name: 'Registro IVA', priority: 'MUST', versionReq: 'Ultimi 3 anni' },
  { id: '2.9', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.9', name: 'Libro cespiti', priority: 'MUST', versionReq: 'Ultimi 5 anni' },
  { id: '2.10', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.10', name: 'Ricevute digitalizzate / OCR', priority: 'COULD', versionReq: 'Ultimi 12 mesi' },
  { id: '2.11', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.11', name: 'Template Fattura Clienti', priority: 'MUST', versionReq: 'Ultima versione' },
  { id: '2.12', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.12', name: 'Template Fattura Proforma', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '2.13', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.13', name: 'Template Nota di Credito', priority: 'MUST', versionReq: 'Ultima versione' },
  { id: '2.14', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.14', name: 'Contratto Servizio finale', priority: 'MUST', versionReq: 'Ultima versione' }, // CHANGED TO MUST
  { id: '2.15', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.15', name: 'Ordine Cliente', priority: 'SHOULD', versionReq: 'Ultimi 12 mesi' },
  { id: '2.16', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.16', name: 'Report Aging Crediti', priority: 'MUST', versionReq: 'Ultimi 3 anni' }, // CHANGED TO MUST
  { id: '2.17', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.17', name: 'Richiesta d’Acquisto (RDA)', priority: 'SHOULD', versionReq: 'Ultimi 12 mesi' },
  { id: '2.18', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.18', name: 'Ordine d’Acquisto (PO)', priority: 'MUST', versionReq: 'Ultimi 12 mesi' },
  { id: '2.19', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.19', name: 'Capitolato Tecnico', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '2.20', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.20', name: 'Contratto Fornitura', priority: 'MUST', versionReq: 'Ultima versione' },
  { id: '2.21', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.21', name: 'Report Aging Debiti', priority: 'MUST', versionReq: 'Ultimi 3 anni' },
  { id: '2.22', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.22', name: 'Bilancio Civilistico XBRL', priority: 'MUST', versionReq: 'Ultimi 3 anni' },
  { id: '2.23', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.23', name: 'Report Revisori', priority: 'MUST', versionReq: 'Ultimi 3 anni' },
  { id: '2.24', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.24', name: 'Contratto di Conto Corrente Aziendale', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '2.25', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.25', name: 'Contratto Anticipo Fatture', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '2.26', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.26', name: 'Contratto Factoring', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '2.27', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.27', name: 'Fideiussioni', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '2.28', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.28', name: 'Contratto Mutuo / Prestito', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '2.29', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.29', name: 'Collegamento banche (PSD 2)', priority: 'SHOULD', versionReq: 'Ultima configurazione' },
  { id: '2.30', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.30', name: 'Centrale Rischi Banca d\'Italia', priority: 'SHOULD', versionReq: 'Ultimi 12 mesi + 3 anni' },
  { id: '2.31', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.31', name: 'DURC', priority: 'MUST', versionReq: 'Ultimo disponibile' }, // CHANGED TO MUST
  { id: '2.32', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.32', name: 'Estratto agenzia entrate e riscossione', priority: 'SHOULD', versionReq: 'Ultimi 3 anni' },
  { id: '2.33', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.33', name: 'Elenco avviso bonari', priority: 'SHOULD', versionReq: 'Ultimi 3 anni' },
  { id: '2.34', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.34', name: 'Prospetto Nota contabile stipendi', priority: 'SHOULD', versionReq: 'Ultimi 3 anni' },
  { id: '2.35', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.35', name: 'Documentazione di aiuti di stato', priority: 'SHOULD', versionReq: 'Ultimi 5 anni' },
  { id: '2.36', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.36', name: 'Pricing Model', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '2.37', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.37', name: 'Bilancio Analitico (o di verifica)', priority: 'MUST', versionReq: 'Ultimi 3 anni' },
  { id: '2.38', areaId: 'afc', areaName: 'Amministrazione, Finanza & Controllo', code: '2.38', name: 'Modulistica ISA', priority: 'MUST', versionReq: 'Ultima versione' },

  // 3.0 HR
  { id: '3.1', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.1', name: 'Documento Identità e CF', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '3.2', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.2', name: 'Contratto di Assunzione', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '3.3', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.3', name: 'Allegati Assunzione (privacy, consensi)', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '3.4', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.4', name: 'Organigramma HR', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '3.5', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.5', name: 'Policy Ferie e Permessi', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '3.6', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.6', name: 'Policy Timesheet', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '3.7', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.7', name: 'F24', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '3.8', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.8', name: 'CU Certificazione Unica', priority: 'SHOULD', versionReq: 'Ultimi 3 anni' },
  { id: '3.9', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.9', name: 'UNIEMENS', priority: 'SHOULD', versionReq: 'Ultimi 3 anni' },
  { id: '3.10', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.10', name: 'Prospetto costo del lavoro', priority: 'SHOULD', versionReq: 'Ultimi 3 anni' },
  { id: '3.11', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.11', name: 'Regolamento Welfare Aziendale', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '3.12', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.12', name: 'Policy Auto Aziendali', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '3.13', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.13', name: 'Annuncio di Lavoro (formato web)', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '3.14', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.14', name: 'Training Plan Annuale', priority: 'MUST', versionReq: 'Ultima versione' }, // CHANGED TO MUST
  { id: '3.15', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.15', name: 'Catalogo Corsi Interni/Esterni', priority: 'COULD', versionReq: 'Ultima versione' },
  { id: '3.16', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.16', name: 'Policy Comunicazioni Istituzionali', priority: 'COULD', versionReq: 'Ultima versione' },
  { id: '3.17', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.17', name: 'Accordi Sindacali', priority: 'SHOULD', versionReq: 'Storico completo' },
  { id: '3.18', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.18', name: 'Contrattazione Integrativa', priority: 'SHOULD', versionReq: 'Ultimi 3 anni' },
  { id: '3.19', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.19', name: 'Comunicazione Obbligatoria a OO.SS.', priority: 'SHOULD', versionReq: 'Ultimi 3 anni' },
  { id: '3.20', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.20', name: 'Documentazione Rappresentanze Sindacali', priority: 'SHOULD', versionReq: 'Ultimi 3 anni' },
  { id: '3.21', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.21', name: 'Informativa Privacy Dipendenti', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '3.22', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.22', name: 'Codice di Condotta', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '3.23', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.23', name: 'Policy Orario di Lavoro', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '3.24', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.24', name: 'Policy Straordinari', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '3.25', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.25', name: 'Salary Structure Grid', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '3.26', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.26', name: 'MBO Policy', priority: 'SHOULD', versionReq: 'Ultimi 3 anni' },
  { id: '3.27', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.27', name: 'MBO Scheme per Livelli/Unità', priority: 'SHOULD', versionReq: 'Ultimi 3 anni' },
  { id: '3.28', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.28', name: 'Incentive Plan Template', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '3.29', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.29', name: 'Annual Bonus Calculation Sheet', priority: 'SHOULD', versionReq: 'Ultimi 3 anni' },
  { id: '3.30', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.30', name: 'Sales Commission Plan', priority: 'SHOULD', versionReq: 'Ultimi 3 anni' },
  { id: '3.31', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.31', name: 'Polizza assicurativa sanitaria', priority: 'COULD', versionReq: 'Ultima versione' },
  { id: '3.32', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.32', name: 'Polizza infortuni', priority: 'COULD', versionReq: 'Ultima versione' },
  { id: '3.33', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.33', name: 'Policy PC/Telefono Aziendale', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '3.34', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.34', name: 'Piano Welfare Annuale', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '3.35', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.35', name: 'Equity Incentive Plan', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '3.36', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.36', name: 'Registro Trattamenti HR', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '3.37', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.37', name: 'CV Dipendenti', priority: 'MUST', versionReq: 'Ultima versione' },
  { id: '3.38', areaId: 'hr', areaName: 'Risorse Umane (HR)', code: '3.38', name: 'Link profilli LinkedIn', priority: 'MUST', versionReq: 'Ultima versione' },

  // 4.0 Sales & Marketing
  { id: '4.1', areaId: 'marketing', areaName: 'Commerciale & Marketing', code: '4.1', name: 'Company profile', priority: 'MUST', versionReq: 'Ultima versione' },
  { id: '4.2', areaId: 'marketing', areaName: 'Commerciale & Marketing', code: '4.2', name: 'Esempi DEM', priority: 'MUST', versionReq: 'Ultima versione' },
  { id: '4.3', areaId: 'marketing', areaName: 'Commerciale & Marketing', code: '4.3', name: 'Esempi Newsletter', priority: 'MUST', versionReq: 'Ultima versione' },
  { id: '4.4', areaId: 'marketing', areaName: 'Commerciale & Marketing', code: '4.4', name: 'Export XLS campagne', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '4.5', areaId: 'marketing', areaName: 'Commerciale & Marketing', code: '4.5', name: 'Export XLS analytics', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '4.6', areaId: 'marketing', areaName: 'Commerciale & Marketing', code: '4.6', name: 'Template Offerta Tecnica', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '4.7', areaId: 'marketing', areaName: 'Commerciale & Marketing', code: '4.7', name: 'Template Offerta Economica', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '4.8', areaId: 'marketing', areaName: 'Commerciale & Marketing', code: '4.8', name: 'SEO & SEM Strategy Document', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '4.9', areaId: 'marketing', areaName: 'Commerciale & Marketing', code: '4.9', name: 'Paid Media Strategy', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '4.10', areaId: 'marketing', areaName: 'Commerciale & Marketing', code: '4.10', name: 'KPI Campaign Report', priority: 'SHOULD', versionReq: 'Ultimi 3 anni' },
  { id: '4.11', areaId: 'marketing', areaName: 'Commerciale & Marketing', code: '4.11', name: 'Social Media Strategy Template', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '4.12', areaId: 'marketing', areaName: 'Commerciale & Marketing', code: '4.12', name: 'Social Media Metrics Dashboard', priority: 'SHOULD', versionReq: 'Ultimi 3 anni' },
  { id: '4.13', areaId: 'marketing', areaName: 'Commerciale & Marketing', code: '4.13', name: 'Brand Book', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '4.14', areaId: 'marketing', areaName: 'Commerciale & Marketing', code: '4.14', name: 'Template Presentazione Aziendale', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '4.15', areaId: 'marketing', areaName: 'Commerciale & Marketing', code: '4.15', name: 'Sales Deck Template', priority: 'MUST', versionReq: 'Ultima versione' }, // CHANGED TO MUST
  { id: '4.16', areaId: 'marketing', areaName: 'Commerciale & Marketing', code: '4.16', name: 'Press Kit', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '4.17', areaId: 'marketing', areaName: 'Commerciale & Marketing', code: '4.17', name: 'Blog Post Template', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '4.18', areaId: 'marketing', areaName: 'Commerciale & Marketing', code: '4.18', name: 'Case Study Template', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '4.19', areaId: 'marketing', areaName: 'Commerciale & Marketing', code: '4.19', name: 'Email Newsletter Template', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '4.20', areaId: 'marketing', areaName: 'Commerciale & Marketing', code: '4.20', name: 'Partnership Agreement Template', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '4.21', areaId: 'marketing', areaName: 'Commerciale & Marketing', code: '4.21', name: 'Market Research Report', priority: 'SHOULD', versionReq: 'Ultima versione' },

  // 5.0 IT
  { id: '5.1', areaId: 'it', areaName: 'IT & Digital', code: '5.1', name: 'Disaster Recovery Plan (DRP)', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '5.2', areaId: 'it', areaName: 'IT & Digital', code: '5.2', name: 'Network Design Architecture', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '5.3', areaId: 'it', areaName: 'IT & Digital', code: '5.3', name: 'IT Risk Assessment Template', priority: 'SHOULD', versionReq: 'Ultimi 3 anni' },
  { id: '5.4', areaId: 'it', areaName: 'IT & Digital', code: '5.4', name: 'Vulnerability Assessment Report', priority: 'SHOULD', versionReq: 'Ultimi 3 anni' },
  { id: '5.5', areaId: 'it', areaName: 'IT & Digital', code: '5.5', name: 'Vulnerability Scanning Schedule', priority: 'SHOULD', versionReq: 'Ultimi 12-24 mesi' },
  { id: '5.6', areaId: 'it', areaName: 'IT & Digital', code: '5.6', name: 'VPN Configuration & Access Control', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '5.7', areaId: 'it', areaName: 'IT & Digital', code: '5.7', name: 'IT Asset Management Policy', priority: 'MUST', versionReq: 'Ultima versione' }, // CHANGED TO MUST
  { id: '5.8', areaId: 'it', areaName: 'IT & Digital', code: '5.8', name: 'Backup & Recovery Policy', priority: 'SHOULD', versionReq: 'Ultima versione' },
  
  // 6.0 Legal
  { id: '6.1', areaId: 'legal', areaName: 'Legal & IP', code: '6.1', name: 'Industry-Specific Licensing Applications', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '6.2', areaId: 'legal', areaName: 'Legal & IP', code: '6.2', name: 'Compliance Certificates and Approvals', priority: 'MUST', versionReq: 'Ultimi 3-5 anni' }, // CHANGED TO MUST
  { id: '6.3', areaId: 'legal', areaName: 'Legal & IP', code: '6.3', name: 'Codice Etico Aziendale', priority: 'MUST', versionReq: 'Ultima versione' },
  { id: '6.4', areaId: 'legal', areaName: 'Legal & IP', code: '6.4', name: 'GDPR Compliance Documentation', priority: 'MUST', versionReq: 'Ultima versione' }, // CHANGED TO MUST
  { id: '6.5', areaId: 'legal', areaName: 'Legal & IP', code: '6.5', name: 'Anti-Money Laundering (AML) Policy', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '6.6', areaId: 'legal', areaName: 'Legal & IP', code: '6.6', name: 'Health & Safety Compliance Guidelines', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '6.7', areaId: 'legal', areaName: 'Legal & IP', code: '6.7', name: 'Whistleblowing Procedure', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '6.8', areaId: 'legal', areaName: 'Legal & IP', code: '6.8', name: 'Contratto Quadro (MSA) Template', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '6.9', areaId: 'legal', areaName: 'Legal & IP', code: '6.9', name: 'Contratto di Fornitura Standard', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '6.10', areaId: 'legal', areaName: 'Legal & IP', code: '6.10', name: 'Contratto di Prestazione Servizi', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '6.11', areaId: 'legal', areaName: 'Legal & IP', code: '6.11', name: 'Contratto di Licenza Software', priority: 'MUST', versionReq: 'Ultima versione' }, // CHANGED TO MUST
  { id: '6.12', areaId: 'legal', areaName: 'Legal & IP', code: '6.12', name: 'Contratto di Subappalto', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '6.13', areaId: 'legal', areaName: 'Legal & IP', code: '6.13', name: 'Accordo di Riservatezza (NDA)', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '6.14', areaId: 'legal', areaName: 'Legal & IP', code: '6.14', name: 'Contratto di Partnership Template', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '6.15', areaId: 'legal', areaName: 'Legal & IP', code: '6.15', name: 'Contratto di Vendita Template', priority: 'MUST', versionReq: 'Ultima versione' }, // CHANGED TO MUST
  { id: '6.16', areaId: 'legal', areaName: 'Legal & IP', code: '6.16', name: 'Terms & Conditions di Vendita', priority: 'SHOULD', versionReq: 'Ultima versione' },
  { id: '6.17', areaId: 'legal', areaName: 'Legal & IP', code: '6.17', name: 'Brevetti, licenze, marchi', priority: 'MUST', versionReq: 'Storico completo' },
];
