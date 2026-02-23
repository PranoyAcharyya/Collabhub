import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// 🔥 Admin client (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();

  const headerList = await headers();
  const sig = headerList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

 if (event.type === "checkout.session.completed") {
  const session = event.data.object as Stripe.Checkout.Session;

  const userId = session.metadata?.userId;

  if (userId && session.subscription) {
    try {
      // 🔥 Get subscription details from Stripe
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      const currentPeriodEnd = new Date(
        subscription.current_period_end * 1000
      );

      const { error } = await supabaseAdmin
        .from("profiles")
        .update({
          plan: "pro",
          subscription_status: subscription.status,
          stripe_subscription_id: subscription.id,
          current_period_end: currentPeriodEnd,
        })
        .eq("id", userId);

      if (error) {
        console.error("Supabase update error:", error);
      } else {
        console.log("User upgraded to pro:", userId);
      }
    } catch (err) {
      console.error("Subscription fetch error:", err);
    }
  }
}

  return NextResponse.json({ received: true });
}