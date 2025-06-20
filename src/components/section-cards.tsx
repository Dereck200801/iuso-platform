import { TrendingDownIcon, TrendingUpIcon, FileTextIcon, ClockIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCandidatData } from "@/hooks/useCandidatData"

export function SectionCards() {
  const { data: candidat, loading } = useCandidatData()

  const requiredFields = [
    "firstName",
    "lastName",
    "studyCycle",
    "studyField",
    "birthCertificate",
    "bacAttestation",
    "photo",
  ] as const

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filledCount = candidat
    ? requiredFields.filter((field) => Boolean((candidat as any)[field])).length
    : 0

  const completionPercentage = Math.round(
    (filledCount / requiredFields.length) * 100
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const docsCount = candidat
    ? ["birthCertificate", "bacAttestation", "photo"].filter((field) =>
        Boolean((candidat as any)[field]),
      ).length
    : 0

  const missingCount = requiredFields.length - filledCount

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="@container/card border-blue-200">
        <CardHeader className="relative">
          <CardDescription className="text-blue-600">Complétude du dossier</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-blue-700">
            {completionPercentage}%
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs border-blue-200 text-blue-600">
              {completionPercentage >= 80 ? (
                <TrendingUpIcon className="size-3" />
              ) : (
                <AlertCircleIcon className="size-3" />
              )}
              {completionPercentage >= 80 ? "Excellent" : "À compléter"}
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-blue-600">
            {completionPercentage >= 80 ? "Dossier presque complet" : "Dossier à finaliser"} 
            {completionPercentage >= 80 ? <CheckCircleIcon className="size-4" /> : <ClockIcon className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            {filledCount} sur {requiredFields.length} champs remplis
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card border-emerald-200">
        <CardHeader className="relative">
          <CardDescription className="text-emerald-600">Documents téléchargés</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-emerald-700">
            {docsCount}/3
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs border-emerald-200 text-emerald-600">
              <FileTextIcon className="size-3" />
              {docsCount === 3 ? "Complet" : "En cours"}
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-emerald-600">
            {docsCount === 3 ? "Tous les documents fournis" : `${3 - docsCount} document(s) manquant(s)`}
            {docsCount === 3 ? <CheckCircleIcon className="size-4" /> : <FileTextIcon className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            Acte naissance, Attestation BAC, Photo
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card border-slate-200">
        <CardHeader className="relative">
          <CardDescription className="text-slate-600">Statut candidature</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-xl font-semibold text-slate-700">
            {candidat?.status === "valide" ? "Validée" : candidat?.status === "refuse" ? "Refusée" : "En cours"}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className={`flex gap-1 rounded-lg text-xs ${
              candidat?.status === "valide" 
                ? "border-green-200 text-green-600" 
                : candidat?.status === "refuse" 
                ? "border-red-200 text-red-600" 
                : "border-orange-200 text-orange-600"
            }`}>
              {candidat?.status === "valide" ? (
                <CheckCircleIcon className="size-3" />
              ) : candidat?.status === "refuse" ? (
                <AlertCircleIcon className="size-3" />
              ) : (
                <ClockIcon className="size-3" />
              )}
              {candidat?.status === "valide" ? "Accepté" : candidat?.status === "refuse" ? "Rejeté" : "Attente"}
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-slate-600">
            {candidat?.status === "valide" 
              ? "Félicitations !" 
              : candidat?.status === "refuse" 
              ? "Candidature refusée" 
              : "En cours d'examen"}
          </div>
          <div className="text-muted-foreground">
            {candidat?.studyField && `Filière: ${candidat.studyField}`}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card border-purple-200">
        <CardHeader className="relative">
          <CardDescription className="text-purple-600">Étapes restantes</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-purple-700">
            {missingCount}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs border-purple-200 text-purple-600">
              {missingCount === 0 ? (
                <CheckCircleIcon className="size-3" />
              ) : (
                <ClockIcon className="size-3" />
              )}
              {missingCount === 0 ? "Terminé" : "À faire"}
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-purple-600">
            {missingCount === 0 ? "Dossier complet !" : `${missingCount} étape(s) à finaliser`}
            {missingCount === 0 ? <CheckCircleIcon className="size-4" /> : <ClockIcon className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            Informations et documents requis
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
