import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Sparkles, BarChart3, FileText, User, Settings } from "lucide-react"

const DashboardPage = () => {
  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-blue-50 py-10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center space-y-4 mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold font-gilroy mb-4 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Dashboard Candidat
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 font-gilroy">
            Votre espace
            <span className="block bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mt-2">
              personnel
            </span>
          </h1>
          <p className="text-lg text-slate-600 font-gilroy">
            Gérez votre candidature et suivez votre progression
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in delay-300">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900 font-gilroy">Tableau de bord</CardTitle>
                  <CardDescription className="text-slate-600 font-gilroy">Vue d'ensemble</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 font-gilroy mb-4">
                Consultez le statut de votre candidature et vos statistiques.
              </p>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-gilroy font-semibold rounded-xl" disabled>
                Bientôt disponible
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900 font-gilroy">Mes Documents</CardTitle>
                  <CardDescription className="text-slate-600 font-gilroy">Gestion des fichiers</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 font-gilroy mb-4">
                Téléchargez et gérez vos documents de candidature.
              </p>
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-gilroy font-semibold rounded-xl" disabled>
                Bientôt disponible
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900 font-gilroy">Mon Profil</CardTitle>
                  <CardDescription className="text-slate-600 font-gilroy">Informations personnelles</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 font-gilroy mb-4">
                Modifiez vos informations personnelles et préférences.
              </p>
              <Button className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-gilroy font-semibold rounded-xl" disabled>
                Bientôt disponible
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-12 shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-fade-in delay-500">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900 font-gilroy flex items-center gap-3">
              <Settings className="h-6 w-6 text-blue-600" />
              Développement en cours
            </CardTitle>
            <CardDescription className="text-slate-600 font-gilroy text-lg">
              Cette page sera bientôt enrichie avec de nouvelles fonctionnalités
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-slate-600 font-gilroy leading-relaxed">
                Nous travaillons activement pour vous offrir une expérience complète avec :
              </p>
              <ul className="space-y-2 text-slate-600 font-gilroy">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Suivi en temps réel de votre candidature
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Gestion avancée des documents
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                  Messagerie intégrée avec l'administration
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Notifications personnalisées
                </li>
              </ul>
              <div className="pt-4">
                <Button asChild variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50 font-gilroy font-medium rounded-xl">
                  <Link to="/">Retour à l'accueil</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage 