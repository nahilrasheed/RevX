import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject, getTags } from '../api/projects';
import { useAuth } from '../context/AuthContext';
import { Images, Tag as TagIcon, Check, X } from 'lucide-react';
import { uploadImageToStorage } from '../utils/imageUpload';
import { Tag } from '../types/project';

const Upload = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    // Fetch available tags when component mounts
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await getTags();
                if (response.status === 'success') {
                    console.log('Retrieved tags:', response.data);
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

    // Handle image selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files)); // Convert FileList to array
        }
    };

    // Handle deleting a specific image
    const handleDelete = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index)); // Filter out the deleted image
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !description) {
            setError('Please fill title and description');
            return;
        }
        // Removed the image requirement check

        setIsLoading(true);
        setError(null);
        setUploadProgress(0); // Reset progress

        try {
            // Upload all images to Supabase Storage if there are any
            const uploadedUrls = images.length > 0 ? 
                await Promise.all(
                    images.map(async (file, index) => {
                        const url = await uploadImageToStorage(file);
                        // Update progress smoothly
                        setUploadProgress((prev) => prev + (100 / images.length));
                        return url;
                    })
                ) : [];

            // Validate that all selected tags exist in availableTags
            const validTagIds = selectedTagIds.filter(tagId => {
                return availableTags.some(tag => 
                    tag && tag.tag_id !== undefined && tag.tag_id.toString() === tagId
                );
            });
            
            // Log validation information for debugging
            console.log("Selected tag IDs:", selectedTagIds);
            console.log("Valid tag IDs:", validTagIds);

            // Create project with image URLs and validated tag IDs
            const projectData = {
                title,
                description,
                tags: validTagIds,
                images: uploadedUrls, // Pass uploaded image URLs
            };

            console.log("Sending project data:", projectData);
            const response = await createProject(projectData);

            if (response.status === 'success') {
                navigate(`/project/${response.data.id}`); // Navigate to the new project page
            } else {
                setError(response.message || 'Failed to create project');
            }
        } catch (err: any) {
            console.error("Project creation error:", err);
            setError(err.message || 'An error occurred during project creation');
            // Consider deleting uploaded images if project creation fails
        } finally {
            setIsLoading(false);
            setUploadProgress(0); // Reset progress on finish/error
        }
    };

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Progress bar component
    const progressBar = isLoading && uploadProgress > 0 ? (
        <div className="w-full bg-gray-700 rounded-full h-2.5 my-4">
            <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
            ></div>
        </div>
    ) : null;


    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center py-12 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-1000 ring-1 ring-gray-600 p-8 rounded-lg shadow-lg w-full max-w-2xl"
            >
                <h1 className="text-3xl font-bold mb-8 text-center">Upload Your Project</h1>

                {error && (
                    <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 p-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <label htmlFor="title" className="block mb-2 text-sm font-medium">
                        Project Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Project Title"
                        className="w-full p-3 rounded-lg bg-gray-900 text-white focus:outline-none"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="description" className="block mb-2 text-sm font-medium">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief Description"
                        className="w-full p-3 rounded-lg bg-gray-900 text-white focus:outline-none min-h-[100px]"
                        required
                    ></textarea>
                </div>

                {/* Tag Selection UI */}
                <div className="mb-6">
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
                                    
                                    // Use either tag_id or id, preferring tag_id
                                    const tagId = tag.tag_id !== undefined ? tag.tag_id : tag.id;
                                    
                                    if (tagId === undefined) {
                                        console.warn("Tag with missing ID:", tag);
                                        return null;
                                    }
                                    
                                    const tagIdStr = String(tagId);
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

                <div className="mb-6">
                    <label htmlFor="image" className="block mb-2 text-sm font-medium">
                        Upload Images (JPEG/JPG)
                    </label>
                    <input
                        id="image"
                        type="file"
                        onChange={handleImageChange}
                        className="hidden"
                        accept=".jpeg, .jpg"
                        multiple // Allow multiple files
                    />
                    <button
                        type="button"
                        onClick={() => document.getElementById('image')?.click()}
                        className="w-full p-3 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-600 flex items-center justify-center gap-2"
                    >
                       <Images className="h-5 w-5" /> Upload Images
                    </button>

                    {images.length > 0 && (
                        <div className="mt-4 space-y-2 border border-gray-700 p-3 rounded-lg">
                            <p className="text-sm font-medium mb-2">Selected Images:</p>
                            {images.map((file, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                                    <p className="truncate text-sm">{file.name}</p>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(index)} // Call handleDelete with the index of the image
                                        className="ring-1 ring-red-600 rounded-lg text-white p-1 m-1 hover:bg-red-700 text-xs"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {progressBar}

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full p-3 mt-4 ${
                        isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-300'
                    } rounded-lg flex justify-center items-center transition-colors duration-200`}
                >
                    {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black mr-2"></div>
                          {uploadProgress < 100 ? `Uploading (${Math.round(uploadProgress)}%)...` : 'Creating Project...'}
                        </>
                    ) : (
                        'Submit Project'
                    )}
                </button>
            </form>
        </div>
    );
};

export default Upload;
