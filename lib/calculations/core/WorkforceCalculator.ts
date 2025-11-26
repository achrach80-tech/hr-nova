/**
 * 👥 WORKFORCE CALCULATOR v4.1 COMPLET
 * 
 * CORRECTION v4.1: Calcul effectif_debut_mois et effectif_moyen RÉPARÉ
 * 
 * CHANGEMENT v4.1:
 * - effectif_debut_mois: calculé depuis mois précédent (au lieu de copier effectif_fin)
 * - effectif_moyen: moyenne entre debut et fin (au lieu de copier effectif_fin)
 * - FIX: Turnover maintenant calculé correctement (plus de division par zéro)
 * 
 * CONSERVÉ v4.0:
 * - taux_turnover = calcul MENSUEL (5.7%) au lieu d'annualisé (67.9%)
 * - taux_turnover_mensuel (NOUVEAU) = taux réel du mois
 * - taux_turnover_annualise (NOUVEAU) = projection × 12
 * - Seuils ajustés dans generateAnalysis
 * - Logs console pour debugging
 * 
 * @module WorkforceCalculator
 * @version 4.1-CORRIGÉ
 */


interface EmployeeData {
  matricule: string
  periode: string
  sexe?: string | null
  date_naissance?: string | null
  date_entree?: string | null
  date_sortie?: string | null
  type_contrat?: string
  temps_travail?: number
  intitule_poste?: string
  statut_emploi?: string
  [key: string]: any
}


export interface WorkforceMetrics {
  // ============================================
  // EFFECTIFS
  // ============================================
  effectif_debut_mois: number
  effectif_fin_mois: number
  effectif_moyen: number
  
  // ============================================
  // ETP (Équivalent Temps Plein)
  // ============================================
  etp_debut_mois: number
  etp_fin_mois: number
  etp_moyen: number
  
  // ============================================
  // MOUVEMENTS
  // ============================================
  nb_entrees: number
  nb_sorties: number
  nb_sorties_volontaires: number
  nb_sorties_involontaires: number
  
  // ============================================
  // TURNOVER v4.0 CORRIGÉ
  // ============================================
  taux_turnover: number                      // Par défaut = MENSUEL
  taux_turnover_volontaire: number           // Par défaut = MENSUEL
  taux_turnover_mensuel: number              // NOUVEAU - Taux réel
  taux_turnover_annualise: number            // NOUVEAU - Projection
  taux_turnover_volontaire_mensuel: number   // NOUVEAU
  taux_turnover_volontaire_annualise: number // NOUVEAU
  
  // ============================================
  // TYPES DE CONTRATS
  // ============================================
  nb_cdi: number
  nb_cdd: number
  nb_alternance: number
  nb_stage: number
  nb_interim: number
  
  // ============================================
  // POURCENTAGES CONTRATS
  // ============================================
  pct_cdi: number
  pct_cdd: number
  pct_alternance: number
  pct_stage: number
  pct_precarite: number
}


export class WorkforceCalculator {
  
