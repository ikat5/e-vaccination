import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Welcome to e-vaccine
            </h1>
            <p className="text-xl text-gray-600">
              Bangladesh Vaccination Program (EPI)
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <button
              onClick={() => navigate('/user/auth')}
              className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-6xl mb-4">👤</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">User</h2>
              <p className="text-gray-600">View your vaccination card and schedule vaccines</p>
            </button>

            <button
              onClick={() => navigate('/staff/login')}
              className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-6xl mb-4">👨‍⚕️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Staff</h2>
              <p className="text-gray-600">Administer vaccines and manage inventory</p>
            </button>

            <button
              onClick={() => navigate('/admin/auth')}
              className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-6xl mb-4">👨‍💼</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin</h2>
              <p className="text-gray-600">Manage staff, vaccines, and system settings</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;

