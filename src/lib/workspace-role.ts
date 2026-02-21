import { createClient } from "@/lib/supabase/server";

export async function getUserWorkspaceRole(
  workspaceId: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", user.email)
    .single();

  if (!profile) return null;

  const { data: member } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", profile.id)
    .single();

  return member?.role ?? null;
}