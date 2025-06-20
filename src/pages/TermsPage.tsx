import { IUSO_INFO } from "@/lib/constants";
import { ScrollText, Sparkles, Shield, AlertTriangle, Ban, FileCheck, Scale, Users, Clock, Globe } from "lucide-react";

const TermsPage = () => {
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
            <ScrollText className="h-4 w-4" />
            Conditions générales
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-gilroy text-slate-900">
            Conditions d'utilisation
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            En accédant et utilisant ce site, vous acceptez d'être lié par les présentes conditions générales d'utilisation.
            Veuillez les lire attentivement.
          </p>
          <p className="text-sm text-slate-500 mt-4">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            <br />Version : 2.0
          </p>
        </div>
      </section>

      {/* Notice importante */}
      <section className="container mx-auto px-6 mb-8 max-w-4xl">
        <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-orange-900 mb-2">Avis important</h3>
              <p className="text-orange-800 text-sm">
                L'utilisation de ce site implique l'acceptation pleine et entière des conditions générales d'utilisation ci-après décrites.
                Ces conditions d'utilisation sont susceptibles d'être modifiées ou complétées à tout moment, les utilisateurs du site
                sont donc invités à les consulter de manière régulière.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-6 pb-24 space-y-8 max-w-4xl">
        {/* Objet et acceptation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <FileCheck className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">1. Objet et acceptation des conditions</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              Les présentes Conditions Générales d'Utilisation (ci-après "CGU") ont pour objet de définir les modalités
              et conditions dans lesquelles l'{IUSO_INFO.fullName} (ci-après "IUSO-SNE") met à disposition son site web
              accessible à l'adresse www.iuso-sne.com (ci-après le "Site"), ainsi que les conditions dans lesquelles
              les utilisateurs (ci-après les "Utilisateurs") accèdent et utilisent ce Site.
            </p>
            <p>
              L'accès et l'utilisation du Site sont soumis aux présentes CGU. En accédant au Site, tout Utilisateur
              reconnaît avoir pris connaissance des présentes CGU et s'engage à les respecter sans réserve.
            </p>
            <p>
              L'IUSO-SNE se réserve le droit de modifier ou de mettre à jour ces CGU à tout moment sans préavis.
              Les modifications entrent en vigueur dès leur publication sur le Site.
            </p>
          </div>
        </div>

        {/* Définitions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <ScrollText className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">2. Définitions</h2>
          </div>
          <div className="space-y-3 text-slate-700">
            <p className="mb-4">Pour les besoins des présentes CGU, les termes suivants sont définis comme suit :</p>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><strong>"Site" :</strong> Le site internet accessible à l'adresse www.iuso-sne.com et l'ensemble de ses pages.</p>
              <p><strong>"Utilisateur" :</strong> Toute personne physique ou morale qui accède au Site, qu'elle soit simple visiteur ou utilisateur inscrit.</p>
              <p><strong>"Compte" :</strong> Espace personnel créé par un Utilisateur après inscription, lui permettant d'accéder à des services spécifiques.</p>
              <p><strong>"Contenu" :</strong> Ensemble des informations, textes, images, vidéos, données présentes sur le Site.</p>
              <p><strong>"Services" :</strong> Ensemble des fonctionnalités et services proposés sur le Site (inscription, consultation des formations, etc.).</p>
            </div>
          </div>
        </div>

        {/* Accès au site */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">3. Conditions d'accès au site</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <h3 className="font-semibold mb-2">3.1 Accès technique</h3>
            <p>
              Le Site est accessible gratuitement à tout Utilisateur disposant d'un accès à Internet. Tous les frais
              afférents à l'accès au Site, que ce soient les frais matériels, logiciels ou d'accès à Internet sont
              exclusivement à la charge de l'Utilisateur. Il est seul responsable du bon fonctionnement de son équipement
              informatique ainsi que de son accès à Internet.
            </p>
            
            <h3 className="font-semibold mb-2 mt-4">3.2 Disponibilité du site</h3>
            <p>
              L'IUSO-SNE s'efforce de permettre l'accès au Site 24 heures sur 24, 7 jours sur 7, sauf en cas de force
              majeure ou d'un événement hors du contrôle de l'IUSO-SNE, et sous réserve des éventuelles pannes et
              interventions de maintenance nécessaires au bon fonctionnement du Site.
            </p>
            
            <h3 className="font-semibold mb-2 mt-4">3.3 Suspension et interruption</h3>
            <p>
              L'IUSO-SNE se réserve le droit de suspendre, d'interrompre ou de limiter sans avis préalable l'accès à
              tout ou partie du Site, notamment pour des opérations de maintenance, des mises à jour ou toute autre raison
              technique ou de sécurité.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <p className="text-sm text-blue-800">
                <strong>Note :</strong> L'IUSO-SNE ne saurait être tenue responsable des difficultés ou impossibilités
                momentanées d'accès au Site qui auraient pour origine des circonstances extérieures, la force majeure,
                ou encore des perturbations des réseaux de télécommunication.
              </p>
            </div>
          </div>
        </div>

        {/* Inscription et compte utilisateur */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">4. Inscription et compte utilisateur</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <h3 className="font-semibold mb-2">4.1 Création de compte</h3>
            <p>
              L'accès à certains services du Site nécessite la création d'un compte utilisateur. Lors de l'inscription,
              l'Utilisateur s'engage à :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fournir des informations exactes, complètes et à jour</li>
              <li>Maintenir à jour ces informations</li>
              <li>Ne pas usurper l'identité d'un tiers</li>
              <li>Ne pas créer plusieurs comptes pour une même personne</li>
              <li>Être majeur ou avoir l'autorisation de ses représentants légaux</li>
            </ul>
            
            <h3 className="font-semibold mb-2 mt-4">4.2 Identifiants de connexion</h3>
            <p>
              L'Utilisateur est seul responsable de la confidentialité de ses identifiants de connexion (email et mot de passe).
              Il s'engage à :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ne pas divulguer ses identifiants à des tiers</li>
              <li>Informer immédiatement l'IUSO-SNE en cas d'utilisation non autorisée de son compte</li>
              <li>Se déconnecter de son compte à l'issue de chaque session</li>
              <li>Assumer la responsabilité de toute activité effectuée sous son compte</li>
            </ul>
            
            <h3 className="font-semibold mb-2 mt-4">4.3 Suspension et résiliation de compte</h3>
            <p>
              L'IUSO-SNE se réserve le droit de suspendre ou de résilier tout compte en cas de :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violation des présentes CGU</li>
              <li>Comportement frauduleux ou illégal</li>
              <li>Fourniture d'informations fausses ou trompeuses</li>
              <li>Non-utilisation prolongée du compte (plus de 2 ans)</li>
            </ul>
          </div>
        </div>

        {/* Utilisation du site */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">5. Règles d'utilisation du site</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <h3 className="font-semibold mb-2">5.1 Utilisation conforme</h3>
            <p>
              L'Utilisateur s'engage à utiliser le Site conformément à sa destination, aux présentes CGU, aux lois et
              règlements en vigueur, et à ne pas porter atteinte à l'ordre public, aux bonnes mœurs ou aux droits de tiers.
            </p>
            
            <h3 className="font-semibold mb-2 mt-4">5.2 Comportements interdits</h3>
            <p>Il est strictement interdit de :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Utiliser le Site à des fins illégales ou non autorisées</li>
              <li>Tenter d'accéder aux données d'autres utilisateurs</li>
              <li>Introduire des virus, codes malveillants ou tout élément nuisible</li>
              <li>Effectuer du "scraping" ou extraire des données de manière automatisée</li>
              <li>Surcharger, endommager ou entraver le fonctionnement du Site</li>
              <li>Contourner les mesures de sécurité du Site</li>
              <li>Harceler, menacer ou porter atteinte aux autres utilisateurs</li>
              <li>Publier du contenu diffamatoire, injurieux, raciste ou discriminatoire</li>
              <li>Utiliser le Site à des fins commerciales sans autorisation</li>
            </ul>
            
            <h3 className="font-semibold mb-2 mt-4">5.3 Contenu utilisateur</h3>
            <p>
              Si le Site permet aux Utilisateurs de publier du contenu (commentaires, documents, etc.), l'Utilisateur :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Reste propriétaire de son contenu mais accorde à l'IUSO-SNE une licence d'utilisation</li>
              <li>Garantit détenir tous les droits nécessaires sur le contenu publié</li>
              <li>S'engage à ce que son contenu ne viole aucun droit de tiers</li>
              <li>Accepte que l'IUSO-SNE puisse modérer ou supprimer tout contenu inapproprié</li>
            </ul>
          </div>
        </div>

        {/* Propriété intellectuelle */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <FileCheck className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">6. Propriété intellectuelle</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <h3 className="font-semibold mb-2">6.1 Droits de l'IUSO-SNE</h3>
            <p>
              L'ensemble des éléments constituant le Site (structure, textes, images, logos, vidéos, bases de données,
              logiciels, etc.) est protégé par le droit de la propriété intellectuelle et appartient à l'IUSO-SNE ou
              fait l'objet d'une autorisation d'utilisation.
            </p>
            
            <h3 className="font-semibold mb-2 mt-4">6.2 Restrictions d'utilisation</h3>
            <p>
              Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle
              du Site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit est interdite
              sans autorisation écrite préalable de l'IUSO-SNE.
            </p>
            
            <h3 className="font-semibold mb-2 mt-4">6.3 Utilisation autorisée</h3>
            <p>
              L'Utilisateur est autorisé à :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Consulter le Site pour son usage personnel et non commercial</li>
              <li>Imprimer des pages du Site pour son usage personnel</li>
              <li>Partager des liens vers le Site dans le respect des présentes CGU</li>
            </ul>
            
            <div className="bg-orange-50 p-4 rounded-lg mt-4">
              <p className="text-sm text-orange-800">
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                Toute utilisation non expressément autorisée constitue une contrefaçon susceptible d'entraîner
                des poursuites civiles et pénales.
              </p>
            </div>
          </div>
        </div>

        {/* Protection des données */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">7. Protection des données personnelles</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              L'IUSO-SNE s'engage à protéger les données personnelles de ses Utilisateurs conformément à la réglementation
              en vigueur, notamment le Règlement Général sur la Protection des Données (RGPD) et la loi gabonaise
              n° 001/2011 relative à la protection des données à caractère personnel.
            </p>
            <p>
              Pour plus d'informations sur la collecte, le traitement et la protection de vos données personnelles,
              veuillez consulter notre <a href="/privacy" className="text-blue-600 hover:underline">Politique de confidentialité</a>.
            </p>
            <p>
              En utilisant le Site, l'Utilisateur consent au traitement de ses données personnelles dans les conditions
              décrites dans la Politique de confidentialité.
            </p>
          </div>
        </div>

        {/* Responsabilité */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">8. Limitation de responsabilité</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <h3 className="font-semibold mb-2">8.1 Contenu du site</h3>
            <p>
              Les informations contenues sur le Site sont fournies à titre indicatif. L'IUSO-SNE s'efforce d'assurer
              l'exactitude et la mise à jour des informations diffusées, mais ne peut garantir que ces informations
              sont exemptes d'erreurs, complètes ou à jour.
            </p>
            
            <h3 className="font-semibold mb-2 mt-4">8.2 Utilisation du site</h3>
            <p>L'IUSO-SNE ne pourra être tenue responsable :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Des dommages directs ou indirects résultant de l'utilisation ou de l'impossibilité d'utiliser le Site</li>
              <li>Des interruptions, dysfonctionnements, ou indisponibilités du Site</li>
              <li>Des virus ou éléments nuisibles qui pourraient infecter l'équipement informatique de l'Utilisateur</li>
              <li>Des pertes de données ou de l'altération des données de l'Utilisateur</li>
              <li>Du contenu des sites externes accessibles via des liens hypertextes</li>
              <li>Des décisions prises sur la base des informations contenues sur le Site</li>
            </ul>
            
            <h3 className="font-semibold mb-2 mt-4">8.3 Force majeure</h3>
            <p>
              L'IUSO-SNE ne saurait être tenue responsable de tout retard ou inexécution de ses obligations résultant
              d'un cas de force majeure, notamment en cas de catastrophe naturelle, guerre, grève, défaillance technique
              ou toute autre circonstance échappant à son contrôle raisonnable.
            </p>
          </div>
        </div>

        {/* Liens hypertextes */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">9. Liens hypertextes</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <h3 className="font-semibold mb-2">9.1 Liens sortants</h3>
            <p>
              Le Site peut contenir des liens hypertextes vers d'autres sites internet. L'IUSO-SNE n'exerce aucun
              contrôle sur ces sites externes et décline toute responsabilité quant à leur contenu, leurs pratiques
              de confidentialité ou leur disponibilité.
            </p>
            
            <h3 className="font-semibold mb-2 mt-4">9.2 Liens entrants</h3>
            <p>
              La mise en place de liens hypertextes vers le Site est autorisée sous réserve :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>De ne pas utiliser la technique du lien profond ("deep linking")</li>
              <li>De ne pas intégrer les pages du Site à l'intérieur d'autres sites ("framing")</li>
              <li>De mentionner clairement la source et d'établir un lien vers la page d'accueil</li>
              <li>De ne pas laisser entendre une association ou approbation de l'IUSO-SNE</li>
            </ul>
            <p className="mt-4">
              L'IUSO-SNE se réserve le droit de demander la suppression de tout lien vers son Site.
            </p>
          </div>
        </div>

        {/* Indemnisation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">10. Indemnisation</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              L'Utilisateur s'engage à indemniser, défendre et dégager de toute responsabilité l'IUSO-SNE, ses dirigeants,
              employés et partenaires contre toute réclamation, perte, dommage, coût ou dépense (y compris les frais
              juridiques raisonnables) résultant de :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Son utilisation du Site en violation des présentes CGU</li>
              <li>Sa violation de toute loi ou réglementation applicable</li>
              <li>Sa violation des droits de tiers</li>
              <li>Tout contenu qu'il publie ou transmet via le Site</li>
              <li>Toute utilisation frauduleuse ou illégale du Site</li>
            </ul>
          </div>
        </div>

        {/* Modification des CGU */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">11. Modification des CGU</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              L'IUSO-SNE se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entrent
              en vigueur dès leur publication sur le Site.
            </p>
            <p>
              En cas de modification substantielle, l'IUSO-SNE s'efforcera d'informer les Utilisateurs disposant
              d'un compte par email ou via une notification sur le Site.
            </p>
            <p>
              L'utilisation continue du Site après la publication des modifications vaut acceptation des nouvelles CGU.
              Si l'Utilisateur n'accepte pas les modifications, il doit cesser d'utiliser le Site.
            </p>
            <p>
              La date de dernière mise à jour des CGU est indiquée en haut de ce document.
            </p>
          </div>
        </div>

        {/* Divers */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <FileCheck className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">12. Dispositions diverses</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <h3 className="font-semibold mb-2">12.1 Intégralité de l'accord</h3>
            <p>
              Les présentes CGU constituent l'intégralité de l'accord entre l'Utilisateur et l'IUSO-SNE concernant
              l'utilisation du Site et remplacent tous accords antérieurs.
            </p>
            
            <h3 className="font-semibold mb-2 mt-4">12.2 Divisibilité</h3>
            <p>
              Si une disposition des présentes CGU est jugée illégale, nulle ou inapplicable, elle sera réputée
              supprimée sans affecter la validité et l'applicabilité des autres dispositions.
            </p>
            
            <h3 className="font-semibold mb-2 mt-4">12.3 Non-renonciation</h3>
            <p>
              Le fait pour l'IUSO-SNE de ne pas exercer un droit ou de ne pas appliquer une disposition des CGU
              ne constitue pas une renonciation à ce droit ou à cette disposition.
            </p>
            
            <h3 className="font-semibold mb-2 mt-4">12.4 Cession</h3>
            <p>
              L'Utilisateur ne peut céder ou transférer ses droits ou obligations au titre des présentes CGU.
              L'IUSO-SNE peut librement céder ou transférer ses droits et obligations à tout tiers.
            </p>
          </div>
        </div>

        {/* Droit applicable et juridiction */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Scale className="h-6 w-6 text-orange-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">13. Droit applicable et juridiction</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <h3 className="font-semibold mb-2">13.1 Droit applicable</h3>
            <p>
              Les présentes CGU sont régies par le droit gabonais, sans préjudice des dispositions impératives
              de protection des consommateurs applicables dans le pays de résidence de l'Utilisateur.
            </p>
            
            <h3 className="font-semibold mb-2 mt-4">13.2 Résolution amiable</h3>
            <p>
              En cas de litige, l'Utilisateur est invité à contacter l'IUSO-SNE pour rechercher une solution amiable :
            </p>
            <ul className="list-none space-y-2 mt-2">
              <li>Email : <a href={`mailto:${IUSO_INFO.contact.email}`} className="text-blue-600 hover:underline">{IUSO_INFO.contact.email}</a></li>
              <li>Courrier : Service Juridique - {IUSO_INFO.contact.address}</li>
            </ul>
            
            <h3 className="font-semibold mb-2 mt-4">13.3 Juridiction compétente</h3>
            <p>
              À défaut de résolution amiable dans un délai de 60 jours, tout litige relatif à l'interprétation,
              la validité ou l'exécution des présentes CGU sera soumis aux tribunaux compétents de Libreville, Gabon.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <p className="text-sm text-blue-800">
                <strong>Note pour les consommateurs européens :</strong> Vous pouvez également recourir à la plateforme
                de règlement en ligne des litiges (RLL) accessible à l'adresse : https://ec.europa.eu/consumers/odr/
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-8 border border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">14. Contact</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              Pour toute question concernant les présentes CGU ou l'utilisation du Site, vous pouvez contacter l'IUSO-SNE :
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div>
                <h3 className="font-semibold mb-2">Service Client</h3>
                <p>Email : <a href={`mailto:${IUSO_INFO.contact.email}`} className="text-blue-600 hover:underline">{IUSO_INFO.contact.email}</a></p>
                <p>Tél : {IUSO_INFO.contact.phones.join(' / ')}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Service Juridique</h3>
                <p>Email : <a href="mailto:juridique@iuso-sne.com" className="text-blue-600 hover:underline">juridique@iuso-sne.com</a></p>
                <p>Courrier : {IUSO_INFO.contact.address}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-6 text-center">
              {IUSO_INFO.fullName}<br />
              Établissement d'enseignement supérieur privé<br />
              {IUSO_INFO.contact.address}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TermsPage;