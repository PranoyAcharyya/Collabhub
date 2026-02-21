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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId");

  if (!workspaceId) {
    return NextResponse.json(
      { error: "workspaceId required" },
      { status: 400 }
    );
  }

  // ✅ MUST await
  const supabase = await getSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Allow admin, member, viewer to READ
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

export async function POST(request: Request) {
  // ✅ MUST await
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

  // Only ADMIN can create document
  const role = await getUserWorkspaceRole(workspaceId);

  if (role !== "admin") {
    return NextResponse.json(
      { error: "Only admin can create document" },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from("documents")
    .insert({
      workspace_id: workspaceId,
      title,
      created_by: user.id,
      content: {},
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ document: data });
}