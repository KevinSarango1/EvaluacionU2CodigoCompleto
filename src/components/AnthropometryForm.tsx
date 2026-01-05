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
    waistCircumference: 0,
    hipCircumference: 0,
    bodyFatPercentage: 0,
    measurementDate: new Date().toISOString().split('T')[0],
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obligatorios
    const missingFields = [];
    if (!formData.measurementDate) missingFields.push('Fecha de Medición');
    if (formData.weight <= 0) missingFields.push('Peso (kg)');
    if (formData.height <= 0) missingFields.push('Altura (cm)');

    if (missingFields.length > 0) {
      setValidationError(`Campos obligatorios incompletos: ${missingFields.join(', ')}`);
      return;
    }
    
    setShowConfirm(true);
  };

  const handleConfirmSubmit = () => {
    onSubmit(formData);
    setShowConfirm(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow mb-4">
      <h3 className="text-2xl font-bold mb-6 text-blue-700">Antropometría</h3>

      {/* Fecha */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
        <label className="block text-sm font-semibold mb-2">Fecha de Medición</label>
        <input
          type="date"
          value={formData.measurementDate}
          onChange={handleDateChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Medidas Básicas */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
        <h4 className="font-bold text-green-700 mb-4">I. Medidas Básicas</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Peso (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              step="0.1"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Altura (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              step="0.1"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="p-4 bg-white border-2 border-green-300 rounded-lg">
            <p className="text-sm text-gray-600 font-semibold">IMC (auto-calculado)</p>
            <p className="text-2xl font-bold text-green-700">{formData.bmi.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {formData.bmi < 18.5 ? 'Bajo peso' : formData.bmi < 25 ? 'Normal' : formData.bmi < 30 ? 'Sobrepeso' : 'Obesidad'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">% Grasa Corporal</label>
            <input
              type="number"
              name="bodyFatPercentage"
              value={formData.bodyFatPercentage}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Circunferencias */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
        <h4 className="font-bold text-yellow-700 mb-4">II. Circunferencias</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Cintura (cm)</label>
            <input
              type="number"
              name="waistCircumference"
              value={formData.waistCircumference}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Cadera (cm)</label>
            <input
              type="number"
              name="hipCircumference"
              value={formData.hipCircumference}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="p-4 bg-white border-2 border-yellow-300 rounded-lg">
            <p className="text-sm text-gray-600 font-semibold">Razón Cintura/Cadera</p>
            <p className="text-2xl font-bold text-yellow-700">{formData.waistHipRatio?.toFixed(2) || '0.00'}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Brazo (cm)</label>
            <input
              type="number"
              name="armCircumference"
              value={formData.armCircumference || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Muslo (cm)</label>
            <input
              type="number"
              name="thighCircumference"
              value={formData.thighCircumference || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Pliegues Cutáneos */}
      <div className="mb-6 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
        <h4 className="font-bold text-red-700 mb-4">III. Pliegues Cutáneos (mm)</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Tríceps</label>
            <input
              type="number"
              name="tricepsSkinfold"
              value={formData.tricepsSkinfold || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Bíceps</label>
            <input
              type="number"
              name="bicepsSkinfold"
              value={formData.bicepsSkinfold || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Subescapular</label>
            <input
              type="number"
              name="subscapularSkinfold"
              value={formData.subscapularSkinfold || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Suprailíaco</label>
            <input
              type="number"
              name="suprailiacSkinfold"
              value={formData.suprailiacSkinfold || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Composición Corporal */}
      <div className="mb-6 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
        <h4 className="font-bold text-purple-700 mb-4">IV. Composición Corporal</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Masa Muscular (kg)</label>
            <input
              type="number"
              name="muscleMass"
              value={formData.muscleMass || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Masa Ósea (kg)</label>
            <input
              type="number"
              name="boneMass"
              value={formData.boneMass || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">% Agua Corporal</label>
            <input
              type="number"
              name="waterPercentage"
              value={formData.waterPercentage || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      <button type="submit" className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg transition">
        Guardar Antropometría
      </button>

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
