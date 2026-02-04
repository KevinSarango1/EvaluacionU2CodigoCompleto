import React, { useState, useEffect } from 'react';
import { Patient } from './types/patient';
import { User } from './types/auth';
import { patientService } from './services/patientService';
import { authService } from './services/authService';
import { Login } from './components/Login';
import { AdminPanel } from './components/AdminPanel';
import { PatientDashboard } from './components/PatientDashboard';
import { PatientForm } from './components/PatientForm';
import { PatientDetail } from './components/PatientDetail';
import './App.css';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [patients, setPatients] = useState<Patient[]>(patientService.getAllPatients());
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    authService.initialize();
    const user = authService.getCurrentUser();
    setCurrentUser(user);

    // Suscribirse al Observer del patientService
    const unsubscribe = patientService.subscribe((updatedPatients) => {
      setPatients(updatedPatients);
    });

    // Limpiar suscripción al desmontar
    return unsubscribe;
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

  // Filtrar pacientes según búsqueda
  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  if (selectedPatientId) {
    return (
      <div>
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">NutriApp - {currentUser.fullName}</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 font-semibold"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
        <PatientDetail
          patientId={selectedPatientId}
          onBack={() => {
            setSelectedPatientId(null);
            // El Observer actualiza automáticamente la lista
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 shadow-lg">
        <div className="container mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">NutriApp</h1>
              <p className="text-blue-100 text-lg">Gestión Integral de Pacientes Nutricionales</p>
              <p className="text-blue-200 text-sm mt-1">👤 {currentUser.fullName}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRegisterForm(true)}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                ✚ Nuevo Paciente
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-8">
        {/* Modal de Registro */}
        {showRegisterForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-transparent rounded-2xl shadow-2xl max-w-md w-full relative">
              <button
                onClick={() => setShowRegisterForm(false)}
                className="absolute top-4 right-4 text-3xl text-white hover:text-gray-200 font-light z-10"
              >
                ✕
              </button>
              <PatientForm 
                onPatientCreated={() => {
                  setShowRegisterForm(false);
                  setSearchTerm('');
                }} 
              />
            </div>
          </div>
        )}

        {/* Barra de búsqueda y estadísticas */}
        <div className="mb-8">
          <div className="flex gap-4 items-center mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="🔍 Buscar paciente por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition duration-200 text-gray-700 placeholder-gray-400"
              />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition duration-200"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm font-semibold">Total Pacientes</p>
              <p className="text-3xl font-bold text-blue-600">{patients.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-green-500">
              <p className="text-gray-600 text-sm font-semibold">Resultados</p>
              <p className="text-3xl font-bold text-green-600">{filteredPatients.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-purple-500">
              <p className="text-gray-600 text-sm font-semibold">Activos</p>
              <p className="text-3xl font-bold text-purple-600">{patients.length}</p>
            </div>
          </div>
        </div>

        {/* Listado de Pacientes */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Pacientes {searchTerm && `- Búsqueda: "${searchTerm}"`}</h2>
          
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'No se encontraron pacientes' : 'No hay pacientes registrados'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowRegisterForm(true)}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Registrar Primer Paciente
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.map(patient => (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatientId(patient.id)}
                  className="bg-white rounded-xl shadow-md hover:shadow-2xl transition duration-300 cursor-pointer transform hover:scale-105 overflow-hidden border border-gray-100"
                >
                  {/* Encabezado con color degradado */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-20 relative">
                    <div className="absolute bottom-0 left-0 right-0 flex items-end px-6 pb-4">
                      <div className="bg-white rounded-full p-3 shadow-lg -mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {patient.firstName[0]}{patient.lastName[0]}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6 pt-10">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {patient.firstName} {patient.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 font-medium">
                      {patient.gender === 'M' ? '👨' : patient.gender === 'F' ? '👩' : '👤'} 
                      {' '}{patient.dateOfBirth}
                    </p>

                    {/* Información de contacto */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-lg">✉️</span>
                        <span className="truncate">{patient.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-lg">📞</span>
                        <span>{patient.phone}</span>
                      </div>
                    </div>

                    {/* Estado */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        ✓ Activo
                      </span>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatientId(patient.id);
                        }}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
                      >
                        Ver Detalles
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatientId(patient.id);
                        }}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold text-sm"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
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
