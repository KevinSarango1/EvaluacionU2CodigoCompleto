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
    hba1c: 0,
    insulin: 0,
    homaIndex: 0,
    totalCholesterol: 0,
    ldl: 0,
    hdl: 0,
    triglycerides: 0,
    vldl: 0,
    ast: 0,
    alt: 0,
    ggt: 0,
    bilirubin: 0,
    creatinine: 0,
    bun: 0,
    urea: 0,
    sodium: 0,
    potassium: 0,
    chloride: 0,
    totalProteins: 0,
    albumin: 0,
    prealbumin: 0,
    hemoglobin: 0,
    hematocrit: 0,
    wbc: 0,
    platelets: 0,
    vitaminB12: 0,
    vitaminD: 0,
    folacin: 0,
    iron: 0,
    ferritin: 0,
    zinc: 0,
    calcium: 0,
    magnesium: 0,
    phosphorus: 0,
    testDate: new Date().toISOString().split('T')[0],
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState({
    carbohidratos: false,
    lipidos: false,
    hepatica: false,
    renal: false,
    proteinas: false,
    hemograma: false,
    micronutrientes: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section as keyof typeof prev]: !prev[section as keyof typeof prev]
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, testDate: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validar TODOS los campos obligatorios
    const errors: string[] = [];
    
    if (!formData.testDate?.trim()) errors.push('📅 Fecha del Examen');
    if (!formData.glucose || formData.glucose <= 0) errors.push('🍬 Glucosa (mg/dL)');
    if (!formData.hba1c || formData.hba1c <= 0) errors.push('🍬 HbA1c (%)');
    if (!formData.insulin || formData.insulin <= 0) errors.push('🍬 Insulina (mIU/L)');
    if (!formData.homaIndex || formData.homaIndex <= 0) errors.push('🍬 Índice HOMA');
    if (!formData.totalCholesterol || formData.totalCholesterol <= 0) errors.push('❤️ Colesterol Total (mg/dL)');
    if (!formData.ldl || formData.ldl <= 0) errors.push('❤️ LDL (mg/dL)');
    if (!formData.hdl || formData.hdl <= 0) errors.push('❤️ HDL (mg/dL)');
    if (!formData.triglycerides || formData.triglycerides <= 0) errors.push('❤️ Triglicéridos (mg/dL)');
    if (!formData.vldl || formData.vldl <= 0) errors.push('❤️ VLDL (mg/dL)');
    if (!formData.ast || formData.ast <= 0) errors.push('🏥 AST (U/L)');
    if (!formData.alt || formData.alt <= 0) errors.push('🏥 ALT (U/L)');
    if (!formData.ggt || formData.ggt <= 0) errors.push('🏥 GGT (U/L)');
    if (!formData.bilirubin || formData.bilirubin <= 0) errors.push('🏥 Bilirrubina (mg/dL)');
    if (!formData.creatinine || formData.creatinine <= 0) errors.push('🧬 Creatinina (mg/dL)');
    if (!formData.bun || formData.bun <= 0) errors.push('🧬 BUN (mg/dL)');
    if (!formData.urea || formData.urea <= 0) errors.push('🧬 Urea (mg/dL)');
    if (!formData.sodium || formData.sodium <= 0) errors.push('🧬 Sodio (mEq/L)');
    if (!formData.potassium || formData.potassium <= 0) errors.push('🧬 Potasio (mEq/L)');
    if (!formData.chloride || formData.chloride <= 0) errors.push('🧬 Cloro (mEq/L)');
    if (!formData.totalProteins || formData.totalProteins <= 0) errors.push('🧬 Proteína Total (g/dL)');
    if (!formData.albumin || formData.albumin <= 0) errors.push('🧬 Albúmina (g/dL)');
    if (!formData.prealbumin || formData.prealbumin <= 0) errors.push('🧬 Prealbúmina (mg/dL)');
    if (!formData.hemoglobin || formData.hemoglobin <= 0) errors.push('🔴 Hemoglobina (g/dL)');
    if (!formData.hematocrit || formData.hematocrit <= 0) errors.push('🔴 Hematocrito (%)');
    if (!formData.wbc || formData.wbc <= 0) errors.push('🔴 Glóbulos Blancos (x10³/μL)');
    if (!formData.platelets || formData.platelets <= 0) errors.push('🔴 Plaquetas (x10³/μL)');
    if (!formData.vitaminB12 || formData.vitaminB12 <= 0) errors.push('💊 Vitamina B12 (pg/mL)');
    if (!formData.vitaminD || formData.vitaminD <= 0) errors.push('💊 Vitamina D (ng/mL)');
    if (!formData.folacin || formData.folacin <= 0) errors.push('💊 Ácido Fólico (ng/mL)');
    if (!formData.iron || formData.iron <= 0) errors.push('💊 Hierro (μg/dL)');
    if (!formData.ferritin || formData.ferritin <= 0) errors.push('💊 Ferritina (ng/mL)');
    if (!formData.zinc || formData.zinc <= 0) errors.push('💊 Zinc (μg/dL)');
    if (!formData.calcium || formData.calcium <= 0) errors.push('💊 Calcio (mg/dL)');
    if (!formData.magnesium || formData.magnesium <= 0) errors.push('💊 Magnesio (mg/dL)');
    if (!formData.phosphorus || formData.phosphorus <= 0) errors.push('💊 Fósforo (mg/dL)');
    
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
      <div className="bg-gradient-to-r from-red-600 to-red-800 px-6 py-4">
        <h3 className="text-3xl font-bold text-white">🩸 Datos Bioquímicos</h3>
      </div>

      <div className="p-6">
        {validationError && <ValidationAlert isOpen={!!validationError} message={validationError} onClose={() => setValidationError('')} />}
      
        {/* Fecha */}
        <div className="mb-8 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border-l-4 border-red-500">
          <label className="block text-sm font-bold text-red-900 mb-3">📅 Fecha del Examen</label>
          <input
            type="date"
            value={formData.testDate}
            onChange={handleDateChange}
            required
            className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
          />
        </div>

        {/* Metabolismo de Carbohidratos */}
        <div className="mb-8 p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border-l-4 border-yellow-600 hover:shadow-md transition">
          <button
            type="button"
            onClick={() => toggleSection('carbohidratos')}
            className="w-full text-left flex items-center justify-between hover:opacity-80 transition"
          >
            <h4 className="text-lg font-bold text-yellow-900 flex items-center">
              <span className="text-2xl mr-2">🍬</span> I. Metabolismo de Carbohidratos
            </h4>
            <span className={`text-2xl transition-transform ${expandedSections.carbohidratos ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {expandedSections.carbohidratos && (
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-yellow-800 mb-2">Glucosa (mg/dL)</label>
                <input
                  type="number"
                  name="glucose"
                  value={formData.glucose}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-yellow-800 mb-2">HbA1c (%)</label>
                <input
                  type="number"
                  name="hba1c"
                  value={formData.hba1c || ''}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-yellow-800 mb-2">Insulina (mIU/L)</label>
                <input
                  type="number"
                  name="insulin"
                  value={formData.insulin || ''}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-yellow-800 mb-2">Índice HOMA</label>
                <input
                  type="number"
                  name="homaIndex"
                  value={formData.homaIndex || ''}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Perfil Lipídico */}
        <div className="mb-8 p-5 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-l-4 border-red-600 hover:shadow-md transition">
          <button
            type="button"
            onClick={() => toggleSection('lipidos')}
            className="w-full text-left flex items-center justify-between hover:opacity-80 transition"
          >
            <h4 className="text-lg font-bold text-red-900 flex items-center">
              <span className="text-2xl mr-2">❤️</span> II. Perfil Lipídico
            </h4>
            <span className={`text-2xl transition-transform ${expandedSections.lipidos ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {expandedSections.lipidos && (
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-red-800 mb-2">Colesterol Total (mg/dL)</label>
                <input
                  type="number"
                  name="totalCholesterol"
                  value={formData.totalCholesterol}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-red-800 mb-2">LDL (mg/dL)</label>
                <input
                  type="number"
                  name="ldl"
                  value={formData.ldl}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-red-800 mb-2">HDL (mg/dL)</label>
                <input
                  type="number"
                  name="hdl"
                  value={formData.hdl}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-red-800 mb-2">Triglicéridos (mg/dL)</label>
                <input
                  type="number"
                  name="triglycerides"
                  value={formData.triglycerides}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                  className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-red-800 mb-2">VLDL (mg/dL)</label>
                <input
                  type="number"
                  name="vldl"
                  value={formData.vldl || ''}
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

        {/* Función Hepática */}
        <div className="mb-8 p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-l-4 border-orange-600 hover:shadow-md transition">
          <button
            type="button"
            onClick={() => toggleSection('hepatica')}
            className="w-full text-left flex items-center justify-between hover:opacity-80 transition"
          >
            <h4 className="text-lg font-bold text-orange-900 flex items-center">
              <span className="text-2xl mr-2">🏥</span> III. Función Hepática
            </h4>
            <span className={`text-2xl transition-transform ${expandedSections.hepatica ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {expandedSections.hepatica && (
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-orange-800 mb-2">AST (U/L)</label>
                <input type="number" name="ast" value={formData.ast || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-orange-800 mb-2">ALT (U/L)</label>
                <input type="number" name="alt" value={formData.alt || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-orange-800 mb-2">GGT (U/L)</label>
                <input type="number" name="ggt" value={formData.ggt || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-orange-800 mb-2">Bilirrubina (mg/dL)</label>
                <input type="number" name="bilirubin" value={formData.bilirubin || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
            </div>
          )}
        </div>

        {/* Función Renal */}
        <div className="mb-8 p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-600 hover:shadow-md transition">
          <button
            type="button"
            onClick={() => toggleSection('renal')}
            className="w-full text-left flex items-center justify-between hover:opacity-80 transition"
          >
            <h4 className="text-lg font-bold text-purple-900 flex items-center">
              <span className="text-2xl mr-2">🧬</span> IV. Función Renal
            </h4>
            <span className={`text-2xl transition-transform ${expandedSections.renal ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {expandedSections.renal && (
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-purple-800 mb-2">Creatinina (mg/dL)</label>
                <input type="number" name="creatinine" value={formData.creatinine || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-purple-800 mb-2">BUN (mg/dL)</label>
                <input type="number" name="bun" value={formData.bun || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-purple-800 mb-2">Urea (mg/dL)</label>
                <input type="number" name="urea" value={formData.urea || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-purple-800 mb-2">Sodio (mEq/L)</label>
                <input type="number" name="sodium" value={formData.sodium || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-purple-800 mb-2">Potasio (mEq/L)</label>
                <input type="number" name="potassium" value={formData.potassium || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-purple-800 mb-2">Cloro (mEq/L)</label>
                <input type="number" name="chloride" value={formData.chloride || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
            </div>
          )}
        </div>

        {/* Proteínas */}
        <div className="mb-8 p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-l-4 border-green-600 hover:shadow-md transition">
          <button
            type="button"
            onClick={() => toggleSection('proteinas')}
            className="w-full text-left flex items-center justify-between hover:opacity-80 transition"
          >
            <h4 className="text-lg font-bold text-green-900 flex items-center">
              <span className="text-2xl mr-2">🧬</span> V. Proteínas Séricas
            </h4>
            <span className={`text-2xl transition-transform ${expandedSections.proteinas ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {expandedSections.proteinas && (
            <div className="mt-5 grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-green-800 mb-2">Proteína Total (g/dL)</label>
                <input type="number" name="totalProteins" value={formData.totalProteins || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-green-800 mb-2">Albúmina (g/dL)</label>
                <input type="number" name="albumin" value={formData.albumin || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-green-800 mb-2">Prealbúmina (mg/dL)</label>
                <input type="number" name="prealbumin" value={formData.prealbumin || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
            </div>
          )}
        </div>

        {/* Hemograma */}
        <div className="mb-8 p-5 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border-l-4 border-pink-600 hover:shadow-md transition">
          <button
            type="button"
            onClick={() => toggleSection('hemograma')}
            className="w-full text-left flex items-center justify-between hover:opacity-80 transition"
          >
            <h4 className="text-lg font-bold text-pink-900 flex items-center">
              <span className="text-2xl mr-2">🔴</span> VI. Hemograma
            </h4>
            <span className={`text-2xl transition-transform ${expandedSections.hemograma ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {expandedSections.hemograma && (
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-pink-800 mb-2">Hemoglobina (g/dL)</label>
                <input type="number" name="hemoglobin" value={formData.hemoglobin} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-pink-800 mb-2">Hematocrito (%)</label>
                <input type="number" name="hematocrit" value={formData.hematocrit || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-pink-800 mb-2">Glóbulos Blancos (x10³/μL)</label>
                <input type="number" name="wbc" value={formData.wbc || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-pink-800 mb-2">Plaquetas (x10³/μL)</label>
                <input type="number" name="platelets" value={formData.platelets || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
            </div>
          )}
        </div>

        {/* Micronutrientes */}
        <div className="mb-8 p-5 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border-l-4 border-indigo-600 hover:shadow-md transition">
          <button
            type="button"
            onClick={() => toggleSection('micronutrientes')}
            className="w-full text-left flex items-center justify-between hover:opacity-80 transition"
          >
            <h4 className="text-lg font-bold text-indigo-900 flex items-center">
              <span className="text-2xl mr-2">💊</span> VII. Micronutrientes
            </h4>
            <span className={`text-2xl transition-transform ${expandedSections.micronutrientes ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {expandedSections.micronutrientes && (
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-indigo-800 mb-2">Vitamina B12 (pg/mL)</label>
                <input type="number" name="vitaminB12" value={formData.vitaminB12 || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-indigo-800 mb-2">Vitamina D (ng/mL)</label>
                <input type="number" name="vitaminD" value={formData.vitaminD || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-indigo-800 mb-2">Ácido Fólico (ng/mL)</label>
                <input type="number" name="folacin" value={formData.folacin || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-indigo-800 mb-2">Hierro (μg/dL)</label>
                <input type="number" name="iron" value={formData.iron || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-indigo-800 mb-2">Ferritina (ng/mL)</label>
                <input type="number" name="ferritin" value={formData.ferritin || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-indigo-800 mb-2">Zinc (μg/dL)</label>
                <input type="number" name="zinc" value={formData.zinc || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-indigo-800 mb-2">Calcio (mg/dL)</label>
                <input type="number" name="calcium" value={formData.calcium || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-indigo-800 mb-2">Magnesio (mg/dL)</label>
                <input type="number" name="magnesium" value={formData.magnesium || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-indigo-800 mb-2">Fósforo (mg/dL)</label>
                <input type="number" name="phosphorus" value={formData.phosphorus || ''} onChange={handleChange} step="0.1" min="0" required className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition bg-white invalid:border-red-500 invalid:ring-red-500" />
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-900 text-lg shadow-lg hover:shadow-xl transition transform hover:scale-105">
          ✅ Guardar Datos Bioquímicos
        </button>
      </div>

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
      />
    </form>
  );
};
