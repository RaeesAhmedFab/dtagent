import { useState } from "react";
import StatsCards from "../../components/StatsCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Info, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAuditLogsQuery, useGetAuditLogsStatsQuery, useLazyGetAuditLogsExportsQuery } from "../../redux/Api/auditLogsApi";
import Loader from "../../components/Loader";
// ─── Sparkline data ───────────────────────────────────────────────
const generateSparklineData = (trend = "up", points = 10) => {
  let value = 50;
  return Array.from({ length: points }, (_, i) => {
    const change = trend === "up" ? Math.random() * 8 - 2 : Math.random() * 8 - 6;
    value = Math.max(10, Math.min(100, value + change));
    return { x: i, value: parseFloat(value.toFixed(1)) };
  });
};

const ALL_ACTIONS = ["restore", "settings", "regenerate", "remove", "alert", "scrape", "member", "source"];
const ALL_ACTORS  = ["system", "Admin", "Jane Smith", "John Doe"];

// ─── Component ────────────────────────────────────────────────────
const AuditLog = () => {
  const [actionFilter, setActionFilter] = useState("all");
  const [actorFilter,  setActorFilter]  = useState("all");
  const [page, setPage] = useState(1);
  const {data:auditlogsStats} = useGetAuditLogsStatsQuery()
  const {data:auditLogs, isLoading: logsLoading, isError: logsError} = useGetAuditLogsQuery({ action: actionFilter, actor: actorFilter, page, page_size: 20 })
  const [triggerExport, { isLoading: exporting }] = useLazyGetAuditLogsExportsQuery()
  const logs = auditLogs?.data?.results || [];
  const totalCount = auditLogs?.data?.count || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / 20));

  const filtered = actionFilter !== "all" || actorFilter !== "all"
    ? logs
    : logs;

  const statsData = [
  { title: "Events today",    value: auditlogsStats?.data?.events_today,  change: "across all actors",     trend: "neutral", strokeColor: "#2563eb", data: generateSparklineData("up") },
  { title: "Content actions", value: auditlogsStats?.data?.content_actions,  change: "removes + restores",    trend: "neutral", strokeColor: "#16a34a", data: generateSparklineData("up") },
  { title: "System events",   value: auditlogsStats?.data?.system_events,  change: "scrapes + dispatches",  trend: "neutral", strokeColor: "#d97706", data: generateSparklineData("up") },
  { title: "Config changes",  value: auditlogsStats?.data?.config_changes,  change: "last 7 days",           trend: "neutral", strokeColor: "#6b7280", data: generateSparklineData("up") },
];

  const formatTime = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();
    const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    if (isToday) return `Today ${time}`;
    if (isYesterday) return `Yesterday ${time}`;
    return d.toLocaleDateString([], { month: "short", day: "numeric" }) + ` ${time}`;
  };

  const getInitials = (actor) => {
    const parts = actor.split(/[\s._-]+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return actor.slice(0, 2).toUpperCase();
  };

  const isSystemActor = (actor) => actor.toLowerCase() === "system";

  const actionBadgeClass = (action) => {
    const key = action.toUpperCase();
    const map = {
      REMOVE:   "bg-red-100   text-red-600   border-red-200",
      SCRAPE:   "bg-blue-100  text-blue-700  border-blue-200",
      RESTORE:  "bg-green-100 text-green-700 border-green-200",
      SETTINGS: "bg-sky-100   text-sky-700   border-sky-200",
      ALERT:    "bg-amber-100 text-amber-700 border-amber-200",
      REGEN:    "bg-teal-100  text-teal-700  border-teal-200",
      MEMBER:   "bg-indigo-100 text-indigo-700 border-indigo-200",
      SOURCE:   "bg-orange-100 text-orange-700 border-orange-200",
    };
    return map[key] || "bg-gray-100 text-gray-600 border-gray-200";
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

  return (
    <div className="flex flex-col gap-4">

      {/* ── Stats cards ── */}
      <StatsCards
        items={statsData}
        show={false}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      />

      {/* ── Activity log table ── */}
      <Card className="border border-gray-200 rounded-xl overflow-hidden">

        {/* Header */}
        <CardContent className="flex items-center gap-3 flex-wrap pt-4 pb-3 px-5">
          <p className="text-[15px] font-semibold text-gray-900 flex-1">Activity log</p>

          {/* Action filter */}
          <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[140px] h-8 text-[13px] border-gray-200">
              <SelectValue placeholder="All actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              {ALL_ACTIONS.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Actor filter */}
          <Select value={actorFilter} onValueChange={(v) => { setActorFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[140px] h-8 text-[13px] border-gray-200">
              <SelectValue placeholder="All actors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actors</SelectItem>
              {ALL_ACTORS.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            className="text-[12px] gap-1.5 h-8"
            disabled={exporting}
            onClick={async () => {
              try {
                const result = await triggerExport(
                  { action: actionFilter, actor: actorFilter },
                  { forceRefetch: true }
                );
                const csvText = result?.data;
                if (!csvText) {
                  console.error("Export failed: empty response", result);
                  return;
                }
                const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `audit-logs-${new Date().toISOString().slice(0,10)}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              } catch (err) {
                console.error("Export failed", err);
              }
            }}
          >
            <Download size={12} /> {exporting ? "Exporting..." : "Export"}
          </Button>
        </CardContent>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 hover:bg-transparent">
                <TableHead className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">Time</TableHead>
                <TableHead className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase ">Actor</TableHead>
                <TableHead className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase ">Action</TableHead>
                <TableHead className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">Target / Detail</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {logsLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-gray-400">
                    <Loader fullScreen={false} size={40} />
                  </TableCell>
                </TableRow>
              ) : logsError ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-red-500">
                    Failed to load audit logs.
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-gray-400">
                    No audit logs found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((row) => {
                  const sys = isSystemActor(row.actor);
                  const initials = getInitials(row.actor);
                  const actionUpper = row.action.toUpperCase();
                  return (
                    <TableRow key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">

                      {/* Time */}
                      <TableCell className="py-3 px-4 text-[12px] text-gray-400 whitespace-nowrap align-top pt-3.5">
                        {formatTime(row.created_at)}
                      </TableCell>

                      {/* Actor */}
                      <TableCell className="py-3 px-4 align-top pt-3.5">
                        <div className="flex items-center gap-2.5">
                          {sys ? (
                            <div className="w-7 h-7 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                              </svg>
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#0f2d5c] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                              {initials}
                            </div>
                          )}
                          <span className="text-[13px] text-gray-700 font-medium">{row.actor}</span>
                        </div>
                      </TableCell>

                      {/* Action badge */}
                      <TableCell className="py-3 px-4 align-top pt-3.5">
                        <span className={`inline-block text-[11px] font-bold border rounded px-2 py-0.5 tracking-wide ${actionBadgeClass(row.action)}`}>
                          {actionUpper}
                        </span>
                      </TableCell>

                      {/* Target / Detail */}
                      <TableCell className="py-3 px-4 align-top pt-3.5">
                        <p className="text-[13px] font-medium text-gray-800 leading-tight mb-0.5">{row.target}</p>
                        <p className="text-[12px] text-gray-400 leading-snug">{row.detail}</p>
                      </TableCell>

                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4 pb-4">
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

        {/* Footer note */}
        <div className="flex items-start gap-1.5 px-5 py-3 text-[11px] text-gray-400 border-t border-gray-50">
          <Info size={12} className="flex-shrink-0 mt-0.5" />
          <span>
            Audit log is immutable and append-only (AD-04). Retention: 12 months (NF-19). Articles
            archived after 90 days; audit records kept for a full year. Showing {auditLogs?.data?.count || 0} events ({filtered.length} visible after filter).
          </span>
        </div>

      </Card>
    </div>
  );
};

export default AuditLog;