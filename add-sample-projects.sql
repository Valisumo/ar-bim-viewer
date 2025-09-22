-- Add Sample Projects to Your AR-BIM Viewer Database
-- Replace 'your-user-id-here' with your actual user ID from the profiles table

-- First, find your user ID:
-- SELECT id, email, full_name FROM profiles;

-- Then run this with your actual user ID:
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
    'demo-hydro-plant',
    'Hydroelectric Plant Demo',
    'Interactive 3D model of a hydroelectric power plant with turbines, generators, and control systems',
    'https://example.com/demo/hydro-plant.ifc',
    'https://example.com/demo/thumbnail.jpg',
    'your-user-id-here', -- Replace with your actual user ID
    true,
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '7 days'
  ),
  (
    'demo-intake-structure',
    'Water Intake Facility',
    'Intake structure with trash racks, gates, and fish passage systems',
    'https://example.com/demo/intake.ifc',
    'https://example.com/demo/intake-thumb.jpg',
    'your-user-id-here', -- Replace with your actual user ID
    true,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days'
  ),
  (
    'demo-transformer-station',
    'Main Transformer Station',
    'Electrical substation with step-up transformers and protection systems',
    'https://example.com/demo/transformer.ifc',
    'https://example.com/demo/transformer-thumb.jpg',
    'your-user-id-here', -- Replace with your actual user ID
    false,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
  );

-- To find your user ID, run this query first:
-- SELECT id, email, full_name FROM profiles WHERE email = 'your-email@example.com';
