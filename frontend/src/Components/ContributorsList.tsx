import { useState } from 'react';
import { User } from 'lucide-react';
import { removeContributor } from '../api/projects';
import { useAuth } from '../context/AuthContext';
import { Contributor } from '../types/project';

// Update the interface to match the backend data
interface ContributorsListProps {
  projectId: string;
  contributors: Contributor[];
  isOwner: boolean | null;
  onContributorRemoved: () => void;
}

const ContributorsList = ({ projectId, contributors, isOwner, onContributorRemoved }: ContributorsListProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  
  const handleRemoveContributor = async (contributorId: string) => {
    setIsLoading(true);
    setError(null);
    setRemovingId(contributorId);
    
    try {
      const response = await removeContributor(projectId, contributorId);
      
      if (response.status === 'success') {
        onContributorRemoved();
      } else {
        setError('Failed to remove contributor');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error removing contributor');
    } finally {
      setIsLoading(false);
      setRemovingId(null);
    }
  };
  
  if (contributors.length === 0) {
    return <p className="text-gray-400">No contributors for this project.</p>;
  }
  
  return (
    <div>
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <ul className="space-y-2">
        {contributors.map((contributor) => (
          <li 
            key={contributor.user_id}
            className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
          >
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">
                  {contributor.full_name || `User ${contributor.user_id.substring(0, 8)}`}
                </p>
                <p className="text-sm text-gray-400">
                  {contributor.username ? `@${contributor.username}` : 'No username'}
                </p>
              </div>
            </div>
            
            {isOwner && (
              <button
                onClick={() => handleRemoveContributor(contributor.user_id)}
                disabled={isLoading && removingId === contributor.user_id}
                className={`px-3 py-1 ${
                  isLoading && removingId === contributor.user_id 
                    ? 'bg-gray-600' 
                    : 'bg-red-600 hover:bg-red-700'
                } text-white rounded-lg text-sm`}
              >
                {isLoading && removingId === contributor.user_id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  'Remove'
                )}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContributorsList;
