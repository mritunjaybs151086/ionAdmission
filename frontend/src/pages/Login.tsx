import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (role: string) => {
    localStorage.setItem('token', 'authenticated');
    localStorage.setItem('role', role);
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-1/3 p-6 bg-gray-200 rounded">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <button
          onClick={() => handleLogin('user')}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
        >
          Login as User
        </button>
        <button
          onClick={() => handleLogin('admin')}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Login as Admin
        </button>
      </div>
    </div>
  );
};

export default Login;
