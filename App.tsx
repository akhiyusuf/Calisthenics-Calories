import React, { useState } from 'react';
import StudioView from './views/StudioView';
import CalculatorView from './views/CalculatorView';
import MealPlanView from './views/MealPlanView';
import { MacroTargets, UserStats } from './types';

type View = 'studio' | 'calculator' | 'meals';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('calculator');
  const [userTargets, setUserTargets] = useState<MacroTargets | null>(null);
  
  // Hoist Stats to share weight with Studio View for Calorie Calc
  const [userStats, setUserStats] = useState<UserStats>({
      gender: 'male',
      age: 25,
      height: 175,
      weight: 70, // Default weight for calorie calc
      neck: 38,
      waist: 85,
      hip: 95,
      activity: 1.55
  });

  return (
    <div className="h-[100dvh] w-screen flex flex-col bg-plywood-light text-charcoal font-sans overflow-hidden">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center px-4 py-3 md:px-6 md:py-4 border-b-2 border-plywood-edge bg-plywood-light z-20 shrink-0 gap-3 md:gap-0">
        <div className="font-mono font-bold text-lg uppercase tracking-tight">Kinetic // Studio</div>
        <nav className="flex gap-2 md:gap-4 overflow-x-auto w-full md:w-auto justify-center no-scrollbar items-center">
          <button 
            onClick={() => setActiveView('calculator')}
            className={`font-mono text-xs md:text-sm px-3 py-1 border-b-2 transition-all hover:opacity-100 whitespace-nowrap ${activeView === 'calculator' ? 'border-charcoal opacity-100 font-bold' : 'border-transparent opacity-50'}`}
          >
            STATS
          </button>
          <div className="relative group">
            <button 
              onClick={() => userTargets && setActiveView('meals')}
              disabled={!userTargets}
              className={`font-mono text-xs md:text-sm px-3 py-1 border-b-2 transition-all whitespace-nowrap flex flex-col items-center leading-none gap-1
                ${activeView === 'meals' ? 'border-charcoal opacity-100 font-bold' : 'border-transparent'}
                ${!userTargets ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-100 cursor-pointer'}
              `}
            >
              MEAL PLAN
              {!userTargets && <span className="text-[9px] font-normal lowercase">(fill stats first)</span>}
            </button>
          </div>
          <button 
            onClick={() => setActiveView('studio')}
            className={`font-mono text-xs md:text-sm px-3 py-1 border-b-2 transition-all hover:opacity-100 whitespace-nowrap ${activeView === 'studio' ? 'border-charcoal opacity-100 font-bold' : 'border-transparent opacity-50'}`}
          >
            SKILLS & SPATIAL
          </button>
        </nav>
      </header>

      {/* Main View Container */}
      <main className="flex-1 relative overflow-hidden">
        {activeView === 'studio' && <StudioView userWeight={userStats.weight} />}
        {activeView === 'calculator' && (
            <CalculatorView 
                onUpdateTargets={setUserTargets} 
                stats={userStats}
                setStats={setUserStats}
            />
        )}
        {activeView === 'meals' && <MealPlanView targets={userTargets} />}
      </main>
    </div>
  );
};

export default App;
