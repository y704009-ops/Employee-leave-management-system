import React from 'react';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';

const Table = ({
  columns = [],
  data = [],
  keyExtractor,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no entries matching your criteria.',
  emptyAction,
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center space-y-3 bg-white rounded-xl border border-slate-200/80">
        <LoadingSpinner size="md" />
        <p className="text-xs text-slate-500 font-medium">Loading data...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />;
  }

  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-slate-200/90 bg-white shadow-2xs ${className}`}>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50/90 border-b border-slate-200/80">
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 select-none ${col.headerClassName || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row, rowIdx) => {
            const rowKey = keyExtractor ? keyExtractor(row) : row.id || rowIdx;
            return (
              <tr key={rowKey} className="hover:bg-slate-50/75 transition-colors group">
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key || colIdx}
                    className={`px-4 py-3 text-sm text-slate-700 align-middle ${col.className || ''}`}
                  >
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
