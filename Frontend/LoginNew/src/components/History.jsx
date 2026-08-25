import { ChevronLeft, ChevronRight, Download, FileSpreadsheet, Filter, LayoutDashboard, Search, Trash2 } from 'lucide-react';

function downloadDataset(item) {
  const csv = [
    ['Dataset', 'Type', 'Rows', 'Columns', 'Size', 'Date', 'Time', 'Status'],
    [item.name, item.type, item.rows, item.cols || '-', item.size || '-', item.date, item.time || '-', item.status],
  ].map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${item.name.replace(/\.[^/.]+$/, '')}-details.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function History({ data, searchQuery, setSearchQuery, fileTypeFilter, setFileTypeFilter, currentPage, setCurrentPage, totalPages, itemsPerPage, setItemsPerPage, onDelete, onNavigate, onViewDashboard }) {
  return <div className="history-screen max-w-7xl mx-auto space-y-5 relative z-10">
    <div className="history-heading flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div><h2 className="text-2xl font-bold">Processing History</h2><p className="text-sm text-[rgb(var(--text-s))] mt-1">Review and manage your processed datasets.</p></div>
      <button type="button" onClick={() => onNavigate('Dashboard')} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-[rgba(var(--c-main-rgb),0.35)] bg-[rgba(var(--c-main-rgb),0.1)] text-sm font-semibold text-[var(--c-main)] hover:bg-[rgba(var(--c-main-rgb),0.18)] transition-colors"><LayoutDashboard size={16} />Dashboard View</button>
    </div>
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-s))]" /><input value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search datasets..." className="w-full bg-[rgba(var(--bg-hover),0.6)] border border-[rgb(var(--border))] rounded-xl py-2 pl-9 pr-3 text-sm" /></div>
      <label className="relative flex items-center gap-2 h-10 min-h-10 bg-[rgba(var(--bg-hover),0.6)] border border-[rgb(var(--border))] rounded-xl px-3 text-sm">
        <Filter size={16} className="text-[rgb(var(--text-s))]" />
        <span className="sr-only">Filter by file type</span>
        <select value={fileTypeFilter} onChange={e => { setFileTypeFilter(e.target.value); setCurrentPage(1); }} className="h-full bg-transparent text-[rgb(var(--text-p))] outline-none pr-6 appearance-none text-sm leading-none">
          <option value="all" className="bg-[rgb(var(--bg-surface))] text-[rgb(var(--text-p))]">All files</option>
          <option value="CSV" className="bg-[rgb(var(--bg-surface))] text-[rgb(var(--text-p))]">CSV</option>
          <option value="XLSX" className="bg-[rgb(var(--bg-surface))] text-[rgb(var(--text-p))]">XLSX</option>
        </select>
      </label>
      <select value={itemsPerPage} onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="h-10 min-h-10 bg-[rgba(var(--bg-hover),0.6)] border border-[rgb(var(--border))] rounded-xl px-3 text-sm text-[rgb(var(--text-p))] appearance-none leading-none"><option value="8" className="bg-[rgb(var(--bg-surface))] text-[rgb(var(--text-p))]">8 per page</option><option value="12" className="bg-[rgb(var(--bg-surface))] text-[rgb(var(--text-p))]">12 per page</option></select>
    </div>
    <div className="history-table overflow-x-auto custom-scrollbar rounded-2xl border border-[rgb(var(--border))]"><table className="w-full text-sm text-left"><thead className="bg-[rgb(var(--bg-hover))] text-xs text-[rgb(var(--text-s))]"><tr><th className="p-4">Dataset</th><th className="p-4">Type</th><th className="p-4">Rows</th><th className="p-4">Status</th><th className="p-4">Date</th><th className="p-4">Actions</th></tr></thead><tbody>{data.map(item => <tr key={item.id} className="history-row border-t border-[rgb(var(--border))]"><td className="p-4 flex items-center gap-2"><FileSpreadsheet size={16} className="text-[var(--c-main)]" />{item.name}</td><td className="p-4 text-[rgb(var(--text-s))]">{item.type}</td><td className="p-4 text-[rgb(var(--text-s))]">{item.rows}</td><td className="p-4">{item.status}</td><td className="p-4 text-[rgb(var(--text-s))]">{item.date}</td><td className="p-4"><div className="flex items-center gap-3"><button title="View dashboard for this dataset" onClick={() => onViewDashboard(item)} className="text-[var(--c-sec)] hover:text-[var(--c-main)]"><LayoutDashboard size={15} /></button><button title="Download dataset details" onClick={() => downloadDataset(item)} className="download-action text-[var(--c-main)]"><Download size={15} /></button><button title="Delete dataset" onClick={() => onDelete(item.id)} className="text-rose-400"><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div>
    <div className="flex items-center justify-between text-xs text-[rgb(var(--text-s))]"><span>Page {currentPage} of {Math.max(totalPages, 1)}</span><div className="flex gap-2"><button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}><ChevronLeft size={16} /></button><button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)}><ChevronRight size={16} /></button></div></div>
  </div>;
}
