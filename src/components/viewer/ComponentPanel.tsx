import React, { useState } from 'react';
import { ComponentInfo } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface ComponentPanelProps {
  component: ComponentInfo;
  onClose: () => void;
  onUpdate: (component: ComponentInfo) => void;
}

const ComponentPanel: React.FC<ComponentPanelProps> = ({ component, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComponent, setEditedComponent] = useState(component);
  const { isGuest } = useAuth();

  const handleSave = () => {
    onUpdate(editedComponent);
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'var(--success-color)';
      case 'warning': return 'var(--warning-color)';
      case 'critical': return 'var(--danger-color)';
      default: return 'var(--text-secondary)';
    }
  };

  const formatPropertyValue = (value: any) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object' && value.value !== undefined) {
      return value.value;
    }
    return value.toString();
  };

  return (
    <div style={{
      position: 'fixed',
      top: '70px',
      right: '20px',
      width: '400px',
      maxHeight: 'calc(100vh - 100px)',
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      boxShadow: '0 4px 12px var(--shadow)',
      zIndex: 1000,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
          Component Details
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div style={{ 
        padding: '20px', 
        overflowY: 'auto',
        flex: 1
      }}>
        {/* Basic Info */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '5px'
            }}>
              Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedComponent.name}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  name: e.target.value
                })}
                className="form-control"
                style={{ fontSize: '14px' }}
              />
            ) : (
              <div style={{ 
                fontSize: '16px', 
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                {component.name}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '5px'
            }}>
              Type
            </label>
            <div style={{ fontSize: '14px' }}>{component.type}</div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '5px'
            }}>
              Status
            </label>
            {isEditing ? (
              <select
                value={editedComponent.status}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  status: e.target.value as 'good' | 'warning' | 'critical'
                })}
                className="form-control"
                style={{ fontSize: '14px' }}
              >
                <option value="good">Good</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            ) : (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                fontSize: '14px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(component.status)
                }}></div>
                <span style={{ textTransform: 'capitalize' }}>{component.status}</span>
              </div>
            )}
          </div>
        </div>

        {/* Maintenance Notes */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500',
            color: 'var(--text-secondary)',
            marginBottom: '5px'
          }}>
            Maintenance Notes
          </label>
          {isEditing ? (
            <textarea
              value={editedComponent.maintenance_notes || ''}
              onChange={(e) => setEditedComponent({
                ...editedComponent,
                maintenance_notes: e.target.value
              })}
              className="form-control"
              rows={3}
              style={{ fontSize: '14px', resize: 'vertical' }}
              placeholder="Add maintenance notes..."
            />
          ) : (
            <div style={{ 
              fontSize: '14px',
              color: component.maintenance_notes ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontStyle: component.maintenance_notes ? 'normal' : 'italic'
            }}>
              {component.maintenance_notes || 'No maintenance notes'}
            </div>
          )}
        </div>

        {/* Inspection Dates */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '5px'
            }}>
              Last Inspection
            </label>
            {isEditing ? (
              <input
                type="date"
                value={editedComponent.last_inspection || ''}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  last_inspection: e.target.value
                })}
                className="form-control"
                style={{ fontSize: '14px' }}
              />
            ) : (
              <div style={{ fontSize: '14px' }}>
                {component.last_inspection 
                  ? new Date(component.last_inspection).toLocaleDateString()
                  : 'Not recorded'
                }
              </div>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '5px'
            }}>
              Next Inspection
            </label>
            {isEditing ? (
              <input
                type="date"
                value={editedComponent.next_inspection || ''}
                onChange={(e) => setEditedComponent({
                  ...editedComponent,
                  next_inspection: e.target.value
                })}
                className="form-control"
                style={{ fontSize: '14px' }}
              />
            ) : (
              <div style={{ fontSize: '14px' }}>
                {component.next_inspection 
                  ? new Date(component.next_inspection).toLocaleDateString()
                  : 'Not scheduled'
                }
              </div>
            )}
          </div>
        </div>

        {/* IFC Properties */}
        <div style={{ marginBottom: '25px' }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600',
            marginBottom: '15px',
            color: 'var(--text-primary)'
          }}>
            IFC Properties
          </h4>
          <div style={{
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: '6px',
            padding: '15px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {component.properties && Object.keys(component.properties).length > 0 ? (
              Object.entries(component.properties).map(([key, value]) => (
                <div key={key} style={{ 
                  marginBottom: '8px',
                  fontSize: '12px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ 
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    marginRight: '10px'
                  }}>
                    {key}:
                  </span>
                  <span style={{ 
                    color: 'var(--text-primary)',
                    wordBreak: 'break-word',
                    textAlign: 'right'
                  }}>
                    {formatPropertyValue(value)}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ 
                fontSize: '14px',
                color: 'var(--text-secondary)',
                fontStyle: 'italic'
              }}>
                No properties available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      {!isGuest && (
        <div style={{
          padding: '20px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end'
        }}>
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setEditedComponent(component);
                  setIsEditing(false);
                }}
                className="btn btn-secondary"
                style={{ fontSize: '14px' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary"
                style={{ fontSize: '14px' }}
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
              style={{ fontSize: '14px' }}
            >
              Edit Component
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ComponentPanel;
