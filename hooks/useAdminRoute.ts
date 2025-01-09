'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getToken } from '../utils/auth';
import {jwtDecode} from 'jwt-decode';

const useAdminRoute = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }

    const token = getToken();
    if (token) {
      const decodedToken: { role: string } = jwtDecode(token);
      if (decodedToken.role !== 'admin') {
        router.push('/');
      } else {
        setLoading(false);
      }
    } else {
      router.push('/');
    }
  }, [router]);

  return loading;
};

export default useAdminRoute;
