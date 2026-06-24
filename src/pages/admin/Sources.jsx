import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ReusableTable from "@/components/ReusableTable";
import StatusBadge from "@/components/StatusBadge";
import SourceAvatar from "@/components/SourceAvatar";
import ActionButtons from "@/components/ActionButtons";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import SourcesDialog from "../../models/SourcesDialog";
import {
  useGetSourcesQuery,
  useUpdateSourceMutation,
  useRunSourceMutation,
  useRunAllSourcesMutation,
  useDeleteSourceMutation,
} from "../../redux/Api/sourcesapi";

// Helper to generate initials from a name
const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Helper to format ISO date to relative time
const getRelativeTime = (dateStr) => {
  if (!dateStr) return "Never";
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
};

// Helper to map API source_type to display type
const getSourceTypeLabel = (type) => {
  const typeMap = {
    rss_archive: "RSS Archive",
    scrapper: "Scrapper",
  };
  return typeMap[type] || type;
};

// Helper to determine status variant for StatusBadge
// If current_run exists, use its status (queued, running, etc.)
// Otherwise fall back to the source's own status field
const getStatusInfo = (source) => {
  if (source.current_run) {
    return { status: source.current_run.status,};
  }
  if (source.status === "failed") return { status: "failed", };
  if (source.status === "active") return { status: "active",  };
  return { status: source.status, };
};

export const ErrorBanner = ({ title, message, code, onInvestigate }) => (
  <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
    <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
    <div className="flex-1 min-w-0">
      <p className="text-[13px] font-semibold text-red-700 mb-0.5">{title}</p>
      <p className="text-[13px] text-red-800 leading-relaxed">
        Selector mismatch:{" "}
        <code className="font-mono text-[12px] bg-white px-1.5 py-0.5 rounded border border-red-200">
          {code}
        </code>{" "}
        {message}
      </p>
    </div>
    <button
      onClick={onInvestigate}
      className="flex-shrink-0 text-[13px] px-3 py-1.5 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 whitespace-nowrap"
    >
      Investigate
    </button>
  </div>
);

