import React, { useState } from 'react';
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
    <div className="min-h-screen flex flex-col justify-between relative selection:bg-strange-crimson selection:text-strange-cream">
      {/* CRT Scanline Retro Overlay */}
      <div className="fixed inset-0 scanlines pointer-events-none z-40 opacity-40" />

      {/* Navigation Header */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main Content Body */}
      <main className="flex-grow">
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
