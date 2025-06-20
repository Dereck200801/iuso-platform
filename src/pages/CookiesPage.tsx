import { Cookie, Shield, Settings, Eye, Database, Globe, CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";
import { IUSO_INFO } from "@/lib/constants";
import { useState } from "react";

const CookiesPage = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: false
  });

  const handlePreferenceChange = (type: string, value: boolean) => {
    if (type === 'necessary') return; // Ne peut pas être désactivé
    setCookiePreferences(prev => ({ ...prev, [type]: value }));
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16">
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 text-blue-800 px-6 py-3 rounded-full text-sm font-semibold font-gilroy shadow-lg">
            <Cookie className="h-4 w-4" />
            Politique cookies
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-gilroy text-slate-900">
            Politique relative aux cookies
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            Nous utilisons des cookies pour améliorer votre expérience. Cette politique explique comment et pourquoi
            nous les utilisons, et comment vous pouvez exercer vos choix.
          </p>
          <p className="text-sm text-slate-500 mt-4">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            <br />Version : 2.0
          </p>
        </div>
      </section>

      {/* Panneau de préférences rapide */}
      <section className="container mx-auto px-6 mb-8 max-w-4xl">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold font-gilroy text-slate-900">Gérer vos préférences de cookies</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(cookiePreferences).map(([type, enabled]) => (
              <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium capitalize">
                  {type === 'necessary' ? 'Nécessaires' : 
                   type === 'functional' ? 'Fonctionnels' :
                   type === 'analytics' ? 'Analytiques' : 'Marketing'}
                  {type === 'necessary' && <span className="text-xs text-gray-500 ml-2">(Requis)</span>}
                </span>
                <button
                  onClick={() => handlePreferenceChange(type, !enabled)}
                  disabled={type === 'necessary'}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enabled ? 'bg-blue-600' : 'bg-gray-300'
                  } ${type === 'necessary' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Sauvegarder mes préférences
          </button>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-24 space-y-8 max-w-4xl">
        {/* Introduction */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Info className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">1. Introduction</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              L'{IUSO_INFO.fullName} (ci-après "IUSO-SNE", "nous" ou "notre") utilise des cookies et d'autres technologies
              de suivi sur son site web www.iuso-sne.com (ci-après le "Site") pour améliorer votre expérience de navigation,
              analyser l'utilisation du site et personnaliser nos services.
            </p>
            <p>
              Cette politique explique ce que sont les cookies, comment nous les utilisons, les types de cookies que nous
              utilisons, comment vous pouvez contrôler vos préférences en matière de cookies et d'autres informations
              pertinentes.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Consentement :</strong> En utilisant notre Site, vous consentez à l'utilisation de cookies
                conformément à cette politique. Vous pouvez modifier vos préférences à tout moment.
              </p>
            </div>
          </div>
        </div>

        {/* Qu'est-ce qu'un cookie */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Cookie className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">2. Qu'est-ce qu'un cookie ?</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              Un cookie est un petit fichier texte qu'un site web enregistre sur votre ordinateur ou appareil mobile
              lorsque vous visitez ce site. Ce fichier permet au site de mémoriser vos actions et préférences
              (comme la connexion, la langue, la taille des caractères et d'autres préférences d'affichage) pendant
              une période donnée.
            </p>
            
            <h3 className="font-semibold mb-2 mt-4">Types de stockage :</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Cookies de session :</strong> Supprimés automatiquement lorsque vous fermez votre navigateur</li>
              <li><strong>Cookies persistants :</strong> Restent sur votre appareil pendant une période définie</li>
              <li><strong>Stockage local :</strong> Technologie similaire pour stocker des informations dans votre navigateur</li>
              <li><strong>Pixels espions :</strong> Petites images invisibles qui collectent des informations sur votre visite</li>
            </ul>

            <h3 className="font-semibold mb-2 mt-4">Origine des cookies :</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Cookies internes (first-party) :</strong> Définis par notre Site</li>
              <li><strong>Cookies tiers (third-party) :</strong> Définis par d'autres services que nous utilisons</li>
            </ul>
          </div>
        </div>

        {/* Pourquoi utilisons-nous des cookies */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">3. Pourquoi utilisons-nous des cookies ?</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>Nous utilisons des cookies pour plusieurs raisons importantes :</p>
            
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  Sécurité
                </h4>
                <p className="text-sm">Protéger votre compte et prévenir les activités frauduleuses</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Settings className="h-4 w-4 text-blue-600" />
                  Fonctionnalité
                </h4>
                <p className="text-sm">Mémoriser vos préférences et paramètres personnalisés</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Database className="h-4 w-4 text-purple-600" />
                  Analyse
                </h4>
                <p className="text-sm">Comprendre comment vous utilisez notre site pour l'améliorer</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-orange-600" />
                  Marketing
                </h4>
                <p className="text-sm">Vous proposer du contenu pertinent et mesurer l'efficacité</p>
              </div>
            </div>
          </div>
        </div>

        {/* Types de cookies utilisés */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Database className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">4. Types de cookies que nous utilisons</h2>
          </div>
          <div className="space-y-6 text-slate-700">
            {/* Cookies nécessaires */}
            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">4.1 Cookies strictement nécessaires</h3>
                  <p className="text-sm mb-3">
                    Ces cookies sont essentiels au fonctionnement du site. Ils ne peuvent pas être désactivés.
                  </p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-red-100">
                        <th className="text-left p-2">Nom</th>
                        <th className="text-left p-2">Objectif</th>
                        <th className="text-left p-2">Durée</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-red-200">
                        <td className="p-2">supabase-auth-token</td>
                        <td className="p-2">Authentification utilisateur</td>
                        <td className="p-2">Session</td>
                      </tr>
                      <tr className="border-t border-red-200">
                        <td className="p-2">csrf-token</td>
                        <td className="p-2">Protection contre les attaques CSRF</td>
                        <td className="p-2">Session</td>
                      </tr>
                      <tr className="border-t border-red-200">
                        <td className="p-2">cookie-consent</td>
                        <td className="p-2">Enregistrement du consentement</td>
                        <td className="p-2">1 an</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Cookies fonctionnels */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-start gap-3">
                <Settings className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">4.2 Cookies de fonctionnalité</h3>
                  <p className="text-sm mb-3">
                    Ces cookies permettent au site de mémoriser vos choix et de fournir des fonctionnalités améliorées.
                  </p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="text-left p-2">Nom</th>
                        <th className="text-left p-2">Objectif</th>
                        <th className="text-left p-2">Durée</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-blue-200">
                        <td className="p-2">language-preference</td>
                        <td className="p-2">Langue d'affichage préférée</td>
                        <td className="p-2">1 an</td>
                      </tr>
                      <tr className="border-t border-blue-200">
                        <td className="p-2">theme-preference</td>
                        <td className="p-2">Thème visuel (clair/sombre)</td>
                        <td className="p-2">1 an</td>
                      </tr>
                      <tr className="border-t border-blue-200">
                        <td className="p-2">form-autosave</td>
                        <td className="p-2">Sauvegarde automatique des formulaires</td>
                        <td className="p-2">30 jours</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Cookies analytiques */}
            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-purple-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">4.3 Cookies de performance/analytiques</h3>
                  <p className="text-sm mb-3">
                    Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site.
                  </p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-purple-100">
                        <th className="text-left p-2">Nom</th>
                        <th className="text-left p-2">Fournisseur</th>
                        <th className="text-left p-2">Objectif</th>
                        <th className="text-left p-2">Durée</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-purple-200">
                        <td className="p-2">_ga</td>
                        <td className="p-2">Google Analytics</td>
                        <td className="p-2">Distinguer les utilisateurs</td>
                        <td className="p-2">2 ans</td>
                      </tr>
                      <tr className="border-t border-purple-200">
                        <td className="p-2">_gid</td>
                        <td className="p-2">Google Analytics</td>
                        <td className="p-2">Distinguer les utilisateurs</td>
                        <td className="p-2">24 heures</td>
                      </tr>
                      <tr className="border-t border-purple-200">
                        <td className="p-2">_gat</td>
                        <td className="p-2">Google Analytics</td>
                        <td className="p-2">Limiter le taux de requêtes</td>
                        <td className="p-2">1 minute</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Cookies marketing */}
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-orange-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">4.4 Cookies de marketing/ciblage</h3>
                  <p className="text-sm mb-3">
                    Ces cookies peuvent être utilisés pour vous proposer du contenu marketing pertinent.
                  </p>
                  <div className="bg-orange-100 p-3 rounded text-sm">
                    <AlertTriangle className="h-4 w-4 inline mr-2 text-orange-700" />
                    Actuellement, nous n'utilisons pas de cookies marketing. Si cela change, nous mettrons à jour cette politique.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gestion des cookies */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">5. Comment gérer vos cookies</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              Vous avez plusieurs options pour gérer les cookies sur votre appareil :
            </p>

            <h3 className="font-semibold mb-2 mt-4">5.1 Via notre panneau de préférences</h3>
            <p>
              Utilisez le panneau de préférences en haut de cette page pour activer ou désactiver certaines catégories
              de cookies (sauf les cookies strictement nécessaires).
            </p>

            <h3 className="font-semibold mb-2 mt-4">5.2 Via les paramètres de votre navigateur</h3>
            <p>
              La plupart des navigateurs vous permettent de contrôler les cookies via leurs paramètres :
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                <strong>Chrome :</strong>{' '}
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Gérer les cookies dans Chrome
                </a>
              </li>
              <li>
                <strong>Firefox :</strong>{' '}
                <a href="https://support.mozilla.org/fr/kb/cookies-informations-sites-enregistrent" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Gérer les cookies dans Firefox
                </a>
              </li>
              <li>
                <strong>Safari :</strong>{' '}
                <a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Gérer les cookies dans Safari
                </a>
              </li>
              <li>
                <strong>Edge :</strong>{' '}
                <a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Gérer les cookies dans Edge
                </a>
              </li>
            </ul>

            <div className="bg-orange-50 p-4 rounded-lg mt-4">
              <p className="text-sm text-orange-800">
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                <strong>Attention :</strong> Bloquer tous les cookies peut affecter votre expérience sur notre site.
                Certaines fonctionnalités peuvent ne plus fonctionner correctement.
              </p>
            </div>
          </div>
        </div>

        {/* Cookies tiers */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">6. Cookies tiers et services externes</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              Nous utilisons certains services tiers qui peuvent placer leurs propres cookies :
            </p>

            <div className="space-y-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Google Analytics</h3>
                <p className="text-sm mb-2">
                  Service d'analyse web qui nous aide à comprendre comment vous utilisez notre site.
                </p>
                <p className="text-sm">
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Politique de confidentialité de Google
                  </a>
                  {' | '}
                  <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Désactiver Google Analytics
                  </a>
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Supabase</h3>
                <p className="text-sm mb-2">
                  Notre plateforme d'hébergement et de base de données qui peut utiliser des cookies techniques.
                </p>
                <p className="text-sm">
                  <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Politique de confidentialité de Supabase
                  </a>
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 mt-4">
              Nous n'avons pas de contrôle direct sur les cookies placés par ces services tiers. Veuillez consulter
              leurs politiques de confidentialité respectives pour plus d'informations.
            </p>
          </div>
        </div>

        {/* Transferts internationaux */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">7. Transferts internationaux de données</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              Certains de nos fournisseurs de services tiers sont basés en dehors de l'Espace Économique Européen (EEE)
              et du Gabon. Les données collectées via les cookies peuvent donc être transférées et stockées dans ces pays.
            </p>
            <p>
              Nous nous assurons que ces transferts sont effectués conformément aux lois applicables en matière de
              protection des données, notamment en utilisant des clauses contractuelles types approuvées ou en nous
              appuyant sur d'autres mécanismes de transfert légaux.
            </p>
          </div>
        </div>

        {/* Enfants */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">8. Cookies et mineurs</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              Notre site s'adresse principalement à des personnes majeures. Si vous avez moins de 18 ans, veuillez
              consulter cette politique avec vos parents ou tuteurs légaux avant d'utiliser notre site.
            </p>
            <p>
              Nous encourageons les parents et tuteurs à surveiller l'utilisation d'Internet par leurs enfants et
              à les aider à exercer leurs droits en matière de confidentialité.
            </p>
          </div>
        </div>

        {/* Mises à jour */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Info className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">9. Modifications de cette politique</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              Nous pouvons mettre à jour cette politique de cookies de temps en temps pour refléter les changements
              dans nos pratiques ou pour d'autres raisons opérationnelles, légales ou réglementaires.
            </p>
            <p>
              Nous vous encourageons à consulter régulièrement cette page pour rester informé de notre utilisation
              des cookies et des technologies connexes. La date de "dernière mise à jour" en haut de cette politique
              indique quand elle a été révisée pour la dernière fois.
            </p>
            <p>
              Si nous apportons des changements importants qui affectent la manière dont nous traitons vos données
              via les cookies, nous vous en informerons par une notification sur notre site.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-8 border border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <Cookie className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">10. Nous contacter</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              Si vous avez des questions sur cette politique de cookies ou sur notre utilisation des cookies,
              n'hésitez pas à nous contacter :
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div>
                <h3 className="font-semibold mb-2">Service général</h3>
                <p>Email : <a href={`mailto:${IUSO_INFO.contact.email}`} className="text-blue-600 hover:underline">{IUSO_INFO.contact.email}</a></p>
                <p>Tél : {IUSO_INFO.contact.phones.join(' / ')}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Délégué à la Protection des Données</h3>
                <p>Email : <a href="mailto:dpo@iuso-sne.com" className="text-blue-600 hover:underline">dpo@iuso-sne.com</a></p>
                <p>Tél : +241 01 23 45 67</p>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 mt-6 text-center">
              {IUSO_INFO.fullName}<br />
              {IUSO_INFO.contact.address}
            </p>
          </div>
        </div>

        {/* Ressources utiles */}
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold font-gilroy text-slate-900 mb-4">Ressources utiles</h2>
          <div className="space-y-3 text-slate-700">
            <p className="mb-4">Pour en savoir plus sur les cookies et la protection de vos données :</p>
            <ul className="space-y-2">
              <li>
                • <a href="https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  CNIL - Maîtriser les cookies
                </a>
              </li>
              <li>
                • <a href="https://www.allaboutcookies.org/fr/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  All About Cookies (en français)
                </a>
              </li>
              <li>
                • <a href="/privacy" className="text-blue-600 hover:underline">
                  Notre Politique de confidentialité
                </a>
              </li>
              <li>
                • <a href="/legal" className="text-blue-600 hover:underline">
                  Mentions légales
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CookiesPage;