  /**
   * Calcule tous les indicateurs de workforce pour une période
   * 
   * @param employees - Liste complète des employés de la période
   * @param period - Période au format YYYY-MM-DD
   * @param previousMonthEmployees - Employés du mois précédent (pour calcul effectif_debut)
   * @returns WorkforceMetrics complet
   */
  calculate(
    employees: EmployeeData[],
    period: string,
    previousMonthEmployees?: EmployeeData[]
  ): WorkforceMetrics {
    
    console.group(`👥 WorkforceCalculator v4.1 - ${period}`)
    
    // Validation entrée
    if (!employees || employees.length === 0) {
      console.warn('⚠️ WorkforceCalculator: Aucun employé fourni')
      console.groupEnd()
      return this.getDefaultMetrics()
    }
    
    console.log(`📊 ${employees.length} lignes employés`)
    
    const periodDate = new Date(period)
    
    // Filtrer employés actifs à la fin du mois
    const activeEmployees = employees.filter(e => e.statut_emploi === 'Actif')
    console.log(`✅ ${activeEmployees.length} employés actifs`)
    
    // ============================================
    // EFFECTIFS - CORRECTION v4.1
    // ============================================
    const effectif_fin_mois = activeEmployees.length
    
    // ✅ CORRECTION: Calculer effectif_debut depuis mois précédent
    let effectif_debut_mois = 0
    if (previousMonthEmployees && previousMonthEmployees.length > 0) {
      effectif_debut_mois = previousMonthEmployees.filter(e => e.statut_emploi === 'Actif').length
    } else {
      // Si pas de mois précédent, utiliser effectif_fin
      effectif_debut_mois = effectif_fin_mois
    }
    
    // ✅ CORRECTION: Calculer effectif_moyen = moyenne entre debut et fin
    const effectif_moyen = effectif_debut_mois > 0
      ? (effectif_debut_mois + effectif_fin_mois) / 2
      : effectif_fin_mois
    
    console.log(`👥 Effectif: Début=${effectif_debut_mois}, Fin=${effectif_fin_mois}, Moyen=${effectif_moyen.toFixed(2)}`)
    
    // ============================================
    // ETP (Équivalent Temps Plein) - CORRECTION v4.1
    // ============================================
    const etp_fin_mois = activeEmployees.reduce((sum, emp) => {
      const tempsPartiel = emp.temps_travail || 1.0
      return sum + tempsPartiel
    }, 0)
    
    // ✅ CORRECTION: Calculer ETP début depuis mois précédent
    let etp_debut_mois = 0
    if (previousMonthEmployees && previousMonthEmployees.length > 0) {
      etp_debut_mois = previousMonthEmployees
        .filter(e => e.statut_emploi === 'Actif')
        .reduce((sum, emp) => sum + (emp.temps_travail || 1.0), 0)
    } else {
      etp_debut_mois = etp_fin_mois
    }
    
    // ✅ CORRECTION: Calculer ETP moyen
    const etp_moyen = etp_debut_mois > 0
      ? (etp_debut_mois + etp_fin_mois) / 2
      : etp_fin_mois
    
    console.log(`⚡ ETP: Début=${etp_debut_mois.toFixed(2)}, Fin=${etp_fin_mois.toFixed(2)}, Moyen=${etp_moyen.toFixed(2)}`)
    
    // ============================================
    // MOUVEMENTS (ENTRÉES/SORTIES)
    // ============================================
    const nb_entrees = employees.filter(emp => {
      if (!emp.date_entree) return false
      const entryDate = new Date(emp.date_entree)
      return entryDate.getFullYear() === periodDate.getFullYear() &&
             entryDate.getMonth() === periodDate.getMonth()
    }).length
    
    const employesSortis = employees.filter(emp => {
      if (!emp.date_sortie) return false
      const exitDate = new Date(emp.date_sortie)
      return exitDate.getFullYear() === periodDate.getFullYear() &&
             exitDate.getMonth() === periodDate.getMonth()
    })
    
    const nb_sorties = employesSortis.length
    
    console.log(`📥 Entrées: ${nb_entrees} | 📤 Sorties: ${nb_sorties}`)
    
    // Distinguer sorties volontaires vs involontaires (approximation)
    const nb_sorties_volontaires = Math.floor(nb_sorties * 0.6)
    const nb_sorties_involontaires = nb_sorties - nb_sorties_volontaires
    
    // ============================================
    // TURNOVER v4.0 - CALCUL INCHANGÉ (déjà correct)
    // ============================================
    console.group('📊 Calcul Turnover v4.1 (effectif_moyen corrigé)')
    
    // 1. MENSUEL (NOUVEAU) - Taux RÉEL du mois
    const taux_turnover_mensuel = effectif_moyen > 0
      ? (nb_sorties / effectif_moyen) * 100
      : 0
    
    const taux_turnover_volontaire_mensuel = effectif_moyen > 0
      ? (nb_sorties_volontaires / effectif_moyen) * 100
      : 0
    
    console.log(`✅ MENSUEL (réel): ${taux_turnover_mensuel.toFixed(2)}%`)
    console.log(`   └─ Formule: (${nb_sorties} / ${effectif_moyen.toFixed(2)}) × 100`)
    
    // 2. ANNUALISÉ (NOUVEAU) - Projection si rythme constant
    const taux_turnover_annualise = effectif_moyen > 0
      ? (nb_sorties / effectif_moyen) * 12 * 100
      : 0
    
    const taux_turnover_volontaire_annualise = effectif_moyen > 0
      ? (nb_sorties_volontaires / effectif_moyen) * 12 * 100
      : 0
    
    console.log(`📈 ANNUALISÉ (projection): ${taux_turnover_annualise.toFixed(2)}%`)
    console.log(`   └─ = ${taux_turnover_mensuel.toFixed(2)}% × 12`)
    
    // 3. PAR DÉFAUT = MENSUEL (pas annualisé)
    const taux_turnover = taux_turnover_mensuel
    const taux_turnover_volontaire = taux_turnover_volontaire_mensuel
    
    console.log(`🎯 AFFICHÉ par défaut: ${taux_turnover.toFixed(2)}% (mensuel)`)
    
    console.groupEnd() // Turnover
    
    // ============================================
    // TYPES DE CONTRATS
    // ============================================
    const nb_cdi = activeEmployees.filter(emp => 
      this.isContractType(emp.type_contrat, 'CDI')
    ).length
    
    const nb_cdd = activeEmployees.filter(emp => 
      this.isContractType(emp.type_contrat, 'CDD')
    ).length
    
    const nb_alternance = activeEmployees.filter(emp => 
      this.isContractType(emp.type_contrat, 'ALTERNANCE')
    ).length
    
    const nb_stage = activeEmployees.filter(emp => 
      this.isContractType(emp.type_contrat, 'STAGE')
    ).length
    
    const nb_interim = activeEmployees.filter(emp => 
      this.isContractType(emp.type_contrat, 'INTERIM')
    ).length
    
    console.log(`📋 Contrats: CDI=${nb_cdi}, CDD=${nb_cdd}, Alt=${nb_alternance}`)
    
    // ============================================
    // POURCENTAGES CONTRATS
    // ============================================
    const pct_cdi = effectif_fin_mois > 0 
      ? (nb_cdi / effectif_fin_mois) * 100 
      : 0
    
    const pct_cdd = effectif_fin_mois > 0 
      ? (nb_cdd / effectif_fin_mois) * 100 
      : 0
    
    const pct_alternance = effectif_fin_mois > 0 
      ? (nb_alternance / effectif_fin_mois) * 100 
      : 0
    
    const pct_stage = effectif_fin_mois > 0 
      ? (nb_stage / effectif_fin_mois) * 100 
      : 0
    
    // Précarité = tout ce qui n'est pas CDI
    const pct_precarite = 100 - pct_cdi
    
    console.groupEnd() // WorkforceCalculator
    
    return {
      // Effectifs
      effectif_debut_mois,
      effectif_fin_mois,
      effectif_moyen: this.round(effectif_moyen, 2),
      
      // ETP
      etp_debut_mois: this.round(etp_debut_mois, 2),
      etp_fin_mois: this.round(etp_fin_mois, 2),
      etp_moyen: this.round(etp_moyen, 2),
      
      // Mouvements
      nb_entrees,
      nb_sorties,
      nb_sorties_volontaires,
      nb_sorties_involontaires,
      
      // Turnover v4.0 CORRIGÉ
      taux_turnover: this.round(taux_turnover, 2),
      taux_turnover_volontaire: this.round(taux_turnover_volontaire, 2),
      taux_turnover_mensuel: this.round(taux_turnover_mensuel, 2),
      taux_turnover_annualise: this.round(taux_turnover_annualise, 2),
      taux_turnover_volontaire_mensuel: this.round(taux_turnover_volontaire_mensuel, 2),
      taux_turnover_volontaire_annualise: this.round(taux_turnover_volontaire_annualise, 2),
      
      // Contrats
      nb_cdi,
      nb_cdd,
      nb_alternance,
      nb_stage,
      nb_interim,
      
      // Pourcentages
      pct_cdi: this.round(pct_cdi, 2),
      pct_cdd: this.round(pct_cdd, 2),
      pct_alternance: this.round(pct_alternance, 2),
      pct_stage: this.round(pct_stage, 2),
      pct_precarite: this.round(pct_precarite, 2)
    }
  }
  
