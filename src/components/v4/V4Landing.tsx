<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dwelliq | Enterprise AI Interior Platform</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js"></script>
    <script src="https://unpkg.com/@react-three/fiber@8.15.11/dist/react-three-fiber.umd.js"></script>
    <script src="https://unpkg.com/@react-three/drei@9.88.16/dist/index-umd.js"></script>
    <script src="https://unpkg.com/framer-motion@10.16.4/dist/framer-motion.js"></script>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        :root { 
            --gold: #B68953; 
            --dark: #121212; 
            --cream: #F7F3EE;
            --glass-bg: rgba(255, 255, 255, 0.7);
        }
        
        body { 
            margin: 0; padding: 0; font-family: 'DM Sans', sans-serif; 
            background-color: var(--cream); color: var(--dark); overflow: hidden; 
        }
        
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        .glass-panel { 
            background: var(--glass-bg); 
            backdrop-filter: blur(20px); 
            border: 1px solid rgba(255, 255, 255, 0.5); 
        }

        .decision-card { 
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            border: 1px solid rgba(0,0,0,0.05);
        }
        
        .decision-card.active { 
            border-color: var(--gold); 
            background: white; 
            transform: translateX(-8px) scale(1.02);
            box-shadow: 0 25px 50px -12px rgba(182, 137, 83, 0.2); 
        }

        .status-dot {
            width: 8px; height: 8px; border-radius: 50%;
            background: #10B981;
            box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
        }

        /* 3D Canvas Handling */
        canvas { touch-action: none; cursor: grab; }
        canvas:active { cursor: grabbing; }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect, useRef } = React;
        const { Canvas } = ReactThreeFiber;
        const { Float, Environment, PerspectiveCamera, OrbitControls, ContactShadows, SpotLight } = Drei;
        const { motion, AnimatePresence } = FramerMotion;

        // --- 3D ENGINE COMPONENTS ---
        const InteriorScene = ({ activeStyle }) => {
            return (
                <group position={[0, -1, 0]}>
                    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
                        {/* Floor Slab */}
                        <mesh receiveShadow position={[0, -0.05, 0]}>
                            <boxGeometry args={[6, 0.1, 6]} />
                            <meshStandardMaterial color="#EAE3D9" roughness={1} />
                        </mesh>
                        
                        {/* Furniture Placeholder */}
                        <mesh castShadow position={[0, 0.5, 0]}>
                            <boxGeometry args={[3, 0.8, 1.2]} />
                            <meshStandardMaterial color={activeStyle === 2 ? "#B68953" : "#4A4A4A"} />
                        </mesh>
                    </Float>

                    <ContactShadows opacity={0.3} scale={10} blur={2.4} far={4} />
                    <Environment preset="apartment" />
                </group>
            );
        };

        // --- UI MODULES ---
        const Navbar = () => (
            <nav className="fixed top-0 w-full p-10 flex justify-between items-center z-50 pointer-events-none">
                <div className="pointer-events-auto">
                    <div className="font-serif text-4xl italic tracking-tighter leading-none">dwelliq</div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-stone-400 mt-1">Enterprise Design OS</div>
                </div>
                
                <div className="flex gap-6 pointer-events-auto items-center">
                    <div className="flex -space-x-2 mr-4">
                        <div className="w-10 h-10 rounded-full border-4 border-cream bg-stone-200 flex items-center justify-center text-[10px] font-bold">JD</div>
                        <div className="w-10 h-10 rounded-full border-4 border-cream bg-gold flex items-center justify-center text-[10px] font-bold text-white">AI</div>
                    </div>
                    <button className="bg-white px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest shadow-sm hover:shadow-md transition-all">Invite Stakeholder</button>
                </div>
            </nav>
        );

        const DecisionSidebar = ({ selectedIdx, setSelected }) => {
            const options = [
                { id: 0, tag: "Option A // Budget", name: "IKEA JÄTTEBO Modular", price: "$1,240", desc: "Standard poly-fill, fast delivery.", source: "IKEA Global" },
                { id: 1, tag: "Option B // Investment", name: "Mario Bellini Camaleonda", price: "$4,800", desc: "Premium mohair, modular versatility.", source: "Eternity Modern" },
                { id: 2, tag: "Option C // Local Hero", name: "Custom Jersey City Velvet", price: "$6,200", desc: "Hand-stitched in JC, sustainable frame.", source: "Grove St. Studios" }
            ];

            return (
                <motion.div 
                    initial={{ x: 450 }} animate={{ x: 0 }}
                    className="fixed right-0 top-0 h-full w-[420px] glass-panel p-10 z-50 flex flex-col shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.05)]"
                >
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="status-dot"></div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600">Session Live</span>
                        </div>
                        <h2 className="text-5xl font-serif leading-tight">Master <br/>Living Suite</h2>
                    </div>

                    <div className="flex-1 space-y-6 overflow-y-auto pr-2">
                        {options.map((opt) => (
                            <div 
                                key={opt.id}
                                onClick={() => setSelected(opt.id)}
                                className={`decision-card p-8 rounded-[2rem] cursor-pointer ${selectedIdx === opt.id ? 'active' : 'hover:bg-white/40'}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-[10px] font-mono tracking-tighter ${selectedIdx === opt.id ? 'text-gold' : 'text-stone-400'}`}>{opt.tag}</span>
                                    <span className="font-bold text-lg">{opt.price}</span>
                                </div>
                                <h4 className="text-xl font-medium mb-2">{opt.name}</h4>
                                <p className="text-sm text-stone-500 leading-relaxed mb-4">{opt.desc}</p>
                                <div className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Via {opt.source}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 pt-8 border-t border-stone-200">
                        <button className="w-full bg-stone-900 py-5 rounded-2xl font-bold text-xs uppercase tracking-[0.3em] text-white hover:bg-gold transition-all duration-500">
                            Approve Decision
                        </button>
                        <p className="text-center text-[10px] text-stone-400 mt-4 font-medium uppercase tracking-widest">Decision syncs to project budget</p>
                    </div>
                </motion.div>
            );
        };

        const AIThoughtTrack = () => (
            <motion.div 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-12 left-12 max-w-sm glass-panel p-8 rounded-[2.5rem] z-40 border-white/80 shadow-2xl"
            >
                <div className="flex gap-4 items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-white font-bold text-xs">AI</div>
                    <div>
                        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold leading-none">Thinking...</div>
                        <div className="text-[11px] text-stone-400 font-bold uppercase tracking-widest mt-1">Spatial Engine v4.2</div>
                    </div>
                </div>
                <p className="text-[14px] text-stone-800 leading-relaxed font-light italic">
                    "Option C matches the ceiling height best. Local sourcing reduces your carbon footprint by 40% and ensures a 2-week delivery window vs 12 weeks for overseas shipping."
                </p>
            </motion.div>
        );

        const FloorPlanMiniMap = () => (
            <div className="fixed bottom-12 right-[460px] glass-panel p-6 rounded-3xl hidden xl:block z-40 border-stone-200 shadow-lg">
                <div className="w-40 h-28 border border-dashed border-stone-300 rounded-xl relative flex items-center justify-center overflow-hidden">
                    <div className="absolute w-16 h-8 bg-gold/20 border border-gold/40 rounded-sm"></div>
                    <div className="text-[8px] font-mono uppercase tracking-widest text-stone-400 absolute top-2">Zone: Living</div>
                </div>
                <div className="mt-3 flex justify-between items-center px-1">
                    <span className="text-[9px] font-bold uppercase text-stone-500">Symmetry Score</span>
                    <span className="text-[9px] font-mono text-gold">98.4%</span>
                </div>
            </div>
        );

        // --- MAIN APP COMPONENT ---
        const App = () => {
            const [selectedIdx, setSelected] = useState(2);

            return (
                <div className="relative h-screen w-full select-none">
                    <Navbar />
                    
                    {/* Immersive Rendering Engine */}
                    <div className="absolute inset-0 z-0">
                        <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
                            <PerspectiveCamera makeDefault position={[6, 4, 10]} fov={30} />
                            <ambientLight intensity={0.6} />
                            <SpotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
                            <InteriorScene activeStyle={selectedIdx} />
                            <OrbitControls 
                                makeDefault 
                                enableZoom={false} 
                                maxPolarAngle={Math.PI / 2.1} 
                                minPolarAngle={Math.PI / 4}
                            />
                        </Canvas>
                    </div>

                    <DecisionSidebar selectedIdx={selectedIdx} setSelected={setSelected} />
                    <AIThoughtTrack />
                    <FloorPlanMiniMap />

                    {/* Aesthetic Background Accents */}
                    <div className="absolute top-1/2 left-20 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                        <h1 className="text-[20rem] font-serif italic font-light">Suite</h1>
                    </div>
                </div>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
