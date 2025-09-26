import React, { useState, useEffect } from 'react';
import { supabase, UserProfile, BIMProject } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminPanel: React.FC = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [projects, setProjects] = useState<BIMProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);

        // Fetch all users
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (usersError) {
          console.error('Error fetching users:', usersError);
        } else {
          setUsers(usersData || []);
        }

        // Fetch all projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (projectsError) {
          console.error('Error fetching projects:', projectsError);
        } else {
          setProjects(projectsData || []);
        }
      } catch (error) {
        console.error('Error in fetchAdminData:', error);
      } finally {
        setLoading(false);
      }
    };

    if (profile?.role === 'admin') {
      fetchAdminData();
    }
  }, [profile]);

  if (profile?.role !== 'admin') {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: 'var(--danger)'
      }}>
        Access Denied: Admin privileges required
      </div>
    );
  }

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
          marginBottom: '30px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '5px',
            color: 'var(--text-primary)'
          }}>
            Admin Panel
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '16px'
          }}>
            Manage users, projects, and system settings
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px var(--shadow)',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Total Users
            </h3>
            <p style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              {stats.totalUsers}
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-primary)',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px var(--shadow)',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Admin Users
            </h3>
            <p style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'var(--danger)',
              margin: 0
            }}>
              {stats.adminUsers}
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-primary)',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px var(--shadow)',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Regular Users
            </h3>
            <p style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'var(--accent-primary)',
              margin: 0
            }}>
              {stats.regularUsers}
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-primary)',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px var(--shadow)',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Total Projects
            </h3>
            <p style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              {stats.totalProjects}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '12px',
          boxShadow: '0 1px 3px var(--shadow)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          marginBottom: '40px'
        }}>
          <div style={{
            padding: '24px 24px 0 24px',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              Users
            </h2>
          </div>
          <div style={{
            overflowX: 'auto'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderBottom: '1px solid var(--border-color)'
                }}>
                  <th style={{
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Name
                  </th>
                  <th style={{
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Email
                  </th>
                  <th style={{
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Role
                  </th>
                  <th style={{
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    <td style={{
                      padding: '16px 24px',
                      fontSize: '14px',
                      color: 'var(--text-primary)'
                    }}>
                      {user.full_name || 'N/A'}
                    </td>
                    <td style={{
                      padding: '16px 24px',
                      fontSize: '14px',
                      color: 'var(--text-primary)'
                    }}>
                      {user.email || 'N/A'}
                    </td>
                    <td style={{
                      padding: '16px 24px'
                    }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: user.role === 'admin' ? '#fef2f2' : '#eff6ff',
                        color: user.role === 'admin' ? '#dc2626' : '#2563eb'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{
                      padding: '16px 24px',
                      fontSize: '14px',
                      color: 'var(--text-secondary)'
                    }}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Projects Table */}
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '12px',
          boxShadow: '0 1px 3px var(--shadow)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '24px 24px 0 24px',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              Projects
            </h2>
          </div>
          <div style={{
            overflowX: 'auto'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderBottom: '1px solid var(--border-color)'
                }}>
                  <th style={{
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Name
                  </th>
                  <th style={{
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Public
                  </th>
                  <th style={{
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} style={{
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    <td style={{
                      padding: '16px 24px',
                      fontSize: '14px',
                      color: 'var(--text-primary)'
                    }}>
                      {project.name}
                    </td>
                    <td style={{
                      padding: '16px 24px'
                    }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: project.is_public ? '#d1fae5' : '#fee2e2',
                        color: project.is_public ? '#065f46' : '#dc2626'
                      }}>
                        {project.is_public ? 'Public' : 'Private'}
                      </span>
                    </td>
                    <td style={{
                      padding: '16px 24px',
                      fontSize: '14px',
                      color: 'var(--text-secondary)'
                    }}>
                      {new Date(project.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;