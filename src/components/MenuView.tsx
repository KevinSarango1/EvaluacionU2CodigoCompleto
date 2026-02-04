import React from 'react';
import { WeeklyMenu } from '../types/patient';

interface MenuViewProps {
  weeklyMenu?: WeeklyMenu;
}

const DAY_NAMES = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

const MEAL_NAMES = {
  breakfast: '🥣 Desayuno',
  midMorning: '🥤 Media Mañana',
  lunch: '🍽️ Almuerzo',
  afternoon: '☕ Media Tarde',
  dinner: '🍜 Merienda',
};

export const MenuView: React.FC<MenuViewProps> = ({ weeklyMenu }) => {
  if (!weeklyMenu) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <p className="text-gray-600 text-center">No hay menú semanal asignado</p>
      </div>
    );
  }

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

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">📅 Menú Semanal Personalizado</h2>

      <div className="space-y-8">
        {Object.entries(weeklyMenu.meals).map(([day, dayMeals]) => (
          <div key={day} className="border-2 border-blue-300 rounded-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h3 className="text-xl font-bold">{DAY_NAMES[day as keyof typeof DAY_NAMES]}</h3>
            </div>

            <div className="p-4 space-y-4">
              {Object.entries(dayMeals).map(([mealType, foods]) => (
                <div key={mealType} className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-bold text-lg mb-3 text-blue-700">
                    {MEAL_NAMES[mealType as keyof typeof MEAL_NAMES]}
                  </h4>

                  {foods.length === 0 ? (
                    <p className="text-gray-500 italic">Sin alimentos asignados</p>
                  ) : (
                    <>
                      {/* Lista de alimentos */}
                      <div className="space-y-2 mb-3">
                        {foods.map((food: any, index: number) => (
                          <div key={index} className="p-3 bg-white rounded border-l-4 border-green-500">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-semibold text-lg">{food.foodName}</p>
                                <p className="text-sm text-gray-600">Cantidad: <strong>{food.quantity}g</strong></p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-blue-600">{food.calories} Kcal</p>
                              </div>
                            </div>
                            <div className="mt-2 grid grid-cols-4 gap-2 text-sm">
                              <div className="bg-red-50 p-2 rounded">
                                <p className="text-gray-600">Proteína</p>
                                <p className="font-bold text-red-600">{food.protein.toFixed(1)}g</p>
                              </div>
                              <div className="bg-yellow-50 p-2 rounded">
                                <p className="text-gray-600">Grasas</p>
                                <p className="font-bold text-yellow-600">{food.fats.toFixed(1)}g</p>
                              </div>
                              <div className="bg-orange-50 p-2 rounded">
                                <p className="text-gray-600">Carbos</p>
                                <p className="font-bold text-orange-600">{food.carbs.toFixed(1)}g</p>
                              </div>
                              <div className="bg-green-50 p-2 rounded">
                                <p className="text-gray-600">Fibra</p>
                                <p className="font-bold text-green-600">{food.fiber.toFixed(1)}g</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Totales por comida */}
                      {(() => {
                        const totals = calculateMealTotals(foods);
                        return (
                          <div className="p-3 bg-blue-100 rounded border-l-4 border-blue-600">
                            <p className="font-bold text-blue-900">
                              Total: {totals.calories} Kcal | 
                              Proteína: {totals.protein.toFixed(1)}g | 
                              Grasas: {totals.fats.toFixed(1)}g | 
                              Carbos: {totals.carbs.toFixed(1)}g | 
                              Fibra: {totals.fiber.toFixed(1)}g
                            </p>
                          </div>
                        );
                      })()}
                    </>
                  )}
                </div>
              ))}

              {/* Totales por día */}
              {(() => {
                let dayTotals = { calories: 0, protein: 0, fats: 0, carbs: 0, fiber: 0 };
                Object.values(dayMeals).forEach(mealFoods => {
                  const totals = calculateMealTotals(mealFoods);
                  dayTotals.calories += totals.calories;
                  dayTotals.protein += totals.protein;
                  dayTotals.fats += totals.fats;
                  dayTotals.carbs += totals.carbs;
                  dayTotals.fiber += totals.fiber;
                });
                return dayTotals.calories > 0 ? (
                  <div className="mt-4 p-4 bg-green-200 rounded border-l-4 border-green-700">
                    <p className="font-bold text-green-900 text-lg">
                      Total del día: {dayTotals.calories} Kcal | 
                      Proteína: {dayTotals.protein.toFixed(1)}g | 
                      Grasas: {dayTotals.fats.toFixed(1)}g | 
                      Carbos: {dayTotals.carbs.toFixed(1)}g | 
                      Fibra: {dayTotals.fiber.toFixed(1)}g
                    </p>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        ))}
      </div>

      {/* Observaciones */}
      {weeklyMenu.observations && (
        <div className="mt-8 p-6 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
          <h3 className="font-bold text-yellow-900 mb-2">📝 Observaciones</h3>
          <p className="text-gray-700">{weeklyMenu.observations}</p>
        </div>
      )}
    </div>
  );
};
