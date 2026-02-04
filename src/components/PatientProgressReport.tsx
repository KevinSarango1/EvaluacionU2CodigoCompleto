import React, { useState } from 'react';
import { Patient } from '../types/patient';

interface PatientProgressReportProps {
  patient: Patient;
}

export const PatientProgressReport: React.FC<PatientProgressReportProps> = ({ patient }) => {
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'fat' | 'muscle'>('weight');

  // Datos reales del paciente
  const hasData = patient.clinicalHistory && 
                  patient.clinicalHistory.anthropometry && 
                  patient.clinicalHistory.anthropometry.weight &&
                  patient.clinicalHistory.anthropometry.bodyFatPercentage;

  // Si no hay datos, mostrar mensaje
  if (!hasData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">📊 Informe de Progreso</h1>
          <p className="text-slate-600">Seguimiento detallado del progreso nutricional</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Sin datos disponibles</h2>
          <p className="text-slate-600 mb-6">Este paciente aún no tiene registro de mediciones antropométricas o bioquímicas.</p>
          <p className="text-sm text-slate-500">Por favor completa el formulario de Historia Clínica con los datos bioquímicos y antropométricos para ver el progreso.</p>
        </div>
      </div>
    );
  }

  // Construir datos de progreso (actualmente solo una medición)
  const progressData = [
    {
      date: patient.clinicalHistory!.anthropometry!.measurementDate,
      weight: patient.clinicalHistory!.anthropometry!.weight,
      fat: patient.clinicalHistory!.anthropometry!.bodyFatPercentage,
      muscle: patient.clinicalHistory!.anthropometry!.muscleMass || 0,
    },
  ];

  const lastMeasurement = progressData[progressData.length - 1];
  const firstMeasurement = progressData[0];

  const weightChange = (lastMeasurement.weight - firstMeasurement.weight).toFixed(1);
  const fatChange = (lastMeasurement.fat - firstMeasurement.fat).toFixed(1);
  const muscleChange = (lastMeasurement.muscle - firstMeasurement.muscle).toFixed(1);

  const getGraphPoints = (metric: 'weight' | 'fat' | 'muscle') => {
    const values = progressData.map(d => d[metric]);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    // Si solo hay una medición, mostrar el punto en el centro
    if (values.length === 1) {
      return [{ x: 50, y: 50, value: values[0] }];
    }

    return values.map((val, idx) => {
      const x = (idx / (values.length - 1)) * 100;
      const y = 100 - ((val - min) / range) * 80 - 10;
      return { x, y, value: val };
    });
  };

  const points = getGraphPoints(selectedMetric);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">📊 Informe de Progreso</h1>
        <p className="text-slate-600">Seguimiento detallado del progreso nutricional</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ficha Técnica */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header con gradiente cyan */}
            <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 px-6 py-8 text-center">
              <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
                <span className="text-5xl">👤</span>
              </div>
              <h2 className="text-white font-bold text-lg">FICHA TÉCNICA</h2>
            </div>

            {/* Datos del paciente */}
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Nombre</label>
                <p className="text-lg font-bold text-slate-800">{patient.firstName} {patient.lastName}</p>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="text-sm font-bold text-cyan-600 mb-3 uppercase">Última Cita</h3>
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">📅 Fecha:</span>
                    <span className="font-bold text-slate-800">{lastMeasurement.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">⚖️ Peso:</span>
                    <span className="font-bold text-slate-800">{lastMeasurement.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">💪 Grasa:</span>
                    <span className="font-bold text-slate-800">{lastMeasurement.fat}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">🏋️ Músculo:</span>
                    <span className="font-bold text-slate-800">{lastMeasurement.muscle}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selector de métrica */}
          <div className="flex gap-3 bg-white rounded-xl p-4 shadow-md">
            <button
              onClick={() => setSelectedMetric('weight')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                selectedMetric === 'weight'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ⚖️ Peso
            </button>
            <button
              onClick={() => setSelectedMetric('fat')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                selectedMetric === 'fat'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              💾 Grasa
            </button>
            <button
              onClick={() => setSelectedMetric('muscle')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                selectedMetric === 'muscle'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              💪 Músculo
            </button>
          </div>

          {/* Gráfico de evolución */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {selectedMetric === 'weight' ? '⚖️ Evolución de Peso' : 
                   selectedMetric === 'fat' ? '💾 Evolución de Grasa' : 
                   '💪 Evolución de Músculo'}
                </h3>
                <p className="text-sm text-slate-500">
                  {progressData.length === 1 ? 'Una medición registrada' : `${progressData.length} mediciones registradas`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-slate-800">
                  {lastMeasurement[selectedMetric]}{selectedMetric === 'weight' ? ' kg' : '%'}
                </p>
                <p className={`text-sm font-semibold ${
                  selectedMetric === 'weight' || selectedMetric === 'fat'
                    ? (parseFloat(selectedMetric === 'weight' ? weightChange : fatChange) < 0 ? 'text-green-600' : 'text-red-600')
                    : (parseFloat(muscleChange) > 0 ? 'text-green-600' : 'text-red-600')
                }`}>
                  {selectedMetric === 'weight' ? weightChange : 
                   selectedMetric === 'fat' ? fatChange : 
                   (parseFloat(muscleChange) > 0 ? '+' : '')}{selectedMetric === 'weight' ? ' kg' : '%'}
                </p>
              </div>
            </div>

            {/* SVG Gráfico */}
            <svg className="w-full h-64 mb-4" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {/* Grid background */}
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{stopColor: selectedMetric === 'weight' ? '#3b82f6' : selectedMetric === 'fat' ? '#f97316' : '#22c55e', stopOpacity: 0.3}} />
                  <stop offset="100%" style={{stopColor: selectedMetric === 'weight' ? '#3b82f6' : selectedMetric === 'fat' ? '#f97316' : '#22c55e', stopOpacity: 0}} />
                </linearGradient>
              </defs>

              {/* Líneas horizontales */}
              {[0, 25, 50, 75, 100].map((y) => (
                <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#e2e8f0" strokeWidth="0.5" />
              ))}

              {/* Área bajo la curva */}
              <polygon
                points={`${points.map(p => `${p.x},${p.y}`).join(' ')} 100,100 0,100`}
                fill="url(#areaGradient)"
              />

              {/* Línea del gráfico */}
              <polyline
                points={points.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke={selectedMetric === 'weight' ? '#3b82f6' : selectedMetric === 'fat' ? '#f97316' : '#22c55e'}
                strokeWidth="2"
              />

              {/* Puntos de datos */}
              {points.map((p, idx) => (
                <circle
                  key={idx}
                  cx={p.x}
                  cy={p.y}
                  r="1.5"
                  fill={selectedMetric === 'weight' ? '#3b82f6' : selectedMetric === 'fat' ? '#f97316' : '#22c55e'}
                />
              ))}
            </svg>

            {/* Fechas */}
            <div className="flex justify-between text-xs text-slate-500 font-semibold">
              {progressData.map((d, idx) => (
                <span key={idx}>{d.date.split('/').slice(0, 2).join('/')}</span>
              ))}
            </div>
          </div>

          {/* Resumen General */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Peso */}
            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
              <p className="text-slate-600 text-sm font-semibold mb-2">⚖️ PESO</p>
              <p className="text-3xl font-bold text-slate-800">{lastMeasurement.weight}</p>
              <p className="text-xs text-slate-500 mt-1">kg</p>
              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-xs text-green-600 font-bold">
                  {parseFloat(weightChange) < 0 ? '↓' : '↑'} {Math.abs(parseFloat(weightChange))} kg desde inicio
                </p>
              </div>
            </div>

            {/* Grasa */}
            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-orange-500">
              <p className="text-slate-600 text-sm font-semibold mb-2">💾 GRASA</p>
              <p className="text-3xl font-bold text-slate-800">{lastMeasurement.fat}</p>
              <p className="text-xs text-slate-500 mt-1">%</p>
              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-xs text-green-600 font-bold">
                  {parseFloat(fatChange) < 0 ? '↓' : '↑'} {Math.abs(parseFloat(fatChange))}% desde inicio
                </p>
              </div>
            </div>

            {/* Músculo */}
            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
              <p className="text-slate-600 text-sm font-semibold mb-2">💪 MÚSCULO</p>
              <p className="text-3xl font-bold text-slate-800">{lastMeasurement.muscle}</p>
              <p className="text-xs text-slate-500 mt-1">%</p>
              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-xs text-green-600 font-bold">
                  {parseFloat(muscleChange) > 0 ? '↑' : '↓'} {Math.abs(parseFloat(muscleChange))}% desde inicio
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen General */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logros */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
          <h3 className="text-lg font-bold text-green-900 mb-4">✅ Logros</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="font-semibold text-green-900">Pérdida de peso consistente</p>
                <p className="text-sm text-green-700">{Math.abs(parseFloat(weightChange))} kg reducido</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">💪</span>
              <div>
                <p className="font-semibold text-green-900">Ganancia de masa muscular</p>
                <p className="text-sm text-green-700">+{parseFloat(muscleChange)}% de músculo</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📉</span>
              <div>
                <p className="font-semibold text-green-900">Reducción de grasa corporal</p>
                <p className="text-sm text-green-700">{Math.abs(parseFloat(fatChange))}% de grasa eliminada</p>
              </div>
            </div>
          </div>
        </div>

        {/* Próximos pasos */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-4">🎯 Próximos Objetivos</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-blue-900">Peso ideal</p>
                <p className="text-sm text-blue-700">80 kg</p>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: `${(lastMeasurement.weight / 80) * 100}%`}}></div>
              </div>
              <p className="text-xs text-blue-700 mt-1">{((lastMeasurement.weight / 80) * 100).toFixed(0)}% completado</p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-blue-900">Grasa corporal</p>
                <p className="text-sm text-blue-700">25%</p>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: `${(lastMeasurement.fat / 30) * 100}%`}}></div>
              </div>
              <p className="text-xs text-blue-700 mt-1">{((lastMeasurement.fat / 30) * 100).toFixed(0)}% completado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
