import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, GraduationCap, TrendingUp, Briefcase, Building, ArrowRight, Award, Lightbulb, Globe, Users, HeartHandshake } from "lucide-react";
import { IUSO_INFO } from "@/lib/constants";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const stats = [
  { number: IUSO_INFO.stats.graduates, label: "Diplômés", icon: <GraduationCap className="h-6 w-6" /> },
  { number: IUSO_INFO.stats.insertionRate, label: "Insertion", icon: <TrendingUp className="h-6 w-6" /> },
  { number: IUSO_INFO.stats.internships, label: "Stages/an", icon: <Briefcase className="h-6 w-6" /> },
  { number: IUSO_INFO.stats.partners, label: "Partenaires", icon: <Building className="h-6 w-6" /> }
];

const values = [
  {
    title: "Exigence académique",
    description: "Nos programmes sont régulièrement évalués et mis à jour pour rester en phase avec les standards internationaux et les attentes du marché.",
    icon: <Award className="h-8 w-8" />, color: "from-indigo-500 to-indigo-700"
  },
  {
    title: "Professionnalisation",
    description: "Stages obligatoires, projets en entreprise et conférences métiers garantissent une insertion rapide et réussie de nos étudiants.",
    icon: <Briefcase className="h-8 w-8" />, color: "from-emerald-500 to-emerald-700"
  },
  {
    title: "Innovation & Recherche",
    description: "Nos laboratoires encouragent la recherche appliquée et l'innovation pédagogique pour répondre aux défis organisationnels de demain.",
    icon: <Lightbulb className="h-8 w-8" />, color: "from-yellow-500 to-orange-600"
  },
  {
    title: "Responsabilité sociale",
    description: "Nous sensibilisons nos étudiants aux enjeux sociétaux et environnementaux à travers des projets d'impact et du bénévolat.",
    icon: <HeartHandshake className="h-8 w-8" />, color: "from-pink-500 to-rose-600"
  },
  {
    title: "Ouverture internationale",
    description: "Des partenariats avec des universités étrangères et des programmes d'échange favorisent la mobilité et la multiculturalité.",
    icon: <Globe className="h-8 w-8" />, color: "from-blue-500 to-cyan-600"
  },
  {
    title: "Esprit d'équipe",
    description: "Travaux de groupe, hackathons et vie associative renforcent la collaboration et le leadership partagé.",
    icon: <Users className="h-8 w-8" />, color: "from-purple-500 to-fuchsia-600"
  }
];

const AboutPage = () => {
  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32">
        {/* background blobs */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center space-y-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 text-blue-800 px-6 py-3 rounded-full text-sm font-semibold font-gilroy shadow-lg hover:shadow-xl transition-all duration-300">
            <Sparkles className="h-4 w-4 animate-spin" />
            Notre histoire
          </div>
          <h1 className="text-5xl md:text-6xl font-bold font-gilroy leading-tight">
            Excellence académique & audace professionnelle
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed">
            Depuis 2015, l'IUSO-SNE forme les leaders de demain grâce à des programmes innovants, un corps professoral d'exception et un réseau d'entreprises partenaires.
          </p>
          <Button asChild size="lg" className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-4 text-lg font-semibold font-gilroy rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <Link to="/inscription" className="flex items-center gap-2">
              Rejoindre l'aventure
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="group text-center p-6 rounded-2xl bg-white/70 backdrop-blur-md shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
              <div className="flex items-center justify-center mb-4 text-blue-600 group-hover:text-blue-700 transition-all duration-300 transform group-hover:scale-125">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold font-gilroy text-slate-900 mb-2 group-hover:text-blue-600 transition-all duration-300">
                {stat.number}
              </div>
              <div className="text-sm text-slate-600 font-medium font-gilroy">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section (existing grid) */}
      <section className="container mx-auto px-6 pb-24">
        <h2 className="text-4xl font-bold font-gilroy text-slate-900 text-center mb-12">Nos valeurs clés</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((item, idx) => (
            <Card key={idx} className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
              <CardContent className="p-8 space-y-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold font-gilroy text-slate-900">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 