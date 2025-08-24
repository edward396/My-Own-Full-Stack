/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

import { ImageService } from "./image.service"
import { VendorService } from "./vendor.service"
import { ShipperService } from "./shipper.service"
import { Pagination } from "../types/general.type"
import { CustomerService } from "./customer.service"
import { supabase, Database, changePassword } from "../db/db"
import { comparePassword, hashPassword } from "../utils/password"

const PROFILE_STORAGE = 'profileimages'
export type UsersFilters = {
    role: 'customer' | 'shipper' | 'vendor' | 'all'
}

export type User = Database['public']['Tables']['users']['Row']
type UsersUpdate = {
    id: string
    password?: string
    newPassword?: string
    profile_picture?: string
}

export const UserService = {

    async getUsers({ page, size }: Pagination, filters: UsersFilters): Promise<User[] | null> {
        const listAll = page === -1 || size === -1;

        let query = supabase
            .from("users")
            .select("*")
            .order("id", { ascending: false });

        if (filters.role !== 'all') {
            query = query.eq("role", filters.role);
        }

        if (!listAll) {
            const offset = (page - 1) * size;
            query = query.range(offset, offset + size - 1);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching users:", error);
            throw error;
        }

        if (!data) return null;
        return data;
    },

    /** Fetch a single user by id */
    //also get data for authen
    async getUserById(id: string, full_info: boolean = true): Promise<Omit<User, 'password'> | null> {
        const { data, error } = await supabase
            .from('users')
            .select('id, username, email, profile_picture, role')
            .eq('id', id)
            .maybeSingle()

        console.log(data)

        if (error) {
            console.error(`Error fetching user ${id}:`, error)
            throw error
        }
        if (!data || !data.role) {
            return null  // explicitly return null to trigger 404 in route
        }

        if (!full_info) {
            return data
        }
        let role_data = null
        switch (data.role) {
            case "customer":
                role_data = await CustomerService.getCustomerById(data.id)
                break
            case "shipper":
                role_data = await ShipperService.getShipperById(data.id)
                break
            case "vendor":
                role_data = await VendorService.getVendorById(data.id)
                break
        }

        //found full info
        if (role_data) {
            return { ...data, ...role_data }
        }

        return null
    },

    async createUser(user: User): Promise<User | null> {
        const { data, error } = await supabase
            .from('users')
            .insert({
                id: user.id,
                email: user.email,
                password: user.password,
                username: user.username,
                profile_picture: user.profile_picture,
                role: user.role
            })
            .select()
            .maybeSingle();

        if (error || !data) {
            console.error('Error creating customer:', error);
            return null;
        }

        return data;
    },

    async deleteUser(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id)

        if (error) {
            console.error(`Error deleting user ${id}:`, error)
            return false
        }

        return true
    },

    async updateUser({ id, password, newPassword, profile_picture }: UsersUpdate): Promise<boolean> {
        try {
            // Get user from DB
            const { data: user, error: fetchError } = await supabase
                .from("users")
                .select("id, password, profile_picture")
                .eq("id", id)
                .maybeSingle();

            if (fetchError || !user) {
                console.error("Error fetching user:", fetchError);
                return false;
            }

            const updateData: any = {};
            // Handle password change
            if (password && newPassword) {
                if (!comparePassword(password, user.password)) {
                    console.error("Old password is incorrect");
                    return false;
                }
                //change password in authen
                const changePassAuthen = await changePassword(newPassword)
                if (!changePassAuthen) {
                    return false
                }
                //hashing before saving
                updateData.password = hashPassword(newPassword);

            } else if ((password && !newPassword) || (!password && newPassword)) {
                console.error("Both password and newPassword must be provided");
                return false;
            }
            //profile pic update

            if (profile_picture) {
                if (user.profile_picture) {
                    const del = await ImageService.deleteImage(user.profile_picture, PROFILE_STORAGE)
                    if (!del) {
                        console.log("Fail to delete image")
                        return false; //fail to delete images
                    }
                }
                updateData.profile_picture = profile_picture;
            }

            //update fail
            if (Object.keys(updateData).length === 0) {
                console.error("No fields to update");
                return false;
            }

            // Update in DB
            const { error: updateError } = await supabase
                .from("users")
                .update(updateData)
                .eq("id", id);

            if (updateError) {
                console.error("Error updating user:", updateError);
                return false;
            }

            return true;
        } catch (err) {
            console.error("Unexpected error in updateUser:", err);
            return false;
        }
    },

    async uploadImage(id: string, file: Express.Multer.File) {
        const result = await ImageService.uploadImage(file, PROFILE_STORAGE);

        if (result.success && result.url) {
            const success = await this.updateUser({
                id,
                profile_picture: result.url // new picture URL
            });

            if (!success) {
                return {
                    success: false,
                    error: "Can not update user table column profile picture"
                };
            }
        }

        return result;
    }
}