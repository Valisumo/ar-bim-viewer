import React, { useState, useEffect } from 'react';
import { supabase, UserProfile, BIMProject } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../layout/Header';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [projects, setProjects] = useState<BIMProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'projects' | 'analytics' | 'credentials'>('users');
  const { profile } = useAuth();

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchData();
    }
  }, [profile]);

  const fetchData = async () => {
    try {
      const [usersResponse, projectsResponse] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: false })
      ]);

      if (usersResponse.data) setUsers(usersResponse.data);
      if (projectsResponse.data) setProjects(projectsResponse.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      
      setProjects(projects.filter(project => project.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const toggleProjectVisibility = async (projectId: string, isPublic: boolean) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_public: !isPublic, updated_at: new Date().toISOString() })
        .eq('id', projectId);

      if (error) throw error;
      
      setProjects(projects.map(project => 
        project.id === projectId ? { ...project, is_public: !isPublic } : project
      ));
    } catch (error) {
      console.error('Error updating project visibility:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const stats = {
    totalUsers: users.length,
    adminUsers: users.filter(u => u.role === 'admin').length,
    regularUsers: users.filter(u => u.role === 'user').length,
    totalProjects: projects.length,
    publicProjects: projects.filter(p => p.is_public).length,
    privateProjects: projects.filter(p => !p.is_public).length
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <Header />
      
      <div className="container" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>
            Admin Panel
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage users, projects, and system settings
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent-color)' }}>
              {stats.totalUsers}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total Users</div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--success-color)' }}>
              {stats.totalProjects}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total Projects</div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--warning-color)' }}>
              {stats.publicProjects}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Public Projects</div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--danger-color)' }}>
              {stats.adminUsers}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Admin Users</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginBottom: '30px',
          borderBottom: '1px solid var(--border-color)'
        }}>
          {(['users', 'projects', 'analytics', 'credentials'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                padding: '15px 0',
                fontSize: '16px',
                fontWeight: '500',
                color: activeTab === tab ? 'var(--accent-color)' : 'var(--text-secondary)',
                borderBottom: activeTab === tab ? '2px solid var(--accent-color)' : 'none',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <div className="card">
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>
              User Management
            </h3>
            <div style={{ 
              fontSize: '14px', 
              color: 'var(--text-secondary)', 
              marginBottom: '20px',
              padding: '10px',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: '6px',
              border: '1px solid var(--border-color)'
            }}>
              💡 <strong>Tip:</strong> Click on any user row to quickly toggle between admin/user roles, or use the dropdown for precise control.
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>
                      User
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>
                      Email
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>
                      Role
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>
                      Joined
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr 
                      key={user.id} 
                      style={{ 
                        borderBottom: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      onClick={() => {
                        if (user.id !== profile?.id) {
                          const newRole = user.role === 'admin' ? 'user' : 'admin';
                          updateUserRole(user.id, newRole);
                        }
                      }}
                    >
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--accent-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>
                            {user.full_name?.charAt(0) || 'U'}
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: '500' }}>
                            {user.full_name || 'Unknown User'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px' }}>
                        {user.email || 'No email'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: user.role === 'admin' ? 'var(--danger-color)' : 'var(--success-color)',
                          color: 'white',
                          textTransform: 'uppercase'
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {user.id !== profile?.id && (
                          <select
                            value={user.role}
                            onChange={(e) => updateUserRole(user.id, e.target.value as 'admin' | 'user')}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: '1px solid var(--border-color)',
                              backgroundColor: 'var(--bg-primary)',
                              color: 'var(--text-primary)',
                              fontSize: '12px'
                            }}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="card">
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
              Project Management
            </h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>
                      Project
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>
                      Creator
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>
                      Visibility
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>
                      Created
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '2px' }}>
                            {project.name}
                          </div>
                          {project.description && (
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              {project.description.length > 50 
                                ? `${project.description.substring(0, 50)}...` 
                                : project.description
                              }
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px' }}>
                        {users.find(u => u.id === project.created_by)?.full_name || 'Unknown'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => toggleProjectVisibility(project.id, project.is_public)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            backgroundColor: project.is_public ? 'var(--success-color)' : 'var(--warning-color)',
                            color: 'white',
                            textTransform: 'uppercase'
                          }}
                        >
                          {project.is_public ? 'Public' : 'Private'}
                        </button>
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        {new Date(project.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="btn btn-danger"
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="card">
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
              System Analytics
            </h3>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              <div style={{
                padding: '20px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '8px'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
                  User Statistics
                </h4>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  <div style={{ marginBottom: '8px' }}>
                    Total Users: <strong>{stats.totalUsers}</strong>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    Admin Users: <strong>{stats.adminUsers}</strong>
                  </div>
                  <div>
                    Regular Users: <strong>{stats.regularUsers}</strong>
                  </div>
                </div>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '8px'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
                  Project Statistics
                </h4>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  <div style={{ marginBottom: '8px' }}>
                    Total Projects: <strong>{stats.totalProjects}</strong>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    Public Projects: <strong>{stats.publicProjects}</strong>
                  </div>
                  <div>
                    Private Projects: <strong>{stats.privateProjects}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'credentials' && (
          <div className="card">
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
              System Credentials & Quick Admin Setup
            </h3>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '20px'
            }}>
              <div style={{
                padding: '20px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: 'var(--accent-color)' }}>
                  🔑 Admin Test Credentials
                </h4>
                <div style={{ fontSize: '14px', fontFamily: 'monospace', backgroundColor: 'var(--bg-primary)', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Email:</strong> admin@arbimviewer.com
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Password:</strong> AdminBIM2024!
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    Use these credentials to create an admin account
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--warning-color)', padding: '10px', backgroundColor: 'rgba(255, 193, 7, 0.1)', borderRadius: '4px' }}>
                  ⚠️ Change these credentials in production!
                </div>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: 'var(--success-color)' }}>
                  🚀 Quick Admin Setup
                </h4>
                <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <strong>1.</strong> Sign up with the credentials above
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong>2.</strong> Go to Supabase → Table Editor → profiles
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong>3.</strong> Change your user's role to 'admin'
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong>4.</strong> Refresh the app to access admin features
                  </div>
                </div>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: 'var(--danger-color)' }}>
                  📊 Supabase Project Info
                </h4>
                <div style={{ fontSize: '14px', fontFamily: 'monospace', backgroundColor: 'var(--bg-primary)', padding: '15px', borderRadius: '6px' }}>
                  <div style={{ marginBottom: '8px', wordBreak: 'break-all' }}>
                    <strong>Project URL:</strong><br />
                    https://yiyizebpzogufozusemv.supabase.co
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Project ID:</strong> yiyizebpzogufozusemv
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    Dashboard: supabase.com/dashboard/project/yiyizebpzogufozusemv
                  </div>
                </div>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: 'var(--accent-color)' }}>
                  👥 User Management Tips
                </h4>
                <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  <div style={{ marginBottom: '8px' }}>
                    • <strong>Click any user row</strong> to toggle admin/user role
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    • <strong>Use dropdown</strong> for precise role selection
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    • <strong>Cannot modify</strong> your own role for security
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    • <strong>Logout button</strong> available in header
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
