import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
      setLoading(false);
    } else {
      axios.get('http://localhost:8080/api/user', { withCredentials: true })
        .then(res => {
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem('user');
        })
        .finally(() => setLoading(false));
    }
  }, []);

  return { user, loading };
}