import React, { useState } from 'react';
import { LoginCredentials } from '../types/auth';
import { authService } from '../services/authService';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await authService.login(credentials);
      
      if (user) {
        onLoginSuccess();
      } else {
        setError('Email o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mb-4">
              <span className="text-2xl text-white">🏥</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">NutriApp</h1>
            <p className="text-gray-500 text-sm">Sistema de Gestión Nutricional</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 transition bg-gray-50"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 transition bg-gray-50"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 transition"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">Credenciales de Demo</span>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <p className="text-sm text-gray-600 mb-3 font-semibold">
              👤 Administrador
            </p>
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center justify-between bg-white rounded-lg p-2 px-3">
                <span className="text-gray-600">Email:</span>
                <span className="text-gray-800 font-mono">kevin.sarango@unl.edu.ec</span>
              </div>
              <div className="flex items-center justify-between bg-white rounded-lg p-2 px-3">
                <span className="text-gray-600">Password:</span>
                <span className="text-gray-800 font-mono">admin123</span>
              </div>
            </div>
            <p className="text-xs text-blue-700 bg-white rounded-lg p-2 px-3">
              ℹ️ El administrador puede crear y gestionar nutricionistas
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white text-sm mt-6 opacity-75">
          © 2025 NutriApp. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};
