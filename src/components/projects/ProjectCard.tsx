import React, { useState } from 'react';
import { BIMProject } from '../../config/supabase';

interface ProjectCardProps {
  project: BIMProject;
  onClick: () => void;
  canEdit: boolean;
  onUpdate: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, canEdit, onUpdate }) => {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div 
      className="card"
      style={{ 
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px var(--shadow)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 4px var(--shadow)';
      }}
      onClick={onClick}
    >
      {canEdit && (
        <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              color: 'var(--text-secondary)',
              padding: '5px'
            }}
          >
            ⋮
          </button>
          
          {showMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: '0',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              boxShadow: '0 4px 12px var(--shadow)',
              zIndex: 10,
              minWidth: '120px'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle edit
                  setShowMenu(false);
                }}
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: 'var(--text-primary)'
                }}
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle delete
                  setShowMenu(false);
                }}
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: 'var(--danger-color)'
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.name}
            style={{
              width: '100%',
              height: '150px',
              objectFit: 'cover',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-tertiary)'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '150px',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px'
          }}>
            🏗️
          </div>
        )}
      </div>

      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: '600', 
        marginBottom: '8px',
        color: 'var(--text-primary)'
      }}>
        {project.name}
      </h3>

      {project.description && (
        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '14px',
          marginBottom: '15px',
          lineHeight: '1.4'
        }}>
          {project.description.length > 100 
            ? `${project.description.substring(0, 100)}...` 
            : project.description
          }
        </p>
      )}

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        fontSize: '12px',
        color: 'var(--text-secondary)'
      }}>
        <span>Created {formatDate(project.created_at)}</span>
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
  );
};

export default ProjectCard;
