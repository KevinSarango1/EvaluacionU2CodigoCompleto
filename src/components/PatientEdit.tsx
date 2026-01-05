import React, { useState, useEffect } from 'react';
import { Patient } from '../types/patient';
import { patientService } from '../services/patientService';
import { ConfirmDialog } from './ConfirmDialog';
import { SuccessAlert } from './SuccessAlert';

interface PatientEditProps {
  patientId: string;
  onPatientUpdated: (patient: Patient) => void;
  onCancel: () => void;
}

export const PatientEdit: React.FC<PatientEditProps> = ({ patientId, onPatientUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'M' as 'M' | 'F' | 'O',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const patient = patientService.getPatientById(patientId);
    if (patient) {
      setFormData({
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phone: patient.phone,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        password: patient.password || '',
      });
    }
    setLoading(false);
  }, [patientId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Validar que teléfono solo contenga números
    if (name === 'phone') {
      const phoneRegex = /^[0-9]*$/;
      if (!phoneRegex.test(value)) {
        return; // No actualizar si contiene caracteres no numéricos
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmUpdate = () => {
    const updatedPatient = patientService.updatePatient(patientId, formData);
    setShowConfirm(false);
    if (updatedPatient) {
      setShowSuccess(true);
      setTimeout(() => {
        onPatientUpdated(updatedPatient);
      }, 1500);
    }
  };

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Editar Paciente</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="firstName"
          placeholder="Nombre"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Apellido"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="O">Otro</option>
        </select>
        <input
          type="password"
          name="password"
          placeholder="Contraseña (opcional)"
          value={formData.password}
          onChange={handleChange}
          className="p-2 border rounded col-span-2"
        />
      </div>
      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Guardar Cambios
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Cancelar
        </button>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="¿Estás seguro/a?"
        message={`¿Deseas guardar los cambios para ${formData.firstName} ${formData.lastName}?`}
        confirmText="Guardar"
        cancelText="Cancelar"
        onConfirm={handleConfirmUpdate}
        onCancel={() => setShowConfirm(false)}
      />

      <SuccessAlert
        isOpen={showSuccess}
        title="Actualizado"
        message={`${formData.firstName} ${formData.lastName} ha sido actualizado exitosamente`}
        onClose={() => setShowSuccess(false)}
      />
    </form>
  );
};
