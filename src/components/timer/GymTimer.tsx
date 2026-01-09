import { useState, useEffect, useCallback, useRef } from 'react';

// Timer preset configurations
export interface TimerPreset {
  id: string;
  name: string;
  shortName: string;
  rounds: number;
  roundDuration: number; // seconds
  restDuration: number; // seconds
  color: string;
  backgroundImage: string;
}

export const TIMER_PRESETS: TimerPreset[] = [
  {
    id: 'mma',
    name: 'MMA',
    shortName: 'MMA',
    rounds: 3,
    roundDuration: 300, // 5:00
    restDuration: 60,   // 1:00
    color: '#EF4444',   // Red
    backgroundImage: '/disciplines/MMA.jpg',
  },
  {
    id: 'boxing',
    name: 'Boxing',
    shortName: 'BOX',
    rounds: 12,
    roundDuration: 180, // 3:00
    restDuration: 60,   // 1:00
    color: '#F59E0B',   // Amber
    backgroundImage: '/disciplines/boxing.png',
  },
  {
    id: 'bjj',
    name: 'BJJ',
    shortName: 'BJJ',
    rounds: 5,
    roundDuration: 360, // 6:00
    restDuration: 30,   // 0:30
    color: '#3B82F6',   // Blue
    backgroundImage: '/disciplines/BJJ.jpg',
  },
  {
    id: 'muaythai',
    name: 'Muay Thai',
    shortName: 'MT',
    rounds: 5,
    roundDuration: 180, // 3:00
    restDuration: 120,  // 2:00
    color: '#10B981',   // Green
    backgroundImage: '/disciplines/Muay%20Thai.jpg',
  },
  {
    id: 'grappling',
    name: 'Grappling',
    shortName: 'GRP',
    rounds: 5,
    roundDuration: 360, // 6:00
    restDuration: 30,   // 0:30
    color: '#8B5CF6',   // Purple
    backgroundImage: '/disciplines/Grappling.jpg',
  },
  {
    id: 'custom',
    name: 'Custom',
    shortName: 'CFG',
    rounds: 3,
    roundDuration: 180,
    restDuration: 60,
    color: '#6B7280',   // Gray
    backgroundImage: '/disciplines/wrestling.jpg',
  },
];

type TimerStatus = 'idle' | 'running' | 'paused' | 'rest' | 'finished';

interface TimerState {
  status: TimerStatus;
  currentRound: number;
  timeRemaining: number;
  isRest: boolean;
}

// Audio file paths - will be used when actual audio files are added
// Currently using synthesized sounds as fallback
export const AUDIO_FILES = {
  fight: '/audio/fight.mp3',      // "FIGHT!" voice
  gong: '/audio/gong.mp3',        // Gong sound
  beep: '/audio/beep.mp3',        // Warning beep
  bell: '/audio/bell.mp3',        // Round start bell
};

// Format seconds to MM:SS or M:SS
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Format seconds to readable description
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0 && secs > 0) return `${mins}m ${secs}s`;
  if (mins > 0) return `${mins} min`;
  return `${secs}s`;
}

// Preset selection card with discipline background
function PresetCard({
  preset,
  isSelected,
  onSelect,
}: {
  preset: TimerPreset;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`
        relative h-56 rounded-2xl overflow-hidden transition-all duration-300 group
        ${isSelected
          ? 'ring-4 ring-offset-4 ring-offset-neutral-950 scale-[1.02]'
          : 'hover:scale-[1.01]'
        }
      `}
      style={{
        boxShadow: isSelected ? `0 0 40px ${preset.color}40` : undefined,
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${preset.backgroundImage})` }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.4) 100%)`,
        }}
      />

      {/* Color accent bar at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: preset.color }}
      />

      {/* Selection ring overlay */}
      {isSelected && (
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            boxShadow: `inset 0 0 0 2px ${preset.color}`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 h-full p-5 flex flex-col justify-between">
        {/* Top: Name */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">{preset.name}</h3>
          <div
            className="inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider"
            style={{
              backgroundColor: `${preset.color}30`,
              color: preset.color,
            }}
          >
            {preset.shortName}
          </div>
        </div>

        {/* Bottom: Config */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-neutral-300">
            <span className="text-neutral-500 w-16">Rondes</span>
            <span className="font-semibold">{preset.rounds}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-300">
            <span className="text-neutral-500 w-16">Ronde</span>
            <span className="font-semibold">{formatDuration(preset.roundDuration)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-300">
            <span className="text-neutral-500 w-16">Rust</span>
            <span className="font-semibold">{formatDuration(preset.restDuration)}</span>
          </div>
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div
          className="absolute top-3 right-3 w-3 h-3 rounded-full animate-pulse"
          style={{ backgroundColor: preset.color }}
        />
      )}
    </button>
  );
}

// Preset selection grid
function PresetSelector({
  onSelect,
  selectedPreset,
}: {
  onSelect: (preset: TimerPreset) => void;
  selectedPreset: TimerPreset | null;
}) {
  return (
    <div className="grid grid-cols-3 gap-6 w-full max-w-[1600px] mx-auto px-8">
      {TIMER_PRESETS.map((preset) => (
        <PresetCard
          key={preset.id}
          preset={preset}
          isSelected={selectedPreset?.id === preset.id}
          onSelect={() => onSelect(preset)}
        />
      ))}
    </div>
  );
}

// Custom timer configuration panel
function CustomConfig({
  preset,
  onUpdate,
}: {
  preset: TimerPreset;
  onUpdate: (updates: Partial<TimerPreset>) => void;
}) {
  if (preset.id !== 'custom') return null;

  return (
    <div className="flex justify-center gap-16 mt-10 p-8 bg-neutral-900/60 backdrop-blur-sm rounded-2xl max-w-4xl mx-auto border border-neutral-800">
      {/* Rounds */}
      <div className="text-center">
        <div className="text-xs text-neutral-500 uppercase tracking-wider mb-3">Rondes</div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onUpdate({ rounds: Math.max(1, preset.rounds - 1) })}
            className="w-11 h-11 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white text-xl font-medium transition-colors flex items-center justify-center"
          >
            -
          </button>
          <span className="text-4xl font-bold text-white w-14 text-center tabular-nums">
            {preset.rounds}
          </span>
          <button
            onClick={() => onUpdate({ rounds: Math.min(99, preset.rounds + 1) })}
            className="w-11 h-11 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white text-xl font-medium transition-colors flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px bg-neutral-700" />

      {/* Round Duration */}
      <div className="text-center">
        <div className="text-xs text-neutral-500 uppercase tracking-wider mb-3">Ronde Tijd</div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onUpdate({ roundDuration: Math.max(10, preset.roundDuration - 30) })}
            className="w-11 h-11 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white text-xl font-medium transition-colors flex items-center justify-center"
          >
            -
          </button>
          <span className="text-4xl font-bold text-white w-24 text-center tabular-nums">
            {formatTime(preset.roundDuration)}
          </span>
          <button
            onClick={() => onUpdate({ roundDuration: Math.min(3600, preset.roundDuration + 30) })}
            className="w-11 h-11 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white text-xl font-medium transition-colors flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px bg-neutral-700" />

      {/* Rest Duration */}
      <div className="text-center">
        <div className="text-xs text-neutral-500 uppercase tracking-wider mb-3">Rust Tijd</div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onUpdate({ restDuration: Math.max(0, preset.restDuration - 10) })}
            className="w-11 h-11 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white text-xl font-medium transition-colors flex items-center justify-center"
          >
            -
          </button>
          <span className="text-4xl font-bold text-white w-24 text-center tabular-nums">
            {formatTime(preset.restDuration)}
          </span>
          <button
            onClick={() => onUpdate({ restDuration: Math.min(600, preset.restDuration + 10) })}
            className="w-11 h-11 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white text-xl font-medium transition-colors flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

// Main timer display during countdown
function TimerDisplay({
  state,
  preset,
  onPause,
  onResume,
  onReset,
  onSkip,
}: {
  state: TimerState;
  preset: TimerPreset;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip: () => void;
}) {
  const isRest = state.isRest;
  const isLowTime = state.timeRemaining <= 10 && !isRest;
  const isVeryLowTime = state.timeRemaining <= 3 && !isRest;

  // Determine display color
  const displayColor = isRest
    ? '#10B981' // Green for rest
    : isLowTime
      ? '#EF4444' // Red for low time
      : preset.color;

  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      {/* Subtle background pulse for low time - not too aggressive */}
      {isVeryLowTime && state.status === 'running' && (
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            backgroundColor: '#EF4444',
            opacity: 0.08,
          }}
        />
      )}

      {/* Round indicator */}
      <div className="mb-6">
        <div className="text-xl text-neutral-500 uppercase tracking-[0.3em] mb-2 text-center">
          {isRest ? 'Rust' : 'Ronde'}
        </div>
        <div className="flex items-center justify-center gap-3">
          <span
            className="text-7xl font-black tabular-nums"
            style={{ color: displayColor }}
          >
            {state.currentRound}
          </span>
          <span className="text-3xl text-neutral-700 font-light">/</span>
          <span className="text-3xl text-neutral-600 font-semibold tabular-nums">{preset.rounds}</span>
        </div>
      </div>

      {/* Main time display */}
      <div
        className="text-[18rem] font-black leading-none tracking-tighter transition-colors duration-300 tabular-nums"
        style={{
          color: displayColor,
          textShadow: `0 0 120px ${displayColor}30`,
        }}
      >
        {formatTime(state.timeRemaining)}
      </div>

      {/* Status label */}
      <div className="mt-6 text-2xl font-medium tracking-wide">
        {state.status === 'paused' && (
          <span className="text-neutral-500">GEPAUZEERD</span>
        )}
        {state.status === 'running' && isRest && (
          <span className="text-emerald-500/80">Herstel</span>
        )}
        {state.status === 'running' && !isRest && (
          <span style={{ color: `${preset.color}99` }}>{preset.name}</span>
        )}
      </div>

      {/* Control buttons */}
      <div className="flex items-center gap-8 mt-14">
        {/* Reset */}
        <button
          onClick={onReset}
          className="w-14 h-14 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all hover:scale-105 flex items-center justify-center"
          title="Reset (R)"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          onClick={state.status === 'running' ? onPause : onResume}
          className="w-20 h-20 rounded-full text-white transition-all hover:scale-105 shadow-2xl flex items-center justify-center"
          style={{
            backgroundColor: state.status === 'running' ? '#EF4444' : '#10B981',
            boxShadow: `0 0 50px ${state.status === 'running' ? '#EF444430' : '#10B98130'}`,
          }}
          title="Play/Pause (Space)"
        >
          {state.status === 'running' ? (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Skip */}
        <button
          onClick={onSkip}
          className="w-14 h-14 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all hover:scale-105 flex items-center justify-center"
          title="Skip (Arrow Right)"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 5v14l11-7L5 5zm11 0v14h3V5h-3z" />
          </svg>
        </button>
      </div>

      {/* Keyboard hints */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-8 text-neutral-600 text-xs">
        <span><kbd className="px-2 py-1 bg-neutral-800/60 rounded font-mono">Space</kbd> Play/Pause</span>
        <span><kbd className="px-2 py-1 bg-neutral-800/60 rounded font-mono">R</kbd> Reset</span>
        <span><kbd className="px-2 py-1 bg-neutral-800/60 rounded font-mono">Esc</kbd> Stop</span>
      </div>
    </div>
  );
}

