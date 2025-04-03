import { useState } from 'react';
import { categories } from './Categories';
import { updateProject, ProjectUpdateData } from '../api/projects';

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

  return (
    <div>
      <form onSubmit={handleSubmit} className="ring-1 ring-red-200 bg-gray-1000 p-6 rounded-lg mb-6">
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
            className="w-full p-3 rounded-lg ring-1 ring-gray-500 bg-gray-900 text-white focus:outline-none"
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
            className="w-full p-3 rounded-lg ring-1 ring-gray-500 bg-gray-900 text-white focus:outline-none min-h-[100px]"
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
            className="w-full p-3 rounded-lg bg-gray-900 ring-1 ring-gray-500 text-white focus:outline-none"
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
            className="px-4 py-2 ring-1 ring-gray-700 text-white rounded-lg hover:bg-gray-600"
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
    </div>
  );
};

export default ProjectEditForm;
