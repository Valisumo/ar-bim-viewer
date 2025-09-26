import { createClient } from '@supabase/supabase-js';

const url = process.env.REACT_APP_SUPABASE_URL;
const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log(' Supabase Environment Check:');
console.log('  - REACT_APP_SUPABASE_URL:', url ? ' SET' : ' MISSING');
console.log('  - REACT_APP_SUPABASE_ANON_KEY:', key ? ' SET' : ' MISSING');
console.log('  - All env vars:', Object.keys(process.env).filter(k => k.startsWith('REACT_APP_')));

if (!url || !key) {
  console.error(' Missing Supabase configuration!');
  console.error('Please ensure your .env file contains:');
  console.error('  REACT_APP_SUPABASE_URL=your_supabase_project_url');
  console.error('  REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key');
  throw new Error('Missing Supabase configuration. Check your .env file.');
}

export const supabase = createClient(url, key);

// Export types
export type UserRole = 'admin' | 'user' | 'guest';
export type UserProfile = {
  id: string;
  role: UserRole;
  full_name?: string;
  email?: string;
  created_at: string;
  updated_at: string;
};

export type BIMProject = {
  id: string;
  name: string;
  description?: string | null;
  ifc_file_url?: string | null;
  created_by: string;
  created_at: string;
  updated_at?: string | null;
  // Fields required by AdminPanel, ProjectCard, SimpleBIMViewer, ViewerControls
  is_public: boolean;
  thumbnail_url?: string | null;
};

export type ComponentInfo = {
  id: string;
  project_id: string;
  name: string;
  type: string;
  properties?: Record<string, any>;
  geometry?: any;
  created_at: string;
  updated_at: string;
  // Fields required by ARControls and ComponentPanel
  status?: 'good' | 'warning' | 'critical';
  maintenance_notes?: string | null;
  last_inspection?: string | null; // ISO date string
  next_inspection?: string | null; // ISO date string
};