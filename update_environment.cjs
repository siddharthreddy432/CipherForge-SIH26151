const fs = require('fs');

// 1. Update index.css
let css = fs.readFileSync('src/index.css', 'utf-8');

// Update colors
css = css.replace(/--color-brand-bg: #050505;/g, '--color-brand-bg: #050607;');
css = css.replace(/--color-brand-bg-sec: #0b0b0b;/g, '--color-brand-bg-sec: #0a0b0d;');
css = css.replace(/--color-brand-border: #1f1f1f;/g, '--color-brand-border: #1a1c20;');

// Add utilities
if (!css.includes('.bg-grid')) {
  const utilities = `
  .bg-grid {
    background-size: 32px 32px;
    background-image: 
      linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  }
  .bg-vignette {
    background: radial-gradient(circle at center, transparent 20%, rgba(5, 6, 7, 0.95) 100%);
  }
  
  @media (prefers-reduced-motion: no-preference) {
    @keyframes slow-drift {
      0% { transform: translate(0, 0); }
      33% { transform: translate(-1%, 1.5%); }
      66% { transform: translate(1%, -1%); }
      100% { transform: translate(0, 0); }
    }
    .animate-slow-drift {
      animation: slow-drift 40s ease-in-out infinite;
    }
  }
`;
  css = css.replace(/@layer utilities \{/g, '@layer utilities {' + utilities);
}
fs.writeFileSync('src/index.css', css);

// 2. Update DashboardLayout.tsx
let layout = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf-8');

const bgComponent = `
const EnvironmentBackground = () => {
  const location = useLocation();
  const isGraph = location.pathname === '/graph';
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-brand-bg">
      {/* Grid */}
      <div className="absolute inset-0 bg-grid"></div>
      
      {/* Decorative Network Topology */}
      {!isGraph && (
        <svg className="absolute inset-0 w-full h-full opacity-[0.015] animate-slow-drift" xmlns="http://www.w3.org/2000/svg" style={{ animationDelay: '-5s' }}>
          <g stroke="#ffffff" strokeWidth="1" fill="none">
            <circle cx="15%" cy="25%" r="2" />
            <circle cx="35%" cy="15%" r="2" />
            <circle cx="25%" cy="45%" r="2" />
            <circle cx="75%" cy="65%" r="2" />
            <circle cx="85%" cy="35%" r="2" />
            <circle cx="65%" cy="85%" r="2" />
            <path d="M 15% 25% L 35% 15% L 85% 35% L 75% 65%" strokeDasharray="4 4" />
            <path d="M 15% 25% L 25% 45% L 35% 15%" />
            <path d="M 75% 65% L 65% 85%" strokeDasharray="4 4" />
          </g>
        </svg>
      )}

      {/* Radial Lights */}
      <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-brand-accent/5 blur-[120px] mix-blend-screen animate-slow-drift"></div>
      <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-glow/5 blur-[120px] mix-blend-screen animate-slow-drift" style={{ animationDelay: '-20s' }}></div>
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-vignette"></div>
    </div>
  );
};
`;

if (!layout.includes('EnvironmentBackground')) {
  // Add component
  layout = layout.replace(/export default function DashboardLayout/, bgComponent + '\nexport default function DashboardLayout');
  
  // Add to render
  layout = layout.replace(/<div className="flex h-screen overflow-hidden bg-brand-bg text-brand-text">/, 
    '<div className="flex h-screen overflow-hidden bg-transparent text-brand-text relative z-0">\n      <EnvironmentBackground />');
    
  // Sidebar styling
  layout = layout.replace(/w-64 md:w-72 border-r border-brand-border bg-brand-bg/g, 
    'w-64 md:w-72 border-r border-brand-border/50 bg-[#030405]/95 backdrop-blur-xl shadow-[4px_0_24px_rgba(0,0,0,0.4)] z-50');
    
  // Top Header styling
  layout = layout.replace(/header className="h-20 border-b border-brand-border flex items-center justify-between px-6 lg:px-10 shrink-0 bg-brand-bg"/g,
    'header className="h-20 border-b border-brand-border/50 flex items-center justify-between px-6 lg:px-10 shrink-0 bg-transparent backdrop-blur-md relative z-40"');
    
  // Page Content styling
  layout = layout.replace(/main className="flex-1 overflow-y-auto relative bg-brand-bg hide-scrollbar"/g,
    'main className="flex-1 overflow-y-auto relative bg-transparent hide-scrollbar"');
    
  // Inputs
  layout = layout.replace(/bg-brand-bg hover:bg-brand-border\/5/g, 'bg-[#0a0b0d]/50 backdrop-blur-md hover:bg-brand-border/20');
}

fs.writeFileSync('src/layouts/DashboardLayout.tsx', layout);

console.log("Environment background updated.");
