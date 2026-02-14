"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

const schema = yup.object({
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email().required("Email is required"),
  phone: yup.string().required("Phone is required"),
  password: yup.string().min(6).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match"),
});

type FormData = yup.InferType<typeof schema>;

const SignupPage = () => {

    const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData: FormData) => {
  setLoading(true);

  const { data: signUpData, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    alert(error.message);
    setLoading(false);
    return;
  }

  const userId = signUpData.user?.id;

  if (userId) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: formData.fullName,
        phone: formData.phone,
      })
      .eq("id", userId);

    if (profileError) {
      alert(profileError.message);
      setLoading(false);
      return;
    }
  }

  window.location.href = "/dashboard";
};



  return (
        <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-80"
      >
        <input
          placeholder="Full Name"
          {...register("fullName")}
          className="border p-2 w-full"
        />
        <p className="text-red-500 text-sm">{errors.fullName?.message}</p>

        <input
          placeholder="Email"
          {...register("email")}
          className="border p-2 w-full"
        />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>

        <input
          placeholder="Phone"
          {...register("phone")}
          className="border p-2 w-full"
        />
        <p className="text-red-500 text-sm">{errors.phone?.message}</p>

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="border p-2 w-full"
        />
        <p className="text-red-500 text-sm">{errors.password?.message}</p>

        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword")}
          className="border p-2 w-full"
        />
        <p className="text-red-500 text-sm">
          {errors.confirmPassword?.message}
        </p>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-2 w-full"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  )
}

export default SignupPage