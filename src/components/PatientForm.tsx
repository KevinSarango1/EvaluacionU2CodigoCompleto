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
    
    // VALIDACIÓN: Nombre - solo letras y espacios (sin números)
    if (name === 'firstName') {
      const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!nameRegex.test(value)) {
        return; // No actualizar si contiene números o caracteres especiales
      }
    }
    
    // VALIDACIÓN: Apellido - solo letras y espacios (sin números)
    if (name === 'lastName') {
      const lastNameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!lastNameRegex.test(value)) {
        return; // No actualizar si contiene números o caracteres especiales
      }
    }
    
    // VALIDACIÓN: Contraseña - limitado a 20 caracteres máximo
    if (name === 'password') {
      if (value.length > 20) {
        return; // No permitir más de 20 caracteres
      }
    }
    
    // VALIDACIÓN: Teléfono - solo números, máximo 10 dígitos, debe empezar por 09
    if (name === 'phone') {
      const phoneRegex = /^[0-9]*$/;
      // Validar números solo
      if (!phoneRegex.test(value) || value.length > 10) {
        return; // No actualizar si contiene caracteres no numéricos o excede 10 dígitos
      }
      // Validar que inicie con 09 si tiene al menos 2 dígitos
      if (value.length >= 2 && !value.startsWith('09')) {
        return; // No actualizar si no empieza por 09
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

    // VALIDACIÓN: Contraseña - 6 a 20 caracteres
    if (formData.password.length < 6) {
      setValidationError('La contraseña debe tener al menos 6 caracteres');
      return;
    } else if (formData.password.length > 20) {
      setValidationError('La contraseña debe tener máximo 20 caracteres');
      return;
    }

    // VALIDACIÓN: Teléfono - si se proporciona, debe ser exactamente 10 dígitos y empezar por 09
    if (formData.phone.trim()) {
      if (formData.phone.length !== 10) {
        setValidationError('El teléfono debe tener exactamente 10 dígitos');
        return;
      } else if (!formData.phone.startsWith('09')) {
        setValidationError('El teléfono debe comenzar con 09');
        return;
      }
    }

    // VALIDACIÓN: Fecha de nacimiento - año mínimo 1900 y no permitir fechas futuras
    const dateOfBirth = new Date(formData.dateOfBirth);
    const today = new Date();
    const minYear = 1900;
    
    // Validar año mínimo
    if (dateOfBirth.getFullYear() < minYear) {
      setValidationError(`Año de nacimiento debe ser a partir de ${minYear}`);
      return;
    }
    
    // Validar que no sea fecha futura
    if (dateOfBirth > today) {
      setValidationError('La fecha de nacimiento no puede ser una fecha futura');
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
