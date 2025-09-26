import React from 'react';
import { BIMProject } from '../../config/supabase';

interface ProjectCardProps {
  project: BIMProject;
  onClick: () => void;
  onUpdate: () => void;
  canEdit: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, onUpdate, canEdit }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}
      onClick={onClick}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Thumbnail */}
      <div style={{
        height: '160px',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            color: '#9ca3af',
            fontSize: '48px'
          }}>
            
          </div>
        )}

        {/* Status badges */}
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          display: 'flex',
          gap: '4px'
        }}>
          {canEdit && (
            <span style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: '500'
            }}>
              Editable
            </span>
          )}
          <span style={{
            backgroundColor: project.is_public ? '#3b82f6' : '#6b7280',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '500'
          }}>
            {project.is_public ? 'Public' : 'Private'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {project.name}
        </h3>

        {project.description && (
          <p style={{
            color: '#6b7280',
            fontSize: '14px',
            marginBottom: '12px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.4'
          }}>
            {project.description}
          </p>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          color: '#9ca3af'
        }}>
          <span>Created {formatDate(project.created_at)}</span>
          {canEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdate();
              }}
              style={{
                color: '#3b82f6',
                textDecoration: 'underline',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;