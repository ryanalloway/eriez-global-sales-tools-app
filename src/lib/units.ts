export type Units = { distance: string; factor: number; force: string };

export const forceUnits: Record<string, number> = {
  "T²/m": 1,
  "G²/mm": 1e5,
  "G²/cm": 1e6,
  "10³ G²/cm": 1e3,
  "G²/inch": 2.54e6,
};

export function makeUnits(distance: string, force: string): Units {
  return { distance, factor: distance === "mm" ? 1 : 1 / 25.4, force };
}
