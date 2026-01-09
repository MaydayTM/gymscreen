import { useState, useEffect, useCallback } from 'react';

// Module definition
export interface GymModule {
  id: string;
  name: string;
  description: string;
  shortcut: string;
  backgroundImage: string;
  color: string;
  available: boolean;
}

export const GYM_MODULES: GymModule[] = [
  {
    id: 'display',
    name: 'Gym Display',
    description: 'Lesrooster, verjaardagen, belt wall & slideshow',
    shortcut: 'D',
    backgroundImage: '/disciplines/BJJ.jpg',
    color: '#F59E0B', // Amber
    available: true,
  },
  {
    id: 'timer',
    name: 'Gym Timer',
    description: 'Training timer met rondes en rust periodes',
    shortcut: 'T',
    backgroundImage: '/disciplines/MMA.jpg',
    color: '#EF4444', // Red
    available: true,
  },
  {
    id: 'heartzone',
    name: 'Heart Zone',
    description: 'Live hartslag monitoring tijdens training',
    shortcut: 'H',
    backgroundImage: '/disciplines/Muay%20Thai.jpg',
    color: '#10B981', // Green
    available: false, // Coming soon
  },
  {
    id: 'settings',
    name: 'Instellingen',
    description: 'Scherm configuratie en voorkeuren',
    shortcut: 'S',
    backgroundImage: '/disciplines/Grappling.jpg',
    color: '#6B7280', // Gray
    available: false, // Coming soon
  },
];

interface HomeScreenProps {
  onSelectModule: (moduleId: string) => void;
}

// Module card component
function ModuleCard({
  module,
  isSelected,
  onSelect,
}: {
  module: GymModule;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={module.available ? onSelect : undefined}
      className={`
        relative h-64 rounded-3xl overflow-hidden transition-all duration-300 group
        ${isSelected
          ? 'ring-4 ring-offset-4 ring-offset-neutral-950 scale-[1.02]'
          : module.available ? 'hover:scale-[1.01]' : ''
        }
        ${!module.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={{
        boxShadow: isSelected ? `0 0 60px ${module.color}50` : undefined,
      }}
      disabled={!module.available}
    >
      {/* Background image */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-transform duration-500 ${
          module.available ? 'group-hover:scale-105' : ''
        }`}
        style={{ backgroundImage: `url(${module.backgroundImage})` }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.5) 100%)`,
        }}
      />

      {/* Color accent bar at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ backgroundColor: module.color }}
      />

      {/* Selection ring overlay */}
      {isSelected && (
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            boxShadow: `inset 0 0 0 3px ${module.color}`,
          }}
        />
      )}

      {/* Focus indicator - pulsing dot */}
      {isSelected && (
        <div
          className="absolute top-4 right-4 w-4 h-4 rounded-full animate-pulse"
          style={{ backgroundColor: module.color }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 h-full p-8 flex flex-col justify-between">
        {/* Top: Name and shortcut */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold text-white">{module.name}</h2>
            {module.available && (
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
                style={{
                  backgroundColor: `${module.color}30`,
                  color: module.color,
                }}
              >
                {module.shortcut}
              </div>
            )}
          </div>
          {!module.available && (
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: `${module.color}30`,
                color: module.color,
              }}
            >
              Binnenkort
            </span>
          )}
        </div>

        {/* Bottom: Description */}
        <div>
          <p className="text-lg text-neutral-300 leading-relaxed">
            {module.description}
          </p>
        </div>
      </div>
    </button>
  );
}

export function HomeScreen({ onSelectModule }: HomeScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Get available modules for navigation
  const availableModules = GYM_MODULES.filter(m => m.available);
  const selectedModule = GYM_MODULES[selectedIndex];

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case 'ArrowLeft':
        e.preventDefault();
        setSelectedIndex((prev) => {
          // Move left, wrap around
          const newIndex = prev - 1;
          return newIndex < 0 ? GYM_MODULES.length - 1 : newIndex;
        });
        break;
      case 'ArrowRight':
        e.preventDefault();
        setSelectedIndex((prev) => {
          // Move right, wrap around
          const newIndex = prev + 1;
          return newIndex >= GYM_MODULES.length ? 0 : newIndex;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => {
          // Move up (2 columns grid: -2)
          const newIndex = prev - 2;
          return newIndex < 0 ? prev + 2 : newIndex;
        });
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => {
          // Move down (2 columns grid: +2)
          const newIndex = prev + 2;
          return newIndex >= GYM_MODULES.length ? prev - 2 : newIndex;
        });
        break;
      case 'Enter':
      case 'Space':
        e.preventDefault();
        if (selectedModule?.available) {
          onSelectModule(selectedModule.id);
        }
        break;
      // Direct shortcuts
      case 'KeyD':
        onSelectModule('display');
        break;
      case 'KeyT':
        onSelectModule('timer');
        break;
    }
  }, [selectedModule, onSelectModule]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-8 flex flex-col overflow-hidden">
      {/* Background pattern */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <header className="relative z-10 text-center mb-12">
        <h1 className="text-6xl font-bold text-white tracking-tight mb-2">
          Reconnect Academy
        </h1>
        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-amber-500 to-orange-600 rounded-full" />
        <p className="text-neutral-500 mt-6 text-lg">
          Selecteer een module om te starten
        </p>
      </header>

      {/* Module grid */}
      <div className="flex-1 relative z-10 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-8 w-full max-w-[1200px]">
          {GYM_MODULES.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              isSelected={selectedIndex === index}
              onSelect={() => {
                setSelectedIndex(index);
                if (module.available) {
                  onSelectModule(module.id);
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Footer - navigation hints */}
      <footer className="relative z-10 text-center mt-8">
        <div className="flex items-center justify-center gap-8 text-neutral-600 text-sm">
          <span className="flex items-center gap-2">
            <span className="flex gap-1">
              <kbd className="px-2 py-1 bg-neutral-800/60 rounded font-mono">◄</kbd>
              <kbd className="px-2 py-1 bg-neutral-800/60 rounded font-mono">►</kbd>
              <kbd className="px-2 py-1 bg-neutral-800/60 rounded font-mono">▲</kbd>
              <kbd className="px-2 py-1 bg-neutral-800/60 rounded font-mono">▼</kbd>
            </span>
            Navigeren
          </span>
          <span className="text-neutral-700">|</span>
          <span className="flex items-center gap-2">
            <kbd className="px-3 py-1 bg-neutral-800/60 rounded font-mono">OK</kbd>
            Selecteren
          </span>
        </div>
      </footer>
    </div>
  );
}

export default HomeScreen;
