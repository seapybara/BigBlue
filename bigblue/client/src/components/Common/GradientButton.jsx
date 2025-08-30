import React from 'react';

const GradientButton = ({ 
  children, 
  onClick, 
  className = '',
  variant = 'primary', // primary, secondary, outline
  size = 'md', // sm, md, lg
  disabled = false,
  type = 'button',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500/80 to-cyan-600/80 hover:from-blue-600 hover:to-cyan-700 text-white',
    secondary: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white',
    outline: 'bg-white/10 hover:bg-white/20 border border-white/30 text-white'
  };

  const baseClasses = 'font-medium rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  
  const finalClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return (
    <button 
      className={finalClasses}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default GradientButton;