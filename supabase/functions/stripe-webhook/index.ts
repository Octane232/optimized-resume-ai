import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      logStep("ERROR: No stripe-signature header");
      return new Response("No signature", { status: 400 });
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!webhookSecret) {
      logStep("ERROR: STRIPE_WEBHOOK_SECRET not configured");
      return new Response("Webhook secret not configured", { status: 500 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      logStep("ERROR: Webhook signature verification failed", { error: err.message });
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
    }

    logStep("Event received", { type: event.type, id: event.id });

    // Log webhook event
    await supabaseClient.from("webhook_logs").insert({
      event_type: event.type,
      payload: event.data.object,
      processed: false,
    });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout session completed", { 
          customerId: session.customer, 
          email: session.customer_email,
          subscriptionId: session.subscription 
        });

        if (session.mode === "subscription" && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const priceId = subscription.items.data[0]?.price.id;
          
          // Get user by email
          const email = session.customer_email || session.customer_details?.email;
          if (email) {
            const { data: users } = await supabaseClient.auth.admin.listUsers();
            const user = users.users.find(u => u.email === email);
            
            if (user) {
              // Update or create user subscription
              await supabaseClient.from("user_subscriptions").upsert({
                user_id: user.id,
                plan_id: priceId || "unknown",
                plan_status: "active",
                billing_cycle: subscription.items.data[0]?.price.recurring?.interval || "month",
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              }, { onConflict: "user_id" });

              logStep("User subscription created/updated", { userId: user.id, priceId });
            }
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Subscription updated", { 
          subscriptionId: subscription.id, 
          status: subscription.status 
        });

        const customer = await stripe.customers.retrieve(subscription.customer as string);
        if (customer && !customer.deleted && customer.email) {
          const { data: users } = await supabaseClient.auth.admin.listUsers();
          const user = users.users.find(u => u.email === customer.email);

          if (user) {
            const priceId = subscription.items.data[0]?.price.id;
            await supabaseClient.from("user_subscriptions").upsert({
              user_id: user.id,
              plan_id: priceId || "unknown",
              plan_status: subscription.status === "active" ? "active" : "inactive",
              billing_cycle: subscription.items.data[0]?.price.recurring?.interval || "month",
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            }, { onConflict: "user_id" });

            logStep("User subscription updated", { userId: user.id, status: subscription.status });
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Subscription deleted", { subscriptionId: subscription.id });

        const customer = await stripe.customers.retrieve(subscription.customer as string);
        if (customer && !customer.deleted && customer.email) {
          const { data: users } = await supabaseClient.auth.admin.listUsers();
          const user = users.users.find(u => u.email === customer.email);

          if (user) {
            await supabaseClient.from("user_subscriptions").update({
              plan_status: "cancelled",
            }).eq("user_id", user.id);

            logStep("User subscription cancelled", { userId: user.id });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Invoice payment failed", { 
          invoiceId: invoice.id, 
          customerId: invoice.customer 
        });

        const customer = await stripe.customers.retrieve(invoice.customer as string);
        if (customer && !customer.deleted && customer.email) {
          const { data: users } = await supabaseClient.auth.admin.listUsers();
          const user = users.users.find(u => u.email === customer.email);

          if (user) {
            await supabaseClient.from("user_subscriptions").update({
              plan_status: "past_due",
            }).eq("user_id", user.id);

            logStep("User subscription marked as past_due", { userId: user.id });
          }
        }
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    // Mark as processed
    await supabaseClient.from("webhook_logs").update({ processed: true })
      .eq("event_type", event.type)
      .order("created_at", { ascending: false })
      .limit(1);

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    logStep("ERROR", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
