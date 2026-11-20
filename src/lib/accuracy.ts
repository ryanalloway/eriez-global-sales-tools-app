export type MeasurementCoverage = {
  inputDistance?: number[];
};

export function measuredDistanceRange(
  profile: MeasurementCoverage,
): { min: number; max: number } | null {
  const distances = profile.inputDistance?.filter(Number.isFinite);
  if (!distances?.length) return null;
  return { min: Math.min(...distances), max: Math.max(...distances) };
}

export function isExtrapolatedLift(
  profile: MeasurementCoverage,
  lift: number | null,
): boolean {
  const measured = measuredDistanceRange(profile);
  return (
    measured !== null &&
    lift !== null &&
    Number.isFinite(lift) &&
    (lift < measured.min - 1e-9 || lift > measured.max + 1e-9)
  );
}
