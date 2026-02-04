export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'M' | 'F' | 'O';
  address?: string;
  occupation?: string;
  password?: string;
  weeklyMenu?: WeeklyMenu;
  clinicalHistory: ClinicalHistory;
}

export interface WeeklyMenu {
  id?: string;
  patientId: string;
  weekStartDate: string;
  meals: MealSchedule;
  observations?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MealSchedule {
  [day: string]: DayMeals;
}

export interface DayMeals {
  breakfast: MealFood[];
  midMorning: MealFood[];
  lunch: MealFood[];
  afternoon: MealFood[];
  dinner: MealFood[];
}

export interface MealFood {
  foodId: string;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  fiber: number;
}

export interface Food {
  id: string;
  name: string;
  description?: string;
  grossWeight: number;
  netWeight: number;
  energyKcal: number;
  energyKj: number;
  protein: number;
  fats: number;
  carbohydrates: number;
  fiber: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClinicalHistory {
  patientId: string;
  date: string;
  // Datos personales
  medicalHistory: string;
  surgicalHistory: string;
  familyHistory: string;
  currentComplaints: string;
  pastDiseases: string;
  // Hábitos
  dietaryHabits: string;
  physicalActivity: string;
  alcoholConsumption: string;
  tobaccoUse: string;
  // Medicamentos y alergias
  currentMedications: string[];
  allergies: string[];
  foodIntolerances: string[];
  // Objetivo nutricional
  nutritionalObjective: string;
  dietaryRestrictions: string;
  // Datos bioquímicos y antropometría
  biometrics: Biometrics;
  anthropometry: Anthropometry;
  recall24h: Recall24h;
  createdAt: string;
  updatedAt: string;
}

export interface Biometrics {
  // Metabolismo de carbohidratos
  glucose: number;
  hba1c?: number;
  insulin?: number;
  homaIndex?: number;
  // Perfil lipídico
  totalCholesterol: number;
  ldl: number;
  hdl: number;
  triglycerides: number;
  vldl?: number;
  // Función hepática
  ast?: number;
  alt?: number;
  ggt?: number;
  bilirubin?: number;
  // Función renal
  creatinine?: number;
  bun?: number;
  urea?: number;
  sodium?: number;
  potassium?: number;
  chloride?: number;
  // Proteínas
  totalProteins?: number;
  albumin?: number;
  prealbumin?: number;
  // Hemograma
  hemoglobin: number;
  hematocrit?: number;
  wbc?: number;
  platelets?: number;
  // Micronutrientes
  vitaminB12?: number;
  vitaminD?: number;
  folacin?: number;
  iron?: number;
  ferritin?: number;
  zinc?: number;
  calcium?: number;
  magnesium?: number;
  phosphorus?: number;
  testDate: string;
}

export interface Anthropometry {
  // Medidas básicas
  weight: number;
  height: number;
  bmi: number;
  // Circunferencias
  waistCircumference: number;
  hipCircumference: number;
  waistHipRatio?: number;
  armCircumference?: number;
  thighCircumference?: number;
  calfCircumference?: number;
  // Pliegues cutáneos
  tricepsSkinfold?: number;
  bicepsSkinfold?: number;
  subscapularSkinfold?: number;
  suprailiacSkinfold?: number;
  // Composición corporal
  bodyFatPercentage: number;
  muscleMass?: number;
  boneMass?: number;
  waterPercentage?: number;
  measurementDate: string;
}

export interface Recall24h {
  breakfastIntake: FoodIntake[];
  midMorningIntake: FoodIntake[];
  lunchIntake: FoodIntake[];
  afternoonIntake: FoodIntake[];
  dinnerIntake: FoodIntake[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  recallDate: string;
}

export interface FoodIntake {
  food: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface BiometricsInterpretation {
  glucose: { value: string; status: 'normal' | 'warning' | 'critical' };
  cholesterol: { value: string; status: 'normal' | 'warning' | 'critical' };
  hdl: { value: string; status: 'normal' | 'warning' | 'critical' };
  ldl: { value: string; status: 'normal' | 'warning' | 'critical' };
  triglycerides: { value: string; status: 'normal' | 'warning' | 'critical' };
  hemoglobin: { value: string; status: 'normal' | 'warning' | 'critical' };
}

export interface AnthropometryInterpretation {
  bmiCategory: 'bajo_peso' | 'normal' | 'sobrepeso' | 'obesidad_i' | 'obesidad_ii' | 'obesidad_iii';
  waistRisk: 'normal' | 'increased' | 'high';
  status: string;
}
