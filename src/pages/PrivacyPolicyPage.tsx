import { IUSO_INFO } from "@/lib/constants";
import { ShieldCheck, Sparkles, Lock, Eye, Users, Database, Globe, Mail, Clock, AlertTriangle } from "lucide-react";

const PrivacyPolicyPage = () => {
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
            <ShieldCheck className="h-4 w-4" />
            Protection des données
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-gilroy text-slate-900">
            Politique de confidentialité
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            Votre confiance est primordiale. Découvrez comment nous collectons, utilisons et protégeons vos données personnelles
            conformément au RGPD et à la législation gabonaise.
          </p>
          <p className="text-sm text-slate-500 mt-4">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            <br />Version : 2.0
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-6 pb-24 space-y-8 max-w-4xl">
        {/* Préambule */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">1. Préambule et engagement</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              L'{IUSO_INFO.fullName} (ci-après "IUSO-SNE", "nous", "notre" ou "nos") s'engage à protéger la vie privée
              et les données personnelles de tous les utilisateurs de son site web et de ses services.
            </p>
            <p>
              Cette politique de confidentialité décrit en détail comment nous collectons, utilisons, stockons et protégeons
              vos données personnelles conformément :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Au Règlement Général sur la Protection des Données (RGPD) - Règlement (UE) 2016/679</li>
              <li>À la Loi gabonaise n° 001/2011 relative à la protection des données à caractère personnel</li>
              <li>Aux directives de la Commission Nationale Informatique et Libertés du Gabon</li>
            </ul>
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <p className="text-sm text-blue-800">
                <strong>Notre engagement :</strong> Nous nous engageons à ne jamais vendre, louer ou partager vos données personnelles
                à des tiers à des fins commerciales sans votre consentement explicite.
              </p>
            </div>
          </div>
        </div>

        {/* Responsable du traitement */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">2. Responsable du traitement et DPO</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <div>
              <h3 className="font-semibold mb-2">Responsable du traitement :</h3>
              <p>{IUSO_INFO.fullName}</p>
              <p>{IUSO_INFO.contact.address}</p>
              <p>Email : <a href={`mailto:${IUSO_INFO.contact.email}`} className="text-blue-600 hover:underline">{IUSO_INFO.contact.email}</a></p>
              <p>Téléphone : {IUSO_INFO.contact.phones.join(' / ')}</p>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Délégué à la Protection des Données (DPO) :</h3>
              <p>M. Jean-Claude MOUSSAVOU</p>
              <p>Email : <a href="mailto:dpo@iuso-sne.com" className="text-blue-600 hover:underline">dpo@iuso-sne.com</a></p>
              <p>Téléphone : +241 01 23 45 67</p>
              <p className="text-sm text-slate-600 mt-2">
                Pour toute question relative à la protection de vos données personnelles, vous pouvez contacter notre DPO.
              </p>
            </div>
          </div>
        </div>

        {/* Types de données collectées */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Database className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">3. Données personnelles collectées</h2>
          </div>
          <div className="space-y-6 text-slate-700">
            <div>
              <h3 className="font-semibold mb-3 text-lg">3.1 Données d'identification et de contact</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nom, prénom, nom de jeune fille</li>
                <li>Date et lieu de naissance</li>
                <li>Nationalité et pays de résidence</li>
                <li>Genre</li>
                <li>Adresse postale complète</li>
                <li>Adresse email personnelle et/ou professionnelle</li>
                <li>Numéros de téléphone (fixe et mobile)</li>
                <li>Photo d'identité (pour le dossier étudiant)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-lg">3.2 Données académiques et professionnelles</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Parcours scolaire et universitaire antérieur</li>
                <li>Diplômes obtenus et relevés de notes</li>
                <li>CV et lettres de motivation</li>
                <li>Expériences professionnelles</li>
                <li>Niveau de langue</li>
                <li>Résultats aux tests d'admission</li>
                <li>Numéro d'étudiant et numéro de dossier</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-lg">3.3 Données techniques et de navigation</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Adresse IP et géolocalisation approximative</li>
                <li>Type et version du navigateur</li>
                <li>Système d'exploitation</li>
                <li>Pages visitées et temps passé</li>
                <li>Données de cookies et identifiants de session</li>
                <li>Historique des interactions avec le site</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-lg">3.4 Données sensibles (avec consentement explicite)</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Données de santé (uniquement si nécessaire pour des aménagements spécifiques)</li>
                <li>Situation de handicap (pour l'accessibilité et les aménagements)</li>
                <li>Données financières (pour les bourses et aides)</li>
              </ul>
              <div className="bg-orange-50 p-4 rounded-lg mt-3">
                <p className="text-sm text-orange-800">
                  <AlertTriangle className="h-4 w-4 inline mr-2" />
                  Ces données sensibles ne sont collectées qu'avec votre consentement explicite et uniquement
                  lorsqu'elles sont strictement nécessaires.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Finalités du traitement */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">4. Finalités du traitement</h2>
          </div>
          <div className="space-y-6 text-slate-700">
            <p>Nous utilisons vos données personnelles pour les finalités suivantes :</p>
            
            <div>
              <h3 className="font-semibold mb-3">4.1 Gestion des candidatures et inscriptions</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Traitement des demandes d'admission</li>
                <li>Évaluation des dossiers de candidature</li>
                <li>Organisation des tests et entretiens d'admission</li>
                <li>Inscription administrative et pédagogique</li>
                <li>Création et gestion du dossier étudiant</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">4.2 Suivi pédagogique et vie étudiante</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Gestion de la scolarité et du parcours académique</li>
                <li>Suivi des présences et des résultats</li>
                <li>Organisation des examens et délivrance des diplômes</li>
                <li>Communication d'informations relatives à la vie étudiante</li>
                <li>Gestion des stages et de l'insertion professionnelle</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">4.3 Communication et marketing</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Envoi d'informations sur nos formations (avec consentement)</li>
                <li>Newsletter et actualités de l'établissement</li>
                <li>Invitations aux événements (JPO, conférences)</li>
                <li>Enquêtes de satisfaction et d'amélioration</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">4.4 Obligations légales et sécurité</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Respect des obligations légales et réglementaires</li>
                <li>Statistiques anonymisées pour les autorités</li>
                <li>Prévention de la fraude et sécurité du site</li>
                <li>Gestion des réclamations et contentieux</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Base légale */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">5. Base légale du traitement</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>Conformément au RGPD, nos traitements de données reposent sur les bases légales suivantes :</p>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Consentement (Art. 6.1.a RGPD)</h3>
                <p>Pour l'envoi de newsletters, communications marketing, utilisation de cookies non essentiels.</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Exécution d'un contrat (Art. 6.1.b RGPD)</h3>
                <p>Pour le traitement des inscriptions, la gestion de la scolarité, la délivrance des diplômes.</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Obligation légale (Art. 6.1.c RGPD)</h3>
                <p>Pour les déclarations obligatoires aux autorités, la conservation des documents académiques.</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Intérêt légitime (Art. 6.1.f RGPD)</h3>
                <p>Pour l'amélioration de nos services, la sécurité du site, les statistiques anonymisées.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Durée de conservation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">6. Durée de conservation des données</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              Nous conservons vos données personnelles uniquement pendant la durée nécessaire aux finalités pour
              lesquelles elles ont été collectées, puis conformément aux obligations légales :
            </p>
            
            <table className="w-full border-collapse mt-4">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Type de données</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Durée de conservation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Dossiers de candidature (non admis)</td>
                  <td className="border border-gray-300 px-4 py-2">2 ans</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Dossiers étudiants</td>
                  <td className="border border-gray-300 px-4 py-2">50 ans après la fin de scolarité</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Données de connexion</td>
                  <td className="border border-gray-300 px-4 py-2">1 an</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Cookies</td>
                  <td className="border border-gray-300 px-4 py-2">13 mois maximum</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Données marketing (avec consentement)</td>
                  <td className="border border-gray-300 px-4 py-2">3 ans après le dernier contact</td>
                </tr>
              </tbody>
            </table>
            
            <p className="text-sm text-slate-600 mt-4">
              À l'expiration de ces délais, vos données sont supprimées ou anonymisées de manière irréversible.
            </p>
          </div>
        </div>

        {/* Destinataires des données */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">7. Destinataires des données</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>Vos données peuvent être partagées avec les catégories de destinataires suivantes :</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">7.1 Destinataires internes</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Personnel administratif habilité</li>
                  <li>Équipes pédagogiques et enseignants</li>
                  <li>Service des relations internationales</li>
                  <li>Service informatique (support technique)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">7.2 Partenaires académiques</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Universités partenaires (pour les échanges)</li>
                  <li>Entreprises d'accueil de stages</li>
                  <li>Organismes certificateurs</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">7.3 Prestataires techniques</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Hébergeur web (Supabase)</li>
                  <li>Services d'emailing (SendGrid)</li>
                  <li>Outils d'analyse (Google Analytics - anonymisé)</li>
                  <li>Services de paiement en ligne</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">7.4 Autorités publiques</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Ministère de l'Enseignement Supérieur</li>
                  <li>Services de l'immigration (étudiants internationaux)</li>
                  <li>Autorités judiciaires (sur requête légale)</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <p className="text-sm text-blue-800">
                <strong>Garanties :</strong> Tous nos prestataires sont soumis à des obligations contractuelles strictes
                de confidentialité et de sécurité des données.
              </p>
            </div>
          </div>
        </div>

        {/* Transferts internationaux */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">8. Transferts internationaux de données</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              Certaines de vos données peuvent être transférées vers des pays situés hors de l'Union Européenne
              ou du Gabon, notamment :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Singapour (hébergement Supabase)</li>
              <li>États-Unis (services Google Analytics, SendGrid)</li>
            </ul>
            <p className="mt-4">
              Ces transferts sont encadrés par :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Des clauses contractuelles types approuvées par la Commission Européenne</li>
              <li>Le respect du Privacy Shield ou de mécanismes équivalents</li>
              <li>Des garanties appropriées conformément aux articles 46 et 47 du RGPD</li>
            </ul>
          </div>
        </div>

        {/* Sécurité des données */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">9. Sécurité des données</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour garantir
              un niveau de sécurité adapté au risque :
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Mesures techniques</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Chiffrement SSL/TLS pour toutes les transmissions</li>
                  <li>Chiffrement des données sensibles en base</li>
                  <li>Pare-feu et systèmes de détection d'intrusion</li>
                  <li>Sauvegardes régulières et cryptées</li>
                  <li>Tests de sécurité réguliers</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Mesures organisationnelles</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Politique de mots de passe robustes</li>
                  <li>Accès limité aux personnes habilitées</li>
                  <li>Formation du personnel à la protection des données</li>
                  <li>Procédures de gestion des incidents</li>
                  <li>Audits de sécurité périodiques</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg mt-4">
              <p className="text-sm text-orange-800">
                En cas de violation de données susceptible d'engendrer un risque pour vos droits et libertés,
                nous vous en informerons dans les 72 heures ainsi que l'autorité de contrôle compétente.
              </p>
            </div>
          </div>
        </div>

        {/* Vos droits */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">10. Vos droits sur vos données</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              Conformément au RGPD et à la législation gabonaise, vous disposez des droits suivants sur vos données personnelles :
            </p>
            
            <div className="space-y-4">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Droit d'accès (Art. 15 RGPD)</h3>
                <p className="text-sm">Obtenir la confirmation que vos données sont traitées et en recevoir une copie.</p>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Droit de rectification (Art. 16 RGPD)</h3>
                <p className="text-sm">Corriger vos données inexactes ou les compléter si elles sont incomplètes.</p>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Droit à l'effacement "droit à l'oubli" (Art. 17 RGPD)</h3>
                <p className="text-sm">Demander la suppression de vos données dans certains cas.</p>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Droit à la limitation (Art. 18 RGPD)</h3>
                <p className="text-sm">Limiter le traitement de vos données dans certaines circonstances.</p>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Droit à la portabilité (Art. 20 RGPD)</h3>
                <p className="text-sm">Recevoir vos données dans un format structuré et les transférer à un autre responsable.</p>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Droit d'opposition (Art. 21 RGPD)</h3>
                <p className="text-sm">Vous opposer au traitement de vos données pour des raisons tenant à votre situation particulière.</p>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Droit de retirer votre consentement</h3>
                <p className="text-sm">Retirer à tout moment votre consentement pour les traitements basés sur celui-ci.</p>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Droit de définir des directives post-mortem</h3>
                <p className="text-sm">Définir des directives relatives à la conservation, l'effacement et la communication de vos données après votre décès.</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mt-6">
              <h3 className="font-semibold mb-2">Comment exercer vos droits ?</h3>
              <p className="text-sm mb-2">Pour exercer ces droits, contactez notre DPO :</p>
              <ul className="text-sm space-y-1">
                <li>• Par email : <a href="mailto:dpo@iuso-sne.com" className="text-blue-600 hover:underline">dpo@iuso-sne.com</a></li>
                <li>• Par courrier : DPO - IUSO-SNE, {IUSO_INFO.contact.address}</li>
                <li>• Via le formulaire en ligne : <a href="/contact" className="text-blue-600 hover:underline">Formulaire de contact</a></li>
              </ul>
              <p className="text-sm mt-2">
                Nous nous engageons à répondre à votre demande dans un délai d'un mois maximum.
              </p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Droit de réclamation</h3>
              <p className="text-sm">
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de :
              </p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• La Commission Nationale Informatique et Libertés du Gabon</li>
                <li>• Email : contact@cnil.ga</li>
                <li>• Adresse : BP 1234, Libreville, Gabon</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cookies */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Database className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">11. Cookies et technologies similaires</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              Notre site utilise des cookies et technologies similaires pour améliorer votre expérience utilisateur.
              Pour plus d'informations détaillées, veuillez consulter notre{' '}
              <a href="/cookies" className="text-blue-600 hover:underline">Politique relative aux cookies</a>.
            </p>
            <p>Types de cookies utilisés :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cookies strictement nécessaires (authentification, sécurité)</li>
              <li>Cookies de performance (analyse de l'utilisation du site)</li>
              <li>Cookies de fonctionnalité (préférences utilisateur)</li>
            </ul>
          </div>
        </div>

        {/* Mineurs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">12. Protection des mineurs</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              Notre site s'adresse principalement à des personnes majeures. Pour les mineurs de moins de 18 ans :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Le consentement des parents ou tuteurs légaux est requis pour toute inscription</li>
              <li>Les parents peuvent exercer les droits de leurs enfants mineurs</li>
              <li>Nous ne collectons pas sciemment de données d'enfants de moins de 16 ans sans consentement parental</li>
            </ul>
          </div>
        </div>

        {/* Modifications */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">13. Modifications de la politique</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              Nous pouvons être amenés à modifier cette politique de confidentialité pour refléter :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Les changements dans nos pratiques de traitement des données</li>
              <li>Les évolutions légales et réglementaires</li>
              <li>Les nouvelles fonctionnalités de notre site</li>
            </ul>
            <p className="mt-4">
              En cas de modification substantielle, nous vous en informerons par email et/ou via une notification
              sur notre site au moins 30 jours avant leur entrée en vigueur.
            </p>
            <p>
              Nous vous encourageons à consulter régulièrement cette page pour prendre connaissance des éventuelles
              modifications.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-8 border border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">14. Nous contacter</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              Pour toute question concernant cette politique de confidentialité ou vos données personnelles,
              n'hésitez pas à nous contacter :
            </p>
            <div className="grid md:grid-cols-2 gap-6">
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
            <p className="text-sm text-slate-600 mt-4 text-center">
              {IUSO_INFO.fullName}<br />
              {IUSO_INFO.contact.address}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPolicyPage;