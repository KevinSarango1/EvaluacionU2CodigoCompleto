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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header mejorado */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-800 text-white shadow-2xl">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-4xl font-black mb-2 drop-shadow-lg">🏥 Panel de Administración</h1>
              <div className="h-1 w-64 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-2"></div>
              <p className="text-cyan-100 text-lg">Gestiona nutricionistas y administra la plataforma</p>
              <p className="text-blue-200 text-sm mt-1">Administrador: <span className="font-bold text-white">{currentUser.fullName}</span></p>
            </div>
            <button
              onClick={onLogout}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Botón agregar - mejorado */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-slate-800">📋 Nutricionistas</h2>
          <button
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
              }
            }}
            className={`px-8 py-3 font-bold rounded-xl transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 ${
              showForm
                ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600'
                : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700'
            }`}
          >
            <span className="text-xl">{showForm ? '✕' : '+'}</span>
            {showForm ? 'Cancelar' : 'Agregar Nutricionista'}
          </button>
        </div>

        {/* Formulario mejorado */}
        {showForm && (
          <div className="mb-8 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                {editingId ? '✏️ Editar Nutricionista' : '➕ Nuevo Nutricionista'}
              </h3>
              <p className="text-blue-100 text-sm mt-1">Completa todos los campos marcados con *</p>
            </div>

            <div className="p-8">
              {/* Errores de validación */}
              {Object.keys(validationErrors).length > 0 && (
                <div className="mb-6 p-6 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-xl">
                  <h4 className="text-red-900 font-bold mb-3 flex items-center gap-2">⚠️ Por favor corrige los errores:</h4>
                  <ul className="space-y-2">
                    {Object.entries(validationErrors).map(([field, error]) => (
                      <li key={field} className="text-red-700 text-sm flex items-center gap-2">
                        <span>❌</span> {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Nombre Completo */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Nombre Completo *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                        validationErrors.fullName
                          ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                          : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                      }`}
                      placeholder="Juan Pérez"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                        validationErrors.email
                          ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                          : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                      }`}
                      placeholder="juan@example.com"
                    />
                  </div>

                  {/* Contraseña */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Contraseña *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                        validationErrors.password
                          ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                          : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                      }`}
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>

                  {/* Especialización */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Especialización *</label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                        validationErrors.specialization
                          ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                          : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                      }`}
                      placeholder="Ej: Nutrición Deportiva"
                    />
                  </div>

                  {/* Teléfono */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Teléfono *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                        validationErrors.phone
                          ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                          : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                      }`}
                      placeholder="Ej: 1234567890"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {editingId ? '✅ Actualizar Nutricionista' : '➕ Crear Nutricionista'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de nutricionistas mejorada */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-8 py-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              👥 Nutricionistas Registrados
              <span className="ml-auto bg-white text-slate-900 px-4 py-1 rounded-full font-bold">{nutritionists.length}</span>
            </h3>
          </div>

          {nutritionists.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-xl font-semibold text-slate-600 mb-2">Sin nutricionistas registrados</p>
              <p className="text-slate-500">Haz clic en "Agregar Nutricionista" para comenzar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-100 to-slate-200 border-b-2 border-slate-300">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">👤 Nombre</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">📧 Email</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">🎓 Especialización</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">📞 Teléfono</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-slate-700 uppercase tracking-wide">⚙️ Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {nutritionists.map((nutritionist, idx) => (
                    <tr key={nutritionist.id} className={`transition hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">{nutritionist.fullName}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{nutritionist.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {nutritionist.specialization || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">{nutritionist.phone || '—'}</td>
                      <td className="px-6 py-4 text-sm text-center space-x-2">
                        <button
                          onClick={() => handleEdit(nutritionist)}
                          className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-xs font-bold transition duration-200 hover:shadow-lg transform hover:scale-105"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(nutritionist.id)}
                          className="inline-block px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg text-xs font-bold transition duration-200 hover:shadow-lg transform hover:scale-105"
                        >
                          🗑️ Eliminar
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

      {/* Diálogo de confirmación */}
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
