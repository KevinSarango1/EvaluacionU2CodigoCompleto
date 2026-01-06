import React, { useState, useEffect } from 'react';
import { User } from '../types/auth';
import { authService } from '../services/authService';
import { ConfirmDialog } from './ConfirmDialog';

interface AdminPanelProps {
  onLogout: () => void;
  currentUser: User;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout, currentUser }) => {
  const [nutritionists, setNutritionists] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    specialization: '',
    phone: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState('');

  useEffect(() => {
    loadNutritionists();
  }, []);

  const loadNutritionists = () => {
    const nutritionists = authService.getNutritionists();
    setNutritionists(nutritionists);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    const errors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Ingrese un email válido';
    }
    
    if (!formData.password.trim()) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'El nombre completo es requerido';
    }
    
    if (!formData.specialization.trim()) {
      errors.specialization = 'La especialización es requerida';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'El teléfono es requerido';
    } else if (formData.phone.length < 10) {
      errors.phone = 'Ingrese un teléfono válido (mínimo 10 dígitos)';
    }
    
    // Si hay errores, mostrarlos y no enviar
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    // Validar que el email no sea duplicado (solo cuando creamos)
    if (!editingId) {
      const existingNutritionist = authService.getNutritionists()
        .find(n => n.email.toLowerCase() === formData.email.toLowerCase());
      if (existingNutritionist) {
        errors.email = 'Este email ya está registrado';
        setValidationErrors(errors);
        return;
      }
    }

    // Validar que el teléfono no sea duplicado (solo cuando creamos)
    if (!editingId) {
      const existingNutritionistPhone = authService.getNutritionists()
        .find(n => n.phone === formData.phone);
      if (existingNutritionistPhone) {
        errors.phone = 'Este teléfono ya está registrado';
        setValidationErrors(errors);
        return;
      }
    }
    
    // Limpiar errores si la validación pasó
    setValidationErrors({});
    
    if (editingId) {
      // Actualizar nutricionista
      authService.updateNutritionist(editingId, {
        ...formData,
        role: 'nutritionist',
      } as any);
      setEditingId(null);
    } else {
      // Crear nuevo nutricionista
      authService.registerNutritionist({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        specialization: formData.specialization,
        phone: formData.phone,
        role: 'nutritionist',
      });
    }
    
    loadNutritionists();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      fullName: '',
      specialization: '',
      phone: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (nutritionist: User) => {
    setFormData({
      email: nutritionist.email,
      password: nutritionist.password,
      fullName: nutritionist.fullName,
      specialization: nutritionist.specialization || '',
      phone: nutritionist.phone || '',
    });
    setEditingId(nutritionist.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const nutritionist = nutritionists.find(n => n.id === id);
    if (nutritionist) {
      setDeleteId(id);
      setDeleteName(nutritionist.fullName);
      setShowDeleteConfirm(true);
    }
  };

  const confirmDelete = () => {
    if (deleteId) {
      authService.deleteNutritionist(deleteId);
      loadNutritionists();
    }
    setShowDeleteConfirm(false);
    setDeleteId(null);
    setDeleteName('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 shadow">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">NutriApp - Panel de Administración</h1>
            <p className="text-blue-100">Bienvenido, {currentUser.fullName}</p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Botón para agregar nutricionista */}
        <div className="mb-6">
          <button
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
              }
            }}
            className="px-6 py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition"
          >
            {showForm ? 'Cancelar' : '+ Agregar Nutricionista'}
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? 'Editar Nutricionista' : 'Nuevo Nutricionista'}
            </h2>
            
            {/* Mostrar errores de validación */}
            {Object.keys(validationErrors).length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded">
                <h3 className="text-red-800 font-bold mb-2">⚠️ Por favor corrige los siguientes errores:</h3>
                <ul className="list-disc list-inside space-y-1 text-red-700">
                  {Object.entries(validationErrors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Nombre Completo *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded focus:ring-2 ${
                      validationErrors.fullName
                        ? 'border-red-500 focus:ring-red-600'
                        : 'focus:ring-blue-600'
                    }`}
                  />
                  {validationErrors.fullName && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded focus:ring-2 ${
                      validationErrors.email
                        ? 'border-red-500 focus:ring-red-600'
                        : 'focus:ring-blue-600'
                    }`}
                  />
                  {validationErrors.email && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Contraseña *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded focus:ring-2 ${
                      validationErrors.password
                        ? 'border-red-500 focus:ring-red-600'
                        : 'focus:ring-blue-600'
                    }`}
                  />
                  {validationErrors.password && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.password}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Especialización *</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="Ej: Nutrición Deportiva"
                    className={`w-full px-4 py-2 border rounded focus:ring-2 ${
                      validationErrors.specialization
                        ? 'border-red-500 focus:ring-red-600'
                        : 'focus:ring-blue-600'
                    }`}
                  />
                  {validationErrors.specialization && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.specialization}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-2">Teléfono *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded focus:ring-2 ${
                      validationErrors.phone
                        ? 'border-red-500 focus:ring-red-600'
                        : 'focus:ring-blue-600'
                    }`}
                  />
                  {validationErrors.phone && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.phone}</p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
              >
                {editingId ? 'Actualizar' : 'Crear Nutricionista'}
              </button>
            </form>
          </div>
        )}

        {/* Lista de nutricionistas */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 bg-blue-50 border-b">
            <h2 className="text-2xl font-bold">Nutricionistas Registrados ({nutritionists.length})</h2>
          </div>

          {nutritionists.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              No hay nutricionistas registrados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Especialización</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Teléfono</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {nutritionists.map(nutritionist => (
                    <tr key={nutritionist.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700 font-semibold">{nutritionist.fullName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{nutritionist.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{nutritionist.specialization || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{nutritionist.phone || '-'}</td>
                      <td className="px-6 py-4 text-sm text-center space-x-2">
                        <button
                          onClick={() => handleEdit(nutritionist)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-semibold"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(nutritionist.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-semibold"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Diálogo de confirmación de eliminación */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Eliminar Nutricionista"
        message={`¿Estás seguro/a de que deseas eliminar a ${deleteName}?\n\nEsta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDeleteId(null);
          setDeleteName('');
        }}
      />
    </div>
  );
};
