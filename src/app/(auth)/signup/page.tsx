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
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

type FormData = yup.InferType<typeof schema>;

const SignupPage = () => {
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
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData: FormData) => {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
        },
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // If email confirmation enabled → user will need to confirm first
    if (!data.session) {
      alert("Check your email to confirm your account.");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <div className="flex flex-row-reverse min-h-screen w-full">
      <div className="w-[50%] hidden md:block login-right"></div>

      <div className="w-[100%] md:w-[50%] p-5 flex justify-center items-center col relative">
        <div className="absolute top-[20px] left-[20px]">
          <AnimatedThemeToggler />
        </div>

        <Card className="relative w-full max-w-[400px] overflow-hidden p-6 flex col items-center justify-center">
          <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />

          <img
            src="/images/logo.png"
            className="self-center w-12 mb-1 sitelogo"
            alt="CollabHub Logo"
          />

          <HyperText>Sign Up</HyperText>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-80">
            <div>
              <input
                placeholder="Full Name"
                {...register("fullName")}
                className="border p-2 w-full"
              />
              <p className="text-red-500 text-sm">
                {errors.fullName?.message}
              </p>
            </div>

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
                placeholder="Phone"
                {...register("phone")}
                className="border p-2 w-full"
              />
              <p className="text-red-500 text-sm">
                {errors.phone?.message}
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

            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                className="border p-2 w-full"
              />
              <p className="text-red-500 text-sm">
                {errors.confirmPassword?.message}
              </p>
            </div>

            <Button type="submit" disabled={loading} className="p-2 w-full">
              {loading ? "Signing up..." : "Sign Up"}
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

          <Button onClick={() => router.push("/login")}>
            Already registered? Login here
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;