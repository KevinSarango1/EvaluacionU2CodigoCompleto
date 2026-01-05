import React, { useState, useEffect } from 'react';
import { Patient } from './types/patient';
import { User } from './types/auth';
import { patientService } from './services/patientService';
import { authService } from './services/authService';
import { Login } from './components/Login';
import { AdminPanel } from './components/AdminPanel';
import { PatientForm } from './components/PatientForm';
import { PatientDetail } from './components/PatientDetail';
import { PatientDashboard } from './components/PatientDashboard';
import './App.css';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [patients, setPatients] = useState<Patient[]>(patientService.getAllPatients());
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  useEffect(() => {
    authService.initialize();
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleLoginSuccess = () => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setPatients(patientService.getAllPatients());
    setSelectedPatientId(null);
  };

  // Si no está autenticado, mostrar login
  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Si es admin, mostrar panel de administración
  if (currentUser.role === 'admin') {
    return <AdminPanel onLogout={handleLogout} currentUser={currentUser} />;
  }

  // Si es paciente, mostrar dashboard del paciente
  if (currentUser.role === 'patient') {
    return (
      <PatientDashboard
        patientId={currentUser.id}
        patientName={currentUser.fullName}
        onLogout={handleLogout}
      />
    );
  }

  // Si es nutricionista, mostrar app de gestión de pacientes
  const handlePatientCreated = (patient: Patient) => {
    setPatients([...patients, patient]);
  };

  const refreshPatients = () => {
    setPatients(patientService.getAllPatients());
  };

  if (selectedPatientId) {
    return (
      <div>
        <div className="bg-blue-600 text-white p-6">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">NutriApp - {currentUser.fullName}</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
        <PatientDetail
          patientId={selectedPatientId}
          onBack={() => {
            setSelectedPatientId(null);
            refreshPatients();
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-6 shadow">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">NutriApp</h1>
            <p className="text-blue-100">Gestión de Pacientes - {currentUser.fullName}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowRegisterForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold"
            >
              + Registrar Paciente
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Modal de Registro */}
        {showRegisterForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Registrar Nuevo Paciente</h2>
                <button
                  onClick={() => setShowRegisterForm(false)}
                  className="text-2xl text-gray-600 hover:text-gray-900"
                >
                  ×
                </button>
              </div>
              <PatientForm 
                onPatientCreated={(patient) => {
                  handlePatientCreated(patient);
                  setShowRegisterForm(false);
                }} 
              />
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Pacientes Registrados</h2>
          {patients.length === 0 ? (
            <p className="text-gray-600">No hay pacientes registrados</p>
          ) : (
            <div className="grid gap-4">
              {patients.map(patient => (
                <div key={patient.id} className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer" onClick={() => setSelectedPatientId(patient.id)}>
                  <h3 className="text-xl font-bold">{patient.firstName} {patient.lastName}</h3>
                  <p className="text-gray-600">Email: {patient.email}</p>
                  <p className="text-gray-600">Teléfono: {patient.phone}</p>
                  <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Ver Detalles
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
