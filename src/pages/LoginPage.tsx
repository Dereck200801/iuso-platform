import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { signIn } from '../lib/auth'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Mail, Lock, Eye, EyeOff, Sparkles, Shield, Zap } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

type LoginForm = z.infer<typeof loginSchema>

const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  // Redirect if already logged in
  if (user) {
    navigate('/dashboard')
    return null
  }

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    try {
      await signIn(data.email, data.password)

      toast({
        title: 'Connexion réussie',
        description: 'Vous êtes maintenant connecté',
      })

      navigate('/dashboard')
    } catch (error: any) {
      /* ---------------------------------------------------------
       * Interprétation des erreurs courantes de Supabase Auth
       * ------------------------------------------------------- */
      let description = 'Une erreur est survenue lors de la connexion'

      if (error?.message?.includes('Invalid login credentials')) {
        description = 'Email ou mot de passe incorrect'
      } else if (error?.message?.includes('Email not confirmed')) {
        description = 'Veuillez confirmer votre adresse e-mail avant de vous connecter (lien reçu par courriel)'
      } else if (typeof error?.message === 'string') {
        description = error.message
      }

      toast({
        title: 'Erreur',
        description,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6 py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left side - Welcome section */}
        <div className="hidden lg:block space-y-8 animate-fade-in">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold font-gilroy mb-6 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Plateforme IUSO-SNE
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 font-gilroy mb-4">
              Bienvenue sur votre
              <span className="block bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mt-2">
                espace étudiant
              </span>
            </h1>
            <p className="text-xl text-slate-600 font-gilroy leading-relaxed">
              Votre passerelle vers l'excellence académique au Gabon
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 font-gilroy text-lg mb-2">Inscription simplifiée</h3>
                <p className="text-slate-600 leading-relaxed">
                  Déposez votre candidature en quelques clics avec tous vos documents
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 font-gilroy text-lg mb-2">Suivi en temps réel</h3>
                <p className="text-slate-600 leading-relaxed">
                  Suivez l'évolution de votre dossier étape par étape
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-3 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 font-gilroy text-lg mb-2">Sécurisé et fiable</h3>
                <p className="text-slate-600 leading-relaxed">
                  Vos données sont protégées et sauvegardées en sécurité
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-fade-in delay-300">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-slate-900 font-gilroy">Connexion</CardTitle>
            <CardDescription className="text-slate-600 font-gilroy">
              Connectez-vous à votre compte pour accéder à votre espace candidat
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-slate-700 font-gilroy font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="pl-12 h-12 bg-white/50 border-slate-200 rounded-xl font-gilroy focus:border-blue-500 focus:ring-blue-500/20"
                    placeholder="votre.email@example.com"
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 font-gilroy">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-slate-700 font-gilroy font-medium">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register('password')}
                    className="pl-12 pr-12 h-12 bg-white/50 border-slate-200 rounded-xl font-gilroy focus:border-blue-500 focus:ring-blue-500/20"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-slate-100 rounded-lg"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 font-gilroy">{errors.password.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-gilroy font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
                disabled={loading}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            <div className="mt-8 space-y-6">
              <Button variant="outline" className="w-full h-12 border-slate-200 text-slate-600 hover:bg-slate-50 font-gilroy font-medium rounded-xl" asChild>
                <Link to="/">Retour à l'accueil</Link>
              </Button>
              
              <div className="text-center">
                <p className="text-slate-600 font-gilroy">
                  Pas encore de compte ?{' '}
                  <Link to="/inscription" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200">
                    Créer un compte
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom CTA section for mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200/50">
        <div className="text-center">
          <p className="text-sm text-slate-600 font-gilroy mb-2">
            Prêt à commencer votre parcours ?
          </p>
          <Button asChild className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-gilroy font-semibold rounded-xl shadow-lg">
            <Link to="/inscription">Commencer ma candidature</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage 