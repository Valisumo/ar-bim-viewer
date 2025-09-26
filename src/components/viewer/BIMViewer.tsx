import React from 'react';
import { useParams } from 'react-router-dom';

const BIMViewer: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  return (
    <div>
      <h1>BIM Viewer</h1>
      <p>Project ID: {projectId}</p>
    </div>
  );
};

export default BIMViewer;