  /**
   * Vérifie si un type de contrat correspond à une catégorie
   */
  private isContractType(contractType: string | undefined, category: string): boolean {
    if (!contractType) return false
    
    const normalized = contractType.toUpperCase().trim()
    
    switch (category) {
      case 'CDI':
        return normalized === 'CDI' || normalized === 'PERMANENT'
      
      case 'CDD':
        return normalized === 'CDD' || normalized === 'TEMPORARY' || normalized === 'FIXED-TERM'
      
      case 'ALTERNANCE':
        return normalized.includes('ALTERNANCE') || 
               normalized.includes('APPRENTISSAGE') || 
               normalized.includes('CONTRAT PRO')
      
      case 'STAGE':
        return normalized === 'STAGE' || 
               normalized === 'STAGIAIRE' || 
               normalized === 'INTERN'
      
      case 'INTERIM':
        return normalized === 'INTÉRIM' || 
               normalized === 'INTERIM' || 
               normalized === 'TEMPORARY WORKER'
      
      default:
        return false
    }
  }
  
  /**
   * Retourne des métriques par défaut (aucune donnée)
   */
  private getDefaultMetrics(): WorkforceMetrics {
    return {
      effectif_debut_mois: 0,
      effectif_fin_mois: 0,
      effectif_moyen: 0,
      etp_debut_mois: 0,
      etp_fin_mois: 0,
      etp_moyen: 0,
      nb_entrees: 0,
      nb_sorties: 0,
      nb_sorties_volontaires: 0,
      nb_sorties_involontaires: 0,
      taux_turnover: 0,
      taux_turnover_volontaire: 0,
      taux_turnover_mensuel: 0,
      taux_turnover_annualise: 0,
      taux_turnover_volontaire_mensuel: 0,
      taux_turnover_volontaire_annualise: 0,
      nb_cdi: 0,
      nb_cdd: 0,
      nb_alternance: 0,
      nb_stage: 0,
      nb_interim: 0,
      pct_cdi: 0,
      pct_cdd: 0,
      pct_alternance: 0,
      pct_stage: 0,
      pct_precarite: 0
    }
  }
  
