import React, { useState } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface UploadModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { profile } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.toLowerCase().endsWith('.ifc')) {
        setFile(selectedFile);
        if (!name) {
          setName(selectedFile.name.replace('.ifc', ''));
        }
        setError('');
      } else {
        setError('Please select a valid IFC file');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name || !profile?.id) {
      setError('Please ensure you are logged in and all fields are filled');
      return;
    }

    setUploading(true);
    setError('');

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setError('Upload timeout - please try again with a smaller file');
      setUploading(false);
    }, 60000); // 60 second timeout

    try {
      console.log('Starting file upload...', { fileName: file.name, fileSize: file.size });

      // First, check if the bucket exists
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      console.log('Available buckets:', buckets, 'Bucket error:', bucketError);

      const ifcBucket = buckets?.find(bucket => bucket.name === 'ifc-files');
      if (!ifcBucket) {
        throw new Error('Storage bucket "ifc-files" not found. Please create it in Supabase dashboard.');
      }

      // Upload file to Supabase Storage
      const fileExt = 'ifc';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      console.log('Uploading to path:', filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ifc-files')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      console.log('File uploaded successfully:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('ifc-files')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);

      // Create project record in database
      const { data: insertData, error: insertError } = await supabase
        .from('projects')
        .insert({
          name: name,
          description: description || 'Uploaded IFC project',
          ifc_file_url: publicUrl,
          thumbnail_url: publicUrl.replace('.ifc', '.jpg'), // Placeholder thumbnail
          created_by: profile.id,
          is_public: isPublic
        });

      if (insertError) {
        throw insertError;
      }

      console.log('Project created successfully:', insertData);

      clearTimeout(timeoutId);
      console.log('Upload successful, calling onSuccess...');
      onSuccess();
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('Upload failed:', error);

      // Handle specific error types
      if (error.message?.includes('bucket')) {
        setError('Storage bucket not found. Please create "ifc-files" bucket in Supabase dashboard.');
      } else if (error.message?.includes('timeout')) {
        setError('Upload timeout. Please try with a smaller file.');
      } else if (error.message?.includes('size')) {
        setError('File too large. Please try with a smaller IFC file.');
      } else {
        setError(error.message || 'Failed to upload file. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Upload IFC File</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">IFC File</label>
            <input
              type="file"
              accept=".ifc"
              onChange={handleFileChange}
              className="form-control"
              required
              disabled={uploading}
            />
            <small style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
              Only .ifc files are supported
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              required
              disabled={uploading}
              placeholder="Enter project name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
              rows={3}
              disabled={uploading}
              placeholder="Describe your project..."
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                disabled={uploading}
              />
              <span className="form-label" style={{ margin: 0 }}>
                Make this project public
              </span>
            </label>
            <small style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
              Public projects can be viewed by guest users
            </small>
          </div>

          {error && (
            <div style={{
              color: 'var(--danger-color)',
              backgroundColor: 'rgba(220, 53, 69, 0.1)',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            justifyContent: 'flex-end',
            marginTop: '30px'
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!file || !name || uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
