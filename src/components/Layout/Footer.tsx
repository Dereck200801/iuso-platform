import { Link } from 'react-router-dom'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Users,
  Award,
  Youtube,
  Send,
  GraduationCap,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IUSO_INFO } from '../../lib/constants'
// Import du logo IUSO
import iusoLogo from '../../assets/logo-iuso.png'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { label: 'Accueil', href: '/' },
    { label: 'Formations', href: '/formations' },
    { label: 'À propos', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' }
  ]

  const studentLinks = [
    { label: 'Inscription', href: '/inscription' },
    { label: 'Connexion', href: '/login' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Mon Profil', href: '/dashboard?tab=profil' },
    { label: 'Mes Documents', href: '/dashboard?tab=documents' }
  ]

  const legalLinks = [
    { label: 'Mentions légales', href: '/legal' },
    { label: 'Politique de confidentialité', href: '/privacy' },
    { label: 'Conditions d\'utilisation', href: '/terms' },
    { label: 'Cookies', href: '/cookies' }
  ]

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: '#', label: 'Facebook' },
    { icon: <Twitter className="h-5 w-5" />, href: '#', label: 'Twitter' },
    { icon: <Linkedin className="h-5 w-5" />, href: '#', label: 'LinkedIn' },
    { icon: <Instagram className="h-5 w-5" />, href: '#', label: 'Instagram' },
    { icon: <Youtube className="h-5 w-5" />, href: '#', label: 'YouTube' }
  ]

  const stats = [
    { icon: <Users className="h-6 w-6" />, value: '2,500+', label: 'Étudiants' },
    { icon: <GraduationCap className="h-6 w-6" />, value: '15+', label: 'Programmes' },
    { icon: <Award className="h-6 w-6" />, value: '98%', label: 'Réussite' },
    { icon: <Globe className="h-6 w-6" />, value: '25+', label: 'Pays' }
  ]

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 text-white overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-yellow-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-purple-500/10 rounded-full blur-xl"></div>
      </div>

      <div className="relative container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info avec logo IUSO */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <img 
                src={iusoLogo} 
                alt="Logo IUSO" 
                className="h-12 w-auto object-contain sm:h-14 md:h-16"
              />
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-gilroy text-white">
                  {IUSO_INFO.name}
                </h3>
                <p className="text-slate-300 text-sm font-medium">
                  Excellence académique
                </p>
              </div>
            </div>
            
            <p className="text-slate-300 leading-relaxed">
              {IUSO_INFO.fullName} forme les leaders de demain 
              avec des programmes d'excellence et un accompagnement personnalisé au Gabon.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-blue-400">
                      {stat.icon}
                    </div>
                    <span className="text-2xl font-bold font-gilroy text-white">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold font-gilroy text-white mb-6 flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-blue-400" />
              Liens rapides
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href} 
                    className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group font-gilroy"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:bg-white transition-colors duration-200"></div>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Student Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold font-gilroy text-white mb-6 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-400" />
              Espace étudiant
            </h4>
            <ul className="space-y-4">
              {studentLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href} 
                    className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group font-gilroy"
                  >
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full group-hover:bg-white transition-colors duration-200"></div>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold font-gilroy text-white mb-6 flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-400" />
              Contact
            </h4>
            
            <div className="space-y-6">
              {/* Adresse */}
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold font-gilroy mb-1">Adresse</p>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {IUSO_INFO.contact.address}
                  </p>
                </div>
              </div>

              {/* Téléphones */}
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-emerald-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold font-gilroy mb-1">Téléphones</p>
                  <div className="space-y-1">
                    {IUSO_INFO.contact.phones.map((phone, index) => (
                      <p key={index} className="text-slate-300 text-sm">
                        {phone}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold font-gilroy mb-1">Email</p>
                  <p className="text-slate-300 text-sm">
                    {IUSO_INFO.contact.email}
                  </p>
                </div>
              </div>

              {/* Horaires */}
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold font-gilroy mb-1">Horaires</p>
                  <div className="space-y-1 text-slate-300 text-sm">
                    <p>Lun-Ven: {IUSO_INFO.schedule.weekdays}</p>
                    <p>Samedi: {IUSO_INFO.schedule.saturday}</p>
                    <p>Dimanche: {IUSO_INFO.schedule.sunday}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-white/10 pt-12 mt-12">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-2xl font-bold font-gilroy text-white mb-4 flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-400" />
              Restez informé
            </h4>
            <p className="text-slate-300 mb-8 font-gilroy">
              Recevez les dernières actualités de l'IUSO-SNE et les informations importantes sur les admissions
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Votre adresse email"
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 font-gilroy"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold font-gilroy px-8 transition-all duration-300 transform hover:scale-105">
                <Send className="h-4 w-4 mr-2" />
                S'abonner
              </Button>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-white/10 pt-12 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Social Icons */}
            <div className="flex items-center gap-6">
              <p className="text-white font-semibold font-gilroy">Suivez-nous :</p>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 transform hover:scale-110 hover:rotate-6 group"
                  >
                    <div className="transform group-hover:scale-110 transition-transform duration-200">
                      {social.icon}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex flex-col sm:flex-row items-center gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="font-gilroy">Établissement privé reconnu</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-yellow-400" />
                <span className="font-gilroy">Formations certifiées</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="text-sm text-slate-400 hover:text-white transition-colors duration-200 font-gilroy"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            <p className="text-sm text-slate-400 font-gilroy">
              © {currentYear} {IUSO_INFO.name}. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 