import { PolygonData, PolygonId, TableRowData, TextbookRiddle } from '../types/polygon';

export const POLYGONS: Record<PolygonId, PolygonData> = {
  triangle: {
    id: 'triangle',
    name: 'Equilateral Triangle',
    malayName: 'Segi tiga sama sisi',
    sides: 3,
    corners: 3,
    symmetricalAxes: 3,
    angles: 3,
    interiorAngleDeg: 60,
    diagonals: 0,
    color: '#ef4444',
    fillColor: '#fee2e2',
    borderColor: '#b91c1c',
    description: 'A 3-sided regular polygon with all sides equal and 0 diagonals because every vertex is directly adjacent to every other vertex.',
  },
  square: {
    id: 'square',
    name: 'Square',
    malayName: 'Segi empat sama',
    sides: 4,
    corners: 4,
    symmetricalAxes: 4,
    angles: 4,
    interiorAngleDeg: 90,
    diagonals: 2,
    color: '#3b82f6',
    fillColor: '#dbeafe',
    borderColor: '#1d4ed8',
    description: 'A 4-sided regular polygon with 4 right angles (90°) and 2 intersecting diagonals.',
  },
  pentagon: {
    id: 'pentagon',
    name: 'Regular Pentagon',
    malayName: 'Pentagon sekata',
    sides: 5,
    corners: 5,
    symmetricalAxes: 5,
    angles: 5,
    interiorAngleDeg: 108,
    diagonals: 5,
    color: '#8b5cf6',
    fillColor: '#ede9fe',
    borderColor: '#6d28d9',
    description: 'A 5-sided regular polygon where the diagonals form a 5-pointed star inside (5 diagonals).',
  },
  hexagon: {
    id: 'hexagon',
    name: 'Regular Hexagon',
    malayName: 'Heksagon sekata',
    sides: 6,
    corners: 6,
    symmetricalAxes: 6,
    angles: 6,
    interiorAngleDeg: 120,
    diagonals: 9,
    color: '#f59e0b',
    fillColor: '#fef3c7',
    borderColor: '#d97706',
    description: 'A 6-sided regular polygon found in honeycomb tiles with 9 diagonals and 6 symmetrical axes.',
  },
  heptagon: {
    id: 'heptagon',
    name: 'Regular Heptagon',
    malayName: 'Heptagon sekata',
    sides: 7,
    corners: 7,
    symmetricalAxes: 7,
    angles: 7,
    interiorAngleDeg: 128.57,
    diagonals: 14,
    color: '#ec4899',
    fillColor: '#fce7f3',
    borderColor: '#be185d',
    description: 'A 7-sided regular polygon with 7 corners and 14 diagonals.',
  },
  octagon: {
    id: 'octagon',
    name: 'Regular Octagon',
    malayName: 'Oktagon sekata',
    sides: 8,
    corners: 8,
    symmetricalAxes: 8,
    angles: 8,
    interiorAngleDeg: 135,
    diagonals: 20,
    color: '#10b981',
    fillColor: '#d1fae5',
    borderColor: '#047857',
    description: 'An 8-sided regular polygon like a stop sign with 8 symmetrical axes and 20 diagonals.',
  },
};

/**
 * EXACT riddle format found in textbook's "Try These" section (page 2)
 */
