import React from 'react';
import { useParams } from 'react-router-dom';
import { FarmProfile } from '../components/FarmProfile';

export const FarmProfilePage: React.FC = () => {
  const { farmId } = useParams<{ farmId: string }>();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const currentUserId = user?._id || null;

  if (!farmId) {
    return <div className="text-center py-8 text-red-600">Invalid farm ID</div>;
  }

  return <FarmProfile farmId={farmId} currentUserId={currentUserId} />;
}; 