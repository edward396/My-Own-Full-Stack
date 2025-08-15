/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

import { supabase, Database } from "../db/db"
import { CustomerService } from "./customer.service"
import { ShipperService } from "./shipper.service"
import { VendorService } from "./vendor.service"

export type User = Database['public']['Tables']['users']['Row']

export const UserService = {
    /** Fetch all users*/
    async getAllUsers(): Promise<User[] | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('id', { ascending: false })

        //DEBUG, will be remove
        console.log('📊 Raw Supabase response:')
        console.log('  - Data:', data)
        console.log('  - Error:', error)
        console.log('  - Data length:', data?.length)
        //

        if (error) {
            console.error('Error fetching user:', error)
            throw error
        }
        console.log(data)

        if (!data) {
            return null  // explicitly return null to trigger 404 in route
        }
        return data
    },

    /** Fetch a single user by id */
    //also get data for authen
    async getUserById(id: string ): Promise<User | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
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
        
        switch(data.role){
            case "customer":
                const customer_data = await CustomerService.getCustomerById(data.id)
                return { ...data, ...customer_data}
            case "shipper":
                const shipper_data = await ShipperService.getShipperById(data.id)
                return { ...data, ...shipper_data}
            case "vendor":
                const vendor_data = await VendorService.getVendorById(data.id)
                return { ...data, ...vendor_data}
        }

        return null
    },

    async createUser(user : User): Promise<User | null> {
        const {data, error} = await supabase
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

    async deleteUser(id : string): Promise<boolean>{
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id)
        
        if (error) {
            console.error(`Error deleting user ${id}:`, error)
            return false
        }
        
        return true
    }
}