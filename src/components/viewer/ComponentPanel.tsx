import React, { useState } from 'react';
import { ComponentInfo } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface ComponentPanelProps {
  component: ComponentInfo;
  onUpdate: (updatedComponent: ComponentInfo) => void;
  onClose: () => void;
}

type Status = 'good' | 'warning' | 'critical';

const getStatusColor = (status?: Status): string => {
  switch (status) {
    case 'good':
      return '#4ade80'; // green
    case 'warning':
      return '#fbbf24'; // amber
    case 'critical':
      return '#ef4444'; // red
    default:
      return '#9CA3AF'; // neutral gray fallback
  }
};

const ComponentPanel: React.FC<ComponentPanelProps> = ({ component, onUpdate, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComponent, setEditedComponent] = useState(component);
  const { isGuest } = useAuth();

  const handleSave = () => {
    onUpdate(editedComponent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedComponent(component);
    setIsEditing(false);
  };

  return (
    <div className="component-panel" style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '350px',
      maxHeight: '80vh',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: getStatusColor(component.status),
        color: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
            {component.name}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0'
            }}
          >
            
          </button>
        </div>
        <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
          Type: {component.type}
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '16px', maxHeight: 'calc(80vh - 120px)', overflowY: 'auto' }}>
        {isEditing ? (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                Name
              </label>
              <input
                type="text"
                value={editedComponent.name}
                onChange={(e) => setEditedComponent({...editedComponent, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                Type
              </label>
              <input
                type="text"
                value={editedComponent.type}
                onChange={(e) => setEditedComponent({...editedComponent, type: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                Status
              </label>
              <select
                value={editedComponent.status || ''}
                onChange={(e) => setEditedComponent({...editedComponent, status: e.target.value as Status})}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">Unknown</option>
                <option value="good">Good</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {!isGuest && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                  Maintenance Notes
                </label>
                <textarea
                  value={editedComponent.maintenance_notes || ''}
                  onChange={(e) => setEditedComponent({...editedComponent, maintenance_notes: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
                Status
              </h4>
              <span style={{
                display: 'inline-block',
                padding: '4px 8px',
                backgroundColor: getStatusColor(component.status),
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {component.status || 'unknown'}
              </span>
            </div>

            {component.properties && Object.keys(component.properties).length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
                  Properties
                </h4>
                <div style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '4px' }}>
                  {Object.entries(component.properties).map(([key, value]) => (
                    <div key={key} style={{ marginBottom: '4px', fontSize: '14px' }}>
                      <span style={{ fontWeight: '500' }}>{key}:</span> {String(value)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {component.maintenance_notes && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
                  Maintenance Notes
                </h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#374151' }}>
                  {component.maintenance_notes}
                </p>
              </div>
            )}

            {(component.last_inspection || component.next_inspection) && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
                  Inspections
                </h4>
                {component.last_inspection && (
                  <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#374151' }}>
                    <span style={{ fontWeight: '500' }}>Last:</span> {new Date(component.last_inspection).toLocaleDateString()}
                  </p>
                )}
                {component.next_inspection && (
                  <p style={{ margin: 0, fontSize: '14px', color: '#374151' }}>
                    <span style={{ fontWeight: '500' }}>Next:</span> {new Date(component.next_inspection).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              {!isGuest && (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
              )}
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentPanel;