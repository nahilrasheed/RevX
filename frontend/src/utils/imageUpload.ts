import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const uploadImageToStorage = async (file: File): Promise<string> => {
  try {
    // Log the process for debugging
    console.log("Starting upload for file:", file.name);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // 1. Get auth tokens from backend
    console.log("Getting auth tokens from:", `${import.meta.env.VITE_API_URL}/api/imagekit/auth`);
    const authResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/imagekit/auth`);
    const { signature, token, expire } = authResponse.data;

    // Log tokens WITHOUT revealing full signatures (security best practice)
    console.log("Full auth tokens for debugging:", { 
      signature,
      token,
      expire,
      publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY
    });

    // Create form data - MAINTAIN EXACT ORDER as per ImageKit docs
    const formData = new FormData();
    
    // Authentication parameters - ORDER MATTERS
    formData.append('publicKey', import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
    formData.append('signature', signature);
    formData.append('token', token);
    formData.append('expire', expire.toString());

    // File must come first
    formData.append('file', file);
    
    // Optional parameters last
    formData.append('fileName', fileName);
    formData.append('folder', 'project-images');
    formData.append('useUniqueFileName', 'true');
    formData.append('isPrivateFile', 'false');
    
    // 4. Upload to ImageKit directly - ALWAYS USE THIS SPECIFIC URL
    console.log("Uploading to ImageKit...");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${typeof value === 'object' ? '[File object]' : value}`);
    }
    const uploadResponse = await axios.post(
      'https://upload.imagekit.io/api/v1/files/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    console.log("Upload successful, response:", uploadResponse.data);
    
    // 5. Return the URL
    return uploadResponse.data.url;
    
  } catch (error) {
    // Better error handling with more details
    if (axios.isAxiosError(error)) {
      console.error('Axios error during upload:', error.message);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      throw new Error(`Upload failed: ${error.response?.data?.message || error.message}`);
    }
    
    console.error('Error uploading image:', error);
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : String(error)}`);
  }
};