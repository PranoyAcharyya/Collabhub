"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

async function fetchProfile() {
  const res = await fetch("/api/profile", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export default function AccountPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const profile = data?.profile;

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setPreview(profile.avatar_url || null);
    }
  }, [profile]);

 const handleUpdateName = async () => {
  setLoading(true);

  const formData = new FormData();
  formData.append("full_name", name);

  await fetch("/api/profile/update-all", {
    method: "POST",
    body: formData,
  });

  await refetch();
  setLoading(false);
};

  const handlePasswordUpdate = async () => {
    if (!password) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("password", password);

    await fetch("/api/profile/update-all", {
      method: "POST",
      body: formData,
    });

    setPassword("");
    setLoading(false);
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", imageFile);

    await fetch("/api/profile/update-all", {
      method: "POST",
      body: formData,
    });

    await refetch();
    setImageFile(null);
    setLoading(false);
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  if (isLoading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10 max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">My Account</h1>

      {/* Avatar */}
      <div className="space-y-2">
        <img
          src={preview || "/avatar-placeholder.png"}
          className="w-24 h-24 rounded-full object-cover"
        />
        <input type="file" onChange={handleImageChange} />
        <Button onClick={handleImageUpload} disabled={loading}>
          Update Image
        </Button>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <label className="font-semibold">Full Name</label>
        <input
          className="border p-2 w-full rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={handleUpdateName} disabled={loading}>
          Update Name
        </Button>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="font-semibold">New Password</label>
        <input
          type="password"
          className="border p-2 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handlePasswordUpdate} disabled={loading}>
          Update Password
        </Button>
      </div>
    </div>
  );
}