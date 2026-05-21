import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/**
 * ReusableTable Component
 * 
 * A flexible, reusable table component that can be used across multiple dashboard pages.
 * Supports dynamic columns, custom cell rendering, and responsive layout.
 * 
 * Props:
 * - columns: Array of column definitions { key, label, render }
 * - data: Array of row data objects
 * - className: Optional additional CSS classes
 */
const ReusableTable = ({ columns = [], data = [], className = "" }) => {
  return (
    <div className={` rounded-lg overflow-hidden ${className}`}>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            {columns.map((column) => (
              <TableHead key={column.key} className="font-semibold text-gray-700 text-xs uppercase tracking-wider">
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-gray-500 py-8">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow key={row.id || index} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <TableCell key={column.key} className="text-sm">
                    {column.render ? column.render(row) : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReusableTable;
