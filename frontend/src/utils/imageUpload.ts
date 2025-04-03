import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export const uploadImageToStorage = async (file: File) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `project-images/${fileName}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from('projects')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL - corrected destructuring
    const { data: urlData } = supabase.storage
      .from('projects')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};