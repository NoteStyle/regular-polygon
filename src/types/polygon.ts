export type PolygonId = 'triangle' | 'square' | 'pentagon' | 'hexagon' | 'heptagon' | 'octagon';

export interface PolygonData {
  id: PolygonId;
  name: string;
  malayName?: string;
  sides: number;
  corners: number; // vertices
  symmetricalAxes: number;
  angles: number;
  interiorAngleDeg: number;
  diagonals: number;
  color: string;
  fillColor: string;
  borderColor: string;
  description: string;
}

export interface TextbookRiddle {
  id: string; // 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  challengeName: string; // e.g. "Challenge A"
  targetPolygonId: PolygonId;
  clues: string[];
  cardColor: string; // Pastel textbook-style
  textColor: string;
  explanation: string;
  formulaTip?: string;
}

export interface TableRowData {
  polygonId: PolygonId;
  polygonName: string;
  sides: number;
  corners: number;
  symmetricalAxes: number;
  angles: number;
  diagonals: number;
}
