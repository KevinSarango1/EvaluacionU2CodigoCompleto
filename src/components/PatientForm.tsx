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
    gender: 'M' as 'M' | 'F',
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
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-500 text-white p-8 rounded-t-2xl shadow-lg">
        <h2 className="text-3xl font-bold">👤 Registrar Nuevo Paciente</h2>
        <p className="text-blue-50 text-sm mt-2">Completa todos los campos obligatorios</p>
      </div>

      {/* Form Content */}
      <div className="bg-white p-8 rounded-b-2xl shadow-lg space-y-6">
        {/* Row 1: Nombre y Apellido */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">📝 Nombre</label>
            <input
              type="text"
              name="firstName"
              placeholder="Ej: Juan"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none transition text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">📝 Apellido</label>
            <input
              type="text"
              name="lastName"
              placeholder="Ej: Pérez"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none transition text-sm"
            />
          </div>
        </div>

        {/* Row 2: Email y Teléfono */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">📧 Email</label>
            <input
              type="email"
              name="email"
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none transition text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">📞 Teléfono (celular)</label>
            <input
              type="tel"
              name="phone"
              placeholder="Ej: 0991234567"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none transition text-sm"
            />
          </div>
        </div>

        {/* Row 3: Fecha de Nacimiento y Género */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">🎂 Fecha de Nacimiento</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none transition text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">👥 Género</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none transition text-sm bg-white cursor-pointer"
            >
              <option value="M">👨 Masculino</option>
              <option value="F">👩 Femenino</option>
            </select>
          </div>
        </div>

        {/* Row 4: Contraseña */}
        <div>
          <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">🔐 Contraseña</label>
          <input
            type="password"
            name="password"
            placeholder="Proporcionada por nutricionista"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none transition text-sm"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition duration-200 uppercase tracking-wide flex items-center justify-center gap-2 text-lg mt-6"
        >
          <span>✅</span>
          Crear Paciente
        </button>
      </div>

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
