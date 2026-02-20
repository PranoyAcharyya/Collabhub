"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HyperText } from "@/components/ui/hyper-text";
import { Card } from "@/components/ui/card";
import { ShineBorder } from "@/components/ui/shine-border";
import { useRouter } from "next/navigation";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { signInWithGoogle } from "@/app/(auth)/actions";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});

type LoginForm = yup.InferType<typeof schema>;

export default function LoginPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const url = await signInWithGoogle();
      if (url) {
        window.location.href = url;
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="w-[50%] hidden md:block login-left"></div>

      <div className="w-[100%] md:w-[50%] p-5 flex justify-center items-center col relative">
        <div className="absolute top-[20px] right-[20px]">
          <AnimatedThemeToggler />
        </div>

        <Card className="relative w-full max-w-[350px] overflow-hidden p-5 flex col items-center justify-center">
          <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />

          <img
            src="/images/logo.png"
            className="self-center w-12 mb-1 sitelogo"
            alt="CollabHub Logo"
          />

          <HyperText>Login</HyperText>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-80">
            <div>
              <input
                placeholder="Email"
                {...register("email")}
                className="border p-2 w-full"
              />
              <p className="text-red-500 text-sm">
                {errors.email?.message}
              </p>
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
                className="border p-2 w-full"
              />
              <p className="text-red-500 text-sm">
                {errors.password?.message}
              </p>
            </div>

            <Button type="submit" disabled={loading} className="p-2 w-full">
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
            >
              Continue with Google
            </Button>
          </form>

          <Button onClick={() => router.push("/signup")}>
            Not registered yet? Signup here
          </Button>
        </Card>
      </div>
    </div>
  );
}