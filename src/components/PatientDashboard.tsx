import React, { useEffect, useState } from 'react';
import { Patient } from '../types/patient';
import { patientService } from '../services/patientService';

interface PatientDashboardProps {
  patientId: string;
  onLogout: () => void;
  patientName: string;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ patientId, onLogout, patientName }) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

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

  const hasWeeklyMenu = patient.weeklyMenu && patient.weeklyMenu.weekStartDate;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-6 shadow">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Mi Seguimiento Nutricional</h1>
            <p className="text-blue-100">Hola, {patientName}</p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Datos del Paciente */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Información Personal</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 font-semibold">Nombre:</p>
              <p className="text-lg">{patient.firstName} {patient.lastName}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Email:</p>
              <p className="text-lg">{patient.email}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Teléfono:</p>
              <p className="text-lg">{patient.phone}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Fecha de Nacimiento:</p>
              <p className="text-lg">{patient.dateOfBirth}</p>
            </div>
          </div>
        </div>

        {/* Menú Semanal */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            📋 Menú Semanal Asignado
          </h2>

          {!hasWeeklyMenu ? (
            <div className="p-8 bg-yellow-50 border-2 border-yellow-300 rounded-lg text-center">
              <p className="text-2xl mb-2">⚠️</p>
              <p className="text-xl font-semibold text-yellow-800 mb-2">
                No se ha designado menú semanal
              </p>
              <p className="text-gray-700">
                Tu nutricionista aún no ha asignado un menú semanal. Por favor, comunícate con él.
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-4 p-4 bg-blue-50 rounded border-l-4 border-blue-500">
                <p className="font-semibold text-blue-700">
                  Menú del: {patient.weeklyMenu?.weekStartDate}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(
                  (day, index) => {
                    const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
                    const dayContent = patient.weeklyMenu?.[day as keyof typeof patient.weeklyMenu] as string | undefined;

                    return (
                      <div key={day} className="p-4 bg-gray-50 rounded border">
                        <h3 className="font-bold text-lg mb-3 text-blue-700">
                          {dayNames[index]}
                        </h3>
                        {dayContent ? (
                          <p className="text-gray-700 whitespace-pre-wrap">{dayContent}</p>
                        ) : (
                          <p className="text-gray-500 italic">Sin menú asignado</p>
                        )}
                      </div>
                    );
                  }
                )}
              </div>

              {patient.weeklyMenu?.observations && (
                <div className="mt-4 p-4 bg-green-50 rounded border-l-4 border-green-500">
                  <h3 className="font-bold text-green-700 mb-2">Observaciones</h3>
                  <p className="text-gray-700">{patient.weeklyMenu.observations}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
