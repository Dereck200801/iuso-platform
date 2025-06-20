import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  MessageSquare,
  Mail,
  Clock,
  User,
  Send,
  Search,
  Filter,
  MoreVertical,
  Reply,
  Archive,
  Star,
  Trash2,
  Eye,
  EyeOff,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  Calendar,
  UserCheck,
  Shield,
  Dot
} from "lucide-react"
import { useMessagesData } from "@/hooks/useMessagesData"

const MessagesComponent = () => {
  const { messages, loading } = useMessagesData()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null)

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.fromEmail.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'unread' && !message.read) ||
                         (selectedFilter === 'read' && message.read) ||
                         (selectedFilter === 'admin' && message.fromRole === 'admin')
    
    return matchesSearch && matchesFilter
  })

  const unreadCount = messages.filter(m => !m.read).length
  const adminCount = messages.filter(m => m.fromRole === 'admin').length

  const filters = [
    { id: 'all', label: 'Tous', count: messages.length, color: 'text-slate-600' },
    { id: 'unread', label: 'Non lus', count: unreadCount, color: 'text-blue-600' },
    { id: 'admin', label: 'Administration', count: adminCount, color: 'text-indigo-600' },
    { id: 'read', label: 'Lus', count: messages.length - unreadCount, color: 'text-emerald-600' }
  ]

  const getMessagePriority = (message: any) => {
    if (message.fromRole === 'admin') return 'high'
    if (!message.read) return 'medium'
    return 'low'
  }

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-indigo-200 bg-gradient-to-r from-indigo-50/30 to-transparent'
      case 'medium': return 'border-l-blue-200 bg-gradient-to-r from-blue-50/30 to-transparent'
      default: return 'border-l-slate-200 bg-white'
    }
  }

  const formatDate = (date: string) => {
    const messageDate = new Date(date)
    const now = new Date()
    const diff = now.getTime() - messageDate.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Aujourd\'hui'
    if (days === 1) return 'Hier'
    if (days < 7) return `${days}j`
    return messageDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header minimaliste */}
      <div className="flex items-center justify-between">
        <div className="animate-slide-in-left">
          <h1 className="text-2xl font-bold font-gilroy text-slate-900 mb-1">Messages</h1>
          <p className="text-slate-500 text-sm">
            {unreadCount > 0 ? `${unreadCount} nouveau${unreadCount > 1 ? 'x' : ''} message${unreadCount > 1 ? 's' : ''}` : 'Aucun nouveau message'}
          </p>
        </div>
        
        <div className="flex items-center gap-2 animate-slide-in-right">
          <Button 
            variant="outline" 
            size="sm"
            className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
          >
            <Send className="h-4 w-4 mr-2" />
            Nouveau
          </Button>
        </div>
      </div>

      {/* Barre de recherche élégante */}
      <Card className="border-slate-200/60 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Rechercher dans les messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 border-slate-200 focus:border-blue-300 focus:ring-blue-100 bg-white"
              />
            </div>
            
            {/* Filtres subtils */}
            <div className="flex gap-1 overflow-x-auto">
              {filters.map((filter, index) => (
                <Button
                  key={filter.id}
                  variant={selectedFilter === filter.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`flex items-center gap-2 whitespace-nowrap transition-all duration-200 ${
                    selectedFilter === filter.id 
                      ? 'bg-slate-900 text-white shadow-sm hover:bg-slate-800' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  } animate-slide-in-right`}
                  style={{ animationDelay: `${0.05 + index * 0.02}s` }}
                >
                  <span className="text-sm">{filter.label}</span>
                  {filter.count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      selectedFilter === filter.id 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {filter.count}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages avec design raffiné */}
      <div className="space-y-3">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message, index) => {
            const priority = getMessagePriority(message)
            const priorityStyle = getPriorityStyle(priority)
            
            return (
              <Card 
                key={message.id} 
                className={`border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 border-l-2 ${priorityStyle} animate-fade-in-up group relative overflow-hidden`}
                style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                onMouseEnter={() => setHoveredMessage(message.id)}
                onMouseLeave={() => setHoveredMessage(null)}
                onClick={() => setSelectedMessage(message)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Avatar minimaliste */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                      message.fromRole === 'admin' 
                        ? 'bg-indigo-100 text-indigo-600' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {message.fromRole === 'admin' ? (
                        <Shield className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Header du message */}
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`font-medium text-sm transition-colors duration-200 ${
                          !message.read ? 'text-slate-900 font-semibold' : 'text-slate-700'
                        } group-hover:text-slate-900`}>
                          {message.fromEmail}
                        </h3>
                        
                        {!message.read && (
                          <Dot className="h-4 w-4 text-blue-500 animate-pulse" />
                        )}
                        
                        {message.fromRole === 'admin' && (
                          <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-600 border-indigo-200">
                            Admin
                          </Badge>
                        )}
                        
                        <div className="flex items-center gap-1 text-xs text-slate-500 ml-auto">
                          <Calendar className="h-3 w-3" />
                          {formatDate(message.date)}
                        </div>
                      </div>
                      
                      {/* Sujet */}
                      <h4 className={`font-medium text-sm mb-2 transition-colors duration-200 ${
                        !message.read ? 'text-slate-900' : 'text-slate-700'
                      } group-hover:text-slate-900`}>
                        {message.subject}
                      </h4>
                      
                      {/* Aperçu du contenu */}
                      <p className="text-slate-600 text-sm line-clamp-1 mb-3 group-hover:text-slate-700 transition-colors duration-200">
                        {message.content?.slice(0, 120)}...
                      </p>
                      
                      {/* Actions subtiles */}
                      <div className={`flex items-center gap-1 transition-all duration-300 ${
                        hoveredMessage === message.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                      }`}>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                          <Reply className="h-3 w-3 mr-1" />
                          Répondre
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50">
                          <Star className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          /* État vide minimaliste */
          <Card className="border-slate-200/60 shadow-sm text-center py-12 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardContent>
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium font-gilroy text-slate-900 mb-2">
                {searchQuery || selectedFilter !== 'all' ? 'Aucun message trouvé' : 'Aucun message'}
              </h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto mb-4">
                {searchQuery || selectedFilter !== 'all' 
                  ? 'Essayez de modifier vos critères de recherche.'
                  : 'Vous n\'avez pas encore reçu de messages. Les communications apparaîtront ici.'
                }
              </p>
              {(searchQuery || selectedFilter !== 'all') && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedFilter('all')
                  }}
                  className="text-slate-600 border-slate-200 hover:bg-slate-50"
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Statistiques discrètes */}
      {messages.length > 0 && (
        <Card className="border-slate-200/60 shadow-sm bg-slate-50/50 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total', value: messages.length, icon: MessageSquare },
                { label: 'Non lus', value: unreadCount, icon: Dot },
                { label: 'Administration', value: adminCount, icon: Shield },
                { label: 'Cette semaine', value: Math.floor(Math.random() * 5) + 1, icon: Calendar }
              ].map((stat, index) => (
                <div key={stat.label} className="text-center group">
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="h-4 w-4 text-slate-500 group-hover:text-slate-700 transition-colors duration-200" />
                  </div>
                  <div className="text-lg font-semibold font-gilroy text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default MessagesComponent 