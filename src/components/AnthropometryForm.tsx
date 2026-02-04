import React, { useState } from 'react';
import { Anthropometry } from '../types/patient';
import { ConfirmDialog } from './ConfirmDialog';
import { ValidationAlert } from './ValidationAlert';

interface AnthropometryFormProps {
  onSubmit: (anthropometry: Anthropometry) => void;
}

export const AnthropometryForm: React.FC<AnthropometryFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Anthropometry>({
    weight: 0,
    height: 0,
    bmi: 0,
    bodyFatPercentage: 0,
    waistCircumference: 0,
    hipCircumference: 0,
    waistHipRatio: 0,
    armCircumference: 0,
    thighCircumference: 0,
    calfCircumference: 0,
    tricepsSkinfold: 0,
    bicepsSkinfold: 0,
    subscapularSkinfold: 0,
    suprailiacSkinfold: 0,
    muscleMass: 0,
    boneMass: 0,
    waterPercentage: 0,
    measurementDate: new Date().toISOString().split('T')[0],
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState({
    medidas: false,
    circunferencias: false,
    pliegues: false,
    composicion: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section as keyof typeof prev]: !prev[section as keyof typeof prev]
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    const newData = { ...formData, [name]: numValue };

    // Calcular BMI automáticamente
    if (name === 'weight' || name === 'height') {
      const height = name === 'height' ? numValue : formData.height;
      const weight = name === 'weight' ? numValue : formData.weight;
      if (height > 0 && weight > 0) {
        const heightInMeters = height / 100;
        newData.bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
      }
    }

    // Calcular WHR automáticamente
    if (name === 'waistCircumference' || name === 'hipCircumference') {
      const waist = name === 'waistCircumference' ? numValue : formData.waistCircumference;
      const hip = name === 'hipCircumference' ? numValue : formData.hipCircumference;
      if (hip > 0) {
        newData.waistHipRatio = parseFloat((waist / hip).toFixed(2));
      }
    }

    setFormData(newData);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, measurementDate: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validar TODOS los campos obligatorios
    const errors: string[] = [];
    
    if (!formData.measurementDate?.trim()) errors.push('📅 Fecha de Medición');
    if (!formData.weight || formData.weight <= 0) errors.push('📏 Peso (kg)');
    if (!formData.height || formData.height <= 0) errors.push('📏 Altura (cm)');
    if (!formData.bodyFatPercentage || formData.bodyFatPercentage <= 0) errors.push('📏 % Grasa Corporal');
    if (!formData.waistCircumference || formData.waistCircumference <= 0) errors.push('📐 Cintura (cm)');
    if (!formData.hipCircumference || formData.hipCircumference <= 0) errors.push('📐 Cadera (cm)');
    if (!formData.armCircumference || formData.armCircumference <= 0) errors.push('📐 Brazo (cm)');
    if (!formData.thighCircumference || formData.thighCircumference <= 0) errors.push('📐 Muslo (cm)');
    if (!formData.calfCircumference || formData.calfCircumference <= 0) errors.push('📐 Pantorrilla (cm)');
    if (!formData.tricepsSkinfold || formData.tricepsSkinfold <= 0) errors.push('📏 Tríceps (mm)');
    if (!formData.bicepsSkinfold || formData.bicepsSkinfold <= 0) errors.push('📏 Bíceps (mm)');
    if (!formData.subscapularSkinfold || formData.subscapularSkinfold <= 0) errors.push('📏 Subescapular (mm)');
    if (!formData.suprailiacSkinfold || formData.suprailiacSkinfold <= 0) errors.push('📏 Suprailíaco (mm)');
    if (!formData.muscleMass || formData.muscleMass <= 0) errors.push('🧬 Masa Muscular (kg)');
    if (!formData.boneMass || formData.boneMass <= 0) errors.push('🧬 Masa Ósea (kg)');
    if (!formData.waterPercentage || formData.waterPercentage <= 0) errors.push('🧬 % Agua Corporal');
    
    if (errors.length > 0) {
      setValidationError(`⚠️ Campos obligatorios incompletos:\n${errors.join('\n')}`);
      return;
    }
    
    setShowConfirm(true);
  };

  const handleConfirmSubmit = () => {
    onSubmit(formData);
    setShowConfirm(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg mb-4 overflow-hidden">
      {/* Header con Gradiente */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 px-6 py-4">
        <h3 className="text-3xl font-bold text-white">📏 Antropometría</h3>
      </div>

      <div className="p-6">
        {validationError && <ValidationAlert isOpen={!!validationError} message={validationError} onClose={() => setValidationError('')} />}

        {/* Fecha */}
        <div className="mb-8 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-l-4 border-green-500">
          <label className="block text-sm font-bold text-green-900 mb-3">📅 Fecha de Medición</label>
          <input
            type="date"
            value={formData.measurementDate}
            onChange={handleDateChange}
            className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
          />
        </div>

        {/* Medidas Básicas */}
        <div className="mb-8 p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-l-4 border-green-600 hover:shadow-md transition">
          <button
            type="button"
            onClick={() => toggleSection('medidas')}
            className="w-full text-left flex items-center justify-between hover:opacity-80 transition"
          >
            <h4 className="text-lg font-bold text-green-900 flex items-center">
              <span className="text-2xl mr-2">📏</span> I. Medidas Básicas
            </h4>
            <span className={`text-2xl transition-transform ${expandedSections.medidas ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {expandedSections.medidas && (
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-green-800 mb-2">Peso (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-green-800 mb-2">Altura (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
              <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-400 rounded-lg">
                <p className="text-sm text-green-800 font-bold">📊 IMC (auto-calculado)</p>
                <p className="text-3xl font-bold text-green-700 mt-1">{formData.bmi.toFixed(2)}</p>
                <p className="text-xs text-green-700 mt-2 font-semibold">
                  {formData.bmi < 18.5 ? '⚠️ Bajo peso' : formData.bmi < 25 ? '✅ Normal' : formData.bmi < 30 ? '⚠️ Sobrepeso' : '🚨 Obesidad'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-green-800 mb-2">% Grasa Corporal</label>
                <input
                  type="number"
                  name="bodyFatPercentage"
                  value={formData.bodyFatPercentage}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Circunferencias */}
        <div className="mb-8 p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border-l-4 border-yellow-600 hover:shadow-md transition">
          <button
            type="button"
            onClick={() => toggleSection('circunferencias')}
            className="w-full text-left flex items-center justify-between hover:opacity-80 transition"
          >
            <h4 className="text-lg font-bold text-yellow-900 flex items-center">
              <span className="text-2xl mr-2">📐</span> II. Circunferencias
            </h4>
            <span className={`text-2xl transition-transform ${expandedSections.circunferencias ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {expandedSections.circunferencias && (
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-yellow-800 mb-2">Cintura (cm)</label>
                <input
                  type="number"
                  name="waistCircumference"
                  value={formData.waistCircumference}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-yellow-800 mb-2">Cadera (cm)</label>
                <input
                  type="number"
                  name="hipCircumference"
                  value={formData.hipCircumference}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
              <div className="p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400 rounded-lg">
                <p className="text-sm text-yellow-800 font-bold">📊 Razón Cintura/Cadera</p>
                <p className="text-3xl font-bold text-yellow-700 mt-1">{formData.waistHipRatio?.toFixed(2) || '0.00'}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-yellow-800 mb-2">Brazo (cm)</label>
                <input
                  type="number"
                  name="armCircumference"
                  value={formData.armCircumference}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-yellow-800 mb-2">Muslo (cm)</label>
                <input
                  type="number"
                  name="thighCircumference"
                  value={formData.thighCircumference}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-yellow-800 mb-2">Pantorrilla (cm)</label>
                <input
                  type="number"
                  name="calfCircumference"
                  value={formData.calfCircumference}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Pliegues Cutáneos */}
        <div className="mb-8 p-5 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-l-4 border-red-600 hover:shadow-md transition">
          <button
            type="button"
            onClick={() => toggleSection('pliegues')}
            className="w-full text-left flex items-center justify-between hover:opacity-80 transition"
          >
            <h4 className="text-lg font-bold text-red-900 flex items-center">
              <span className="text-2xl mr-2">📏</span> III. Pliegues Cutáneos (mm)
            </h4>
            <span className={`text-2xl transition-transform ${expandedSections.pliegues ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {expandedSections.pliegues && (
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-red-800 mb-2">Tríceps</label>
                <input
                  type="number"
                  name="tricepsSkinfold"
                  value={formData.tricepsSkinfold}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-red-800 mb-2">Bíceps</label>
                <input
                  type="number"
                  name="bicepsSkinfold"
                  value={formData.bicepsSkinfold}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-red-800 mb-2">Subescapular</label>
                <input
                  type="number"
                  name="subscapularSkinfold"
                  value={formData.subscapularSkinfold}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-red-800 mb-2">Suprailíaco</label>
                <input
                  type="number"
                  name="suprailiacSkinfold"
                  value={formData.suprailiacSkinfold}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Composición Corporal */}
        <div className="mb-8 p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-600 hover:shadow-md transition">
          <button
            type="button"
            onClick={() => toggleSection('composicion')}
            className="w-full text-left flex items-center justify-between hover:opacity-80 transition"
          >
            <h4 className="text-lg font-bold text-purple-900 flex items-center">
              <span className="text-2xl mr-2">🧬</span> IV. Composición Corporal
            </h4>
            <span className={`text-2xl transition-transform ${expandedSections.composicion ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {expandedSections.composicion && (
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-purple-800 mb-2">Masa Muscular (kg)</label>
                <input
                  type="number"
                  name="muscleMass"
                  value={formData.muscleMass}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-purple-800 mb-2">Masa Ósea (kg)</label>
                <input
                  type="number"
                  name="boneMass"
                  value={formData.boneMass}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-purple-800 mb-2">% Agua Corporal</label>
                <input
                  type="number"
                  name="waterPercentage"
                  value={formData.waterPercentage}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-green-600 to-green-800 text-white font-bold rounded-lg hover:from-green-700 hover:to-green-900 text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105">
          ✅ Guardar Antropometría
        </button>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="¿Estás seguro/a?"
        message="¿Deseas guardar estas medidas antropométricas?"
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
