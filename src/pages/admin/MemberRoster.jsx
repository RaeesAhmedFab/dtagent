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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, RefreshCw, Mail, Phone, Info, BarChart2, ExternalLink, Ban, Eye, EyeOff } from "lucide-react";

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
  { title: "Total members",  value: "12", change: "4 this month",   trend: "up",      strokeColor: "#2563eb", data: generateSparklineData("up") },
  { title: "Premier tier",   value: "6",  change: "63% of roster",  trend: "neutral",  strokeColor: "#16a34a", data: generateSparklineData("up") },
  { title: "Active today",   value: "8",  change: "DAU 67%",        trend: "up",      strokeColor: "#d97706", data: generateSparklineData("up") },
  { title: "Email opt-in",   value: "9",  change: "75% of roster",  trend: "neutral",  strokeColor: "#6b7280", data: generateSparklineData("up") },
];

// ─── Table data ───────────────────────────────────────────────────
const MEMBERS = [
  { init:"AL", name:"Amanda Levi RDH",     email:"alevi@brightsmiledso.org",      role:"Dental Hygienist",   tier:"Standard", first:"Jun 2022", last:"Today 9:10 AM",  today:true,  alerts:["Email","SMS"], queries:61  },
  { init:"BT", name:"Dr. Ben Tran",         email:"btran@sunsetimplants.com",       role:"Implant Specialist", tier:"Premier",  first:"Jul 2022", last:"Today 9:48 AM",  today:true,  alerts:["Email","SMS"], queries:112 },
  { init:"DK", name:"Dr. Diana Kapoor",     email:"d.kapoor@bayareaperio.com",      role:"Periodontist",       tier:"Premier",  first:"Mar 2019", last:"Today 8:42 AM",  today:true,  alerts:["Email","SMS"], queries:148 },
  { init:"FK", name:"Dr. Frank Kowalski",   email:"fkowalski@greatlakesortho.com",  role:"Orthodontist",       tier:"Standard", first:"Oct 2021", last:"May 2",          today:false, alerts:["Email"],       queries:22  },
  { init:"MP", name:"Dr. Maria Perez",      email:"mperez@missionpediatric.com",    role:"Pediatric Dentist",  tier:"Premier",  first:"Sep 2021", last:"Yesterday",      today:false, alerts:["Email"],       queries:33  },
  { init:"PO", name:"Dr. Priya Okonkwo",    email:"pokonkwo@harvardaffiliate.edu",  role:"Oral Surgeon",       tier:"Premier",  first:"May 2020", last:"May 3",          today:false, alerts:[],              queries:8   },
  { init:"RH", name:"Dr. Robert Huang",     email:"rhuang@centraldentalgroup.com",  role:"General Dentist",    tier:"Premier",  first:"Jan 2020", last:"Today 7:55 AM",  today:true,  alerts:["Email"],       queries:94  },
  { init:"SW", name:"Dr. Sarah Whitmore",   email:"swhitmore@coastalendo.net",      role:"Endodontist",        tier:"Premier",  first:"Feb 2023", last:"May 4",          today:false, alerts:["Email","SMS"], queries:19  },
  { init:"JM", name:"Jaclyn Morales",       email:"jmorales@dtamgmt.org",           role:"DTA — Content Lead", tier:"Staff",    first:"Jan 2018", last:"Today 6:02 AM",  today:true,  alerts:[],              queries:304 },
  { init:"JB", name:"James Buell DMD",      email:"jbuell@midwestfamilydental.com", role:"General Dentist",    tier:"Standard", first:"Aug 2022", last:"Today 10:01 AM", today:true,  alerts:["Email"],       queries:77  },
  { init:"LN", name:"Lisa Nguyen RDH",      email:"lnguyen@pacificdentalhyg.com",  role:"Dental Hygienist",   tier:"Standard", first:"Dec 2023", last:"Today 8:15 AM",  today:true,  alerts:["Email","SMS"], queries:45  },
  { init:"TC", name:"Tyler Chen",           email:"t.chen@dtamgmt.org",            role:"DTA — Operations",   tier:"Staff",    first:"Nov 2018", last:"Today 6:30 AM",  today:true,  alerts:[],              queries:12  },
];

const TABS = [
  { key: "all",      label: "All (12)"      },
  { key: "Premier",  label: "Premier (6)"   },
  { key: "Standard", label: "Standard (4)"  },
  { key: "Staff",    label: "Staff (2)"     },
];

const tierStyles = {
  Premier:  "bg-green-100 text-green-700 border-green-300",
  Standard: "bg-gray-100  text-gray-600  border-gray-300",
  Staff:    "bg-orange-100 text-orange-700 border-orange-300",
};
const tierDot = {
  Premier:  "bg-green-500",
  Standard: "bg-gray-400",
  Staff:    "bg-orange-400",
};

const barColor  = (q) => q > 100 ? "bg-red-500"    : q > 75 ? "bg-orange-400" : "bg-[#0f2d5c]";
const numColor  = (q) => q > 100 ? "text-red-500"  : q > 75 ? "text-orange-400" : "text-[#0f2d5c]";

// ─── Component ────────────────────────────────────────────────────
const MemberRoster = () => {
  const [tab,    setTab]    = useState("all");
  const [search, setSearch] = useState("");

  const filtered = MEMBERS.filter((m) =>
    (tab === "all" || m.tier === tab) &&
    (!search || [m.name, m.email, m.role].some((s) =>
      s.toLowerCase().includes(search.toLowerCase())
    ))
  );

  return (
    <div className="flex flex-col gap-4">

      {/* ── Stats cards ── */}
      <StatsCards
        items={statsData}
        show={false}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
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

          {/* Filter tabs */}
          <div className="flex gap-1.5">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`text-[12px] px-3 py-1.5 rounded-md border transition-colors ${
                  tab === t.key
                    ? "bg-[#0f2d5c] text-white border-[#0f2d5c]"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" className="text-[12px] gap-1.5">
            <Download size={12} /> Export CSV
          </Button>
          <Button variant="outline" size="sm" className="text-[12px] gap-1.5">
            <RefreshCw size={12} /> Sync from YM
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
                  <TableCell className="text-[13px] text-gray-700 py-2.5">{m.role}</TableCell>

                  {/* Tier */}
                  <TableCell className="py-2.5">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium border rounded-full px-2.5 py-0.5 ${tierStyles[m.tier]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${tierDot[m.tier]}`} />
                      {m.tier}
                    </span>
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
                      <button className="p-1.5 rounded text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors">
                        <BarChart2 size={13} />
                      </button>
                      <button className="p-1.5 rounded text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors">
                        <ExternalLink size={13} />
                      </button>
                      <button className="p-1.5 rounded text-gray-300 hover:text-red-500 hover:bg-red-100 transition-colors">
                       <EyeOff size={13} />
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