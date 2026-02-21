import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string; memberId: string }> }
) {
  const supabase = await createClient();

  // ✅ unwrap params
  const { id: workspaceId, memberId } = await context.params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get profile from email
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", user.email)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Check current user's role
  const { data: currentMember } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", profile.id)
    .single();

  if (!currentMember || !["admin", "owner"].includes(currentMember.role)) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  // Prevent removing owner
  const { data: targetMember } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("id", memberId)
    .single();

  if (targetMember?.role === "owner") {
    return NextResponse.json(
      { error: "Cannot remove owner" },
      { status: 403 }
    );
  }

  const { error } = await supabase
    .from("workspace_members")
    .delete()
    .eq("id", memberId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}




export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string; memberId: string }> }
) {
  const supabase = await createClient();
  const { id: workspaceId, memberId } = await context.params;

  const body = await req.json();
  const { role } = body;

  if (!["admin", "member", "viewer"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", user.email)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Check current user role
  const { data: currentMember } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", profile.id)
    .single();

  if (!currentMember || !["admin", "owner"].includes(currentMember.role)) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  // Prevent modifying owner
  const { data: targetMember } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("id", memberId)
    .single();

  if (targetMember?.role === "owner") {
    return NextResponse.json(
      { error: "Cannot modify owner" },
      { status: 403 }
    );
  }

  const { error } = await supabase
    .from("workspace_members")
    .update({ role })
    .eq("id", memberId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}