import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BIMProject } from '../../config/supabase';
import * as THREE from 'three';

interface ViewerControlsProps {
  project: BIMProject | null;
  onToggleAR: () => void;
  isARMode: boolean;
  ifcModel: THREE.Object3D | null;
}

const ViewerControls: React.FC<ViewerControlsProps> = ({ 
  project, 
  onToggleAR, 
  isARMode, 
  ifcModel 
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [wireframeMode, setWireframeMode] = useState(false);
  const navigate = useNavigate();

  const toggleWireframe = () => {
    if (!ifcModel) return;
    
    const newWireframeMode = !wireframeMode;
    setWireframeMode(newWireframeMode);
    
    ifcModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => {
            if (mat instanceof THREE.Material && 'wireframe' in mat) {
              (mat as any).wireframe = newWireframeMode;
            }
          });
        } else if (child.material instanceof THREE.Material && 'wireframe' in child.material) {
          (child.material as any).wireframe = newWireframeMode;
        }
      }
    });
  };

  const resetView = () => {
    // This would typically reset camera position
    window.location.reload();
  };

  const exportScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${project?.name || 'screenshot'}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <>
      {/* Main Controls */}
      <div style={{
        position: 'fixed',
        top: '90px',
        left: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 1000
      }}>
        <button
          onClick={() => navigate('/')}
          className="btn btn-secondary"
          style={{ 
            padding: '10px 15px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ← Back
        </button>

        <button
          onClick={onToggleAR}
          className="btn btn-primary"
          style={{ 
            padding: '10px 15px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: isARMode ? 'var(--danger-color)' : 'var(--accent-color)'
          }}
        >
          {isARMode ? '🔴 Exit AR' : '🥽 Enter AR'}
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="btn btn-secondary"
          style={{ 
            padding: '10px 15px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ⚙️ Settings
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div style={{
          position: 'fixed',
          top: '90px',
          left: '180px',
          width: '250px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 4px 12px var(--shadow)',
          zIndex: 1000
        }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            marginBottom: '15px',
            color: 'var(--text-primary)'
          }}>
            Viewer Settings
          </h4>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={wireframeMode}
                onChange={toggleWireframe}
                disabled={!ifcModel}
              />
              <span style={{ fontSize: '14px' }}>Wireframe Mode</span>
            </label>
          </div>

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px',
            marginTop: '20px'
          }}>
            <button
              onClick={resetView}
              className="btn btn-secondary"
              style={{ fontSize: '14px', width: '100%' }}
            >
              Reset View
            </button>
            
            <button
              onClick={exportScreenshot}
              className="btn btn-secondary"
              style={{ fontSize: '14px', width: '100%' }}
            >
              📸 Screenshot
            </button>
          </div>
        </div>
      )}

      {/* Project Info */}
      {project && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '15px',
          maxWidth: '300px',
          boxShadow: '0 2px 8px var(--shadow)',
          zIndex: 1000
        }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            marginBottom: '8px',
            color: 'var(--text-primary)'
          }}>
            {project.name}
          </h4>
          
          {project.description && (
            <p style={{ 
              fontSize: '14px', 
              color: 'var(--text-secondary)',
              marginBottom: '10px',
              lineHeight: '1.4'
            }}>
              {project.description}
            </p>
          )}
          
          <div style={{ 
            fontSize: '12px', 
            color: 'var(--text-secondary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {project.is_public ? (
                <>
                  <span style={{ color: 'var(--success-color)' }}>●</span>
                  <span>Public</span>
                </>
              ) : (
                <>
                  <span style={{ color: 'var(--warning-color)' }}>●</span>
                  <span>Private</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Help Instructions */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '15px',
        maxWidth: '250px',
        boxShadow: '0 2px 8px var(--shadow)',
        zIndex: 1000
      }}>
        <h4 style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          marginBottom: '10px',
          color: 'var(--text-primary)'
        }}>
          Controls
        </h4>
        
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          <div style={{ marginBottom: '5px' }}>• Click components for details</div>
          <div style={{ marginBottom: '5px' }}>• Mouse: Rotate view</div>
          <div style={{ marginBottom: '5px' }}>• Scroll: Zoom in/out</div>
          <div style={{ marginBottom: '5px' }}>• Right-click + drag: Pan</div>
          <div>• AR mode for mobile overlay</div>
        </div>
      </div>
    </>
  );
};

export default ViewerControls;
