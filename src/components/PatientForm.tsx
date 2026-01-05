import React, { useState } from 'react';
import { Patient } from '../types/patient';
import { patientService } from '../services/patientService';
import { ConfirmDialog } from './ConfirmDialog';
import { SuccessAlert } from './SuccessAlert';
import { ValidationAlert } from './ValidationAlert';

interface PatientFormProps {
  onPatientCreated: (patient: Patient) => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ onPatientCreated }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'M' as 'M' | 'F' | 'O',
    password: '',
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

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
    
    // Validar campos requeridos
    const missingFields = [];
    if (!formData.firstName.trim()) missingFields.push('Nombre');
    if (!formData.lastName.trim()) missingFields.push('Apellido');
    if (!formData.email.trim()) missingFields.push('Email');
    if (!formData.dateOfBirth) missingFields.push('Fecha de Nacimiento');
    if (!formData.password.trim()) missingFields.push('Contraseña');

    if (missingFields.length > 0) {
      setValidationError(`Campos obligatorios incompletos: ${missingFields.join(', ')}`);
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError('Por favor ingresa un email válido');
      return;
    }

    // Validar email duplicado
    if (patientService.emailExists(formData.email)) {
      setValidationError('Este correo ya está registrado en el sistema');
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmCreate = () => {
    const newPatient = patientService.createPatient({
      ...formData,
      clinicalHistory: {
        patientId: '',
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
        currentMedications: [],
        allergies: [],
        foodIntolerances: [],
        nutritionalObjective: '',
        dietaryRestrictions: '',
        biometrics: {} as any,
        anthropometry: {} as any,
        recall24h: {} as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
    setShowConfirm(false);
    setShowSuccess(true);
    setTimeout(() => {
      onPatientCreated(newPatient);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', gender: 'M', password: '' });
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Registrar Nuevo Paciente</h2>
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
          placeholder="Contraseña (proporcionada por nutricionista)"
          value={formData.password}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
      </div>
      <button type="submit" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Crear Paciente
      </button>

      <ConfirmDialog
        isOpen={showConfirm}
        title="¿Estás seguro/a?"
        message={`¿Deseas registrar a ${formData.firstName} ${formData.lastName} como nuevo paciente?`}
        confirmText="Registrar"
        cancelText="Cancelar"
        onConfirm={handleConfirmCreate}
        onCancel={() => setShowConfirm(false)}
      />

      <SuccessAlert
        isOpen={showSuccess}
        title="Paciente Registrado"
        message={`${formData.firstName} ${formData.lastName} ha sido registrado exitosamente`}
        onClose={() => setShowSuccess(false)}
      />

      <ValidationAlert
        isOpen={!!validationError}
        message={validationError}
        onClose={() => setValidationError('')}
      />
    </form>
  );
};
