const { supabase } = require('../config/supabase');
const path = require('path');

class SupabaseStorageService {
  constructor() {
    this.bucketName = 'newsletters'; // Bucket name for newsletters
  }

  /**
   * Upload a file to Supabase Storage (matching your example setup)
   * @param {Object} file - Multer file object with buffer
   * @param {string} folder - Folder path in bucket (e.g., 'pdfs' or 'images')
   * @returns {Object} - Object containing URL and fileName
   */
  async uploadFile(fileBuffer, fileName, mimeType, folder) {
    try {
      console.log(`[uploadToSupabase] Starting upload for file: ${fileName} in folder: ${folder}`);
      
      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}-${fileName}`;
      const filePath = `uploads/${folder}/${uniqueFileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, fileBuffer, {
          contentType: mimeType,
          upsert: false,
        });

      if (error) {
        console.error('[uploadToSupabase] Upload error:', error.message);
        throw new Error(error.message);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(data.path);

      console.log('[uploadToSupabase] Upload successful. Public URL:', publicUrlData.publicUrl);
      
      return {
        url: publicUrlData.publicUrl,
        fileName: uniqueFileName,
        path: data.path
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  /**
   * Delete a file from Supabase Storage
   * @param {string} filePath - The file path in the bucket
   */
  async deleteFile(filePath) {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        throw new Error(`Supabase delete error: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }

  /**
   * Delete multiple files from Supabase Storage
   * @param {Array<string>} filePaths - Array of file paths to delete
   */
  async deleteFiles(filePaths) {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove(filePaths);

      if (error) {
        throw new Error(`Supabase delete error: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Delete files error:', error);
      throw error;
    }
  }

  /**
   * Extract file path from Supabase URL
   * @param {string} url - The Supabase public URL
   * @returns {string} - The file path in the bucket
   */
  extractFilePath(url) {
    try {
      // Extract the path after the bucket name
      const urlParts = url.split(`/storage/v1/object/public/${this.bucketName}/`);
      return urlParts[1] || null;
    } catch (error) {
      console.error('Extract path error:', error);
      return null;
    }
  }
}

module.exports = new SupabaseStorageService();