import React, { useState } from 'react';
import { WeeklyPlan, MacroTargets, DayName, MealName, Ingredient, FoodItem } from '../types';
import { DAYS, MEALS, FOOD_DATABASE, INITIAL_MEAL_PLAN } from '../constants';

interface MealPlanViewProps {
    targets: MacroTargets | null;
}

const MealPlanView: React.FC<MealPlanViewProps> = ({ targets }) => {
    const [plan, setPlan] = useState<WeeklyPlan>(INITIAL_MEAL_PLAN);
    const [currentDay, setCurrentDay] = useState<DayName>('Monday');
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTarget, setEditingTarget] = useState<{day: DayName, meal: MealName} | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
    const [addConfig, setAddConfig] = useState({ weight: 100, method: 'none' });

    // Helpers
    const getSlotTotals = (ingredients: Ingredient[]) => {
        return ingredients.reduce((acc, ing) => ({
            cal: acc.cal + ing.cal,
            p: acc.p + ing.p,
            c: acc.c + ing.c,
            f: acc.f + ing.f,
        }), { cal: 0, p: 0, c: 0, f: 0 });
    };

    const getDayTotals = (day: DayName) => {
        let totals = { cal: 0, p: 0, c: 0, f: 0 };
        MEALS.forEach(meal => {
            const slotT = getSlotTotals(plan[day][meal].ingredients);
            totals.cal += slotT.cal;
            totals.p += slotT.p;
            totals.c += slotT.c;
            totals.f += slotT.f;
        });
        return totals;
    };

    const handleAddIngredient = () => {
        if (!selectedFood || !editingTarget) return;

        const ratio = addConfig.weight / 100;
        let addedFatPer100g = 0;
        let suffix = "";

        switch(addConfig.method) {
            case 'deep': addedFatPer100g = 14; suffix = " (Deep Fried)"; break;
            case 'shallow': addedFatPer100g = 6; suffix = " (Shallow Fried)"; break;
            case 'airfry': addedFatPer100g = 1; suffix = " (Air Fried)"; break;
            case 'stewed': addedFatPer100g = 5; suffix = " (Stewed)"; break;
            case 'boiled': suffix = " (Boiled)"; break;
        }

        const addedFat = addedFatPer100g * ratio;
        const newIng: Ingredient = {
            ...selectedFood,
            rawName: selectedFood.name,
            name: selectedFood.name + suffix,
            weight: addConfig.weight,
            cookingMethod: addConfig.method,
            cal: (selectedFood.cal * ratio) + (addedFat * 9),
            p: selectedFood.p * ratio,
            c: selectedFood.c * ratio,
            f: (selectedFood.f * ratio) + addedFat
        };

        const { day, meal } = editingTarget;
        const newPlan = { ...plan };
        newPlan[day][meal].ingredients.push(newIng);
        setPlan(newPlan);
        setSelectedFood(null);
        setAddConfig({ weight: 100, method: 'none' });
    };

    const removeIngredient = (index: number) => {
        if (!editingTarget) return;
        const { day, meal } = editingTarget;
        const newPlan = { ...plan };
        newPlan[day][meal].ingredients.splice(index, 1);
        setPlan(newPlan);
    };

    const openModal = (meal: MealName) => {
        setEditingTarget({ day: currentDay, meal });
        setIsModalOpen(true);
        setSearchTerm('');
        setSelectedFood(null);
    };

    const dayTotals = getDayTotals(currentDay);

    return (
        <div className="w-full h-full overflow-y-auto bg-plywood-light pb-20">
            <div className="max-w-4xl mx-auto p-4 md:p-8">
                {/* Target Dashboard */}
                <div className="bg-charcoal text-white p-6 rounded-lg shadow-[4px_4px_0_#bda98c] flex justify-between items-center mb-8">
                     <div className="text-center">
                         <span className={`block font-mono text-2xl font-bold ${targets && dayTotals.cal > targets.calories ? 'text-studio-red' : 'text-white'}`}>
                            {Math.round(dayTotals.cal)} <span className="text-sm font-normal text-gray-400">/ {targets?.calories || '--'}</span>
                         </span>
                         <span className="text-[10px] tracking-widest uppercase opacity-80">KCAL</span>
                     </div>
                     <div className="h-10 w-px bg-white/20"></div>
                     <div className="text-center">
                         <span className="block font-mono text-xl font-bold">{Math.round(dayTotals.p)} <span className="text-xs text-gray-500">/ {targets?.protein}</span></span>
                         <span className="text-[10px] tracking-widest uppercase opacity-80">PRO</span>
                     </div>
                     <div className="text-center">
                         <span className="block font-mono text-xl font-bold">{Math.round(dayTotals.f)} <span className="text-xs text-gray-500">/ {targets?.fat}</span></span>
                         <span className="text-[10px] tracking-widest uppercase opacity-80">FAT</span>
                     </div>
                     <div className="text-center">
                         <span className="block font-mono text-xl font-bold">{Math.round(dayTotals.c)} <span className="text-xs text-gray-500">/ {targets?.carb}</span></span>
                         <span className="text-[10px] tracking-widest uppercase opacity-80">CARB</span>
                     </div>
                </div>

                {/* Day Navigation */}
                <div className="flex justify-between gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
                    {DAYS.map(day => (
                        <button
                            key={day}
                            onClick={() => setCurrentDay(day)}
                            className={`flex-1 min-w-[80px] py-3 px-2 border rounded font-mono text-xs font-bold transition-all
                                ${currentDay === day 
                                    ? 'bg-charcoal text-white border-charcoal' 
                                    : 'bg-white text-charcoal border-plywood-edge hover:border-charcoal'}`}
                        >
                            {day.substring(0, 3).toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Slots Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {MEALS.map(meal => {
                        const ingredients = plan[currentDay][meal].ingredients;
                        const totals = getSlotTotals(ingredients);
                        const hasFood = ingredients.length > 0;

                        return (
                            <div 
                                key={meal} 
                                onClick={() => openModal(meal)}
                                className="bg-white border-2 border-charcoal rounded-lg shadow-[6px_6px_0_#bda98c] hover:-translate-y-1 hover:border-studio-green transition-transform cursor-pointer overflow-hidden flex flex-col min-h-[180px]"
                            >
                                <div className="bg-charcoal text-white p-3 font-mono font-bold text-sm uppercase flex justify-between">
                                    <span>{meal}</span>
                                    <span>{hasFood ? ingredients.length : '+'}</span>
                                </div>
                                <div className="p-6 flex-1 flex flex-col items-center justify-center">
                                    {hasFood ? (
                                        <>
                                            <div className="text-4xl font-mono font-bold leading-none mb-2">{Math.round(totals.cal)}</div>
                                            <div className="text-xs font-bold text-studio-green uppercase tracking-wider mb-4">KCAL</div>
                                            <div className="flex gap-4 text-xs font-mono">
                                                <span>P: {Math.round(totals.p)}</span>
                                                <span>F: {Math.round(totals.f)}</span>
                                                <span>C: {Math.round(totals.c)}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-sm italic text-gray-400">Tap to add food</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && editingTarget && (
                <div className="fixed inset-0 z-[100] bg-charcoal/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-plywood-light w-full max-w-lg h-[85vh] border-2 border-charcoal rounded-lg shadow-2xl flex flex-col overflow-hidden">
                        <div className="bg-charcoal text-white p-4 flex justify-between items-center shrink-0">
                            <div className="font-mono font-bold uppercase">{currentDay} • {editingTarget.meal}</div>
                            <button onClick={() => setIsModalOpen(false)} className="text-2xl hover:text-studio-red">&times;</button>
                        </div>

                        <div className="p-4 flex flex-col h-full overflow-hidden">
                            {/* Search */}
                            <input 
                                type="text"
                                placeholder="Search pantry..."
                                className="w-full p-4 border-2 border-charcoal rounded mb-4 focus:outline-none placeholder-gray-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            {/* Combined List Area: Current Ingredients + Library */}
                            <div className="flex-1 overflow-y-auto bg-white border border-plywood-edge rounded p-2 mb-4 relative">
                                
                                {/* SECTION: Current Plate */}
                                {plan[currentDay][editingTarget.meal].ingredients.length > 0 && (
                                    <div className="mb-6 bg-plywood-light/20 rounded p-2 border border-plywood-light">
                                        <div className="flex justify-between items-center mb-2 px-1">
                                            <span className="text-xs font-bold uppercase text-studio-green tracking-wider">On Your Plate</span>
                                            <span className="text-[10px] font-mono bg-studio-green text-white px-1.5 rounded-full">{plan[currentDay][editingTarget.meal].ingredients.length}</span>
                                        </div>
                                        {plan[currentDay][editingTarget.meal].ingredients.map((ing, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-2 bg-white border border-gray-100 rounded mb-1 shadow-sm">
                                                <div className="overflow-hidden">
                                                    <div className="font-bold text-sm truncate pr-2">{ing.name}</div>
                                                    <div className="text-[10px] text-gray-500 font-mono">{ing.weight}g • {Math.round(ing.cal)} kcal</div>
                                                </div>
                                                <button onClick={() => removeIngredient(idx)} className="text-gray-400 hover:text-studio-red transition-colors px-2 font-bold text-lg">&times;</button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* SECTION: Database */}
                                <div>
                                    <div className="sticky top-0 bg-white/95 backdrop-blur-sm p-2 font-mono font-bold text-xs uppercase text-charcoal border-b-2 border-charcoal mb-2 z-10 flex items-center gap-2">
                                        <span>{searchTerm ? 'Search Results' : 'Pantry / Database'}</span>
                                    </div>
                                    
                                    {FOOD_DATABASE.map((cat, i) => {
                                         const matches = searchTerm 
                                            ? cat.items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                            : cat.items;

                                        if (matches.length === 0) return null;

                                        return (
                                            <div key={i} className="mb-4">
                                                <div className="px-2 py-1 font-bold text-[10px] text-gray-400 uppercase tracking-widest border-b border-dotted border-gray-200 mb-1">
                                                    {cat.category}
                                                </div>
                                                {matches.map((food, j) => (
                                                    <div 
                                                        key={j} 
                                                        onClick={() => setSelectedFood(food)}
                                                        className={`group flex justify-between items-start p-3 cursor-pointer transition-all border-b border-gray-50 hover:bg-plywood-light/30 ${selectedFood?.name === food.name ? 'bg-plywood-light border-l-4 border-l-charcoal pl-2' : 'border-l-4 border-l-transparent'}`}
                                                    >
                                                        <div className="flex-1">
                                                            <div className="font-bold text-sm text-charcoal group-hover:text-studio-green transition-colors">{food.name}</div>
                                                            <div className="text-[10px] text-gray-400 italic">{food.note}</div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-mono text-xs font-bold">{Math.round(food.cal)} <span className="text-[8px] font-normal text-gray-400">KCAL</span></div>
                                                            <div className="text-[9px] font-mono text-gray-400 mt-0.5 space-x-1">
                                                                <span>P:{Math.round(food.p)}</span>
                                                                <span>C:{Math.round(food.c)}</span>
                                                                <span>F:{Math.round(food.f)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}
                                    
                                    {/* Empty Search State */}
                                    {searchTerm && FOOD_DATABASE.every(cat => cat.items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0) && (
                                        <div className="p-8 text-center">
                                            <div className="text-charcoal font-bold">No matches found</div>
                                            <div className="text-xs text-gray-500 mt-1">Try searching for generic terms like "Rice" or "Fish"</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Add Panel */}
                            {selectedFood && (
                                <div className="bg-charcoal text-white p-4 rounded shrink-0 flex flex-col gap-3 animate-in slide-in-from-bottom-2 shadow-2xl">
                                    <div className="font-bold text-sm border-b border-gray-600 pb-2">{selectedFood.name}</div>
                                    <div className="flex gap-2">
                                        <select 
                                            className="flex-1 bg-gray-700 border border-gray-600 rounded p-2 text-xs focus:outline-none focus:border-white"
                                            value={addConfig.method}
                                            onChange={(e) => setAddConfig(prev => ({ ...prev, method: e.target.value }))}
                                        >
                                            <option value="none">Prep: As Listed / None</option>
                                            <option value="boiled">Boiled</option>
                                            <option value="airfry">Air Fried (+1g Fat/100g)</option>
                                            <option value="shallow">Shallow Fried (+6g Fat/100g)</option>
                                            <option value="deep">Deep Fried (+14g Fat/100g)</option>
                                            <option value="stewed">Stew Base (+5g Fat/100g)</option>
                                        </select>
                                        <div className="flex items-center gap-1 bg-gray-700 rounded px-2 border border-gray-600">
                                            <input 
                                                type="number" 
                                                className="w-12 bg-transparent text-center focus:outline-none font-mono"
                                                value={addConfig.weight}
                                                onChange={(e) => setAddConfig(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                                            />
                                            <span className="text-xs text-gray-400">g</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleAddIngredient}
                                        className="w-full bg-studio-green hover:bg-opacity-90 py-3 rounded font-bold text-sm uppercase tracking-wide transition-colors"
                                    >
                                        Add to Meal
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MealPlanView;
