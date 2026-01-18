import { FoodCategory, DayName, MealName, WeeklyPlan, SkillLine } from './types';

// ... (Existing Food Database) ...
export const FOOD_DATABASE: FoodCategory[] = [
    {
        category: "Staples",
        items: [
            { name: "Yam, raw", cal: 118, p: 1.53, c: 27.88, f: 0.17, note: "High-carb tuber; Dioscorea" },
            { name: "Yam, boiled", cal: 116, p: 1.49, c: 27.58, f: 0.14, note: "Water added during cooking" },
            { name: "Cassava, raw", cal: 160, p: 1.36, c: 38.06, f: 0.28, note: "Must cook/ferment (Garri source)" },
            { name: "Cassava, boiled", cal: 173, p: 1.34, c: 37.46, f: 2.04, note: "Boiling increases absorbable cal" },
            { name: "Plantain, raw", cal: 122, p: 1.30, c: 31.89, f: 0.37, note: "Ripe or green" },
            { name: "Plantain, boiled", cal: 116, p: 0.79, c: 31.15, f: 0.18, note: "Lower protein ratio due to water" },
            { name: "Potato (white), raw", cal: 77, p: 2.02, c: 17.47, f: 0.09, note: "Peel for fiber" },
            { name: "Potato, boiled", cal: 87, p: 1.87, c: 20.13, f: 0.10, note: "Absorbs water" },
            { name: "Rice (white, uncooked)", cal: 358, p: 6.50, c: 79.15, f: 0.52, note: "Milled grain staple" },
            { name: "Rice, cooked", cal: 130, p: 2.36, c: 28.73, f: 0.19, note: "Swollen with water" },
            { name: "Corn (Maize), raw", cal: 86, p: 3.22, c: 19.02, f: 1.18, note: "Fresh kernels or pap" },
            { name: "Sorghum, raw", cal: 339, p: 11.3, c: 74.63, f: 3.30, note: "Drought-tolerant grain" },
            { name: "Millet, raw", cal: 378, p: 11.0, c: 72.8, f: 4.2, note: "Ancient grain" },
            { name: "Cocoyam (Taro), raw", cal: 129, p: 2.40, c: 27.40, f: 0.20, note: "Fibrous peel, must cook" }
        ]
    },
    {
        category: "Proteins",
        items: [
            { name: "Chicken breast, raw", cal: 195, p: 29.55, c: 0, f: 7.72, note: "Skinless, lean" },
            { name: "Beef (mixed), cooked", cal: 288, p: 26.33, c: 0, f: 19.54, note: "Stewed or roasted" },
            { name: "Eggs, raw", cal: 147, p: 12.58, c: 0.77, f: 9.94, note: "Whole egg" },
            { name: "Tilapia, raw", cal: 96, p: 20.08, c: 0, f: 1.70, note: "Freshwater fish" },
            { name: "Catfish, raw", cal: 145, p: 18.0, c: 0, f: 8.0, note: "Common local fish" }
        ]
    },
    {
        category: "Legumes / Nuts / Seeds",
        items: [
            { name: "Kidney beans, raw", cal: 333, p: 23.58, c: 60.01, f: 0.83, note: "Soak and boil" },
            { name: "Chickpeas, raw", cal: 180, p: 9.54, c: 29.98, f: 2.99, note: "Garbanzo" },
            { name: "Lentils, raw", cal: 354, p: 25.00, c: 63.00, f: 1.10, note: "Cooked ~116kcal" },
            { name: "Peanuts (groundnut)", cal: 567, p: 25.80, c: 16.13, f: 49.24, note: "Roasted or paste" },
            { name: "Cashew nuts, raw", cal: 553, p: 18.22, c: 30.19, f: 43.85, note: "Snack or stew" },
            { name: "Sesame seeds", cal: 573, p: 17.73, c: 23.45, f: 49.67, note: "Beni seed" },
            { name: "Egusi (Pumpkin seeds)", cal: 541, p: 24.54, c: 17.81, f: 45.85, note: "Soup ingredient" },
            { name: "Soybeans, raw", cal: 446, p: 36.5, c: 30.2, f: 19.9, note: "Rich protein source" },
            { name: "Bambara groundnut", cal: 390, p: 20.0, c: 60.0, f: 6.5, note: "Okpa ingredient" }
        ]
    },
    {
        category: "Vegetables",
        items: [
            { name: "Okra, raw", cal: 31, p: 2.0, c: 7.03, f: 0.10, note: "Mucilaginous pod" },
            { name: "Spinach, raw", cal: 23, p: 2.9, c: 3.6, f: 0.4, note: "Leafy green" },
            { name: "Cabbage, raw", cal: 24, p: 1.44, c: 5.58, f: 0.12, note: "Salads or sauces" },
            { name: "Tomato, raw", cal: 18, p: 0.88, c: 3.92, f: 0.20, note: "Base for stew" },
            { name: "Carrot, raw", cal: 41, p: 0.93, c: 9.58, f: 0.24, note: "Root veg" },
            { name: "Cucumber, raw", cal: 15, p: 0.65, c: 3.63, f: 0.11, note: "Low calorie" },
            { name: "Green beans, raw", cal: 31, p: 1.82, c: 7.13, f: 0.12, note: "Boiled/stir-fried" },
            { name: "Bell pepper, raw", cal: 26, p: 0.99, c: 6.03, f: 0.30, note: "High Vit C" },
            { name: "Onion, raw", cal: 42, p: 0.92, c: 10.11, f: 0.08, note: "Flavor base" },
            { name: "Eggplant (Garden Egg)", cal: 24, p: 1.01, c: 5.70, f: 0.19, note: "Fried or stewed" },
            { name: "Bitter leaf", cal: 35, p: 3.0, c: 6.0, f: 0.5, note: "Low carb green" }
        ]
    },
    {
        category: "Fruits",
        items: [
            { name: "Mango, raw", cal: 65, p: 0.51, c: 17.0, f: 0.27, note: "High sugar" },
            { name: "Banana, raw", cal: 89, p: 1.09, c: 22.84, f: 0.33, note: "Dessert fruit" },
            { name: "Orange, raw", cal: 47, p: 0.94, c: 11.75, f: 0.12, note: "Vitamin C" },
            { name: "Watermelon, raw", cal: 30, p: 0.61, c: 7.55, f: 0.15, note: "High water" },
            { name: "Pineapple, raw", cal: 48, p: 0.54, c: 12.63, f: 0.12, note: "Contains bromelain" },
            { name: "Papaya (Pawpaw)", cal: 39, p: 0.6, c: 9.81, f: 0.14, note: "Fresh or stewed" },
            { name: "Guava, raw", cal: 68, p: 2.55, c: 14.32, f: 0.95, note: "Very high Vit C" },
            { name: "African Pear (Ube)", cal: 300, p: 10, c: 15, f: 25, note: "High fat fruit (roasted/boiled)" }
        ]
    },
    {
        category: "Condiments / Oils",
        items: [
            { name: "Palm Oil", cal: 884, p: 0, c: 0, f: 100, note: "High sat fat" },
            { name: "Palm Kernel Oil", cal: 862, p: 0, c: 0, f: 100, note: "Very high sat fat" },
            { name: "Peanut Oil", cal: 884, p: 0, c: 0, f: 100, note: "Common cooking oil" },
            { name: "Olive Oil", cal: 884, p: 0, c: 0, f: 100, note: "Imported" },
            { name: "Shea Butter", cal: 884, p: 0, c: 0, f: 100, note: "Cooking fat" }
        ]
    }
];

