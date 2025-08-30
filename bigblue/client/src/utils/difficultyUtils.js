// Difficulty color mappings for consistent styling across the app
export const difficultyColors = {
  beginner: {
    marker: '#22d3ee',     // cyan-400
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    background: 'text-cyan-200 bg-cyan-900/50'
  },
  intermediate: {
    marker: '#fbbf24',     // amber-400
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    background: 'text-amber-200 bg-amber-900/50'
  },
  advanced: {
    marker: '#f87171',     // red-400
    badge: 'bg-red-500/20 text-red-300 border-red-500/30',
    background: 'text-red-200 bg-red-900/50'
  },
  expert: {
    marker: '#dc2626',     // red-600
    badge: 'bg-red-600/20 text-red-200 border-red-600/30',
    background: 'text-red-100 bg-red-800/50'
  }
};

// Get difficulty color for map markers
export const getDifficultyMarkerColor = (difficulty) => {
  return difficultyColors[difficulty?.toLowerCase()]?.marker || difficultyColors.beginner.marker;
};

// Get difficulty badge classes
export const getDifficultyBadgeClasses = (difficulty) => {
  return difficultyColors[difficulty?.toLowerCase()]?.badge || difficultyColors.beginner.badge;
};

// Get difficulty background classes (for popups)
export const getDifficultyBackgroundClasses = (difficulty) => {
  return difficultyColors[difficulty?.toLowerCase()]?.background || 'text-gray-300 bg-slate-700';
};

// Difficulty order for sorting
export const difficultyOrder = { 
  beginner: 1, 
  intermediate: 2, 
  advanced: 3, 
  expert: 4 
};

// Format difficulty text
export const formatDifficulty = (difficulty) => {
  if (!difficulty) return 'Unknown';
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
};

// Depth-based size scaling for markers
export const getMarkerSize = (depth) => {
  const maxDepth = depth?.max || 0;
  if (maxDepth > 40) return 28; // Expert/Deep sites larger
  if (maxDepth > 30) return 26; // Advanced sites 
  if (maxDepth > 18) return 24; // Intermediate sites
  return 22; // Beginner sites
};