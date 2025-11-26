// lib/hooks/useOptimizedKPIData.ts
// FIXED: Create Supabase client INSIDE useEffect to ensure session is available

'use client'

<<<<<<< HEAD
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { WorkforceKPIs, PayrollKPIs, AbsenceKPIs, KPIData } from '@/lib/types/dashboard'

interface UseOptimizedKPIDataResult {
  data: KPIData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * ✅ Hook KPI Data v4.0 - Simple SELECT queries (no RPC)
 * 
 * ARCHITECTURE v4.0:
 * - Backend API calculates ALL KPIs
 * - Database stores pre-calculated values
 * - Frontend reads via simple SELECT queries
 * - NO SQL functions/calculations
 * 
 * @param establishmentId UUID de l'établissement
 * @param period Période au format YYYY-MM-DD ou YYYY-MM-01
 */
export function useOptimizedKPIData(
  establishmentId: string,
  period: string
): UseOptimizedKPIDataResult {
=======
import { useState, useEffect, useRef } from 'react'
import { createClient, getCompanyId } from '@/lib/supabase/client'
import { FinancialsData, WorkforceKPIs, AbsenceKPIs } from '@/lib/types/dashboard'

interface KPIData {
  workforce: WorkforceKPIs | null
  financials: FinancialsData | null
  absences: AbsenceKPIs | null
  previousMonthFinancials: FinancialsData | null
  previousYearFinancials: FinancialsData | null
  previousMonthWorkforce: WorkforceKPIs | null
  previousYearWorkforce: WorkforceKPIs | null
  previousMonthAbsences: AbsenceKPIs | null
  previousYearAbsences: AbsenceKPIs | null
}

export const useOptimizedKPIData = (establishmentId: string, period: string) => {
>>>>>>> 5a39fde6b165f4356ff6e2e7c7c1f456aea77edb
  const [data, setData] = useState<KPIData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
<<<<<<< HEAD
  const supabase = createClient()

  const fetchData = async () => {
=======
  // CRITICAL FIX: Remove supabase client from outside useEffect
  const prevParamsRef = useRef({ establishmentId: '', period: '' })

  useEffect(() => {
    // Reset if no params
>>>>>>> 5a39fde6b165f4356ff6e2e7c7c1f456aea77edb
    if (!establishmentId || !period) {
      setLoading(false)
      setData(null)
      return
    }

    // CRITICAL FIX: Check company authentication
    const companyId = getCompanyId()
    if (!companyId) {
      setError('Non authentifié - veuillez vous reconnecter')
      setLoading(false)
      return
    }

<<<<<<< HEAD
    try {
      setLoading(true)
      setError(null)
=======
    // Skip if same params
    if (prevParamsRef.current.establishmentId === establishmentId && 
        prevParamsRef.current.period === period) {
      return
    }
>>>>>>> 5a39fde6b165f4356ff6e2e7c7c1f456aea77edb

      // Normaliser la période au format YYYY-MM-01
      const normalizedPeriod = period.substring(0, 7) + '-01'
      
      // Calculer périodes de comparaison
      const currentDate = new Date(normalizedPeriod)
      
      const previousMonthDate = new Date(currentDate)
      previousMonthDate.setMonth(previousMonthDate.getMonth() - 1)
      const previousMonth = previousMonthDate.toISOString().substring(0, 7) + '-01'
      
      const previousYearDate = new Date(currentDate)
      previousYearDate.setFullYear(previousYearDate.getFullYear() - 1)
      const previousYear = previousYearDate.toISOString().substring(0, 7) + '-01'

      console.group('📊 TALVIO - KPI Data Fetch v4.0 (Pure SELECT)')
      console.log('📅 Période courante:', normalizedPeriod)
      console.log('📅 Mois précédent:', previousMonth)
      console.log('📅 Année précédente:', previousYear)
      console.log('🏢 Établissement:', establishmentId)

<<<<<<< HEAD
      // ============================================
      // SIMPLE SELECT - Get all 3 periods
      // ============================================
      const { data: snapshots, error: selectError } = await supabase
        .from('snapshots_mensuels')
        .select('*')
        .eq('etablissement_id', establishmentId)
        .in('periode', [normalizedPeriod, previousMonth, previousYear])

      if (selectError) {
        console.error('❌ Erreur SELECT snapshots:', selectError)
        throw new Error(`Erreur DB: ${selectError.message}`)
=======
        // CRITICAL FIX: Create client INSIDE useEffect to ensure session is available
        const supabase = createClient()

        // CRITICAL FIX: Verify establishment belongs to company
        const { data: establishment, error: estError } = await supabase
          .from('etablissements')
          .select('entreprise_id')
          .eq('id', establishmentId)
          .single()

        if (estError || !establishment) {
          throw new Error('Établissement non trouvé')
        }

        if (establishment.entreprise_id !== companyId) {
          throw new Error('Accès non autorisé à cet établissement')
        }

        // Calculate comparison periods
        const currentDate = new Date(period)
        
        const previousMonthDate = new Date(currentDate)
        previousMonthDate.setMonth(previousMonthDate.getMonth() - 1)
        const previousMonthPeriod = previousMonthDate.toISOString().split('T')[0].substring(0, 7) + '-01'

        const previousYearDate = new Date(currentDate)
        previousYearDate.setFullYear(previousYearDate.getFullYear() - 1)
        const previousYearPeriod = previousYearDate.toISOString().split('T')[0].substring(0, 7) + '-01'

        // OPTIMIZATION: Parallel queries with proper error handling
        const [
          workforceResult,
          financialsResult, 
          absencesResult,
          prevMonthWorkforceResult,
          prevYearWorkforceResult,
          prevMonthFinancialsResult,
          prevYearFinancialsResult,
          prevMonthAbsencesResult,
          prevYearAbsencesResult
        ] = await Promise.allSettled([
          // Current period
          supabase
            .from('snapshots_workforce')
            .select('*')
            .eq('etablissement_id', establishmentId)
            .eq('periode', period)
            .maybeSingle(),
          
          supabase
            .from('snapshots_financials')
            .select('*')
            .eq('etablissement_id', establishmentId)
            .eq('periode', period)
            .maybeSingle(),
          
          supabase
            .from('snapshots_absences')
            .select('*')
            .eq('etablissement_id', establishmentId)
            .eq('periode', period)
            .maybeSingle(),
          
          // Previous month
          supabase
            .from('snapshots_workforce')
            .select('*')
            .eq('etablissement_id', establishmentId)
            .eq('periode', previousMonthPeriod)
            .maybeSingle(),
          
          // Previous year
          supabase
            .from('snapshots_workforce')
            .select('*')
            .eq('etablissement_id', establishmentId)
            .eq('periode', previousYearPeriod)
            .maybeSingle(),
          
          supabase
            .from('snapshots_financials')
            .select('*')
            .eq('etablissement_id', establishmentId)
            .eq('periode', previousMonthPeriod)
            .maybeSingle(),
          
          supabase
            .from('snapshots_financials')
            .select('*')
            .eq('etablissement_id', establishmentId)
            .eq('periode', previousYearPeriod)
            .maybeSingle(),
          
          supabase
            .from('snapshots_absences')
            .select('*')
            .eq('etablissement_id', establishmentId)
            .eq('periode', previousMonthPeriod)
            .maybeSingle(),
          
          supabase
            .from('snapshots_absences')
            .select('*')
            .eq('etablissement_id', establishmentId)
            .eq('periode', previousYearPeriod)
            .maybeSingle()
        ])

        // Extract data from settled promises
        const workforce = workforceResult.status === 'fulfilled' ? workforceResult.value.data : null
        const financials = financialsResult.status === 'fulfilled' ? financialsResult.value.data : null
        const absences = absencesResult.status === 'fulfilled' ? absencesResult.value.data : null
        const prevMonthWorkforce = prevMonthWorkforceResult.status === 'fulfilled' ? prevMonthWorkforceResult.value.data : null
        const prevYearWorkforce = prevYearWorkforceResult.status === 'fulfilled' ? prevYearWorkforceResult.value.data : null
        const prevMonthFinancials = prevMonthFinancialsResult.status === 'fulfilled' ? prevMonthFinancialsResult.value.data : null
        const prevYearFinancials = prevYearFinancialsResult.status === 'fulfilled' ? prevYearFinancialsResult.value.data : null
        const prevMonthAbsences = prevMonthAbsencesResult.status === 'fulfilled' ? prevMonthAbsencesResult.value.data : null
        const prevYearAbsences = prevYearAbsencesResult.status === 'fulfilled' ? prevYearAbsencesResult.value.data : null

        // Log any errors but don't fail
        if (workforceResult.status === 'rejected') {
          console.warn('Workforce snapshot error:', workforceResult.reason)
        }
        if (financialsResult.status === 'rejected') {
          console.warn('Financials snapshot error:', financialsResult.reason)
        }
        if (absencesResult.status === 'rejected') {
          console.warn('Absences snapshot error:', absencesResult.reason)
        }

        // Build response data
        setData({
          workforce: workforce ? {
            etpTotal: workforce.etp_fin_mois || 0,
            headcountActif: workforce.effectif_fin_mois || 0,
            nbEntrees: workforce.nb_entrees || 0,
            nbSorties: workforce.nb_sorties || 0,
            tauxTurnover: workforce.taux_turnover || 0,
            pctCDI: workforce.pct_cdi || 0,
            ageMoyen: workforce.age_moyen || 0,
            ancienneteMoyenne: workforce.anciennete_moyenne_mois || 0,
            pctHommes: workforce.pct_hommes || 0,
            pctFemmes: workforce.pct_femmes || 0
          } : null,
          
          financials: financials as FinancialsData | null,
          
          absences: absences ? {
            tauxAbsenteisme: absences.taux_absenteisme || 0,
            nbJoursAbsence: absences.nb_jours_absence || 0,
            nbAbsencesTotal: absences.nb_absences_total || 0,
            dureeMoyenne: absences.duree_moyenne_absence || 0,
            nbSalariesAbsents: absences.nb_salaries_absents || 0,
            nbJoursMaladie: absences.nb_jours_maladie || 0
          } : null,
          
          previousMonthWorkforce: prevMonthWorkforce ? {
            etpTotal: prevMonthWorkforce.etp_fin_mois || 0,
            headcountActif: prevMonthWorkforce.effectif_fin_mois || 0,
            nbEntrees: prevMonthWorkforce.nb_entrees || 0,
            nbSorties: prevMonthWorkforce.nb_sorties || 0,
            tauxTurnover: prevMonthWorkforce.taux_turnover || 0,
            pctCDI: prevMonthWorkforce.pct_cdi || 0,
            ageMoyen: prevMonthWorkforce.age_moyen || 0,
            ancienneteMoyenne: prevMonthWorkforce.anciennete_moyenne_mois || 0,
            pctHommes: prevMonthWorkforce.pct_hommes || 0,
            pctFemmes: prevMonthWorkforce.pct_femmes || 0
          } : null,
          
          previousYearWorkforce: prevYearWorkforce ? {
            etpTotal: prevYearWorkforce.etp_fin_mois || 0,
            headcountActif: prevYearWorkforce.effectif_fin_mois || 0,
            nbEntrees: prevYearWorkforce.nb_entrees || 0,
            nbSorties: prevYearWorkforce.nb_sorties || 0,
            tauxTurnover: prevYearWorkforce.taux_turnover || 0,
            pctCDI: prevYearWorkforce.pct_cdi || 0,
            ageMoyen: prevYearWorkforce.age_moyen || 0,
            ancienneteMoyenne: prevYearWorkforce.anciennete_moyenne_mois || 0,
            pctHommes: prevYearWorkforce.pct_hommes || 0,
            pctFemmes: prevYearWorkforce.pct_femmes || 0
          } : null,
          
          previousMonthFinancials: prevMonthFinancials as FinancialsData | null,
          
          previousYearFinancials: prevYearFinancials as FinancialsData | null,
          
          previousMonthAbsences: prevMonthAbsences ? {
            tauxAbsenteisme: prevMonthAbsences.taux_absenteisme || 0,
            nbJoursAbsence: prevMonthAbsences.nb_jours_absence || 0,
            nbAbsencesTotal: prevMonthAbsences.nb_absences_total || 0,
            dureeMoyenne: prevMonthAbsences.duree_moyenne_absence || 0,
            nbSalariesAbsents: prevMonthAbsences.nb_salaries_absents || 0,
            nbJoursMaladie: prevMonthAbsences.nb_jours_maladie || 0
          } : null,
          
          previousYearAbsences: prevYearAbsences ? {
            tauxAbsenteisme: prevYearAbsences.taux_absenteisme || 0,
            nbJoursAbsence: prevYearAbsences.nb_jours_absence || 0,
            nbAbsencesTotal: prevYearAbsences.nb_absences_total || 0,
            dureeMoyenne: prevYearAbsences.duree_moyenne_absence || 0,
            nbSalariesAbsents: prevYearAbsences.nb_salaries_absents || 0,
            nbJoursMaladie: prevYearAbsences.nb_jours_maladie || 0
          } : null
        })

      } catch (err) {
        console.error('KPI fetch error:', err)
        const errorMessage = err instanceof Error ? err.message : 'Erreur de chargement'
        setError(errorMessage)
        
        // Set empty data structure on error
        setData({ 
          workforce: null, 
          financials: null, 
          absences: null,
          previousMonthFinancials: null,
          previousYearFinancials: null,
          previousMonthWorkforce: null,
          previousYearWorkforce: null,
          previousMonthAbsences: null,
          previousYearAbsences: null
        })
      } finally {
        setLoading(false)
>>>>>>> 5a39fde6b165f4356ff6e2e7c7c1f456aea77edb
      }

      if (!snapshots || snapshots.length === 0) {
        console.warn('⚠️ Aucun snapshot trouvé')
        throw new Error(`Aucune donnée pour ${normalizedPeriod}`)
      }

      // ============================================
      // PARSE SNAPSHOTS
      // ============================================
      const currentSnapshot = snapshots.find(s => s.periode === normalizedPeriod)
      const previousMonthSnapshot = snapshots.find(s => s.periode === previousMonth)
      const previousYearSnapshot = snapshots.find(s => s.periode === previousYear)

      if (!currentSnapshot) {
        console.warn('⚠️ Snapshot courant manquant')
        throw new Error(`Snapshot manquant pour ${normalizedPeriod}`)
      }

      console.log('📊 Snapshots trouvés:')
      console.log('   Courant:', currentSnapshot ? '✅' : '❌')
      console.log('   Mois -1:', previousMonthSnapshot ? '✅' : '❌')
      console.log('   Année -1:', previousYearSnapshot ? '✅' : '❌')

      // ============================================
      // MAP TO TYPES - Current period
      // ============================================
      const workforce: WorkforceKPIs = {
        etpTotal: parseFloat(currentSnapshot.etp_fin_mois) || 0,
        headcountActif: currentSnapshot.effectif_fin_mois || 0,
        nbEntrees: currentSnapshot.nb_entrees || 0,
        nbSorties: currentSnapshot.nb_sorties || 0,
        tauxTurnover: parseFloat(currentSnapshot.taux_turnover) || 0,
        pctCDI: parseFloat(currentSnapshot.pct_cdi) || 0,
        ageMoyen: parseFloat(currentSnapshot.age_moyen) || 0,
        ancienneteMoyenne: parseFloat(currentSnapshot.anciennete_moyenne_mois) || 0,
        pctHommes: parseFloat(currentSnapshot.pct_hommes) || 0,
        pctFemmes: parseFloat(currentSnapshot.pct_femmes) || 0
      }

      const financials: PayrollKPIs = {
        masseBrute: parseFloat(currentSnapshot.masse_salariale_brute) || 0,
        coutTotal: parseFloat(currentSnapshot.cout_total_employeur) || 0,
        salaireMoyen: parseFloat(currentSnapshot.salaire_base_moyen) || 0,
        coutMoyenFTE: parseFloat(currentSnapshot.cout_moyen_par_fte) || 0,
        partVariable: parseFloat(currentSnapshot.part_variable) || 0,
        tauxCharges: parseFloat(currentSnapshot.taux_charges) || 0,
        effetPrix: parseFloat(currentSnapshot.effet_prix) || 0,
        effetVolume: parseFloat(currentSnapshot.effet_volume) || 0,
        effetMix: parseFloat(currentSnapshot.effet_mix) || 0,
        variationMasseSalariale: parseFloat(currentSnapshot.variation_masse_salariale) || 0,
        variationMasseSalarialePct: parseFloat(currentSnapshot.variation_masse_salariale_pct) || 0,
        primesExceptionnelles: parseFloat(currentSnapshot.primes_exceptionnelles_total) || 0,
        primesMois13: parseFloat(currentSnapshot.primes_exceptionnelles_total) || 0
      }

      const absences: AbsenceKPIs = {
        tauxAbsenteisme: parseFloat(currentSnapshot.taux_absenteisme) || 0,
        nbJoursAbsence: currentSnapshot.nb_jours_absence || 0,
        nbAbsencesTotal: currentSnapshot.nb_absences_total || 0,
        dureeMoyenne: parseFloat(currentSnapshot.duree_moyenne_absence) || 0,
        nbSalariesAbsents: currentSnapshot.nb_salaries_absents || 0,
        nbJoursMaladie: currentSnapshot.nb_jours_maladie || 0
      }

      // ============================================
      // MAP TO TYPES - Previous month
      // ============================================
      const previousMonthWorkforce: WorkforceKPIs | null = previousMonthSnapshot ? {
        etpTotal: parseFloat(previousMonthSnapshot.etp_fin_mois) || 0,
        headcountActif: previousMonthSnapshot.effectif_fin_mois || 0,
        nbEntrees: previousMonthSnapshot.nb_entrees || 0,
        nbSorties: previousMonthSnapshot.nb_sorties || 0,
        tauxTurnover: parseFloat(previousMonthSnapshot.taux_turnover) || 0,
        pctCDI: parseFloat(previousMonthSnapshot.pct_cdi) || 0,
        ageMoyen: parseFloat(previousMonthSnapshot.age_moyen) || 0,
        ancienneteMoyenne: parseFloat(previousMonthSnapshot.anciennete_moyenne_mois) || 0,
        pctHommes: parseFloat(previousMonthSnapshot.pct_hommes) || 0,
        pctFemmes: parseFloat(previousMonthSnapshot.pct_femmes) || 0
      } : null

      const previousMonthFinancials: PayrollKPIs | null = previousMonthSnapshot ? {
        masseBrute: parseFloat(previousMonthSnapshot.masse_salariale_brute) || 0,
        coutTotal: parseFloat(previousMonthSnapshot.cout_total_employeur) || 0,
        salaireMoyen: parseFloat(previousMonthSnapshot.salaire_base_moyen) || 0,
        coutMoyenFTE: parseFloat(previousMonthSnapshot.cout_moyen_par_fte) || 0,
        partVariable: parseFloat(previousMonthSnapshot.part_variable) || 0,
        tauxCharges: parseFloat(previousMonthSnapshot.taux_charges) || 0,
        effetPrix: parseFloat(previousMonthSnapshot.effet_prix) || 0,
        effetVolume: parseFloat(previousMonthSnapshot.effet_volume) || 0,
        effetMix: parseFloat(previousMonthSnapshot.effet_mix) || 0,
        variationMasseSalariale: parseFloat(previousMonthSnapshot.variation_masse_salariale) || 0,
        variationMasseSalarialePct: parseFloat(previousMonthSnapshot.variation_masse_salariale_pct) || 0,
        primesExceptionnelles: parseFloat(previousMonthSnapshot.primes_exceptionnelles_total) || 0,
        primesMois13: parseFloat(previousMonthSnapshot.primes_exceptionnelles_total) || 0
      } : null

      const previousMonthAbsences: AbsenceKPIs | null = previousMonthSnapshot ? {
        tauxAbsenteisme: parseFloat(previousMonthSnapshot.taux_absenteisme) || 0,
        nbJoursAbsence: previousMonthSnapshot.nb_jours_absence || 0,
        nbAbsencesTotal: previousMonthSnapshot.nb_absences_total || 0,
        dureeMoyenne: parseFloat(previousMonthSnapshot.duree_moyenne_absence) || 0,
        nbSalariesAbsents: previousMonthSnapshot.nb_salaries_absents || 0,
        nbJoursMaladie: previousMonthSnapshot.nb_jours_maladie || 0
      } : null

      // ============================================
      // MAP TO TYPES - Previous year
      // ============================================
      const previousYearWorkforce: WorkforceKPIs | null = previousYearSnapshot ? {
        etpTotal: parseFloat(previousYearSnapshot.etp_fin_mois) || 0,
        headcountActif: previousYearSnapshot.effectif_fin_mois || 0,
        nbEntrees: previousYearSnapshot.nb_entrees || 0,
        nbSorties: previousYearSnapshot.nb_sorties || 0,
        tauxTurnover: parseFloat(previousYearSnapshot.taux_turnover) || 0,
        pctCDI: parseFloat(previousYearSnapshot.pct_cdi) || 0,
        ageMoyen: parseFloat(previousYearSnapshot.age_moyen) || 0,
        ancienneteMoyenne: parseFloat(previousYearSnapshot.anciennete_moyenne_mois) || 0,
        pctHommes: parseFloat(previousYearSnapshot.pct_hommes) || 0,
        pctFemmes: parseFloat(previousYearSnapshot.pct_femmes) || 0
      } : null

      const previousYearFinancials: PayrollKPIs | null = previousYearSnapshot ? {
        masseBrute: parseFloat(previousYearSnapshot.masse_salariale_brute) || 0,
        coutTotal: parseFloat(previousYearSnapshot.cout_total_employeur) || 0,
        salaireMoyen: parseFloat(previousYearSnapshot.salaire_base_moyen) || 0,
        coutMoyenFTE: parseFloat(previousYearSnapshot.cout_moyen_par_fte) || 0,
        partVariable: parseFloat(previousYearSnapshot.part_variable) || 0,
        tauxCharges: parseFloat(previousYearSnapshot.taux_charges) || 0,
        effetPrix: parseFloat(previousYearSnapshot.effet_prix) || 0,
        effetVolume: parseFloat(previousYearSnapshot.effet_volume) || 0,
        effetMix: parseFloat(previousYearSnapshot.effet_mix) || 0,
        variationMasseSalariale: parseFloat(previousYearSnapshot.variation_masse_salariale) || 0,
        variationMasseSalarialePct: parseFloat(previousYearSnapshot.variation_masse_salariale_pct) || 0,
        primesExceptionnelles: parseFloat(previousYearSnapshot.primes_exceptionnelles_total) || 0,
        primesMois13: parseFloat(previousYearSnapshot.primes_exceptionnelles_total) || 0
      } : null

      const previousYearAbsences: AbsenceKPIs | null = previousYearSnapshot ? {
        tauxAbsenteisme: parseFloat(previousYearSnapshot.taux_absenteisme) || 0,
        nbJoursAbsence: previousYearSnapshot.nb_jours_absence || 0,
        nbAbsencesTotal: previousYearSnapshot.nb_absences_total || 0,
        dureeMoyenne: parseFloat(previousYearSnapshot.duree_moyenne_absence) || 0,
        nbSalariesAbsents: previousYearSnapshot.nb_salaries_absents || 0,
        nbJoursMaladie: previousYearSnapshot.nb_jours_maladie || 0
      } : null

      console.log('✅ Données parsées avec succès')
      console.groupEnd()

      // ============================================
      // RETURN COMPLETE KPI DATA
      // ============================================
      setData({
        workforce,
        financials,
        absences,
        previousMonthWorkforce,
        previousMonthFinancials,
        previousMonthAbsences,
        previousYearWorkforce,
        previousYearFinancials,
        previousYearAbsences
      })

    } catch (err) {
      console.error('❌ Erreur fatale KPI fetch:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erreur de chargement des données KPI'
      setError(errorMessage)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
<<<<<<< HEAD
=======
    // CRITICAL FIX: Remove supabase from dependencies since we create it fresh each time
>>>>>>> 5a39fde6b165f4356ff6e2e7c7c1f456aea77edb
  }, [establishmentId, period])

  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}