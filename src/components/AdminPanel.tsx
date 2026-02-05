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
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadNutritionists();
  }, []);

  const loadNutritionists = () => {
    const nutritionists = authService.getNutritionists();
    setNutritionists(nutritionists);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // VALIDACIÓN: Nombre completo - solo letras y espacios (sin números)
    if (name === 'fullName') {
      const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!nameRegex.test(value)) {
        return; // No actualizar si contiene números o caracteres especiales
      }
    }
    
    // VALIDACIÓN: Contraseña - limitado a 20 caracteres máximo
    if (name === 'password') {
      if (value.length > 20) {
        return; // No permitir más de 20 caracteres
      }
    }
    
    // VALIDACIÓN: Especialización - solo letras y espacios, máximo 30 caracteres
    if (name === 'specialization') {
      const specRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!specRegex.test(value) || value.length > 30) {
        return; // No actualizar si contiene números o caracteres especiales o excede 30 caracteres
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
    
    // VALIDACIÓN 1: Validar campos requeridos
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
    } else if (formData.password.length > 20) {
      errors.password = 'La contraseña debe tener máximo 20 caracteres';
    }
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'El nombre completo es requerido';
    } else if (/\d/.test(formData.fullName)) {
      errors.fullName = 'El nombre no puede contener números';
    }
    
    if (!formData.specialization.trim()) {
      errors.specialization = 'La especialización es requerida';
    } else if (/\d/.test(formData.specialization)) {
      errors.specialization = 'La especialización no puede contener números';
    } else if (formData.specialization.length > 30) {
      errors.specialization = 'La especialización debe tener máximo 30 caracteres';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'El teléfono es requerido';
    } else if (formData.phone.length < 10) {
      errors.phone = 'Ingrese un teléfono válido (exactamente 10 dígitos)';
    } else if (formData.phone.length > 10) {
      errors.phone = 'El teléfono debe tener exactamente 10 dígitos';
    } else if (!formData.phone.startsWith('09')) {
      errors.phone = 'El teléfono debe comenzar con 09';
    }
    
    // VALIDACIÓN 2: Si hay errores básicos, mostrar y retornar
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    // VALIDACIÓN 3: Validar duplicidad de EMAIL (funciona en crear Y editar)
    const existingEmail = authService.getNutritionists()
      .find(n => n.email.toLowerCase() === formData.email.toLowerCase() && n.id !== editingId);
    if (existingEmail) {
      errors.email = 'Este email ya está registrado por otro nutricionista';
      setValidationErrors(errors);
      return;
    }

    // VALIDACIÓN 4: Validar duplicidad de TELÉFONO (funciona en crear Y editar)
    const existingPhone = authService.getNutritionists()
      .find(n => n.phone === formData.phone && n.id !== editingId);
    if (existingPhone) {
      errors.phone = 'Este teléfono ya está registrado por otro nutricionista';
      setValidationErrors(errors);
      return;
    }
    
    // VALIDACIÓN 5: Si todo está OK, mostrar diálogo de confirmación
    setValidationErrors({});
    setPendingFormData(formData);
    setShowCreateConfirm(true);
  };

  /**
   * CONFIRMACIÓN: Crear/Actualizar después de validar y confirmar
   * 
   * PATRÓN FACADE + VALIDATION:
   * authService encapsula la creación/actualización
   * mientras que el componente valida y pide confirmación
   */
  const confirmCreateNutritionist = () => {
    if (!pendingFormData) return;
    
    let message = '';
    
    if (editingId) {
      // Actualizar nutricionista existente
      authService.updateNutritionist(editingId, {
        ...pendingFormData,
        role: 'nutritionist',
      } as any);
      message = '✅ Datos actualizados correctamente';
      setEditingId(null);
    } else {
      // Crear nuevo nutricionista
      authService.registerNutritionist({
        email: pendingFormData.email,
        password: pendingFormData.password,
        fullName: pendingFormData.fullName,
        specialization: pendingFormData.specialization,
        phone: pendingFormData.phone,
        role: 'nutritionist',
      });
      message = '✅ Nutricionista agregado correctamente';
    }
    
    loadNutritionists();
    resetForm();
    setShowCreateConfirm(false);
    setPendingFormData(null);
    
    // Mostrar mensaje de éxito por 4 segundos
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
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
      setSuccessMessage('✅ Nutricionista eliminado correctamente');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
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
        {/* Mensaje de Éxito - Agregado/Actualizado */}
        {successMessage && (
          <div className="mb-6 p-6 bg-gradient-to-br from-emerald-50 to-green-100 border-2 border-green-400 rounded-xl shadow-lg animate-pulse">
            <div className="flex items-center gap-3">
              <span className="text-4xl">✅</span>
              <div>
                <p className="text-green-900 font-bold text-lg">{successMessage}</p>
                <p className="text-green-700 text-sm mt-1">La operación se completó exitosamente</p>
              </div>
            </div>
          </div>
        )}

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
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <span>{editingId ? '✅' : '➕'}</span>
                    {editingId ? 'Actualizar Nutricionista' : 'Crear Nutricionista'}
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

      {/* Diálogo de confirmación - Eliminar */}
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

      {/* Diálogo de confirmación - Crear/Actualizar Nutricionista */}
      <ConfirmDialog
        isOpen={showCreateConfirm}
        title={editingId ? '✏️ Confirmar actualización' : '➕ Confirmar creación'}
        message={editingId 
          ? `¿Deseas actualizar los datos de ${pendingFormData?.fullName}?\n\nEmail: ${pendingFormData?.email}\nTeléfono: ${pendingFormData?.phone}`
          : `¿Deseas crear un nuevo nutricionista?\n\nNombre: ${pendingFormData?.fullName}\nEmail: ${pendingFormData?.email}\nTeléfono: ${pendingFormData?.phone}`
        }
        confirmText={editingId ? 'Actualizar' : 'Crear'}
        cancelText="Cancelar"
        variant="primary"
        onConfirm={confirmCreateNutritionist}
        onCancel={() => {
          setShowCreateConfirm(false);
          setPendingFormData(null);
        }}
      />
    </div>
  );
};
