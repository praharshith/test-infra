import { UIRenderConfig } from "components/benchmark_v3/configs/config_book_types";
import { filterRendersByCondition } from "components/benchmark_v3/configs/utils/renderConditions";

const cond = { filter: "arch", in: ["s390x", "ppc64le"] };
const renders: UIRenderConfig[] = [
  { type: "always", config: {} },
  { type: "only-date", config: {}, showWhen: cond },
  { type: "not-date", config: {}, hideWhen: cond },
];
const types = (filters: Record<string, string>) =>
  filterRendersByCondition(renders, filters)?.map((r) => r.type);

describe("filterRendersByCondition", () => {
  test("showWhen/hideWhen follow the committed filter", () => {
    expect(types({ arch: "s390x" })).toEqual(["always", "only-date"]);
    expect(types({ arch: "ppc64le" })).toEqual(["always", "only-date"]);
    expect(types({ arch: "x86_64" })).toEqual(["always", "not-date"]);
  });

  test("missing filter value hides showWhen items", () => {
    expect(types({})).toEqual(["always", "not-date"]);
    expect(filterRendersByCondition(renders, undefined)?.length).toBe(2);
  });

  test("undefined renders stay undefined", () => {
    expect(filterRendersByCondition(undefined, {})).toBeUndefined();
  });
});
