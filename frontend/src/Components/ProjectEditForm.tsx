import { useState } from 'react';
import { categories } from './Categories';
import { updateProject, ProjectUpdateData, addContributor } from '../api/projects';
import { UserPlus, AlertCircle } from 'lucide-react';

interface ProjectEditFormProps {
  projectId: string;
  initialData: {
    title: string;
    description: string;
    category?: string;
    image?: string;
  };
  onCancel: () => void;
  onSuccess: () => void;
}

const ProjectEditForm = ({ projectId, initialData, onCancel, onSuccess }: ProjectEditFormProps) => {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [category, setCategory] = useState(initialData.category || '');
  const [image, setImage] = useState(initialData.image || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newContributorId, setNewContributorId] = useState('');
  const [isAddingContributor, setIsAddingContributor] = useState(false);
  const [contributorSuccess, setContributorSuccess] = useState<string | null>(null);
  const [contributorError, setContributorError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      setError('Title and description are required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedData: ProjectUpdateData = {
        title,
        description,
        category: category || undefined,
        image: image || undefined,
      };

      const response = await updateProject(projectId, updatedData);

      if (response.status === 'success') {
        onSuccess();
      } else {
        setError('Failed to update project');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error updating project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContributor = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newContributorId.trim()) {
      setContributorError('Please enter a contributor ID');
      return;
    }

    setIsAddingContributor(true);
    setContributorError(null);
    setContributorSuccess(null);

    try {
      const response = await addContributor(projectId, newContributorId.trim());

      if (response.status === 'success') {
        setContributorSuccess(`Contributor added successfully!`);
        setNewContributorId('');
        onSuccess();

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

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg mb-6">
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="title" className="block mb-2 text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block mb-2 text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none min-h-[100px]"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block mb-2 text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none"
          >
            <option value="">Select a category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 ${
              isLoading ? 'bg-gray-500' : 'bg-white text-black hover:bg-gray-300'
            } rounded-lg flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>

      <div className="bg-gray-900 p-6 rounded-lg mt-8">
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
            <label htmlFor="contributorId" className="block mb-2 text-sm font-medium">
              Contributor User ID
            </label>
            <input
              id="contributorId"
              type="text"
              value={newContributorId}
              onChange={(e) => setNewContributorId(e.target.value)}
              placeholder="Enter user ID of contributor"
              className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none"
              required
              disabled={isAddingContributor}
            />
          </div>

          <button
            type="submit"
            disabled={isAddingContributor || !newContributorId.trim()}
            className={`px-4 py-3 ${
              isAddingContributor || !newContributorId.trim()
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
    </div>
  );
};

export default ProjectEditForm;
