import React, { useState } from 'react';
import { Food } from '../types/patient';
import { ConfirmDialog } from './ConfirmDialog';
import { ValidationAlert } from './ValidationAlert';
import { SuccessAlert } from './SuccessAlert';

interface FoodDatabaseProps {
  initialFoods?: Food[];
  onFoodsChange?: (foods: Food[]) => void;
}

export const FoodDatabase: React.FC<FoodDatabaseProps> = ({ initialFoods, onFoodsChange }) => {
  const [foods, setFoods] = useState<Food[]>(initialFoods || [
    {
      id: '1',
      name: 'Pollo Cocido',
      grossWeight: 200,
      netWeight: 180,
      energyKcal: 330,
      energyKj: 1381,
      protein: 29.6,
      fats: 23.2,
      carbohydrates: 0,
      fiber: 0,
    },
    {
      id: '2',
      name: 'Arroz Cocido',
      grossWeight: 150,
      netWeight: 140,
      energyKcal: 195,
      energyKj: 816,
      protein: 4.3,
      fats: 0.3,
      carbohydrates: 43,
      fiber: 0.4,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    grossWeight: 0,
    netWeight: 0,
    energyKcal: 0,
    energyKj: 0,
    protein: 0,
    fats: 0,
    carbohydrates: 0,
    fiber: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value),
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setValidationError('El nombre del alimento es requerido');
      return false;
    }
    if (formData.grossWeight <= 0) {
      setValidationError('El peso bruto debe ser mayor a 0');
      return false;
    }
    if (formData.netWeight <= 0 || formData.netWeight > formData.grossWeight) {
      setValidationError('El peso neto debe ser válido y menor al peso bruto');
      return false;
    }
    if (formData.energyKcal <= 0) {
      setValidationError('La energía en Kcal debe ser mayor a 0');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingId) {
      const updated = foods.map(f => f.id === editingId ? { ...formData, id: editingId } as Food : f);
      setFoods(updated);
      if (onFoodsChange) onFoodsChange(updated);
      setSuccessMessage('Alimento actualizado exitosamente');
      setEditingId(null);
    } else {
      const newFood: Food = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      const updated = [...foods, newFood];
      setFoods(updated);
      if (onFoodsChange) onFoodsChange(updated);
      setSuccessMessage('Alimento creado exitosamente');
    }

    setFormData({
      name: '',
      description: '',
      grossWeight: 0,
      netWeight: 0,
      energyKcal: 0,
      energyKj: 0,
      protein: 0,
      fats: 0,
      carbohydrates: 0,
      fiber: 0,
    });
    setShowForm(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEdit = (food: Food) => {
    setFormData({
      name: food.name,
      description: food.description || '',
      grossWeight: food.grossWeight,
      netWeight: food.netWeight,
      energyKcal: food.energyKcal,
      energyKj: food.energyKj,
      protein: food.protein,
      fats: food.fats,
      carbohydrates: food.carbohydrates,
      fiber: food.fiber,
    });
    setEditingId(food.id);
    setShowForm(true);
  };

  const handleDeleteClick = (food: Food) => {
    setDeleteId(food.id);
    setDeleteName(food.name);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      const updated = foods.filter(f => f.id !== deleteId);
      setFoods(updated);
      if (onFoodsChange) onFoodsChange(updated);
      setSuccessMessage(`${deleteName} eliminado exitosamente`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
    setShowDeleteConfirm(false);
    setDeleteId(null);
    setDeleteName('');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      grossWeight: 0,
      netWeight: 0,
      energyKcal: 0,
      energyKj: 0,
      protein: 0,
      fats: 0,
      carbohydrates: 0,
      fiber: 0,
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Alimentos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
        >
          + Agregar Alimento
        </button>
      </div>

      {/* Formulario Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full my-8">
            <h3 className="text-2xl font-bold mb-6">{editingId ? 'Editar Alimento' : 'Nuevo Alimento'}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Nombre del Alimento *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Descripción</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Peso Bruto (g) *</label>
                  <input
                    type="number"
                    name="grossWeight"
                    value={formData.grossWeight}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Peso Neto (g) *</label>
                  <input
                    type="number"
                    name="netWeight"
                    value={formData.netWeight}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Energía (Kcal) *</label>
                  <input
                    type="number"
                    name="energyKcal"
                    value={formData.energyKcal}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Energía (kJ) *</label>
                  <input
                    type="number"
                    name="energyKj"
                    value={formData.energyKj}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Proteína (g)</label>
                  <input
                    type="number"
                    name="protein"
                    value={formData.protein}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Lípidos (g)</label>
                  <input
                    type="number"
                    name="fats"
                    value={formData.fats}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Hidratos de Carbono (g)</label>
                  <input
                    type="number"
                    name="carbohydrates"
                    value={formData.carbohydrates}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Fibra (g)</label>
                  <input
                    type="number"
                    name="fiber"
                    value={formData.fiber}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingId ? 'Actualizar' : 'Crear'} Alimento
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de Alimentos */}
      <div className="grid gap-4">
        {foods.length === 0 ? (
          <p className="text-gray-600">No hay alimentos registrados</p>
        ) : (
          foods.map(food => (
            <div key={food.id} className="p-4 bg-white rounded-lg shadow">
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <h3 className="text-lg font-bold">{food.name}</h3>
                  {food.description && <p className="text-sm text-gray-600">{food.description}</p>}
                </div>
                <div className="text-sm">
                  <p><strong>Peso:</strong> {food.netWeight}g (neto) / {food.grossWeight}g (bruto)</p>
                  <p><strong>Energía:</strong> {food.energyKcal} Kcal / {food.energyKj} kJ</p>
                </div>
                <div className="text-sm">
                  <p><strong>Proteína:</strong> {food.protein}g</p>
                  <p><strong>Lípidos:</strong> {food.fats}g | <strong>Carbos:</strong> {food.carbohydrates}g | <strong>Fibra:</strong> {food.fiber}g</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(food)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClick(food)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ValidationAlert
        isOpen={!!validationError}
        message={validationError}
        onClose={() => setValidationError('')}
      />

      <SuccessAlert
        isOpen={!!successMessage}
        title="Éxito"
        message={successMessage}
        onClose={() => setSuccessMessage('')}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Eliminar Alimento"
        message={`¿Estás seguro/a de que deseas eliminar "${deleteName}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};
