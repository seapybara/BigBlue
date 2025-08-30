import React, { useState } from 'react';
import { BuddySearch, BuddyProfile } from '../components/BuddyFinder';

const BuddyFinderPage = () => {
  const [selectedBuddy, setSelectedBuddy] = useState(null);

  const handleBuddySelect = (buddy) => {
    setSelectedBuddy(buddy);
  };

  const handleCloseBuddyProfile = () => {
    setSelectedBuddy(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BuddySearch onBuddySelect={handleBuddySelect} />
        
        {selectedBuddy && (
          <BuddyProfile 
            buddy={selectedBuddy}
            onClose={handleCloseBuddyProfile}
          />
        )}
      </div>
    </div>
  );
};

export default BuddyFinderPage;