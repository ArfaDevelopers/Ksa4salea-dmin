'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/users/login', { email, password });
      localStorage.setItem('token', data.token);
      const decodedToken: { role: string } = jwtDecode(data.token);
      if (decodedToken.role === 'admin') {
        router.push('/admin');
      } else {
        alert('You do not have access to this page');
      }
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">Admin Dashboard Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="mb-4 p-2 border rounded w-full"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mb-4 p-2 border rounded w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
