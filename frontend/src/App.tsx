import React, { useState } from 'react';
import Snowfall from 'react-snowfall';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { AllTools } from './pages/AllTools';
import { ToolExecutor } from './pages/ToolExecutor';
import { Privacy } from './pages/Privacy';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { TOOLS } from './data/tools';

export function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeToolId, setActiveToolId] = useState<string>('compress-pdf');

  const handleNavigate = (view: string) => {
    if (view.startsWith('tool:')) {
      const toolId = view.split(':')[1];
      setActiveToolId(toolId);
      setCurrentView('tool');
    } else {
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTool = (toolId: string) => {
    setActiveToolId(toolId);
    setCurrentView('tool');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeTool = TOOLS.find((t) => t.id === activeToolId) || TOOLS[0];

  return (
    <div className="min-h-screen flex flex-col justify-between relative selection:bg-strange-crimson selection:text-strange-cream overflow-x-hidden">
      {/* CRT Scanline Retro Overlay */}
      <div className="fixed inset-0 scanlines pointer-events-none z-40 opacity-40" />

      {/* Stranger Things "Upside Down" Drifting Spores / Ash Particle Simulation */}
      <Snowfall
        color="#C33149"
        snowflakeCount={85}
        radius={[1.5, 4.0]}
        speed={[0.6, 1.8]}
        wind={[-0.5, 0.8]}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      />

      {/* Navigation Header */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main Content Body */}
      <main className="flex-grow relative z-10">
        {currentView === 'home' && (
          <Home onSelectTool={handleSelectTool} onNavigate={handleNavigate} />
        )}

        {currentView === 'all-tools' && (
          <AllTools onSelectTool={handleSelectTool} />
        )}

        {currentView === 'tool' && (
          <ToolExecutor tool={activeTool} onBack={() => setCurrentView('all-tools')} />
        )}

        {currentView === 'privacy' && <Privacy />}
        {currentView === 'about' && <About />}
        {currentView === 'contact' && <Contact />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
