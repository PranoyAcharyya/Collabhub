import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { createClient } from "@/lib/supabase/server";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user?.id)
    .single();

  return (
    <SidebarProvider>
      <AppSidebar 
      
      user={{
          name: profile?.full_name ?? "User",
          email: profile?.email ?? user?.email ?? "",
          avatar:
            user?.user_metadata?.avatar_url ??
            "/avatars/default.jpg",
        }}
      
      />
      <main className="w-full">
        <SidebarTrigger />
        <div className="px-5">
        {children}
        </div>
        
      </main>
    </SidebarProvider>
  )
}