import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.redirect("http://localhost:3000");
    }

    const response = NextResponse.redirect(
      "http://localhost:3000/dashboard"
    );

    // ✅ FIX: await cookies()
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Exchange error:", error);
      return NextResponse.redirect("http://localhost:3000/login");
    }

    return response;
  } catch (err) {
    console.error("Callback crash:", err);
    return NextResponse.json(
      { error: "Callback failed" },
      { status: 500 }
    );
  }
}