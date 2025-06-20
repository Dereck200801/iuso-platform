import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { FileText, Sparkles, ArrowLeft } from "lucide-react"

const AdminDossiersPage = () => {
  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-blue-50 py-10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center space-y-4 mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold font-gilroy mb-4 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Gestion des Dossiers
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 font-gilroy">
            Dossiers de
            <span className="block bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mt-2">
              candidature
            </span>
          </h1>
          <p className="text-lg text-slate-600 font-gilroy">
            Examinez et gérez les candidatures des étudiants
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-fade-in delay-300">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900 font-gilroy flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600" />
              Gestion des Dossiers
            </CardTitle>
            <CardDescription className="text-slate-600 font-gilroy text-lg">
              En cours de développement - Bientôt disponible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-slate-600 font-gilroy leading-relaxed">
                Cette page sera bientôt développée avec les composants shadcn/ui pour une gestion complète des dossiers de candidature.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200">
                  <h3 className="font-semibold text-slate-900 font-gilroy mb-2">Liste des candidatures</h3>
                  <p className="text-sm text-slate-600 font-gilroy">Visualisez toutes les candidatures soumises avec filtres et tri</p>
                </div>
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
                  <h3 className="font-semibold text-slate-900 font-gilroy mb-2">Évaluation des dossiers</h3>
                  <p className="text-sm text-slate-600 font-gilroy">Outils d'évaluation et de notation des candidatures</p>
                </div>
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
                  <h3 className="font-semibold text-slate-900 font-gilroy mb-2">Gestion des statuts</h3>
                  <p className="text-sm text-slate-600 font-gilroy">Mise à jour des statuts et notifications automatiques</p>
                </div>
                <div className="p-4 bg-yellow-50/50 rounded-xl border border-yellow-200">
                  <h3 className="font-semibold text-slate-900 font-gilroy mb-2">Rapports et exports</h3>
                  <p className="text-sm text-slate-600 font-gilroy">Génération de rapports et export des données</p>
                </div>
              </div>

              <div className="pt-4">
                <Button asChild variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50 font-gilroy font-medium rounded-xl">
                  <Link to="/admin" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Retour au dashboard admin
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDossiersPage