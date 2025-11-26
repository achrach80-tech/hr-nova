// app/admin/demos/page.tsx
// ✅ VERSION OPTIMISÉE - Évite le double chargement avec useRef

'use client'

import { useEffect, useState, useRef } from 'react'
import { 
  Calendar, Building2, User, Mail, Phone, Clock,
  CheckCircle, XCircle, ArrowRight, Sparkles,
  ChevronDown, ChevronUp, Zap, Send, Copy,
  Key, Shield, Loader2, ExternalLink, X
} from 'lucide-react'

<<<<<<< HEAD
// ============================================
// TYPES ET INTERFACES
// ============================================

interface StatusConfig {
  color: string;
  bg: string;
  border: string;
  text: string;
  label: string;
  icon: React.ComponentType<any>;
  cardClasses: string;
  shadowClasses: string;
}

type DemoStatus = 'pending' | 'contacted' | 'scheduled' | 'demo_completed' | 'converted' | 'lost';

interface Demo {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  employee_count: string;
  industry?: string;
  country?: string;
  message?: string;
  status: DemoStatus;
  qualification_score?: number;
  created_at: string;
  updated_at?: string;
  scheduled_date?: string;
  converted_to_company_id?: string;
  source?: string;
}

// ============================================
// CONFIGURATION DES STATUS AVEC CLASSES COMPLETES
// ============================================

const statusConfig: Record<DemoStatus, StatusConfig> = {
  pending: { 
    color: 'orange', 
    bg: 'from-orange-500/20 to-red-500/20',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    label: 'Pending Review',
    icon: Clock,
    cardClasses: 'relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-orange-500/30 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10',
    shadowClasses: 'hover:shadow-orange-500/10'
  },
  contacted: { 
    color: 'blue',
    bg: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    label: 'Contacted',
    icon: Mail,
    cardClasses: 'relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-blue-500/30 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10',
    shadowClasses: 'hover:shadow-blue-500/10'
  },
  scheduled: { 
    color: 'purple',
    bg: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    label: 'Demo Scheduled',
    icon: Calendar,
    cardClasses: 'relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10',
    shadowClasses: 'hover:shadow-purple-500/10'
  },
  demo_completed: { 
    color: 'cyan',
    bg: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    label: 'Demo Complete',
    icon: CheckCircle,
    cardClasses: 'relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-cyan-500/30 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10',
    shadowClasses: 'hover:shadow-cyan-500/10'
  },
  converted: { 
    color: 'green',
    bg: 'from-green-500/20 to-emerald-500/20',
    border: 'border-green-500/30',
    text: 'text-green-400',
    label: 'Converted',
    icon: Building2,
    cardClasses: 'relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-green-500/30 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10',
    shadowClasses: 'hover:shadow-green-500/10'
  },
  lost: { 
    color: 'red',
    bg: 'from-red-500/20 to-pink-500/20',
    border: 'border-red-500/30',
    text: 'text-red-400',
    label: 'Lost',
    icon: XCircle,
    cardClasses: 'relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-red-500/30 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10',
    shadowClasses: 'hover:shadow-red-500/10'
  }
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

=======
// Modal Component
function SuccessModal({ 
  demo, 
  token, 
  company, 
  onClose 
}: { 
  demo: any
  token: string
  company: any
  onClose: () => void 
}) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sendByEmail = () => {
    const subject = encodeURIComponent('Your Talvio HR Analytics Access')
    const body = encodeURIComponent(
      `Hello ${demo.contact_name},\n\n` +
      `Welcome to Talvio HR Analytics!\n\n` +
      `Your access credentials:\n` +
      `• Login URL: ${window.location.origin}/login\n` +
      `• Access Token: ${token}\n\n` +
      `Please keep your token secure and don't share it.\n\n` +
      `Best regards,\nTalvio Team`
    )
    window.open(`mailto:${demo.email}?subject=${subject}&body=${body}`, '_blank')
  }

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-slate-900 to-slate-800 border border-green-500/30 rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
            <CheckCircle size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">Company Created Successfully!</h2>
            <p className="text-slate-400">Access credentials have been generated</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Company Details */}
        <div className="bg-slate-800/50 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Building2 size={20} />
            Company Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-sm">Company Name</p>
              <p className="text-white font-medium">{company.nom}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Company Code</p>
              <p className="text-white font-mono text-sm">{company.code_entreprise}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Contact</p>
              <p className="text-white">{demo.contact_name}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Email</p>
              <p className="text-white text-sm">{demo.email}</p>
            </div>
          </div>
        </div>

        {/* Access Token */}
        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Key size={20} />
            Access Token (Keep Secret!)
          </h3>
          
          <div className="space-y-4">
            {/* Token */}
            <div>
              <label className="text-slate-400 text-sm block mb-2">Access Token</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={token}
                  readOnly
                  className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white font-mono text-sm select-all"
                />
                <button
                  onClick={() => copyToClipboard(token)}
                  className="px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-purple-400 transition-all"
                  title="Copy token"
                >
                  {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                </button>
              </div>
              {copied && (
                <p className="text-green-400 text-xs mt-1">✓ Copied to clipboard!</p>
              )}
            </div>

            {/* Login URL */}
            <div>
              <label className="text-slate-400 text-sm block mb-2">Login URL</label>
              <input
                type="text"
                value={`${window.location.origin}/login`}
                readOnly
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white text-sm select-all"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-semibold transition-all"
          >
            Close
          </button>
          <button
            onClick={sendByEmail}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Send size={20} />
            Send by Email
          </button>
        </div>
      </div>
    </div>
  )
}

