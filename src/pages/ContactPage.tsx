import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Send, MapPin, Phone, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { MapWithSearch } from "@/components/MapWithSearch";

const schema = z.object({
  name: z.string().min(2, "Le nom est trop court"),
  email: z.string().email("Adresse e-mail invalide"),
  message: z.string().min(10, "Le message est trop court"),
});

type ContactFormValues = z.infer<typeof schema>;

const ContactPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      console.log("Contact form submitted:", data);
      toast.success("Message envoyé avec succès !");
      reset();
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const infoReveal = useScrollReveal();
  const formReveal = useScrollReveal();
  const mapReveal = useScrollReveal();

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
            Besoin d'aide ?
          </div>
          <h1 className="text-5xl md:text-6xl font-bold font-gilroy leading-tight text-slate-900">
            Contactez notre équipe
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed">
            Nous sommes disponibles pour répondre à vos questions ou vous accompagner dans votre candidature.
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="container mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Info Card */}
          <div ref={infoReveal.ref} className={`${infoReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700`}>
            <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
              <CardHeader>
                <CardTitle className="text-2xl font-gilroy">Informations</CardTitle>
                <CardDescription>Nos coordonnées et horaires d'ouverture</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Adresse</p>
                    <p className="text-slate-600">123 Avenue de l'Organisation, Libreville, Gabon</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Téléphone</p>
                    <p className="text-slate-600">(+241) 01 11 22 33</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-slate-600">admissions@iuso-sne.edu.ga</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Horaires</p>
                    <p className="text-slate-600">Lun. – Ven. : 8h00 – 17h30</p>
                  </div>
                </div>
                <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-gilroy font-medium mt-4">
                  <a href="tel:+24101112233">Appeler maintenant</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Form Card */}
          <div ref={formReveal.ref} className={`${formReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700`}>
            <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
              <CardHeader>
                <CardTitle className="text-2xl font-gilroy">Envoyer un message</CardTitle>
                <CardDescription>Nous vous répondrons sous 48h ouvrées</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Nom</label>
                    <Input placeholder="Votre nom" {...register("name")} className={errors.name ? "border-red-500" : ""} />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <Input type="email" placeholder="vous@example.com" {...register("email")} className={errors.email ? "border-red-500" : ""} />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Message</label>
                    <Textarea rows={6} placeholder="Comment pouvons-nous vous aider ?" {...register("message")} className={errors.message ? "border-red-500" : ""} />
                    {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
                  </div>
                  {/* Submit */}
                  <Button type="submit" disabled={isSubmitting} className="w-full flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    Envoyer
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-32" ref={mapReveal.ref}>
        <div className={`${mapReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700`}>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white/90 backdrop-blur-sm">
            <div className="relative w-full h-[400px] md:h-[500px]">
              {/* Coordonnées précises du campus IUSO-SNE (quartier STFO, Libreville) */}
              <MapWithSearch center={[0.40747, 9.458]} markerLabel="Institut Universitaire des Sciences de l'Organisation (IUSO-SNE)" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage; 