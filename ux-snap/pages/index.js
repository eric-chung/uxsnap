
import { useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showUnlock, setShowUnlock] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setShowUnlock(false);

    try {
      const response = await axios.post('/api/audit', {
        url,
        title: 'Example Title',
        h1: 'Welcome to Our Site',
        navItems: ['Home', 'Features', 'Pricing', 'Contact'],
        ctaButtons: ['Get Started', 'Learn More'],
        html: '<html>...mock HTML content...</html>',
      });
      setResult(response.data.result);
      setShowUnlock(true);
    } catch (err) {
      setResult('Error generating audit.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const response = await axios.post('/api/create-checkout-session', { url });
    const session = response.data;
    await stripe.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <main className="min-h-screen bg-white px-4 py-12 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mb-6">UX Snap - Instant UX Audit</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          type="url"
          placeholder="Enter your website URL"
          className="w-full p-3 border rounded-xl shadow"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Get Audit Preview'}
        </button>
      </form>

      {result && (
        <div className="mt-10 max-w-2xl p-6 border rounded-xl shadow bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Audit Preview:</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-800">{result}</pre>

          {showUnlock && (
            <button
              onClick={handleCheckout}
              className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700"
            >
              Unlock Full Report ($49)
            </button>
          )}
        </div>
      )}
    </main>
  );
}
