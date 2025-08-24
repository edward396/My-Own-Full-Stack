/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

import { supabase } from "../db/db";

export type Storage = 'profileimages' | 'productsimages';

const allowedMimes = ['image/png', 'image/jpeg'];
const allowedBuckets: Storage[] = ['profileimages', 'productsimages'];

interface ImageResult {
    success: boolean;
    url?: string;
    error?: string;
}

export const ImageService = {
    async uploadImage(file: Express.Multer.File, bucket: Storage): Promise<ImageResult> {
        try {
            //check bucket name
            if (!allowedBuckets.includes(bucket)) {
                return { success: false, error: 'Invalid bucket name.' };
            }

            if (!allowedMimes.includes(file.mimetype)) {
                // Return an error if the file type is not allowed
                return { success: false, error: 'Invalid file type. Only PNG, JPEG are allowed.' };
            }

            const filename = `${Date.now()}-${file.originalname}`;

            // Upload to Supabase Storage
            const { error } = await supabase.storage
                .from(bucket) // bucket name
                .upload(filename, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true,
                });

            if (error) {
                console.error("Error uploading image:", error);
                return { success: false, error: error.message };
            }

            return { success: true, url: filename };
        } catch (err: any) {
            return { success: false, error: "Unexpected error uploading image" };
        }
    },

    getPublicImageUrl(filePath: string, bucket: Storage): ImageResult {
        if (!allowedBuckets.includes(bucket)) {
            return { success: false, error: 'Invalid bucket name.' };
        }
        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return { success: true, url: data.publicUrl };
    },

    async deleteImage(filePath: string, bucket: Storage): Promise<ImageResult> {
        if (!allowedBuckets.includes(bucket)) {
            return { success: false, error: 'Invalid bucket name.' };
        }
        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) {
            console.error('Error deleting image:', error.message);
            return { success: false, error: "Can not delete image in bucket" };
        }

        return { success: true };
    }
};
