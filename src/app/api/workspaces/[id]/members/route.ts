import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ================= POST =================
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: workspaceId } = await context.params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Logged in user ID:", user?.id);
  console.log("Workspace ID:", workspaceId);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, role } = await request.json();
  const cleanEmail = email?.trim().toLowerCase();

  console.log("Email trying to add:", cleanEmail);

  if (!cleanEmail) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  // ✅ Check admin
  const { data: currentMember } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!currentMember || currentMember.role !== "admin") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  // ✅ Find user in profiles (case-insensitive)
  const { data: targetUser, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .ilike("email", cleanEmail)
    .maybeSingle();

  if (profileError) {
    console.log("Profile lookup error:", profileError);
  }

  if (!targetUser) {
    return NextResponse.json(
      { error: "User has not signed up yet." },
      { status: 400 }
    );
  }

  // ✅ Prevent duplicate insert
  const { data: existingMember } = await supabase
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", targetUser.id)
    .maybeSingle();

  if (existingMember) {
    return NextResponse.json(
      { error: "User already a member." },
      { status: 400 }
    );
  }

  // ✅ Insert member
  const { error } = await supabase
    .from("workspace_members")
    .insert({
      workspace_id: workspaceId,
      user_id: targetUser.id,
      role: role || "member",
    });

  if (error) {
    console.log("Insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}


// ================= GET =================
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: workspaceId } = await context.params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("workspace_members")
    .select(`
      id,
      role,
      profiles (
        id,
        email
      )
    `)
    .eq("workspace_id", workspaceId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ members: data });
}


// ================= DELETE =================
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: workspaceId } = await context.params;
  const supabase = await createClient();

  const { memberId } = await request.json();

  const { error } = await supabase
    .from("workspace_members")
    .delete()
    .eq("id", memberId)
    .eq("workspace_id", workspaceId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}