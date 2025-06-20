import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { MessageSquare, Sparkles, ArrowLeft, Send, Users, Bell } from "lucide-react"

const AdminMessagingPage = () => {
  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-blue-50 py-10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center space-y-4 mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-emerald-200 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold font-gilroy mb-4 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Messagerie Administrative
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 font-gilroy">
            Communication
            <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mt-2">
              avec les candidats
            </span>
          </h1>
          <p className="text-lg text-slate-600 font-gilroy">
            Système de messagerie intégré pour une communication efficace
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-fade-in delay-300">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900 font-gilroy flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-emerald-600" />
              Messagerie Administrative
            </CardTitle>
            <CardDescription className="text-slate-600 font-gilroy text-lg">
              Système de messagerie pour communiquer avec les candidats - En cours de développement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-slate-600 font-gilroy leading-relaxed">
                Cette page permettra aux administrateurs de communiquer directement avec les candidats de manière organisée et efficace.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
                  <h3 className="font-semibold text-slate-900 font-gilroy mb-2 flex items-center gap-2">
                    <Send className="h-4 w-4 text-emerald-600" />
                    Messages individuels
                  </h3>
                  <p className="text-sm text-slate-600 font-gilroy">Communiquez directement avec chaque candidat</p>
                </div>
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200">
                  <h3 className="font-semibold text-slate-900 font-gilroy mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    Messages groupés
                  </h3>
                  <p className="text-sm text-slate-600 font-gilroy">Envoyez des messages à plusieurs candidats simultanément</p>
                </div>
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
                  <h3 className="font-semibold text-slate-900 font-gilroy mb-2 flex items-center gap-2">
                    <Bell className="h-4 w-4 text-slate-600" />
                    Notifications automatiques
                  </h3>
                  <p className="text-sm text-slate-600 font-gilroy">Système de notifications pour les mises à jour importantes</p>
                </div>
                <div className="p-4 bg-yellow-50/50 rounded-xl border border-yellow-200">
                  <h3 className="font-semibold text-slate-900 font-gilroy mb-2">Historique des échanges</h3>
                  <p className="text-sm text-slate-600 font-gilroy">Consultez l'historique complet des communications</p>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-emerald-50/50 to-blue-50/50 rounded-2xl border border-emerald-200">
                <h3 className="font-bold text-slate-900 font-gilroy mb-4">Fonctionnalités prévues :</h3>
                <ul className="space-y-2 text-slate-600 font-gilroy">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Interface de messagerie en temps réel
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Pièces jointes et documents
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                    Modèles de messages prédéfinis
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Statuts de lecture et de réponse
                  </li>
                </ul>
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

export default AdminMessagingPage 