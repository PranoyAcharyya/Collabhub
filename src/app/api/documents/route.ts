import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getUserWorkspaceRole } from "@/lib/workspace-role";

async function getSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

// ================= GET DOCUMENTS =================
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId");

  if (!workspaceId) {
    return NextResponse.json(
      { error: "workspaceId required" },
      { status: 400 }
    );
  }

  const supabase = await getSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = await getUserWorkspaceRole(workspaceId);

  if (!["admin", "member", "viewer"].includes(role || "")) {
    return NextResponse.json(
      { error: "Not allowed to view documents" },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ documents: data });
}

// ================= CREATE DOCUMENT =================
export async function POST(request: Request) {
  const supabase = await getSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { workspaceId, title } = await request.json();

  if (!workspaceId || !title) {
    return NextResponse.json(
      { error: "workspaceId and title required" },
      { status: 400 }
    );
  }

  // 🔐 Only ADMIN can create document
  const role = await getUserWorkspaceRole(workspaceId);

  if (role !== "admin") {
    return NextResponse.json(
      { error: "Only admin can create document" },
      { status: 403 }
    );
  }

  // ================= PLAN CHECK =================

  // 1️⃣ Get workspace owner
  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .select("owner_id")
    .eq("id", workspaceId)
    .single();

  if (workspaceError || !workspace) {
    return NextResponse.json(
      { error: "Workspace not found" },
      { status: 404 }
    );
  }

  // 2️⃣ Get owner's subscription plan
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", workspace.owner_id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json(
      { error: "Owner profile not found" },
      { status: 404 }
    );
  }

  // 3️⃣ Count existing documents in workspace
  const { count, error: countError } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true })
    .eq("workspace_id", workspaceId);

  if (countError) {
    return NextResponse.json(
      { error: "Failed to count documents" },
      { status: 500 }
    );
  }

  // 4️⃣ Enforce FREE plan limit (5 docs per workspace)
  if (profile.plan === "free" && count !== null && count >= 5) {
    return NextResponse.json(
      { error: "Free plan limit reached (5 documents per workspace)" },
      { status: 403 }
    );
  }

  // ================= CREATE DOCUMENT =================
  const { data, error } = await supabase
    .from("documents")
    .insert({
      workspace_id: workspaceId,
      title,
      created_by: user.id,
      content:null, // JSONB default empty
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ document: data });
}