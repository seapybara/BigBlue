import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const spinner = (
    <div className={`inline-block animate-spin rounded-full border-b-2 border-blue-500 ${sizeClasses[size]}`}></div>
  );

  const content = (
    <div className={`text-center ${className}`}>
      {spinner}
      {text && <p className="text-gray-300 mt-4">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;