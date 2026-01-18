import React, { useState, useEffect } from 'react';
import { CALISTHENICS_SKILLS } from '../constants';
import { SkillNode, StudioNode, Session } from '../types';

interface StudioViewProps {
    userWeight: number; // in kg
}

type StudioMode = 'skills' | 'builder';

const StudioView: React.FC<StudioViewProps> = ({ userWeight }) => {
    const [mode, setMode] = useState<StudioMode>('skills');
    
    // --- SKILL TREE STATE ---
    const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
    const [trainingTime, setTrainingTime] = useState(1);
    const [masteredSkills, setMasteredSkills] = useState<string[]>([]);

    // --- SESSION BUILDER STATE ---
    const [nodes, setNodes] = useState<StudioNode[]>([]);
    const [sessionName, setSessionName] = useState("Untitled Session");
    const [savedSessions, setSavedSessions] = useState<Session[]>([]);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        const storedSessions = localStorage.getItem('kinetic_sessions');
        if (storedSessions) {
            try {
                setSavedSessions(JSON.parse(storedSessions));
            } catch (e) {
                console.error("Failed to load sessions", e);
            }
        }
    }, []);

    // Save to LocalStorage whenever sessions change
    useEffect(() => {
        localStorage.setItem('kinetic_sessions', JSON.stringify(savedSessions));
    }, [savedSessions]);

    // --- SKILL TREE HELPERS ---
    const isLocked = (lineId: string, nodeIndex: number) => {
        if (nodeIndex === 0) return false;
        const line = CALISTHENICS_SKILLS.find(l => l.id === lineId);
        if (!line) return true;
        const prevNodeId = line.nodes[nodeIndex - 1].id;
        return !masteredSkills.includes(prevNodeId);
    };

    const toggleMastery = (nodeId: string) => {
        setMasteredSkills(prev => 
            prev.includes(nodeId) ? prev.filter(id => id !== nodeId) : [...prev, nodeId]
        );
    };

    const calculateCalories = (met: number, minutes: number) => {
        const burnRatePerMinute = (met * 3.5 * userWeight) / 200;
        return Math.round(burnRatePerMinute * minutes);
    };

    // --- SESSION BUILDER HELPERS ---
    const addNode = (type: StudioNode['type']) => {
        const id = `node-${Date.now()}`;
        const labels = {
            warmup: "Dynamic Warmup",
            strength: "Strength Set",
            skill: "Skill Practice",
            cooldown: "Cool Down"
        };
        
        // Default to Reps for strength/skill, Timer for warmup/cool
        const defaultMode = (type === 'strength' || type === 'skill') ? 'reps' : 'timer';

        const newNodes = [...nodes, {
            id,
            type,
            label: labels[type],
            duration: 10,
            notes: '',
            mode: defaultMode,
            sets: 3,
            reps: 10
        }];
        setNodes(newNodes);
    };

    const updateNode = (id: string, field: keyof StudioNode, value: any) => {
        setNodes(prev => prev.map(n => n.id === id ? { ...n, [field]: value } : n));
    };

    const moveNode = (index: number, direction: -1 | 1) => {
        if (index + direction < 0 || index + direction >= nodes.length) return;
        const newNodes = [...nodes];
        const temp = newNodes[index];
        newNodes[index] = newNodes[index + direction];
        newNodes[index + direction] = temp;
        setNodes(newNodes);
    };

    const deleteNode = (id: string) => {
        setNodes(prev => prev.filter(n => n.id !== id));
    };

    // --- SESSION MANAGEMENT ---
    const saveSession = () => {
        if (!sessionName.trim()) {
            alert("Please enter a session name.");
            return;
        }

        const newSession: Session = {
            id: `session-${Date.now()}`,
            name: sessionName,
            updatedAt: Date.now(),
            nodes: nodes
        };
        
        // Check if updating existing by name (simple logic)
        const existingIndex = savedSessions.findIndex(s => s.name === sessionName);
        let updatedSessions;
        if (existingIndex >= 0) {
            updatedSessions = [...savedSessions];
            updatedSessions[existingIndex] = newSession;
        } else {
            updatedSessions = [...savedSessions, newSession];
        }
        setSavedSessions(updatedSessions);
    };

    const loadSession = (session: Session) => {
        setSessionName(session.name);
        setNodes(session.nodes);
        setIsLibraryOpen(false);
    };

    const deleteSession = (id: string) => {
        if (confirm("Delete this session permanently?")) {
            setSavedSessions(prev => prev.filter(s => s.id !== id));
        }
    };

    const clearSession = () => {
        setNodes([]);
        setSessionName("");
    };

    const getSessionTotals = () => {
        const totalTime = nodes.reduce((acc, n) => acc + (n.duration || 0), 0);
        const totalCal = nodes.reduce((acc, n) => {
            let met = 3.0;
            if (n.type === 'warmup') met = 3.5;
            if (n.type === 'strength') met = 6.0;
            if (n.type === 'skill') met = 4.0;
            if (n.type === 'cooldown') met = 2.5;
            return acc + calculateCalories(met, n.duration);
        }, 0);
        return { totalTime, totalCal };
    };

    const { totalTime, totalCal } = getSessionTotals();

    return (
        <div className="w-full h-full overflow-hidden bg-plywood-light relative flex flex-col font-sans text-charcoal">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none z-0"></div>

            {/* Header / Mode Switcher */}
            <div className="relative z-20 px-6 py-4 flex items-center justify-between border-b border-charcoal/20">
                <div className="flex gap-6">
                    <button 
                        onClick={() => setMode('skills')}
                        className={`text-xs font-mono font-bold tracking-widest uppercase transition-colors ${mode === 'skills' ? 'text-charcoal border-b-2 border-charcoal pb-1' : 'text-charcoal/40 hover:text-charcoal'}`}
                    >
                        Skill Progression
                    </button>
                    <button 
                        onClick={() => setMode('builder')}
                        className={`text-xs font-mono font-bold tracking-widest uppercase transition-colors ${mode === 'builder' ? 'text-charcoal border-b-2 border-charcoal pb-1' : 'text-charcoal/40 hover:text-charcoal'}`}
                    >
                        Session Builder
                    </button>
                </div>
            </div>

            {/* === SKILL TREE MODE === */}
            {mode === 'skills' && (
                <div className="flex-1 overflow-x-auto overflow-y-auto z-10 p-6 md:p-12 cursor-grab active:cursor-grabbing">
                    <div className="min-w-[1400px] pb-20 space-y-16">
                        {CALISTHENICS_SKILLS.map((line) => (
                            <div key={line.id} className="relative">
                                {/* Line Title - Technical Label Style */}
                                <div className="flex items-center mb-8 sticky left-0 group">
                                    <div className="w-2 h-2 bg-charcoal mr-3"></div>
                                    <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-charcoal">
                                        {line.title}
                                    </h2>
                                    <div className="ml-4 h-px w-32 bg-charcoal/20"></div>
                                </div>

                                {/* Nodes Container */}
                                <div className="flex items-start gap-12 pl-4">
                                    {line.nodes.map((node, index) => {
                                        const locked = isLocked(line.id, index);
                                        const mastered = masteredSkills.includes(node.id);
                                        
                                        return (
                                            <div key={node.id} className="flex items-center relative">
                                                {/* Connector Line */}
                                                {index > 0 && (
                                                    <div className={`absolute -left-12 top-1/2 w-12 h-px ${locked ? 'bg-charcoal/20 dashed' : 'bg-charcoal'}`}></div>
                                                )}

                                                {/* Node Box */}
                                                <button 
                                                    onClick={() => setSelectedSkill(node)}
                                                    disabled={locked && false}
                                                    className={`
                                                        relative w-40 h-32 flex flex-col justify-between p-4 text-left transition-all duration-200 border border-charcoal shadow-[4px_4px_0_rgba(42,42,42,0.1)]
                                                        ${locked 
                                                            ? 'border-dashed border-charcoal/30 bg-transparent text-charcoal/40 shadow-none' 
                                                            : mastered 
                                                                ? 'bg-charcoal text-white hover:bg-charcoal/90' 
                                                                : 'bg-white text-charcoal hover:-translate-y-1 hover:shadow-[6px_6px_0_#2a2a2a]'
                                                        }
                                                    `}
                                                >
                                                    <div className="flex justify-between items-start w-full">
                                                        <span className="font-mono text-[10px] opacity-60">
                                                            {index + 1}.0
                                                        </span>
                                                        {mastered && <span className="text-[10px] font-bold">✓</span>}
                                                        {locked && <span className="text-[10px]">🔒</span>}
                                                    </div>
                                                    
                                                    <div className="font-bold text-xs uppercase tracking-tight leading-snug">
                                                        {node.name}
                                                    </div>

                                                    <div className={`text-[10px] font-mono border-t pt-2 ${locked ? 'border-charcoal/20' : mastered ? 'border-white/20' : 'border-charcoal/20'}`}>
                                                        REQ: {node.target}
                                                    </div>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* === SESSION BUILDER MODE === */}
            {mode === 'builder' && (
                <div className="flex-1 overflow-y-auto relative bg-plywood-light">
                    <div className="max-w-3xl mx-auto p-4 md:p-8 pb-48">
                        
                        {/* Session Management Header */}
                        <div className="bg-charcoal text-white p-6 mb-8 border-2 border-charcoal shadow-[8px_8px_0_rgba(0,0,0,0.1)]">
                            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">Session Name</label>
                            <input 
                                type="text" 
                                value={sessionName}
                                onChange={(e) => setSessionName(e.target.value)}
                                className="bg-transparent border-b-2 border-gray-600 w-full text-2xl font-bold focus:outline-none focus:border-white placeholder-gray-700 text-white mb-6 uppercase tracking-tight"
                                placeholder="UNTITLED SESSION"
                            />
                            <div className="flex flex-wrap gap-3">
                                <button 
                                    onClick={clearSession} 
                                    className="flex-1 md:flex-none px-6 py-3 border-2 border-gray-600 hover:border-white text-xs font-mono font-bold uppercase transition-colors tracking-widest"
                                >
                                    New
                                </button>
                                <button 
                                    onClick={() => setIsLibraryOpen(true)} 
                                    className="flex-1 md:flex-none px-6 py-3 border-2 border-gray-600 hover:border-white text-xs font-mono font-bold uppercase transition-colors tracking-widest"
                                >
                                    Library
                                </button>
                                <button 
                                    onClick={saveSession} 
                                    className="flex-1 md:flex-none px-6 py-3 bg-white text-charcoal border-2 border-white hover:bg-gray-200 text-xs font-mono font-bold uppercase transition-colors tracking-widest"
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        {/* Stats Summary */}
                        <div className="flex justify-end gap-6 mb-4 font-mono text-xs font-bold uppercase tracking-wider text-charcoal/60">
                            <div>Duration: <span className="text-charcoal text-lg">{totalTime}m</span></div>
                            <div>Burn: <span className="text-charcoal text-lg">{totalCal}</span> kcal</div>
                        </div>

                        {/* Node List (Monochrome Blocky Cards) */}
                        <div className="space-y-6">
                            {nodes.length === 0 && (
                                <div className="h-48 border-4 border-dashed border-charcoal/10 flex flex-col items-center justify-center text-charcoal/30">
                                    <span className="text-4xl mb-2 font-thin">+</span>
                                    <span className="font-mono uppercase font-bold text-xs tracking-widest">Add Blocks Below</span>
                                </div>
                            )}

                            {nodes.map((node, index) => {
                                const isReps = node.mode === 'reps';
                                return (
                                    <div 
                                        key={node.id} 
                                        className="relative bg-white border-2 border-charcoal shadow-[6px_6px_0_#2a2a2a] transition-all hover:-translate-y-0.5"
                                    >
                                        {/* Card Header: Light BG now, with toggle */}
                                        <div className="flex justify-between items-stretch border-b-2 border-charcoal bg-white h-10">
                                            {/* Index & Type: High visibility now */}
                                            <div className="px-3 border-r-2 border-charcoal font-mono text-[10px] font-bold uppercase tracking-wider flex items-center bg-gray-100 text-charcoal">
                                                {(index + 1).toString().padStart(2, '0')} • {node.type}
                                            </div>
                                            
                                            {/* Mode Toggle & Duration */}
                                            <div className="flex items-center">
                                                <button 
                                                    onClick={() => updateNode(node.id, 'mode', isReps ? 'timer' : 'reps')}
                                                    className="h-full px-3 border-l-2 border-charcoal hover:bg-gray-100 transition-colors flex items-center gap-2"
                                                    title={isReps ? "Switch to Timer" : "Switch to Reps"}
                                                >
                                                    <span className={`w-3 h-3 border border-charcoal rounded-sm ${!isReps ? 'bg-charcoal' : ''}`}></span>
                                                    <span className="text-[9px] font-bold uppercase">{isReps ? 'REPS' : 'TIME'}</span>
                                                </button>
                                                
                                                {/* Est Time Field - Always visible but smaller in Reps mode */}
                                                <div className="flex items-center px-3 border-l-2 border-charcoal bg-gray-50 h-full min-w-[80px] justify-end">
                                                     <input
                                                        type="number"
                                                        value={node.duration}
                                                        onChange={(e) => updateNode(node.id, 'duration', Math.max(1, parseInt(e.target.value) || 0))}
                                                        className="w-8 text-right font-bold text-sm focus:outline-none focus:bg-white bg-transparent"
                                                     />
                                                     <span className="text-[9px] font-bold ml-1 uppercase text-gray-400">MIN</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-4 flex flex-col gap-4">
                                            {/* Main Title Input */}
                                            <input 
                                                value={node.label} 
                                                onChange={(e) => updateNode(node.id, 'label', e.target.value)}
                                                className="text-lg font-bold w-full uppercase focus:outline-none focus:border-b-2 focus:border-charcoal bg-transparent placeholder-gray-300" 
                                                placeholder="ACTIVITY NAME"
                                            />

                                            {/* Reps/Sets Inputs (Visible only in Reps Mode) */}
                                            {isReps && (
                                                <div className="flex gap-4">
                                                    <div className="flex-1 bg-gray-50 border-2 border-charcoal p-2 flex flex-col items-center">
                                                        <span className="text-[9px] font-bold uppercase text-gray-400 mb-1">SETS</span>
                                                        <input 
                                                            type="number" 
                                                            value={node.sets || 3}
                                                            onChange={(e) => updateNode(node.id, 'sets', Math.max(1, parseInt(e.target.value) || 1))}
                                                            className="w-full text-center bg-transparent font-mono font-bold text-xl focus:outline-none"
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-center font-bold text-charcoal/30 text-xl">×</div>
                                                    <div className="flex-1 bg-gray-50 border-2 border-charcoal p-2 flex flex-col items-center">
                                                        <span className="text-[9px] font-bold uppercase text-gray-400 mb-1">REPS</span>
                                                        <input 
                                                            type="number" 
                                                            value={node.reps || 10}
                                                            onChange={(e) => updateNode(node.id, 'reps', Math.max(1, parseInt(e.target.value) || 1))}
                                                            className="w-full text-center bg-transparent font-mono font-bold text-xl focus:outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Notes Area */}
                                            <textarea 
                                                value={node.notes || ''} 
                                                onChange={(e) => updateNode(node.id, 'notes', e.target.value)}
                                                className="text-xs font-mono bg-gray-50 p-2 w-full focus:outline-none border border-transparent focus:border-charcoal/20 resize-none h-16 text-gray-600" 
                                                placeholder="// Add technical notes..."
                                            />
                                        </div>

                                        {/* Card Footer: Controls */}
                                        <div className="grid grid-cols-3 border-t-2 border-charcoal divide-x-2 divide-charcoal h-10">
                                             <button 
                                                onClick={() => moveNode(index, -1)}
                                                disabled={index === 0}
                                                className="hover:bg-charcoal hover:text-white transition-colors disabled:opacity-20 flex items-center justify-center"
                                             >
                                                <span className="text-[10px]">▲</span>
                                             </button>
                                             <button 
                                                onClick={() => deleteNode(node.id)}
                                                className="hover:bg-charcoal hover:text-white transition-colors flex items-center justify-center group"
                                             >
                                                <span className="text-lg leading-none font-bold group-hover:text-red-400">×</span>
                                             </button>
                                             <button 
                                                onClick={() => moveNode(index, 1)}
                                                disabled={index === nodes.length - 1}
                                                className="hover:bg-charcoal hover:text-white transition-colors disabled:opacity-20 flex items-center justify-center"
                                             >
                                                <span className="text-[10px]">▼</span>
                                             </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bottom Toolbar - Monochrome */}
                        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 w-full max-w-lg px-4">
                             <div className="bg-white border-2 border-charcoal p-1.5 flex gap-1.5 shadow-[4px_4px_0_#2a2a2a]">
                                 <button onClick={() => addNode('warmup')} className="flex-1 py-3 border-2 border-transparent hover:border-charcoal hover:bg-gray-100 font-bold text-[10px] uppercase tracking-wider text-charcoal transition-all">
                                     Warmup
                                 </button>
                                 <button onClick={() => addNode('skill')} className="flex-1 py-3 border-2 border-transparent hover:border-charcoal hover:bg-gray-100 font-bold text-[10px] uppercase tracking-wider text-charcoal transition-all">
                                     Skill
                                 </button>
                                 <button onClick={() => addNode('strength')} className="flex-1 py-3 border-2 border-transparent hover:border-charcoal hover:bg-gray-100 font-bold text-[10px] uppercase tracking-wider text-charcoal transition-all">
                                     Strength
                                 </button>
                                 <button onClick={() => addNode('cooldown')} className="flex-1 py-3 border-2 border-transparent hover:border-charcoal hover:bg-gray-100 font-bold text-[10px] uppercase tracking-wider text-charcoal transition-all">
                                     Cool
                                 </button>
                             </div>
                        </div>

                    </div>
                </div>
            )}

            {/* === LIBRARY MODAL === */}
            {isLibraryOpen && (
                <div className="fixed inset-0 z-50 bg-charcoal/90 backdrop-blur-sm flex justify-end">
                    <div className="w-full max-w-md h-full bg-plywood-light border-l-2 border-charcoal shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-6 border-b-2 border-charcoal bg-white flex justify-between items-center">
                            <h3 className="font-mono font-bold text-xl uppercase">Session Library</h3>
                            <button onClick={() => setIsLibraryOpen(false)} className="text-2xl hover:text-gray-500">&times;</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {savedSessions.length === 0 ? (
                                <div className="text-center py-10 opacity-50 font-mono text-sm">No saved sessions found.</div>
                            ) : (
                                savedSessions.map(session => (
                                    <div key={session.id} className="bg-white border-2 border-charcoal p-4 shadow-[4px_4px_0_rgba(0,0,0,0.1)] hover:shadow-[6px_6px_0_rgba(0,0,0,0.1)] transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-lg leading-tight uppercase">{session.name}</h4>
                                            <span className="text-[10px] font-mono text-gray-500">
                                                {new Date(session.updatedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="text-xs font-mono text-gray-500 mb-4">
                                            {session.nodes.length} Blocks • {session.nodes.reduce((a,b) => a + (b.duration||0), 0)} Mins
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => loadSession(session)} 
                                                className="flex-1 py-2 bg-charcoal text-white text-xs font-mono uppercase font-bold hover:bg-studio-green transition-colors border-2 border-charcoal"
                                            >
                                                Load
                                            </button>
                                            <button 
                                                onClick={() => deleteSession(session.id)} 
                                                className="px-3 py-2 border-2 border-charcoal text-charcoal text-xs font-mono uppercase font-bold hover:bg-charcoal hover:text-white transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* === CALISTHENICS MODAL === */}
            {selectedSkill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-plywood-light/90 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md border-2 border-charcoal shadow-[8px_8px_0_#2a2a2a] relative animate-in zoom-in-95 duration-200">
                        <div className="border-b-2 border-charcoal p-6 flex justify-between items-start bg-charcoal text-white">
                            <div>
                                <div className="text-[10px] font-mono uppercase tracking-widest opacity-60 mb-2">Technical Specification</div>
                                <h3 className="text-2xl font-bold uppercase leading-none">{selectedSkill.name}</h3>
                            </div>
                            <button onClick={() => setSelectedSkill(null)} className="text-2xl leading-none hover:text-gray-400">&times;</button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-px bg-charcoal/10 border border-charcoal/10">
                                <div className="bg-white p-3">
                                    <span className="block text-[10px] font-mono uppercase text-gray-400">Type</span>
                                    <span className="font-bold text-sm uppercase">{selectedSkill.type}</span>
                                </div>
                                <div className="bg-white p-3">
                                    <span className="block text-[10px] font-mono uppercase text-gray-400">Target</span>
                                    <span className="font-bold text-sm">{selectedSkill.target}</span>
                                </div>
                                <div className="bg-white p-3">
                                    <span className="block text-[10px] font-mono uppercase text-gray-400">MET Value</span>
                                    <span className="font-bold text-sm">{selectedSkill.met}</span>
                                </div>
                                <div className="bg-white p-3">
                                    <span className="block text-[10px] font-mono uppercase text-gray-400">Status</span>
                                    <span className="font-bold text-sm uppercase">{masteredSkills.includes(selectedSkill.id) ? 'Mastered' : 'In Progress'}</span>
                                </div>
                            </div>
                            
                            <p className="font-serif italic text-charcoal/80 border-l-4 border-charcoal pl-4 py-1 text-sm bg-gray-50 p-2">
                                {selectedSkill.description} {selectedSkill.notes}
                            </p>

                            <div className="bg-gray-50 border-2 border-charcoal/10 p-4">
                                <h4 className="font-mono text-[10px] uppercase font-bold mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-charcoal"></div>
                                    Output Calculator
                                </h4>
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="number" 
                                        value={trainingTime} 
                                        onChange={(e) => setTrainingTime(Math.max(1, parseInt(e.target.value) || 0))} 
                                        className="w-16 bg-white border-b-2 border-charcoal p-1 font-mono text-lg focus:outline-none text-center" 
                                    />
                                    <span className="text-xs font-mono text-gray-400">MINS</span>
                                    <span className="flex-1 h-px bg-charcoal/10"></span>
                                    <span className="font-mono text-xl font-bold">{calculateCalories(selectedSkill.met, trainingTime)}</span>
                                    <span className="text-xs font-mono text-gray-400">KCAL</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => toggleMastery(selectedSkill.id)} 
                                className={`w-full py-4 font-mono text-xs font-bold uppercase tracking-widest border-2 transition-all shadow-[4px_4px_0_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none
                                    ${masteredSkills.includes(selectedSkill.id) 
                                        ? 'bg-white text-charcoal border-charcoal hover:bg-gray-100' 
                                        : 'bg-charcoal text-white border-charcoal hover:bg-charcoal/90'}`
                                }
                            >
                                {masteredSkills.includes(selectedSkill.id) ? 'Mark Incomplete' : 'Confirm Mastery'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudioView;
