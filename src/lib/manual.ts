export type ManualInput = {
  name: string;
  points: [number, number][];
  bestFit: boolean;
  exclude: number;
};
export const newManual = (i: number): ManualInput => ({
  name: `User magnet ${i}`,
  points: [
    [0, 0],
    [100, 0],
    [200, 0],
    [300, 0],
  ],
  bestFit: false,
  exclude: 0,
});