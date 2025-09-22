import React from 'react';
import { ComponentInfo } from '../../config/supabase';

interface ARControlsProps {
  onExitAR: () => void;
  selectedComponent: ComponentInfo | null;
}

const ARControls: React.FC<ARControlsProps> = ({ onExitAR, selectedComponent }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      right: '20px',
      zIndex: 2000,
      pointerEvents: 'none'
    }}>
      {/* AR Header */}
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        pointerEvents: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#ff4444',
            animation: 'pulse 2s infinite'
          }}></div>
          <span style={{ fontSize: '14px', fontWeight: '500' }}>AR Mode Active</span>
        </div>
        
        <button
          onClick={onExitAR}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Exit AR
        </button>
      </div>

      {/* Component Info Overlay */}
      {selectedComponent && (
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '300px',
          pointerEvents: 'auto'
        }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            marginBottom: '10px',
            color: 'white'
          }}>
            {selectedComponent.name}
          </h3>
          
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>
            <span style={{ opacity: 0.8 }}>Type: </span>
            <span>{selectedComponent.type}</span>
          </div>
          
          <div style={{ 
            fontSize: '14px', 
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ opacity: 0.8 }}>Status: </span>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: selectedComponent.status === 'good' ? '#4ade80' :
                             selectedComponent.status === 'warning' ? '#fbbf24' : '#ef4444'
            }}></div>
            <span style={{ textTransform: 'capitalize' }}>{selectedComponent.status}</span>
          </div>

          {selectedComponent.maintenance_notes && (
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              <div style={{ marginBottom: '5px', fontWeight: '500' }}>Notes:</div>
              <div>{selectedComponent.maintenance_notes}</div>
            </div>
          )}

          {selectedComponent.next_inspection && (
            <div style={{ 
              fontSize: '12px', 
              marginTop: '10px',
              padding: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px'
            }}>
              <span style={{ opacity: 0.8 }}>Next Inspection: </span>
              <span>{new Date(selectedComponent.next_inspection).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      )}

      {/* AR Instructions */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '14px',
        textAlign: 'center',
        pointerEvents: 'auto'
      }}>
        <div style={{ marginBottom: '8px', fontWeight: '500' }}>AR Instructions</div>
        <div style={{ opacity: 0.9 }}>
          Point your device at equipment to see component information overlaid in real-time
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ARControls;
