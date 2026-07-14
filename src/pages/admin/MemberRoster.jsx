import { useState, useMemo, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, RefreshCw, Mail, Phone, Info, BarChart2, ExternalLink, Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAdminMembersQuery,useAdminuserBlockMutation,useAdminuserUnBlockMutation } from "../../redux/Api/adminMemberApi";
import { toast } from "sonner";
import Loader from "../../components/Loader";

// ─── Helpers ──────────────────────────────────────────────────────
const getInitials = (fullName) => {
  if (!fullName || !fullName.trim()) return "?";
  return fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const now = new Date();
  const isToday =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  if (isToday) {
    return `Today ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate();

  if (isYesterday) return "Yesterday";

  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const formatFirstLogin = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const isToday = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

const getAlerts = (prefs) => {
  const alerts = [];
  if (prefs?.email_digest && prefs.email_digest !== "off") alerts.push("Email");
  if (prefs?.sms_alert) alerts.push("SMS");
  return alerts;
};

const toTitleCase = (str) => {
  if (!str) return "";
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// ─── Sparkline data ───────────────────────────────────────────────
const generateSparklineData = (trend = "up", points = 10) => {
  let value = 50;
  return Array.from({ length: points }, (_, i) => {
    const change = trend === "up" ? Math.random() * 8 - 2 : Math.random() * 8 - 6;
    value = Math.max(10, Math.min(100, value + change));
    return { x: i, value: parseFloat(value.toFixed(1)) };
  });
};

const barColor  = (q) => q > 100 ? "bg-red-500"    : q > 75 ? "bg-orange-400" : "bg-[#0f2d5c]";
const numColor  = (q) => q > 100 ? "text-red-500"  : q > 75 ? "text-orange-400" : "text-[#0f2d5c]";

// ─── Component ────────────────────────────────────────────────────
const MemberRoster = () => {
  const [filterTier, setFilterTier] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const apiParams = useMemo(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (filterTier !== "all") params.tier = filterTier;
    return params;
  }, [debouncedSearch, filterTier]);

  const { data: userData, isLoading } = useGetAdminMembersQuery(apiParams);
  const [adminuserBlock] = useAdminuserBlockMutation();
  const [adminuserUnBlock] = useAdminuserUnBlockMutation();
  const members = userData?.data?.results || [];

  // Compute stats from API data
  const totalMembers = members.length;
  const activeTodayCount = members.filter((m) => isToday(m.last_login)).length;
  const emailOptInCount = members.filter((m) => {
    const prefs = m.notification_preferences;
    return prefs?.email_digest && prefs.email_digest !== "off";
  }).length;

  const allTiers = [
    "Associate",
    "Community Administrator",
    "Dental Organization",
    "Dental Schools",
    "DIAC Member",
    "Distributor",
    "Employee",
    "Grant Recipient",
    "Laboratory",
    "Manufacturer",
    "Prospect",
    "Scholarship Recipient",
  ];

  const statsData = [
    { title: "Total members",  value: String(totalMembers), change: `${totalMembers} total`,   trend: "neutral", strokeColor: "#2563eb", data: generateSparklineData("up") },
    { title: "Active today",   value: String(activeTodayCount),  change: totalMembers ? `DAU ${Math.round((activeTodayCount / totalMembers) * 100)}%` : "0%", trend: "up", strokeColor: "#d97706", data: generateSparklineData("up") },
    { title: "Email opt-in",   value: String(emailOptInCount),  change: totalMembers ? `${Math.round((emailOptInCount / totalMembers) * 100)}% of roster` : "0%", trend: "neutral", strokeColor: "#6b7280", data: generateSparklineData("up") },
  ];

  // Map API data to table rows
  const mappedMembers = useMemo(() => {
    return members.map((m) => {
      const name = m.full_name || `${m.first_name} ${m.last_name}`.trim() || m.email;
      return {
        id: m.id,
        ymMemberId: m.ym_member_id,
        isBlocked: m.is_blocked,
        init: getInitials(name),
        name,
        email: m.email,
        role: m.role_label || m.role,
        roleDisplay: toTitleCase(m.role_label || m.role),
        tier: m.ym_tier || "—",
        first: formatFirstLogin(m.first_login),
        last: formatDate(m.last_login),
        today: isToday(m.last_login),
        alerts: getAlerts(m.notification_preferences),
        queries: m.queries_today ?? 0,
      };
    });
  }, [members]);

  const handleToggleBlock = async (member) => {
    try {
      if (member.isBlocked) {
        await adminuserUnBlock({ id: member.id }).unwrap();
        toast.success(`${member.name} has been unblocked.`);
      } else {
        await adminuserBlock({ id: member.id }).unwrap();
        toast.success(`${member.name} has been blocked.`);
      }
    } catch (err) {
      toast.error(
        err?.data?.message || `Failed to ${member.isBlocked ? "unblock" : "block"} user.`
      );
    }
  };

  const handleExportCsv = async () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const token = JSON.parse(localStorage.getItem("auth_data") || "{}")?.tokens?.access?.token;
    const url = `${baseUrl}/users/export/`;
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "member-export.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Export downloaded successfully");
    } catch (err) {
      toast.error(err?.message || "Failed to export members");
    }
  };

  // No client-side filtering needed — API handles search and tier filtering
  const filtered = mappedMembers;

  if (isLoading) {
    return <Loader  size={80} />;
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Stats cards ── */}
      <StatsCards
        items={statsData}
        show={false}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      />

      {/* ── Member roster table ── */}
      <Card className="border border-gray-200 rounded-xl overflow-hidden">

        {/* Header */}
        <CardContent className="flex items-center gap-3 flex-wrap pt-4 pb-3 px-5">
          <p className="text-[15px] font-semibold text-gray-900 flex-1">Member roster</p>

          {/* Search */}
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-1.5 gap-2 bg-white">
            <Search size={13} className="text-gray-400 flex-shrink-0" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, role..."
              className="border-none shadow-none p-0 h-auto text-[13px] w-44 focus-visible:ring-0"
            />
          </div>

          {/* Tier filter dropdown */}
          <Select value={filterTier} onValueChange={setFilterTier}>
            <SelectTrigger className="w-[180px] h-8 text-[12px]">
              <SelectValue placeholder="All tiers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-[12px]">All tiers</SelectItem>
              {allTiers.map((tier) => (
                <SelectItem key={tier} value={tier} className="text-[12px]">
                  {tier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            className="text-[12px] gap-1.5 cursor-pointer"
            onClick={handleExportCsv}
          >
            <Download size={12} /> Export CSV
          </Button>
        </CardContent>

        {/* Info banner */}
        <div className="flex items-start gap-2 px-5 py-2.5 bg-blue-50 border-y border-blue-100 text-[12px] text-blue-800">
          <Info size={13} className="flex-shrink-0 mt-0.5" />
          <span>
            Member accounts are managed in <strong>YourMembership CMS</strong>. DTAgent does not
            create or delete members — roster and tier data sync automatically at each login via YM
            OAuth 2.0 SSO (AU-02, AU-06). To add or remove a member, update their record in YM.
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 hover:bg-transparent">
                <TableHead className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">Member ↑</TableHead>
                <TableHead className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">Role</TableHead>
                <TableHead className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">Tier (from YM)</TableHead>
                <TableHead className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">First Login</TableHead>
                <TableHead className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">Last Login</TableHead>
                <TableHead className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">Alerts</TableHead>
                <TableHead className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase text-right pr-10">Queries Today /100</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((m, i) => (
                <TableRow key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">

                  {/* Member */}
                  <TableCell className="py-2.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#0f2d5c] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                        {m.init}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-gray-900 leading-tight">{m.name}</p>
                        <p className="text-[11px] text-gray-400">{m.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Role */}
                  <TableCell className="text-[13px] text-gray-700 py-2.5">{m.roleDisplay}</TableCell>

                  {/* Tier */}
                  <TableCell className="py-2.5">
                    <span className="text-[12px] text-gray-700">{m.tier ? m.tier.toUpperCase().charAt(0) + m.tier.slice(1) : "N/A"}</span>
                  </TableCell>

                  {/* First login */}
                  <TableCell className="text-[12px] text-gray-400 py-2.5">{m.first}</TableCell>

                  {/* Last login */}
                  <TableCell className="py-2.5">
                    <span className={`text-[12px] ${m.today ? "text-sky-500 font-medium" : "text-gray-400"}`}>
                      {m.last}
                    </span>
                  </TableCell>

                  {/* Alerts */}
                  <TableCell className="py-2.5">
                    {m.alerts.length === 0 ? (
                      <span className="text-[12px] text-gray-300">None</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        {m.alerts.includes("Email") && (
                          <span className="inline-flex items-center gap-1 text-[12px] text-gray-500">
                            <Mail size={12} /> Email
                          </span>
                        )}
                        {m.alerts.includes("SMS") && (
                          <span className="inline-flex items-center gap-1 text-[12px] text-gray-500">
                            <Phone size={12} /> SMS
                          </span>
                        )}
                      </div>
                    )}
                  </TableCell>

                  {/* Queries bar */}
                  <TableCell className="py-2.5 pr-4">
                    <div className="flex items-center gap-2 justify-end">
                      <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barColor(m.queries)}`}
                          style={{ width: `${Math.min(m.queries, 100)}%` }}
                        />
                      </div>
                      <span className={`text-[12px] font-semibold w-8 text-right ${numColor(m.queries)}`}>
                        {m.queries}
                      </span>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-2.5">
                    <div className="flex items-center gap-0.5">
                      <button className="p-1.5 rounded text-gray-500 hover:bg-primary/50 transition-colors cursor-pointer ">
                        <BarChart2 size={13} />
                      </button>
                      <a
                        href={`https://dentaltradealliance.org/admin/members/profile.aspx?id=${m.ymMemberId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded text-gray-500 hover:bg-cyan-600 hover:text-white transition-colors cursor-pointer inline-flex"
                      >
                        <ExternalLink size={13} />
                      </a>
                      <button
                        className="p-1.5 rounded text-gray-500 hover:text-red-500 hover:bg-red-100 transition-colors cursor-pointer "
                        onClick={() => handleToggleBlock(m)}
                      >
                        {m.isBlocked ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
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
            "Queries today" counts DTAgent calls this calendar day (EST). Daily cap: 100/member
            (NF-11). Session cap: 20/session (AG-08). Members see their remaining count in the agent panel.
          </span>
        </div>

      </Card>
    </div>
  );
};

export default MemberRoster;