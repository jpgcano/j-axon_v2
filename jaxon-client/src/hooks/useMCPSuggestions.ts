import { useState, useEffect } from 'react';

export const useMCPSuggestions = (context: any) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchPrediction = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch('/api/v1/ai/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context)
      });
      
      if (!response.ok) throw new Error();
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('IA Suggestion failed - Circuit Breaker likely active');
      setError(true);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (context) {
      fetchPrediction();
    }
  }, [JSON.stringify(context)]);

  return { data, loading, error, refetch: fetchPrediction };
};