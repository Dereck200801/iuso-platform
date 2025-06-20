import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Sparkles, Search } from "lucide-react";

const faqs = [
  {
    question: "Comment puis-je soumettre ma candidature ?",
    answer: "Cliquez sur le bouton 'Commencer ma candidature' disponible sur la page d'accueil ou rendez-vous directement sur /inscription. Suivez ensuite les étapes indiquées pour créer votre compte et compléter votre dossier en ligne."
  },
  {
    question: "Quels sont les frais d'inscription ?",
    answer: "Les frais varient selon la formation et le niveau d'études. Un récapitulatif détaillé est fourni durant le processus d'inscription avant tout paiement."
  },
  {
    question: "Puis-je modifier mon dossier après l'avoir soumis ?",
    answer: "Oui, vous pouvez mettre à jour votre dossier jusqu'à la date limite indiquée dans votre tableau de bord candidat. Après cette date, les modifications ne seront plus possibles."
  },
  {
    question: "Quand recevrai-je la réponse à ma candidature ?",
    answer: "Les résultats sont généralement communiqués 2 à 4 semaines après la clôture des candidatures. Vous serez notifié par e-mail et via votre tableau de bord."
  }
];

const FAQPage = () => {
  const [query, setQuery] = useState("");

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(query.toLowerCase()) ||
    faq.answer.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 overflow-hidden">
      {/* Hero */}
      <section className="relative pt-24 pb-32">
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center space-y-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 text-blue-800 px-6 py-3 rounded-full text-sm font-semibold font-gilroy shadow-lg hover:shadow-xl transition-all duration-300">
            <Sparkles className="h-4 w-4 animate-spin" />
            Nos réponses
          </div>
          <h1 className="text-5xl md:text-6xl font-bold font-gilroy leading-tight text-slate-900">
            Foire aux questions
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed">
            Trouvez rapidement les informations dont vous avez besoin ou écrivez-nous.
          </p>
        </div>
      </section>

      {/* Search + Accordion */}
      <section className="container mx-auto px-6 pb-24 max-w-3xl">
        {/* Search */}
        <div className="relative mb-10">
          <Input
            placeholder="Rechercher une question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {filteredFaqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow">
              <AccordionTrigger className="px-6 py-4 text-lg font-medium text-slate-800">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-slate-600 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
          {filteredFaqs.length === 0 && (
            <p className="text-center text-slate-500 mt-6">Aucun résultat pour "{query}"</p>
          )}
        </Accordion>
      </section>
    </div>
  );
};

export default FAQPage; 