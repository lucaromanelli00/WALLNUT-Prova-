import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  theme?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  size = 32, 
  showText = false,
  theme = 'dark'
}) => {
  const primaryColor = theme === 'dark' ? '#0F172A' : '#FFFFFF'; // Slate-900 or White
  const accentColor = theme === 'dark' ? '#2563EB' : '#60A5FA'; // Blue-600 or Blue-400

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* The "Wall" - Outer Shell (Hexagonal/坚果 shape) */}
        <path 
          d="M20 4L4 12V28L20 36L36 28V12L20 4Z" 
          fill={primaryColor} 
          className="transition-all duration-300"
        />
        
        {/* The "Nut/Brain" - Inner Intelligence (Split hemispheres representing brain/nut) */}
        <path 
          d="M19 10V30C19 30 14 28 12 24C10 20 10 20 12 16C14 12 19 10 19 10Z" 
          fill="white" 
          fillOpacity="0.9"
        />
        <path 
          d="M21 10V30C21 30 26 28 28 24C30 20 30 20 28 16C26 12 21 10 21 10Z" 
          fill="white" 
          fillOpacity="0.9"
        />
        
        {/* The "Augmentation" - A digital spark/connection in the center */}
        <circle cx="20" cy="20" r="3" fill={accentColor} />
        
        {/* Tech Lines - Circuitry connecting the Nut to the Wall */}
        <path d="M20 4V8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M20 32V36" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M4 12L7.5 13.75" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M36 12L32.5 13.75" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-extrabold tracking-tight ${theme === 'dark' ? 'text-slate-900' : 'text-white'}`} style={{ fontSize: size * 0.65 }}>
            WALLNUT
          </span>
        </div>
      )}
    </div>
  );
};
