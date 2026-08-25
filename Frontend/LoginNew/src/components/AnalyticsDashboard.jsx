import { useMemo, useState } from 'react';
import { ArrowLeft, BarChart3, ChevronDown, Download, Filter, LineChart, MapPinned, PieChart, Sparkles, TrendingUp } from 'lucide-react';

const cleanedCsvData = [
  { label: 'Jan', sales: 42, cleaned: 38 },
  { label: 'Feb', sales: 55, cleaned: 49 },
  { label: 'Mar', sales: 48, cleaned: 44 },
  { label: 'Apr', sales: 72, cleaned: 66 },
  { label: 'May', sales: 84, cleaned: 78 },
  { label: 'Jun', sales: 76, cleaned: 71 },
];

export default function AnalyticsDashboard({ dataset, datasets = [], onBack, onSelectDataset }) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const maxValue = Math.max(...cleanedCsvData.map((item) => item.sales));
  const currentDataset = dataset || datasets[0] || null;
  const currentName = currentDataset?.name || 'cleaned_sales_data.csv';
  const currentType = (currentDataset?.type || 'CSV').toUpperCase();
  const currentRows = currentDataset?.rows || '12,543';

  const pickerDatasets = useMemo(() => datasets.length ? datasets : (currentDataset ? [currentDataset] : []), [datasets, currentDataset]);

  return <div className="analytics-page">
    <header className="analytics-header">
      <button className="analytics-back" onClick={onBack}><ArrowLeft size={17} /> Back</button>
      <div className="analytics-title">
        <div className="analytics-title-icon"><BarChart3 size={20} /></div>
        <div><span>POWER BI STYLE REPORT</span><h1>Cleaned Analytics</h1></div>
      </div>
      <button className="analytics-export"><Download size={16} /> Dashboard Download</button>
    </header>

    <div className="analytics-toolbar">
      <div className="flex items-center gap-3">
        <div>
          <p>Source: <strong>{currentName}</strong></p>
          <small>Last refreshed just now · {currentRows} cleaned rows</small>
        </div>
        <div className="relative">
          <button type="button" onClick={() => setIsPickerOpen((open) => !open)} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg-surface))] text-sm text-[rgb(var(--text-p))] hover:border-[rgba(var(--c-main-rgb),0.35)] transition-colors">
            <Filter size={15} /> Choose file <ChevronDown size={14} />
          </button>
          {isPickerOpen && (
            <div className="absolute left-0 mt-2 w-72 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg-surface))] shadow-2xl z-20 overflow-hidden">
              <div className="px-4 py-2 border-b border-[rgb(var(--border))] text-xs font-semibold text-[rgb(var(--text-s))]">Website files</div>
              <div className="max-h-64 overflow-y-auto">
                {pickerDatasets.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectDataset?.(item);
                      setIsPickerOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-[rgb(var(--bg-hover))] transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[rgb(var(--text-p))] truncate">{item.name}</p>
                        <p className="text-xs text-[rgb(var(--text-s))] mt-0.5">{String(item.type || '').toUpperCase()} · {item.status}</p>
                      </div>
                      <span className="text-xs text-[var(--c-main)]">{item.date || ''}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <button><Filter size={15} /> Filter data</button>
    </div>

    <section className="analytics-kpis">
      <Kpi icon={TrendingUp} label="Total revenue" value="$284.6K" change="+18.4%" />
      <Kpi icon={Sparkles} label="Data quality" value="94.8%" change="+6.2%" />
      <Kpi icon={LineChart} label="Average order" value="$128.40" change="+9.7%" />
      <Kpi icon={PieChart} label="Clean records" value="12,543" change="98.6%" />
    </section>

    <section className="analytics-grid">
      <article className="analytics-card analytics-wide">
        <div className="analytics-card-heading">
          <div>
            <h2>Revenue performance</h2>
            <p>Cleaned {currentType} sales data by month</p>
          </div>
          <span className="chart-legend"><i /> Revenue</span>
        </div>
        <div className="analytics-chart">
          <div className="y-axis"><span>$100k</span><span>$75k</span><span>$50k</span><span>$25k</span><span>$0</span></div>
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

      <article className="analytics-card analytics-wide">
        <div className="analytics-card-heading">
          <div>
            <h2>Top cleaned categories</h2>
            <p>Highest performing categories from your {currentType}</p>
          </div>
          <BarChart3 size={18} className="analytics-muted-icon" />
        </div>
        <div className="category-list">
          {[
            ['Electronics', '82%', 'category-electronics'],
            ['Home & Garden', '68%', 'category-home'],
            ['Office Supplies', '54%', 'category-office'],
            ['Accessories', '41%', 'category-accessories'],
          ].map(([name, value, className]) => (
            <div className="category-row" key={name}>
              <div><span>{name}</span><b>{value}</b></div>
              <div className="category-track"><i className={className} style={{ width: value }} /></div>
            </div>
          ))}
        </div>
      </article>

      <article className="analytics-card map-card">
        <div className="analytics-card-heading">
          <div>
            <h2>Dataset activity map</h2>
            <p>Live processing locations</p>
          </div>
          <MapPinned size={18} className="analytics-muted-icon" />
        </div>
        <div className="activity-map">
          <span className="map-grid" />
          <svg viewBox="0 0 360 180" aria-hidden="true">
            <path d="M28 132 C82 75 105 148 164 94 S254 42 326 67" />
            <path d="M46 44 C96 82 126 31 184 61 S254 135 314 118" />
          </svg>
          <i className="map-pin pin-one" />
          <i className="map-pin pin-two" />
          <i className="map-pin pin-three" />
        </div>
        <div className="map-footer"><span><b className="live-dot" /> Live sync</span><strong>24 active datasets</strong></div>
      </article>
    </section>
  </div>;
}

function Kpi({ icon: Icon, label, value, change }) {
  return <article className="analytics-kpi">
    <div className="kpi-icon"><Icon size={17} /></div>
    <span>{label}</span>
    <strong>{value}</strong>
    <small>{change} from previous period</small>
  </article>;
}
