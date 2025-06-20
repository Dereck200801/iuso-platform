import { IUSO_INFO } from "@/lib/constants";
import { Sparkles, Scale, FileText, Shield, Users, Globe, AlertCircle } from "lucide-react";

const LegalPage = () => {
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
            <Scale className="h-4 w-4" />
            Informations légales
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-gilroy text-slate-900">
            Mentions légales
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            Conformément aux articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique,
            dite L.C.E.N., nous portons à la connaissance des utilisateurs et visiteurs du site les informations suivantes.
          </p>
          <p className="text-sm text-slate-500 mt-4">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-6 pb-24 space-y-12 max-w-4xl">
        {/* Identification de l'éditeur */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">1. Identification de l'éditeur du site</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p><strong>Raison sociale :</strong> {IUSO_INFO.fullName}</p>
            <p><strong>Forme juridique :</strong> Établissement d'enseignement supérieur privé</p>
            <p><strong>Siège social :</strong> {IUSO_INFO.contact.address}</p>
            <p><strong>Numéro d'identification :</strong> RCCM/GA-LBV/2019-B-2345</p>
            <p><strong>Capital social :</strong> 50 000 000 FCFA</p>
            <p><strong>Email :</strong> <a href={`mailto:${IUSO_INFO.contact.email}`} className="text-blue-600 hover:underline">{IUSO_INFO.contact.email}</a></p>
            <p><strong>Téléphone :</strong> {IUSO_INFO.contact.phones.map((phone, index) => (
              <span key={index}>
                {phone}{index < IUSO_INFO.contact.phones.length - 1 ? ' / ' : ''}
              </span>
            ))}</p>
            <p><strong>N° TVA intracommunautaire :</strong> GA123456789</p>
          </div>
        </div>

        {/* Direction de la publication */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">2. Direction de la publication</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p><strong>Directrice de la publication :</strong> Mme Sophie NTOUTOUME EMANE</p>
            <p><strong>Fonction :</strong> Directrice Générale de l'IUSO-SNE</p>
            <p><strong>Email de contact :</strong> <a href="mailto:direction@iuso-sne.com" className="text-blue-600 hover:underline">direction@iuso-sne.com</a></p>
            <p className="text-sm text-slate-600 mt-4">
              La directrice de la publication est responsable du contenu éditorial du site. Pour toute question relative au contenu publié,
              veuillez vous adresser directement à la direction de la publication.
            </p>
          </div>
        </div>

        {/* Hébergement */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">3. Hébergement du site</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p><strong>Hébergeur :</strong> Supabase Inc.</p>
            <p><strong>Adresse :</strong> 970 Toa Payoh North #07-04, Singapore 318992</p>
            <p><strong>Site web :</strong> <a href="https://supabase.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://supabase.com</a></p>
            <p><strong>Email :</strong> support@supabase.com</p>
            <p className="text-sm text-slate-600 mt-4">
              Les données sont hébergées sur des serveurs sécurisés répartis dans plusieurs centres de données certifiés ISO 27001,
              garantissant une haute disponibilité et une sécurité optimale.
            </p>
          </div>
        </div>

        {/* Propriété intellectuelle */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">4. Propriété intellectuelle et contrefaçons</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              L'IUSO-SNE est propriétaire des droits de propriété intellectuelle ou détient les droits d'usage sur tous les éléments
              accessibles sur le site, notamment :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>La structure générale du site</li>
              <li>Les textes, images, graphiques, logo, icônes, sons, vidéos et logiciels</li>
              <li>Les bases de données produites et hébergées</li>
              <li>La charte graphique et l'ergonomie du site</li>
              <li>Les marques, logos et signes distinctifs</li>
            </ul>
            <p className="mt-4">
              Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site,
              quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de l'IUSO-SNE.
            </p>
            <p>
              Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient sera considérée comme
              constitutive d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du
              Code de Propriété Intellectuelle.
            </p>
          </div>
        </div>

        {/* Limitations de responsabilité */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="h-6 w-6 text-orange-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">5. Limitations de responsabilité</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              L'IUSO-SNE ne pourra être tenue responsable des dommages directs et indirects causés au matériel de l'utilisateur,
              lors de l'accès au site, et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications
              indiquées, soit de l'apparition d'un bug ou d'une incompatibilité.
            </p>
            <p>
              L'IUSO-SNE ne pourra également être tenue responsable des dommages indirects (tels par exemple qu'une perte de marché
              ou perte d'une chance) consécutifs à l'utilisation du site.
            </p>
            <p>
              Des espaces interactifs (possibilité de poser des questions dans l'espace contact) sont à la disposition des utilisateurs.
              L'IUSO-SNE se réserve le droit de supprimer, sans mise en demeure préalable, tout contenu déposé dans cet espace qui
              contreviendrait à la législation applicable au Gabon, en particulier aux dispositions relatives à la protection des
              données.
            </p>
          </div>
        </div>

        {/* Droit applicable */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Scale className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">6. Droit applicable et attribution de juridiction</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              Tout litige en relation avec l'utilisation du site est soumis au droit gabonais.
              Il est fait attribution exclusive de juridiction aux tribunaux compétents de Libreville.
            </p>
            <p>
              Les présentes conditions du site sont régies par les lois gabonaises et toute contestation ou litiges qui
              pourraient naître de l'interprétation ou de l'exécution de celles-ci seront de la compétence exclusive des
              tribunaux dont dépend le siège social de la société. La langue de référence, pour le règlement de contentieux
              éventuels, est le français.
            </p>
          </div>
        </div>

        {/* Données personnelles */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">7. Protection des données personnelles</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              De manière générale, vous n'êtes pas tenu de nous communiquer vos données personnelles lorsque vous visitez
              notre site Internet.
            </p>
            <p>
              Cependant, ce principe comporte certaines exceptions. En effet, pour certains services proposés par notre site,
              vous pouvez être amenés à nous communiquer certaines données telles que : votre nom, votre prénom, votre adresse
              électronique, et votre numéro de téléphone.
            </p>
            <p>
              Tel est le cas lorsque vous remplissez le formulaire qui vous est proposé en ligne, dans la rubrique « inscription ».
              Dans tous les cas, vous pouvez refuser de fournir vos données personnelles. Dans ce cas, vous ne pourrez pas
              utiliser les services du site, notamment celui de solliciter des renseignements sur nos formations.
            </p>
            <p>
              Enfin, nous pouvons collecter de manière automatique certaines informations vous concernant lors d'une simple
              navigation sur notre site Internet, notamment : des informations concernant l'utilisation de notre site, comme
              les zones que vous visitez et les services auxquels vous accédez, votre adresse IP, le type de votre navigateur,
              vos temps d'accès.
            </p>
            <p className="mt-6">
              <strong>Pour en savoir plus sur notre politique de confidentialité :</strong>{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">Consultez notre Politique de confidentialité</a>
            </p>
          </div>
        </div>

        {/* Litiges */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Scale className="h-6 w-6 text-orange-600" />
            <h2 className="text-2xl font-bold font-gilroy text-slate-900">8. Litiges</h2>
          </div>
          <div className="space-y-4 text-slate-700">
            <p>
              Les présentes conditions du site sont régies par les lois gabonaises et toute contestation ou litiges qui
              pourraient naître de l'interprétation ou de l'exécution de celles-ci seront de la compétence exclusive des
              tribunaux dont dépend le siège social de la société. La langue de référence, pour le règlement de contentieux
              éventuels, est le français.
            </p>
          </div>
        </div>

        {/* Principales lois concernées */}
        <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
          <h2 className="text-2xl font-bold font-gilroy text-slate-900 mb-4">9. Principales lois concernées</h2>
          <ul className="space-y-2 text-slate-700">
            <li>• Loi n° 001/2011 relative à la protection des données à caractère personnel</li>
            <li>• Loi n° 26/2016 réglementant le secteur des communications électroniques en République Gabonaise</li>
            <li>• Code civil gabonais</li>
            <li>• Code pénal gabonais</li>
            <li>• Règlement Général sur la Protection des Données (RGPD) pour les ressortissants européens</li>
          </ul>
        </div>

        {/* Lexique */}
        <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-200">
          <h2 className="text-2xl font-bold font-gilroy text-slate-900 mb-4">10. Lexique</h2>
          <div className="space-y-3 text-slate-700">
            <p><strong>Utilisateur :</strong> Internaute se connectant, utilisant le site susnommé.</p>
            <p><strong>Données personnelles :</strong> « Les informations qui permettent, sous quelque forme que ce soit, directement ou non, l'identification des personnes physiques auxquelles elles s'appliquent » (article 4 de la loi n° 001/2011).</p>
            <p><strong>Cookie :</strong> Petit fichier stocké par un serveur dans le terminal (ordinateur, téléphone, etc.) d'un utilisateur et associé à un domaine web.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LegalPage;