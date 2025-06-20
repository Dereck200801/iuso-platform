import * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UserIcon,
  BookOpenIcon,
  PhoneIcon,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { useCandidatData } from "@/hooks/useCandidatData"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { supabase } from "@/lib/supabase"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: candidat } = useCandidatData()

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Mon Profil",
      url: "/profile",
      icon: UserIcon,
    },
    {
      title: "Mes Documents",
      url: "/documents",
      icon: FolderIcon,
    },
    {
      title: "Formations",
      url: "/formations",
      icon: BookOpenIcon,
    },
  ]

  const navSecondary = [
    {
      title: "Paramètres",
      url: "/settings",
      icon: SettingsIcon,
    },
    {
      title: "Aide",
      url: "/faq",
      icon: HelpCircleIcon,
    },
    {
      title: "Contact",
      url: "/contact",
      icon: PhoneIcon,
    },
  ]

  const documents = [
    {
      name: "Acte de naissance",
      url: "/documents/birth-certificate",
      icon: FileTextIcon,
    },
    {
      name: "Attestation BAC",
      url: "/documents/bac-attestation",
      icon: FileTextIcon,
    },
    {
      name: "Photo d'identité",
      url: "/documents/photo",
      icon: FileTextIcon,
    },
  ]

  // Générer l'URL publique de la photo d'identité depuis Supabase Storage si disponible
  const avatarUrl = React.useMemo(() => {
    if (candidat?.photo) {
      try {
        const { data } = supabase.storage
          .from('pieces-candidats')
          .getPublicUrl(candidat.photo)

        return data.publicUrl || '/avatars/candidat.jpg'
      } catch {
        return '/avatars/candidat.jpg'
      }
    }
    return '/avatars/candidat.jpg'
  }, [candidat?.photo])

  const userData = {
    name: candidat ? `${candidat.firstName} ${candidat.lastName}` : 'Candidat',
    email: candidat?.email || 'candidat@iuso.edu',
    avatar: avatarUrl,
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <ArrowUpCircleIcon className="h-5 w-5 text-blue-600" />
                <span className="text-base font-semibold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  IUSO Platform
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavDocuments items={documents} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
