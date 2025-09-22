import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
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

  const [project, setProject] = useState<BIMProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewerReady, setViewerReady] = useState(false);

  useEffect(() => {
    console.log('SimpleBIMViewer: Component mounted with projectId:', projectId);
    console.log('SimpleBIMViewer: Profile:', profile);

    if (!projectId) {
      console.log('SimpleBIMViewer: No projectId, navigating to home');
      navigate('/');
      return;
    }

    fetchProject();

    return () => {
      cleanup();
    };
  }, [projectId]);

  useEffect(() => {
    if (project && !viewerReady) {
      console.log('SimpleBIMViewer: Project loaded, initializing viewer');
      initializeViewer();
    }
  }, [project, viewerReady]);

  const fetchProject = async () => {
    try {
      console.log('SimpleBIMViewer: Fetching project:', projectId);

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

      console.log('SimpleBIMViewer: Using mock project:', mockProject);
      setProject(mockProject);
    } catch (error) {
      console.error('SimpleBIMViewer: Error fetching project:', error);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const initializeViewer = () => {
    if (!mountRef.current || viewerReady) return;

    try {
      console.log('SimpleBIMViewer: Initializing 3D viewer...');

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

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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

      // Add hydroelectric plant components
      const objects = [];

      // Main building structure
      const buildingGeometry = new THREE.BoxGeometry(10, 8, 15);
      const buildingMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.set(0, 4, 0);
      building.castShadow = true;
      building.receiveShadow = true;
      scene.add(building);
      objects.push(building);

      // Roof
      const roofGeometry = new THREE.ConeGeometry(8, 3, 4);
      const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8B0000 });
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.set(0, 10, 0);
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      scene.add(roof);
      objects.push(roof);

      // Turbine
      const turbineGeometry = new THREE.CylinderGeometry(2, 2, 6);
      const turbineMaterial = new THREE.MeshLambertMaterial({ color: 0x4169E1 });
      const turbine = new THREE.Mesh(turbineGeometry, turbineMaterial);
      turbine.position.set(-8, 3, 0);
      turbine.castShadow = true;
      turbine.receiveShadow = true;
      scene.add(turbine);
      objects.push(turbine);

      // Generator housing
      const generatorGeometry = new THREE.BoxGeometry(4, 3, 4);
      const generatorMaterial = new THREE.MeshLambertMaterial({ color: 0x32CD32 });
      const generator = new THREE.Mesh(generatorGeometry, generatorMaterial);
      generator.position.set(8, 1.5, 0);
      generator.castShadow = true;
      generator.receiveShadow = true;
      scene.add(generator);
      objects.push(generator);

      // Pipes
      for (let i = 0; i < 3; i++) {
        const pipeGeometry = new THREE.CylinderGeometry(0.5, 0.5, 12);
        const pipeMaterial = new THREE.MeshLambertMaterial({ color: 0x708090 });
        const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
        pipe.position.set(-2 + i * 2, 6, -8);
        pipe.castShadow = true;
        pipe.receiveShadow = true;
        scene.add(pipe);
        objects.push(pipe);
      }

      // Event listeners
      window.addEventListener('resize', onWindowResize);

      mountRef.current.appendChild(renderer.domElement);

      setViewerReady(true);
      console.log('SimpleBIMViewer: 3D viewer initialized successfully');

      // Start animation loop with turbine rotation
      const animateScene = () => {
        if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !controlsRef.current) return;

        requestAnimationFrame(animateScene);

        // Rotate turbine
        if (turbine) {
          turbine.rotation.y += 0.02;
        }

        controlsRef.current.update();
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      };
      animateScene();
    } catch (error) {
      console.error('SimpleBIMViewer: Error initializing viewer:', error);
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

  const cleanup = () => {
    console.log('SimpleBIMViewer: Cleaning up viewer...');

    if (rendererRef.current && mountRef.current) {
      mountRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    }

    window.removeEventListener('resize', onWindowResize);
  };

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

      <div style={{
        position: 'relative',
        height: 'calc(100vh - 80px)',
        overflow: 'hidden'
      }}>
        {/* Project Info */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
            {project?.name || 'Hydroelectric Plant Viewer'}
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
            {project?.description || 'Interactive 3D visualization of hydroelectric components'}
          </p>
          <div style={{
            marginTop: '10px',
            fontSize: '11px',
            color: '#888',
            padding: '5px 8px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px'
          }}>
            🎮 Use mouse to orbit, zoom, and pan around the 3D model
          </div>
        </div>

        {/* Controls */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 100,
          display: 'flex',
          gap: '10px'
        }}>
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary"
            style={{ padding: '8px 12px', fontSize: '12px' }}
          >
            ← Back
          </button>
        </div>

        {/* 3D Viewer Container */}
        <div
          ref={mountRef}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative'
          }}
        />
      </div>
    </div>
  );
};

export default SimpleBIMViewer;