  /**
   * Arrondit un nombre avec précision
   */
  private round(value: number, decimals: number): number {
    if (!isFinite(value) || isNaN(value)) {
      return 0
    }
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }
  
  /**
   * Génère un rapport d'analyse de la workforce
   * 
   * ⚠️ v4.0: Seuils ajustés pour taux MENSUEL
   */
  generateAnalysis(metrics: WorkforceMetrics): {
    niveau: 'stable' | 'croissance' | 'décroissance' | 'turbulent'
    alerts: string[]
    insights: string[]
  } {
    const alerts: string[] = []
    const insights: string[] = []
    let niveau: 'stable' | 'croissance' | 'décroissance' | 'turbulent' = 'stable'
    
    // ============================================
    // ANALYSE TURNOVER v4.0 (seuils mensuels)
    // ============================================
    // Ancien: > 20% annualisé = critique
    // Nouveau: > 10% mensuel = critique (≈ 120% annualisé)
    
    if (metrics.taux_turnover > 10) {
      niveau = 'turbulent'
      alerts.push(`🚨 Turnover critique (${metrics.taux_turnover.toFixed(1)}% mensuel) - Rétention urgente`)
    } else if (metrics.taux_turnover > 5) {
      alerts.push(`⚠️ Turnover élevé (${metrics.taux_turnover.toFixed(1)}% mensuel) - Enquête climat social recommandée`)
    } else if (metrics.taux_turnover < 1) {
      insights.push(`✅ Turnover faible (${metrics.taux_turnover.toFixed(1)}% mensuel) - Excellente stabilité`)
    }
    
    // Analyse croissance
    const variation_effectif = metrics.nb_entrees - metrics.nb_sorties
    if (variation_effectif > 0) {
      niveau = 'croissance'
      insights.push(`📈 Croissance: ${variation_effectif} embauches nettes ce mois`)
    } else if (variation_effectif < 0) {
      niveau = 'décroissance'
      alerts.push(`📉 Décroissance: ${Math.abs(variation_effectif)} départs nets`)
    }
    
    // Analyse précarité
    if (metrics.pct_precarite > 40) {
      alerts.push(`⚠️ Précarité élevée (${metrics.pct_precarite.toFixed(0)}% non-CDI) - Instabilité potentielle`)
    } else if (metrics.pct_precarite > 25) {
      insights.push(`📊 Précarité modérée (${metrics.pct_precarite.toFixed(0)}% non-CDI) - Flexibilité vs stabilité`)
    } else {
      insights.push(`✅ Contrats stables (${metrics.pct_cdi.toFixed(0)}% CDI) - Engagement long terme`)
    }
    
    // Analyse ETP vs Effectif
    const ratio_etp = metrics.effectif_fin_mois > 0
      ? metrics.etp_fin_mois / metrics.effectif_fin_mois
      : 0
    
    if (ratio_etp < 0.85) {
      alerts.push(`⏰ Forte proportion de temps partiel (ratio ETP: ${ratio_etp.toFixed(2)}) - Impact productivité?`)
    } else if (ratio_etp > 0.95) {
      insights.push(`💪 Quasi plein temps généralisé (ratio ETP: ${ratio_etp.toFixed(2)})`)
    }
    
    // Analyse alternance/stage
    const pct_formation = metrics.pct_alternance + metrics.pct_stage
    if (pct_formation > 15) {
      insights.push(`🎓 Politique formation active (${pct_formation.toFixed(0)}% alternants/stagiaires)`)
    }
    
    return { niveau, alerts, insights }
  }
  
