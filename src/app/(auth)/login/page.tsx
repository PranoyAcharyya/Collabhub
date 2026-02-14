"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
});

type LoginForm = yup.InferType<typeof schema>;

export default function LoginPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-80">
        <div>
          <input
            placeholder="Email"
            {...register("email")}
            className="border p-2 w-full"
          />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="border p-2 w-full"
          />
          <p className="text-red-500 text-sm">{errors.password?.message}</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-2 w-full"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
