import { useState, useEffect } from 'react';
import { updateProject, getTags } from '../api/projects';
import { Tag } from '../types/project';
import { Tag as TagIcon, Check, X } from 'lucide-react';

interface ProjectEditFormData {
  title: string;
  description: string;
  tags?: Tag[];
  image?: string;
}

interface ProjectEditFormProps {
  projectId: string;
  initialData: ProjectEditFormData;
  onCancel: () => void;
  onSuccess: () => void;
}

const ProjectEditForm: React.FC<ProjectEditFormProps> = ({
  projectId,
  initialData,
  onCancel,
  onSuccess,
}) => {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialData.tags?.map(tag => tag.tag_id.toString()) || []
  );
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available tags when component mounts
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getTags();
        if (response.status === 'success') {
          console.log('Retrieved tags for edit form:', response.data);
          setAvailableTags(response.data || []);
        } else {
          console.error("Failed to fetch tags:", response.message);
        }
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };
    fetchTags();
  }, []);

  // Clear tag filters
  const clearTagFilters = () => {
    setSelectedTagIds([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate that all selected tags exist in availableTags
      const validTagIds = selectedTagIds.filter(tagId => {
        return availableTags.some(tag => 
          tag && tag.tag_id.toString() === tagId
        );
      });
      
      // Log validation information
      console.log("Selected tag IDs:", selectedTagIds);
      console.log("Valid tag IDs:", validTagIds);
      
      const updatedData = {
        title,
        description,
        tags: validTagIds, // Send only validated tag IDs
      };

      console.log("Sending update data:", updatedData);
      const response = await updateProject(projectId, updatedData);

      if (response.status === 'success') {
        onSuccess();
      } else {
        setError(response.message || 'Failed to update project');
      }
    } catch (err: unknown) {
      console.error("Update project error:", err);
      setError((err as Error)?.message || 'An error occurred while updating the project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-950 ring-1 ring-gray-600 p-6 rounded-lg">
      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 p-3 rounded-lg mb-4">
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

      {/* Tag Selection UI */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">
          Tags
        </label>
        <div className="flex items-center">
          <TagIcon className="h-4 w-4 text-purple-400 mr-2 flex-shrink-0" />
          {availableTags.length === 0 ? (
            <div className="text-gray-500 text-center py-2 text-sm italic flex-grow">
              Loading tags...
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 py-2 max-h-36 overflow-y-auto flex-grow pl-0.5">
              {availableTags.map((tag) => {
                if (!tag) {
                  return null;
                }
                
                const tagIdStr = String(tag.tag_id);
                const isSelected = selectedTagIds.includes(tagIdStr);
                const tagButtonClass = isSelected
                  ? "bg-purple-600/80 text-white hover:bg-purple-500 ring-1 ring-purple-300"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 ring-1 ring-gray-600";
                  
                return (
                  <button
                    key={tagIdStr}
                    type="button"
                    onClick={() => {
                      const currentTagId = tagIdStr;
                      setSelectedTagIds((prevSelected) => {
                        return prevSelected.includes(currentTagId)
                          ? prevSelected.filter(id => id !== currentTagId)
                          : [...prevSelected, currentTagId];
                      });
                    }}
                    className={`
                      px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 
                      transition-all duration-150 ease-in-out cursor-pointer
                      ${tagButtonClass}`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                    {tag.tag_name}
                  </button>
                );
              })}
            </div>
          )}
          
          {selectedTagIds.length > 0 && (
            <button
              type="button"
              onClick={clearTagFilters}
              className="text-purple-400 hover:text-purple-300 flex items-center text-xs sm:text-sm font-medium transition duration-150 ml-3 flex-shrink-0"
            >
              <X className="h-3.5 w-3.5 mr-1" /> Clear ({selectedTagIds.length})
            </button>
          )}
        </div>
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
            isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-300'
          } rounded-lg flex items-center justify-center transition-colors duration-200`}
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
  );
};

export default ProjectEditForm;
