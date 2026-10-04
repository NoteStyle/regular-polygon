import React, { useMemo } from 'react';
import { getPolygonGeometry, Point } from '../utils/polygonGeometry';
import { playSound } from '../utils/audio';

interface PolygonSvgProps {
  sides: number;
  size?: number;
  showDiagonals?: boolean;
  showSymmetry?: boolean;
  showCorners?: boolean;
  showSides?: boolean;
  showAngles?: boolean;
  selectedColor?: string;
  fillColor?: string;
  borderColor?: string;
  highlightedIndices?: number[];
  customDiagonals?: Array<[number, number]>;
  onVertexClick?: (index: number) => void;
  interactiveVertexSelection?: number | null;
  className?: string;
  animate?: boolean;
}

export const PolygonSvg: React.FC<PolygonSvgProps> = ({
  sides,
  size = 280,
  showDiagonals = true,
  showSymmetry = false,
  showCorners = true,
  showSides = true,
  showAngles = false,
  selectedColor = '#3b82f6',
  fillColor = '#eff6ff',
  borderColor = '#2563eb',
  highlightedIndices = [],
  customDiagonals,
  onVertexClick,
  interactiveVertexSelection = null,
  className = '',
}) => {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;

  const geometry = useMemo(() => {
    return getPolygonGeometry(sides, cx, cy, radius);
  }, [sides, cx, cy, radius]);

  const displayedDiagonals = useMemo(() => {
    if (customDiagonals) {
      return customDiagonals.map(([i, j]) => ({
        id: `custom-${i}-${j}`,
        p1: geometry.vertices[i],
        p2: geometry.vertices[j],
      }));
    }
    return geometry.diagonals;
  }, [customDiagonals, geometry]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible select-none drop-shadow-sm transition-transform duration-300"
      >
        <defs>
          <radialGradient id={`glow-${sides}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={fillColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={fillColor} stopOpacity="0.4" />
          </radialGradient>
        </defs>

        {/* Symmetry Axes (if enabled) */}
        {showSymmetry &&
          geometry.symmetryAxes.map((axis) => (
            <line
              key={axis.id}
              x1={axis.p1.x}
              y1={axis.p1.y}
              x2={axis.p2.x}
              y2={axis.p2.y}
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="5 5"
              opacity="0.8"
            />
          ))}

        {/* Polygon main body */}
        <polygon
          points={geometry.vertices.map((v) => `${v.x},${v.y}`).join(' ')}
          fill={`url(#glow-${sides})`}
          stroke={borderColor}
          strokeWidth="3.5"
          strokeLinejoin="round"
          className="transition-colors duration-300"
        />

        {/* Interior Angle Arcs (if enabled) */}
        {showAngles &&
          geometry.vertices.map((v, i) => {
            const prev = geometry.vertices[(i - 1 + sides) % sides];
            const next = geometry.vertices[(i + 1) % sides];
            const anglePrev = Math.atan2(prev.y - v.y, prev.x - v.x);
            const angleNext = Math.atan2(next.y - v.y, next.x - v.x);

            const arcRadius = Math.min(24, radius * 0.25);
            // Label offset towards center
            const labelX = v.x + (cx - v.x) * 0.26;
            const labelY = v.y + (cy - v.y) * 0.26;

            return (
              <g key={`angle-${i}`}>
                <circle
                  cx={v.x}
                  cy={v.y}
                  r={arcRadius}
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={Math.max(10, Math.min(13, size / 24))}
                  fontWeight="bold"
                  fill="#c2410c"
                  className="font-mono-math pointer-events-none select-none"
                >
                  {Math.round(geometry.interiorAngleDeg)}°
                </text>
              </g>
            );
          })}

        {/* Diagonals (if enabled) */}
        {showDiagonals &&
          displayedDiagonals.map((diag, index) => (
            <line
              key={diag.id || index}
              x1={diag.p1.x}
              y1={diag.p1.y}
              x2={diag.p2.x}
              y2={diag.p2.y}
              stroke="#0ea5e9"
              strokeWidth="2.5"
              strokeDasharray={showDiagonals ? '4 3' : 'none'}
              opacity="0.9"
              className="animate-in fade-in duration-300"
            />
          ))}

        {/* Side tick marks (showing all straight sides equal length) */}
        {showSides &&
          geometry.vertices.map((v, i) => {
            const next = geometry.vertices[(i + 1) % sides];
            const midX = (v.x + next.x) / 2;
            const midY = (v.y + next.y) / 2;
            // Normal unit vector
            const dx = next.x - v.x;
            const dy = next.y - v.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const nx = -dy / len;
            const ny = dx / len;
            const tickLen = 5;

            return (
              <line
                key={`tick-${i}`}
                x1={midX - nx * tickLen}
                y1={midY - ny * tickLen}
                x2={midX + nx * tickLen}
                y2={midY + ny * tickLen}
                stroke={borderColor}
                strokeWidth="2.5"
                opacity="0.85"
              />
            );
          })}

        {/* Corners / Vertices */}
        {showCorners &&
          geometry.vertices.map((v, i) => {
            const isSelected = interactiveVertexSelection === i;
            const isHighlighted = highlightedIndices.includes(i);
            const r = isSelected ? 8 : isHighlighted ? 7 : 5.5;

            return (
              <g
                key={`vertex-${i}`}
                className={onVertexClick ? 'cursor-pointer' : ''}
                onClick={() => {
                  if (onVertexClick) {
                    playSound('click');
                    onVertexClick(i);
                  }
                }}
              >
                {/* Glow ring for selection */}
                {(isSelected || isHighlighted) && (
                  <circle
                    cx={v.x}
                    cy={v.y}
                    r={r + 4}
                    fill="none"
                    stroke={isSelected ? '#f59e0b' : '#3b82f6'}
                    strokeWidth="2.5"
                    className="animate-pulse"
                  />
                )}
                <circle
                  cx={v.x}
                  cy={v.y}
                  r={r}
                  fill={isSelected ? '#f59e0b' : isHighlighted ? '#2563eb' : '#ffffff'}
                  stroke={isSelected ? '#b45309' : borderColor}
                  strokeWidth="2"
                />
                {/* Corner indicator tag if size is large enough */}
                {size >= 240 && (
                  <text
                    x={v.x + (v.x - cx) * 0.16}
                    y={v.y + (v.y - cy) * 0.16}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="11"
                    fontWeight="700"
                    fill="#475569"
                    className="pointer-events-none select-none font-mono-math"
                  >
                    {i + 1}
                  </text>
                )}
              </g>
            );
          })}
      </svg>
    </div>
  );
};
