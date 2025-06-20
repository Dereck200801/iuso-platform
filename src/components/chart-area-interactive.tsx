"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCandidatData } from "@/hooks/useCandidatData"

const chartConfig: ChartConfig = {
  progression: {
    label: "Progression",
    color: "hsl(var(--chart-1))",
  },
  documents: {
    label: "Documents",
    color: "hsl(var(--chart-2))",
  },
}

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("all")
  const { data: candidat } = useCandidatData()

  // Simulation de données de progression dans le temps
  const generateProgressionData = () => {
    const baseData = [
      { date: "2024-01-01", progression: 0, documents: 0 },
      { date: "2024-01-15", progression: 20, documents: 0 },
      { date: "2024-02-01", progression: 35, documents: 1 },
      { date: "2024-02-15", progression: 50, documents: 1 },
      { date: "2024-03-01", progression: 65, documents: 2 },
      { date: "2024-03-15", progression: 80, documents: 3 },
      { date: "2024-04-01", progression: 90, documents: 3 },
      { date: "2024-04-15", progression: 100, documents: 3 },
    ]

    if (candidat) {
      const requiredFields = ["firstName", "lastName", "studyCycle", "studyField", "birthCertificate", "bacAttestation", "photo"]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filledCount = requiredFields.filter((field) => Boolean((candidat as any)[field])).length
      const completionPercentage = Math.round((filledCount / requiredFields.length) * 100)
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const docsCount = ["birthCertificate", "bacAttestation", "photo"].filter((field) => Boolean((candidat as any)[field])).length

      // Mettre à jour le dernier point avec les vraies données
      baseData[baseData.length - 1] = {
        ...baseData[baseData.length - 1],
        progression: completionPercentage,
        documents: (docsCount / 3) * 100
      }
    }

    return baseData
  }

  const chartData = generateProgressionData()

  const filteredData = React.useMemo(() => {
    if (timeRange === "30d") {
      return chartData.slice(-4)
    } else if (timeRange === "7d") {
      return chartData.slice(-2)
    }
    return chartData
  }, [timeRange, chartData])

  return (
    <Card className="@container/card border-blue-200">
      <CardHeader className="relative">
        <CardTitle className="text-blue-700">Progression de votre candidature</CardTitle>
        <CardDescription className="text-blue-600">
          <span className="@[540px]/card:block hidden">
            Évolution de votre dossier dans le temps
          </span>
          <span className="@[540px]/card:hidden">Évolution du dossier</span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="@[767px]/card:flex w-40 border-blue-200"
              aria-label="Sélectionner une période"
            >
              <SelectValue placeholder="Toute la période" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="rounded-lg">
                Toute la période
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 derniers jours
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 derniers jours
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillProgression" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-progression)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-progression)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillDocuments" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-documents)"
                  stopOpacity={0.6}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-documents)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("fr-FR", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("fr-FR", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="documents"
              type="natural"
              fill="url(#fillDocuments)"
              stroke="var(--color-documents)"
              strokeWidth={2}
            />
            <Area
              dataKey="progression"
              type="natural"
              fill="url(#fillProgression)"
              stroke="var(--color-progression)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
