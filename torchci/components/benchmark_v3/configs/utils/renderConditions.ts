import { UIRenderConfig } from "../config_book_types";

type Filters = Record<string, string | undefined> | undefined;

function matches(
  condition: UIRenderConfig["showWhen"],
  filters: Filters
): boolean {
  return (
    !!condition && condition.in.includes(filters?.[condition.filter] ?? "")
  );
}

/** Drops renders whose showWhen/hideWhen conditions don't hold for the filters. */
export function filterRendersByCondition(
  renders: UIRenderConfig[] | undefined,
  filters: Filters
): UIRenderConfig[] | undefined {
  return renders?.filter(
    (r) =>
      (!r.showWhen || matches(r.showWhen, filters)) &&
      !matches(r.hideWhen, filters)
  );
}
