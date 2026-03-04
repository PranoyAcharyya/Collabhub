import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const formData = await req.formData();
  const file = formData.get("file") as File;

  const filePath = `${user?.id}-${Date.now()}`;

  await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath);

  await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", user?.id);

  return NextResponse.json({ success: true });
}