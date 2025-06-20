import { Link } from 'react-router-dom'
import { IUSO_INFO } from '../../lib/constants'

export const SimpleFooter = () => {
  const currentYear = new Date().getFullYear()

  const legalLinks = [
    { label: 'Mentions légales', href: '/legal' },
    { label: 'Politique de confidentialité', href: '/privacy' },
    { label: 'Conditions d\'utilisation', href: '/terms' },
    { label: 'Cookies', href: '/cookies' }
  ]

  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            {legalLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200 font-gilroy"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <p className="text-sm text-slate-500 font-gilroy">
            © {currentYear} {IUSO_INFO.name}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
} 