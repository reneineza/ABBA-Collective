'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function DataTable({ columns = [], data = [], searchPlaceholder = 'Search records...' }) {
  const [query, setQuery] = useState('');

  const filteredData = data.filter((row) => {
    if (!query) return true;
    return Object.values(row).some(
      (val) => val && String(val).toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <div className="bg-charcoal border border-gold/20 rounded-sm overflow-hidden space-y-4">
      {/* Search Header */}
      <div className="p-4 border-b border-gold/20 flex justify-between items-center bg-charcoal-dark">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full py-2 pl-9 pr-4 text-xs bg-charcoal text-ivory placeholder-ivory/40 border border-gold/30 focus:border-gold focus:outline-none"
          />
          <Search size={14} className="absolute left-3 top-2.5 text-gold" />
        </div>
        <span className="text-xs text-ivory/60">
          Showing <strong>{filteredData.length}</strong> records
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-ivory/80">
          <thead className="bg-charcoal-dark border-b border-gold/20 text-[10px] uppercase tracking-widest text-gold font-semibold">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="p-4">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-ivory/50 italic">
                  No matching records found.
                </td>
              </tr>
            ) : (
              filteredData.map((row, rowIdx) => (
                <tr key={row.id || rowIdx} className="hover:bg-ivory/5 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="p-4 align-middle">
                      {col.cell ? col.cell(row) : col.accessor ? col.accessor(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
