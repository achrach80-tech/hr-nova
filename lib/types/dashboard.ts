// ============================================
// TALVIO - TYPES DASHBOARD
// Mise à jour: 2025-11-17
// ============================================

export interface Company {
  id: string
  nom: string
  subscription_plan: 'trial' | 'starter' | 'professional' | 'enterprise'
  etablissements?: Establishment[]
}

export interface Establishment {
  id: string
  nom: string
  is_headquarters: boolean
}

export interface WorkforceKPIs {
  etpTotal: number
  headcountActif: number
  nbEntrees: number
  nbSorties: number
  tauxTurnover: number
  pctCDI: number
  ageMoyen: number
  ancienneteMoyenne: number
  pctHommes: number
  pctFemmes: number
}

<<<<<<< HEAD
export interface PayrollKPIs {
  masseBrute: number
  coutTotal: number
  salaireMoyen: number
  coutMoyenFTE: number
  partVariable: number
  tauxCharges: number
  effetPrix: number
  effetVolume: number
  effetMix: number
  variationMasseSalariale: number
  variationMasseSalarialePct: number
  // ✅ AJOUT: Primes pour analyse intelligente
  primesExceptionnelles?: number
  primesMois13?: number
=======
export interface FinancialsData {
  // Totaux mensuels
  total_salaire_brut: number
  total_salaire_de_base: number
  total_primes_fixes: number
  total_primes_variables: number
  total_primes_exceptionnelles: number
  total_heures_supp_payees: number
  total_avantages_nature: number
  total_indemnites: number
  
  // Charges
  total_cotisations_sociales: number
  total_taxes_sur_salaire: number
  total_autres_charges: number
  total_masse_salariale_chargee: number
  
  // Moyennes
  salaire_brut_moyen: number
  salaire_net_moyen: number
  masse_salariale_moyenne: number
  
  // Métadonnées
  nombre_bulletins: number
  periode: string
>>>>>>> 5a39fde6b165f4356ff6e2e7c7c1f456aea77edb
}

export interface AbsenceKPIs {
  tauxAbsenteisme: number
  nbJoursAbsence: number
  nbAbsencesTotal: number
  dureeMoyenne: number
  nbSalariesAbsents: number
  nbJoursMaladie: number
}

export interface KPIData {
  workforce: WorkforceKPIs | null
  financials: FinancialsData | null
  absences: AbsenceKPIs | null
  previousMonthFinancials: PayrollKPIs | null
  previousYearFinancials: PayrollKPIs | null
  previousMonthWorkforce: WorkforceKPIs | null
  previousYearWorkforce: WorkforceKPIs | null
  previousMonthAbsences: AbsenceKPIs | null
  previousYearAbsences: AbsenceKPIs | null
}

// ✅ AJOUT: Interface pour les données waterfall
export interface WaterfallData {
  masseSalarialeM1: number
  effetPrix: number
  effetVolume: number
  masseSalarialeM: number
  primesExceptionnelles?: number
  primesMois13?: number
}

// ✅ AJOUT: Interface pour les résultats de diagnostic SQL
export interface WaterfallDiagnostic {
  periode: string
  masseBruteM: number
  masseBruteM1: number
  variationReelle: number
  variationStockee: number
  effetPrix: number
  effetVolume: number
  sommeEffets: number
  ecartCoherence: number
  status: 'OK' | 'INCOHERENT'
}

// ✅ AJOUT: Type pour les périodes
export type PeriodFormat = `${number}-${number}-01` // YYYY-MM-01

// ✅ AJOUT: Interface pour les alertes
export interface Alert {
  type: 'turnover' | 'absenteisme' | 'masse_salariale' | 'effectif' | 'coherence'
  severity: 'info' | 'warning' | 'error'
  message: string
  value?: number
  threshold?: number
}

// ✅ AJOUT: Interface pour les métadonnées de snapshot
export interface SnapshotMetadata {
  periode: string
  calculatedAt: string
  dataQualityScore: number
  dataCompleteness: number
  anomaliesDetectees: number
  calculationDurationMs?: number
}
// ============================================
// FICHIER 3 : lib/types/dashboard.ts
// ============================================
// ⚠️ AJOUTE ce code À LA FIN du fichier (ne supprime rien)
// Copie depuis la ligne suivante jusqu'à la fin
// ============================================

// Types pour Dual Waterfall v4.1
export interface WaterfallData {
  // Périodes
  periodeCourante: string
  periodePrecedente: string
  
  // Base M-1
  masseSalarialeM1: number
  coutMoyenM1: number
  etpM1: number
  
  // Effets
  effetPrix: number
  effetVolume: number
  variation: number
  variationPct: number
  
  // Base M
  masseSalarialeM: number
  coutMoyenM: number
  etpM: number
  
  // Primes
  primesExceptionnellesM: number
  primesExceptionnellesM1: number
  
  // Cohérence
  coherenceOk: boolean
  ecartCoherence: number
  ecartCoherencePct: number
  
  // Metadata
  recalculated: boolean
}

export interface DualWaterfallData {
  // Waterfall vs M-1 (mois précédent)
  vsMonthBefore: WaterfallData | null
  
  // Waterfall vs N-1 (même mois année dernière)
  vsYearBefore: WaterfallData | null
  
  // Disponibilité
  hasMonthBefore: boolean
  hasYearBefore: boolean
}