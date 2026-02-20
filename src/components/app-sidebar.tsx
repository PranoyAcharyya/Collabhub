"use client";

import * as React from "react";
import {
  BookOpen,
  Settings2,
  Users,
  Activity,
  CreditCard,
  GalleryVerticalEnd,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

import { WorkspaceCreateForm } from "@/components/WorkspaceCreateForm";
import { useWorkspaceStore } from "@/store/workspaceStore"

interface AppSidebarProps
  extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

async function fetchWorkspaces() {
  const res = await fetch("/api/workspaces");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const [open, setOpen] = React.useState(false);
const { activeWorkspaceId, setActiveWorkspace } = useWorkspaceStore()

  const { data } = useQuery({
    queryKey: ["workspaces"],
    queryFn: fetchWorkspaces,
  });

const workspaceItems =
  data?.workspaces?.map((ws: any) => ({
    title: ws.name,
    onClick: () => setActiveWorkspace(ws.id),
    isActive: activeWorkspaceId === ws.id,
  })) || []

  React.useEffect(() => {
  if (!activeWorkspaceId && data?.workspaces?.length > 0) {
    setActiveWorkspace(data.workspaces[0].id)
  }
}, [data, activeWorkspaceId, setActiveWorkspace])



  const navMain = [
    {
      title: "Workspaces",
      url: "#",
      icon: GalleryVerticalEnd,
      isActive: true,
      items: workspaceItems,
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
  ];

  const projects = [
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
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <h2 className="px-2 text-sm font-semibold">CollabHub</h2> */}
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
        {/* Create Workspace Dialog */}
        <div className="px-3 mt-3">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button 
               onClick={() => setOpen(true)}
              className="w-full text-sm border rounded-md py-2 hover:bg-muted transition">
                + Create Workspace
              </button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Workspace</DialogTitle>
                <DialogDescription>
                  Give your workspace a name to get started.
                </DialogDescription>
              </DialogHeader>

              <WorkspaceCreateForm onSuccess={() => setOpen(false)}/>
            </DialogContent>
          </Dialog>
        </div>
        <NavProjects projects={projects} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
