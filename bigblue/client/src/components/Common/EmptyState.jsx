import React from 'react';
import GradientCard from './GradientCard';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className = '' 
}) => {
  return (
    <GradientCard className={`text-center p-12 ${className}`}>
      {Icon && <Icon className="text-5xl text-gray-500 mx-auto mb-4" />}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      {description && <p className="text-gray-400">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </GradientCard>
  );
};

export default EmptyState;