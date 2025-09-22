-- Sample Projects for AR-BIM Viewer Dashboard
-- Run this in your Supabase SQL Editor to create example projects

-- Insert sample projects (replace 'your-user-id' with actual user ID from profiles table)
INSERT INTO projects (
  id,
  name,
  description,
  ifc_file_url,
  thumbnail_url,
  created_by,
  is_public,
  created_at,
  updated_at
) VALUES
  (
    'sample-hydro-plant',
    'Hydroelectric Plant - Main Facility',
    'Primary powerhouse with turbines, generators, and control systems. Features include Francis turbines, synchronous generators, and SCADA control room.',
    'https://example.com/sample/hydro-main.ifc',
    'https://example.com/thumbnails/hydro-main.jpg',
    'your-user-id', -- Replace with actual user ID
    true,
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '30 days'
  ),
  (
    'sample-intake',
    'Water Intake Structure',
    'Intake facility with trash racks, stop logs, and control gates. Includes penstock connections and fish screening systems.',
    'https://example.com/sample/intake-structure.ifc',
    'https://example.com/thumbnails/intake.jpg',
    'your-user-id', -- Replace with actual user ID
    true,
    NOW() - INTERVAL '25 days',
    NOW() - INTERVAL '25 days'
  ),
  (
    'sample-penstock',
    'High-Pressure Penstock System',
    'Steel-lined concrete penstock with surge tank, butterfly valves, and pressure monitoring. 500m length, 2.5m diameter.',
    'https://example.com/sample/penstock-system.ifc',
    'https://example.com/thumbnails/penstock.jpg',
    'your-user-id', -- Replace with actual user ID
    false,
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '20 days'
  ),
  (
    'sample-spillway',
    'Emergency Spillway & Gates',
    'Concrete overflow spillway with radial gates and energy dissipation structures. Includes gate control systems and monitoring.',
    'https://example.com/sample/spillway-dam.ifc',
    'https://example.com/thumbnails/spillway.jpg',
    'other-user-id', -- Different user ID for demo
    true,
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '15 days'
  ),
  (
    'sample-transformer',
    'Main Transformer Station',
    'Step-up transformers, switchgear, and protection systems. 220kV/11kV transformation with oil cooling and monitoring.',
    'https://example.com/sample/transformer-station.ifc',
    'https://example.com/thumbnails/transformer.jpg',
    'your-user-id', -- Replace with actual user ID
    false,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days'
  );

-- To get your user ID, run this query in Supabase SQL Editor:
-- SELECT id, email, full_name FROM profiles;
