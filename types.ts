export type Gender = 'male' | 'female';
export type UnitSystem = 'metric' | 'imperial';

export interface UserStats {
  gender: Gender;
  age: number;
  height: number; // cm
  weight: number; // kg
  neck: number; // cm
  waist: number; // cm
  hip: number; // cm
  activity: number;
}

export interface MacroTargets {
  calories: number;
  protein: number;
  fat: number;
  carb: number;
  lbm: number;
  bodyFat: number;
}

export interface FoodItem {
  name: string;
  cal: number;
  p: number;
  c: number;
  f: number;
  note: string;
}

export interface FoodCategory {
  category: string;
  items: FoodItem[];
}

export interface Ingredient extends FoodItem {
  weight: number;
  cookingMethod: string;
  rawName: string; // Store original name
}

export interface MealSlot {
  ingredients: Ingredient[];
}

export type DayName = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type MealName = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

export type WeeklyPlan = Record<DayName, Record<MealName, MealSlot>>;

// --- Studio / Skill Tree Types ---

export interface SkillNode {
  id: string;
  name: string;
  type: 'reps' | 'static';
  target: string; // e.g., "3x20" or "30s"
  description: string;
  met: number; // Metabolic Equivalent for calorie calc
  notes: string;
}

export interface SkillLine {
  id: string;
  title: string;
  color: string;
  nodes: SkillNode[];
}

// --- Session Builder Types ---

export interface StudioNode {
  id: string;
  type: 'warmup' | 'strength' | 'skill' | 'cooldown';
  label: string;
  duration: number; // minutes
  notes?: string;
  mode?: 'timer' | 'reps';
  sets?: number;
  reps?: number;
}

export interface Session {
  id: string;
  name: string;
  updatedAt: number;
  nodes: StudioNode[];
}

export interface Position {
  x: number;
  y: number;
}
