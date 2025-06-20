import React from 'react'
import { useAutoSync } from '../hooks/useAutoSync'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { 
  Cloud, 
  CloudOff, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Save,
  Wifi,
  WifiOff,
  Download,
  Settings
} from 'lucide-react'

interface SyncStatusProps {
  compact?: boolean
  showControls?: boolean
  className?: string
}

export function SyncStatus({ compact = false, showControls = true, className = '' }: SyncStatusProps) {
  const {
    enabled,
    saving,
    syncing,
    lastSave,
    lastSync,
    error,
    connected,
    dataCount,
    hasUnsyncedData,
    degradedMode,
    saveNow,
    syncNow,
    enable,
    disable,
    forceRecovery,
    clearError
  } = useAutoSync()

  const formatTime = (date: Date | null) => {
    if (!date) return 'Jamais'
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'À l\'instant'
    if (diffMins < 60) return `Il y a ${diffMins}min`
    if (diffMins < 1440) return `Il y a ${Math.floor(diffMins / 60)}h`
    return date.toLocaleDateString()
  }

  const getStatusColor = () => {
    if (error || degradedMode) return 'destructive'
    if (!connected) return 'secondary'
    if (saving || syncing) return 'default'
    if (hasUnsyncedData) return 'secondary'
    return 'success'
  }

  const getStatusIcon = () => {
    if (saving) return <Save className="h-4 w-4 animate-spin" />
    if (syncing) return <RefreshCw className="h-4 w-4 animate-spin" />
    if (error || degradedMode) return <AlertCircle className="h-4 w-4" />
    if (!connected) return <WifiOff className="h-4 w-4" />
    if (hasUnsyncedData) return <Cloud className="h-4 w-4" />
    return <CheckCircle className="h-4 w-4" />
  }

  const getStatusText = () => {
    if (saving) return 'Sauvegarde...'
    if (syncing) return 'Synchronisation...'
    if (degradedMode) return 'Mode dégradé'
    if (error) return 'Erreur de sync'
    if (!connected) return 'Hors ligne'
    if (hasUnsyncedData) return 'Modifications en attente'
    return 'Synchronisé'
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge variant={getStatusColor()} className="flex items-center gap-1">
          {getStatusIcon()}
          {getStatusText()}
        </Badge>
        {!connected && <WifiOff className="h-4 w-4 text-muted-foreground" />}
        {connected && <Wifi className="h-4 w-4 text-green-500" />}
      </div>
    )
  }

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          {getStatusIcon()}
          Statut de synchronisation
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Statut principal */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">État:</span>
          <Badge variant={getStatusColor()}>{getStatusText()}</Badge>
        </div>

        {/* Connectivité */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Connexion:</span>
          <div className="flex items-center gap-1">
            {connected ? (
              <>
                <Wifi className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">En ligne</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 text-red-500" />
                <span className="text-xs text-red-600">Hors ligne</span>
              </>
            )}
          </div>
        </div>

        {/* Données */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Données:</span>
          <span className="text-xs">{dataCount} enregistrements</span>
        </div>

        {/* Dernières activités */}
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Dernière sauvegarde:</span>
            <span>{formatTime(lastSave)}</span>
          </div>
          <div className="flex justify-between">
            <span>Dernière synchronisation:</span>
            <span>{formatTime(lastSync)}</span>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">Erreur de synchronisation</p>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Mode dégradé */}
        {degradedMode && (
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">Mode dégradé actif</p>
                <p>Synchronisation automatique désactivée temporairement</p>
              </div>
            </div>
          </div>
        )}

        {/* Contrôles */}
        {showControls && (
          <div className="flex gap-2 pt-2 border-t">
            <Button
              size="sm"
              variant="outline"
              onClick={saveNow}
              disabled={saving || !hasUnsyncedData}
              className="flex-1"
            >
              <Save className="h-3 w-3 mr-1" />
              Sauvegarder
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={syncNow}
              disabled={syncing || !connected}
              className="flex-1"
            >
              <Download className="h-3 w-3 mr-1" />
              Synchroniser
            </Button>
          </div>
        )}

        {/* Contrôles avancés */}
        {showControls && (error || degradedMode) && (
          <div className="flex gap-2">
            {error && (
              <Button
                size="sm"
                variant="ghost"
                onClick={clearError}
                className="flex-1 text-xs"
              >
                Effacer l'erreur
              </Button>
            )}
            
            <Button
              size="sm"
              variant="ghost"
              onClick={forceRecovery}
              className="flex-1 text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Récupération forcée
            </Button>
          </div>
        )}

        {/* Toggle AutoSync */}
        {showControls && (
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-muted-foreground">AutoSync:</span>
            <Button
              size="sm"
              variant={enabled ? "default" : "outline"}
              onClick={enabled ? disable : enable}
              className="h-6 px-2 text-xs"
            >
              <Settings className="h-3 w-3 mr-1" />
              {enabled ? 'ON' : 'OFF'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Composant d'indicateur minimal pour la barre de navigation
export function SyncIndicator() {
  const { connected, saving, syncing, error, hasUnsyncedData } = useAutoSync()

  const getIndicatorColor = () => {
    if (error) return 'bg-red-500'
    if (!connected) return 'bg-yellow-500'
    if (saving || syncing) return 'bg-blue-500'
    if (hasUnsyncedData) return 'bg-orange-500'
    return 'bg-green-500'
  }

  const getIndicatorText = () => {
    if (saving) return 'Sauvegarde en cours...'
    if (syncing) return 'Synchronisation en cours...'
    if (error) return 'Erreur de synchronisation'
    if (!connected) return 'Hors ligne'
    if (hasUnsyncedData) return 'Modifications non sauvegardées'
    return 'Synchronisé'
  }

  return (
    <div className="flex items-center gap-2" title={getIndicatorText()}>
      <div className={`w-2 h-2 rounded-full ${getIndicatorColor()} ${
        (saving || syncing) ? 'animate-pulse' : ''
      }`} />
      <span className="text-xs text-muted-foreground hidden sm:block">
        {connected ? (
          saving || syncing ? 'Sync...' : 'OK'
        ) : (
          'Hors ligne'
        )}
      </span>
    </div>
  )
} 