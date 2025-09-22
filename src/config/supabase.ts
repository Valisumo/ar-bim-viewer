import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'admin' | 'user' | 'guest';

export interface UserProfile {
  id: string;
  email?: string;
  role: UserRole;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface BIMProject {
  id: string;
  name: string;
  description?: string;
  ifc_file_url?: string;
  thumbnail_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
}

export interface ComponentInfo {
  id: string;
  project_id: string;
  component_id: string;
  name: string;
  type: string;
  properties: Record<string, any>;
  maintenance_notes?: string;
  last_inspection?: string;
  next_inspection?: string;
  status: 'good' | 'warning' | 'critical';
  created_at: string;
  updated_at: string;
}
