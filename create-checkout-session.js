
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Full UX Audit Report', description: `Full audit report for ${url}` },
          unit_amount: 4900,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/success?url=${encodeURIComponent(url)}`,
      cancel_url: `${req.headers.origin}/`,
      metadata: { url },
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: 'Stripe checkout session creation failed' });
  }
}
