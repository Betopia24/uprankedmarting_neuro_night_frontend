import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subscriptionData } = body;

    if (!subscriptionData) {
      return new Response(
        JSON.stringify({ error: "Missing subscription data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { cardholderName, planId, numberOfAgents, email } = subscriptionData;

    // Step 1: Create a customer
    const customer = await stripe.customers.create({
      name: cardholderName,
      email: email || undefined,
    });

    // Step 2: Create a PaymentIntent for the subscription
    // You can calculate amount from your own logic
    // Here I'm assuming plan price is sent as cents (integer)
    const subscriptionAmount = subscriptionData.amountCents || 5000; // fallback $50
    const currency = subscriptionData.currency || "usd";

    const paymentIntent = await stripe.paymentIntents.create({
      customer: customer.id,
      amount: subscriptionAmount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    // Step 3: Create subscription record (optional, your DB)
    // You can save subscriptionData + paymentIntent.id in your DB here

    return new Response(
      JSON.stringify({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Stripe error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Something went wrong" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
