import React, { useState } from 'react';
import { UserStats, MacroTargets } from '../types';

interface CalculatorViewProps {
    onUpdateTargets: (targets: MacroTargets) => void;
    stats: UserStats;
    setStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

const CalculatorView: React.FC<CalculatorViewProps> = ({ onUpdateTargets, stats, setStats }) => {
    // Units state can remain local as it is UI preference
    const [units, setUnits] = useState({
        height: 'cm',
        weight: 'kg',
        measure: 'cm'
    });

    const [result, setResult] = useState<MacroTargets | null>(null);

    const handleChange = (field: keyof UserStats, value: any) => {
        setStats(prev => ({ ...prev, [field]: value }));
    };

    const toggleUnit = (type: 'height' | 'weight' | 'measure') => {
        setUnits(prev => {
            if (type === 'height') return { ...prev, height: prev.height === 'cm' ? 'in' : 'cm' };
            if (type === 'weight') return { ...prev, weight: prev.weight === 'kg' ? 'lbs' : 'kg' };
            return { ...prev, measure: prev.measure === 'cm' ? 'in' : 'cm' };
        });
    };

    const calculate = () => {
        // Normalize to Metric for calculation
        const h = units.height === 'in' ? stats.height * 2.54 : stats.height;
        const w = units.weight === 'lbs' ? stats.weight * 0.453592 : stats.weight;
        const n = units.measure === 'in' ? stats.neck * 2.54 : stats.neck;
        const wst = units.measure === 'in' ? stats.waist * 2.54 : stats.waist;
        const hip = units.measure === 'in' ? stats.hip * 2.54 : stats.hip;

        if (!h || !w || !n || !wst) return;

        // Navy Body Fat Formula
        let bodyFat = 0;
        if (stats.gender === 'male') {
            bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(wst - n) + 0.15456 * Math.log10(h)) - 450;
        } else {
            bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(wst + hip - n) + 0.22100 * Math.log10(h)) - 450;
        }
        bodyFat = Math.max(2, Math.min(70, bodyFat));

        const lbm = w * (1 - (bodyFat / 100));
        const bmr = 370 + (21.6 * lbm);
        const tdee = Math.round(bmr * stats.activity);

        const targets: MacroTargets = {
            calories: tdee,
            protein: Math.round((tdee * 0.30) / 4),
            fat: Math.round((tdee * 0.35) / 9),
            carb: Math.round((tdee * 0.35) / 4),
            lbm: parseFloat(lbm.toFixed(1)),
            bodyFat: parseFloat(bodyFat.toFixed(1))
        };

