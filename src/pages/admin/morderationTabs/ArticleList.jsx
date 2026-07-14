import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Eye,
  RefreshCw,
  Trash2,
  Check,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateModerationStatusMutation, useReprocessArticleMutation } from "../../../redux/Api/adminModerationApi";
import Loader from "../../../components/Loader";

const CategoryBadge = ({ cat }) => (
  <span
    key={cat}
    className="text-[11px] font-semibold border rounded px-2 py-0.5 w-fit"
    style={getCategoryStyle(cat)}
  >
    {cat}
  </span>
);

function getCategoryStyle(cat) {
  const lower = cat.toLowerCase();
  const map = {
    business: { color: "#6b7280" },
    regulation: { color: "#7c3aed" },
    clinical: { color: "#db2777" },
    technology: { color: "#2563eb" },
    hygiene: { color: "#0d9488" },
    products: { color: "#d97706" },
    mainstream: { color: "#059669" },
  };
  const entry = map[lower];
  if (!entry) return {};
  return {
    color: entry.color,
    borderColor: `${entry.color}40`,
    backgroundColor: `${entry.color}14`,
  };
}

const StatusBadge = ({ status }) =>
  status === "live" ? (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-green-800 bg-green-100 rounded-full px-2.5 py-0.5">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Live
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-rose-700 bg-rose-100 rounded-full px-2.5 py-0.5">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Removed
    </span>
  );

function getTimeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

function getSourceName(item) {
  try {
    const hostname = new URL(item.original_article_url).hostname.replace(
      "www.",
      ""
    );
    return hostname;
  } catch {
    return item.original_article_url;
  }
}

