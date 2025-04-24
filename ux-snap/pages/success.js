
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();
  const { url } = router.query;
  const [message, setMessage] = useState('Generating your full report...');

  useEffect(() => {
    if (!url) return;
    axios.post('/api/generate-report', { url })
      .then(() => setMessage('Your report is ready and emailed!'))
      .catch(() => setMessage('Failed to generate the report.'));
  }, [url]);

  return (
    <main className="min-h-screen bg-white px-4 py-12 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mb-6">Thank You!</h1>
      <p>{message}</p>
    </main>
  );
}
