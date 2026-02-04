import React, { useState } from 'react';
import { ClinicalHistory } from '../types/patient';
import { ConfirmDialog } from './ConfirmDialog';
import { ValidationAlert } from './ValidationAlert';

interface ClinicalHistoryFormProps {
  onSubmit: (history: Partial<ClinicalHistory>) => void;
  initialData?: Partial<ClinicalHistory>;
}

export const ClinicalHistoryForm: React.FC<ClinicalHistoryFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState(
    initialData ? {
      date: initialData.date || new Date().toISOString().split('T')[0],
      medicalHistory: initialData.medicalHistory || '',
      surgicalHistory: initialData.surgicalHistory || '',
      familyHistory: initialData.familyHistory || '',
      currentComplaints: initialData.currentComplaints || '',
      pastDiseases: initialData.pastDiseases || '',
      dietaryHabits: initialData.dietaryHabits || '',
      physicalActivity: initialData.physicalActivity || '',
      alcoholConsumption: initialData.alcoholConsumption || '',
      tobaccoUse: initialData.tobaccoUse || '',
      medications: initialData.currentMedications?.join(', ') || '',
      allergies: initialData.allergies?.join(', ') || '',
      foodIntolerances: initialData.foodIntolerances?.join(', ') || '',
      nutritionalObjective: initialData.nutritionalObjective || '',
      dietaryRestrictions: initialData.dietaryRestrictions || '',
    } : {
      date: new Date().toISOString().split('T')[0],
      medicalHistory: '',
      surgicalHistory: '',
      familyHistory: '',
      currentComplaints: '',
      pastDiseases: '',
      dietaryHabits: '',
      physicalActivity: '',
      alcoholConsumption: '',
      tobaccoUse: '',
      medications: '',
      allergies: '',
      foodIntolerances: '',
      nutritionalObjective: '',
      dietaryRestrictions: '',
    }
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState({
    antecedentes: false,
    motivo: false,
    habitos: false,
    medicamentos: false,
    objetivo: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section as keyof typeof prev]: !prev[section as keyof typeof prev]
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validar TODOS los campos obligatorios
    const errors: string[] = [];
    
    if (!formData.date?.trim()) errors.push('📅 Fecha de Consulta');
    if (!formData.medicalHistory?.trim()) errors.push('🏥 Antecedentes Médicos');
    if (!formData.surgicalHistory?.trim()) errors.push('🏥 Antecedentes Quirúrgicos');
    if (!formData.familyHistory?.trim()) errors.push('🏥 Antecedentes Familiares');
    if (!formData.pastDiseases?.trim()) errors.push('🏥 Enfermedades Pasadas');
    if (!formData.currentComplaints?.trim()) errors.push('🎯 Motivo de Consulta');
    if (!formData.dietaryHabits?.trim()) errors.push('🥗 Hábitos Dietéticos');
    if (!formData.physicalActivity?.trim()) errors.push('🥗 Actividad Física');
    if (!formData.alcoholConsumption?.trim()) errors.push('🥗 Consumo de Alcohol');
    if (!formData.tobaccoUse?.trim()) errors.push('🥗 Uso de Tabaco');
    if (!formData.medications?.trim()) errors.push('💉 Medicamentos Actuales');
    if (!formData.allergies?.trim()) errors.push('💉 Alergias Medicamentosas');
    if (!formData.foodIntolerances?.trim()) errors.push('💉 Intolerancias Alimentarias');
    if (!formData.nutritionalObjective?.trim()) errors.push('🎯 Objetivo Nutricional');
    if (!formData.dietaryRestrictions?.trim()) errors.push('🎯 Restricciones Dietéticas');
    
    if (errors.length > 0) {
      setValidationError(`⚠️ Campos obligatorios incompletos:\n${errors.join('\n')}`);
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
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg mb-4 overflow-hidden">
      {/* Header con Gradiente */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
        <div className="flex justify-between items-center">
          <h3 className="text-3xl font-bold text-white">📋 Historia Clínica Nutricional</h3>
          {initialData?.updatedAt && (
            <p className="text-xs text-blue-100">
              📅 {new Date(initialData.updatedAt).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Validación de Errores */}
        {validationError && <ValidationAlert isOpen={!!validationError} message={validationError} onClose={() => setValidationError('')} />}
      
        {/* Fecha */}
        <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-500">
          <label className="block text-sm font-bold text-blue-900 mb-3">📅 Fecha de Consulta</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
        </div>

      {/* ANTECEDENTES */}
      <div className="mb-8 p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-600 hover:shadow-md transition">
        <button
          type="button"
          onClick={() => toggleSection('antecedentes')}
          className="w-full text-left flex items-center justify-between hover:opacity-80 transition"
        >
          <h4 className="text-lg font-bold text-blue-900 flex items-center">
            <span className="text-2xl mr-2">🏥</span> I. ANTECEDENTES
          </h4>
          <span className={`text-2xl transition-transform ${expandedSections.antecedentes ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {expandedSections.antecedentes && (
          <div className="mt-5 space-y-5">
            <div>
              <label className="block text-sm font-bold text-blue-800 mb-2">Antecedentes Médicos</label>
              <textarea
                name="medicalHistory"
                placeholder="Enfermedades crónicas, diabetes, hipertensión, etc."
                value={formData.medicalHistory}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-blue-800 mb-2">Antecedentes Quirúrgicos</label>
              <textarea
                name="surgicalHistory"
                placeholder="Cirugías realizadas y fechas"
                value={formData.surgicalHistory}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-blue-800 mb-2">Antecedentes Familiares</label>
              <textarea
                name="familyHistory"
                placeholder="Enfermedades en la familia (diabetes, obesidad, cardiopatía, etc.)"
                value={formData.familyHistory}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-blue-800 mb-2">Enfermedades Pasadas</label>
              <textarea
                name="pastDiseases"
                placeholder="Enfermedades previas ya superadas"
                value={formData.pastDiseases}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                rows={2}
              />
            </div>
          </div>
        )}
      </div>

      {/* MOTIVO DE CONSULTA */}
      <div className="mb-8 p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-l-4 border-green-600 hover:shadow-md transition">
        <button
          type="button"
          onClick={() => toggleSection('motivo')}
          className="w-full text-left flex items-center justify-between hover:opacity-80 transition"
        >
          <h4 className="text-lg font-bold text-green-900 flex items-center">
            <span className="text-2xl mr-2">🎯</span> II. MOTIVO DE CONSULTA
          </h4>
          <span className={`text-2xl transition-transform ${expandedSections.motivo ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {expandedSections.motivo && (
          <div className="mt-5">
            <textarea
              name="currentComplaints"
              placeholder="Razón principal de la consulta nutricional"
              value={formData.currentComplaints}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
              rows={3}
            />
          </div>
        )}
      </div>

      {/* HÁBITOS */}
      <div className="mb-8 p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border-l-4 border-yellow-600 hover:shadow-md transition">
        <button
          type="button"
          onClick={() => toggleSection('habitos')}
          className="w-full text-left flex items-center justify-between hover:opacity-80 transition"
        >
          <h4 className="text-lg font-bold text-yellow-900 flex items-center">
            <span className="text-2xl mr-2">🥗</span> III. HÁBITOS
          </h4>
          <span className={`text-2xl transition-transform ${expandedSections.habitos ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        
        {expandedSections.habitos && (
          <div className="mt-5 space-y-5">
            <div>
              <label className="block text-sm font-bold text-yellow-800 mb-2">Hábitos Dietéticos</label>
              <textarea
                name="dietaryHabits"
                placeholder="Descripción de su alimentación actual, frecuencia de comidas, etc."
                value={formData.dietaryHabits}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-yellow-800 mb-2">Actividad Física</label>
              <textarea
                name="physicalActivity"
                placeholder="Tipo, frecuencia y duración del ejercicio"
                value={formData.physicalActivity}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-yellow-800 mb-2">🍷 Alcohol</label>
                <input
                  type="text"
                  name="alcoholConsumption"
                  placeholder="Nunca / Ocasional / Frecuente"
                  value={formData.alcoholConsumption}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-yellow-800 mb-2">🚭 Tabaco</label>
                <input
                  type="text"
                  name="tobaccoUse"
                  placeholder="No fuma / Fuma / Ex-fumador"
                  value={formData.tobaccoUse}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MEDICAMENTOS Y ALERGIAS */}
      <div className="mb-8 p-5 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-l-4 border-red-600 hover:shadow-md transition">
        <button
          type="button"
          onClick={() => toggleSection('medicamentos')}
          className="w-full text-left flex items-center justify-between hover:opacity-80 transition"
        >
          <h4 className="text-lg font-bold text-red-900 flex items-center">
            <span className="text-2xl mr-2">💊</span> IV. MEDICAMENTOS Y ALERGIAS
          </h4>
          <span className={`text-2xl transition-transform ${expandedSections.medicamentos ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        
        {expandedSections.medicamentos && (
          <div className="mt-5 space-y-5">
            <div>
              <label className="block text-sm font-bold text-red-800 mb-2">💉 Medicamentos Actuales</label>
              <textarea
                name="medications"
                placeholder="Nombre del fármaco, dosis, frecuencia (separados por comas)"
                value={formData.medications}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-red-800 mb-2">⚠️ Alergias Medicamentosas</label>
              <input
                type="text"
                name="allergies"
                placeholder="Alergias a medicamentos (separadas por comas)"
                value={formData.allergies}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-red-800 mb-2">🍽️ Intolerancias Alimentarias</label>
              <input
                type="text"
                name="foodIntolerances"
                placeholder="Alimentos que no tolera (lactosa, gluten, etc.)"
                value={formData.foodIntolerances}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* OBJETIVO NUTRICIONAL */}
      <div className="mb-8 p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-600 hover:shadow-md transition">
        <button
          type="button"
          onClick={() => toggleSection('objetivo')}
          className="w-full text-left flex items-center justify-between hover:opacity-80 transition"
        >
          <h4 className="text-lg font-bold text-purple-900 flex items-center">
            <span className="text-2xl mr-2">🎯</span> V. OBJETIVO NUTRICIONAL
          </h4>
          <span className={`text-2xl transition-transform ${expandedSections.objetivo ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        
        {expandedSections.objetivo && (
          <div className="mt-5 space-y-5">
            <div>
              <label className="block text-sm font-bold text-purple-800 mb-2">Objetivo Principal</label>
              <textarea
                name="nutritionalObjective"
                placeholder="¿Qué espera lograr con la asesoría nutricional?"
                value={formData.nutritionalObjective}
                required
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-purple-800 mb-2">🚫 Restricciones Dietéticas</label>
              <textarea
                name="dietaryRestrictions"
                placeholder="Razones religiosas, culturales, preferencias personales, etc."
                value={formData.dietaryRestrictions}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                rows={2}
              />
            </div>
          </div>
        )}
      </div>
      </div>

      <button type="submit" className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-900 text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105">
        ✅ Guardar Historia Clínica
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
      />
    </form>
  );
};