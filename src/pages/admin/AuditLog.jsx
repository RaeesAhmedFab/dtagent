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
import { Download, Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Sparkline data ───────────────────────────────────────────────
const generateSparklineData = (trend = "up", points = 10) => {
  let value = 50;
  return Array.from({ length: points }, (_, i) => {
    const change = trend === "up" ? Math.random() * 8 - 2 : Math.random() * 8 - 6;
    value = Math.max(10, Math.min(100, value + change));
    return { x: i, value: parseFloat(value.toFixed(1)) };
  });
};

const statsData = [
  { title: "Events today",    value: "8",  change: "across all actors",     trend: "neutral", strokeColor: "#2563eb", data: generateSparklineData("up") },
  { title: "Content actions", value: "4",  change: "removes + restores",    trend: "neutral", strokeColor: "#16a34a", data: generateSparklineData("up") },
  { title: "System events",   value: "6",  change: "scrapes + dispatches",  trend: "neutral", strokeColor: "#d97706", data: generateSparklineData("up") },
  { title: "Config changes",  value: "5",  change: "last 7 days",           trend: "neutral", strokeColor: "#6b7280", data: generateSparklineData("up") },
];

// ─── Action badge styles ──────────────────────────────────────────
const actionStyles = {
  REMOVE:   "bg-red-100   text-red-600   border-red-200",
  SCRAPE:   "bg-blue-100  text-blue-700  border-blue-200",
  RESTORE:  "bg-green-100 text-green-700 border-green-200",
  SETTINGS: "bg-sky-100   text-sky-700   border-sky-200",
  ALERT:    "bg-amber-100 text-amber-700 border-amber-200",
  REGEN:    "bg-teal-100  text-teal-700  border-teal-200",
  MEMBER:   "bg-indigo-100 text-indigo-700 border-indigo-200",
  SOURCE:   "bg-orange-100 text-orange-700 border-orange-200",
};

// ─── Log data ─────────────────────────────────────────────────────
const LOG_DATA = [
  { time: "Today 10:14 AM", actor: "Jaclyn Morales", init: "JM", isSystem: false, action: "REMOVE",   title: "Article #8 — OSHA cites three NY practices...",              detail: "Moved to removed queue" },
  { time: "Today 9:58 AM",  actor: "System",         init: "SY", isSystem: true,  action: "SCRAPE",   title: "All sources — scheduled run",                                detail: "92 articles ingested · DDH failed (selector miss)" },
  { time: "Today 9:41 AM",  actor: "Jaclyn Morales", init: "JM", isSystem: false, action: "RESTORE",  title: "Article #5 — Silver diamine fluoride coverage...",           detail: "Restored from removed queue" },
  { time: "Today 9:12 AM",  actor: "Tyler Chen",     init: "TC", isSystem: false, action: "SETTINGS", title: "AI model — changed from gpt-4-turbo to gpt-4o",              detail: "Summary generation model updated" },
  { time: "Today 8:31 AM",  actor: "System",         init: "SY", isSystem: true,  action: "ALERT",    title: "Daily email digest — 5,842 recipients",                      detail: "5,820 delivered · 22 bounced · 8:00 AM EST dispatch" },
  { time: "Today 8:31 AM",  actor: "System",         init: "SY", isSystem: true,  action: "ALERT",    title: "Daily SMS alert — 1,944 recipients",                         detail: "1,941 delivered · 3 retried · 2 STOPs received" },
  { time: "Today 8:00 AM",  actor: "System",         init: "SY", isSystem: true,  action: "SCRAPE",   title: "Pre-dispatch scrape — all sources",                          detail: "4 new articles added before 8 AM send" },
  { time: "Today 6:02 AM",  actor: "Jaclyn Morales", init: "JM", isSystem: false, action: "REGEN",    title: "Article #1 — ADA releases updated infection-control guidance...", detail: "AI summary regenerated (word count: 142 → 98)" },
  { time: "May 5 11:48 PM", actor: "System",         init: "SY", isSystem: true,  action: "SCRAPE",   title: "Scheduled overnight run",                                    detail: "87 articles ingested · all sources healthy" },
  { time: "May 5 3:12 PM",  actor: "Tyler Chen",     init: "TC", isSystem: false, action: "MEMBER",   title: "New member — Lisa Nguyen RDH (Standard tier)",               detail: "Account created via SSO sync" },
  { time: "May 5 2:44 PM",  actor: "Jaclyn Morales", init: "JM", isSystem: false, action: "SOURCE",   title: "Dimensions of Dental Hygiene — scraper config updated",      detail: "Selector updated: article.post-block → div.entry" },
  { time: "May 5 1:20 PM",  actor: "Tyler Chen",     init: "TC", isSystem: false, action: "SETTINGS", title: "Alert system — weekly roundup re-enabled",                   detail: "Was disabled 2026-04-28 for template review" },
  { time: "May 4 8:00 AM",  actor: "System",         init: "SY", isSystem: true,  action: "ALERT",    title: "Daily email digest — 5,840 recipients",                      detail: "5,818 delivered · 22 bounced" },
  { time: "May 4 7:42 AM",  actor: "Jaclyn Morales", init: "JM", isSystem: false, action: "REMOVE",   title: "Article #34 — Off-topic mainstream item",                    detail: "Moved to removed queue — not dental-adjacent" },
  { time: "May 3 4:11 PM",  actor: "Tyler Chen",     init: "TC", isSystem: false, action: "MEMBER",   title: "Member suspended — inactive account (90d)",                  detail: "Account: inactive_user_029 · auto-suspend rule" },
];

const ALL_ACTIONS = ["REMOVE", "SCRAPE", "RESTORE", "SETTINGS", "ALERT", "REGEN", "MEMBER", "SOURCE"];
const ALL_ACTORS  = ["Jaclyn Morales", "Tyler Chen", "System"];

// ─── Component ────────────────────────────────────────────────────
const AuditLog = () => {
  const [actionFilter, setActionFilter] = useState("all");
  const [actorFilter,  setActorFilter]  = useState("all");

  const filtered = LOG_DATA.filter((row) =>
    (actionFilter === "all" || row.action === actionFilter) &&
    (actorFilter  === "all" || row.actor  === actorFilter)
  );

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
          <Select value={actionFilter} onValueChange={setActionFilter}>
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
          <Select value={actorFilter} onValueChange={setActorFilter}>
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

          <Button variant="outline" size="sm" className="text-[12px] gap-1.5 h-8">
            <Download size={12} /> Export
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
              {filtered.map((row, i) => (
                <TableRow key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">

                  {/* Time */}
                  <TableCell className="py-3 px-4 text-[12px] text-gray-400 whitespace-nowrap align-top pt-3.5">
                    {row.time}
                  </TableCell>

                  {/* Actor */}
                  <TableCell className="py-3 px-4 align-top pt-3.5">
                    <div className="flex items-center gap-2.5">
                      {row.isSystem ? (
                        <div className="w-7 h-7 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                          </svg>
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#0f2d5c] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {row.init}
                        </div>
                      )}
                      <span className="text-[13px] text-gray-700 font-medium">{row.actor}</span>
                    </div>
                  </TableCell>

                  {/* Action badge */}
                  <TableCell className="py-3 px-4 align-top pt-3.5">
                    <span className={`inline-block text-[11px] font-bold border rounded px-2 py-0.5 tracking-wide ${actionStyles[row.action] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                      {row.action}
                    </span>
                  </TableCell>

                  {/* Target / Detail */}
                  <TableCell className="py-3 px-4 align-top pt-3.5">
                    <p className="text-[13px] font-medium text-gray-800 leading-tight mb-0.5">{row.title}</p>
                    <p className="text-[12px] text-gray-400 leading-snug">{row.detail}</p>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer note */}
        <div className="flex items-start gap-1.5 px-5 py-3 text-[11px] text-gray-400 border-t border-gray-50">
          <Info size={12} className="flex-shrink-0 mt-0.5" />
          <span>
            Audit log is immutable and append-only (AD-04). Retention: 12 months (NF-19). Articles
            archived after 90 days; audit records kept for a full year. Showing last {LOG_DATA.length} events ({filtered.length} visible after filter).
          </span>
        </div>

      </Card>
    </div>
  );
};

export default AuditLog;