import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import ReusableTable from "@/components/ReusableTable";
import StatusBadge from "@/components/StatusBadge";
import SourceAvatar from "@/components/SourceAvatar";
import ActionButtons from "@/components/ActionButtons";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import SourcesDialog from "../../models/SourcesDialog";

// Mock data for sources
const mockSources = [
  {
    id: 1,
    initials: "ID",
    name: "Inside Dentistry",
    type: "RSS",
    lastRun: "2 min ago",
    today: 12,
    total: 1847,
    status: "active",
  },
  {
    id: 2,
    initials: "IDH",
    name: "Inside Dental Hygiene",
    type: "Custom",
    lastRun: "5 min ago",
    today: 8,
    total: 923,
    status: "active",
  },
  {
    id: 3,
    initials: "ADA",
    name: "ADA News",
    type: "RSS",
    lastRun: "12 min ago",
    today: 15,
    total: 2341,
    status: "degraded",
  },
  {
    id: 4,
    initials: "DT",
    name: "Dental Tribune",
    type: "Custom",
    lastRun: "1 hour ago",
    today: 0,
    total: 1456,
    status: "failed",
    failCount: 2,
  },
  {
    id: 5,
    initials: "DPN",
    name: "Dental Products Report",
    type: "RSS",
    lastRun: "3 min ago",
    today: 6,
    total: 1129,
    status: "active",
  },
];

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
  // Table column configuration
  // This demonstrates how the ReusableTable component can be configured
  // with custom rendering for each column
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
      render: (row) => <span className="font-semibold text-gray-900">{row.today}</span>,
    },
    {
      key: "total",
      label: "Total",
      render: (row) => <span className="text-gray-600">{row.total.toLocaleString()}</span>,
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
          onRefresh={() => console.log("Refresh", row.id)}
          onPause={() => console.log("Pause", row.id)}
          onSettings={() => console.log("Settings", row.id)}
          onDelete={() => console.log("Delete", row.id)}
        />
      ),
    },
  ];

  const [open, setOpen] = useState(false)

  const handleOpenDialog = ()=>{
    setOpen(true)
  }

  const handleCloseDialog = ()=>{
    setOpen(false)
  }


  return (
    <div>
      <div className="">
        <Card className="shadow-sm">
          {/* Dashboard Header */}
          <CardHeader className="border-b bg-white">
            <div className="flex items-center  justify-between flex-wrap gap-3">
              <h1 className="text-lg font-semibold text-gray-900">
                Configured sources · <span className="text-gray-500">11 of 50 capacity</span>
              </h1>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2 cursor-pointer ">
                  <RefreshCw className="h-4 w-4" />
                  Re-scrape all
                </Button>
                <Button onClick={handleOpenDialog} className="gap-2 bg-primary  cursor-pointer">
                  <Plus className="h-4 w-4" />
                  Add source
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-3">
            {/* Reusable Table Component */}
            {/* 
              NOTE: I created a reusable table component so the same table structure 
              can be reused across multiple dashboard pages with dynamic data and 
              configurable columns. Simply pass different columns and data props to 
              render different tables throughout the application.
            */}
            <ReusableTable columns={columns} data={mockSources} />

            <div className="px-5 pb-4 pt-2">
              <ErrorBanner
                title="Dimensions of Dental Hygiene — failed 2 consecutive runs"
                code="article.post-block"
                message="not found. Source uses custom scraper (flagged in SRS § 6.1). Email alert sent at 5:14 AM EST."
                onInvestigate={() => console.log("investigate")}
              />
            </div>

          </CardContent>
        </Card>
      </div>
      <SourcesDialog open={open} OnClose={handleCloseDialog} />
    </div>
  );
};

export default Sources;
