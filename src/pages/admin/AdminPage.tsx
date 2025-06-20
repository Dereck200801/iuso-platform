import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Settings, Sparkles, Users, FileText, MessageSquare, BarChart3 } from "lucide-react"

const AdminPage = () => {
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
            Administration IUSO-SNE
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 font-gilroy">
            Tableau de bord
            <span className="block bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mt-2">
              Administrateur
            </span>
          </h1>
          <p className="text-lg text-slate-600 font-gilroy">
            Gérez les candidatures et l'administration de la plateforme
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in delay-300">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900 font-gilroy">Dossiers</CardTitle>
                  <CardDescription className="text-slate-600 font-gilroy">Gestion des candidatures</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 font-gilroy mb-4">
                Examinez et gérez les candidatures des étudiants.
              </p>
              <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-gilroy font-semibold rounded-xl">
                <Link to="/admin/dossiers">Gérer les dossiers</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900 font-gilroy">Messages</CardTitle>
                  <CardDescription className="text-slate-600 font-gilroy">Communication</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 font-gilroy mb-4">
                Communiquez avec les candidats et gérez les messages.
              </p>
              <Button asChild className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-gilroy font-semibold rounded-xl">
                <Link to="/admin/messages">Voir les messages</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900 font-gilroy">Statistiques</CardTitle>
                  <CardDescription className="text-slate-600 font-gilroy">Rapports et analyses</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 font-gilroy mb-4">
                Consultez les statistiques et rapports détaillés.
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
              Administration
            </CardTitle>
            <CardDescription className="text-slate-600 font-gilroy text-lg">
              Tableau de bord administrateur - En cours de développement avec shadcn/ui
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-slate-600 font-gilroy leading-relaxed">
                Cette page sera bientôt développée avec les composants shadcn/ui pour la gestion administrative complète.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200">
                  <h3 className="font-semibold text-slate-900 font-gilroy mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    Gestion des utilisateurs
                  </h3>
                  <p className="text-sm text-slate-600 font-gilroy">Administrez les comptes candidats et administrateurs</p>
                </div>
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
                  <h3 className="font-semibold text-slate-900 font-gilroy mb-2 flex items-center gap-2">
                    <Settings className="h-4 w-4 text-emerald-600" />
                    Configuration système
                  </h3>
                  <p className="text-sm text-slate-600 font-gilroy">Paramètres avancés de la plateforme</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminPage 