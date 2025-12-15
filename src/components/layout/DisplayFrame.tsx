import type { ReactNode } from 'react';

interface DisplayFrameProps {
  children: ReactNode;
}

export function DisplayFrame({ children }: DisplayFrameProps) {
  return (
    <div className="fixed inset-0 overflow-hidden bg-neutral-950">
      {/* TV-safe zone wrapper (10% margin from edges) */}
      <div className="absolute inset-[5%]">
        {children}
      </div>
    </div>
  );
}
