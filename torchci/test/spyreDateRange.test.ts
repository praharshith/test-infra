import {
  isSpyreDateRangeView,
  SPYRE_DATE_RANGE_ARCHES,
  SPYRE_DATE_RANGE_ARCHES_SQL,
  SPYRE_E2E_BENCHMARK_ID,
} from "lib/benchmark/spyreDateRange";

describe("spyreDateRange", () => {
  test("SQL list quotes every arch", () => {
    expect(SPYRE_DATE_RANGE_ARCHES_SQL).toBe("'s390x', 'ppc64le'");
  });

  test.each(SPYRE_DATE_RANGE_ARCHES)("%s uses the date-range view", (arch) => {
    expect(isSpyreDateRangeView(SPYRE_E2E_BENCHMARK_ID, arch)).toBe(true);
  });

  test("x86_64, missing arch and other benchmarks do not", () => {
    expect(isSpyreDateRangeView(SPYRE_E2E_BENCHMARK_ID, "x86_64")).toBe(false);
    expect(isSpyreDateRangeView(SPYRE_E2E_BENCHMARK_ID, undefined)).toBe(false);
    expect(isSpyreDateRangeView("vllm_benchmark", "s390x")).toBe(false);
  });
});
