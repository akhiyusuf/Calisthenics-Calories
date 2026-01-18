import React from 'react';
import { Position } from '../types';

interface ConnectionLineProps {
  start: Position;
  end: Position;
  isDraft?: boolean;
  onDelete?: () => void;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ start, end, isDraft = false, onDelete }) => {
  const x1 = start.x;
  const y1 = start.y;
  const x2 = end.x;
  const y2 = end.y;
  
  // Use squared-off connector logic for circuit-board look
  const dx = x2 - x1;
  const midX = x1 + dx / 2;
  const midY = y1 + (y2 - y1) / 2;

  // Simple cubic bezier, but flatter
  const pathData = `M ${x1} ${y1} C ${x1 + 40} ${y1}, ${x2 - 40} ${y2}, ${x2} ${y2}`;

  return (
    <g className={isDraft ? "pointer-events-none" : "group pointer-events-auto"}>
      {/* Invisible hitbox for easier clicking/hovering */}
      {!isDraft && (
        <path
          d={pathData}
          stroke="transparent"
          strokeWidth="20"
          fill="none"
          className="cursor-pointer"
        />
      )}
      
      {/* Visible Line - Thinner, sharper */}
      <path
        d={pathData}
        stroke={isDraft ? "#bda98c" : "#2a2a2a"}
        strokeWidth="1.5"
        fill="none"
        strokeDasharray={isDraft ? "4,4" : "none"}
        className="pointer-events-none transition-all"
      />

      {/* Endpoint Dots */}
      <rect x={x1 - 2} y={y1 - 2} width="4" height="4" fill="#2a2a2a" />
      <rect x={x2 - 2} y={y2 - 2} width="4" height="4" fill="#2a2a2a" />
    </g>
  );
};

export default ConnectionLine;
