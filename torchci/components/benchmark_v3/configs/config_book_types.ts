import { DataBindingConfig } from "./utils/dataBindingRegistration";

/**
 * BenchmarkIdMappingItem is a mapping from benchmarkId to repoName and benchmarkName
 * benchmarkName is used to fetch the benchmark data from dv
 */
export interface BenchmarkIdMappingItem {
  id: string;
  repoName: string;
  benchmarkName: string; // highiest level benchmarkName that used to fetch the data from api
  benchmarkNameMapping?: Record<string, string>; // mapping from benchmarkName to benchmarkName based on page type, if this is defined, it overrides the main benchmarkName
}

export type BenchmarkConfigMap = Record<
  string,
  Partial<Record<BenchmarkPageType, BenchmarkUIConfig>>
>;

export const BenchmarkPageType = {
  DashboardPage: "dashboard",
  AggregatePage: "aggregate",
  SinglePage: "single",
} as const;

// Infer the type automatically
export type BenchmarkPageType =
  typeof BenchmarkPageType[keyof typeof BenchmarkPageType];

export type BenchmarkUIConfig = {
  apiId: string;
  type: BenchmarkPageType;
  benchmarkId: string;
  title: string;
  dataBinding: DataBindingConfig; // data binding config
  dataRender: DataRenderOption; // main render components
  required_filter_fields?: readonly string[]; // required filter fields
};

export type BenchmarkUIConfigFilterConstarint = {
  disabled?: boolean; // disable the filter
  disableOptions?: string[]; // disable the options based on value
  hidden?: boolean; // do not render the dropdown (value still comes from the URL)
};
export type BenchmarkUIConfigFilterConstarintConfig = {
  [key: string]: BenchmarkUIConfigFilterConstarint;
};

export type UIRenderCondition = {
  filter: string; // committed filter key, e.g. "arch"
  in: string[]; // the filter's value must be one of these
};

export type UIRenderConfig = {
  showWhen?: UIRenderCondition; // render only when the condition holds
  hideWhen?: UIRenderCondition; // do not render when the condition holds
  title?: string; // title of the component to render
  description?: string; // description of the component to render
  id?: string; // id of the component to render
  type: string; // type of the component to render
  config: any; // config of the component to render
};

export type SubSectionRenderConfig = {
  filterConstraint?: BenchmarkUIConfigFilterConstarintConfig; // filter constraint of the component to render, only used when it's subrender
  renders: UIRenderConfig[];
};

export type DataRenderOption = {
  type: string;
  api?: any;
  id?: string; // id of the component to render, this is used when type is 'component'
  sideRender?: { [key: string]: UIRenderConfig }; // this used to render side content, such as regression report access
  filterConstraint?: BenchmarkUIConfigFilterConstarintConfig; // applies to every render group; subSectionRenders override it
  renders?: UIRenderConfig[]; // this is used when type is predefined type such as 'default-fanout'
  subSectionRenders?: { [key: string]: SubSectionRenderConfig }; // this is used when type is predefined type such as 'default-f
};
