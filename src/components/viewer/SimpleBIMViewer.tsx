import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as OBC from '@thatopen/components';
import { supabase, BIMProject } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../layout/Header';
import LoadingSpinner from '../common/LoadingSpinner';

const SimpleBIMViewer: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const controlsRef = useRef<OrbitControls>();
  const arSessionRef = useRef<any>(null);

  const [project, setProject] = useState<BIMProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewerReady, setViewerReady] = useState(false);
  const [isARMode, setIsARMode] = useState(false);
  const [isXRSupported, setIsXRSupported] = useState(false);

  useEffect(() => {
    if (!projectId) {
      navigate('/');
      return;
    }

    fetchProject();

    return () => {
      cleanup();
    };
  }, [projectId]);

  useEffect(() => {
    // Check WebXR support asynchronously - comprehensive HoloLens debugging
    const checkXRSupport = async () => {
      console.log('🔍 Starting comprehensive WebXR check for HoloLens...');
      console.log('🌐 Current URL:', window.location.href);
      console.log('🔒 Is HTTPS:', window.location.protocol === 'https:');
      console.log('📱 Full User Agent:', navigator.userAgent);

      // Check if WebXR API exists
      if (!navigator.xr) {
        console.log('❌ WebXR API not available in navigator');
        setIsXRSupported(false);
        return;
      }

      console.log('✅ WebXR API found in navigator');

      try {
        // Check all possible session types
        const sessionTypes: XRSessionMode[] = ['immersive-vr', 'immersive-ar', 'inline'];
        const results: Record<string, boolean> = {};

        console.log('🔎 Checking session support...');

        for (const type of sessionTypes) {
          try {
            console.log(`⏳ Checking ${type}...`);
            const supported = await navigator.xr.isSessionSupported(type);
            results[type] = supported;
            console.log(`✅ ${type}: ${supported ? 'SUPPORTED' : 'NOT SUPPORTED'}`);
          } catch (error) {
            results[type] = false;
            console.log(`❌ ${type}: ERROR - ${(error as Error).message}`);
          }
        }

        const hasXRSupport = results['immersive-vr'] || results['immersive-ar'] || results['inline'];

        console.log('📊 Final Results:');
        console.log('  - immersive-vr:', results['immersive-vr']);
        console.log('  - immersive-ar:', results['immersive-ar']);
        console.log('  - inline:', results['inline']);
        console.log('  - Overall support:', hasXRSupport);

        // Additional HoloLens-specific checks
        console.log('🎭 HoloLens-specific checks:');
        console.log('  - Has WebXR:', !!navigator.xr);
        console.log('  - Has requestSession:', typeof navigator.xr.requestSession === 'function');
        console.log('  - Has isSessionSupported:', typeof navigator.xr.isSessionSupported === 'function');

        setIsXRSupported(hasXRSupport);

      } catch (error) {
        console.error('💥 WebXR support check completely failed:', error);
        setIsXRSupported(false);
      }
    };

    // Longer delay for HoloLens initialization
    setTimeout(checkXRSupport, 500);
  }, []);

  useEffect(() => {
    if (project && !viewerReady) {
      initializeViewer();
    }
  }, [project, viewerReady]);

  useEffect(() => {
    // Component mounted
  }, []);

  const fetchProject = async () => {
    try {
      const mockProject: BIMProject = {
        id: projectId || 'default-project',
        name: 'Hydroelectric Plant - Viewer Demo',
        description: '3D visualization of hydroelectric plant components',
        ifc_file_url: '/mock/demo.ifc',
        thumbnail_url: '/mock/thumbnail.jpg',
        created_by: profile?.id || 'demo-user',
        is_public: true,
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z'
      };

      setProject(mockProject);
    } catch (error) {
      console.error('Error fetching project:', error);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const initializeViewer = async () => {
    if (!mountRef.current || viewerReady) return;

    try {
      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);
      sceneRef.current = scene;

      // Camera
      const camera = new THREE.PerspectiveCamera(
        75,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.set(10, 10, 10);
      cameraRef.current = camera;

      // Renderer with WebXR support
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.xr.enabled = true; // Enable WebXR
      rendererRef.current = renderer;

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controlsRef.current = controls;

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(50, 50, 50);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      // Grid
      const gridHelper = new THREE.GridHelper(100, 100);
      scene.add(gridHelper);

      // Add BIM model placeholder
      const placeholderGeometry = new THREE.BoxGeometry(5, 5, 5);
      const placeholderMaterial = new THREE.MeshLambertMaterial({ color: 0x4a90e2 });
      const placeholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
      placeholder.position.set(0, 2.5, 0);
      placeholder.castShadow = true;
      placeholder.receiveShadow = true;
      scene.add(placeholder);

      // Event listeners
      window.addEventListener('resize', onWindowResize);

      // Append renderer to DOM
      if (mountRef.current && renderer.domElement) {
        mountRef.current.appendChild(renderer.domElement);
      }

      setViewerReady(true);

      // Start animation loop
      const animateScene = () => {
        if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !controlsRef.current) return;

        requestAnimationFrame(animateScene);

        controlsRef.current.update();
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      };
      animateScene();

    } catch (error) {
      console.error('Error initializing viewer:', error);
      setError('Failed to initialize 3D viewer');
    }
  };

  const onWindowResize = () => {
    if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  };

  const toggleAR = async () => {
    if (!rendererRef.current) return;

    if (isARMode) {
      // Exit AR mode
      if (arSessionRef.current) {
        await arSessionRef.current.end();
        arSessionRef.current = null;
      }
      setIsARMode(false);

      // Restore orbit controls
      if (controlsRef.current) {
        controlsRef.current.enabled = true;
      }
    } else {
      // Enter AR mode - try different session types
      try {
        let session = null;
        let sessionType = '';

        // Try immersive-ar first
        if (navigator.xr && await navigator.xr.isSessionSupported('immersive-ar')) {
          console.log('Requesting immersive-ar session');
          session = await navigator.xr.requestSession('immersive-ar', {
            requiredFeatures: ['local-floor', 'hit-test'],
            optionalFeatures: ['dom-overlay'],
            domOverlay: mountRef.current ? { root: mountRef.current } : undefined
          });
          sessionType = 'immersive-ar';
        }
        // Try immersive-vr (for HoloLens)
        else if (navigator.xr && await navigator.xr.isSessionSupported('immersive-vr')) {
          console.log('Requesting immersive-vr session');
          session = await navigator.xr.requestSession('immersive-vr', {
            requiredFeatures: ['local-floor'],
            optionalFeatures: ['dom-overlay'],
            domOverlay: mountRef.current ? { root: mountRef.current } : undefined
          });
          sessionType = 'immersive-vr';
        }
        // Try inline as fallback
        else if (navigator.xr && await navigator.xr.isSessionSupported('inline')) {
          console.log('Requesting inline session');
          session = await navigator.xr.requestSession('inline', {
            requiredFeatures: [],
            optionalFeatures: ['dom-overlay'],
            domOverlay: mountRef.current ? { root: mountRef.current } : undefined
          });
          sessionType = 'inline';
        }

        if (session) {
          console.log(`Started ${sessionType} session`);
          arSessionRef.current = session;
          await rendererRef.current.xr.setSession(session as any);
          setIsARMode(true);

          // Disable orbit controls in AR/VR
          if (controlsRef.current) {
            controlsRef.current.enabled = false;
          }

          session.addEventListener('end', () => {
            console.log('XR session ended');
            setIsARMode(false);
            arSessionRef.current = null;
            if (controlsRef.current) {
              controlsRef.current.enabled = true;
            }
          });
        } else {
          throw new Error('No compatible XR session type supported');
        }
      } catch (error) {
        console.error('Failed to start XR session:', error);
        alert(`XR is not supported on this device or browser.\n\nSupported session types:\n- immersive-ar: ${navigator.xr ? await navigator.xr.isSessionSupported('immersive-ar') : false}\n- immersive-vr: ${navigator.xr ? await navigator.xr.isSessionSupported('immersive-vr') : false}\n- inline: ${navigator.xr ? await navigator.xr.isSessionSupported('inline') : false}\n\nMake sure you have a compatible XR device and are using HTTPS.`);
      }
    }
  };

  const cleanup = () => {
    if (arSessionRef.current) {
      arSessionRef.current.end();
      arSessionRef.current = null;
    }

    if (rendererRef.current && mountRef.current) {
      mountRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    }

    window.removeEventListener('resize', onWindowResize);
  };

  useEffect(() => {
    console.log('🎨 SimpleBIMViewer: Component mounted and about to render');
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
        <Header />
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
        <Header />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{
            color: 'var(--danger-color)',
            fontSize: '18px',
            textAlign: 'center'
          }}>
            ❌ {error}
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <Header />

      {/* Project Info and Controls */}
      <div style={{
        position: 'absolute',
        top: '90px',
        left: '20px',
        right: '20px',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        {/* Project Info */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxWidth: '400px'
        }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
            {project?.name || 'BIM Project Viewer'}
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
            {project?.description || 'Interactive 3D BIM visualization'}
            <br />
            <small style={{ color: '#999' }}>
              AR Support: {isXRSupported ? '✅' : '❌'} |
              Device: {navigator.userAgent.includes('HoloLens') || navigator.userAgent.includes('Windows Mixed Reality') ? 'HoloLens' :
                      navigator.userAgent.includes('Mobile') || navigator.userAgent.includes('Android') || navigator.userAgent.includes('iPhone') ? 'Mobile' : 'Desktop'}
            </small>
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary"
            style={{ padding: '8px 12px', fontSize: '12px' }}
          >
            ← Back
          </button>

          {viewerReady && (
            <button
              onClick={async () => {
                console.log('🧪 Manual WebXR test...');
                if (navigator.xr) {
                  console.log('WebXR available');
                  try {
                    const vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
                    const arSupported = await navigator.xr.isSessionSupported('immersive-ar');
                    const inlineSupported = await navigator.xr.isSessionSupported('inline');
                    console.log('Manual check results:', { vrSupported, arSupported, inlineSupported });
                    alert(`Manual WebXR Check:\nVR: ${vrSupported}\nAR: ${arSupported}\nInline: ${inlineSupported}`);
                  } catch (e) {
                    console.error('Manual check failed:', e);
                    alert('Manual WebXR check failed: ' + (e as Error).message);
                  }
                } else {
                  console.log('WebXR not available');
                  alert('WebXR API not available');
                }
              }}
              className="btn btn-info"
              style={{ padding: '8px 12px', fontSize: '10px' }}
            >
              Test XR
            </button>
          )}

          {viewerReady && isXRSupported && (
            <button
              onClick={toggleAR}
              className={`btn ${isARMode ? 'btn-danger' : 'btn-primary'}`}
              style={{ padding: '8px 12px', fontSize: '12px' }}
            >
              {isARMode ? '📱 Exit AR' : '📱 AR Mode'}
            </button>
          )}
        </div>
      </div>

      {/* 3D Viewer Container */}
      <div
        ref={mountRef}
        style={{
          position: 'absolute',
          top: '80px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#f5f5f5'
        }}
      />
    </div>
  );
};

export default SimpleBIMViewer;
