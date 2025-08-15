/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

import { supabase, Database } from "../db/db"

export type Vendor = Database['public']['Tables']['vendors']['Row']

export const VendorService = {
    /** Fetch all Vendors*/
    async getAllVendors(): Promise<Vendor[] | null> {
        const { data, error } = await supabase
            .from('vendors')
            .select('*')
            .order('id', { ascending: false })

        //DEBUG, will be remove
        console.log('📊 Raw Supabase response:')
        console.log('  - Data:', data)
        console.log('  - Error:', error)
        console.log('  - Data length:', data?.length)
        //

        if (error) {
            console.error('Error fetching Vendor:', error)
            throw error
        }
        console.log(data)

        if (!data) {
            return null  // explicitly return null to trigger 404 in route
        }
        return data
    },

    /** Fetch a single Vendor by id */
    //also use in authen
    async getVendorById(id: string ): Promise<Vendor | null> {
        const { data, error } = await supabase
            .from('vendors')
            .select('*')
            .eq('id', id.trim().toLocaleLowerCase())
            .maybeSingle()

        console.log(data)

        if (error) {
            console.error(`Error fetching Vendor ${id}:`, error)
            throw error
        }
        if (!data) {
            return null  // explicitly return null to trigger 404 in route
        }

        return data
    },

    //create
    async createVendor(vendor : Vendor) : Promise<Vendor | null> {
        const {data, error} = await supabase
            .from('vendors')
            .insert({
                id: vendor.id,
                business_name: vendor.business_name,
                business_address: vendor.business_address
            })
            .select()
            .maybeSingle();

        if (error || !data) {
            console.error('Error creating vendor:', error);
            return null;
        }

        return data;
    },

    async deleteVendor(id : string): Promise<boolean>{
        const { error } = await supabase
            .from('vendors')
            .delete()
            .eq('id', id)

        if (error) {
            console.error(`Error deleting vendor ${id}:`, error)
            return false
        }
        
        return true
    }

}