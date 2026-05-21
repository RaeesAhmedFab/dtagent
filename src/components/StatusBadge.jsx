const StatusBadge = ({ status, count }) => {
  const variants = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    degraded: "bg-yellow-50 text-yellow-700 border-yellow-200",
    failed: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${variants[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
      {count && ` ×${count}`}
    </span>
  );
};

export default StatusBadge;
