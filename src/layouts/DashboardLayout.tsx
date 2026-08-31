import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Search, Menu, X } from 'lucide-react';


const EnvironmentBackground = () => {
  const location = useLocation();
  const isGraph = location.pathname === '/graph';
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#05070A]">
      {/* Grid */}
      <div className="absolute inset-0 bg-grid opacity-100"></div>
      
      {/* Decorative Network Topology */}
      {!isGraph && (
        <svg className={`absolute inset-0 w-full h-full opacity-10 ${shouldReduceMotion ? '' : 'animate-slow-drift'}`} xmlns="http://www.w3.org/2000/svg" style={{ animationDelay: '-5s' }}>
          <g stroke="#ffffff" strokeWidth="0.5" fill="none">
            <circle cx="15%" cy="25%" r="2" fill="#ffffff" />
            <circle cx="35%" cy="15%" r="2" fill="#ffffff" />
            <circle cx="25%" cy="45%" r="2" fill="#ffffff" />
            <circle cx="75%" cy="65%" r="2" fill="#ffffff" />
            <circle cx="85%" cy="35%" r="2" fill="#ffffff" />
            <circle cx="65%" cy="85%" r="2" fill="#ffffff" />
            
            <circle cx="12%" cy="22%" r="1" fill="#ffffff" />
            <circle cx="18%" cy="28%" r="1" fill="#ffffff" />
            <path d="M 15% 25% L 12% 22% M 15% 25% L 18% 28%" strokeDasharray="1 3" />
            
            <circle cx="78%" cy="62%" r="1" fill="#ffffff" />
            <path d="M 75% 65% L 78% 62%" strokeDasharray="1 3" />

            <path d="M 15% 25% L 35% 15% L 85% 35% L 75% 65%" strokeDasharray="2 6" />
            <path d="M 15% 25% L 25% 45% L 35% 15%" />
            <path d="M 75% 65% L 65% 85%" strokeDasharray="2 6" />
            <path d="M 25% 45% L 65% 85%" strokeDasharray="1 8" strokeWidth="0.5" />
          </g>
        </svg>
      )}

      {/* Radial Lights */}
      <div className={`absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-brand-accent/10 blur-[120px] mix-blend-screen ${shouldReduceMotion ? '' : 'animate-slow-drift'}`}></div>
      <div className={`absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#f59e0b]/10 blur-[120px] mix-blend-screen ${shouldReduceMotion ? '' : 'animate-slow-drift'}`} style={{ animationDelay: '-20s' }}></div>
      <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-[#07090D]/50 blur-[100px] mix-blend-normal"></div>
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-vignette opacity-80"></div>
    </div>
  );
};

export default function DashboardLayout() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const overviewItems = [
    { to: '/dashboard', label: 'Dashboard' }
  ];

  const investigationItems = [
    { to: '/investigate', label: 'Investigate' },
    { to: '/graph', label: 'Network Graph' }
  ];
  
  const intelligenceItems = [
    { to: '/actors', label: 'Threat Actors' },
    { to: '/persona', label: 'Persona Analysis' },
    { to: '/infrastructure', label: 'Infrastructure' },
    { to: '/blockchain', label: 'Blockchain' }
  ];

  const evidenceItems = [
    { to: '/evidence', label: 'Evidence' },
    { to: '/sources', label: 'Sources' }
  ];

  const operationsItems = [
    { to: '/alerts', label: 'Alerts' },
    { to: '/reports', label: 'Reports' }
  ];

  const renderNavGroup = (title: string, items: { to: string; label: string }[]) => (
    <div className="mb-8">
      <h3 className="text-[10px] uppercase tracking-[0.16em] font-medium text-[#8A8F96] mb-3 px-6 select-none pointer-events-none">
        {title}
      </h3>
      <nav className="flex flex-col space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `relative px-6 py-2.5 text-sm font-sans tracking-wide transition-all duration-200 ease-smooth ${
                isActive 
                  ? 'text-[#F2F2F2] bg-white/5' 
                  : 'text-[#AEB3BA] hover:text-[#D1D5DB] hover:bg-white/[0.03]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-accent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
                <span className="block ml-2">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );

  const shouldReduceMotion = useReducedMotion();
  const getPageTitle = () => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    return path.toUpperCase();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-transparent text-brand-text relative z-0">
      <EnvironmentBackground />
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 md:w-[260px] border-r border-[#1a1f26]/50 bg-[#030405] shadow-[4px_0_24px_rgba(0,0,0,0.4)]
        flex flex-col transform transition-transform duration-300 ease-smooth ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="h-20 flex flex-col justify-center px-6 border-b border-[#1a1f26]/50 shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-xl font-heading font-bold tracking-widest text-white leading-tight">CIPHERFORGE</span>
              <span className="text-[9px] uppercase tracking-[0.15em] text-[#8A8F96] mt-1.5 font-medium">THREAT INTELLIGENCE PLATFORM</span>
            </div>
            <button 
              className="lg:hidden p-1 text-brand-muted hover:text-brand-text transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto py-6 scrollbar-hide">
          {renderNavGroup('OVERVIEW', overviewItems)}
          {renderNavGroup('INVESTIGATION', investigationItems)}
          {renderNavGroup('INTELLIGENCE', intelligenceItems)}
          {renderNavGroup('EVIDENCE', evidenceItems)}
          {renderNavGroup('OPERATIONS', operationsItems)}
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-[#1a1f26]/50 shrink-0 space-y-4">
          <div className="text-[9px] uppercase tracking-widest text-brand-accent drop-shadow-[0_0_8px_rgba(185,28,28,0.2)] font-semibold border border-brand-accent/30 px-3 py-3 text-center bg-brand-accent/5">
            DEMO / RESEARCH MODE
          </div>
          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.1em] text-brand-muted">
            <span>SYSTEM</span>
            <span className="text-brand-text flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#f2f2f2] animate-pulse"></div>
              OPERATIONAL
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#07090D]/40 backdrop-blur-[2px]">
        
        {/* Top Header */}
        <header className="h-20 border-b border-[#1a1f26]/40 flex items-center justify-between px-6 lg:px-10 shrink-0 bg-[#0A0C0E]/60 backdrop-blur-md relative z-40">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-brand-muted hover:text-brand-text transition-all duration-200 ease-smooth"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-muted">
              <span>THREAT INTELLIGENCE</span>
              <span className="text-brand-border">/</span>
              <span className="text-brand-text">{getPageTitle()}</span>
            </div>
            <div className="md:hidden flex items-center text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-text">
               {getPageTitle()}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-brand-muted group-focus-within:text-[#F2F2F2] transition-colors duration-200 ml-1" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={(e) => e.target.parentElement?.classList.add('is-focused')}
                onBlur={(e) => e.target.parentElement?.classList.remove('is-focused')}
                placeholder="SEARCH ACTOR, HANDLE, PGP, WALLET, DOMAIN, IP..."
                className="w-[200px] md:w-[320px] bg-[#05070A]/80 hover:bg-[#090B10] border border-[#1a1f26] focus:border-brand-accent text-[9px] uppercase tracking-widest text-[#F2F2F2] placeholder:text-[#8A8F96] px-4 py-3 pl-10 focus:outline-none focus:ring-0 transition-all duration-300 ease-smooth rounded-none"
              />
            </form>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto relative bg-transparent hide-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
