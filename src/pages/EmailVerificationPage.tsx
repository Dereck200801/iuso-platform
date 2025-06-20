import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, AlertCircle, Mail, Loader2, GraduationCap, Sparkles } from "lucide-react"

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading')
  const [userEmail, setUserEmail] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // 🔧 MODE DÉVELOPPEMENT : Cette page est temporairement désactivée
  useEffect(() => {
    console.log('🔧 EmailVerificationPage : Mode développement - Redirection automatique')
    toast({
      title: '🔧 Mode développement',
      description: 'Confirmation email désactivée - Inscriptions directes activées',
      variant: 'default',
    })
    
    // Rediriger vers la page d'inscription avec un message
    navigate('/inscription', { 
      state: { 
        devModeMessage: 'Mode développement : Les confirmations email sont temporairement désactivées. Les inscriptions sont enregistrées directement.' 
      }
    })
    return
  }, [navigate, toast])

  // Le reste du code original reste commenté pour réactivation future
  /*
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Récupérer les paramètres de l'URL
        const token = searchParams.get('token')
        const type = searchParams.get('type')
        
        console.log('EmailVerificationPage - Paramètres URL:', { token: token?.substring(0, 20) + '...', type })
        
        if (type === 'signup' && token) {
          // Vérifier le token avec Supabase
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          })
          
          console.log('Résultat vérification OTP:', { 
            success: !error, 
            user: data?.user?.email,
            error: error?.message 
          })

          if (error) {
            console.error('Erreur de vérification:', error)
            if (error.message.includes('expired')) {
              setVerificationStatus('expired')
            } else {
              setVerificationStatus('error')
            }
            return
          }

          if (data.user) {
            setUserEmail(data.user.email || '')
            
            // Récupérer les données temporaires de l'inscription (localStorage + base)
            let tempData = localStorage.getItem(`inscription_temp_${data.user.id}`)
            
            // Si pas trouvé en localStorage, essayer la table temporaire
            if (!tempData) {
              console.log('Pas de données en localStorage, vérification de la table temporaire...')
              try {
                const { data: tempDbData, error: tempDbError } = await supabase
                  .from('inscrits_temp')
                  .select('data')
                  .eq('user_id', data.user.id)
                  .order('created_at', { ascending: false })
                  .limit(1)
                
                if (!tempDbError && tempDbData && tempDbData.length > 0) {
                  tempData = JSON.stringify(tempDbData[0].data)
                  console.log('✅ Données récupérées depuis la table temporaire')
                } else {
                  console.log('Aucune donnée trouvée dans la table temporaire')
                }
              } catch (error) {
                console.log('Erreur accès table temporaire:', error)
              }
            } else {
              console.log('✅ Données temporaires trouvées en localStorage')
            }
            
            if (tempData) {
              try {
                const inscriptionData = JSON.parse(tempData)
                console.log('Données d\'inscription récupérées:', {
                  email: inscriptionData.email,
                  prenom: inscriptionData.prenom,
                  nom: inscriptionData.nom,
                  alreadyInDb: inscriptionData.already_in_db
                })
                
                let numeroDossier = inscriptionData.numero_dossier
                
                // Si l'inscription est déjà dans la base, juste mettre à jour le statut
                if (inscriptionData.already_in_db && numeroDossier) {
                  console.log('Inscription déjà en base, mise à jour du statut pour:', numeroDossier)
                  
                  // Mettre à jour le statut pour confirmer l'email
                  const { error: updateError } = await supabase
                    .from('inscrits')
                    .update({ 
                      statut: 'en_attente',
                      updated_at: new Date().toISOString()
                    })
                    .eq('numero_dossier', numeroDossier)
                    .eq('user_id', data.user.id)

                  if (updateError) {
                    console.error('Erreur mise à jour statut:', updateError)
                    // Continuer quand même, l'inscription existe
                  } else {
                    console.log('Statut mis à jour avec succès pour:', numeroDossier)
                  }
                } else {
                  // L'inscription n'est pas encore en base, utiliser la fonction de transfert
                  console.log('Transfert des données vers la table inscrits...')
                  
                  // Utiliser la fonction RPC de transfert optimisée
                  const { data: transferResult, error: transferError } = await supabase.rpc(
                    'transfer_candidate_to_inscrits',
                    {
                      p_user_id: data.user.id,
                      p_email: inscriptionData.email,
                      p_temp_data: inscriptionData
                    }
                  )

                  if (transferError || (transferResult && !transferResult.success)) {
                    console.error('Erreur fonction de transfert:', transferError || transferResult.error)
                    
                    // Fallback : insertion manuelle avec la bonne structure
                    console.log('Fallback: insertion manuelle...')
                    numeroDossier = `LIC${new Date().getFullYear().toString().slice(-2)}${Date.now().toString().slice(-6)}`
                    
                    const { error: insertError } = await supabase
                      .from('inscrits')
                      .insert({
                        auth_user_id: data.user.id, // Correction: auth_user_id au lieu de user_id
                        numero_dossier: numeroDossier,
                        prenom: inscriptionData.prenom,
                        nom: inscriptionData.nom,
                        genre: inscriptionData.genre,
                        date_naissance: inscriptionData.date_naissance,
                        lieu_naissance: inscriptionData.lieu_naissance,
                        nationalite: inscriptionData.nationalite,
                        email: inscriptionData.email,
                        telephone: inscriptionData.telephone,
                        adresse: inscriptionData.adresse,
                        cycle: inscriptionData.cycle,
                        filiere: inscriptionData.filiere,
                        mot_de_passe: inscriptionData.mot_de_passe,
                        photo_identite_url: inscriptionData.photo_identite_url,
                        attestation_bac_url: inscriptionData.attestation_bac_url,
                        statut: 'en_attente',
                        transferred_from_temp: true,
                        email_verified_at: new Date().toISOString(),
                        date_inscription: new Date().toISOString(),
                        date_modification: new Date().toISOString()
                      })

                    if (insertError) {
                      console.error('Erreur insertion manuelle dans inscrits:', insertError)
                      toast({
                        title: 'Erreur de finalisation',
                        description: `Impossible de finaliser votre inscription: ${insertError.message}. Veuillez contacter le support.`,
                        variant: 'destructive',
                      })
                      setVerificationStatus('error')
                      return
                    }
                    
                    console.log('Inscription finalisée avec succès (fallback), numéro:', numeroDossier)
                  } else {
                    // Succès avec la fonction de transfert
                    console.log('Fonction de transfert réussie:', transferResult)
                    numeroDossier = transferResult?.numero_dossier || `LIC${Date.now().toString().slice(-6)}`
                    console.log('Inscription finalisée avec succès, numéro:', numeroDossier)
                  }
                }

                // Nettoyer les données temporaires (localStorage + base)
                localStorage.removeItem(`inscription_temp_${data.user.id}`)
                
                // Nettoyer aussi la table temporaire
                try {
                  await supabase
                    .from('inscrits_temp')
                    .delete()
                    .eq('user_id', data.user.id)
                  console.log('✅ Données temporaires nettoyées de la base')
                } catch (error) {
                  console.log('Erreur nettoyage table temporaire:', error)
                }
                
                // Stocker les infos pour la page de confirmation
                localStorage.setItem('verification_success', JSON.stringify({
                  email: inscriptionData.email,
                  numeroDossier: numeroDossier,
                  prenom: inscriptionData.prenom,
                  nom: inscriptionData.nom
                }))
              } catch (parseError) {
                console.error('Erreur parsing des données temporaires:', parseError)
                setVerificationStatus('error')
                return
              }
            } else {
              console.warn('Aucune donnée temporaire trouvée pour l\'utilisateur:', data.user.id)
              // Continuer quand même la vérification même sans données temporaires
              localStorage.setItem('verification_success', JSON.stringify({
                email: data.user.email,
                numeroDossier: `IUSO${Date.now().toString().slice(-6)}`,
                prenom: 'Utilisateur',
                nom: 'Vérifié'
              }))
            }
            
            setVerificationStatus('success')
          }
        } else {
          console.log('Paramètres URL invalides:', { type, token: !!token })
          setVerificationStatus('error')
        }
      } catch (error) {
        console.error('Erreur générale dans handleEmailConfirmation:', error)
        toast({
          title: 'Erreur de vérification',
          description: 'Une erreur inattendue est survenue. Veuillez réessayer.',
          variant: 'destructive',
        })
        setVerificationStatus('error')
      }
    }

    const timer = setTimeout(handleEmailConfirmation, 500)
    return () => clearTimeout(timer)
  }, [searchParams, toast])
  */

  // Rendu simple en mode développement
  return (
    <div className="min-h-full bg-gradient-to-br from-orange-50 via-white to-orange-50 py-10 flex items-center justify-center">
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm max-w-md">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl">🔧</span>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 font-gilroy">
            Mode développement
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-slate-600 font-gilroy">
            La confirmation email est temporairement désactivée.
          </p>
          <p className="text-sm text-orange-600 font-gilroy">
            Redirection en cours...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default EmailVerificationPage 