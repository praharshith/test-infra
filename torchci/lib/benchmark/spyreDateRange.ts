export const SPYRE_E2E_BENCHMARK_ID = "spyre_e2e_benchmark";

// Spyre archs whose runs share one workflow/commit, so the dashboard windows
// and plots them by inserted_at date instead of a commit range.
export const SPYRE_DATE_RANGE_ARCHES = ["s390x", "ppc64le"];

export const SPYRE_DATE_RANGE_ARCHES_SQL = SPYRE_DATE_RANGE_ARCHES.map(
  (a) => `'${a}'`
).join(", ");

export function isSpyreDateRangeView(benchmarkId: string, arch?: string) {
  return (
    benchmarkId === SPYRE_E2E_BENCHMARK_ID &&
    SPYRE_DATE_RANGE_ARCHES.includes(arch ?? "")
  );
}
