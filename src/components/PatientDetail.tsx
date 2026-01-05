import React, { useState } from 'react';
import { Patient, ClinicalHistory, Biometrics, Anthropometry } from '../types/patient';
import { patientService } from '../services/patientService';
import { ClinicalHistoryForm } from './ClinicalHistoryForm';
import { BiometricsForm } from './BiometricsForm';
import { BiometricsDisplay } from './BiometricsDisplay';
import { AnthropometryForm } from './AnthropometryForm';
import { AnthropometryDisplay } from './AnthropometryDisplay';
import { PatientEdit } from './PatientEdit';
import { WeeklyMenuForm } from './WeeklyMenuForm';
import { SuccessAlert } from './SuccessAlert';

interface PatientDetailProps {
  patientId: string;
  onBack: () => void;
}

export const PatientDetail: React.FC<PatientDetailProps> = ({ patientId, onBack }) => {
  const [patient, setPatient] = useState<Patient | null>(patientService.getPatientById(patientId));
  const [activeTab, setActiveTab] = useState<'history' | 'biometrics' | 'anthropometry' | 'menu'>('history');
  const [isEditing, setIsEditing] = useState(false);
  const [successAlert, setSuccessAlert] = useState<{ isOpen: boolean; message: string; title: string }>({
    isOpen: false,
    message: '',
    title: '',
  });

  if (!patient) {
    return <div className="p-6">Paciente no encontrado</div>;
  }

  if (isEditing) {
    return (
      <div className="p-6">
        <button
          onClick={() => setIsEditing(false)}
          className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          ← Volver
        </button>
        <PatientEdit
          patientId={patientId}
          onPatientUpdated={(updatedPatient) => {
            setPatient(updatedPatient);
            setIsEditing(false);
            setSuccessAlert({
              isOpen: true,
              title: 'Actualizado',
              message: 'Paciente actualizado exitosamente',
            });
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

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
    <div className="p-6">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        ← Volver
      </button>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">{patient.firstName} {patient.lastName}</h2>
            <p className="text-gray-600">Email: {patient.email}</p>
            <p className="text-gray-600">Teléfono: {patient.phone}</p>
            <p className="text-gray-600">Fecha de nacimiento: {patient.dateOfBirth}</p>
            <p className="text-gray-600">Género: {patient.gender === 'M' ? 'Masculino' : patient.gender === 'F' ? 'Femenino' : 'Otro'}</p>
            {patient.clinicalHistory?.updatedAt && (
              <p className="text-sm text-gray-500 mt-3">
                📅 Última actualización: {new Date(patient.clinicalHistory.updatedAt).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            )}
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            ✏️ Editar Perfil
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-bold ${activeTab === 'history' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
        >
          Historia Clínica
        </button>
        <button
          onClick={() => setActiveTab('biometrics')}
          className={`px-4 py-2 font-bold ${activeTab === 'biometrics' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
        >
          Datos Bioquímicos
        </button>
        <button
          onClick={() => setActiveTab('anthropometry')}
          className={`px-4 py-2 font-bold ${activeTab === 'anthropometry' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
        >
          Antropometría
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-4 py-2 font-bold ${activeTab === 'menu' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
        >
          📋 Menú Semanal
        </button>
      </div>

      {activeTab === 'history' && (
        <>
          <ClinicalHistoryForm onSubmit={handleHistoryUpdate} initialData={patient.clinicalHistory} />
          {patient.clinicalHistory && (
            <div className="p-6 bg-white rounded-lg shadow">
              <h4 className="text-xl font-bold mb-6 text-blue-700">Historial Registrado</h4>
              
              <div className="mb-4 p-4 bg-blue-50 rounded border-l-4 border-blue-500">
                <h5 className="font-bold text-blue-700 mb-3">I. ANTECEDENTES</h5>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-sm text-gray-600">Antecedentes Médicos:</p>
                    <p className="text-gray-700">{patient.clinicalHistory.medicalHistory || 'Sin información'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-600">Antecedentes Quirúrgicos:</p>
                    <p className="text-gray-700">{patient.clinicalHistory.surgicalHistory || 'Sin información'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-600">Antecedentes Familiares:</p>
                    <p className="text-gray-700">{patient.clinicalHistory.familyHistory || 'Sin información'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-600">Enfermedades Pasadas:</p>
                    <p className="text-gray-700">{patient.clinicalHistory.pastDiseases || 'Sin información'}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4 p-4 bg-green-50 rounded border-l-4 border-green-500">
                <h5 className="font-bold text-green-700 mb-3">II. MOTIVO DE CONSULTA</h5>
                <p className="text-gray-700">{patient.clinicalHistory.currentComplaints || 'Sin información'}</p>
              </div>

              <div className="mb-4 p-4 bg-yellow-50 rounded border-l-4 border-yellow-500">
                <h5 className="font-bold text-yellow-700 mb-3">III. HÁBITOS</h5>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-sm text-gray-600">Hábitos Dietéticos:</p>
                    <p className="text-gray-700">{patient.clinicalHistory.dietaryHabits || 'Sin información'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-600">Actividad Física:</p>
                    <p className="text-gray-700">{patient.clinicalHistory.physicalActivity || 'Sin información'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-sm text-gray-600">Consumo de Alcohol:</p>
                      <p className="text-gray-700">{patient.clinicalHistory.alcoholConsumption || 'Sin información'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-600">Consumo de Tabaco:</p>
                      <p className="text-gray-700">{patient.clinicalHistory.tobaccoUse || 'Sin información'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4 p-4 bg-red-50 rounded border-l-4 border-red-500">
                <h5 className="font-bold text-red-700 mb-3">IV. MEDICAMENTOS Y ALERGIAS</h5>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-sm text-gray-600">Medicamentos:</p>
                    <p className="text-gray-700">{patient.clinicalHistory.currentMedications?.join(', ') || 'Sin información'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-600">Alergias:</p>
                    <p className="text-gray-700">{patient.clinicalHistory.allergies?.join(', ') || 'Sin información'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-600">Intolerancias Alimentarias:</p>
                    <p className="text-gray-700">{patient.clinicalHistory.foodIntolerances?.join(', ') || 'Sin información'}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded border-l-4 border-purple-500">
                <h5 className="font-bold text-purple-700 mb-3">V. OBJETIVO NUTRICIONAL</h5>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-sm text-gray-600">Objetivo Principal:</p>
                    <p className="text-gray-700">{patient.clinicalHistory.nutritionalObjective || 'Sin información'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-600">Restricciones Dietéticas:</p>
                    <p className="text-gray-700">{patient.clinicalHistory.dietaryRestrictions || 'Sin información'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'biometrics' && (
        <>
          <BiometricsForm onSubmit={handleBiometricsUpdate} />
          {patient.clinicalHistory?.biometrics && Object.keys(patient.clinicalHistory.biometrics).length > 0 && (
            <BiometricsDisplay biometrics={patient.clinicalHistory.biometrics} gender={patient.gender} />
          )}
        </>
      )}

      {activeTab === 'anthropometry' && (
        <>
          <AnthropometryForm onSubmit={handleAnthropometryUpdate} />
          {patient.clinicalHistory?.anthropometry && Object.keys(patient.clinicalHistory.anthropometry).length > 0 && (
            <AnthropometryDisplay anthropometry={patient.clinicalHistory.anthropometry} gender={patient.gender} />
          )}
        </>
      )}

      {activeTab === 'menu' && (
        <WeeklyMenuForm
          patientId={patient.id}
          weeklyMenu={patient.weeklyMenu}
          onSubmit={handleWeeklyMenuUpdate}
        />
      )}

      <SuccessAlert
        isOpen={successAlert.isOpen}
        title={successAlert.title}
        message={successAlert.message}
        onClose={() => setSuccessAlert({ isOpen: false, message: '', title: '' })}
      />
    </div>
  );
};
