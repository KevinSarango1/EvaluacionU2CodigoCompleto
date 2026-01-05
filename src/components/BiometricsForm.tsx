import React, { useState } from 'react';
import { Biometrics } from '../types/patient';
import { ConfirmDialog } from './ConfirmDialog';
import { ValidationAlert } from './ValidationAlert';

interface BiometricsFormProps {
  onSubmit: (biometrics: Biometrics) => void;
}

export const BiometricsForm: React.FC<BiometricsFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Biometrics>({
    glucose: 0,
    totalCholesterol: 0,
    ldl: 0,
    hdl: 0,
    triglycerides: 0,
    hemoglobin: 0,
    testDate: new Date().toISOString().split('T')[0],
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, testDate: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obligatorios
    const missingFields = [];
    if (!formData.testDate) missingFields.push('Fecha del Examen');
    if (formData.glucose <= 0) missingFields.push('Glucosa (mg/dL)');
    if (formData.totalCholesterol <= 0) missingFields.push('Colesterol Total (mg/dL)');

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
      <h3 className="text-2xl font-bold mb-6 text-blue-700">Datos Bioquímicos</h3>
      
      {/* Fecha */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
        <label className="block text-sm font-semibold mb-2">Fecha del Examen</label>
        <input
          type="date"
          value={formData.testDate}
          onChange={handleDateChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Metabolismo de Carbohidratos */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
        <h4 className="font-bold text-yellow-700 mb-4">I. Metabolismo de Carbohidratos</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Glucosa (mg/dL)</label>
            <input
              type="number"
              name="glucose"
              value={formData.glucose}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">HbA1c (%)</label>
            <input
              type="number"
              name="hba1c"
              value={formData.hba1c || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Perfil Lipídico */}
      <div className="mb-6 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
        <h4 className="font-bold text-red-700 mb-4">II. Perfil Lipídico</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Colesterol Total (mg/dL)</label>
            <input
              type="number"
              name="totalCholesterol"
              value={formData.totalCholesterol}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">LDL (mg/dL)</label>
            <input
              type="number"
              name="ldl"
              value={formData.ldl}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">HDL (mg/dL)</label>
            <input
              type="number"
              name="hdl"
              value={formData.hdl}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Triglicéridos (mg/dL)</label>
            <input
              type="number"
              name="triglycerides"
              value={formData.triglycerides}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">VLDL (mg/dL)</label>
            <input
              type="number"
              name="vldl"
              value={formData.vldl || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Función Hepática */}
      <div className="mb-6 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
        <h4 className="font-bold text-orange-700 mb-4">III. Función Hepática</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">AST (U/L)</label>
            <input
              type="number"
              name="ast"
              value={formData.ast || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">ALT (U/L)</label>
            <input
              type="number"
              name="alt"
              value={formData.alt || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">GGT (U/L)</label>
            <input
              type="number"
              name="ggt"
              value={formData.ggt || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Bilirrubina (mg/dL)</label>
            <input
              type="number"
              name="bilirubin"
              value={formData.bilirubin || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Función Renal */}
      <div className="mb-6 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
        <h4 className="font-bold text-purple-700 mb-4">IV. Función Renal</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Creatinina (mg/dL)</label>
            <input
              type="number"
              name="creatinine"
              value={formData.creatinine || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">BUN (mg/dL)</label>
            <input
              type="number"
              name="bun"
              value={formData.bun || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Proteínas */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
        <h4 className="font-bold text-green-700 mb-4">V. Proteínas Séricas</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Proteína Total (g/dL)</label>
            <input
              type="number"
              name="totalProteins"
              value={formData.totalProteins || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Albúmina (g/dL)</label>
            <input
              type="number"
              name="albumin"
              value={formData.albumin || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Prealbúmina (mg/dL)</label>
            <input
              type="number"
              name="prealbumin"
              value={formData.prealbumin || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Hemograma */}
      <div className="mb-6 p-4 bg-pink-50 rounded-lg border-l-4 border-pink-500">
        <h4 className="font-bold text-pink-700 mb-4">VI. Hemograma</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Hemoglobina (g/dL)</label>
            <input
              type="number"
              name="hemoglobin"
              value={formData.hemoglobin}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Hematocrito (%)</label>
            <input
              type="number"
              name="hematocrit"
              value={formData.hematocrit || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Glóbulos Blancos (x10³/μL)</label>
            <input
              type="number"
              name="wbc"
              value={formData.wbc || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Plaquetas (x10³/μL)</label>
            <input
              type="number"
              name="platelets"
              value={formData.platelets || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Micronutrientes */}
      <div className="mb-6 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
        <h4 className="font-bold text-indigo-700 mb-4">VII. Micronutrientes</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Vitamina B12 (pg/mL)</label>
            <input
              type="number"
              name="vitaminB12"
              value={formData.vitaminB12 || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Ácido Fólico (ng/mL)</label>
            <input
              type="number"
              name="folacin"
              value={formData.folacin || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Hierro (μg/dL)</label>
            <input
              type="number"
              name="iron"
              value={formData.iron || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Ferritina (ng/mL)</label>
            <input
              type="number"
              name="ferritin"
              value={formData.ferritin || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Zinc (μg/dL)</label>
            <input
              type="number"
              name="zinc"
              value={formData.zinc || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Calcio (mg/dL)</label>
            <input
              type="number"
              name="calcium"
              value={formData.calcium || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Magnesio (mg/dL)</label>
            <input
              type="number"
              name="magnesium"
              value={formData.magnesium || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Fósforo (mg/dL)</label>
            <input
              type="number"
              name="phosphorus"
              value={formData.phosphorus || ''}
              onChange={handleChange}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      <button type="submit" className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg transition">
        Guardar Datos Bioquímicos
      </button>

      <ConfirmDialog
        isOpen={showConfirm}
        title="¿Estás seguro/a?"
        message="¿Deseas guardar estos datos bioquímicos?"
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