// Finished screen - subtle and professional
function FinishedScreen({ onReset, preset }: { onReset: () => void; preset: TimerPreset }) {
  return (
    <div className="flex flex-col items-center justify-center h-full relative overflow-hidden">
      {/* Subtle background glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, ${preset.color}15 0%, transparent 60%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* FIGHT text - bold but not over the top */}
        <div
          className="text-[12rem] font-black tracking-wider mb-8 leading-none"
          style={{
            color: preset.color,
            textShadow: `0 0 80px ${preset.color}50`,
          }}
        >
          FIGHT!
        </div>

        {/* Session summary */}
        <div className="text-xl text-neutral-500 mb-12">
          {preset.rounds} rondes van {formatDuration(preset.roundDuration)} voltooid
        </div>

        {/* New session button */}
        <button
          onClick={onReset}
          className="px-10 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-lg font-semibold hover:scale-105 transition-transform shadow-xl"
          style={{
            boxShadow: '0 0 40px rgba(245, 158, 11, 0.3)',
          }}
        >
          Nieuwe Sessie
        </button>
      </div>
    </div>
  );
}

// Main GymTimer component
export function GymTimer() {
  const [selectedPreset, setSelectedPreset] = useState<TimerPreset | null>(null);
  const [customPreset, setCustomPreset] = useState<TimerPreset>({ ...TIMER_PRESETS[5] });
  const [timerState, setTimerState] = useState<TimerState>({
    status: 'idle',
    currentRound: 1,
    timeRemaining: 0,
    isRest: false,
  });

  const intervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBuffersRef = useRef<Map<string, AudioBuffer>>(new Map());

  // Get the active preset (custom values if custom selected, otherwise selected)
  const activePreset = selectedPreset?.id === 'custom' ? customPreset : selectedPreset;

  // Preload audio files (when they're available)
  useEffect(() => {
    const loadAudio = async () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      // Audio files will be loaded here when available
      // For now, we'll use synthesized sounds as fallback
    };
    loadAudio();
  }, []);

  // Play sound - tries audio file first, falls back to synthesized
  const playSound = useCallback((type: 'beep' | 'bell' | 'gong' | 'fight') => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const ctx = audioContextRef.current;

    // Check if we have a preloaded audio buffer
    const buffer = audioBuffersRef.current.get(type);
    if (buffer) {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
      return;
    }

    // Fallback to synthesized sounds
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    switch (type) {
      case 'beep':
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.08);
        break;
      case 'bell':
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.4);
        break;
      case 'gong':
        oscillator.frequency.value = 180;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 1.5);
        break;
      case 'fight': {
        // Deep gong for fight
        oscillator.frequency.value = 120;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.6, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 2);
        break;
      }
    }
  }, []);

  // Timer tick logic
  useEffect(() => {
    if (timerState.status !== 'running' || !activePreset) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setTimerState((prev) => {
        // Warning beeps at 10, 5, 4, 3, 2, 1
        if (!prev.isRest && [10, 5, 4, 3, 2, 1].includes(prev.timeRemaining)) {
          playSound('beep');
        }

        if (prev.timeRemaining <= 1) {
          // Time's up for this phase
          if (prev.isRest) {
            // Rest is over, start next round
            playSound('bell');
            return {
              ...prev,
              timeRemaining: activePreset.roundDuration,
              isRest: false,
            };
          } else {
            // Round is over
            if (prev.currentRound >= activePreset.rounds) {
              // All rounds complete
              playSound('fight');
              return {
                ...prev,
                status: 'finished',
                timeRemaining: 0,
              };
            } else if (activePreset.restDuration > 0) {
              // Start rest period
              playSound('gong');
              return {
                ...prev,
                timeRemaining: activePreset.restDuration,
                isRest: true,
                currentRound: prev.currentRound + 1,
              };
            } else {
              // No rest, go directly to next round
              playSound('bell');
              return {
                ...prev,
                timeRemaining: activePreset.roundDuration,
                currentRound: prev.currentRound + 1,
              };
            }
          }
        }

        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        };
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.status, activePreset, playSound]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (timerState.status === 'running') {
            handlePause();
          } else if (timerState.status === 'paused' || timerState.status === 'idle') {
            handleResume();
          }
          break;
        case 'KeyR':
          handleReset();
          break;
        case 'ArrowRight':
          handleSkip();
          break;
        case 'Escape':
          if (timerState.status !== 'idle') {
            handleReset();
          } else {
            setSelectedPreset(null);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [timerState.status]);

  // Control handlers
  const handleStart = () => {
    if (!activePreset) return;
    playSound('bell');
    setTimerState({
      status: 'running',
      currentRound: 1,
      timeRemaining: activePreset.roundDuration,
      isRest: false,
    });
  };

  const handlePause = () => {
    setTimerState((prev) => ({ ...prev, status: 'paused' }));
  };

  const handleResume = () => {
    if (timerState.status === 'idle' && activePreset) {
      handleStart();
    } else {
      setTimerState((prev) => ({ ...prev, status: 'running' }));
    }
  };

  const handleReset = () => {
    setTimerState({
      status: 'idle',
      currentRound: 1,
      timeRemaining: activePreset?.roundDuration || 0,
      isRest: false,
    });
  };

  const handleSkip = () => {
    if (!activePreset) return;

    setTimerState((prev) => {
      if (prev.isRest) {
        return {
          ...prev,
          timeRemaining: activePreset.roundDuration,
          isRest: false,
        };
      } else if (prev.currentRound < activePreset.rounds) {
        if (activePreset.restDuration > 0) {
          return {
            ...prev,
            timeRemaining: activePreset.restDuration,
            isRest: true,
            currentRound: prev.currentRound + 1,
          };
        } else {
          return {
            ...prev,
            timeRemaining: activePreset.roundDuration,
            currentRound: prev.currentRound + 1,
          };
        }
      } else {
        return {
          ...prev,
          status: 'finished',
          timeRemaining: 0,
        };
      }
    });
  };

  const handleUpdateCustom = (updates: Partial<TimerPreset>) => {
    setCustomPreset((prev) => ({ ...prev, ...updates }));
  };

  // Show finished screen
  if (timerState.status === 'finished' && activePreset) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
        <FinishedScreen onReset={handleReset} preset={activePreset} />
      </div>
    );
  }

  // Show timer display when running or paused
  if ((timerState.status === 'running' || timerState.status === 'paused') && activePreset) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
        <TimerDisplay
          state={timerState}
          preset={activePreset}
          onPause={handlePause}
          onResume={handleResume}
          onReset={handleReset}
          onSkip={handleSkip}
        />
      </div>
    );
  }

  // Show preset selection
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
      <header className="relative z-10 text-center mb-10">
        <p className="text-sm text-amber-500/80 font-medium tracking-[0.2em] uppercase mb-2">
          Reconnect Academy
        </p>
        <h1 className="text-5xl font-bold text-white tracking-tight">
          Gym Timer
        </h1>
      </header>

      {/* Preset grid */}
      <div className="flex-1 relative z-10 flex flex-col justify-center">
        <PresetSelector
          onSelect={(preset) => setSelectedPreset(preset)}
          selectedPreset={selectedPreset}
        />

        {/* Custom configuration */}
        {selectedPreset?.id === 'custom' && (
          <CustomConfig
            preset={customPreset}
            onUpdate={handleUpdateCustom}
          />
        )}

        {/* Start button */}
        {selectedPreset && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleStart}
              className="group relative px-14 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xl font-semibold hover:scale-105 transition-all shadow-xl"
              style={{
                boxShadow: '0 0 50px rgba(245, 158, 11, 0.3)',
              }}
            >
              <span className="relative z-10">Start Timer</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center mt-6">
        <p className="text-neutral-600 text-xs">
          <kbd className="px-2 py-1 bg-neutral-800/60 rounded font-mono">Space</kbd> starten
          <span className="mx-3 text-neutral-700">|</span>
          <kbd className="px-2 py-1 bg-neutral-800/60 rounded font-mono">D</kbd> Display mode
        </p>
      </footer>
    </div>
  );
}

export default GymTimer;
