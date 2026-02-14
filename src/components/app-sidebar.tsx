"use client"

import * as React from "react"
import {
  BookOpen,
  GalleryVerticalEnd,
  Settings2,
  Users,
  Activity,
  CreditCard,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Pranoy Acharyya",
    email: "pranoy@example.com",
    avatar: "/avatars/user.jpg",
  },

  teams: [
    {
      name: "CollabHub Workspace",
      logo: GalleryVerticalEnd,
      plan: "Pro",
    },
  ],

  navMain: [
    {
      title: "Documents",
      url: "/dashboard",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "All Documents",
          url: "/dashboard",
        },
        {
          title: "Shared With Me",
          url: "/dashboard/shared",
        },
        {
          title: "Recent",
          url: "/dashboard/recent",
        },
        {
          title: "Trash",
          url: "/dashboard/trash",
        },
      ],
    },
    {
      title: "Team",
      url: "/dashboard/team",
      icon: Users,
      items: [
        {
          title: "Members",
          url: "/dashboard/team",
        },
        {
          title: "Invitations",
          url: "/dashboard/team/invitations",
        },
      ],
    },
    {
      title: "Activity",
      url: "/dashboard/activity",
      icon: Activity,
    },
  ],

  projects: [
    {
      name: "Billing",
      url: "/dashboard/billing",
      icon: CreditCard,
    },
    {
      name: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
    },
  ],
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
