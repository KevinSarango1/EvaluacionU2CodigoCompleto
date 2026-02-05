import React, { useState } from 'react';
import { Patient, ClinicalHistory, Biometrics, Anthropometry, Food } from '../types/patient';
import { patientService } from '../services/patientService';
import { ClinicalHistoryForm } from './ClinicalHistoryForm';
import { BiometricsForm } from './BiometricsForm';
import { BiometricsDisplay } from './BiometricsDisplay';
import { AnthropometryForm } from './AnthropometryForm';
import { AnthropometryDisplay } from './AnthropometryDisplay';
import { WeeklyMenuFormNew } from './WeeklyMenuFormNew';
import { FoodDatabase } from './FoodDatabase';
import { PatientProgressReport } from './PatientProgressReport';
import { SuccessAlert } from './SuccessAlert';
import { ConfirmDialog } from './ConfirmDialog';

interface PatientDetailProps {
  patientId: string;
  onBack: () => void;
}

export const PatientDetail: React.FC<PatientDetailProps> = ({ patientId, onBack }) => {
  const [patient, setPatient] = useState<Patient | null>(patientService.getPatientById(patientId));
  const [activeTab, setActiveTab] = useState<'history' | 'biometrics' | 'anthropometry' | 'foods' | 'menu' | 'progress'>('history');
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Patient>>({});
  const [foods, setFoods] = useState<Food[]>([
    {
      id: '1',
      name: 'Pollo Cocido',
      grossWeight: 200,
      netWeight: 180,
      energyKcal: 330,
      energyKj: 1381,
      protein: 29.6,
      fats: 23.2,
      carbohydrates: 0,
      fiber: 0,
    },
    {
      id: '2',
      name: 'Arroz Cocido',
      grossWeight: 150,
      netWeight: 140,
      energyKcal: 195,
      energyKj: 816,
      protein: 4.3,
      fats: 0.3,
      carbohydrates: 43,
      fiber: 0.4,
    },
  ]);
  const [successAlert, setSuccessAlert] = useState<{ isOpen: boolean; message: string; title: string }>({
    isOpen: false,
    message: '',
    title: '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  // Manejador de cambios para el formulario de edición con validaciones
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // VALIDACIÓN: Nombre - solo letras y espacios (sin números)
    if (name === 'firstName') {
      const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!nameRegex.test(value)) {
        return; // No actualizar si contiene números o caracteres especiales
      }
    }

    // VALIDACIÓN: Apellido - solo letras y espacios (sin números)
    if (name === 'lastName') {
      const lastNameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!lastNameRegex.test(value)) {
        return; // No actualizar si contiene números o caracteres especiales
      }
    }

    // VALIDACIÓN: Contraseña - limitado a 20 caracteres máximo
    if (name === 'password') {
      if (value.length > 20) {
        return; // No permitir más de 20 caracteres
      }
    }

    // VALIDACIÓN: Teléfono - solo números, máximo 10 dígitos, debe empezar por 09
    if (name === 'phone') {
      const phoneRegex = /^[0-9]*$/;
      // Validar números solo
      if (!phoneRegex.test(value) || value.length > 10) {
        return; // No actualizar si contiene caracteres no numéricos o excede 10 dígitos
      }
      // Validar que inicie con 09 si tiene al menos 2 dígitos
      if (value.length >= 2 && !value.startsWith('09')) {
        return; // No actualizar si no empieza por 09
      }
    }

    // VALIDACIÓN: Fecha de nacimiento - validar año y rango
    if (name === 'dateOfBirth' && value) {
      const dateOfBirth = new Date(value);
      const today = new Date();
      const minYear = 1900;

      const dateErrors: Record<string, string> = { ...editErrors };
      
      // Validar que la fecha sea válida
      if (isNaN(dateOfBirth.getTime())) {
        dateErrors.dateOfBirth = 'Fecha de nacimiento inválida';
      } else if (dateOfBirth.getFullYear() < minYear) {
        dateErrors.dateOfBirth = `Año de nacimiento debe ser a partir de ${minYear}`;
      } else if (dateOfBirth > today) {
        dateErrors.dateOfBirth = 'La fecha de nacimiento no puede ser una fecha futura';
      } else {
        // Si es válida, limpiar el error de fecha
        delete dateErrors.dateOfBirth;
      }
      
      setEditErrors(dateErrors);
    }

    setEditFormData({ ...editFormData, [name]: value });
    
    // Limpiar error del campo (excepto para dateOfBirth que ya se maneja arriba)
    if (name !== 'dateOfBirth') {
      setEditErrors({ ...editErrors, [name]: '' }); // Limpiar error del campo
    }
  };

  if (!patient) {
    return <div className="p-6">Paciente no encontrado</div>;
  }

  const handleEditProfile = () => {
    // Inicializar editFormData con todos los campos del paciente
    setEditFormData({
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      password: '', // No precargamos la contraseña
    });
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    const errors: Record<string, string> = {};

    // VALIDACIÓN: Contraseña - 6 a 20 caracteres (si se proporciona)
    if (editFormData.password) {
      if (editFormData.password.length < 6) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres';
      } else if (editFormData.password.length > 20) {
        errors.password = 'La contraseña debe tener máximo 20 caracteres';
      }
    }

    // VALIDACIÓN: Teléfono - exactamente 10 dígitos y empezar por 09 (si se proporciona)
    if (editFormData.phone && editFormData.phone.trim()) {
      if (editFormData.phone.length !== 10) {
        errors.phone = 'El teléfono debe tener exactamente 10 dígitos';
      } else if (!editFormData.phone.startsWith('09')) {
        errors.phone = 'El teléfono debe comenzar con 09';
      }
    }

    // VALIDACIÓN: Fecha de nacimiento - año mínimo 1900 y no permitir fechas futuras
    if (editFormData.dateOfBirth) {
      const dateOfBirth = new Date(editFormData.dateOfBirth);
      const today = new Date();
      const minYear = 1900;

      // Validar que la fecha sea válida
      if (isNaN(dateOfBirth.getTime())) {
        errors.dateOfBirth = 'Fecha de nacimiento inválida';
      } else if (dateOfBirth.getFullYear() < minYear) {
        errors.dateOfBirth = `Año de nacimiento debe ser a partir de ${minYear}`;
      } else if (dateOfBirth > today) {
        errors.dateOfBirth = 'La fecha de nacimiento no puede ser una fecha futura';
      }
    }

    // Si hay errores, mostrarlos
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors found:', errors);
      setEditErrors(errors);
      return;
    }

    // Si todo está OK, guardar cambios
    const updatedPatient = patientService.updatePatient(patient.id, editFormData);
    if (updatedPatient) {
      setPatient(updatedPatient);
      setIsEditing(false);
      setEditErrors({});
      setSuccessAlert({
        isOpen: true,
        title: 'Actualizado',
        message: 'Perfil del paciente actualizado exitosamente',
      });
    }
  };

  const handleHistoryUpdate = (updates: Partial<ClinicalHistory>) => {
    const updatedHistory = {
      ...patient.clinicalHistory,
      ...updates,
      patientId: patient.id,
    };
    const updatedPatient = patientService.updateClinicalHistory(patient.id, updatedHistory);
    if (updatedPatient) {
      setPatient(updatedPatient);
    }
    setSuccessAlert({
      isOpen: true,
      title: 'Guardado',
      message: 'Historia clínica actualizada',
    });
  };

  const handleBiometricsUpdate = (biometrics: Biometrics) => {
    const updatedHistory = {
      ...patient.clinicalHistory,
      biometrics,
      patientId: patient.id,
    };
    const updatedPatient = patientService.updateClinicalHistory(patient.id, updatedHistory);
    if (updatedPatient) {
      setPatient(updatedPatient);
    }
    setSuccessAlert({
      isOpen: true,
      title: 'Guardado',
      message: 'Datos bioquímicos guardados',
    });
  };

  const handleAnthropometryUpdate = (anthropometry: Anthropometry) => {
    const updatedHistory = {
      ...patient.clinicalHistory,
      anthropometry,
      patientId: patient.id,
    };
    const updatedPatient = patientService.updateClinicalHistory(patient.id, updatedHistory);
    if (updatedPatient) {
      setPatient(updatedPatient);
    }
    setSuccessAlert({
      isOpen: true,
      title: 'Guardado',
      message: 'Antropometría guardada',
    });
  };
  const handleDeletePatient = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeletePatient = () => {
    patientService.deletePatient(patient!.id);
    setShowDeleteConfirm(false);
    setSuccessAlert({
      isOpen: true,
      title: 'Eliminado',
      message: 'Paciente eliminado exitosamente',
    });
    setTimeout(() => {
      onBack();
    }, 1500);
  };

  const handleWeeklyMenuUpdate = (weeklyMenu: any) => {
    const updatedPatient = patientService.updatePatient(patient.id, { weeklyMenu });
    if (updatedPatient) {
      setPatient(updatedPatient);
      setSuccessAlert({
        isOpen: true,
        title: 'Guardado',
        message: 'Menú semanal asignado',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header con información del paciente */}
      {/* Header mejorado */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 text-white shadow-2xl">
        <div className="container mx-auto px-6 py-12">
          <button
            onClick={onBack}
            className="mb-8 px-4 py-2 bg-white bg-opacity-15 hover:bg-opacity-25 text-white rounded-lg transition duration-300 font-semibold backdrop-blur-sm border border-white border-opacity-20"
          >
            ← Volver al Listado
          </button>

          <div className="flex justify-between items-start gap-8">
            {/* Información del paciente */}
            <div className="flex gap-8 items-start flex-1">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl p-2 shadow-2xl transform hover:scale-105 transition duration-300">
                <div className="w-28 h-28 bg-gradient-to-br from-cyan-300 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-5xl shadow-lg">
                  {patient.firstName[0]}{patient.lastName[0]}
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-2">
                  <h1 className="text-5xl font-black mb-1 text-white drop-shadow-lg">{patient.firstName} {patient.lastName}</h1>
                  <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                </div>
                <div className="space-y-2 text-blue-50 mt-4 grid grid-cols-2 gap-4">
                  <p className="flex items-center gap-2 text-sm">
                    <span className="text-lg">✉️</span>
                    <span className="font-semibold">{patient.email}</span>
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <span className="text-lg">📞</span>
                    <span className="font-semibold">{patient.phone}</span>
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <span className="text-lg">📅</span>
                    <span className="font-semibold">{patient.dateOfBirth}</span>
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <span className="text-lg">{patient.gender === 'M' ? '👨' : patient.gender === 'F' ? '👩' : '👤'}</span>
                    <span className="font-semibold">{patient.gender === 'M' ? 'Masculino' : patient.gender === 'F' ? 'Femenino' : 'Otro'}</span>
                  </p>
                  {patient.clinicalHistory?.updatedAt && (
                    <p className="text-xs text-cyan-200 col-span-2 pt-2 border-t border-white border-opacity-20">
                      📝 Última actualización: {new Date(patient.clinicalHistory.updatedAt).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Botones de acción mejorados */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleEditProfile}
                className="px-8 py-3 bg-gradient-to-r from-white to-cyan-100 text-slate-900 rounded-xl hover:from-cyan-50 hover:to-blue-50 transition duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-2"
              >
                <span>✏️</span> Editar Perfil
              </button>
              <button
                onClick={handleDeletePatient}
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-2"
              >
                <span>🗑️</span> Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs mejorados con estilo moderno */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-blue-200 shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto py-2">
            {[
              { id: 'history', label: 'Historia Clínica', icon: '📋' },
              { id: 'biometrics', label: 'Datos Bioquímicos', icon: '🩸' },
              { id: 'anthropometry', label: 'Antropometría', icon: '📏' },
              { id: 'foods', label: 'Base de Alimentos', icon: '🍎' },
              { id: 'menu', label: 'Menú Semanal', icon: '🍽️' },
              { id: 'progress', label: 'Progreso', icon: '📊' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 font-bold whitespace-nowrap transition duration-300 rounded-t-xl flex items-center gap-2 ${
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
      </div>

      {/* Contenido de las tabs con mejor UX/UI */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="container mx-auto px-6 py-8">
        {activeTab === 'history' && (
          <div className="grid gap-6">
            {/* Formulario de Historia Clínica */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">📋 Historia Clínica del Paciente</h3>
                <p className="text-blue-100 text-sm mt-1">Completa la información clínica del paciente</p>
              </div>
              <div className="p-8">
                <ClinicalHistoryForm onSubmit={handleHistoryUpdate} initialData={patient.clinicalHistory} />
              </div>
            </div>

            {/* Historial Registrado */}
            {patient.clinicalHistory && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-6">
                  <h3 className="text-2xl font-bold text-white">📝 Resumen de Historia</h3>
                  <p className="text-cyan-100 text-sm mt-1">Información registrada del paciente</p>
                </div>
                
                <div className="p-8 space-y-6">
                  {/* I. ANTECEDENTES */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-500 hover:shadow-md transition">
                    <h4 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">🏥 Antecedentes Médicos</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Médicos</p>
                        <p className="text-gray-700 text-sm mt-1">{patient.clinicalHistory.medicalHistory || '— Sin información'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Quirúrgicos</p>
                        <p className="text-gray-700 text-sm mt-1">{patient.clinicalHistory.surgicalHistory || '— Sin información'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Familiares</p>
                        <p className="text-gray-700 text-sm mt-1">{patient.clinicalHistory.familyHistory || '— Sin información'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Enfermedades Pasadas</p>
                        <p className="text-gray-700 text-sm mt-1">{patient.clinicalHistory.pastDiseases || '— Sin información'}</p>
                      </div>
                    </div>
                  </div>

                  {/* II. MOTIVO DE CONSULTA */}
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border-l-4 border-emerald-500 hover:shadow-md transition">
                    <h4 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">🎯 Motivo de Consulta</h4>
                    <p className="text-gray-700 text-sm">{patient.clinicalHistory.currentComplaints || '— Sin información'}</p>
                  </div>

                  {/* III. HÁBITOS */}
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border-l-4 border-amber-500 hover:shadow-md transition">
                    <h4 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">🥗 Hábitos y Estilo de Vida</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Dietéticos</p>
                        <p className="text-gray-700 text-sm mt-1">{patient.clinicalHistory.dietaryHabits || '— Sin información'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Actividad Física</p>
                        <p className="text-gray-700 text-sm mt-1">{patient.clinicalHistory.physicalActivity || '— Sin información'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Alcohol</p>
                        <p className="text-gray-700 text-sm mt-1">{patient.clinicalHistory.alcoholConsumption || '— Sin información'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Tabaco</p>
                        <p className="text-gray-700 text-sm mt-1">{patient.clinicalHistory.tobaccoUse || '— Sin información'}</p>
                      </div>
                    </div>
                  </div>

                  {/* IV. MEDICAMENTOS Y ALERGIAS */}
                  <div className="bg-gradient-to-br from-red-50 to-rose-100 rounded-xl p-6 border-l-4 border-red-500 hover:shadow-md transition">
                    <h4 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">💊 Medicamentos y Alergias</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-red-700 uppercase tracking-wide">Medicamentos Actuales</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {patient.clinicalHistory.currentMedications?.length ? (
                            patient.clinicalHistory.currentMedications.map((med, idx) => (
                              <span key={idx} className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">💊 {med}</span>
                            ))
                          ) : (
                            <p className="text-gray-600 text-sm">— Sin información</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-red-700 uppercase tracking-wide">Alergias</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {patient.clinicalHistory.allergies?.length ? (
                            patient.clinicalHistory.allergies.map((allergy, idx) => (
                              <span key={idx} className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">⚠️ {allergy}</span>
                            ))
                          ) : (
                            <p className="text-gray-600 text-sm">— Sin información</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-red-700 uppercase tracking-wide">Intolerancias Alimentarias</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {patient.clinicalHistory.foodIntolerances?.length ? (
                            patient.clinicalHistory.foodIntolerances.map((intolerance, idx) => (
                              <span key={idx} className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold">🚫 {intolerance}</span>
                            ))
                          ) : (
                            <p className="text-gray-600 text-sm">— Sin información</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* V. OBJETIVO NUTRICIONAL */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-l-4 border-purple-500 hover:shadow-md transition">
                    <h4 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">🎯 Objetivos Nutricionales</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold text-purple-700 uppercase tracking-wide">Objetivo Principal</p>
                        <p className="text-gray-700 text-sm mt-1">{patient.clinicalHistory.nutritionalObjective || '— Sin información'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-purple-700 uppercase tracking-wide">Restricciones Dietéticas</p>
                        <p className="text-gray-700 text-sm mt-1">{patient.clinicalHistory.dietaryRestrictions || '— Sin información'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'biometrics' && (
          <div className="grid gap-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 px-8 py-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">🩸 Datos Bioquímicos</h3>
                <p className="text-red-100 text-sm mt-1">Registra los análisis clínicos del paciente</p>
              </div>
              <div className="p-8">
                <BiometricsForm onSubmit={handleBiometricsUpdate} />
              </div>
            </div>
            {patient.clinicalHistory?.biometrics && Object.keys(patient.clinicalHistory.biometrics).length > 0 && (
              <BiometricsDisplay biometrics={patient.clinicalHistory.biometrics} gender={patient.gender} />
            )}
          </div>
        )}

        {activeTab === 'anthropometry' && (
          <div className="grid gap-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">📏 Medidas Antropométricas</h3>
                <p className="text-amber-100 text-sm mt-1">Registra las mediciones corporales del paciente</p>
              </div>
              <div className="p-8">
                <AnthropometryForm onSubmit={handleAnthropometryUpdate} />
              </div>
            </div>
            {patient.clinicalHistory?.anthropometry && Object.keys(patient.clinicalHistory.anthropometry).length > 0 && (
              <AnthropometryDisplay anthropometry={patient.clinicalHistory.anthropometry} gender={patient.gender} />
            )}
          </div>
        )}

        {activeTab === 'foods' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">🍎 Base de Alimentos</h3>
              <p className="text-green-100 text-sm mt-1">Administra la base de datos de alimentos disponibles</p>
            </div>
            <div className="p-8">
              <FoodDatabase 
                initialFoods={foods}
                onFoodsChange={setFoods}
              />
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-8 py-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">🍽️ Menú Semanal</h3>
              <p className="text-purple-100 text-sm mt-1">Planifica y gestiona el menú semanal del paciente</p>
            </div>
            <div className="p-8">
              <WeeklyMenuFormNew
                patientId={patient.id}
                weeklyMenu={patient.weeklyMenu}
                foods={foods}
                onSubmit={handleWeeklyMenuUpdate}
              />
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <PatientProgressReport patient={patient} />
        )}
        </div>
      </div>

      {/* Alertas */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-500 text-white p-8 sticky top-0 z-10">
              <h2 className="text-3xl font-bold">✏️ Editar Perfil</h2>
              <p className="text-blue-50 text-sm mt-2">Actualiza la información del paciente</p>
            </div>

            {/* Contenido del Formulario */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProfile();
              }}
              className="p-8 space-y-6"
            >
              {/* Errores de validación */}
              {Object.keys(editErrors).length > 0 && (
                <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-xl">
                  <h4 className="text-red-900 font-bold mb-3 flex items-center gap-2">⚠️ Por favor corrige los errores:</h4>
                  <ul className="space-y-2">
                    {Object.entries(editErrors).map(([field, error]) => (
                      <li key={field} className="text-red-700 text-sm flex items-center gap-2">
                        <span>❌</span> {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Row 1: Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">📝 Nombre</label>
                  <input
                    type="text"
                    name="firstName"
                    value={editFormData.firstName || ''}
                    onChange={handleEditFormChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition text-sm ${
                      editErrors.firstName
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500'
                        : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">📝 Apellido</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editFormData.lastName || ''}
                    onChange={handleEditFormChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition text-sm ${
                      editErrors.lastName
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500'
                        : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                </div>
              </div>

              {/* Row 2: Email y Teléfono */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">📧 Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email || ''}
                    onChange={handleEditFormChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">📞 Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Ej: 0987654321"
                    value={editFormData.phone || ''}
                    onChange={handleEditFormChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition text-sm ${
                      editErrors.phone
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500'
                        : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                </div>
              </div>

              {/* Row 3: Fecha de Nacimiento y Género */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">🎂 Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={editFormData.dateOfBirth || ''}
                    onChange={handleEditFormChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition text-sm ${
                      editErrors.dateOfBirth
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500'
                        : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">👥 Género</label>
                  <select
                    name="gender"
                    value={editFormData.gender || 'M'}
                    onChange={handleEditFormChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none transition text-sm bg-white cursor-pointer"
                  >
                    <option value="M">👨 Masculino</option>
                    <option value="F">👩 Femenino</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Contraseña */}
              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">🔐 Cambiar Contraseña (opcional)</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Dejar en blanco para no cambiar"
                  value={editFormData.password || ''}
                  onChange={handleEditFormChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition text-sm ${
                    editErrors.password
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500'
                      : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                  }`}
                />
                <p className="text-xs text-slate-500 mt-1">Entre 6 y 20 caracteres si deseas cambiarla</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-slate-200">
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition duration-200 uppercase tracking-wide flex items-center justify-center gap-2 text-lg"
                >
                  <span>💾</span>
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditErrors({});
                  }}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition duration-200 uppercase tracking-wide"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <SuccessAlert
        isOpen={successAlert.isOpen}
        title={successAlert.title}
        message={successAlert.message}
        onClose={() => setSuccessAlert({ isOpen: false, message: '', title: '' })}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Eliminar Paciente"
        message={`¿Estás seguro/a de que deseas eliminar a ${patient.firstName} ${patient.lastName}?\n\nEsta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={confirmDeletePatient}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};
