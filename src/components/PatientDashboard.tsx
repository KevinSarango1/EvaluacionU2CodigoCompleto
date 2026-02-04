import React, { useEffect, useState } from 'react';
import { Patient } from '../types/patient';
import { patientService } from '../services/patientService';
import { MenuView } from './MenuView';
import { PatientProgressReport } from './PatientProgressReport';

interface PatientDashboardProps {
  patientId: string;
  onLogout: () => void;
  patientName: string;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ patientId, onLogout, patientName }) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'menu' | 'progress'>('profile');

  useEffect(() => {
    const patientData = patientService.getPatientById(patientId);
    setPatient(patientData || null);
    setLoading(false);
  }, [patientId]);

  if (loading) {
    return <div className="p-6 text-center">Cargando...</div>;
  }

  if (!patient) {
    return <div className="p-6 text-center text-red-600">Paciente no encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header mejorado */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-800 text-white shadow-2xl">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-4xl font-black mb-2 drop-shadow-lg">📊 Mi Seguimiento Nutricional</h1>
              <div className="h-1 w-48 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-2"></div>
              <p className="text-cyan-100 text-lg">¡Hola, <span className="font-bold text-white">{patientName}</span>! Bienvenido a tu panel de control</p>
            </div>
            <button
              onClick={onLogout}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Tabs mejorados */}
        <div className="mb-8 bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-blue-200 shadow-md rounded-t-2xl">
          <div className="flex gap-2 p-4 overflow-x-auto">
            {[
              { id: 'profile', label: 'Perfil', icon: '👤' },
              { id: 'menu', label: 'Menú Semanal', icon: '📋' },
              { id: 'progress', label: 'Mi Progreso', icon: '📊' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-bold whitespace-nowrap transition duration-300 rounded-t-xl flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-105'
                    : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700 border-b-2 border-transparent hover:border-blue-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid gap-6">
            {/* Tarjeta de Información Personal */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">👤 Información Personal</h2>
                <p className="text-blue-100 text-sm mt-1">Tus datos personales</p>
              </div>
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-500">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">Nombre Completo</p>
                    <p className="text-2xl font-bold text-slate-800">{patient.firstName} {patient.lastName}</p>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6 border-l-4 border-cyan-500">
                    <p className="text-xs font-bold text-cyan-700 uppercase tracking-wide mb-2">Email</p>
                    <p className="text-lg font-semibold text-slate-800">{patient.email}</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border-l-4 border-emerald-500">
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">Teléfono</p>
                    <p className="text-lg font-semibold text-slate-800">{patient.phone}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-l-4 border-purple-500">
                    <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-2">Fecha de Nacimiento</p>
                    <p className="text-lg font-semibold text-slate-800">{patient.dateOfBirth}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">📋 Menú Semanal</h2>
              <p className="text-purple-100 text-sm mt-1">Tu plan de alimentación personalizado</p>
            </div>
            <div className="p-8">
              {patient?.weeklyMenu ? (
                <MenuView weeklyMenu={patient.weeklyMenu} />
              ) : (
                <div className="p-12 bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-xl text-center">
                  <p className="text-5xl mb-4">📭</p>
                  <p className="text-2xl font-bold text-amber-900 mb-2">Sin menú asignado</p>
                  <p className="text-amber-700 text-lg">
                    Tu nutricionista aún no ha asignado un menú semanal. <br />
                    Por favor, comunícate con él para recibir tu plan de alimentación personalizado.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <PatientProgressReport patient={patient} />
        )}
      </main>
    </div>
  );
};
