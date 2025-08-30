import React from 'react';

const GradientCard = ({ 
  children, 
  className = '', 
  onClick,
  padding = 'p-6',
  hover = true 
}) => {
  const baseClasses = `bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-blue-500/30 rounded-xl shadow-xl ${padding}`;
  const hoverClasses = hover ? 'hover:from-slate-700/90 hover:to-slate-800/90 transition-all' : '';
  const clickableClasses = onClick ? 'cursor-pointer transform hover:scale-[1.02]' : '';
  
  const finalClasses = `${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`;

  return (
    <div className={finalClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default GradientCard;