export const TEXTBOOK_RIDDLES: TextbookRiddle[] = [
  {
    id: 'A',
    challengeName: 'Challenge A',
    targetPolygonId: 'hexagon',
    clues: [
      '6 straight sides which are closed',
      'all straight sides of equal length',
      '6 symmetrical axes',
    ],
    cardColor: '#fef3c7', // soft yellow/amber parchment
    textColor: '#92400e',
    explanation:
      'A regular hexagon has 6 closed straight sides of equal length and 6 axes of symmetry (3 joining opposite corners and 3 joining opposite sides).',
    formulaTip: 'Number of symmetrical axes equals the number of straight sides (6 = 6).',
  },
  {
    id: 'B',
    challengeName: 'Challenge B',
    targetPolygonId: 'triangle',
    clues: [
      '3 straight sides of equal length',
      '3 equal interior angles',
      '0 diagonals',
    ],
    cardColor: '#e0e7ff', // soft lavender/blue from textbook
    textColor: '#3730a3',
    explanation:
      'An equilateral triangle has 3 equal sides and 3 equal 60° angles. Because a diagonal must connect non-adjacent corners, and every corner is already joined by a side, it has 0 diagonals!',
    formulaTip: 'Diagonals formula: 3 × (3 - 3) / 2 = 0 diagonals.',
  },
  {
    id: 'C',
    challengeName: 'Challenge C',
    targetPolygonId: 'heptagon',
    clues: [
      '7 corners',
      'all straight sides of equal length',
      '14 diagonals',
    ],
    cardColor: '#fce7f3', // soft pink/magenta from textbook
    textColor: '#9d174d',
    explanation:
      'A regular heptagon has 7 corners (vertices), 7 equal straight sides, and exactly 14 diagonals.',
    formulaTip: 'Diagonals formula: 7 × (7 - 3) / 2 = (7 × 4) / 2 = 14 diagonals.',
  },
  {
    id: 'D',
    challengeName: 'Challenge D (Vault Bonus)',
    targetPolygonId: 'pentagon',
    clues: [
      '5 straight sides are of equal length',
      '5 interior angles (108° each)',
      '5 diagonals forming an internal star',
    ],
    cardColor: '#ede9fe',
    textColor: '#5b21b6',
    explanation:
      'A regular pentagon has 5 straight sides of equal length, 5 corners, 5 symmetrical axes, and 5 diagonals.',
    formulaTip: 'Diagonals formula: 5 × (5 - 3) / 2 = 5 diagonals.',
  },
  {
    id: 'E',
    challengeName: 'Challenge E (Vault Bonus)',
    targetPolygonId: 'square',
    clues: [
      '4 corners forming 4 right angles of 90°',
      '4 symmetrical axes',
      '2 diagonals intersecting in the centre',
    ],
    cardColor: '#dcfce7',
    textColor: '#166534',
    explanation:
      'A square is a 4-sided regular polygon with 4 equal sides, 4 right angles, and 2 diagonals.',
    formulaTip: 'Diagonals formula: 4 × (4 - 3) / 2 = 2 diagonals.',
  },
  {
    id: 'F',
    challengeName: 'Challenge F (Vault Bonus)',
    targetPolygonId: 'octagon',
    clues: [
      '8 straight sides of equal length',
      '8 corners and 8 interior angles',
      '20 diagonals',
    ],
    cardColor: '#ffedd5',
    textColor: '#9a3412',
    explanation:
      'A regular octagon has 8 straight sides, 8 corners, 8 symmetrical axes, and 20 diagonals.',
    formulaTip: 'Diagonals formula: 8 × (8 - 3) / 2 = 20 diagonals.',
  },
];

export const TEXTBOOK_TABLE_DATA: TableRowData[] = [
  { polygonId: 'triangle', polygonName: 'equilateral triangle', sides: 3, corners: 3, symmetricalAxes: 3, angles: 3, diagonals: 0 },
  { polygonId: 'square', polygonName: 'square', sides: 4, corners: 4, symmetricalAxes: 4, angles: 4, diagonals: 2 },
  { polygonId: 'pentagon', polygonName: 'pentagon', sides: 5, corners: 5, symmetricalAxes: 5, angles: 5, diagonals: 5 },
  { polygonId: 'hexagon', polygonName: 'hexagon', sides: 6, corners: 6, symmetricalAxes: 6, angles: 6, diagonals: 9 },
  { polygonId: 'heptagon', polygonName: 'heptagon', sides: 7, corners: 7, symmetricalAxes: 7, angles: 7, diagonals: 14 },
  { polygonId: 'octagon', polygonName: 'octagon', sides: 8, corners: 8, symmetricalAxes: 8, angles: 8, diagonals: 20 },
];

export const OWL_TIPS = [
  'Remember: For all regular polygons, the number of symmetrical axes equals the number of straight sides!',
  'A diagonal is a straight line drawn from one corner to the opposite corner (non-adjacent).',
  'Corners are synonymous with vertices! In any regular polygon, number of corners = number of angles = number of straight sides.',
  'An equilateral triangle has 0 diagonals because every corner is directly joined to all the other corners by outer sides.',
  'Diagonal formula: For any regular polygon with n sides, diagonals = n × (n - 3) ÷ 2.',
];
