import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

const session = await stripe.checkout.sessions.create({
  mode: "subscription",
  payment_method_types: ["card"],

  line_items: [
    {
      price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
      quantity: 1,
    },
  ],

  success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,

  metadata: {
    userId: user.id,
  },

  subscription_data: {
    metadata: {
      userId: user.id,
    },
  },
});

  return NextResponse.json({ url: session.url });
}