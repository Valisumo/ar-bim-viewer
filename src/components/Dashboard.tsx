import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, BIMProject } from '../config/supabase';
import Header from './layout/Header';
import ProjectCard from './projects/ProjectCard';
import UploadModal from './projects/UploadModal';

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<BIMProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { profile, isAdmin, isGuest } = useAuth();
  const navigate = useNavigate();

  console.log('Dashboard: Component rendered, loading:', loading, 'projects:', projects.length);

  useEffect(() => {
    console.log('Dashboard: useEffect triggered with profile:', profile, 'isGuest:', isGuest);
    // Only fetch projects when we have a profile or are in guest mode
    if (profile || isGuest) {
      const timer = setTimeout(() => {
        console.log('Dashboard: Fetching projects after timeout');
        fetchProjects();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [profile, isGuest]);

  const fetchProjects = async () => {
    try {
      console.log('Dashboard: fetchProjects called, profile:', profile);
      console.log('Dashboard: isAdmin:', isAdmin, 'isGuest:', isGuest);

      // Don't fetch if profile is not loaded yet (unless guest)
      if (!profile && !isGuest) {
        console.log('Dashboard: Profile not ready, skipping fetch');
        setLoading(false);
        return;
      }

      // Use real Supabase query with proper null checks
      let query = supabase.from('projects').select('*');

      if (isGuest) {
        query = query.eq('is_public', true);
      } else if (!isAdmin && profile?.id) {
        query = query.or(`is_public.eq.true,created_by.eq.${profile.id}`);
      } else if (!profile?.id) {
        // If no profile ID, only show public projects
        query = query.eq('is_public', true);
      }

      console.log('Dashboard: Executing query...');
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Dashboard: Error fetching projects:', error);
        // If there's an error, show empty projects list
        setProjects([]);
      } else {
        console.log('Dashboard: Fetched projects:', data?.length || 0);
        console.log('Dashboard: Projects data:', data);

        // If no projects found, this might be a new database
        if (!data || data.length === 0) {
          console.log('Dashboard: No projects found in database');

          // For development, show a helpful message about creating sample data
          if (profile?.id) {
            console.log('Dashboard: User is logged in but no projects found');
            // Keep empty array for now - user needs to upload first project
            setProjects([]);
          } else {
            setProjects([]);
          }
        } else {
          setProjects(data);
        }
      }
    } catch (error) {
      console.error('Dashboard: Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/viewer/${projectId}`);
  };

  const handleUploadSuccess = () => {
    console.log('Upload success callback triggered');
    setShowUploadModal(false);
    
    // Add a small delay to ensure modal closes properly
    setTimeout(() => {
      console.log('Refetching projects after upload...');
      fetchProjects();
    }, 100);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <Header />
      
      <div className="container" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>
              BIM Projects
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {isGuest ? 'Public projects available for viewing' : 'Manage your hydroelectric plant models'}
            </p>
          </div>
          
          {!isGuest && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn btn-primary"
              style={{ padding: '12px 24px' }}
            >
              📁 Upload IFC File
            </button>
          )}
        </div>

        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px'
          }}>
            <div className="spinner"></div>
          </div>
        ) : projects.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '12px',
            border: '2px dashed var(--border-color)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📋</div>
            <h3 style={{ marginBottom: '10px' }}>Welcome to AR-BIM Viewer!</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              {isGuest
                ? 'No public projects are currently available. Sign up to create your first project!'
                : 'Ready to visualize your hydroelectric plant models in 3D? Upload your first IFC file to get started.'
              }
            </p>
            {!isGuest && (
              <div style={{ marginTop: '20px' }}>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="btn btn-primary"
                  style={{ marginRight: '10px' }}
                >
                  📁 Upload IFC File
                </button>
                <p style={{ marginTop: '15px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  💡 <strong>Tip:</strong> Upload IFC files from your CAD software to see them rendered in interactive 3D
                </p>
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleProjectClick(project.id)}
                canEdit={!isGuest && (isAdmin || project.created_by === profile?.id)}
                onUpdate={fetchProjects}
              />
            ))}
          </div>
        )}

        {/* Quick Start Section */}
        <div style={{ 
          marginTop: '60px',
          padding: '30px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)'
        }}>
          <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>Quick Start Guide</h2>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>📁 Upload IFC Files</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Upload your Building Information Modeling files to visualize hydroelectric plant components in 3D.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>🥽 AR Visualization</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Use WebXR technology to overlay digital information onto real-world equipment for maintenance tasks.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>📱 Mobile Ready</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Access your projects on any device with responsive design optimized for field work.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;
