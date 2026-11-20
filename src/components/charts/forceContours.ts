export const LIFT_THRESHOLDS = [
  ["Sphere", 0.033232],
  ["Cube", 0.025795],
  ["Nut", 0.016268],
  ["Bar 4:1", 0.006],
  ["Bar 6:1", 0.003969],
  ["Bar 10:1", 0.00251],
] as const;

export const FORCE_FILL_LEVELS = [
  0,
  ...LIFT_THRESHOLDS.map(([, threshold]) => threshold).reverse(),
];

export const FORCE_FILL_COLORS = [
  "#ffefe8",
  "#fee5d9",
  "#fed9c9",
  "#fca082",
  "#ec382b",
  "#9d0d14",
  "#67000d",
] as const;

export function forceFillScale(zMax = 0.034232): Array<[number, string]> {
  const upper = FORCE_FILL_LEVELS.at(-1)!;
  if (!(zMax > upper))
    throw new Error("Force fill maximum must exceed the Sphere threshold.");
  const stops: Array<[number, string]> = [];
  for (let i = 0; i < FORCE_FILL_COLORS.length; i++) {
    const start = FORCE_FILL_LEVELS[i] / zMax;
    const end =
      (i + 1 < FORCE_FILL_LEVELS.length ? FORCE_FILL_LEVELS[i + 1] : zMax) /
      zMax;
    stops.push([start, FORCE_FILL_COLORS[i]], [end, FORCE_FILL_COLORS[i]]);
  }
  return stops;
}

type Location = { x: number; y: number };
export type Isoline = {
  x: (number | null)[];
  y: (number | null)[];
  segmentCount: number;
};

export function traceIsoline(
  x: number[],
  y: number[],
  values: number[][],
  level: number,
): Isoline {
  if (
    values.length !== y.length ||
    values.some((row) => row.length !== x.length)
  ) {
    throw new Error(
      "Isoline grid dimensions do not match the contour coordinates.",
    );
  }
  const result: Isoline = { x: [], y: [], segmentCount: 0 };
  const add = (a: Location, b: Location) => {
    result.x.push(a.x, b.x, null);
    result.y.push(a.y, b.y, null);
    result.segmentCount++;
  };
  for (let iy = 0; iy < y.length - 1; iy++) {
    for (let ix = 0; ix < x.length - 1; ix++) {
      const z = [
        values[iy][ix],
        values[iy][ix + 1],
        values[iy + 1][ix + 1],
        values[iy + 1][ix],
      ];
      if (z.some((v) => !Number.isFinite(v))) continue;
      const p: Location[] = [
        { x: x[ix], y: y[iy] },
        { x: x[ix + 1], y: y[iy] },
        { x: x[ix + 1], y: y[iy + 1] },
        { x: x[ix], y: y[iy + 1] },
      ];
      const edges: Array<[number, Location]> = [];
      for (let k = 0; k < 4; k++) {
        const next = (k + 1) % 4;
        if (z[k] > level === z[next] > level) continue;
        const t = (level - z[k]) / (z[next] - z[k]);
        edges.push([
          k,
          {
            x: p[k].x + t * (p[next].x - p[k].x),
            y: p[k].y + t * (p[next].y - p[k].y),
          },
        ]);
      }
      if (edges.length === 2) {
        add(edges[0][1], edges[1][1]);
      } else if (edges.length === 4) {
        const centerHigh = z.reduce((sum, v) => sum + v, 0) / 4 > level;
        const upperLeftHigh = z[0] > level;
        const pairs =
          centerHigh === upperLeftHigh
            ? [
                [0, 1],
                [2, 3],
              ]
            : [
                [0, 3],
                [1, 2],
              ];
        for (const [a, b] of pairs) add(edges[a][1], edges[b][1]);
      }
    }
  }
  return result;
}

export function pickIsolineLabel(
  line: Isoline,
  xRange: [number, number],
  yRange: [number, number],
  desiredFraction: number,
): Location | null {
  const [xMin, xMax] = xRange,
    [yMin, yMax] = yRange;
  const xSpan = xMax - xMin,
    ySpan = yMax - yMin;
  const targetX = xMin + xSpan * desiredFraction;
  let best: Location | null = null;
  let bestScore = Infinity;
  for (let i = 0; i < line.x.length; i += 3) {
    const ax = line.x[i],
      ay = line.y[i],
      bx = line.x[i + 1],
      by = line.y[i + 1];
    if (ax == null || ay == null || bx == null || by == null) continue;
    const mid = { x: (ax + bx) / 2, y: (ay + by) / 2 };
    if (
      mid.x < xMin + xSpan * 0.07 ||
      mid.x > xMax - xSpan * 0.07 ||
      mid.y < yMin + ySpan * 0.07 ||
      mid.y > yMax - ySpan * 0.07
    )
      continue;
    const score = Math.abs(mid.x - targetX);
    if (score < bestScore) {
      best = mid;
      bestScore = score;
    }
  }
  return best;
}
