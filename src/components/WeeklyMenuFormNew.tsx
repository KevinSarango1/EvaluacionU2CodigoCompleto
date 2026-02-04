import React, { useState } from 'react';
import { WeeklyMenu, MealSchedule, Food, DayMeals } from '../types/patient';
import { ConfirmDialog } from './ConfirmDialog';
import { SuccessAlert } from './SuccessAlert';

interface WeeklyMenuFormProps {
  patientId: string;
  weeklyMenu?: WeeklyMenu;
  foods: Food[];
  onSubmit: (menu: WeeklyMenu) => void;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_NAMES = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

const MEALS = [
  { id: 'breakfast', name: 'Desayuno' },
  { id: 'midMorning', name: 'Media Mañana' },
  { id: 'lunch', name: 'Almuerzo' },
  { id: 'afternoon', name: 'Media Tarde' },
  { id: 'dinner', name: 'Merienda' },
];

interface FoodSelection {
  foodId: string;
  quantity: number;
}

export const WeeklyMenuFormNew: React.FC<WeeklyMenuFormProps> = ({ patientId, weeklyMenu, foods, onSubmit }) => {
  const initializeMealSchedule = (): MealSchedule => {
    const schedule: MealSchedule = {};
    DAYS.forEach(day => {
      schedule[day] = {
        breakfast: [],
        midMorning: [],
        lunch: [],
        afternoon: [],
        dinner: [],
      };
    });
    return schedule;
  };

  const [meals, setMeals] = useState<MealSchedule>(weeklyMenu?.meals || initializeMealSchedule());
  const [foodSelections, setFoodSelections] = useState<{ [key: string]: FoodSelection }>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [observations, setObservations] = useState(weeklyMenu?.observations || '');
  const [foodFilters, setFoodFilters] = useState<{ [key: string]: string }>({});
  const [activeFoodSearch, setActiveFoodSearch] = useState<string | null>(null);
  const [expandedDays, setExpandedDays] = useState<{ [key: string]: boolean }>({
    monday: true,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const toggleDay = (day: string) => {
    setExpandedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const getFilteredFoods = (key: string) => {
    const filter = foodFilters[key] || '';
    if (!filter) return foods;
    return foods.filter(f => f.name.toLowerCase().includes(filter.toLowerCase()));
  };

  const addFoodToMeal = (day: string, mealType: keyof DayMeals, foodId: string, quantity: number) => {
    if (!foodId || quantity <= 0) return;

    const food = foods.find(f => f.id === foodId);
    if (!food) return;

    // Calcular macronutrientes según la cantidad
    const multiplier = quantity / food.grossWeight;

    const mealFood = {
      foodId,
      foodName: food.name,
      quantity,
      unit: 'g',
      calories: Math.round(food.energyKcal * multiplier),
      protein: Number((food.protein * multiplier).toFixed(2)),
      fats: Number((food.fats * multiplier).toFixed(2)),
      carbs: Number((food.carbohydrates * multiplier).toFixed(2)),
      fiber: Number((food.fiber * multiplier).toFixed(2)),
    };

    setMeals(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: [...prev[day][mealType], mealFood],
      },
    }));

    // Limpiar selección
    setFoodSelections(prev => {
      const newSelections = { ...prev };
      delete newSelections[`${day}-${mealType}`];
      return newSelections;
    });
  };

  const removeFoodFromMeal = (day: string, mealType: keyof DayMeals, index: number) => {
    setMeals(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: prev[day][mealType].filter((_, i) => i !== index),
      },
    }));
  };

  const calculateMealTotals = (mealFoods: any[]) => {
    return mealFoods.reduce(
      (totals, food) => ({
        calories: totals.calories + food.calories,
        protein: totals.protein + food.protein,
        fats: totals.fats + food.fats,
        carbs: totals.carbs + food.carbs,
        fiber: totals.fiber + food.fiber,
      }),
      { calories: 0, protein: 0, fats: 0, carbs: 0, fiber: 0 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmSubmit = () => {
    const menu: WeeklyMenu = {
      id: weeklyMenu?.id || `menu-${patientId}-${Date.now()}`,
      patientId,
      weekStartDate: new Date().toISOString().split('T')[0],
      meals,
      observations,
      createdAt: weeklyMenu?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSubmit(menu);
    setSuccessMessage('Menú semanal guardado exitosamente');
    setTimeout(() => setSuccessMessage(''), 3000);
    setShowConfirm(false);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Días de la semana con desplegables */}
        {DAYS.map(day => {
          const isExpanded = expandedDays[day];
          const dayName = DAY_NAMES[day as keyof typeof DAY_NAMES];
          
          return (
            <div key={day} className="border-2 border-slate-300 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition">
              {/* Header desplegable */}
              <button
                type="button"
                onClick={() => toggleDay(day)}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-5 flex items-center justify-between transition duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📅</span>
                  <div className="text-left">
                    <h3 className="text-lg font-bold">{dayName}</h3>
                    <p className="text-sm opacity-90">Haz clic para editar</p>
                  </div>
                </div>
                <span className={`text-2xl transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Contenido desplegable */}
              {isExpanded && (
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 space-y-4">
                  {/* Comidas del día */}
                  {MEALS.map(meal => (
                    <div key={meal.id} className="bg-white rounded-xl p-4 border-l-4 border-blue-500 shadow-sm">
                      <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                        <span className="text-lg">🍽️</span> {meal.name}
                      </h4>

                      {/* Selector de alimentos */}
                      <div className="space-y-2 mb-3">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Elegir alimento</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Busca un alimento..."
                            value={foodFilters[`${day}-${meal.id}`] || ''}
                            onChange={(e) =>
                              setFoodFilters(prev => ({
                                ...prev,
                                [`${day}-${meal.id}`]: e.target.value,
                              }))
                            }
                            onFocus={() => setActiveFoodSearch(`${day}-${meal.id}`)}
                            onBlur={() => setTimeout(() => setActiveFoodSearch(null), 200)}
                            className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none transition text-sm bg-slate-50"
                          />
                          
                          {/* Dropdown de sugerencias */}
                          {activeFoodSearch === `${day}-${meal.id}` && foodFilters[`${day}-${meal.id}`] && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-blue-300 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                              {getFilteredFoods(`${day}-${meal.id}`).length > 0 ? (
                                getFilteredFoods(`${day}-${meal.id}`).map(food => (
                                  <button
                                    key={food.id}
                                    type="button"
                                    onClick={() => {
                                      setFoodSelections(prev => ({
                                        ...prev,
                                        [`${day}-${meal.id}`]: {
                                          foodId: food.id,
                                          quantity: 100,
                                        },
                                      }));
                                      setFoodFilters(prev => ({
                                        ...prev,
                                        [`${day}-${meal.id}`]: food.name,
                                      }));
                                      setActiveFoodSearch(null);
                                    }}
                                    className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b last:border-b-0 text-sm transition"
                                  >
                                    <p className="font-semibold text-slate-800">{food.name}</p>
                                    <p className="text-xs text-slate-600">{food.energyKcal} Kcal | P:{food.protein}g | G:{food.fats}g | C:{food.carbohydrates}g</p>
                                  </button>
                                ))
                              ) : (
                                <div className="px-3 py-2 text-slate-600 text-xs">
                                  No hay alimentos que coincidan
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Input de cantidad - más pequeño */}
                      <div className="flex gap-2 mb-3">
                        <input
                          type="number"
                          placeholder="Cant. (g)"
                          min="1"
                          value={foodSelections[`${day}-${meal.id}`]?.quantity || ''}
                          onChange={(e) =>
                            setFoodSelections(prev => ({
                              ...prev,
                              [`${day}-${meal.id}`]: {
                                ...prev[`${day}-${meal.id}`],
                                foodId: prev[`${day}-${meal.id}`]?.foodId || '',
                                quantity: Number(e.target.value),
                              },
                            }))
                          }
                          className="flex-1 px-3 py-2 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-slate-50"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            addFoodToMeal(
                              day,
                              meal.id as keyof DayMeals,
                              foodSelections[`${day}-${meal.id}`]?.foodId || '',
                              foodSelections[`${day}-${meal.id}`]?.quantity || 0
                            )
                          }
                          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-lg font-bold text-sm transition shadow-md"
                        >
                          ➕
                        </button>
                      </div>

                      {/* Alimentos agregados */}
                      {meals[day][meal.id as keyof DayMeals].length > 0 && (
                        <div className="space-y-2 mb-3">
                          {meals[day][meal.id as keyof DayMeals].map((food, index) => (
                            <div key={index} className="flex justify-between items-start p-2 bg-blue-50 rounded-lg border border-blue-200 text-sm">
                              <div className="flex-1">
                                <p className="font-semibold text-slate-800">{food.foodName}</p>
                                <p className="text-xs text-slate-600">
                                  {food.quantity}g | {food.calories}K | P:{food.protein}g | G:{food.fats}g | C:{food.carbs}g
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFoodFromMeal(day, meal.id as keyof DayMeals, index)}
                                className="ml-2 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-bold transition"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Totales por comida */}
                      {meals[day][meal.id as keyof DayMeals].length > 0 && (
                        <div className="p-2 bg-blue-100 rounded-lg border-l-4 border-blue-500 text-xs">
                          {(() => {
                            const totals = calculateMealTotals(meals[day][meal.id as keyof DayMeals]);
                            return (
                              <p className="font-bold text-blue-900">
                                📊 Total: {totals.calories}K | P:{totals.protein.toFixed(1)}g | G:{totals.fats.toFixed(1)}g | C:{totals.carbs.toFixed(1)}g
                              </p>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Totales por día */}
                  {(() => {
                    let dayTotals = { calories: 0, protein: 0, fats: 0, carbs: 0, fiber: 0 };
                    Object.values(meals[day]).forEach(mealFoods => {
                      const totals = calculateMealTotals(mealFoods);
                      dayTotals.calories += totals.calories;
                      dayTotals.protein += totals.protein;
                      dayTotals.fats += totals.fats;
                      dayTotals.carbs += totals.carbs;
                      dayTotals.fiber += totals.fiber;
                    });
                    return dayTotals.calories > 0 ? (
                      <div className="p-3 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg border-l-4 border-green-600">
                        <p className="font-bold text-green-900 text-sm">
                          📅 Total del día: {dayTotals.calories}K | P:{dayTotals.protein.toFixed(1)}g | G:{dayTotals.fats.toFixed(1)}g | C:{dayTotals.carbs.toFixed(1)}g
                        </p>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
          );
        })}

        {/* Observaciones */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border-l-4 border-purple-500 p-6">
          <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">📝 Observaciones Especiales</label>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            className="w-full p-3 border-2 border-slate-300 rounded-lg focus:border-purple-500 focus:outline-none transition text-sm resize-none"
            rows={3}
            placeholder="Notas o recomendaciones especiales..."
          />
        </div>

        {/* Botón enviar - mejorado */}
        <button
          type="submit"
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition duration-200 uppercase tracking-wide flex items-center justify-center gap-2 text-lg"
        >
          <span>💾</span>
          Guardar Menú Semanal
        </button>
      </form>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Guardar Menú Semanal"
        message="¿Deseas guardar el menú semanal para este paciente?"
        confirmText="Guardar"
        cancelText="Cancelar"
        onConfirm={confirmSubmit}
        onCancel={() => setShowConfirm(false)}
      />

      {successMessage && (
        <SuccessAlert
          isOpen={!!successMessage}
          title="✅ Menú Guardado"
          message={successMessage}
          onClose={() => setSuccessMessage('')}
        />
      )}
    </div>
  );
};