function formatReads(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

const RemoveModal = ({ open, onOpenChange, onConfirm, isRemoving }) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remove Article</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Removal Reason <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter the reason for removing this article..."
            className="min-h-[100px] text-sm"
          />
          {!reason.trim() && reason !== undefined && (
            <p className="text-xs text-red-500 mt-1">
              Please provide a reason before confirming.
            </p>
          )}
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isRemoving}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleConfirm}
            disabled={!reason.trim() || isRemoving}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isRemoving ? "Removing..." : "Confirm Remove"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const RestoreModal = ({ open, onOpenChange, onConfirm, isRestoring }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Restore Article</DialogTitle>
        <DialogDescription>
          Are you sure you want to restore this article? It will be set back to "Live" status and reappear in the active queue.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="gap-2 pt-4">
        <DialogClose asChild>
          <Button variant="outline" disabled={isRestoring}>
            Cancel
          </Button>
        </DialogClose>
        <Button
          onClick={onConfirm}
          disabled={isRestoring}
          className="bg-primary  text-white cursor-pointer"
        >
          {isRestoring ? "Restoring..." : "Yes, Restore"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const ArticleList = ({
  data,
  isLoading,
  error,
  uniqueCategories,
  sourcenames,
  selectedSource,
  setSelectedSource,
  selectedProduct,
  setSelectedProduct,
  page,
  setPage,
  totalPages,
}) => {
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [removingItem, setRemovingItem] = useState(null);
  const [restoringItem, setRestoringItem] = useState(null);
  const [regeneratingItem, setRegeneratingItem] = useState(null);
  const [removeError, setRemoveError] = useState("");
  const [restoreError, setRestoreError] = useState("");
  const [regenerateError, setRegenerateError] = useState("");

  const [updateModerationStatus, { isLoading: isRemoving }] =
    useUpdateModerationStatusMutation();
  const [reprocessArticle, { isLoading: isRegenerating }] =
    useReprocessArticleMutation();

  const handleRemoveClick = (item) => {
    setRemovingItem(item);
    setRemoveError("");
    setRemoveModalOpen(true);
  };

  const handleRestoreClick = (item) => {
    setRestoringItem(item);
    setRestoreError("");
    setRestoreModalOpen(true);
  };

  const handleRegenerateClick = async (item) => {
    setRegeneratingItem(item);
    setRegenerateError("");
    try {
      await reprocessArticle(item.article_id).unwrap();
    } catch (err) {
      setRegenerateError(
        err?.data?.message ||
          "Failed to regenerate article. Please try again."
      );
    } finally {
      setRegeneratingItem(null);
    }
  };

  const handleConfirmRemove = async (reason) => {
    if (!removingItem) return;
    try {
      await updateModerationStatus({
        id: removingItem.id,
        payload: {
          status: "removed",
          remove_reason: reason,
        },
      }).unwrap();
      setRemoveModalOpen(false);
      setRemovingItem(null);
      setRemoveError("");
    } catch (err) {
      setRemoveError(
        err?.data?.message ||
          "Failed to remove article. Please try again."
      );
    }
  };

  const handleConfirmRestore = async () => {
    if (!restoringItem) return;
    try {
      await updateModerationStatus({
        id: restoringItem.id,
        payload: {
          status: "live",
        },
      }).unwrap();
      setRestoreModalOpen(false);
      setRestoringItem(null);
      setRestoreError("");
    } catch (err) {
      setRestoreError(
        err?.data?.message ||
          "Failed to restore article. Please try again."
      );
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (page >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  if (isLoading) {
    return (
      <>
      <Loader fullScreen={false} size={40} />
      </>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 flex items-center justify-center">
          <p className="text-sm text-red-500">
            Failed to load moderation queue. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardContent className="flex justify-between items-center pt-5 pb-4 px-5 flex-wrap gap-3">
          <p className="text-[15px] font-semibold text-gray-800">
            Articles ingested 
          </p>
          <div className="flex items-center flex-wrap gap-2">
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-[160px] h-9 text-[13px]">
                <SelectValue placeholder="All sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                {sourcenames.map((src) => (
                  <SelectItem key={src.source_name} value={src.source_name}>
                    {src.source_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-[150px] h-9 text-[13px]">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {uniqueCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* <Button variant="outline" className="h-9 text-[13px] gap-1.5">
              <Filter size={13} /> More filters
            </Button> */}
          </div>
        </CardContent>

        <Separator />

        <CardContent className="p-0">
          {data.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">
              No articles match the selected filters.
            </div>
          ) : (
            data.map((item, index) => {
              const source = getSourceName(item);
              const time = getTimeAgo(item.created_at);
              const cats = (item.ai_article_categories || []).map((c) =>
                c.charAt(0).toUpperCase() + c.slice(1)
              );
              const title = item.ai_title || item.original_article_url;
              const desc = item.ai_description || "";
              const reads = formatReads(item.read_count || 0);

              return (
                <div key={item.id || index}>
                  <div
                    className="flex flex-col md:grid gap-5 px-5 py-5"
                    style={{ gridTemplateColumns: "140px 1fr auto" }}
                  >
                    <div>
                      <p className="text-[13px] font-semibold text-gray-800 mb-0.5">
                        {source}
                      </p>
                      <p className="text-[12px] text-gray-400 mb-2.5">{time}</p>
                      <div className="flex flex-row md:flex-col gap-1.5 flex-wrap">
                        {cats.map((cat) => (
                          <CategoryBadge key={cat} cat={cat} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-gray-900 mb-1.5 leading-snug">
                        {title}
                      </p>
                      <p className="text-[13px] text-gray-500 mb-2.5 leading-relaxed">
                        {desc}
                      </p>
                      <div className="flex items-center gap-2 text-[12px] text-gray-400 flex-wrap">
                        <span className="inline-flex items-center gap-1">
                          <Sparkles size={12} /> AI summary ·{" "}
                          {item.ai_summary_model?.replace("gpt-", "GPT-") ||
                            "GPT-4"}
                        </span>
                        <span>·</span>
                        <span>{reads} reads</span>
                        <span>·</span>
                        <StatusBadge status={item.status} />
                      </div>
                      {item.status === "removed" && item.remove_reason && (
                        <p className="text-[12px] text-gray-400 mt-2 italic">
                          Reason: {item.remove_reason}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-row md:flex-col items-start gap-1.5 pt-0.5 mt-3 md:mt-0">
                      <button className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 border border-gray-200 rounded-md px-2.5 py-1.5 hover:bg-gray-50 whitespace-nowrap">
                        <Eye size={13} /> Preview
                      </button>
                      <button
                        onClick={() => handleRegenerateClick(item)}
                        disabled={isRegenerating && regeneratingItem?.id === item.id}
                        className="inline-flex items-center gap-1.5 text-[12px]  bg-primary/10 text-gray-500 border border-gray-200 rounded-md px-2.5 py-1.5 hover:bg-primary/50 hover:text-white whitespace-nowrap cursor-pointer disabled:opacity-50"
                      >
                        {isRegenerating && regeneratingItem?.id === item.id ? (
                          <><RefreshCw size={13} className=" animate-spin" />Regenerating...</>
                        ) : (
                          <>
                            <RefreshCw size={13} /> Regenerate
                          </>
                        )}
                      </button>
                      {item.status === "removed" ? (
                        <button
                          onClick={() => handleRestoreClick(item)}
                          className="inline-flex items-center gap-1.5 text-[12px] bg-primary text-white border border-gray-200 rounded-md px-2.5 py-1.5 whitespace-nowrap cursor-pointer"
                        >
                          <Check size={13} /> Restore
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRemoveClick(item)}
                          className="inline-flex items-center gap-1.5 text-[12px] text-red-600 border border-red-200 rounded-md px-2.5 py-1.5 bg-red-50 hover:bg-red-100 whitespace-nowrap cursor-pointer"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      )}
                    </div>
                  </div>
                  {index < data.length - 1 && <Separator />}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="cursor-pointer"
          >
            <ChevronLeft size={14} />
          </Button>
          {getPageNumbers().map((p, idx) =>
            p === "..." ? (
              <span key={`ellipsis-${idx}`} className="px-1 text-gray-400 select-none">...</span>
            ) : (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(p)}
                className={`min-w-[32px] cursor-pointer ${
                  p === page ? "bg-[#0f2d5c] text-white" : ""
                }`}
              >
                {p}
              </Button>
            )
          )}
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="cursor-pointer"
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      )}

      <RemoveModal
        open={removeModalOpen}
        onOpenChange={setRemoveModalOpen}
        onConfirm={handleConfirmRemove}
        isRemoving={isRemoving}
      />

      <RestoreModal
        open={restoreModalOpen}
        onOpenChange={setRestoreModalOpen}
        onConfirm={handleConfirmRestore}
        isRestoring={isRemoving}
      />

      {removeError && (
        <p className="text-sm text-red-500 mt-2 text-center">{removeError}</p>
      )}
      {restoreError && (
        <p className="text-sm text-red-500 mt-2 text-center">{restoreError}</p>
      )}
      {regenerateError && (
        <p className="text-sm text-red-500 mt-2 text-center">{regenerateError}</p>
      )}
    </>
  );
};

export default ArticleList;