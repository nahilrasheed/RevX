import { useState } from 'react';
import { User, UserPlus, AlertCircle } from 'lucide-react';
import { removeContributor, addContributor } from '../api/projects';
import { Contributor } from '../types/project';

interface ContributorsListProps {
  projectId: string;
  contributors: Contributor[];
  isOwner: boolean | null;
  isEditing?: boolean;
  onContributorRemoved: () => void;
  onAddContributor?: () => void;
}

const ContributorsList = ({ 
  projectId, 
  contributors, 
  isOwner, 
  isEditing = false, 
  onContributorRemoved,
  onAddContributor
}: ContributorsListProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  
  const [newContributorUsername, setNewContributorUsername] = useState('');
  const [isAddingContributor, setIsAddingContributor] = useState(false);
  const [contributorSuccess, setContributorSuccess] = useState<string | null>(null);
  const [contributorError, setContributorError] = useState<string | null>(null);

  const handleRemoveContributor = async (contributorId: string) => {
    if (!contributorId) {
      setError('Invalid contributor ID');
      return;
    }

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
  
  const handleAddContributor = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newContributorUsername.trim()) {
      setContributorError('Please enter a username');
      return;
    }

    setIsAddingContributor(true);
    setContributorError(null);
    setContributorSuccess(null);

    try {
      const response = await addContributor(projectId, { 
        username: newContributorUsername.trim() 
      });

      if (response.status === 'success') {
        setContributorSuccess(`Contributor added successfully!`);
        setNewContributorUsername('');
        if (onAddContributor) onAddContributor();

        setTimeout(() => {
          setContributorSuccess(null);
        }, 3000);
      } else {
        setContributorError('Failed to add contributor');
      }
    } catch (err: any) {
      setContributorError(err.response?.data?.detail || 'Error adding contributor');
    } finally {
      setIsAddingContributor(false);
    }
  };

  if (contributors.length === 0 && !isEditing) {
    return <p className="text-gray-400">No contributors for this project.</p>;
  }
  
  return (
    <div>
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {/* Add Contributor Form - Only show when in editing mode */}
      {isOwner && isEditing && (
        <div className="bg-gray-900 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4">Add Contributors</h3>

          {contributorSuccess && (
            <div className="bg-green-600 text-white p-4 rounded-lg mb-4 flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{contributorSuccess}</p>
              </div>
            </div>
          )}

          {contributorError && (
            <div className="bg-red-500 text-white p-4 rounded-lg mb-4 flex items-start">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="ml-3">
                <p className="text-sm font-medium">{contributorError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleAddContributor} className="flex items-end gap-4">
            <div className="flex-grow">
              <label htmlFor="contributorUsername" className="block mb-2 text-sm font-medium">
                Contributor Username
              </label>
              <input
                id="contributorUsername"
                type="text"
                value={newContributorUsername}
                onChange={(e) => setNewContributorUsername(e.target.value)}
                placeholder="Enter username of contributor"
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none"
                required
                disabled={isAddingContributor}
              />
              <p className="text-sm text-gray-400 mt-1">
                Enter the exact username of the user you want to add
              </p>
            </div>

            <button
              type="submit"
              disabled={isAddingContributor || !newContributorUsername.trim()}
              className={`px-4 py-3 ${
                isAddingContributor || !newContributorUsername.trim()
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white rounded-lg flex items-center transition`}
            >
              {isAddingContributor ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <UserPlus className="h-5 w-5 mr-2" />
                  Add Contributor
                </>
              )}
            </button>
          </form>
        </div>
      )}
      
      {/* Contributors List */}
      {contributors.length > 0 && (
        isOwner && isEditing ? (
          <ul className="space-y-2">
            {contributors.map((contributor) => (
              <li
                key={contributor.id || contributor.user_id}
                className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                    {contributor.avatar ? (
                      <img
                        src={contributor.avatar}
                        alt="Contributor avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
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

                <button
                  onClick={() => handleRemoveContributor(contributor.id)}
                  disabled={isLoading && removingId === contributor.id}
                  className={`px-3 py-1 ${
                    isLoading && removingId === contributor.id
                      ? 'bg-gray-600'
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white rounded-lg text-sm`}
                >
                  {isLoading && removingId === contributor.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    'Remove'
                  )}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {contributors.map((contributor) => (
              <li
                key={contributor.id || contributor.user_id}
                className="flex items-center bg-gray-800 p-3 rounded-lg"
              >
                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                  {contributor.avatar ? (
                    <img
                      src={contributor.avatar}
                      alt="Contributor avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    contributor.full_name?.substring(0, 2) || contributor.username?.substring(0, 2) || contributor.user_id?.substring(0, 2)
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {contributor.full_name || `User ${contributor.user_id.substring(0, 8)}`}
                  </p>
                  <p className="text-sm text-gray-400">
                    {contributor.username ? `@${contributor.username}` : 'No username'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
};

export default ContributorsList;
