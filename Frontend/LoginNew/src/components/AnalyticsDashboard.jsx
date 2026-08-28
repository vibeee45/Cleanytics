import { useMemo, useState, useEffect, useRef } from 'react';
import { ArrowLeft, BarChart3, ChevronDown, Download, Filter, LineChart, MapPinned, PieChart, Sparkles, TrendingUp, Plus, AlertCircle, RefreshCw, FileSpreadsheet, FileText, Check } from 'lucide-react';

const cleanedCsvData = [
  { label: 'Jan', sales: 42, cleaned: 38 },
  { label: 'Feb', sales: 55, cleaned: 49 },
  { label: 'Mar', sales: 48, cleaned: 44 },
  { label: 'Apr', sales: 72, cleaned: 66 },
  { label: 'May', sales: 84, cleaned: 78 },
  { label: 'Jun', sales: 76, cleaned: 71 },
];

export default function AnalyticsDashboard({ dataset, datasets = [], onBack, onSelectDataset, onUpload }) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  
  const fileInputRef = useRef(null);
  const currentDataset = dataset || datasets[0] || null;
  const currentName = currentDataset?.name || 'cleaned_sales_data.csv';
  const currentType = (currentDataset?.type || 'CSV').toUpperCase();

  const pickerDatasets = useMemo(() => datasets.length ? datasets : (currentDataset ? [currentDataset] : []), [datasets, currentDataset]);

  // Fetch real analytics when dataset changes
  useEffect(() => {
    if (!currentDataset || !currentDataset.id) return;
    if (String(currentDataset.id).startsWith('temp-')) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchAnalytics = async () => {
      try {
        const token = window.localStorage.getItem('cleanytics_token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await fetch(`http://127.0.0.1:8000/api/v1/analytics/datasets/${currentDataset.id}`, { headers });
        if (!response.ok) throw new Error("Could not compute analytics for this dataset");
        const json = await response.json();
        if (isMounted) {
          setAnalyticsData(json);
          if (json.summary && json.summary.column_details && json.summary.column_details.length > 0) {
            setSelectedColumn(json.summary.column_details[0]);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setAnalyticsData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAnalytics();
    return () => { isMounted = false; };
  }, [currentDataset]);

  const handleFileChange = (e) => {
    if (onUpload) {
      onUpload(e);
      setIsPickerOpen(false);
    }
  };

  // Get dynamic stats (fallback to mock if real data is loading/error/missing)
  const stats = useMemo(() => {
    if (analyticsData?.stats) {
      const { dataset_size, data_quality } = analyticsData.stats;
      const score = Math.max(0, 100 - (data_quality.missing_percentage || 0));
      return {
        rows: dataset_size.rows.toLocaleString(),
        cols: dataset_size.columns,
        qualityScore: `${score.toFixed(1)}%`,
        missingPercentage: `${data_quality.missing_percentage.toFixed(1)}%`,
        missingCells: data_quality.missing_cells.toLocaleString(),
        isReal: true
      };
    }
    return {
      rows: currentDataset?.rows || '12,543',
      cols: currentDataset?.cols || '18',
      qualityScore: '94.8%',
      missingPercentage: '1.4%',
      missingCells: '140',
      isReal: false
    };
  }, [analyticsData, currentDataset]);

  const maxValue = Math.max(...cleanedCsvData.map((item) => item.sales));

  return (
    <div className="analytics-page animate-in fade-in duration-500">
      <header className="analytics-header">
        <button className="analytics-back" onClick={onBack}><ArrowLeft size={17} /> Back</button>
        <div className="analytics-title">
          <div className="analytics-title-icon"><BarChart3 size={20} /></div>
          <div><span>DATA PROFILER & BI DASHBOARD</span><h1>Cleaned Analytics</h1></div>
        </div>
        <button className="analytics-export"><Download size={16} /> Dashboard Download</button>
      </header>

      {/* Hidden file input for dropdown trigger */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
      />

      <div className="analytics-toolbar">
        <div className="flex items-center gap-3">
          <div>
            <p>Source: <strong>{currentName}</strong></p>
            <small>Last refreshed just now · {stats.rows} cleaned rows</small>
          </div>
          <div className="relative">
            <button 
              type="button" 
              onClick={() => setIsPickerOpen((open) => !open)} 
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg-surface))] text-sm text-[rgb(var(--text-p))] hover:border-[rgba(var(--c-main-rgb),0.35)] transition-colors cursor-pointer"
            >
              <Filter size={15} /> Choose file <ChevronDown size={14} />
            </button>
            {isPickerOpen && (
              <div className="absolute left-0 mt-2 w-72 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg-surface))] shadow-2xl z-20 overflow-hidden">
                <div className="px-4 py-2 border-b border-[rgb(var(--border))] text-xs font-semibold text-[rgb(var(--text-s))] flex items-center justify-between">
                  <span>Website files</span>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Add more file"
                    className="p-1 hover:bg-[rgb(var(--bg-hover))] rounded transition-colors text-[var(--c-main)] flex items-center justify-center cursor-pointer"
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {pickerDatasets.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectDataset?.(item);
                        setIsPickerOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-[rgb(var(--bg-hover))] transition-colors flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[rgb(var(--text-p))] truncate">{item.name}</p>
                        <p className="text-xs text-[rgb(var(--text-s))] mt-0.5">{String(item.type || '').toUpperCase()} · {item.status}</p>
                      </div>
                      {currentDataset?.id === item.id && <Check size={14} className="text-[var(--c-main)] shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <button className="flex items-center gap-1.5"><Filter size={15} /> Filter data</button>
      </div>

      <section className="analytics-kpis">
        <Kpi icon={TrendingUp} label="Total Records" value={stats.rows} change={stats.isReal ? "Verified" : "+18.4%"} />
        <Kpi icon={Sparkles} label="Data Quality" value={stats.qualityScore} change={stats.isReal ? "Calculated" : "+6.2%"} />
        <Kpi icon={LineChart} label="Columns" value={stats.cols} change={stats.isReal ? "Structured" : "+9.7%"} />
        <Kpi icon={PieChart} label="Null / Missing Cells" value={stats.missingCells} change={stats.missingPercentage} />
      </section>

      {loading ? (
        <div className="bg-[rgba(var(--bg-surface),0.75)] border border-[rgb(var(--border))] rounded-2xl p-12 flex flex-col items-center justify-center gap-4 text-center mt-6">
          <RefreshCw className="w-10 h-10 text-[var(--c-main)] animate-spin" />
          <h3 className="text-lg font-semibold text-[rgb(var(--text-p))]">Profiling Dataset...</h3>
          <p className="text-sm text-[rgb(var(--text-s))]">Running statistical calculations on columns</p>
        </div>
      ) : error ? (
        <div className="bg-[rgba(var(--bg-surface),0.75)] border border-rose-500/20 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 text-center mt-6">
          <AlertCircle className="w-12 h-12 text-rose-500" />
          <div>
            <h3 className="text-lg font-semibold text-[rgb(var(--text-p))]">Previewing Mock Insights</h3>
            <p className="text-sm text-[rgb(var(--text-s))] mt-1">Note: Raw source file is not in active memory. Showing simulated statistics below.</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="px-4 py-2 bg-[rgba(var(--c-main-rgb),0.1)] border border-[rgba(var(--c-main-rgb),0.3)] text-[var(--c-main)] rounded-xl text-xs font-semibold hover:bg-[rgba(var(--c-main-rgb),0.15)] transition-all active:scale-95 cursor-pointer"
          >
            Dismiss Alert
          </button>
          
          <AnalyticsGrid currentType={currentType} maxValue={maxValue} />
        </div>
      ) : analyticsData?.summary ? (
        /* REAL INTERACTIVE ANALYTICS PROFILER GRID */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Schema Explorer list */}
          <div className="bg-[rgba(var(--bg-surface),0.9)] border border-[rgb(var(--border))] rounded-2xl p-5 flex flex-col gap-4">
            <div>
              <h2 className="text-base font-bold text-[rgb(var(--text-p))]">Dataset Schema Explorer</h2>
              <p className="text-xs text-[rgb(var(--text-s))] mt-0.5">Select a column to inspect mathematical statistics</p>
            </div>
            
            <div className="flex-1 overflow-y-auto max-h-[500px] pr-1 space-y-2 custom-scrollbar">
              {analyticsData.summary.column_details.map((col) => {
                const missingPct = col.non_null_count + col.missing_count > 0 
                  ? (col.missing_count / (col.non_null_count + col.missing_count)) * 100 
                  : 0;
                const isSelected = selectedColumn?.column === col.column;

                return (
                  <div
                    key={col.column}
                    onClick={() => setSelectedColumn(col)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'bg-[rgba(var(--c-main-rgb),0.1)] border-[var(--c-main)] shadow-[0_0_10px_rgba(var(--c-main-rgb),0.1)]' 
                        : 'bg-[rgba(var(--bg-hover),0.3)] border-[rgb(var(--border))] hover:border-[rgba(var(--c-main-rgb),0.45)] hover:bg-[rgb(var(--bg-hover))]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-xs font-semibold text-[rgb(var(--text-p))] truncate">{col.column}</strong>
                      <span className="text-[10px] px-1.5 py-0.5 bg-[rgb(var(--border))] rounded text-[rgb(var(--text-s))] uppercase shrink-0">
                        {col.data_type.replace("object", "string")}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between gap-4">
                      <span className="text-[10px] text-[rgb(var(--text-s))]">Missing cells: {col.missing_count}</span>
                      <span className="text-[10px] font-bold text-[var(--c-main)]">{missingPct.toFixed(0)}% null</span>
                    </div>

                    <div className="h-1.5 w-full bg-[rgb(var(--bg-hover))] rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className="h-full bg-[var(--c-main)] rounded-full transition-all duration-500" 
                        style={{ width: `${Math.max(2, 100 - missingPct)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected column statistics */}
          <div className="lg:col-span-2 bg-[rgba(var(--bg-surface),0.9)] border border-[rgb(var(--border))] rounded-2xl p-5 flex flex-col gap-6">
            {selectedColumn ? (
              <div className="flex-1 flex flex-col gap-5 animate-in fade-in duration-300">
                <div className="flex items-start justify-between border-b border-[rgb(var(--border))] pb-4">
                  <div>
                    <span className="text-[10px] text-[var(--c-main)] font-bold uppercase tracking-wider">Column Profile</span>
                    <h2 className="text-xl font-bold text-[rgb(var(--text-p))] mt-0.5">{selectedColumn.column}</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[rgb(var(--text-s))]">Unique values</span>
                    <h3 className="text-lg font-bold text-[rgb(var(--text-p))]">{selectedColumn.unique_count.toLocaleString()}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[rgba(var(--bg-hover),0.3)] rounded-xl border border-[rgb(var(--border))]">
                    <span className="text-[11px] text-[rgb(var(--text-s))]">Non-Null Records</span>
                    <p className="text-lg font-bold text-[rgb(var(--text-p))] mt-1">{selectedColumn.non_null_count.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-[rgba(var(--bg-hover),0.3)] rounded-xl border border-[rgb(var(--border))]">
                    <span className="text-[11px] text-[rgb(var(--text-s))]">Missing Cells</span>
                    <p className="text-lg font-bold text-[rgb(var(--text-p))] mt-1">{selectedColumn.missing_count.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-[rgba(var(--bg-hover),0.3)] rounded-xl border border-[rgb(var(--border))]">
                    <span className="text-[11px] text-[rgb(var(--text-s))]">Data Type</span>
                    <p className="text-lg font-bold text-[var(--c-main)] mt-1 uppercase text-sm">{selectedColumn.data_type}</p>
                  </div>
                </div>

                <div className="flex-1 bg-[rgba(var(--bg-hover),0.2)] rounded-2xl border border-[rgb(var(--border))] p-5">
                  <h3 className="text-sm font-bold text-[rgb(var(--text-p))] mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--c-main)]" /> Summary Statistics
                  </h3>

                  {selectedColumn.statistics && Object.keys(selectedColumn.statistics).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(selectedColumn.statistics).map(([key, val]) => {
                        const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                        const formattedVal = typeof val === 'number' 
                          ? Number.isInteger(val) ? val.toLocaleString() : val.toFixed(3)
                          : String(val);

                        return (
                          <div key={key} className="flex justify-between items-center py-2.5 border-b border-[rgba(var(--border),0.4)]">
                            <span className="text-xs text-[rgb(var(--text-s))] font-medium">{formattedKey}</span>
                            <strong className="text-xs text-[rgb(var(--text-p))] font-semibold">{formattedVal}</strong>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[rgb(var(--text-s))] text-xs">
                      No numeric statistics computed for this text/categorical column.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-[rgb(var(--text-s))]">
                Select a column from the schema explorer to inspect.
              </div>
            )}
          </div>
        </div>
      ) : (
        <AnalyticsGrid currentType={currentType} maxValue={maxValue} />
      )}
    </div>
  );
}

function Kpi({ icon: Icon, label, value, change }) {
  return (
    <article className="analytics-kpi">
      <div className="kpi-icon"><Icon size={17} /></div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{change} status</small>
    </article>
  );
}

function AnalyticsGrid({ currentType, maxValue }) {
  return (
    <section className="analytics-grid w-full">
      <article className="analytics-card analytics-wide">
        <div className="analytics-card-heading">
          <div>
            <h2>Data Completeness</h2>
            <p>Cleaned {currentType} record completeness by month</p>
          </div>
          <span className="chart-legend"><i /> Completeness</span>
        </div>
        <div className="analytics-chart">
          <div className="y-axis"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0</span></div>
          <div className="chart-area">
            <div className="chart-grid-lines" />
            {cleanedCsvData.map((item) => (
              <div className="analytics-bar-group" key={item.label}>
                <div className="analytics-bars">
                  <b style={{ height: `${(item.sales / maxValue) * 100}%` }} />
                  <b className="cleaned-bar" style={{ height: `${(item.cleaned / maxValue) * 100}%` }} />
                </div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </article>

      <article className="analytics-card">
        <div className="analytics-card-heading">
          <div>
            <h2>Data quality</h2>
            <p>Cleaned record distribution</p>
          </div>
          <PieChart size={18} className="analytics-muted-icon" />
        </div>
        <div className="quality-donut"><strong>94.8%<small>quality score</small></strong></div>
        <div className="quality-list">
          <span><i className="quality-good" /> Valid records <b>11,891</b></span>
          <span><i className="quality-warning" /> Corrected records <b>512</b></span>
          <span><i className="quality-error" /> Removed records <b>140</b></span>
        </div>
      </article>
    </section>
  );
}
