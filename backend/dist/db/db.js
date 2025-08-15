"use strict";
/* RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Truong Ba An
# ID: s3999568 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = exports.supabaseClient = void 0;
exports.signInUser = signInUser;
exports.signUpUser = signUpUser;
exports.deleteAuthenUser = deleteAuthenUser;
exports.changePassword = changePassword;
exports.uploadImage = uploadImage;
exports.getPublicImageUrl = getPublicImageUrl;
exports.deleteImage = deleteImage;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
const supabaseClientKey = process.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey || !supabaseClientKey) {
    console.error('Supabase URL or Anon Key or Secret Key is missing from environment variables!');
}
//this is for login through auth
exports.supabaseClient = (0, supabase_js_1.createClient)(supabaseUrl, supabaseClientKey);
//this is for querying database
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
async function signInUser(email, password) {
    const { data, error } = await exports.supabaseClient.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        console.error('Error signing in:', error.message);
        return null;
    }
    return data.session;
}
async function signUpUser(email, password) {
    const { data, error } = await exports.supabaseClient.auth.signUp({
        email,
        password,
    });
    if (error) {
        console.error('Error signing up:', error.message);
        return null;
    }
    return data.session;
}
//for delete user in authentication table
async function deleteAuthenUser(userId) {
    try {
        const { data, error } = await exports.supabase.auth.admin.deleteUser(userId);
        if (error) {
            console.error('Error deleting user:', error.message);
            return { success: false, message: error.message };
        }
        console.log('User deleted successfully:', data);
        return { success: true, data };
    }
    catch (err) {
        console.error('An unexpected error occurred:', err);
        return { success: false, message: 'An unexpected error occurred' };
    }
}
async function changePassword(newPassword) {
    const { error } = await exports.supabaseClient.auth.updateUser({
        password: newPassword,
    });
    if (error) {
        console.error('Error changing password:', error.message);
        return false;
    }
    return true;
}
async function uploadImage(file, userId) {
    const filePath = `${userId}/${Date.now()}-${file.name}`;
    const { data, error } = await exports.supabase.storage
        .from('images') // bucket name
        .upload(filePath, file);
    if (error) {
        console.error('Error uploading image:', error.message);
        return null;
    }
    return filePath; // store this in users.profile_picture or products.image
}
function getPublicImageUrl(filePath) {
    const { data } = exports.supabase.storage
        .from('images')
        .getPublicUrl(filePath);
    return data.publicUrl;
}
async function deleteImage(filePath) {
    const { error } = await exports.supabase.storage
        .from('images')
        .remove([filePath]);
    if (error) {
        console.error('Error deleting image:', error.message);
        return false;
    }
    return true;
}