export const DAYS: DayName[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const MEALS: MealName[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

export const INITIAL_MEAL_PLAN: WeeklyPlan = DAYS.reduce((acc, day) => {
    acc[day] = MEALS.reduce((mAcc, meal) => {
        mAcc[meal] = { ingredients: [] };
        return mAcc;
    }, {} as Record<MealName, { ingredients: [] }>);
    return acc;
}, {} as WeeklyPlan);

// --- Calisthenics Skill Trees ---

export const CALISTHENICS_SKILLS: SkillLine[] = [
    {
        id: "push_basic",
        title: "PUSH • PUSH-UPS",
        color: "#a35b4d",
        nodes: [
            { id: "pu1", name: "Wall Push-Up", type: "reps", target: "3x20", met: 3.8, description: "Standing press against wall.", notes: "Keep body straight." },
            { id: "pu2", name: "Incline Push-Up", type: "reps", target: "3x15", met: 3.8, description: "Hands on bench/bar.", notes: "Lower chest to edge." },
            { id: "pu3", name: "Knee Push-Up", type: "reps", target: "3x15", met: 3.8, description: "Knees on ground.", notes: "Maintain hip line." },
            { id: "pu4", name: "Standard Push-Up", type: "reps", target: "3x20", met: 3.8, description: "Full plank position.", notes: "Chest to floor." },
            { id: "pu5", name: "Diamond Push-Up", type: "reps", target: "3x12", met: 7.5, description: "Hands touching.", notes: "Tricep dominance." },
            { id: "pu6", name: "Archer Push-Up", type: "reps", target: "3x10/side", met: 7.5, description: "Side-to-side shift.", notes: "Straight arm support." },
            { id: "pu7", name: "One-Arm Push-Up", type: "reps", target: "5/side", met: 8.0, description: "The apex press.", notes: "Feet wide for balance." }
        ]
    },
    {
        id: "push_planche",
        title: "PUSH • PLANCHE",
        color: "#a35b4d",
        nodes: [
            { id: "pl1", name: "Frog Stand", type: "static", target: "30s", met: 3.0, description: "Knees on elbows.", notes: "Balance focus." },
            { id: "pl2", name: "Tuck Planche", type: "static", target: "10s", met: 3.2, description: "Arms straight, knees tucked.", notes: "Scapular protraction." },
            { id: "pl3", name: "Adv. Tuck Planche", type: "static", target: "10s", met: 3.5, description: "Back flat, hips open.", notes: "Increased leverage." },
            { id: "pl4", name: "Straddle Planche", type: "static", target: "5s", met: 3.8, description: "Legs wide straight.", notes: "Forward lean." },
            { id: "pl5", name: "Full Planche", type: "static", target: "5s", met: 4.0, description: "Body straight horizontal.", notes: "Apex static hold." }
        ]
    },
    {
        id: "pull_basic",
        title: "PULL • PULL-UPS",
        color: "#4f5d4e",
        nodes: [
            { id: "pb1", name: "Wall/Door Pull", type: "reps", target: "3x15", met: 3.0, description: "Pulling against doorframe.", notes: "Scapular retraction." },
            { id: "pb2", name: "Inverted Row", type: "reps", target: "3x15", met: 3.8, description: "Horizontal pull under bar.", notes: "Chest to bar." },
            { id: "pb3", name: "Negative Pull-Up", type: "reps", target: "3x5 (5s)", met: 4.0, description: "Slow descent.", notes: "Control gravity." },
            { id: "pb4", name: "Pull-Up", type: "reps", target: "3x10", met: 5.0, description: "Chin over bar.", notes: "Full range." },
            { id: "pb5", name: "Narrow/Weighted", type: "reps", target: "3x8", met: 7.5, description: "Close grip or +weight.", notes: "Increased intensity." },
            { id: "pb6", name: "Archer Pull-Up", type: "reps", target: "3x5/side", met: 7.5, description: "Pull to one arm.", notes: "Straight assist arm." },
            { id: "pb7", name: "One-Arm Pull-Up", type: "reps", target: "1 rep", met: 8.0, description: "Apex vertical pull.", notes: "Anti-rotation." }
        ]
    },
    {
        id: "pull_front_lever",
        title: "PULL • FRONT LEVER",
        color: "#4f5d4e",
        nodes: [
            { id: "fl1", name: "Tuck Lever", type: "static", target: "10s", met: 3.0, description: "Hanging, knees to chest.", notes: "Back parallel." },
            { id: "fl2", name: "Adv. Tuck Lever", type: "static", target: "10s", met: 3.2, description: "Back flat.", notes: "Lats engaged." },
            { id: "fl3", name: "One-Leg Lever", type: "static", target: "10s", met: 3.5, description: "One leg extended.", notes: "Switch sides." },
            { id: "fl4", name: "Straddle Lever", type: "static", target: "5s", met: 3.8, description: "Legs wide.", notes: "Glutes active." },
            { id: "fl5", name: "Full Front Lever", type: "static", target: "5s", met: 4.0, description: "Straight body horizontal.", notes: "Apex hold." }
        ]
    },
    {
        id: "pull_back_lever",
        title: "PULL • BACK LEVER",
        color: "#4f5d4e",
        nodes: [
            { id: "bl1", name: "Tuck Back Lever", type: "static", target: "10s", met: 3.0, description: "Face down, tucked.", notes: "Skin the cat entry." },
            { id: "bl2", name: "Adv. Tuck Back", type: "static", target: "10s", met: 3.2, description: "Flat back.", notes: "Shoulder extension." },
            { id: "bl3", name: "Straddle Back", type: "static", target: "5s", met: 3.5, description: "Legs wide.", notes: "Glutes tight." },
            { id: "bl4", name: "Full Back Lever", type: "static", target: "5s", met: 3.8, description: "Straight body.", notes: "Apex posterior hold." }
        ]
    },
    {
        id: "core_dynamic",
        title: "CORE • LEG RAISES",
        color: "#2a2a2a",
        nodes: [
            { id: "cd1", name: "Lying Knee Raise", type: "reps", target: "3x15", met: 3.8, description: "Floor, knees to chest.", notes: "Flat lower back." },
            { id: "cd2", name: "Lying Leg Raise", type: "reps", target: "3x15", met: 3.8, description: "Straight legs up.", notes: "No swing." },
            { id: "cd3", name: "Hanging Knee Raise", type: "reps", target: "3x15", met: 4.5, description: "Hanging from bar.", notes: "Control swing." },
            { id: "cd4", name: "Hanging Leg Raise", type: "reps", target: "3x12", met: 5.0, description: "Toes to 90 degrees.", notes: "Compress abs." },
            { id: "cd5", name: "Toes-to-Bar", type: "reps", target: "3x10", met: 6.0, description: "Toes touch bar.", notes: "Full compression." }
        ]
    },
    {
        id: "core_static",
        title: "CORE • L-SIT / V-SIT",
        color: "#2a2a2a",
        nodes: [
            { id: "cs1", name: "Foot Supported L", type: "static", target: "20s", met: 3.0, description: "Hands on floor, feet down.", notes: "Depress shoulders." },
            { id: "cs2", name: "Tuck L-Sit", type: "static", target: "15s", met: 3.0, description: "Knees tucked, feet up.", notes: "Core brace." },
            { id: "cs3", name: "Full L-Sit", type: "static", target: "15s", met: 3.2, description: "Legs straight out.", notes: "Quad cramp warning." },
            { id: "cs4", name: "Straddle L-Sit", type: "static", target: "10s", met: 3.5, description: "Legs wide.", notes: "Hip flexor heavy." },
            { id: "cs5", name: "V-Sit", type: "static", target: "10s", met: 4.0, description: "Legs vertical.", notes: "Apex compression." }
        ]
    },
    {
        id: "balance",
        title: "BALANCE • HANDSTAND",
        color: "#2a2a2a",
        nodes: [
            { id: "ba1", name: "Wall Hold", type: "static", target: "45s", met: 3.0, description: "Chest to wall.", notes: "Alignment drill." },
            { id: "ba2", name: "Wall Walks", type: "reps", target: "3x3", met: 4.0, description: "Walk feet up wall.", notes: "Shoulder endurance." },
            { id: "ba3", name: "HS Kick-Ups", type: "reps", target: "10 attempts", met: 3.5, description: "Scissor kick entry.", notes: "Find balance point." },
            { id: "ba4", name: "Freestanding HS", type: "static", target: "10s", met: 3.5, description: "No wall support.", notes: "Finger control." }
        ]
    },
    {
        id: "legs",
        title: "LEGS • SQUAT / PISTOL",
        color: "#a35b4d",
        nodes: [
            { id: "lg1", name: "Air Squat", type: "reps", target: "3x20", met: 3.7, description: "Bodyweight squat.", notes: "Depth below parallel." },
            { id: "lg2", name: "Split Squat", type: "reps", target: "3x12/leg", met: 5.0, description: "Static lunge position.", notes: "Vertical torso." },
            { id: "lg3", name: "Assisted Pistol", type: "reps", target: "3x8/leg", met: 6.0, description: "Holding pole/TRX.", notes: "One leg focus." },
            { id: "lg4", name: "Box Pistol", type: "reps", target: "3x5/leg", met: 6.5, description: "Sit to box.", notes: "Control descent." },
            { id: "lg5", name: "Full Pistol", type: "reps", target: "3x5/leg", met: 7.5, description: "Unassisted one leg.", notes: "Mobility & Strength." }
        ]
    }
];
