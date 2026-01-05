import React, { useState } from 'react';
import { WeeklyMenu } from '../types/patient';
import { ConfirmDialog } from './ConfirmDialog';
import { SuccessAlert } from './SuccessAlert';

interface WeeklyMenuFormProps {
  onSubmit: (menu: WeeklyMenu) => void;
  weeklyMenu?: WeeklyMenu;
  patientId: string;
}

export const WeeklyMenuForm: React.FC<WeeklyMenuFormProps> = ({ onSubmit, weeklyMenu, patientId }) => {
  const [formData, setFormData] = useState<WeeklyMenu>({
    id: weeklyMenu?.id,
    patientId,
    weekStartDate: weeklyMenu?.weekStartDate || new Date().toISOString().split('T')[0],
    monday: weeklyMenu?.monday || '',
    tuesday: weeklyMenu?.tuesday || '',
    wednesday: weeklyMenu?.wednesday || '',
    thursday: weeklyMenu?.thursday || '',
    friday: weeklyMenu?.friday || '',
    saturday: weeklyMenu?.saturday || '',
    sunday: weeklyMenu?.sunday || '',
    observations: weeklyMenu?.observations || '',
    createdAt: weeklyMenu?.createdAt,
    updatedAt: weeklyMenu?.updatedAt,
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmSubmit = () => {
    onSubmit({
      ...formData,
      updatedAt: new Date().toISOString(),
    });
    setShowConfirm(false);
    setShowSuccess(true);
  };

  const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-2xl font-bold mb-4">Asignar Menú Semanal</h3>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Inicio de la Semana:</label>
        <input
          type="date"
          name="weekStartDate"
          value={formData.weekStartDate}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {dayNames.map((dayName, index) => (
          <div key={dayName}>
            <label className="block text-gray-700 font-bold mb-2">{dayLabels[index]}:</label>
            <textarea
              name={dayName}
              value={formData[dayName as keyof WeeklyMenu] as string || ''}
              onChange={handleChange}
              placeholder={`Menú para ${dayLabels[index]}`}
              rows={3}
              className="w-full p-2 border rounded text-sm"
            />
          </div>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Observaciones:</label>
        <textarea
          name="observations"
          value={formData.observations}
          onChange={handleChange}
          placeholder="Observaciones o restricciones especiales"
          rows={4}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Guardar Menú Semanal
      </button>

      <ConfirmDialog
        isOpen={showConfirm}
        title="¿Estás seguro/a?"
        message="¿Deseas guardar este menú semanal para el paciente?"
        confirmText="Guardar"
        cancelText="Cancelar"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirm(false)}
      />

      <SuccessAlert
        isOpen={showSuccess}
        title="Menú Semanal Guardado"
        message="El menú semanal ha sido asignado exitosamente al paciente"
        onClose={() => setShowSuccess(false)}
      />
    </form>
  );
};
