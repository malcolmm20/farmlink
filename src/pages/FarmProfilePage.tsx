import { useParams } from 'react-router-dom';
import { FarmProfile } from '../components/FarmProfile';
import { useAuth } from '../contexts/AuthContext';

export default function FarmProfilePage() {
  const { farmId } = useParams<{ farmId: string }>();
  const { user } = useAuth();
  const currentUserId = user?._id || null;

  if (!farmId) {
    return <div className="text-center py-8 text-red-600">Invalid farm ID</div>;
  }

  return <FarmProfile farmId={farmId} currentUserId={currentUserId} />;
} 