>>>>>>> 5a39fde6b165f4356ff6e2e7c7c1f456aea77edb
export default function AdminDemosPage() {
  const [demos, setDemos] = useState<Demo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [expandedDemo, setExpandedDemo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [creatingCompany, setCreatingCompany] = useState<string | null>(null)
<<<<<<< HEAD
  const [filter, setFilter] = useState<'all' | DemoStatus>('all')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    scheduled: 0,
    converted: 0
  })
  const supabase = createClient()
=======
  const [filter, setFilter] = useState('all')
  
  // Modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successModalData, setSuccessModalData] = useState<{
    demo: any
    token: string
    company: any
  } | null>(null)

  // ✅ OPTIMISATION: Éviter le double chargement avec useRef
  const initialLoadDone = useRef(false)
>>>>>>> 5a39fde6b165f4356ff6e2e7c7c1f456aea77edb

  useEffect(() => {
    // Skip if already loaded (React Strict Mode prevention)
    if (initialLoadDone.current) return
    
    loadDemos()
    initialLoadDone.current = true
  }, []) // Empty deps - only run once

  // Reload when filter changes
  useEffect(() => {
    if (initialLoadDone.current) {
      loadDemos()
    }
  }, [filter])

  const loadDemos = async () => {
    console.log('Loading demos with filter:', filter)
    setLoading(true)
    setError(null)

    try {
<<<<<<< HEAD
      let query = supabase
        .from('demo_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        console.log('Applying filter:', filter)
        query = query.eq('status', filter)
      }

      const { data, error } = await query
      
      console.log('Demo query result:', { 
        data: data?.length, 
        error, 
        filter,
        firstDemo: data?.[0] 
      })

      if (error) {
        console.error('Demo load error:', error)
        setError(`Error loading demos: ${error.message}`)
      } else {
        console.log(`Loaded ${data?.length || 0} demos`)
        if (data) {
          setDemos(data)
          
          // Calculer les stats
          setStats({
            total: data.length,
            pending: data.filter(d => d.status === 'pending').length,
            scheduled: data.filter(d => d.status === 'scheduled').length,
            converted: data.filter(d => d.status === 'converted').length
          })
        }
      }
    } catch (err) {
      console.error('Unexpected error loading demos:', err)
      setError('Unexpected error occurred')
=======
      const response = await fetch(`/api/admin/demo-requests?status=${filter}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load demos')
      }

      console.log(`✅ Loaded ${result.data?.length || 0} demos`)
      setDemos(result.data || [])
    } catch (err) {
      console.error('❌ Error loading demos:', err)
      setError(err instanceof Error ? err.message : 'Failed to load demos')
>>>>>>> 5a39fde6b165f4356ff6e2e7c7c1f456aea77edb
    } finally {
      setLoading(false)
    }
  }

<<<<<<< HEAD
  const updateDemoStatus = async (demoId: string, newStatus: DemoStatus) => {
    try {
      const { error } = await supabase
        .from('demo_requests')
        .update({ 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', demoId)
      
      if (error) {
        console.error('Status update error:', error)
        alert(`Error updating status: ${error.message}`)
      } else {
        loadDemos()
      }
    } catch (err) {
      console.error('Unexpected error updating status:', err)
      alert('Unexpected error occurred')
    }
  }

  const createCompanyFromDemo = async (demo: Demo) => {
    setCreatingCompany(demo.id)
    
    try {
      // Generate secure credentials
      const accessToken = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
      
      const companyCode = `RHQ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      
      // Create URL slug
      const urlSlug = demo.company_name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50)

      console.log('Creating company with:', { 
        nom: demo.company_name,
        code_entreprise: companyCode,
        billing_email: demo.email
      })

      // Create company with ALL required fields from schema
      const { data: company, error: companyError } = await supabase
        .from('entreprises')
        .insert({
          nom: demo.company_name,
          code_entreprise: companyCode,
          access_token: accessToken,
          access_url_slug: urlSlug,
          subscription_plan: 'trial',
          subscription_status: 'active',
          billing_email: demo.email,
          trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          activation_date: new Date().toISOString(),
          onboarding_status: 'trial_started',
          max_employees: demo.employee_count === '1-50' ? 100 : 
                         demo.employee_count === '51-200' ? 300 :
                         demo.employee_count === '201-500' ? 600 : 1000,
          features: {
            export: true,
            api: false,
            white_label: false,
            advanced_analytics: false
          },
          ai_features_enabled: false,
          login_count: 0,
          seuil_turnover_default: 15.0,
          seuil_absenteisme_default: 8.0,
          devise: 'EUR',
          timezone: 'Europe/Paris'
        })
        .select()
        .single()

      if (companyError) {
        console.error('Company creation error:', companyError)
        throw new Error(`Failed to create company: ${companyError.message}`)
      }

      console.log('Company created:', company.id)

      // Create default establishment
      const { data: establishment, error: estError } = await supabase
        .from('etablissements')
        .insert({
          entreprise_id: company.id,
          nom: `${demo.company_name} - Siège`,
          code_etablissement: 'SIEGE',
          is_headquarters: true,
          statut: 'Actif',
          pays: demo.country || 'France',
          timezone: 'Europe/Paris',
          employee_count: 0,
          active_employee_count: 0
        })
        .select()
        .single()

      if (estError) {
        console.error('Establishment creation error:', estError)
        throw new Error(`Failed to create establishment: ${estError.message}`)
      }

      console.log('Establishment created:', establishment.id)

      // Create default organizational referentials
      const { error: refError } = await supabase
        .from('referentiel_organisation')
        .insert([
          {
            etablissement_id: establishment.id,
            code_cost_center: 'ADMIN',
            nom_cost_center: 'Administration',
            code_site: 'SIEGE',
            nom_site: 'Siège Social',
            code_direction: 'ADMIN',
            nom_direction: 'Administration'
          },
          {
            etablissement_id: establishment.id,
            code_cost_center: 'RH',
            nom_cost_center: 'Ressources Humaines',
            code_site: 'SIEGE',
            nom_site: 'Siège Social',
            code_direction: 'ADMIN',
            nom_direction: 'Administration'
          }
        ])

      if (refError) {
        console.warn('Referentials setup warning:', refError.message)
        // Don't throw - this is not critical
      }

      // Update demo status
      const { error: updateError } = await supabase
        .from('demo_requests')
        .update({
          status: 'converted',
          converted_to_company_id: company.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', demo.id)

      if (updateError) {
        console.error('Demo update error:', updateError)
      }

      // Show success modal
      showSuccessModal(demo, accessToken, company)
      
      // Reload after short delay
      setTimeout(() => {
        setFilter('all')
        loadDemos()
      }, 1000)
      
    } catch (error) {
      console.error('Company creation failed:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setCreatingCompany(null)
    }
  }

  const showSuccessModal = (demo: Demo, token: string, company: any) => {
    const modal = document.createElement('div')
    modal.id = 'success-modal'
    modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4'
    
    modal.innerHTML = `
      <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-2xl w-full border border-green-500/30 shadow-2xl">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center animate-pulse">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-3xl font-bold text-white">Company Created!</h2>
            <p class="text-gray-400">${demo.company_name} is now active</p>
          </div>
        </div>
        
        <div class="space-y-4 mb-6">
          <div class="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <div class="flex items-center gap-2 text-gray-400 text-sm mb-3">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
              </svg>
              Access Token
            </div>
            <div class="flex gap-2">
              <input 
                type="text" 
                value="${token}" 
                readonly 
                class="flex-1 px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white font-mono text-sm"
                id="token-input"
              />
              <button 
                onclick="copyToClipboard('${token}')"
                class="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-purple-400 font-medium transition-all"
                id="copy-btn"
              >
                Copy
              </button>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <p class="text-gray-500 text-sm mb-1">Company Code</p>
              <p class="text-white font-mono">${company.code_entreprise}</p>
            </div>
            <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <p class="text-gray-500 text-sm mb-1">Login URL</p>
              <p class="text-white text-sm">${window.location.origin}/login</p>
            </div>
          </div>
          
          <div class="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <h4 class="text-blue-400 font-semibold mb-2">Ready to Send</h4>
            <p class="text-gray-300 text-sm mb-3">Email template for ${demo.email}:</p>
            <div class="bg-gray-900/50 rounded-lg p-3 text-xs text-gray-300">
              Subject: Your RH Quantum Account is Ready!<br><br>
              Hi ${demo.contact_name},<br><br>
              Your RH Quantum analytics platform is now active!<br><br>
              🔗 Login: ${window.location.origin}/login<br>
              🔑 Access Token: ${token}<br><br>
              Start by importing your HR data to see instant insights.<br><br>
              Need help? Reply to this email.<br><br>
              The RH Quantum Team
            </div>
          </div>
        </div>
        
        <div class="flex gap-4">
          <button 
            onclick="document.getElementById('success-modal').remove()"
            class="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-semibold transition-all"
          >
            Close
          </button>
          <button 
            onclick="sendCredentialsEmail('${demo.email}', '${demo.contact_name}', '${token}')"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Send Credentials
          </button>
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
    
    // Add helper functions to window
    ;(window as any).copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text)
      const btn = document.getElementById('copy-btn')
      if (btn) {
        btn.innerHTML = '✓ Copied!'
        setTimeout(() => btn.innerHTML = 'Copy', 2000)
      }
    }
    
    ;(window as any).sendCredentialsEmail = (email: string, name: string, token: string) => {
      // This would integrate with your email service
      console.log('Sending credentials to:', { email, name, token })
      alert(`Credentials sent to ${email}! (In production, integrate with your email service)`)
      document.getElementById('success-modal')?.remove()
    }
  }

  // Composant de statistiques
  const StatsCards = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl p-4">
        <div className="text-2xl font-bold text-white">{stats.total}</div>
        <div className="text-sm text-gray-400">Total Requests</div>
      </div>
      <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-4">
        <div className="text-2xl font-bold text-orange-400">{stats.pending}</div>
        <div className="text-sm text-gray-400">Pending</div>
      </div>
      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
        <div className="text-2xl font-bold text-purple-400">{stats.scheduled}</div>
        <div className="text-sm text-gray-400">Scheduled</div>
      </div>
      <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
        <div className="text-2xl font-bold text-green-400">{stats.converted}</div>
        <div className="text-sm text-gray-400">Converted</div>
      </div>
    </div>
  )

  // Composant de chargement amélioré
  if (loading) {
    return (
      <div className="min-h-[600px] flex flex-col items-center justify-center">
        <div className="relative mb-4">
          <div className="w-20 h-20 border-4 border-cyan-500/30 rounded-full animate-pulse" />
          <div className="absolute inset-0 w-20 h-20 border-4 border-t-cyan-500 rounded-full animate-spin" />
=======
  const updateDemoStatus = async (demoId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/demo-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: demoId, status: newStatus })
      })

      if (!response.ok) {
        throw new Error('Failed to update demo')
      }

      loadDemos()
    } catch (err) {
      console.error('Error updating demo:', err)
      alert('Failed to update demo status')
    }
  }

  const createCompanyFromDemo = async (demo: any) => {
    setCreatingCompany(demo.id)
    
    try {
      console.log('🏢 Creating company from demo:', demo.company_name)

      const maxEmployees = 
        demo.employee_count === '1-50' ? 100 : 
        demo.employee_count === '51-200' ? 300 :
        demo.employee_count === '201-500' ? 600 : 1000

      const response = await fetch('/api/admin/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nom: demo.company_name,
          contact_name: demo.contact_name,
          email: demo.email,
          phone: demo.phone,
          subscription_plan: 'trial',
          trial_days: 30,
          max_employees: maxEmployees,
          employee_count: demo.employee_count
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create company')
      }

      const result = await response.json()
      console.log('✅ Company created successfully:', result.company.id)

      // Update demo status
      await fetch('/api/admin/demo-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: demo.id,
          status: 'converted',
          converted_to_company_id: result.company.id
        })
      })

      // Show success modal
      setSuccessModalData({
        demo,
        token: result.access_token,
        company: result.company
      })
      setShowSuccessModal(true)
      
      // Reload demos
      setTimeout(() => {
        setFilter('all')
        loadDemos()
      }, 1000)
      
    } catch (error) {
      console.error('❌ Company creation failed:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setCreatingCompany(null)
    }
  }

  const statusConfigs: Record<string, { label: string; color: string; icon: any }> = {
    pending: { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock },
    contacted: { label: 'Contacted', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Phone },
    scheduled: { label: 'Scheduled', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: Calendar },
    demo_completed: { label: 'Demo Done', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', icon: CheckCircle },
    converted: { label: 'Converted', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
    lost: { label: 'Lost', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle }
  }

  if (loading && !initialLoadDone.current) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Loading demo requests...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2 text-center">Error Loading Demos</h2>
          <p className="text-slate-400 text-center mb-4">{error}</p>
          <button
            onClick={loadDemos}
            className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-all"
          >
            Retry
          </button>
>>>>>>> 5a39fde6b165f4356ff6e2e7c7c1f456aea77edb
        </div>
        <p className="text-gray-400 animate-pulse">Loading demo requests...</p>
      </div>
    )
  }

  // Gestion des erreurs
  if (error) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center mb-4">
          <XCircle className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Error Loading Demos</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button 
          onClick={loadDemos}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 rounded-xl text-white font-semibold transition-all"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
<<<<<<< HEAD
    <div className="space-y-8">
      {/* Header avec gradient animé */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-green-500/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
              <Calendar size={32} className="text-white" />
=======
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Sparkles size={28} />
>>>>>>> 5a39fde6b165f4356ff6e2e7c7c1f456aea77edb
            </div>
            Demo Requests
          </h1>
          <p className="text-slate-400">Manage and convert demo requests into active customers</p>
        </div>

<<<<<<< HEAD
      {/* Statistiques */}
      <StatsCards />

      {/* Onglets de filtre */}
      <div className="flex gap-2 p-1 bg-gray-900/50 backdrop-blur rounded-2xl border border-gray-800">
        {(['all', 'pending', 'contacted', 'scheduled', 'demo_completed', 'converted'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-all ${
              filter === status
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            {status === 'all' ? 'All' : (statusConfig[status as DemoStatus]?.label || status)}
            {status !== 'all' && (
              <span className="ml-2 text-xs opacity-70">
                ({demos.filter(d => d.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Message si aucune démo */}
      {demos.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Demo Requests</h3>
          <p className="text-gray-400">
            {filter === 'all' 
              ? 'No demo requests found. New requests will appear here.'
              : `No ${filter} demos found. Try a different filter.`
            }
          </p>
        </div>
      )}

      {/* Cartes des démos */}
      <div className="space-y-6">
        {demos.map((demo: Demo) => {
          const isExpanded = expandedDemo === demo.id
          const config = statusConfig[demo.status] || statusConfig.pending
          const isCreating = creatingCompany === demo.id
          const IconComponent = config.icon
          
          return (
            <div 
              key={demo.id} 
              className={config.cardClasses}
            >
              {/* Indicateur de statut en haut */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.bg}`} />
              
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-2xl font-bold text-white">{demo.company_name}</h3>
                      <div className={`px-4 py-1.5 bg-gradient-to-r ${config.bg} ${config.border} border rounded-xl flex items-center gap-2`}>
                        <IconComponent size={16} className={config.text} />
                        <span className={`${config.text} text-sm font-medium`}>
=======
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total', count: demos.length, color: 'from-slate-700 to-slate-600', icon: Building2 },
            { label: 'Pending', count: demos.filter(d => d.status === 'pending').length, color: 'from-yellow-500 to-orange-500', icon: Clock },
            { label: 'Converted', count: demos.filter(d => d.status === 'converted').length, color: 'from-green-500 to-emerald-500', icon: CheckCircle },
            { label: 'Lost', count: demos.filter(d => d.status === 'lost').length, color: 'from-red-500 to-pink-500', icon: XCircle }
          ].map((stat, idx) => (
            <div key={idx} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon size={24} className="text-white" />
                </div>
                <div className="text-3xl font-bold text-white">{stat.count}</div>
              </div>
              <p className="text-slate-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'pending', 'contacted', 'scheduled', 'demo_completed', 'converted', 'lost'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                filter === status
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {status === 'all' ? 'All' : statusConfigs[status]?.label || status}
              {status !== 'all' && (
                <span className="ml-2 px-2 py-0.5 bg-black/20 rounded-full text-xs">
                  {demos.filter(d => d.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Demo List */}
        <div className="space-y-4">
          {demos.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl">
              <Building2 size={64} className="text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No demo requests found</p>
            </div>
          ) : (
            demos.map(demo => {
              const config = statusConfigs[demo.status] || statusConfigs.pending
              const isExpanded = expandedDemo === demo.id
              const isCreating = creatingCompany === demo.id

              return (
                <div
                  key={demo.id}
                  className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-white">{demo.company_name}</h3>
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${config.color}`}>
>>>>>>> 5a39fde6b165f4356ff6e2e7c7c1f456aea77edb
                          {config.label}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-400">
                          <User size={16} />
                          <span>{demo.contact_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Mail size={16} />
                          <span>{demo.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Building2 size={16} />
                          <span>{demo.employee_count} employees</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar size={16} />
                          <span>{new Date(demo.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
<<<<<<< HEAD
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <User size={16} />
                        <span>{demo.contact_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Mail size={16} />
                        <span className="truncate">{demo.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Building2 size={16} />
                        <span>{demo.employee_count} employees</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar size={16} />
                        <span>{new Date(demo.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Bouton de conversion universel */}
                    {!demo.converted_to_company_id && (
                      <button
                        onClick={() => createCompanyFromDemo(demo)}
                        disabled={isCreating}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
                      >
                        {isCreating ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Zap size={18} />
                            Create Company
                          </>
                        )}
                      </button>
                    )}

                    {/* Actions rapides selon le statut */}
                    {demo.status === 'pending' && (
                      <button
                        onClick={() => updateDemoStatus(demo.id, 'contacted')}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-blue-400 font-medium transition-all"
                      >
                        Mark Contacted
                      </button>
                    )}
                    
                    {demo.converted_to_company_id && (
                      <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 font-medium flex items-center gap-2">
                        <CheckCircle size={18} />
                        Converted
                      </div>
                    )}
                    
                    <button
                      onClick={() => setExpandedDemo(isExpanded ? null : demo.id)}
                      className="p-2 hover:bg-gray-700/50 rounded-lg transition-all"
                    >
                      {isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  </div>
                </div>
                
                {/* Détails étendus */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-gray-700 animate-slideDown">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="text-white font-semibold mb-3">Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Industry:</span>
                            <span className="text-gray-300">{demo.industry || 'Not specified'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Phone:</span>
                            <span className="text-gray-300">{demo.phone || 'Not provided'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Country:</span>
                            <span className="text-gray-300">{demo.country || 'France'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Source:</span>
                            <span className="text-gray-300">{demo.source || 'Website'}</span>
                          </div>
                          {demo.qualification_score && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Score:</span>
                              <span className="text-gray-300">{demo.qualification_score}/100</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-semibold mb-3">Status Flow</h4>
                        <div className="space-y-2">
                          {demo.status !== 'converted' && demo.status !== 'lost' && (
                            <>
                              {demo.status === 'pending' && (
                                <button
                                  onClick={() => updateDemoStatus(demo.id, 'contacted')}
                                  className="w-full px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 text-sm transition-all"
                                >
                                  → Mark as Contacted
                                </button>
                              )}
                              {demo.status === 'contacted' && (
                                <button
                                  onClick={() => updateDemoStatus(demo.id, 'scheduled')}
                                  className="w-full px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 text-sm transition-all"
                                >
                                  → Schedule Demo
                                </button>
                              )}
                              {demo.status === 'scheduled' && (
                                <button
                                  onClick={() => updateDemoStatus(demo.id, 'demo_completed')}
                                  className="w-full px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm transition-all"
                                >
                                  → Complete Demo
                                </button>
                              )}
                              <button
                                onClick={() => updateDemoStatus(demo.id, 'lost')}
                                className="w-full px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-sm transition-all"
                              >
                                × Mark as Lost
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-semibold mb-3">Timeline</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Requested:</span>
                            <span className="text-gray-300">
                              {new Date(demo.created_at).toLocaleString()}
                            </span>
                          </div>
                          {demo.updated_at && demo.updated_at !== demo.created_at && (
=======
                    <div className="flex items-center gap-2">
                      {!demo.converted_to_company_id && (
                        <button
                          onClick={() => createCompanyFromDemo(demo)}
                          disabled={isCreating}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 disabled:opacity-50 rounded-xl text-white font-medium transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
                        >
                          {isCreating ? (
                            <>
                              <Loader2 className="animate-spin" size={18} />
                              Creating...
                            </>
                          ) : (
                            <>
                              <Zap size={18} />
                              Create Company
                            </>
                          )}
                        </button>
                      )}

                      {demo.status === 'pending' && (
                        <button
                          onClick={() => updateDemoStatus(demo.id, 'contacted')}
                          className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-blue-400 font-medium transition-all"
                        >
                          Mark Contacted
                        </button>
                      )}
                      
                      {demo.converted_to_company_id && (
                        <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 font-medium flex items-center gap-2">
                          <CheckCircle size={18} />
                          Converted
                        </div>
                      )}
                      
                      <button
                        onClick={() => setExpandedDemo(isExpanded ? null : demo.id)}
                        className="p-2 hover:bg-slate-700/50 rounded-lg transition-all"
                      >
                        {isExpanded ? <ChevronUp /> : <ChevronDown />}
                      </button>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-slate-700">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="text-white font-semibold mb-3">Details</h4>
                          <div className="space-y-2 text-sm">
>>>>>>> 5a39fde6b165f4356ff6e2e7c7c1f456aea77edb
                            <div className="flex justify-between">
                              <span className="text-slate-500">Industry:</span>
                              <span className="text-slate-300">{demo.industry || 'Not specified'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Phone:</span>
                              <span className="text-slate-300">{demo.phone || 'Not provided'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Country:</span>
                              <span className="text-slate-300">{demo.country || 'France'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-white font-semibold mb-3">Status Flow</h4>
                          <div className="space-y-2">
                            {demo.status !== 'converted' && demo.status !== 'lost' && (
                              <>
                                {demo.status === 'pending' && (
                                  <button
                                    onClick={() => updateDemoStatus(demo.id, 'contacted')}
                                    className="w-full px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 text-sm"
                                  >
                                    → Mark as Contacted
                                  </button>
                                )}
                                {demo.status === 'contacted' && (
                                  <button
                                    onClick={() => updateDemoStatus(demo.id, 'scheduled')}
                                    className="w-full px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 text-sm"
                                  >
                                    → Schedule Demo
                                  </button>
                                )}
                                {demo.status === 'scheduled' && (
                                  <button
                                    onClick={() => updateDemoStatus(demo.id, 'demo_completed')}
                                    className="w-full px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm"
                                  >
                                    → Complete Demo
                                  </button>
                                )}
                                <button
                                  onClick={() => updateDemoStatus(demo.id, 'lost')}
                                  className="w-full px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-sm"
                                >
                                  × Mark as Lost
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-white font-semibold mb-3">Timeline</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Requested:</span>
                              <span className="text-slate-300">
                                {new Date(demo.created_at).toLocaleString()}
                              </span>
                            </div>
<<<<<<< HEAD
                          )}
                          {demo.scheduled_date && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Scheduled:</span>
                              <span className="text-gray-300">
                                {new Date(demo.scheduled_date).toLocaleString()}
                              </span>
                            </div>
                          )}
=======
                            {demo.updated_at && (
                              <div className="flex justify-between">
                                <span className="text-slate-500">Updated:</span>
                                <span className="text-slate-300">
                                  {new Date(demo.updated_at).toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>
>>>>>>> 5a39fde6b165f4356ff6e2e7c7c1f456aea77edb
                        </div>
                      </div>
                      
                      {demo.message && (
                        <div className="mt-4 p-4 bg-slate-800/50 rounded-xl">
                          <h4 className="text-white font-semibold mb-2">Message</h4>
                          <p className="text-slate-300 text-sm">{demo.message}</p>
                        </div>
                      )}
                    </div>
<<<<<<< HEAD
                    
                    {demo.message && (
                      <div className="mt-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                        <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                          <Mail size={16} />
                          Message
                        </h4>
                        <p className="text-gray-300 text-sm italic">"{demo.message}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* CSS pour les animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}</style>
=======
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && successModalData && (
        <SuccessModal
          demo={successModalData.demo}
          token={successModalData.token}
          company={successModalData.company}
          onClose={() => {
            setShowSuccessModal(false)
            setSuccessModalData(null)
          }}
        />
      )}
>>>>>>> 5a39fde6b165f4356ff6e2e7c7c1f456aea77edb
    </div>
  )
}