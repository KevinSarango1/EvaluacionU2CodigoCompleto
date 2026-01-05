import React from 'react';
import { Anthropometry } from '../types/patient';

interface AnthropometryDisplayProps {
  anthropometry: Anthropometry;
  gender?: string;
}

export const AnthropometryDisplay: React.FC<AnthropometryDisplayProps> = ({ anthropometry }) => {
  if (!anthropometry || !anthropometry.measurementDate) {
    return <p className="text-gray-600">Sin información de antropometría</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h4 className="font-bold mb-4">Últimas Medidas (Fecha: {anthropometry.measurementDate})</h4>
      <div className="grid grid-cols-2 gap-4">
        <p>Peso: <span className="font-bold">{anthropometry.weight} kg</span></p>
        <p>Altura: <span className="font-bold">{anthropometry.height} cm</span></p>
        <p>IMC: <span className="font-bold">{anthropometry.bmi}</span></p>
        <p>Cintura: <span className="font-bold">{anthropometry.waistCircumference} cm</span></p>
        <p>Cadera: <span className="font-bold">{anthropometry.hipCircumference} cm</span></p>
        <p>% Grasa Corporal: <span className="font-bold">{anthropometry.bodyFatPercentage}%</span></p>
      </div>
    </div>
  );
};
