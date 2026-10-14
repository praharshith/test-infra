import { Divider, Paper, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { BenchmarkUIConfigHandler } from "components/benchmark_v3/configs/benchmark_config_book";
import { isSpyreDateRangeView } from "lib/benchmark/spyreDateRange";
import { useDashboardSelector } from "lib/benchmark/store/benchmark_dashboard_provider";
import { BenchmarkReportFeatureNotification } from "../benchmarkRegressionReport/BenchmarkReportFeatureNotification";
import { BenchmarkReportFeatureSidePanel } from "../benchmarkRegressionReport/BenchmarkReportFeatureSidePanel";
import { CommitWorflowSelectSection } from "./components/commits/CommitWorkfowSelectSection";
import { SingleCommitSelectSelection } from "./components/commits/SingleCommitSelectSelection";

export function BenchmarkTopBar({
  config,
  title = "",
  mode = "default",
}: {
  config: BenchmarkUIConfigHandler;
  title?: string;
  mode?: string;
}) {
  const reportFeature =
    config.raw.dataRender?.sideRender?.RegressionReportFeature;
  const benchmarkId = useDashboardSelector((s) => s.benchmarkId);
  const arch = useDashboardSelector((s) => s.committedFilters?.arch);
  const hideCommitRange = isSpyreDateRangeView(benchmarkId, arch);
  return (
    <Paper
      elevation={1} // adds subtle shadow (you can increase for stronger effect)
      sx={{
        height: 90,
        position: "sticky",
        top: 0,
        paddingTop: 2,
        zIndex: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
        px: 2,
        bgcolor: "background.paper", // ensures consistent opaque color with theme
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ height: "100%" }}
      >
        {title && (
          <>
            <Typography variant="subtitle1">{title}</Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          </>
        )}
        {reportFeature && <ReportFeature reportFeature={reportFeature} />}
        {reportFeature && (
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        )}
        {/* hidden, not unmounted: its mount effect resolves lcommit/rcommit */}
        <Box sx={hideCommitRange ? { display: "none" } : undefined}>
          {mode == "default" && <CommitWorflowSelectSection />}
          {mode == "single" && <SingleCommitSelectSelection />}
        </Box>
      </Stack>
    </Paper>
  );
}

function ReportFeature({ reportFeature }: { reportFeature: any }) {
  if (!reportFeature) {
    return null;
  }
  const config = reportFeature?.config;
  const report_id = config?.report_id;

  return (
    <>
      <BenchmarkReportFeatureSidePanel id={report_id} type={"list"} />
      <BenchmarkReportFeatureNotification report_id={report_id} />
    </>
  );
}