const Sources = () => {
  const {
    data: sourcesResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSourcesQuery(undefined, {
    pollingInterval: 10000,
  });
  const [updateSource] = useUpdateSourceMutation();
  const [runSource] = useRunSourceMutation();
  const [runAllSources, { isLoading: isRunningAll }] =
    useRunAllSourcesMutation();
  const [deleteSource] = useDeleteSourceMutation();

  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sourceToDelete, setSourceToDelete] = useState(null);

  // Transform API response to table-friendly format
  const sources = sourcesResponse?.data?.results || [];
  const totalCount = sourcesResponse?.data?.count || 0;

  const tableData = sources.map((source) => ({
    id: source.id,
    source_id: source.source_id,
    initials: getInitials(source.source_name),
    name: source.source_name,
    type: getSourceTypeLabel(source.source_type),
    raw_type: source.source_type,
    lastRun: getRelativeTime(source.last_run),
    last_run_raw: source.last_run,
    today: source.today_articles,
    total: source.article_count,
    status: getStatusInfo(source).status,
    failCount: getStatusInfo(source).failCount,
    is_scraping: source.is_scraping,
    current_run: source.current_run,
    last_error: source.last_error,
    source_url: source.source_url,
  }));

  // Column configuration
  const columns = [
    {
      key: "source",
      label: "Source",
      render: (row) => <SourceAvatar initials={row.initials} name={row.name} />,
    },
    {
      key: "type",
      label: "Type",
      render: (row) => <span className="text-gray-600">{row.type}</span>,
    },
    {
      key: "lastRun",
      label: "Last Run",
      render: (row) => <span className="text-gray-600">{row.lastRun}</span>,
    },
    {
      key: "today",
      label: "Today",
      render: (row) => (
        <span className="font-semibold text-gray-900">{row.today}</span>
      ),
    },
    {
      key: "total",
      label: "Total",
      render: (row) => (
        <span className="text-gray-600">{row.total.toLocaleString()}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} count={row.failCount} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <ActionButtons
          isPaused={row.status === "paused" || row.status === "failed"}
          onRefresh={() => handleRunSource(row.id)}
          onPause={() => handleTogglePause(row)}
          onSettings={() => console.log("Settings", row.id)}
          onDelete={() => handleOpenDeleteDialog(row.id, row.name)}
        />
      ),
    },
  ];

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleOpenDeleteDialog = (id, name) => {
    setSourceToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSourceToDelete(null);
  };

  const handleRunSource = useCallback(
    async (id) => {
      try {
        await runSource(id).unwrap();
        refetch();
        toast.success("Source re-scrape started successfully");
      } catch (err) {
        console.error("Failed to run source:", err);
        toast.error(err?.data?.message || "Failed to run source");
      }
    },
    [runSource, refetch]
  );

  const handleRunAllSources = useCallback(async () => {
    try {
      await runAllSources().unwrap();
      refetch();
      toast.success("All sources re-scrape started");
    } catch (err) {
      console.error("Failed to run all sources:", err);
      toast.error(err?.data?.message || "Failed to run all sources");
    }
  }, [runAllSources, refetch]);

  const handleConfirmDelete = useCallback(async () => {
    if (!sourceToDelete) return;
    try {
      await deleteSource(sourceToDelete.id).unwrap();
      refetch();
      toast.success(`"${sourceToDelete.name}" deleted successfully`);
      handleCloseDeleteDialog();
    } catch (err) {
      console.error("Failed to delete source:", err);
      toast.error(err?.data?.message || "Failed to delete source");
    }
  }, [deleteSource, refetch, sourceToDelete]);

  const handleTogglePause = useCallback(
    async (row) => {
      const newStatus = row.status === "active" ? "paused" : "active";
      try {
        await updateSource({
          id: row.id,
          data: { status: newStatus },
        }).unwrap();
        refetch();
        toast.success(
          `"${row.name}" ${newStatus === "paused" ? "paused" : "activated"} successfully`
        );
      } catch (err) {
        console.error("Failed to update source status:", err);
        toast.error(err?.data?.message || "Failed to update source status");
      }
    },
    [updateSource, refetch]
  );

  // Get failed sources for error banners
  const failedSources = tableData.filter(
    (s) => s.status === "failed" && s.last_error
  );

  return (
    <div>
      <div className="">
        <Card className="shadow-sm">
          {/* Dashboard Header */}
          <CardHeader className="border-b bg-white">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h1 className="text-lg font-semibold text-gray-900">
                Configured sources ·{" "}
                <span className="text-gray-500">
                  {totalCount} of 50 capacity
                </span>
              </h1>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="gap-2 cursor-pointer"
                  onClick={handleRunAllSources}
                  disabled={isRunningAll}
                >
                  {isRunningAll ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Re-scrape all
                </Button>
                <Button
                  onClick={handleOpenDialog}
                  className="gap-2 bg-primary cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Add source
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-3">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            )}

            {/* Error State */}
            {isError && !isLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertTriangle className="h-8 w-8 text-red-400 mb-2" />
                <p className="text-sm text-red-600 mb-1">
                  Failed to load sources
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  {error?.data?.message || error?.message || "Unknown error"}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="cursor-pointer"
                >
                  Try again
                </Button>
              </div>
            )}

            {/* Data Table */}
            {!isLoading && !isError && (
              <ReusableTable columns={columns} data={tableData} />
            )}

            {/* Error Banners for failed sources */}
            {!isLoading && failedSources.length > 0 && (
              <div className="px-5 pb-4 pt-2 space-y-2">
                {failedSources.map((source) => (
                  <ErrorBanner
                    key={source.id}
                    title={`${source.name} — failed`}
                    code={source.source_id}
                    message={source.last_error}
                    onInvestigate={() => console.log("investigate", source.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={handleCloseDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Source</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                "{sourceToDelete?.name}"
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SourcesDialog open={open} OnClose={handleCloseDialog} />
    </div>
  );
};

export default Sources;