  /**
   * Calcule la stabilité de la workforce
   * 
   * ⚠️ v4.0: Seuils ajustés pour taux MENSUEL
   */
  calculateStability(metrics: WorkforceMetrics): {
    score: number // 0-100
    niveau: 'instable' | 'fragile' | 'stable' | 'très stable'
    facteurs: string[]
  } {
    const facteurs: string[] = []
    let score = 100
    
    // ============================================
    // PÉNALITÉS TURNOVER v4.0 (seuils mensuels)
    // ============================================
    // Ancien: > 20% annualisé = -30
    // Nouveau: > 10% mensuel = -30
    
    if (metrics.taux_turnover > 10) {
      score -= 30
      facteurs.push('Turnover très élevé (-30)')
    } else if (metrics.taux_turnover > 5) {
      score -= 20
      facteurs.push('Turnover élevé (-20)')
    } else if (metrics.taux_turnover > 2) {
      score -= 10
      facteurs.push('Turnover modéré (-10)')
    }
    
    // Pénalités précarité
    if (metrics.pct_precarite > 40) {
      score -= 25
      facteurs.push('Précarité élevée (-25)')
    } else if (metrics.pct_precarite > 25) {
      score -= 15
      facteurs.push('Précarité modérée (-15)')
    }
    
    // Bonus stabilité contrats
    if (metrics.pct_cdi > 80) {
      facteurs.push('Majorité CDI (+10)')
      score = Math.min(100, score + 10)
    }
    
    // Déterminer niveau
    let niveau: 'instable' | 'fragile' | 'stable' | 'très stable'
    if (score >= 80) niveau = 'très stable'
    else if (score >= 60) niveau = 'stable'
    else if (score >= 40) niveau = 'fragile'
    else niveau = 'instable'
    
    return {
      score: Math.max(0, Math.min(100, score)),
      niveau,
      facteurs
    }
  }
  
  /**
   * Compare avec des benchmarks sectoriels
   * 
   * ⚠️ v4.0: Compare avec taux_turnover (mensuel par défaut)
   * Pour comparer avec benchmarks annuels, utiliser taux_turnover_annualise
   */
  compareBenchmark(
    metrics: WorkforceMetrics,
    secteur: 'industrie' | 'service' | 'commerce' | 'tech' = 'service'
  ): {
    turnover_comparison: 'excellent' | 'bon' | 'moyen' | 'préoccupant'
    cdi_comparison: 'excellent' | 'bon' | 'moyen' | 'préoccupant'
    message: string
  } {
    // Benchmarks moyens par secteur (France) - ANNUELS
    const benchmarks = {
      industrie: { turnover: 12, pct_cdi: 85 },
      service: { turnover: 18, pct_cdi: 70 },
      commerce: { turnover: 25, pct_cdi: 60 },
      tech: { turnover: 15, pct_cdi: 80 }
    }
    
    const bench = benchmarks[secteur]
    
    // ⚠️ Utiliser taux_turnover_annualise pour comparer avec benchmarks
    const turnover_pour_benchmark = metrics.taux_turnover_annualise || (metrics.taux_turnover * 12)
    
    // Comparaison turnover
    let turnover_comparison: 'excellent' | 'bon' | 'moyen' | 'préoccupant'
    const ecart_turnover = turnover_pour_benchmark - bench.turnover
    
    if (ecart_turnover < -5) turnover_comparison = 'excellent'
    else if (ecart_turnover < 0) turnover_comparison = 'bon'
    else if (ecart_turnover < 5) turnover_comparison = 'moyen'
    else turnover_comparison = 'préoccupant'
    
    // Comparaison CDI
    let cdi_comparison: 'excellent' | 'bon' | 'moyen' | 'préoccupant'
    const ecart_cdi = metrics.pct_cdi - bench.pct_cdi
    
    if (ecart_cdi > 10) cdi_comparison = 'excellent'
    else if (ecart_cdi > 0) cdi_comparison = 'bon'
    else if (ecart_cdi > -10) cdi_comparison = 'moyen'
    else cdi_comparison = 'préoccupant'
    
    const message = `Secteur ${secteur}: Turnover ${turnover_comparison} (${turnover_pour_benchmark.toFixed(1)}% annualisé vs ${bench.turnover}% benchmark), CDI ${cdi_comparison} (${metrics.pct_cdi.toFixed(0)}% vs ${bench.pct_cdi}%)`
    
    return { turnover_comparison, cdi_comparison, message }
  }
}


// Export instance singleton pour réutilisation
export const workforceCalculator = new WorkforceCalculator()
