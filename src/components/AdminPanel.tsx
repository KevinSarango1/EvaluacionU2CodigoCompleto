import React, { useState, useEffect } from 'react';
import { User } from '../types/auth';
import { authService } from '../services/authService';

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
    if (confirm('¿Está seguro de que desea eliminar este nutricionista?')) {
      authService.deleteNutritionist(id);
      loadNutritionists();
    }
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Especialización</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="Ej: Nutrición Deportiva"
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-2">Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-600"
                  />
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
    </div>
  );
};
