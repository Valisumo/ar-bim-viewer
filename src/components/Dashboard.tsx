import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, BIMProject } from '../config/supabase';
import ProjectCard from './projects/ProjectCard';
import UploadModal from './projects/UploadModal';

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<BIMProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { profile, isAdmin, isGuest } = useAuth();
  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      // If not admin, only show public projects or user's own projects
      if (!isAdmin && !isGuest) {
        query = query.or('is_public.eq.true,created_by.eq.' + profile?.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching projects:', error);
        return;
      }

      setProjects(data || []);
    } catch (error) {
      console.error('Error in fetchProjects:', error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, isGuest, profile?.id]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectClick = (projectId: string) => {
    navigate('/project/' + projectId);
  };

  const handleProjectUpdate = () => {
    fetchProjects(); // Refresh the project list
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        fontSize: '18px'
      }}>
        Loading projects...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-secondary)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Welcome back, {profile?.full_name || 'User'}!
            </h1>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '16px'
            }}>
              Manage your BIM projects and explore 3D models
            </p>
          </div>

          {!isGuest && (
            <button
              onClick={() => setShowUploadModal(true)}
              style={{
                padding: '12px 24px',
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 1px 3px var(--shadow)',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-hover)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-primary)'}
            >
              Upload New Project
            </button>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {projects.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '64px 20px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '12px',
              boxShadow: '0 1px 3px var(--shadow)'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                No projects yet
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '14px',
                marginBottom: '24px'
              }}>
                {!isGuest ? 'Upload your first BIM project to get started' : 'No public projects available'}
              </p>
              {!isGuest && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'var(--accent-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Upload Project
                </button>
              )}
            </div>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleProjectClick(project.id)}
                onUpdate={handleProjectUpdate}
                canEdit={!isGuest && (isAdmin || project.created_by === profile?.id)}
              />
            ))
          )}
        </div>
      </div>

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleProjectUpdate}
        />
      )}
    </div>
  );
};

export default Dashboard;