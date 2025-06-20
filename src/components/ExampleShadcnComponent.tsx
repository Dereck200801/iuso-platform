import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ExampleShadcnComponent() {
  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Exemple shadcn/ui</CardTitle>
          <CardDescription>
            Démonstration des composants shadcn/ui intégrés avec le thème Yale blue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre.email@exemple.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
            />
          </div>
          <div className="flex gap-2">
            <Button className="flex-1">
              Se connecter
            </Button>
            <Button variant="outline" className="flex-1">
              Annuler
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 