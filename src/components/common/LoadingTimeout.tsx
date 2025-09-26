import React, { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

export const LoadingTimeout: React.FC<{ 
  timeout?: number 
}> = ({ timeout = 10000 }) => {
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTimeout(true), timeout);
    return () => clearTimeout(timer);
  }, [timeout]);

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      {!showTimeout ? (
        <LoadingSpinner />
      ) : (
        <div>
          <h3>Loading is taking longer than expected</h3>
          <p>Please check your internet connection or try refreshing</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Refresh Page
          </button>
        </div>
      )}
    </div>
  );
};
