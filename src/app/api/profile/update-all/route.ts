import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const cookieStore = await cookies();

  // 🔹 Normal client (for auth + profile update)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return  cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  // 🔹 Admin client (for storage upload)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const full_name = formData.get("full_name") as string;
  const password = formData.get("password") as string;
  const file = formData.get("file") as File | null;

  // 1️⃣ Update name
  if (full_name) {
    await supabase
      .from("profiles")
      .update({ full_name })
      .eq("id", user.id);
  }

  // 2️⃣ Update password
  if (password) {
    await supabase.auth.updateUser({ password });
  }

  // 3️⃣ Upload avatar (ADMIN CLIENT)
  if (file) {
    const filePath = `${user.id}-${Date.now()}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from("avatars")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("avatars").getPublicUrl(filePath);

    await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);
  }

  return NextResponse.json({ success: true });
}