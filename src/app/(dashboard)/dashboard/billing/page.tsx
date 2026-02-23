"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

async function fetchProfile() {
  const res = await fetch("/api/profile");
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export default function BillingPage() {
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const profile = data?.profile;
  const isPro = profile?.plan === "pro";

  const handleUpgrade = async () => {
    setLoading(true);

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }

    setLoading(false);
  };

  if (isLoading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Billing</h1>
      <p>User ID: {data?.profile?.id}</p>
<p>Plan: {profile?.plan}</p>
      <div className="border p-6 rounded-lg space-y-4">

        {isPro ? (
          <>
            <h2 className="text-xl font-semibold">Pro Plan 🚀</h2>

            <p className="text-sm text-muted-foreground">
              Your subscription renews on:
              <span className="ml-1 font-medium text-foreground">
                {profile?.current_period_end
                  ? new Date(profile.current_period_end).toLocaleDateString()
                  : "—"}
              </span>
            </p>

            <Button variant="outline">
              Manage Subscription
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold">Free Plan</h2>

            <ul className="mb-4 space-y-2 text-sm">
              <li>✅ 5 Documents per workspace</li>
              <li>❌ Unlimited documents</li>
              <li>❌ Advanced collaboration</li>
            </ul>

            <Button onClick={handleUpgrade} disabled={loading}>
              {loading ? "Redirecting..." : "Upgrade to Pro"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}