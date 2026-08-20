import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Home, LayoutDashboard, Clock, Settings,
  HelpCircle, Search, Bell, Moon, Sun, Plus, UploadCloud, PieChart, Download,
  ChevronDown, FileSpreadsheet, CheckCircle2, RefreshCw,
  XCircle, Star, Bot, FileText, Sparkles, MessageSquare, Send,
  Filter, ArrowUpDown, Trash2, ChevronLeft, ChevronRight, FileAxis3D, MoreVertical,
  Palette, TrendingUp, LayoutGrid, ThumbsUp, UserRound, KeyRound
} from 'lucide-react';
import '../styles/Home.css';
import Dashboard from './Dashboard.jsx';
import History from './History.jsx';
import SettingsPanel from './Settings.jsx';
import AnalyticsDashboard from './AnalyticsDashboard.jsx';
import HelpSupport from './HelpSupport.jsx';

// Theme Configuration System (Accent Colors)
const THEMES = {
  ocean: {
    id: 'ocean', name: 'Ocean Cyan',
    main: '#27F3E0', mainRgb: '39, 243, 224',
    sec: '#39C9FF', secRgb: '57, 201, 255',
    dark: '#12B3A1', darkRgb: '18, 179, 161',
  },
  sunset: {
    id: 'sunset', name: 'Sunset Glow',
    main: '#FF7EB3', mainRgb: '255, 126, 179',
    sec: '#FF758C', secRgb: '255, 117, 140',
    dark: '#FF4757', darkRgb: '255, 71, 87',
  },
  amethyst: {
    id: 'amethyst', name: 'Amethyst',
    main: '#D946EF', mainRgb: '217, 70, 239',
    sec: '#8B5CF6', secRgb: '139, 92, 246',
    dark: '#6366F1', darkRgb: '99, 102, 241',
  },
  matrix: {
    id: 'matrix', name: 'Neon Matrix',
    main: '#4ADE80', mainRgb: '74, 222, 128',
    sec: '#22C55E', secRgb: '34, 197, 94',
    dark: '#16A34A', darkRgb: '22, 163, 74',
  },
  amber: {
    id: 'amber', name: 'Amber Glow', main: '#F59E0B', mainRgb: '245, 158, 11',
    sec: '#F97316', secRgb: '249, 115, 22', dark: '#D97706', darkRgb: '217, 119, 6',
  }
};

// Mock Data for History
const initialHistoryData = [
  { id: 1, name: 'sales_data_april.xlsx', type: 'XLSX', rows: '12,543', cols: '18', size: '2.45 MB', date: 'May 27, 2026', time: '10:30 AM', status: 'Completed' },
  { id: 2, name: 'customer_details.csv', type: 'CSV', rows: '8,921', cols: '12', size: '1.32 MB', date: 'May 26, 2026', time: '04:15 PM', status: 'Completed' },
  { id: 3, name: 'employee_data.csv', type: 'CSV', rows: '5,672', cols: '9', size: '890 KB', date: 'May 26, 2026', time: '11:20 AM', status: 'Completed' },
  { id: 4, name: 'marketing_campaign.xlsx', type: 'XLSX', rows: '15,230', cols: '25', size: '3.67 MB', date: 'May 25, 2026', time: '09:45 AM', status: 'Processing' },
  { id: 5, name: 'product_inventory.csv', type: 'CSV', rows: '2,350', cols: '14', size: '560 KB', date: 'May 24, 2026', time: '02:10 PM', status: 'Completed' },
  { id: 6, name: 'financial_report_may.csv', type: 'CSV', rows: '7,845', cols: '16', size: '1.15 MB', date: 'May 23, 2026', time: '01:05 PM', status: 'Failed' },
  { id: 7, name: 'survey_results.xlsx', type: 'XLSX', rows: '3,210', cols: '21', size: '1.98 MB', date: 'May 22, 2026', time: '10:25 AM', status: 'Completed' },
  { id: 8, name: 'website_analytics.csv', type: 'CSV', rows: '9,876', cols: '8', size: '760 KB', date: 'May 21, 2026', time: '09:15 AM', status: 'Completed' },
  { id: 9, name: 'user_feedback.csv', type: 'CSV', rows: '4,120', cols: '7', size: '620 KB', date: 'May 20, 2026', time: '04:50 PM', status: 'Completed' },
  { id: 10, name: 'operations_data.xlsx', type: 'XLSX', rows: '11,340', cols: '19', size: '2.21 MB', date: 'May 19, 2026', time: '11:40 AM', status: 'Completed' },
];

export default function DashboardApp({ onLogout, onThemeChange, email = 'lakshya@example.com', initialThemeId = 'ocean', initialDarkMode = false }) {
  const [profileName, setProfileName] = useState('Lakshya');
  const [profileEmail, setProfileEmail] = useState(email);
  const [activeTab, setActiveTab] = useState('Home'); 
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false); 
  const [selectedTimeframe, setSelectedTimeframe] = useState('Week'); 
  
  const [currentTheme, setCurrentTheme] = useState(() => THEMES[initialThemeId] || THEMES.ocean);
  // Keep the dashboard readable on first open; users can switch to dark mode from the header.
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode);
  
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [topFeedbackLiked, setTopFeedbackLiked] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);
  
  const [dashboardStats, setDashboardStats] = useState({
    totalDatasets: 0,
    cleanedDatasets: 0,
    qualityScore: 0,
    storageUsed: 0,
    originalRows: 0,
    cleanedRows: 0,
    originalColumns: 0,
    cleanedColumns: 0
  });

  const [recentDatasets, setRecentDatasets] = useState([]);

  // History Page State
  const [historyData, setHistoryData] = useState(initialHistoryData);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [selectedDashboardDataset, setSelectedDashboardDataset] = useState(null);

  const handleViewDashboard = (dataset) => {
    setSelectedDashboardDataset(dataset);
    setActiveTab('Dashboard');
  };

  // Canvas Refs
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });

  // Filter & Pagination Logic
  const filteredData = useMemo(() => {
    return historyData.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [historyData, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this dataset?")) {
      setHistoryData(historyData.filter(d => d.id !== id));
    }
  };

  // Real-Time Rendering Animation Loop Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      radius: Math.random() * 2 + 1
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${currentTheme.darkRgb}, ${isDarkMode ? '0.4' : '0.6'})`;
        ctx.fill();

        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${currentTheme.secRgb}, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        const mouseDist = Math.hypot(p.x - mousePos.current.x, p.y - mousePos.current.y);
        if (mouseDist < 150) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mousePos.current.x, mousePos.current.y);
          ctx.strokeStyle = `rgba(${currentTheme.mainRgb}, ${0.3 * (1 - mouseDist / 150)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentTheme, isDarkMode]); 

  // Dashboard Data Fetching Simulation
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const token = window.localStorage.getItem('cleanytics_token');
      if (!token) return;
      const resp = await fetch('http://127.0.0.1:8000/api/v1/datasets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!resp.ok) throw new Error();
      const datasets = await resp.json();
      
      const mapped = datasets.map(d => ({
        id: d.id,
        name: d.original_filename,
        rows: d.row_count.toLocaleString(),
        cols: d.column_count,
        date: new Date(d.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: d.status === 'uploaded' ? 'Completed' : d.status.charAt(0).toUpperCase() + d.status.slice(1),
        type: d.file_type
      }));

      const total = datasets.length;
      const originalRows = datasets.reduce((sum, d) => sum + d.row_count, 0);

      setDashboardStats({
        totalDatasets: total,
        cleanedDatasets: total,
        qualityScore: total > 0 ? 100 : 0,
        storageUsed: (originalRows * 0.0001).toFixed(1),
        originalRows: originalRows,
        cleanedRows: originalRows,
        originalColumns: total > 0 ? datasets[0].column_count : 0,
        cleanedColumns: total > 0 ? datasets[0].column_count : 0
      });
      
      setRecentDatasets(mapped.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const token = window.localStorage.getItem('cleanytics_token');
      if (!token) return;

      const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
      const tempEntry = {
        id: 'temp-' + Date.now(),
        name: file.name,
        rows: 'Uploading...', 
        cols: '-',
        date: new Date().toLocaleString(),
        status: 'Processing',
        type: isExcel ? 'xlsx' : 'csv'
      };
      
      setRecentDatasets((prev) => [tempEntry, ...prev]);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const resp = await fetch('http://127.0.0.1:8000/api/v1/datasets/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        if (!resp.ok) {
          const data = await resp.json();
          throw new Error(data.detail || 'Upload failed');
        }
        await fetchDashboardData();
      } catch (error) {
        alert(error.message || "Failed to upload file");
        setRecentDatasets((prev) => prev.filter(item => item.id !== tempEntry.id));
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };


  const navItems = [
    { name: 'Home', icon: Home },
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'History', icon: Clock },
    { name: 'Settings', icon: Settings },
    { name: 'Help & Support', icon: HelpCircle },
  ];

  const ActiveIcon = navItems.find(item => item.name === activeTab)?.icon || LayoutDashboard;

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackText('');
      setIsFeedbackOpen(false);
    }, 2000);
  };

  // --- Dynamic Chart Data based on Dropdown ---
  const getChartData = () => {
    switch (selectedTimeframe) {
      case 'Day':
        return [
          { label: '8 AM', val: 20, count: '120' },
          { label: '11 AM', val: 45, count: '450' },
          { label: '2 PM', val: 85, count: '890' },
          { label: '5 PM', val: 60, count: '600' },
          { label: '8 PM', val: 30, count: '250' },
          { label: '11 PM', val: 15, count: '90' }
        ];
      case 'Week':
        return [
          { label: 'Mon', val: 35, count: '1.2k' },
          { label: 'Tue', val: 65, count: '3.4k' },
          { label: 'Wed', val: 40, count: '1.8k' },
          { label: 'Thu', val: 80, count: '4.5k' },
          { label: 'Fri', val: 55, count: '2.9k' },
          { label: 'Sat', val: 90, count: '5.2k' },
          { label: 'Sun', val: 70, count: '3.8k' }
        ];
      case 'Month':
        return [
          { label: 'Wk 1', val: 50, count: '12.5k' },
          { label: 'Wk 2', val: 75, count: '18.2k' },
          { label: 'Wk 3', val: 45, count: '11.0k' },
          { label: 'Wk 4', val: 85, count: '22.4k' }
        ];
      case 'Year':
        return [
          { label: 'Jan', val: 40, count: '45k' },
          { label: 'Mar', val: 65, count: '78k' },
          { label: 'May', val: 55, count: '62k' },
          { label: 'Jul', val: 85, count: '95k' },
          { label: 'Sep', val: 70, count: '81k' },
          { label: 'Nov', val: 95, count: '110k' }
        ];
      default:
        return [];
    }
  };

  const getDynamicQualityScore = () => {
    switch (selectedTimeframe) {
      case 'Day': return 98;
      case 'Week': return 88;
      case 'Month': return 85;
      case 'Year': return 95;
      default: return 88;
    }
  };

  const getTimeframeLabel = () => {
    switch (selectedTimeframe) {
      case 'Day': return 'Last 24 Hours';
      case 'Week': return 'Last 7 Days';
      case 'Month': return 'Last 30 Days';
      case 'Year': return 'Last 12 Months';
      default: return 'Last 7 Days';
    }
  };

  const renderTab = () => {
    if (activeTab === 'Home') return <Dashboard userName={profileName} dashboardStats={dashboardStats} recentDatasets={recentDatasets} isLoading={isLoading} fileInputRef={fileInputRef} onUpload={handleFileUpload} onNavigate={setActiveTab} />;
    if (activeTab === 'History') return <History data={paginatedData} searchQuery={searchQuery} setSearchQuery={setSearchQuery} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} onDelete={handleDelete} onNavigate={setActiveTab} onViewDashboard={handleViewDashboard} />;
    if (activeTab === 'Settings') return <SettingsPanel profileName={profileName} profileEmail={profileEmail} onSaveProfile={(name, nextEmail) => { setProfileName(name); setProfileEmail(nextEmail); }} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} themes={THEMES} currentTheme={currentTheme} setCurrentTheme={(theme) => { setCurrentTheme(theme); onThemeChange?.(theme.id); }} />;
    if (activeTab === 'Help & Support') return <HelpSupport />;
    if (activeTab === 'Dashboard') return <AnalyticsDashboard dataset={selectedDashboardDataset} onBack={() => setActiveTab('Home')} />;
    return <Dashboard userName={profileName} dashboardStats={dashboardStats} recentDatasets={recentDatasets} isLoading={isLoading} fileInputRef={fileInputRef} onUpload={handleFileUpload} onNavigate={setActiveTab} />;
  };

  const renderContent = () => {
    
    // ----------------------------------------------------
    // HOME / DASHBOARD TAB
    // ----------------------------------------------------
    if (activeTab === 'Home') {
      return (
        <div className="max-w-7xl mx-auto space-y-6 relative z-10 animate-in fade-in duration-700">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[rgb(var(--text-p))] flex items-center gap-2">
                Welcome back, {profileName} <span className="animate-wave inline-block origin-bottom-right">👋</span>
              </h2>
              <p className="text-sm text-[rgb(var(--text-s))] mt-1">Let AI clean your data and generate powerful insights.</p>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-gradient-to-r from-[rgb(var(--success))] to-[var(--c-dark)] text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-[0_0_15px_rgba(var(--success),0.3)] hover:shadow-[0_0_25px_rgba(var(--c-main-rgb),0.5)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer">
              <Plus className="w-4 h-4" /> New Project
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* UPLOAD CSV CARD */}
            <div className="bg-[rgba(var(--bg-surface),0.9)] backdrop-blur border border-[rgb(var(--border))] rounded-2xl p-5 hover:border-[rgba(var(--c-sec-rgb),0.5)] hover:shadow-[0_8px_30px_rgba(var(--c-sec-rgb),0.15)] transition-all duration-300 hover:-translate-y-1 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="flex flex-col h-full justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[rgba(var(--c-sec-rgb),0.1)] text-[var(--c-sec)] rounded-xl shadow-[0_0_15px_rgba(var(--c-sec-rgb),0.15)] group-hover:scale-110 transition-transform duration-300 group-hover:bg-[rgba(var(--c-sec-rgb),0.2)]">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[rgb(var(--text-p))] group-hover:text-[var(--c-sec)] transition-colors">Upload CSV</h3>
                    <p className="text-xs text-[rgb(var(--text-s))] mt-1 leading-relaxed">Upload your CSV or Excel file to get started.</p>
                  </div>
                </div>
                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                  onChange={handleFileUpload} 
                />
                <button className="w-full flex items-center justify-center gap-2 py-2 bg-[rgba(var(--bg-hover),0.6)] border border-[rgb(var(--border))] rounded-lg text-[var(--c-sec)] text-xs font-medium group-hover:bg-[rgba(var(--c-sec-rgb),0.1)] group-hover:border-[rgba(var(--c-sec-rgb),0.3)] transition-all active:scale-95 cursor-pointer pointer-events-none">
                  Upload Now <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="bg-[rgba(var(--bg-surface),0.9)] backdrop-blur border border-[rgb(var(--border))] rounded-2xl p-5 hover:border-[rgba(var(--c-main-rgb),0.5)] hover:shadow-[0_8px_30px_rgba(var(--c-main-rgb),0.15)] transition-all duration-300 hover:-translate-y-1 group cursor-pointer" onClick={() => setActiveTab('Dashboard')}>
              <div className="flex flex-col h-full justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[rgba(var(--c-main-rgb),0.1)] text-[var(--c-main)] rounded-xl shadow-[0_0_15px_rgba(var(--c-main-rgb),0.15)] group-hover:scale-110 transition-transform duration-300 group-hover:bg-[rgba(var(--c-main-rgb),0.2)]">
                    <PieChart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[rgb(var(--text-p))] group-hover:text-[var(--c-main)] transition-colors">Executive Dashboard</h3>
                    <p className="text-xs text-[rgb(var(--text-s))] mt-1 leading-relaxed">Get an executive summary with key insights.</p>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-2 bg-[rgba(var(--bg-hover),0.6)] border border-[rgb(var(--border))] rounded-lg text-[var(--c-main)] text-xs font-medium group-hover:bg-[rgba(var(--c-main-rgb),0.1)] group-hover:border-[rgba(var(--c-main-rgb),0.3)] transition-all active:scale-95 cursor-pointer">
                  View Dashboard <Plus className="w-3.5 h-3.5 rotate-45 group-hover:rotate-90 transition-transform duration-500" />
                </button>
              </div>
            </div>

            <div className="bg-[rgba(var(--bg-surface),0.9)] backdrop-blur border border-[rgb(var(--border))] rounded-2xl p-5 hover:border-[rgba(var(--success),0.5)] hover:shadow-[0_8px_30px_rgba(var(--success),0.15)] transition-all duration-300 hover:-translate-y-1 group cursor-pointer" onClick={() => setActiveTab('History')}>
              <div className="flex flex-col h-full justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[rgba(var(--success),0.1)] text-[rgb(var(--success))] rounded-xl shadow-[0_0_15px_rgba(var(--success),0.15)] group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 group-hover:bg-[rgba(var(--success),0.2)]">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[rgb(var(--text-p))] group-hover:text-[rgb(var(--success))] transition-colors">Download Clean CSV</h3>
                    <p className="text-xs text-[rgb(var(--text-s))] mt-1 leading-relaxed">Download the cleaned and processed dataset.</p>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-2 bg-[rgba(var(--bg-hover),0.6)] border border-[rgb(var(--border))] rounded-lg text-[rgb(var(--success))] text-xs font-medium group-hover:bg-[rgba(var(--success),0.1)] group-hover:border-[rgba(var(--success),0.3)] transition-all active:scale-95 cursor-pointer">
                  Download Now <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>

            <div className="bg-[rgba(var(--bg-surface),0.9)] backdrop-blur border border-[rgba(var(--c-sec-rgb),0.4)] shadow-[0_0_25px_rgba(var(--c-sec-rgb),0.1)] rounded-2xl p-5 relative group hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col h-full justify-between gap-4 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[rgba(var(--c-sec-rgb),0.2)] text-[var(--c-sec)] rounded-xl shadow-[0_0_15px_rgba(var(--c-sec-rgb),0.3)] animate-pulse-slow">
                    <LayoutGrid className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[rgb(var(--text-p))]">Dashboard Tools</h3>
                    <p className="text-xs text-[rgb(var(--text-s))] mt-1 leading-relaxed">Explore detailed analytics and visual insights.</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); setIsProfileOpen(false); setIsThemeMenuOpen(false); setIsNotificationsOpen(false); setIsTimeframeOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-2 bg-[rgb(var(--bg-hover))] border border-[rgba(var(--c-sec-rgb),0.3)] rounded-lg text-[var(--c-sec)] text-xs font-medium hover:bg-[rgba(var(--c-sec-rgb),0.2)] transition-all active:scale-95 cursor-pointer"
                >
                  Open Menu <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {isDropdownOpen && (
                <div className="absolute top-[90%] right-4 w-[220px] bg-[rgb(var(--bg-surface))] border border-[rgb(var(--border))] rounded-xl shadow-2xl py-2 z-20 animate-in fade-in slide-in-from-top-2">
                  <div onClick={() => setActiveTab('Dashboard')} className="px-3 py-2 hover:bg-[rgb(var(--bg-hover))] hover:pl-5 transition-all cursor-pointer flex items-center gap-3 text-xs text-[rgb(var(--text-s))] hover:text-[rgb(var(--text-p))] group/item">
                    <LayoutDashboard className="w-4 h-4 text-[rgb(var(--text-s))] group-hover/item:text-[var(--c-main)] transition-colors" /> Data Overview
                  </div>
                  <div onClick={() => setActiveTab('Dashboard')} className="px-3 py-2 hover:bg-[rgb(var(--bg-hover))] hover:pl-5 transition-all cursor-pointer flex items-center gap-3 text-xs text-[rgb(var(--text-s))] hover:text-[rgb(var(--text-p))] group/item">
                    <Search className="w-4 h-4 text-[rgb(var(--text-s))] group-hover/item:text-[var(--c-main)] transition-colors" /> Missing Value Analysis
                  </div>
                  <div onClick={() => setActiveTab('Dashboard')} className="px-3 py-2 hover:bg-[rgb(var(--bg-hover))] hover:pl-5 transition-all cursor-pointer flex items-center gap-3 text-xs text-[rgb(var(--text-s))] hover:text-[rgb(var(--text-p))] group/item">
                    <Star className="w-4 h-4 text-[rgb(var(--text-s))] group-hover/item:text-[var(--c-main)] transition-colors" /> Data Quality Score
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DYNAMIC STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Datasets', val: dashboardStats.totalDatasets, color: 'var(--success)', icon: FileText, percent: '12%' },
              { label: 'Cleaned Datasets', val: dashboardStats.cleanedDatasets, color: 'var(--c-sec-rgb)', icon: CheckCircle2, percent: '15%' },
              { label: 'Data Quality', val: `${getDynamicQualityScore()}%`, color: 'var(--c-main-rgb)', icon: Star, percent: '8%' },
              { label: 'Storage Used', val: `${dashboardStats.storageUsed} GB`, color: 'var(--c-main-rgb)', icon: UploadCloud, percent: '10%' }
            ].map((stat, i) => (
              <div key={i} className="bg-[rgba(var(--bg-surface),0.7)] border border-[rgb(var(--border))] rounded-2xl p-5 flex items-center justify-between hover:bg-[rgb(var(--bg-hover))] hover:border-[rgba(var(--c-sec-rgb),0.4)] hover:-translate-y-1 transition-all duration-300 group cursor-default">
                <div>
                  <p className="text-xs text-[rgb(var(--text-s))] mb-1">{stat.label}</p>
                  {isLoading ? (
                    <div className="h-9 w-16 bg-[rgb(var(--bg-hover))] animate-pulse rounded"></div>
                  ) : (
                    <p className="text-3xl font-bold text-[rgb(var(--text-p))] group-hover:scale-105 origin-left transition-transform">{stat.val}</p>
                  )}
                  <p className="text-[11px] mt-2 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <TrendingUp className="w-3 h-3 text-[rgb(var(--success))]" />
                    <span className="text-[rgb(var(--success))]">{stat.percent}</span> <span className="text-[rgb(var(--text-s))]">this {selectedTimeframe.toLowerCase()}</span>
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full border bg-[rgba(${stat.color},0.1)] border-[rgba(${stat.color},0.2)] flex items-center justify-center text-[rgb(${stat.color})] group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-[0_0_15px_rgba(${stat.color},0.2)]`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              <div className="bg-[rgba(var(--bg-surface),0.9)] border border-[rgb(var(--border))] rounded-2xl p-5 transition-colors hover:border-[rgba(var(--c-sec-rgb),0.4)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[rgb(var(--text-p))]">Recent Uploaded Datasets</h3>
                  <button onClick={() => setActiveTab('Dashboard')} className="text-xs font-medium text-[var(--c-main)] border border-[rgba(var(--c-main-rgb),0.3)] rounded-lg px-3 py-1.5 hover:bg-[rgba(var(--c-main-rgb),0.1)] active:scale-95 transition-all cursor-pointer">
                    View All
                  </button>
                </div>
                
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-xs text-[rgb(var(--text-s))] border-b border-[rgb(var(--border))]">
                        <th className="pb-3 font-medium">Dataset Name</th>
                        <th className="pb-3 font-medium">Rows</th>
                        <th className="pb-3 font-medium">Columns</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        [1, 2, 3, 4].map((skeleton) => (
                          <tr key={skeleton} className="border-b border-[rgba(var(--border),0.5)]">
                            <td className="py-4"><div className="h-4 w-32 bg-[rgb(var(--bg-hover))] animate-pulse rounded"></div></td>
                            <td className="py-4"><div className="h-4 w-12 bg-[rgb(var(--bg-hover))] animate-pulse rounded"></div></td>
                            <td className="py-4"><div className="h-4 w-8 bg-[rgb(var(--bg-hover))] animate-pulse rounded"></div></td>
                            <td className="py-4"><div className="h-5 w-16 bg-[rgb(var(--bg-hover))] animate-pulse rounded-full"></div></td>
                            <td className="py-4"><div className="h-6 w-16 bg-[rgb(var(--bg-hover))] animate-pulse rounded mx-auto"></div></td>
                          </tr>
                        ))
                      ) : (
                        recentDatasets.map((ds) => (
                          <tr key={ds.id} className="border-b border-[rgba(var(--border),0.5)] hover:bg-[rgba(var(--bg-hover),0.5)] transition-colors group">
                            <td className="py-3 flex items-center gap-2">
                              {ds.type === 'csv' ? <FileText className="w-4 h-4 text-[rgb(var(--success))] group-hover:scale-110 transition-transform" /> : <FileSpreadsheet className="w-4 h-4 text-[rgb(var(--success))] group-hover:scale-110 transition-transform" />}
                              <span className="text-sm text-[rgb(var(--text-s))] font-medium group-hover:text-[rgb(var(--text-p))] group-hover:translate-x-1 transition-all truncate max-w-[150px]" title={ds.name}>{ds.name}</span>
                            </td>
                            <td className="py-3 text-sm text-[rgb(var(--text-s))]">{ds.rows}</td>
                            <td className="py-3 text-sm text-[rgb(var(--text-s))]">{ds.cols}</td>
                            <td className="py-3">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-medium transition-colors ${
                                ds.status === 'Completed' ? 'border-[rgba(var(--success),0.3)] text-[rgb(var(--success))] bg-[rgba(var(--success),0.1)] group-hover:bg-[rgba(var(--success),0.25)]' :
                                ds.status === 'Processing' ? 'border-[rgba(var(--c-sec-rgb),0.3)] text-[var(--c-sec)] bg-[rgba(var(--c-sec-rgb),0.1)] group-hover:bg-[rgba(var(--c-sec-rgb),0.25)]' :
                                'border-rose-500/30 text-rose-500 bg-rose-500/10 group-hover:bg-rose-500/25'
                              }`}>
                                {ds.status}
                              </span>
                            </td>
                            <td className="py-3 flex items-center justify-center gap-2">
                              {ds.status === 'Completed' && (
                                <>
                                  <button onClick={() => setActiveTab('Dashboard')} className="p-1.5 text-[rgb(var(--text-s))] hover:text-[var(--c-main)] hover:bg-[rgba(var(--c-main-rgb),0.1)] border border-[rgb(var(--border))] hover:border-[rgba(var(--c-main-rgb),0.5)] rounded active:scale-90 transition-all cursor-pointer"><Search className="w-3.5 h-3.5" /></button>
                                  <button onClick={() => setActiveTab('History')} className="p-1.5 text-[rgb(var(--text-s))] hover:text-[rgb(var(--success))] hover:bg-[rgba(var(--success),0.1)] border border-[rgb(var(--border))] hover:border-[rgba(var(--success),0.5)] rounded active:scale-90 transition-all cursor-pointer"><Download className="w-3.5 h-3.5" /></button>
                                </>
                              )}
                              {(ds.status === 'Processing' || ds.status === 'Failed') && (
                                <button onClick={() => setActiveTab('Dashboard')} className="p-1.5 text-[rgb(var(--text-s))] hover:text-[rgb(var(--text-p))] hover:bg-[rgb(var(--bg-hover))] border border-[rgb(var(--border))] rounded active:scale-90 transition-all cursor-pointer"><RefreshCw className={`w-3.5 h-3.5 ${ds.status === 'Processing' ? 'animate-spin-slow' : ''}`} /></button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Data Processing Trends Chart */}
              <div className="bg-[rgba(var(--bg-surface),0.9)] border border-[rgb(var(--border))] rounded-2xl p-5 flex flex-col justify-between hover:border-[rgba(var(--c-sec-rgb),0.4)] transition-colors group">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-[rgb(var(--text-p))] group-hover:text-[var(--c-main)] transition-colors">Data Processing Trends</h3>
                    <p className="text-sm text-[rgb(var(--text-s))]">Rows processed over the {getTimeframeLabel().toLowerCase()}</p>
                  </div>
                  <span className="text-xs text-[rgb(var(--text-s))] bg-[rgb(var(--bg-hover))] border border-[rgb(var(--border))] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all">
                    <TrendingUp className="w-3.5 h-3.5 text-[var(--c-main)]" /> {getTimeframeLabel()}
                  </span>
                </div>
                
                <div key={selectedTimeframe} className="flex-1 flex items-end justify-between gap-3 sm:gap-6 h-40 mt-6 px-2 animate-in fade-in zoom-in-95 duration-500">
                  {getChartData().map((data, idx) => (
                    <div key={idx} className="w-full flex flex-col items-center justify-end h-full gap-3 group/bar cursor-pointer">
                      
                      {/* Fixed Chart Bar Container */}
                      <div className="relative w-full max-w-[40px] h-full flex items-end bg-[rgba(var(--bg-hover),0.5)] rounded-t-lg border border-transparent group-hover/bar:border-[rgba(var(--c-main-rgb),0.2)] transition-colors">
                        
                        {/* Dynamic Bar Element */}
                        <div
                          className={`w-full bg-gradient-to-t from-[rgba(var(--c-dark-rgb),0.8)] to-[rgba(var(--c-main-rgb),0.8)] rounded-t-lg transition-all duration-700 ease-out group-hover/bar:from-[var(--c-dark)] group-hover/bar:to-[var(--c-sec)] group-hover/bar:shadow-[0_0_15px_rgba(var(--c-main-rgb),0.5)] relative animate-in slide-in-from-bottom-full bar-height-${isLoading ? 0 : data.val}`}
                        >
                          {/* Tooltip fixed to the top of the bar */}
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover/bar:opacity-100 group-hover/bar:-translate-y-1 transition-all text-[var(--c-main)] font-bold whitespace-nowrap pointer-events-none">
                            {data.count}
                          </div>
                          
                          {/* Inner bar shine effect */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-[rgba(255,255,255,0.3)] rounded-t-lg"></div>
                        </div>

                      </div>

                      {/* X-Axis Label */}
                      <span className="text-[11px] font-medium text-[rgb(var(--text-s))] group-hover/bar:text-[rgb(var(--text-p))] transition-colors shrink-0">
                        {data.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
            
            <div className="flex flex-col gap-6">
              <div className="bg-[rgba(var(--bg-surface),0.9)] border border-[rgb(var(--border))] rounded-2xl p-5 hover:border-[rgba(var(--c-sec-rgb),0.4)] transition-colors">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-semibold text-[rgb(var(--text-p))] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--c-main)] animate-pulse-slow" /> AI Progress
                  </h3>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-sm font-medium text-[rgb(var(--text-p))] truncate pr-2">marketing_campaign.csv</p>
                    <span className="text-sm font-bold text-[var(--c-main)]">72%</span>
                  </div>
                  <div className="h-2 w-full bg-[rgb(var(--bg-hover))] rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-[var(--c-sec)] via-[var(--c-main)] to-[var(--c-dark)] w-[72%] shadow-[0_0_10px_rgba(var(--c-main-rgb),0.8)] relative">
                      <div className="absolute top-0 bottom-0 left-0 right-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-30 animate-slide-bg"></div>
                    </div>
                  </div>
                  <p className="text-[10px] text-[rgb(var(--text-s))] mt-2 animate-pulse">Detecting anomalies...</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <p className="text-xs font-semibold text-[rgb(var(--text-s))] mb-3 border-b border-[rgb(var(--border))] pb-1">Completed</p>
                    <ul className="space-y-2.5">
                      {['Validation', 'Missing Values'].map((s, i) => (
                        <li key={i} className="flex items-center gap-2 text-[11px] text-[rgb(var(--text-s))] hover:text-[rgb(var(--text-p))] transition-colors">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[rgb(var(--success))] shrink-0" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[rgb(var(--text-s))] mb-3 border-b border-[rgb(var(--border))] pb-1">Working On</p>
                    <ul className="space-y-2.5">
                      <li className="flex items-center gap-2 text-[11px] text-[var(--c-main)]">
                        <RefreshCw className="w-3 h-3 animate-spin shrink-0" /> Outliers
                      </li>
                      <li className="flex items-center gap-2 text-[11px] opacity-70 text-[rgb(var(--text-s))]">
                        <div className="w-3 h-3 rounded-full border border-[rgb(var(--border))] shrink-0"></div> Standardize
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Quality Scope with Timeframe Dropdown */}
              <div className="bg-[rgba(var(--bg-surface),0.9)] border border-[rgb(var(--border))] rounded-2xl p-5 flex-1 flex flex-col hover:border-[rgba(var(--c-sec-rgb),0.4)] transition-colors group relative z-10">
                <div className="flex items-center justify-between mb-6 relative">
                  <h3 className="text-base font-semibold text-[rgb(var(--text-p))]">Quality Scope</h3>
                  
                  {/* TIMEFRAME DROPDOWN CONNECTED TO CHART */}
                  <div className="relative">
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setIsTimeframeOpen(!isTimeframeOpen); 
                        setIsDropdownOpen(false); 
                        setIsProfileOpen(false); 
                        setIsThemeMenuOpen(false); 
                        setIsNotificationsOpen(false); 
                      }}
                      className="text-xs font-medium text-[rgb(var(--text-s))] flex items-center gap-1.5 hover:text-[rgb(var(--text-p))] hover:bg-[rgb(var(--bg-hover))] transition-colors cursor-pointer bg-[rgba(var(--bg-hover),0.5)] px-2.5 py-1.5 rounded-lg border border-[rgba(var(--border),0.5)]"
                    >
                      {selectedTimeframe} <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isTimeframeOpen ? 'rotate-180 text-[var(--c-main)]' : ''}`} />
                    </button>
                    
                    {isTimeframeOpen && (
                      <div className="absolute right-0 mt-1.5 w-28 bg-[rgb(var(--bg-surface))] border border-[rgb(var(--border))] rounded-xl shadow-2xl py-1.5 z-30 animate-in fade-in slide-in-from-top-2">
                        {['Day', 'Week', 'Month', 'Year'].map(tf => (
                          <div 
                            key={tf}
                            onClick={() => { setSelectedTimeframe(tf); setIsTimeframeOpen(false); }}
                            className={`px-3.5 py-2 text-xs cursor-pointer transition-all flex items-center justify-between hover:bg-[rgb(var(--bg-hover))] ${selectedTimeframe === tf ? 'text-[var(--c-main)] font-bold' : 'text-[rgb(var(--text-s))] hover:text-[rgb(var(--text-p))]'}`}
                          >
                            {tf}
                            {selectedTimeframe === tf && <div className="w-1.5 h-1.5 rounded-full bg-[var(--c-main)]"></div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between flex-1 gap-4">
                  <div key={selectedTimeframe} className="quality-ring relative w-28 h-28 shrink-0 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(var(--success),0.1)] group-hover:shadow-[0_0_30px_rgba(var(--success),0.2)] transition-shadow duration-500 animate-in spin-in-12 duration-700">
                    <div className="absolute inset-2 bg-[rgb(var(--bg-surface))] rounded-full flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-[0.95]">
                      <span className="text-2xl font-bold text-[rgb(var(--text-p))]">{isLoading ? "..." : `${getDynamicQualityScore()}%`}</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    {[
                      { l: 'Complete', v: '72%', c: 'bg-[rgb(var(--success))]' },
                      { l: 'Missing', v: '18%', c: 'bg-yellow-400' },
                      { l: 'Duplicate', v: '6%', c: 'bg-[var(--c-sec)]' },
                      { l: 'Outliers', v: '4%', c: 'bg-rose-500' }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-xs hover:bg-[rgb(var(--bg-hover))] p-1 -mx-1 rounded transition-colors cursor-default">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${item.c}`}></span>
                          <span className="text-[rgb(var(--text-s))]">{item.l}</span>
                        </div>
                        <span className="font-semibold text-[rgb(var(--text-p))]">{item.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      );
    }

    // ----------------------------------------------------
    // HISTORY TAB
    // ----------------------------------------------------
    if (activeTab === 'History') {
      return (
        <div className="max-w-7xl mx-auto space-y-6 relative z-10 animate-in fade-in duration-700">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[rgb(var(--text-p))] flex items-center gap-2 transition-colors">
                Processing History
              </h2>
              <p className="text-sm text-[rgb(var(--text-s))] mt-1 transition-colors">View and manage your previously uploaded and cleaned datasets.</p>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-[rgba(var(--c-sec-rgb),0.1)] border border-[rgba(var(--c-sec-rgb),0.2)] hover:border-[rgba(var(--c-sec-rgb),0.5)] hover:bg-[rgba(var(--c-sec-rgb),0.2)] text-[var(--c-sec)] font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-300 active:scale-95 cursor-pointer">
              <UploadCloud className="w-4 h-4" /> Upload New File
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
              onChange={handleFileUpload} 
            />
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--text-s))] group-focus-within:text-[var(--c-main)] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search datasets..." 
                  value={searchQuery || ''}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-[rgba(var(--bg-surface),0.8)] border border-[rgb(var(--border))] rounded-xl py-2 pl-9 pr-4 text-sm w-64 text-[rgb(var(--text-p))] placeholder-[rgb(var(--text-s))] focus:outline-none focus:border-[rgba(var(--c-main-rgb),0.5)] focus:ring-2 focus:ring-[rgba(var(--c-main-rgb),0.2)] transition-all"
                />
              </div>
              
              <button className="flex items-center justify-between px-4 py-2 bg-[rgba(var(--bg-surface),0.8)] border border-[rgb(var(--border))] rounded-xl text-sm text-[rgb(var(--text-s))] hover:bg-[rgb(var(--bg-hover))] transition-colors">
                All File Types <ChevronDown className="ml-2 w-3.5 h-3.5" />
              </button>
              <button className="flex items-center justify-between px-4 py-2 bg-[rgba(var(--bg-surface),0.8)] border border-[rgb(var(--border))] rounded-xl text-sm text-[rgb(var(--text-s))] hover:bg-[rgb(var(--bg-hover))] transition-colors">
                All Status <ChevronDown className="ml-2 w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center justify-between px-4 py-2 bg-[rgba(var(--bg-surface),0.8)] border border-[rgb(var(--border))] rounded-xl text-sm text-[rgb(var(--text-s))] hover:bg-[rgb(var(--bg-hover))] transition-colors">
                <ArrowUpDown className="mr-2 w-3.5 h-3.5 text-[var(--c-sec)]" /> Sort by: Newest
              </button>
              <button className="flex items-center justify-center w-10 h-10 bg-[rgba(var(--bg-surface),0.8)] border border-[rgb(var(--border))] rounded-xl text-[rgb(var(--text-s))] hover:text-[var(--c-main)] hover:border-[rgba(var(--c-main-rgb),0.4)] transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-[rgba(var(--bg-surface),0.9)] backdrop-blur border border-[rgb(var(--border))] rounded-2xl overflow-hidden hover:border-[rgba(var(--c-sec-rgb),0.3)] transition-colors flex flex-col min-h-[500px] justify-between shadow-sm">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="bg-[rgba(var(--bg-hover),0.5)] text-[rgb(var(--text-s))] border-b border-[rgb(var(--border))] transition-colors">
                  <tr>
                    <th className="py-4 px-6 font-medium">Dataset Name</th>
                    <th className="py-4 px-4 font-medium">File Type</th>
                    <th className="py-4 px-4 font-medium">Rows</th>
                    <th className="py-4 px-4 font-medium">Columns</th>
                    <th className="py-4 px-4 font-medium">Size</th>
                    <th className="py-4 px-4 font-medium flex items-center gap-1 cursor-pointer hover:text-[rgb(var(--text-p))] transition-colors">
                      Upload Date <ArrowUpDown className="w-3 h-3" />
                    </th>
                    <th className="py-4 px-4 font-medium">Status</th>
                    <th className="py-4 px-6 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(var(--border),0.5)]">
                  {paginatedData.length > 0 ? paginatedData.map((row) => (
                    <tr key={row.id} className="hover:bg-[rgba(var(--bg-hover),0.6)] transition-colors group">
                      <td className="py-3 px-6 flex items-center gap-3">
                        {row.type === 'XLSX' ? 
                          <div className="w-8 h-8 rounded-lg bg-[rgba(var(--c-dark-rgb),0.1)] text-[var(--c-dark)] flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(var(--c-dark-rgb),0.1)]">
                            <FileSpreadsheet className="w-4 h-4" />
                          </div> : 
                          <div className="w-8 h-8 rounded-lg bg-[rgba(var(--c-sec-rgb),0.1)] text-[var(--c-sec)] flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(var(--c-sec-rgb),0.1)]">
                            <FileText className="w-4 h-4" />
                          </div>
                        }
                        <span className="font-medium text-[rgb(var(--text-p))] transition-colors truncate max-w-[200px]" title={row.name}>{row.name}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${
                          row.type === 'XLSX' ? 'bg-[rgba(var(--c-dark-rgb),0.1)] text-[var(--c-dark)] border-[rgba(var(--c-dark-rgb),0.2)]' : 'bg-[rgba(var(--c-sec-rgb),0.1)] text-[var(--c-sec)] border-[rgba(var(--c-sec-rgb),0.2)]'
                        }`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[rgb(var(--text-s))] transition-colors">{row.rows}</td>
                      <td className="py-3 px-4 text-[rgb(var(--text-s))] transition-colors">{row.cols}</td>
                      <td className="py-3 px-4 text-[rgb(var(--text-s))] transition-colors">{row.size}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="text-[rgb(var(--text-p))] transition-colors">{row.date}</span>
                          <span className="text-[11px] text-[rgb(var(--text-s))] transition-colors">{row.time}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-medium transition-colors ${
                          row.status === 'Completed' ? 'border-[rgba(var(--success),0.3)] text-[rgb(var(--success))] bg-[rgba(var(--success),0.1)]' :
                          row.status === 'Processing' ? 'border-[rgba(var(--c-sec-rgb),0.3)] text-[var(--c-sec)] bg-[rgba(var(--c-sec-rgb),0.1)]' :
                          'border-rose-500/30 text-rose-500 bg-rose-500/10'
                        }`}>
                          {row.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {row.status === 'Processing' && <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />}
                          {row.status === 'Failed' && <XCircle className="w-3.5 h-3.5" />}
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 rounded border border-[rgb(var(--border))] bg-[rgb(var(--bg-hover))] text-[rgb(var(--text-s))] hover:text-[var(--c-sec)] hover:border-[rgba(var(--c-sec-rgb),0.5)] transition-colors" title="View Insights">
                            <PieChart className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded border border-[rgb(var(--border))] bg-[rgb(var(--bg-hover))] text-[rgb(var(--text-s))] hover:text-[var(--c-main)] hover:border-[rgba(var(--c-main-rgb),0.5)] transition-colors" title="Download">
                            <Download className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded border border-[rgb(var(--border))] bg-[rgb(var(--bg-hover))] text-[rgb(var(--text-s))] hover:text-rose-500 hover:border-rose-500/50 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="8" className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center opacity-50">
                          <Search className="w-8 h-8 text-[rgb(var(--text-s))] mb-3" />
                          <p className="text-[rgb(var(--text-s))]">No datasets found matching "{searchQuery}"</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="py-4 px-6 border-t border-[rgb(var(--border))] bg-[rgba(var(--bg-hover),0.3)] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[rgb(var(--text-s))] transition-colors">
              <span>Showing {filteredData.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries</span>
              
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-[rgb(var(--border))] hover:bg-[rgb(var(--bg-hover))] hover:text-[rgb(var(--text-p))] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      currentPage === i + 1 
                        ? 'bg-gradient-to-r from-[var(--c-main)] to-[var(--c-dark)] text-slate-900 font-bold shadow-[0_0_10px_rgba(var(--c-main-rgb),0.4)] border-none' 
                        : 'border border-[rgb(var(--border))] hover:bg-[rgb(var(--bg-hover))] text-[rgb(var(--text-s))] hover:text-[rgb(var(--text-p))]'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-[rgb(var(--border))] hover:bg-[rgb(var(--bg-hover))] hover:text-[rgb(var(--text-p))] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      );
    }

    // ----------------------------------------------------
    // FALLBACK TAB
    // ----------------------------------------------------
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center z-10 relative animate-in fade-in zoom-in duration-300">
        <div className="p-5 bg-gradient-to-tr from-[rgba(var(--c-dark-rgb),0.1)] to-[rgba(var(--c-sec-rgb),0.1)] border border-[rgba(var(--c-dark-rgb),0.2)] rounded-full mb-6 shadow-[0_0_30px_rgba(var(--c-dark-rgb),0.15)] animate-pulse-slow">
          <ActiveIcon className="w-10 h-10 text-[var(--c-main)] drop-shadow-[0_0_10px_rgba(var(--c-main-rgb),0.8)]" />
        </div>
        <h2 className="text-3xl font-bold text-[rgb(var(--text-p))] mb-2 transition-colors">{activeTab}</h2>
        <p className="text-[rgb(var(--text-s))] max-w-sm mb-6 transition-colors">
          The <strong className="text-[rgb(var(--text-p))]">{activeTab}</strong> module is currently under active development.
        </p>
        <button 
          onClick={() => setActiveTab('Dashboard')}
          className="flex items-center gap-2 bg-[rgb(var(--bg-hover))] border border-[rgb(var(--border))] hover:bg-[rgb(var(--bg-base))] text-[rgb(var(--text-p))] font-medium px-5 py-2.5 rounded-xl text-sm transition-all active:scale-95 cursor-pointer hover:shadow-lg"
        >
          <LayoutDashboard className="w-4 h-4" /> Return to Dashboard
        </button>
      </div>
    );
  };

  return (
    <div className={`dashboard-app-root theme-${currentTheme.id} flex h-screen bg-[rgb(var(--bg-base))] text-[rgb(var(--text-p))] font-sans overflow-hidden relative transition-colors duration-300 ${!isDarkMode ? 'light-mode' : ''}`}>
      
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0"></canvas>

      {/* SIDEBAR */}
      <aside className="w-64 bg-[rgba(var(--bg-surface),0.9)] backdrop-blur-xl border-r border-[rgb(var(--border))] flex flex-col justify-between hidden md:flex shrink-0 z-20 transition-colors">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="h-20 flex items-center px-6 gap-3 border-b border-[rgb(var(--border))] group cursor-pointer transition-colors" onClick={() => setActiveTab('Home')}>
            <div className="relative flex items-center justify-center w-9 h-9 group-hover:scale-110 transition-transform duration-300">
              <div className="absolute inset-0 bg-[var(--c-dark)] rounded-lg rotate-45 opacity-20 blur-sm group-hover:opacity-40 group-hover:rotate-90 transition-all duration-700"></div>
              <div className="relative bg-gradient-to-tr from-[var(--c-dark)] to-[var(--c-sec)] rounded-lg w-8 h-8 flex items-center justify-center shadow-lg shadow-[rgba(var(--c-dark-rgb),0.2)]">
                <div className="w-4 h-4 border-2 border-white rounded-sm group-hover:rounded-full transition-all duration-300"></div>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[rgb(var(--text-p))] tracking-wide transition-colors">Cleanytics</h1>
              <p className="text-[10px] text-[rgb(var(--text-s))] group-hover:text-[var(--c-main)] transition-colors">AI Dataset Cleaner</p>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => { setActiveTab(item.name); setIsProfileOpen(false); setIsThemeMenuOpen(false); setIsDropdownOpen(false); setIsNotificationsOpen(false); setIsTimeframeOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-300 cursor-pointer group hover:translate-x-1 ${
                  activeTab === item.name
                    ? 'bg-gradient-to-r from-[rgba(var(--c-sec-rgb),0.2)] to-[rgba(var(--c-dark-rgb),0.1)] text-[var(--c-main)] border border-[rgba(var(--c-sec-rgb),0.2)] shadow-[0_0_15px_rgba(var(--c-main-rgb),0.1)] font-medium'
                    : 'text-[rgb(var(--text-s))] hover:text-[rgb(var(--text-p))] hover:bg-[rgb(var(--bg-hover))]'
                }`}
              >
                <item.icon className={`w-4 h-4 transition-transform duration-300 ${activeTab === item.name ? 'scale-110' : 'group-hover:scale-110'}`} />
                {item.name}
              </button>
            ))}
          </nav>
          <div className="sidebar-feedback-card flex-1 flex flex-col justify-center mx-4 mt-2 mb-4 p-4 rounded-2xl border border-[rgba(var(--c-main-rgb),0.2)] bg-[rgba(var(--bg-surface),0.7)]">
            <div className="flex items-center gap-2 text-[var(--c-main)]"><Star size={15} fill="currentColor" /><span className="text-xs font-semibold text-[rgb(var(--text-p))]">Top Feedback</span></div>
            <p className="text-[10px] text-[rgb(var(--text-s))] mt-2 leading-relaxed">“Cleanytics saves hours every week!”</p>
            <div className="flex items-center justify-between mt-2"><div className="flex gap-0.5 text-amber-400">{[1, 2, 3, 4, 5].map(star => <Star key={star} size={11} fill="currentColor" />)}</div><button type="button" onClick={() => setTopFeedbackLiked(!topFeedbackLiked)} className={`flex items-center gap-1 text-[10px] ${topFeedbackLiked ? 'text-[var(--c-main)]' : 'text-[rgb(var(--text-s))]'}`}><ThumbsUp size={11} fill={topFeedbackLiked ? 'currentColor' : 'none'} /> {topFeedbackLiked ? 43 : 42}</button></div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div 
            onClick={() => { setIsFeedbackOpen(true); setIsProfileOpen(false); setIsThemeMenuOpen(false); setIsDropdownOpen(false); setIsNotificationsOpen(false); setIsTimeframeOpen(false); }}
            className="p-6 rounded-2xl border border-[rgba(var(--c-main-rgb),0.2)] bg-gradient-to-b from-[rgba(var(--c-main-rgb),0.05)] to-[rgba(var(--c-main-rgb),0.01)] space-y-3 relative overflow-hidden cursor-pointer group hover:border-[rgba(var(--c-main-rgb),0.4)] transition-all hover:-translate-y-1 shadow-[0_0_20px_rgba(var(--c-main-rgb),0.05)] min-h-[160px] flex flex-col justify-center"
          >
            <div className="absolute top-4 right-4 p-1 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
              <MessageSquare className="w-6 h-6 text-[var(--c-main)]" />
            </div>
            <h4 className="text-base font-semibold text-[rgb(var(--text-p))] group-hover:text-[var(--c-main)] transition-colors">Send Feedback</h4>
            <p className="text-xs text-[rgb(var(--text-s))] leading-relaxed max-w-[160px] transition-colors">Help us improve your experience.</p>
            <span className="text-[var(--c-main)] text-xs font-semibold flex items-center gap-1 pt-2 group-hover:translate-x-1 transition-transform">
              Give Feedback &rarr;
            </span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden z-10" onClick={() => { setIsProfileOpen(false); setIsThemeMenuOpen(false); setIsDropdownOpen(false); setIsNotificationsOpen(false); setIsTimeframeOpen(false); }}>
        
        <header className="h-20 border-b border-[rgb(var(--border))] bg-[rgba(var(--bg-surface),0.8)] backdrop-blur-xl flex items-center justify-between px-8 shrink-0 relative z-20 transition-colors">
          <div className="relative w-full max-w-md hidden sm:block group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-s))] group-focus-within:text-[var(--c-main)] transition-colors" />
            <input 
              type="text"
              defaultValue="" /* Completely Uncontrolled Input to prevent warnings */
              placeholder="Search datasets, columns, insights..." 
              className="w-full bg-[rgba(var(--bg-hover),0.6)] border border-[rgb(var(--border))] rounded-full py-2 pl-10 pr-16 text-sm text-[rgb(var(--text-p))] placeholder-[rgb(var(--text-s))] focus:outline-none focus:border-[rgba(var(--c-main-rgb),0.5)] focus:ring-2 focus:ring-[rgba(var(--c-main-rgb),0.2)] focus:bg-[rgb(var(--bg-hover))] transition-all duration-300"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-50 group-focus-within:opacity-0 transition-opacity">
              <span className="text-[10px] bg-[rgb(var(--bg-hover))] text-[rgb(var(--text-s))] px-1.5 py-0.5 rounded border border-[rgb(var(--border))] shadow-sm">Ctrl /</span>
            </div>
          </div>

          <div className="flex items-center gap-5 ml-auto">
            
            {/* NOTIFICATION BELL DROPDOWN */}
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); setIsThemeMenuOpen(false); setIsDropdownOpen(false); setIsTimeframeOpen(false); }}
                className="relative text-[rgb(var(--text-s))] hover:text-[rgb(var(--text-p))] transition-colors cursor-pointer group flex items-center justify-center p-2 rounded-full hover:bg-[rgb(var(--bg-hover))]"
              >
                <Bell className="w-5 h-5 group-hover:origin-top group-hover:animate-wave" />
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-rose-500 rounded-full text-[9px] flex items-center justify-center font-bold text-white border-2 border-[rgb(var(--bg-surface))] shadow-[0_0_10px_rgba(244,63,94,0.5)] transition-colors">3</span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[rgb(var(--bg-surface))] border border-[rgb(var(--border))] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-[rgb(var(--border))] flex justify-between items-center mb-1">
                    <h4 className="text-sm font-bold text-[rgb(var(--text-p))]">Notifications</h4>
                    <span className="text-[10px] text-[var(--c-main)] cursor-pointer hover:underline transition-all active:scale-95">Mark all as read</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                    
                    {/* Notification 1 - Unread */}
                    <div className="px-4 py-3 hover:bg-[rgb(var(--bg-hover))] transition-colors cursor-pointer border-b border-[rgba(var(--border),0.5)] flex gap-3 bg-[rgba(var(--c-main-rgb),0.05)]">
                      <div className="mt-0.5 p-1.5 bg-[rgba(var(--success),0.1)] text-[rgb(var(--success))] rounded-full shrink-0 h-fit">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-[rgb(var(--text-p))] leading-relaxed"><span className="font-semibold text-[var(--c-main)]">sales_data.csv</span> has finished processing and is ready for download.</p>
                        <p className="text-[10px] text-[var(--c-main)] font-medium mt-1">2 mins ago</p>
                      </div>
                      <div className="w-2 h-2 bg-rose-500 rounded-full shrink-0 mt-1.5"></div>
                    </div>
                    
                    {/* Notification 2 - Unread */}
                    <div className="px-4 py-3 hover:bg-[rgb(var(--bg-hover))] transition-colors cursor-pointer border-b border-[rgba(var(--border),0.5)] flex gap-3 bg-[rgba(var(--c-main-rgb),0.05)]">
                      <div className="mt-0.5 p-1.5 bg-rose-500/10 text-rose-500 rounded-full shrink-0 h-fit">
                        <XCircle className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-[rgb(var(--text-p))] leading-relaxed"><span className="font-semibold text-[var(--c-main)]">product_inventory.xlsx</span> failed to upload. File corrupted.</p>
                        <p className="text-[10px] text-[var(--c-main)] font-medium mt-1">1 hour ago</p>
                      </div>
                      <div className="w-2 h-2 bg-rose-500 rounded-full shrink-0 mt-1.5"></div>
                    </div>

                    {/* Notification 3 - Read */}
                    <div className="px-4 py-3 hover:bg-[rgb(var(--bg-hover))] transition-colors cursor-pointer flex gap-3 opacity-70 hover:opacity-100">
                      <div className="mt-0.5 p-1.5 bg-[rgba(var(--c-main-rgb),0.1)] text-[var(--c-main)] rounded-full shrink-0 h-fit">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-[rgb(var(--text-p))] leading-relaxed">AI generated 5 new predictive insights for <span className="font-semibold text-[var(--c-main)]">marketing_campaign.csv</span>.</p>
                        <p className="text-[10px] text-[rgb(var(--text-s))] mt-1">5 hours ago</p>
                      </div>
                    </div>

                  </div>
                  <div className="px-4 pt-3 pb-1 border-t border-[rgb(var(--border))] text-center mt-1">
                    <span className="text-[11px] font-medium text-[rgb(var(--text-s))] hover:text-[var(--c-main)] cursor-pointer transition-colors">View All Activity</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* THEME TOGGLE: LIGHT / DARK */}
            <button 
              onClick={(e) => { e.stopPropagation(); setIsDarkMode(!isDarkMode); }}
              className="text-[rgb(var(--text-s))] hover:text-[var(--c-main)] p-2 rounded-full hover:bg-[rgb(var(--bg-hover))] transition-colors cursor-pointer hover:rotate-12 duration-300 active:scale-90"
              title="Toggle Light/Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* COLOR THEME PICKER */}
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsThemeMenuOpen(!isThemeMenuOpen); setIsProfileOpen(false); setIsNotificationsOpen(false); setIsDropdownOpen(false); setIsTimeframeOpen(false); }}
                className="text-[rgb(var(--text-s))] hover:text-[var(--c-main)] p-2 rounded-full hover:bg-[rgb(var(--bg-hover))] transition-colors cursor-pointer hover:-rotate-12 duration-300 active:scale-90"
                title="Change Color Accent"
              >
                <Palette className="w-5 h-5" />
              </button>
              
              {isThemeMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[rgb(var(--bg-surface))] border border-[rgb(var(--border))] rounded-xl shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 pb-2 mb-2 border-b border-[rgb(var(--border))]">
                    <p className="text-[10px] font-bold text-[rgb(var(--text-s))] uppercase tracking-wider transition-colors">Color Accent</p>
                  </div>
                  {Object.values(THEMES).map(theme => (
                    <div 
                      key={theme.id}
                      onClick={() => { setCurrentTheme(theme); onThemeChange?.(theme.id); setIsThemeMenuOpen(false); }}
                      className={`px-4 py-2.5 hover:bg-[rgb(var(--bg-hover))] transition-all cursor-pointer text-sm flex items-center justify-between group`}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className={`w-4 h-4 rounded-full border border-[rgb(var(--border))] shadow-sm group-hover:scale-110 transition-transform theme-swatch-${theme.id}`}
                        ></div>
                        <span className={currentTheme.id === theme.id ? 'text-[rgb(var(--text-p))] font-medium' : 'text-[rgb(var(--text-s))] group-hover:text-[rgb(var(--text-p))]'}>
                          {theme.name}
                        </span>
                      </div>
                      {currentTheme.id === theme.id && <CheckCircle2 className="w-4 h-4 text-[var(--c-main)]" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="h-8 w-px bg-[rgb(var(--border))] mx-1 transition-colors"></div>

            <div className="relative">
              <div 
                onClick={(e) => { e.stopPropagation(); setIsProfileOpen(!isProfileOpen); setIsThemeMenuOpen(false); setIsNotificationsOpen(false); setIsDropdownOpen(false); setIsTimeframeOpen(false); }}
                className="flex items-center gap-3 cursor-pointer group hover:bg-[rgb(var(--bg-hover))] px-2 py-1.5 rounded-lg transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[rgba(var(--c-dark-rgb),0.2)] text-[var(--c-main)] flex items-center justify-center font-bold text-sm border border-[rgba(var(--c-dark-rgb),0.3)] group-hover:scale-105 group-hover:border-[rgba(var(--c-main-rgb),0.5)] transition-all duration-300 shadow-[0_0_15px_rgba(var(--c-dark-rgb),0.15)]">
                  L
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-[rgb(var(--text-p))] group-hover:text-[var(--c-main)] transition-colors">{profileName}</p>
                  <p className="text-[10px] text-[rgb(var(--text-s))] transition-colors">Premium Plan</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-[rgb(var(--text-s))] group-hover:text-[rgb(var(--text-p))] transition-transform ${isProfileOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
              </div>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[rgb(var(--bg-surface))] border border-[rgb(var(--border))] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div onClick={() => { setActiveTab('Settings'); setIsProfileOpen(false); }} className="px-4 py-2 hover:bg-[rgb(var(--bg-hover))] transition-all cursor-pointer text-sm text-[rgb(var(--text-s))] hover:text-[rgb(var(--text-p))] flex items-center gap-2">
                    <UserRound className="w-4 h-4" /> Profile
                  </div>
                  <div onClick={() => { setActiveTab('Settings'); setIsProfileOpen(false); }} className="px-4 py-2 hover:bg-[rgb(var(--bg-hover))] transition-all cursor-pointer text-sm text-[rgb(var(--text-s))] hover:text-[rgb(var(--text-p))] flex items-center gap-2">
                    <KeyRound className="w-4 h-4" /> Change Password
                  </div>
                  <div onClick={() => setActiveTab('Dashboard')} className="px-4 py-2 hover:bg-[rgb(var(--bg-hover))] transition-all cursor-pointer text-sm text-[rgb(var(--text-s))] hover:text-[rgb(var(--text-p))] flex items-center gap-2">
                    <Star className="w-4 h-4" /> Billing & Plan
                  </div>
                  <div className="border-t border-[rgb(var(--border))] my-1 transition-colors"></div>
                  <div onClick={onLogout} className="px-4 py-2 hover:bg-rose-500/10 transition-all cursor-pointer text-sm text-rose-500 hover:text-rose-400 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Sign Out
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          {renderTab()}
        </div>
      </main>

      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-[rgba(var(--bg-base),0.8)] backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsPasswordModalOpen(false)}>
          <div className="w-full max-w-md rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg-surface))] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-5"><div className="p-2 rounded-xl bg-[rgba(var(--c-main-rgb),.12)] text-[var(--c-main)]"><KeyRound size={20} /></div><div><h3 className="text-lg font-bold">Change Password</h3><p className="text-xs text-[rgb(var(--text-s))] mt-1">Keep your account secure.</p></div></div>
            {passwordUpdated ? <div className="rounded-xl border border-[rgba(var(--success),.3)] bg-[rgba(var(--success),.1)] p-4 text-sm text-[rgb(var(--text-p))]">Password updated successfully.</div> : <form onSubmit={(e) => { e.preventDefault(); setPasswordUpdated(true); }} className="space-y-4"><label className="block text-xs text-[rgb(var(--text-s))]">Current password<input required type="password" className="mt-1 !pl-3" /></label><label className="block text-xs text-[rgb(var(--text-s))]">New password<input required minLength={8} type="password" className="mt-1 !pl-3" /></label><label className="block text-xs text-[rgb(var(--text-s))]">Confirm new password<input required minLength={8} type="password" className="mt-1 !pl-3" /></label><button className="w-full rounded-xl bg-[var(--c-main)] px-4 py-2.5 text-sm font-semibold text-slate-900">Update Password</button></form>}
            <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="mt-4 w-full rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm text-[rgb(var(--text-s))] hover:text-[rgb(var(--text-p))]">Close</button>
          </div>
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 bg-[rgba(var(--bg-base),0.8)] backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300" onClick={() => setIsFeedbackOpen(false)}>
          <div className="bg-[rgb(var(--bg-surface))] border border-[rgb(var(--border))] w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            
            <button 
              onClick={() => setIsFeedbackOpen(false)}
              className="absolute top-4 right-4 text-[rgb(var(--text-s))] hover:text-[rgb(var(--text-p))] transition-colors p-1 rounded-lg hover:bg-[rgb(var(--bg-hover))]"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[rgba(var(--c-main-rgb),0.1)] border border-[rgba(var(--c-main-rgb),0.2)] text-[var(--c-main)] rounded-xl shadow-[0_0_15px_rgba(var(--c-main-rgb),0.2)]">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[rgb(var(--text-p))] transition-colors">Send Feedback</h3>
                <p className="text-xs text-[rgb(var(--text-s))] transition-colors">Tell us what you think or report a bug.</p>
              </div>
            </div>

            {feedbackSubmitted ? (
              <div className="py-10 text-center space-y-3 animate-in fade-in">
                <div className="w-12 h-12 bg-[rgba(var(--success),0.2)] border border-[rgba(var(--success),0.3)] text-[rgb(var(--success))] rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(var(--success),0.3)]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-semibold text-[rgb(var(--text-p))] transition-colors">Thank you for your feedback!</h4>
                <p className="text-xs text-[rgb(var(--text-s))] transition-colors">Your message has been sent successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <textarea 
                    rows="4"
                    value={feedbackText || ''} /* Fully Controlled Input */
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Write your suggestions, feedback, or report issues here..."
                    className="w-full bg-[rgba(var(--bg-hover),0.6)] border border-[rgb(var(--border))] rounded-xl p-3 text-sm text-[rgb(var(--text-p))] placeholder-[rgb(var(--text-s))] focus:outline-none focus:border-[rgba(var(--c-main-rgb),0.5)] focus:ring-2 focus:ring-[rgba(var(--c-main-rgb),0.2)] transition-all custom-scrollbar resize-none"
                    required
                  ></textarea>
                </div>
                
                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsFeedbackOpen(false)}
                    className="px-4 py-2 bg-[rgb(var(--bg-hover))] hover:brightness-95 dark:hover:brightness-125 text-[rgb(var(--text-s))] font-medium text-xs rounded-xl transition-all active:scale-95 cursor-pointer border border-[rgb(var(--border))]"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex items-center gap-2 bg-gradient-to-r from-[var(--c-main)] to-[var(--c-sec)] hover:brightness-110 text-slate-900 font-semibold px-5 py-2 text-xs rounded-xl shadow-[0_0_15px_rgba(var(--c-main-rgb),0.3)] transition-all active:scale-95 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Feedback
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
