import React from 'react';
import { Biometrics } from '../types/patient';

interface BiometricsDisplayProps {
  biometrics: Biometrics;
  gender?: string;
}

export const BiometricsDisplay: React.FC<BiometricsDisplayProps> = ({ biometrics }) => {
  if (!biometrics || !biometrics.testDate) {
    return <p className="text-gray-600">Sin información de datos bioquímicos</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h4 className="font-bold mb-4">Últimos Datos Bioquímicos (Fecha: {biometrics.testDate})</h4>
      <div className="grid grid-cols-2 gap-4">
        <p>Glucosa: <span className="font-bold">{biometrics.glucose} mg/dL</span></p>
        <p>Colesterol Total: <span className="font-bold">{biometrics.totalCholesterol} mg/dL</span></p>
        <p>LDL: <span className="font-bold">{biometrics.ldl} mg/dL</span></p>
        <p>HDL: <span className="font-bold">{biometrics.hdl} mg/dL</span></p>
        <p>Triglicéridos: <span className="font-bold">{biometrics.triglycerides} mg/dL</span></p>
        <p>Hemoglobina: <span className="font-bold">{biometrics.hemoglobin} g/dL</span></p>
      </div>
    </div>
  );
};