        setResult(targets);
        onUpdateTargets(targets);
    };

    return (
        <div className="w-full h-full overflow-y-auto p-4 bg-plywood-light">
            <div className="max-w-2xl mx-auto mt-8 p-8 bg-white border-2 border-charcoal shadow-[8px_8px_0px_#bda98c] rounded-lg">
                <div className="font-mono font-bold text-xl uppercase mb-6 pb-2 border-b-2 border-plywood-light">
                    Composition & Energy
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-2">Gender</label>
                        <select 
                            className="w-full p-3 bg-plywood-light border border-charcoal rounded focus:outline-none focus:border-studio-green"
                            value={stats.gender}
                            onChange={(e) => handleChange('gender', e.target.value)}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase mb-2">Age</label>
                        <input 
                            type="number" 
                            className="w-full p-3 bg-plywood-light border border-charcoal rounded focus:outline-none"
                            value={stats.age}
                            onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold uppercase">Height</label>
                            <button onClick={() => toggleUnit('height')} className="text-[10px] bg-charcoal text-white px-2 py-0.5 rounded uppercase font-mono">{units.height}</button>
                        </div>
                        <input 
                            type="number" 
                            className="w-full p-3 bg-plywood-light border border-charcoal rounded focus:outline-none"
                            value={stats.height}
                            onChange={(e) => handleChange('height', parseFloat(e.target.value) || 0)}
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold uppercase">Weight</label>
                            <button onClick={() => toggleUnit('weight')} className="text-[10px] bg-charcoal text-white px-2 py-0.5 rounded uppercase font-mono">{units.weight}</button>
                        </div>
                        <input 
                            type="number" 
                            className="w-full p-3 bg-plywood-light border border-charcoal rounded focus:outline-none"
                            value={stats.weight}
                            onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)}
                        />
                    </div>
                </div>

                <div className="border-t border-dashed border-plywood-edge pt-4 mt-2">
                    <label className="block text-xs font-bold uppercase text-studio-red mb-3">Composition Measurements</label>
                    <div className="grid grid-cols-2 gap-4 mb-5">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-bold uppercase">Neck</label>
                                <button onClick={() => toggleUnit('measure')} className="text-[10px] bg-plywood-edge text-white px-2 py-0.5 rounded uppercase font-mono hover:bg-charcoal transition-colors">{units.measure}</button>
                            </div>
                            <input 
                                type="number" 
                                className="w-full p-3 bg-plywood-light border border-charcoal rounded focus:outline-none"
                                value={stats.neck}
                                onChange={(e) => handleChange('neck', parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-bold uppercase">Waist</label>
                                <button onClick={() => toggleUnit('measure')} className="text-[10px] bg-plywood-edge text-white px-2 py-0.5 rounded uppercase font-mono hover:bg-charcoal transition-colors">{units.measure}</button>
                            </div>
                            <input 
                                type="number" 
                                className="w-full p-3 bg-plywood-light border border-charcoal rounded focus:outline-none"
                                value={stats.waist}
                                onChange={(e) => handleChange('waist', parseFloat(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    {stats.gender === 'female' && (
                        <div className="mb-5">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-bold uppercase">Hips</label>
                                <button onClick={() => toggleUnit('measure')} className="text-[10px] bg-plywood-edge text-white px-2 py-0.5 rounded uppercase font-mono hover:bg-charcoal transition-colors">{units.measure}</button>
                            </div>
                            <input 
                                type="number" 
                                className="w-full p-3 bg-plywood-light border border-charcoal rounded focus:outline-none"
                                value={stats.hip}
                                onChange={(e) => handleChange('hip', parseFloat(e.target.value) || 0)}
                            />
                        </div>
                    )}
                </div>

                <div className="mb-6">
                    <label className="block text-xs font-bold uppercase mb-2">Activity Level</label>
                    <select 
                        className="w-full p-3 bg-plywood-light border border-charcoal rounded focus:outline-none"
                        value={stats.activity}
                        onChange={(e) => handleChange('activity', parseFloat(e.target.value))}
                    >
                        <option value="1.2">Sedentary (Office job)</option>
                        <option value="1.375">Light Exercise (1-2 days/wk)</option>
                        <option value="1.55">Moderate Exercise (3-5 days/wk)</option>
                        <option value="1.725">Heavy Exercise (6-7 days/wk)</option>
                        <option value="1.9">Athlete (2x per day)</option>
                    </select>
                </div>

                <button 
                    onClick={calculate}
                    className="w-full p-4 bg-charcoal text-white font-mono font-bold hover:bg-studio-green transition-colors rounded shadow-lg active:translate-y-1 active:shadow-none"
                >
                    CALCULATE TARGETS
                </button>

                {result && (
                    <div className="mt-8 p-6 bg-studio-green text-white rounded grid grid-cols-2 gap-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-2">
                            <span className="block text-3xl font-mono font-bold">{result.bodyFat}%</span>
                            <span className="text-[10px] uppercase opacity-80 tracking-widest">Est. Body Fat</span>
                        </div>
                        <div className="p-2">
                            <span className="block text-3xl font-mono font-bold">{result.lbm}</span>
                            <span className="text-[10px] uppercase opacity-80 tracking-widest">LBM (kg)</span>
                        </div>
                        <div className="col-span-2 border-t border-white/20 pt-4 mt-2">
                            <span className="block text-5xl font-mono font-bold text-plywood-light">{result.calories}</span>
                            <span className="text-xs uppercase opacity-80 tracking-widest">Daily Maintenance (TDEE)</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="h-20"></div> {/* Spacer */}
        </div>
    );
};

export default CalculatorView;
