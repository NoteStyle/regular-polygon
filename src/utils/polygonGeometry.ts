export interface Point {
  x: number;
  y: number;
}

export interface DiagonalLine {
  id: string;
  fromIndex: number;
  toIndex: number;
  p1: Point;
  p2: Point;
}

export interface SymmetryAxis {
  id: string;
  p1: Point;
  p2: Point;
}

export interface PolygonGeometry {
  vertices: Point[];
  center: Point;
  diagonals: DiagonalLine[];
  symmetryAxes: SymmetryAxis[];
  interiorAngleDeg: number;
  polygonPath: string;
}

/**
 * Calculates geometry for a regular polygon with `n` sides.
 * Aligns the polygon symmetrically (e.g. triangle points up, square flat).
 */
export function getPolygonGeometry(
  n: number,
  cx: number = 150,
  cy: number = 150,
  radius: number = 105
): PolygonGeometry {
  const vertices: Point[] = [];
  // Calculate orientation angle offset so polygon looks upright and balanced
  let startAngle = -Math.PI / 2; // top vertex by default
  if (n === 4) {
    startAngle = -Math.PI / 4; // square with horizontal baseline
  } else if (n === 6) {
    startAngle = 0; // hexagon with top and bottom horizontal flats or pointy top
  }

  for (let i = 0; i < n; i++) {
    const angle = startAngle + (i * 2 * Math.PI) / n;
    vertices.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
  }

  // Polygon path
  const polygonPath =
    vertices.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ') + ' Z';

  // Diagonals: any line between non-adjacent vertices
  const diagonals: DiagonalLine[] = [];
  let diagCount = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const diff = Math.abs(i - j);
      const isAdjacent = diff === 1 || diff === n - 1;
      if (!isAdjacent) {
        diagCount++;
        diagonals.push({
          id: `diag-${i}-${j}`,
          fromIndex: i,
          toIndex: j,
          p1: vertices[i],
          p2: vertices[j],
        });
      }
    }
  }

  // Symmetrical axes
  const symmetryAxes: SymmetryAxis[] = [];
  const extend = radius * 1.25;

  if (n % 2 === 1) {
    // Odd n: Vertex to opposite edge midpoint
    for (let i = 0; i < n; i++) {
      const v = vertices[i];
      const oppIdx1 = (i + Math.floor(n / 2)) % n;
      const oppIdx2 = (i + Math.ceil(n / 2)) % n;
      const mid = {
        x: (vertices[oppIdx1].x + vertices[oppIdx2].x) / 2,
        y: (vertices[oppIdx1].y + vertices[oppIdx2].y) / 2,
      };
      // Direction from center
      const angle = Math.atan2(v.y - cy, v.x - cx);
      symmetryAxes.push({
        id: `sym-axis-${i}`,
        p1: { x: cx + extend * Math.cos(angle), y: cy + extend * Math.sin(angle) },
        p2: { x: cx - extend * Math.cos(angle), y: cy - extend * Math.sin(angle) },
      });
    }
  } else {
    // Even n: 
    // 1) Opposite vertices (n/2 axes)
    for (let i = 0; i < n / 2; i++) {
      const v = vertices[i];
      const angle = Math.atan2(v.y - cy, v.x - cx);
      symmetryAxes.push({
        id: `sym-axis-v-${i}`,
        p1: { x: cx + extend * Math.cos(angle), y: cy + extend * Math.sin(angle) },
        p2: { x: cx - extend * Math.cos(angle), y: cy - extend * Math.sin(angle) },
      });
    }
    // 2) Opposite edge midpoints (n/2 axes)
    for (let i = 0; i < n / 2; i++) {
      const nextIdx = (i + 1) % n;
      const mid = {
        x: (vertices[i].x + vertices[nextIdx].x) / 2,
        y: (vertices[i].y + vertices[nextIdx].y) / 2,
      };
      const angle = Math.atan2(mid.y - cy, mid.x - cx);
      symmetryAxes.push({
        id: `sym-axis-e-${i}`,
        p1: { x: cx + extend * Math.cos(angle), y: cy + extend * Math.sin(angle) },
        p2: { x: cx - extend * Math.cos(angle), y: cy - extend * Math.sin(angle) },
      });
    }
  }

  const interiorAngleDeg = ((n - 2) * 180) / n;

  return {
    vertices,
    center: { x: cx, y: cy },
    diagonals,
    symmetryAxes,
    interiorAngleDeg,
    polygonPath,
  };
}
