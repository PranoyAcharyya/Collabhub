import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Admin client (bypasses RLS)
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

  // ================= HANDLE CHECKOUT COMPLETION =================
  if (event.type === "checkout.session.completed") {
     console.log("Webhook triggered: checkout.session.completed");
    const session = event.data.object as Stripe.Checkout.Session;
// console.log("Session object:", session);

    try {
      //Retrieve full session (metadata is guaranteed here)
      const fullSession = await stripe.checkout.sessions.retrieve(session.id);

      const userId = fullSession.metadata?.userId;
      const subscriptionId = fullSession.subscription as string;
    //   console.log("userId:", userId);
    // console.log("subscriptionId:", subscriptionId);

      if (!userId || !subscriptionId) {
        console.error("Missing userId or subscriptionId in session metadata");
        return NextResponse.json({ received: true });
      }

      // Get subscription details
      const subscription = (await stripe.subscriptions.retrieve(
        subscriptionId
      )) as Stripe.Subscription;
      console.log("SUBSCRIPTION OBJECT:", subscription);

    const billingAnchor = (subscription as any).billing_cycle_anchor;

const currentPeriodEnd = new Date(billingAnchor * 1000);
currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
      //  Update Supabase
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({
          plan: "pro",
          subscription_status: subscription.status,
          stripe_subscription_id: subscription.id,
          current_period_end: currentPeriodEnd,
          subscription_ends_at: currentPeriodEnd
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

  return NextResponse.json({ received: true });
}