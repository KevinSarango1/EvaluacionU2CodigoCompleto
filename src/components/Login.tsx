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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card premium */}
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-white border-opacity-20">
          {/* Logo/Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-emerald-500 mb-6 shadow-lg">
              <span className="text-4xl">💊</span>
            </div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-cyan-600 mb-2">
              NutriApp
            </h1>
            <p className="text-slate-600 text-sm font-semibold tracking-wide">
              🏥 Sistema Integral de Gestión Nutricional
            </p>
            <div className="mt-4 h-1 w-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                📧 Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition bg-slate-50 text-slate-800 font-medium"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                🔐 Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition bg-slate-50 text-slate-800 font-medium"
              />
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 text-red-800 rounded-xl text-sm font-semibold flex items-center gap-3">
                <span className="text-2xl">❌</span>
                <div>
                  <p className="font-bold">Datos inválidos</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 uppercase tracking-wide flex items-center justify-center gap-2 text-lg"
            >
              <span>{isLoading ? '⏳' : '🔓'}</span>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-slate-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-slate-500 font-semibold text-xs uppercase tracking-wide">Datos para Prueba</span>
            </div>
          </div>

          {/* Demo Credentials - Administrator */}
          <div className="mb-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-300 shadow-md">
            <p className="text-sm text-blue-900 mb-4 font-bold flex items-center gap-2">
              <span className="text-xl">👨‍💼</span> Administrador
            </p>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                <span className="text-slate-600 font-semibold text-sm">Email:</span>
                <span className="text-blue-700 font-mono text-sm font-bold">kevin.sarango@unl.edu.ec</span>
              </div>
              <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                <span className="text-slate-600 font-semibold text-sm">Contraseña:</span>
                <span className="text-blue-700 font-mono text-sm font-bold">admin123</span>
              </div>
            </div>
            <div className="mt-4 bg-white rounded-lg p-3 text-xs text-blue-800 flex gap-2">
              <span className="text-lg">ℹ️</span>
              <p><span className="font-bold">Permisos:</span> Crear y gestionar nutricionistas, acceso total al sistema</p>
            </div>
          </div>

          {/* Demo Credentials - Nutritionist */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border-2 border-emerald-300 shadow-md">
            <p className="text-sm text-emerald-900 mb-4 font-bold flex items-center gap-2">
              <span className="text-xl">👨‍⚕️</span> Nutricionista (Demo)
            </p>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                <span className="text-slate-600 font-semibold text-sm">Email:</span>
                <span className="text-emerald-700 font-mono text-sm font-bold">nutri@demo.com</span>
              </div>
              <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                <span className="text-slate-600 font-semibold text-sm">Contraseña:</span>
                <span className="text-emerald-700 font-mono text-sm font-bold">nutri123</span>
              </div>
            </div>
            <div className="mt-4 bg-white rounded-lg p-3 text-xs text-emerald-800 flex gap-2">
              <span className="text-lg">ℹ️</span>
              <p><span className="font-bold">Permisos:</span> Ver pacientes, gestionar menús y seguimiento</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white text-xs opacity-75 font-medium">
            © 2025 NutriApp • Sistema Integral de Gestión Nutricional
          </p>
          <p className="text-cyan-200 text-xs mt-2 opacity-60">
            v1.0.0 • Desarrollado con ❤️
          </p>
        </div>
      </div>
    </div>
  );
};
