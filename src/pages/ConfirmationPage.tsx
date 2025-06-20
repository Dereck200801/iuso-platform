import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, GraduationCap, Mail, FileText, Calendar, Sparkles, Trophy, Download } from "lucide-react"

const ConfirmationPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showConfetti, setShowConfetti] = useState(false)
  
  // Récupérer les données passées depuis l'inscription ou la vérification d'email
  const { message, email, numeroDossier, needsEmailVerification, fromEmailVerification, inscriptionComplete } = location.state || {}

  useEffect(() => {
    // Vérifier s'il y a des données de vérification d'email réussie
    const verificationSuccess = localStorage.getItem('verification_success')
    if (verificationSuccess && !location.state) {
      const data = JSON.parse(verificationSuccess)
      localStorage.removeItem('verification_success')
      // Rediriger avec les bonnes données
      navigate('/confirmation', {
        state: {
          message: 'Email vérifié avec succès ! Votre inscription est maintenant complète.',
          email: data.email,
          numeroDossier: data.numeroDossier,
          needsEmailVerification: false,
          fromEmailVerification: true
        },
        replace: true
      })
      return
    }

    // Si pas de données, rediriger vers l'inscription
    if (!message && !email && !verificationSuccess) {
      navigate('/inscription')
    } else {
      // Déclencher l'animation de confettis après un court délai
      setTimeout(() => setShowConfetti(true), 500)
    }
  }, [message, email, navigate, location.state])

  if (!message && !email && !localStorage.getItem('verification_success')) {
    return null
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-emerald-50 py-10 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <div className={`w-2 h-2 ${
                ['bg-emerald-500', 'bg-blue-500', 'bg-yellow-500', 'bg-pink-500', 'bg-purple-500'][Math.floor(Math.random() * 5)]
              } rounded-full`} />
            </div>
          ))}
        </div>
      )}

      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>
      </div>

      <div className="container mx-auto max-w-4xl space-y-8 relative z-10">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-full text-sm font-semibold font-gilroy mb-4 shadow-lg animate-bounce">
            <Trophy className="h-5 w-5" />
            Inscription confirmée avec succès !
          </div>
          
          <div className="relative">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 font-gilroy animate-fade-in delay-300">
              🎉 Félicitations !
              <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                Inscription réussie
              </span>
            </h1>
            <div className="absolute -top-4 -right-4 animate-spin-slow">
              <Sparkles className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="absolute -bottom-2 -left-4 animate-bounce delay-1000">
              <Sparkles className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
          
          <p className="text-xl text-slate-600 font-gilroy animate-fade-in delay-500">
            🚀 Votre candidature au concours a été soumise avec succès
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm animate-fade-in delay-700 transform hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="pb-6 text-center bg-gradient-to-r from-emerald-50 to-blue-50 rounded-t-xl">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900 font-gilroy">
              🎓 Votre dossier de candidature
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <Alert className="backdrop-blur-sm shadow-lg border-emerald-300 bg-gradient-to-r from-emerald-50 to-emerald-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-emerald-600 animate-bounce" />
                <Trophy className="h-5 w-5 text-yellow-600" />
              </div>
              <AlertTitle className="text-slate-900 font-gilroy font-bold text-lg">
                ✅ Numéro de dossier officiel attribué
              </AlertTitle>
              <AlertDescription className="text-slate-700 font-gilroy text-base">
                <div className="bg-white/80 p-4 rounded-lg mt-2 border-l-4 border-emerald-500">
                  <div className="text-2xl font-bold mb-2 text-emerald-700">
                    📋 {numeroDossier}
                  </div>
                  <div className="space-y-2">
                    <strong className="text-emerald-800">🎉 Inscription enregistrée avec succès !</strong> 
                    <br />
                    Votre candidature est maintenant dans notre système et sera examinée par nos équipes.
                    <br />
                    <span className="text-sm text-emerald-600">
                      ⚠️ Conservez précieusement ce numéro - il vous sera demandé pour toute correspondance.
                    </span>
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-slate-900 font-gilroy flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                  📧 Candidature enregistrée
                </h3>
                <p className="text-slate-700 font-gilroy">
                  Email de contact :
                  <br />
                  <strong className="text-blue-800 bg-white/60 px-2 py-1 rounded mt-1 inline-block">
                    {email}
                  </strong>
                </p>
                <p className="text-sm text-slate-600 font-gilroy bg-blue-100 p-2 rounded">
                  💡 Vous recevrez toutes les communications sur cette adresse
                </p>
              </div>

              <div className="space-y-4 p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-slate-900 font-gilroy flex items-center gap-3">
                  <FileText className="h-6 w-6 text-emerald-600" />
                  📄 Documents soumis
                </h3>
                <ul className="text-slate-700 font-gilroy space-y-3">
                  <li className="flex items-center gap-3 bg-white/60 p-2 rounded">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    📸 Photo d'identité
                  </li>
                  <li className="flex items-center gap-3 bg-white/60 p-2 rounded">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    📜 Attestation du Baccalauréat
                  </li>
                </ul>
              </div>
            </div>

            <Alert className="border-blue-300 bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-sm shadow-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
              <AlertTitle className="text-slate-900 font-gilroy font-bold text-lg">
                🗓️ Prochaines étapes
              </AlertTitle>
              <AlertDescription className="text-slate-700 font-gilroy space-y-4 text-base">
                <>
                  <div className="bg-white/80 p-4 rounded-lg border-l-4 border-blue-500">
                    <strong className="text-blue-800">1. 🔍 Validation du dossier</strong>
                    <br />Votre dossier sera examiné par nos équipes dans les <strong>5 jours ouvrables</strong>.
                  </div>
                  <div className="bg-white/80 p-4 rounded-lg border-l-4 border-purple-500">
                    <strong className="text-purple-800">2. 📋 Convocation aux épreuves</strong>
                    <br />Si votre dossier est retenu, vous recevrez une convocation par email avec les détails des épreuves.
                  </div>
                  <div className="bg-white/80 p-4 rounded-lg border-l-4 border-emerald-500">
                    <strong className="text-emerald-800">3. 🏆 Résultats</strong>
                    <br />Les résultats seront communiqués par email et disponibles sur votre espace candidat.
                  </div>
                </>
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-emerald-200">
              <Button 
                onClick={() => navigate('/login')}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white font-gilroy font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                🚀 Accéder à mon espace candidat
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1 px-8 py-4 border-2 border-slate-300 text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 font-gilroy font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                🏠 Retour à l'accueil
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4 animate-fade-in delay-1000">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <p className="text-slate-600 font-gilroy text-lg">
              ❓ Besoin d'aide ? Contactez-nous à{' '}
              <a 
                href="mailto:concours@iuso-sne.org" 
                className="text-blue-600 hover:text-blue-700 font-bold underline decoration-2 decoration-blue-300 hover:decoration-blue-500 transition-all duration-300"
              >
                📧 concours@iuso-sne.org
              </a>
            </p>
            <p className="text-sm text-slate-500 font-gilroy mt-2">
              📞 Nous répondons sous 24h maximum
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationPage 