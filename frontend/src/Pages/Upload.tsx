import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api/projects';
import { categories } from '../Components/Categories';
import { useAuth } from '../context/AuthContext';
import { Images } from 'lucide-react';
import { uploadImageToStorage } from '../utils/imageUpload';

const Upload = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

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

        if (!title || !description || !category) {
            setError('Please fill all required fields');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Upload all images to Supabase Storage
            const uploadedUrls = await Promise.all(
                images.map(async (file, index) => {
                    const url = await uploadImageToStorage(file);
                    setUploadProgress((prev) => ((index + 1) / images.length) * 100);
                    return url;
                })
            );

            // Create project with image URLs
            const projectData = {
                title,
                description,
                category,
                image_urls: uploadedUrls,
            };

            const response = await createProject(projectData);

            if (response.ok) {
                navigate(`/project/${response.data.id}`);
            } else {
                throw new Error('Failed to create project');
            }
        } catch (err: any) {
            setError(err.message || 'Error uploading project');
            // Optionally cleanup uploaded images if project creation fails
        } finally {
            setIsLoading(false);
            setUploadProgress(0);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
                <h1 className="text-2xl font-bold mb-4">Please log in to upload a project</h1>
                <button
                    onClick={() => navigate('/login')}
                    className="p-3 bg-white text-black rounded-lg hover:bg-gray-300"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    // Add upload progress indicator
    const progressBar = uploadProgress > 0 && (
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
            <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
            />
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white py-12">
            <h1 className="text-4xl font-bold mb-4">Upload a Project</h1>
            <p className="mb-8">Enter project details</p>

            {error && (
                <div className="bg-red-500 text-white p-4 rounded-lg mb-6 max-w-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="ring-1 ring-gray-400 p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="mb-6">
                    <label htmlFor="title" className="block mb-2 text-sm font-medium">
                        Title
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

                <div className="mb-6">
                    <label htmlFor="category" className="block mb-2 text-sm font-medium">
                        Category
                    </label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-900 text-white focus:outline-none"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label htmlFor="image" className="block mb-2 text-sm font-medium">
                        Upload Images
                    </label>
                    <input
                        id="image"
                        type="file"
                        onChange={handleImageChange}
                        className="hidden"
                        accept=".jpeg, .jpg"
                        multiple
                    />
                    <button
                        type="button"
                        onClick={() => document.getElementById('image')?.click()}
                        className="w-full p-3 rounded-lg bg-gray-800 text-white font-medium hover:bg-black focus:outline-none"
                    >
                        Upload Images
                    </button>

                    {images.length > 0 && (
                        <div className="mt-2 text-sm text-gray-300">
                            {images.map((file, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <p className="truncate">{file.name}</p>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(index)} // Call handleDelete with the index of the image
                                        className="ring-1 ring-red-600 rounded-lg text-white p-0.5   m-1 hover:text-red-800 text-sm"
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
                        isLoading ? 'bg-gray-500' : 'bg-white text-black hover:bg-gray-300'
                    } rounded-lg flex justify-center items-center`}
                >
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                    ) : (
                        'Submit'
                    )}
                </button>
            </form>
        </div>
    );
};

export default Upload;
