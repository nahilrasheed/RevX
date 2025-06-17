import { useState, useEffect } from 'react';
import { updateProject, getTags } from '../api/projects';
import { Tag } from '../types/project';
import { Tag as TagIcon, Check, X, Images, Trash2 } from 'lucide-react';
import { uploadImageToStorage } from '../utils/imageUpload';

interface ProjectEditFormData {
  title: string;
  description: string;
  tags?: Tag[];
  images?: string[]; // Updated to support multiple images
}

interface ProjectEditFormProps {
  projectId: string;
  initialData: ProjectEditFormData;
  onCancel: () => void;
  onSuccess: () => void;
}

// Add constant for maximum images
const MAX_IMAGES = 10;

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
  
  // Image-related state
  const [currentImages] = useState<string[]>(initialData.images || []);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

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

  // Handle new image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const totalImages = currentImages.length - imagesToRemove.length + newImages.length + selectedFiles.length;
      
      // Check if adding these files would exceed the limit
      if (totalImages > MAX_IMAGES) {
        setError(`You can only have a maximum of ${MAX_IMAGES} images per project. Current total would be ${totalImages}.`);
        return;
      }
      
      const validNewImages: File[] = [];
      const invalidImages: string[] = [];

      const imagePromises = selectedFiles.map((file) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = URL.createObjectURL(file);
          img.onload = () => {
            if (img.width >= 240 && img.height >= 240) {
              validNewImages.push(file);
            } else {
              invalidImages.push(file.name);
            }
            resolve();  
          };
        });
      });

      Promise.all(imagePromises).then(() => {
        // Add new valid images to existing new images
        setNewImages(prevImages => [...prevImages, ...validNewImages]); 

        if (invalidImages.length > 0) {
          setError(`Invalid image dimensions (min 240x240px): ${invalidImages.join(', ')}`);
        }
      });
    }
    
    // Reset the input value so the same file can be selected again if needed
    e.target.value = '';
  };

  // Handle removing existing images
  const handleRemoveExistingImage = (imageUrl: string) => {
    setImagesToRemove(prev => [...prev, imageUrl]);
  };

  // Handle removing new images
  const handleRemoveNewImage = (index: number) => {
    setNewImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  // Handle restoring removed existing images
  const handleRestoreImage = (imageUrl: string) => {
    setImagesToRemove(prev => prev.filter(url => url !== imageUrl));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Upload new images if any
      let uploadedImageUrls: string[] = [];
      if (newImages.length > 0) {
        uploadedImageUrls = await Promise.all(
          newImages.map(async (file) => {
            const url = await uploadImageToStorage(file);
            // Update progress smoothly
            setUploadProgress((prev) => prev + (100 / newImages.length));
            return url;
          })
        );
      }

      // Calculate final images list
      const remainingCurrentImages = currentImages.filter(url => !imagesToRemove.includes(url));
      const finalImages = [...remainingCurrentImages, ...uploadedImageUrls];

      // Validate that all selected tags exist in availableTags
      const validTagIds = selectedTagIds.filter(tagId => {
        return availableTags.some(tag => 
          tag && tag.tag_id.toString() === tagId
        );
      });
      
      // Log validation information
      console.log("Selected tag IDs:", selectedTagIds);
      console.log("Valid tag IDs:", validTagIds);
      console.log("Final images:", finalImages);
      
      const updatedData = {
        title,
        description,
        tags: validTagIds,
        images: finalImages, // Include updated images
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
      setUploadProgress(0);
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

      {/* Image Management UI */}
      <div className="mb-4">
        
        {/* Current Images */}
        {currentImages.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2 text-gray-300">Current Images:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {currentImages.map((imageUrl, index) => {
                const isMarkedForRemoval = imagesToRemove.includes(imageUrl);
                return (
                  <div key={index} className={`relative group ${isMarkedForRemoval ? 'opacity-75' : ''}`}>
                    <div className="h-36 overflow-hidden rounded-lg bg-gray-800">
                      <img 
                        src={imageUrl} 
                        alt={`Project image ${index + 1}`}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    
                    {/* Action buttons - always on top with higher z-index */}
                    <div className={`absolute top-2 right-2 z-20 ${isMarkedForRemoval ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                      {isMarkedForRemoval ? (
                        <button
                          type="button"
                          onClick={() => handleRestoreImage(imageUrl)}
                          className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-medium shadow-lg"
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(imageUrl)}
                          className="bg-red-600 hover:bg-red-700 text-white p-1 rounded shadow-lg"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    
                    {/* Removal overlay - lower z-index */}
                    {isMarkedForRemoval && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-lg z-10">
                        <span className="text-red-300 text-xs font-medium bg-red-900 bg-opacity-80 px-2 py-1 rounded">Will be removed</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* New Images */}
        {newImages.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2 text-gray-300">New Images:</h4>
            <div className="space-y-2 border border-gray-700 p-3 rounded-lg">
              {newImages.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                  <p className="truncate text-sm">{file.name}</p>
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)} 
                    className='rounded-lg text-white p-1 m-1 hover:bg-red-700 text-xs'>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Images Button */}
        <input
          id="image-edit"
          type="file"
          onChange={handleImageChange}
          className="hidden"
          accept=".jpeg, .jpg, .png, .gif, .webp"
          multiple
        />
        <button
          type="button"
          onClick={() => document.getElementById('image-edit')?.click()}
          className="w-full p-3 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-600 flex items-center justify-center gap-2"
        >
          <Images className="h-5 w-5" /> 
          {newImages.length === 0 && currentImages.length === 0 ? 'Add Images' : 'Add More Images'} 
          ({currentImages.length - imagesToRemove.length + newImages.length}/{MAX_IMAGES})
        </button>

        {/* Upload Progress */}
        {isLoading && uploadProgress > 0 && (
          <div className="w-full bg-gray-700 rounded-full h-2.5 mt-3">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
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
