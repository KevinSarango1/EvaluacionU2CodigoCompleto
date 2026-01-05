import React, { useState } from 'react';
import { ClinicalHistory } from '../types/patient';
import { ConfirmDialog } from './ConfirmDialog';
import { ValidationAlert } from './ValidationAlert';

interface ClinicalHistoryFormProps {
  onSubmit: (history: Partial<ClinicalHistory>) => void;
  initialData?: Partial<ClinicalHistory>;
}

export const ClinicalHistoryForm: React.FC<ClinicalHistoryFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    // Antecedentes
    medicalHistory: '',
    surgicalHistory: '',
    familyHistory: '',
    currentComplaints: '',
    pastDiseases: '',
    // Hábitos
    dietaryHabits: '',
    physicalActivity: '',
    alcoholConsumption: '',
    tobaccoUse: '',
    // Medicamentos y alergias
    medications: '',
    allergies: '',
    foodIntolerances: '',
    // Objetivo
    nutritionalObjective: '',
    dietaryRestrictions: '',
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obligatorios
    const missingFields = [];
    if (!formData.date) missingFields.push('Fecha de Consulta');
    if (!formData.medicalHistory.trim()) missingFields.push('Antecedentes Médicos');
    if (!formData.nutritionalObjective.trim()) missingFields.push('Objetivo Nutricional');

    if (missingFields.length > 0) {
      setValidationError(`Campos obligatorios incompletos: ${missingFields.join(', ')}`);
      return;
    }
    
    setShowConfirm(true);
  };

  const handleConfirmSubmit = () => {
    onSubmit({
      date: formData.date,
      medicalHistory: formData.medicalHistory,
      surgicalHistory: formData.surgicalHistory,
      familyHistory: formData.familyHistory,
      currentComplaints: formData.currentComplaints,
      pastDiseases: formData.pastDiseases,
      dietaryHabits: formData.dietaryHabits,
      physicalActivity: formData.physicalActivity,
      alcoholConsumption: formData.alcoholConsumption,
      tobaccoUse: formData.tobaccoUse,
      currentMedications: formData.medications.split(',').filter(m => m.trim()),
      allergies: formData.allergies.split(',').filter(a => a.trim()),
      foodIntolerances: formData.foodIntolerances.split(',').filter(f => f.trim()),
      nutritionalObjective: formData.nutritionalObjective,
      dietaryRestrictions: formData.dietaryRestrictions,
    });
    setShowConfirm(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow mb-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-blue-700">Historia Clínica Nutricional</h3>
        {initialData?.updatedAt && (
          <p className="text-xs text-gray-500">
            📅 Última actualización: {new Date(initialData.updatedAt).toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        )}
      </div>
      
      {/* Fecha */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Fecha de Consulta</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      {/* ANTECEDENTES */}
      <div className="mb-6 p-4 bg-blue-50 rounded border-l-4 border-blue-500">
        <h4 className="text-lg font-bold mb-4 text-blue-700">I. ANTECEDENTES</h4>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Antecedentes Médicos</label>
          <textarea
            name="medicalHistory"
            placeholder="Enfermedades crónicas, diabetes, hipertensión, etc."
            value={formData.medicalHistory}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Antecedentes Quirúrgicos</label>
          <textarea
            name="surgicalHistory"
            placeholder="Cirugías realizadas y fechas"
            value={formData.surgicalHistory}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={2}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Antecedentes Familiares</label>
          <textarea
            name="familyHistory"
            placeholder="Enfermedades en la familia (diabetes, obesidad, cardiopatía, etc.)"
            value={formData.familyHistory}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={2}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Enfermedades Pasadas</label>
          <textarea
            name="pastDiseases"
            placeholder="Enfermedades previas ya superadas"
            value={formData.pastDiseases}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={2}
          />
        </div>
      </div>

      {/* MOTIVO DE CONSULTA */}
      <div className="mb-6 p-4 bg-green-50 rounded border-l-4 border-green-500">
        <h4 className="text-lg font-bold mb-4 text-green-700">II. MOTIVO DE CONSULTA</h4>
        <textarea
          name="currentComplaints"
          placeholder="Razón principal de la consulta nutricional"
          value={formData.currentComplaints}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>

      {/* HÁBITOS */}
      <div className="mb-6 p-4 bg-yellow-50 rounded border-l-4 border-yellow-500">
        <h4 className="text-lg font-bold mb-4 text-yellow-700">III. HÁBITOS</h4>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Hábitos Dietéticos</label>
          <textarea
            name="dietaryHabits"
            placeholder="Descripción de su alimentación actual, frecuencia de comidas, etc."
            value={formData.dietaryHabits}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Actividad Física</label>
          <textarea
            name="physicalActivity"
            placeholder="Tipo, frecuencia y duración del ejercicio"
            value={formData.physicalActivity}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Consumo de Alcohol</label>
            <input
              type="text"
              name="alcoholConsumption"
              placeholder="Nunca / Ocasional / Frecuente"
              value={formData.alcoholConsumption}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Consumo de Tabaco</label>
            <input
              type="text"
              name="tobaccoUse"
              placeholder="No fuma / Fuma / Ex-fumador"
              value={formData.tobaccoUse}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* MEDICAMENTOS Y ALERGIAS */}
      <div className="mb-6 p-4 bg-red-50 rounded border-l-4 border-red-500">
        <h4 className="text-lg font-bold mb-4 text-red-700">IV. MEDICAMENTOS Y ALERGIAS</h4>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Medicamentos Actuales (separados por comas)</label>
          <textarea
            name="medications"
            placeholder="Nombre del fármaco, dosis, frecuencia"
            value={formData.medications}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={2}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Alergias Medicamentosas (separadas por comas)</label>
          <input
            type="text"
            name="allergies"
            placeholder="Alergias a medicamentos"
            value={formData.allergies}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Intolerancias Alimentarias (separadas por comas)</label>
          <input
            type="text"
            name="foodIntolerances"
            placeholder="Alimentos que no tolera (lactosa, gluten, etc.)"
            value={formData.foodIntolerances}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* OBJETIVO NUTRICIONAL */}
      <div className="mb-6 p-4 bg-purple-50 rounded border-l-4 border-purple-500">
        <h4 className="text-lg font-bold mb-4 text-purple-700">V. OBJETIVO NUTRICIONAL</h4>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Objetivo Principal</label>
          <textarea
            name="nutritionalObjective"
            placeholder="¿Qué espera lograr con la asesoría nutricional?"
            value={formData.nutritionalObjective}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={2}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Restricciones Dietéticas</label>
          <textarea
            name="dietaryRestrictions"
            placeholder="Razones religiosas, culturales, preferencias personales, etc."
            value={formData.dietaryRestrictions}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={2}
          />
        </div>
      </div>

      <button type="submit" className="w-full mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 text-lg">
        Guardar Historia Clínica
      </button>

      <ConfirmDialog
        isOpen={showConfirm}
        title="¿Estás seguro/a?"
        message="¿Deseas guardar los datos de la historia clínica?"
        confirmText="Guardar"
        cancelText="Cancelar"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirm(false)}
      />      
      <ValidationAlert
        isOpen={!!validationError}
        message={validationError}
        onClose={() => setValidationError('')}
      />    </form>
  );
};
