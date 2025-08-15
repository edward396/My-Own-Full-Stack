/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

import { supabase, Database } from "../db/db"

export type Shipper = Database['public']['Tables']['shippers']['Row']

export const ShipperService = {
    /** Fetch all Shippers*/
    async getAllShippers(): Promise<Shipper[] | null> {
        const { data, error } = await supabase
            .from('shippers')
            .select('*')
            .order('id', { ascending: false })

        //DEBUG, will be remove
        console.log('📊 Raw Supabase response:')
        console.log('  - Data:', data)
        console.log('  - Error:', error)
        console.log('  - Data length:', data?.length)
        //

        if (error) {
            console.error('Error fetching Shipper:', error)
            throw error
        }
        console.log(data)

        if (!data) {
            return null  // explicitly return null to trigger 404 in route
        }
        return data
    },

    /** Fetch a single Shipper by id */
    async getShipperById(id: string ): Promise<Shipper | null> {
        const { data, error } = await supabase
            .from('shippers')
            .select('*')
            .eq('id', id.trim().toLocaleLowerCase())
            .maybeSingle()

        console.log(data)

        if (error) {
            console.error(`Error fetching Shipper ${id}:`, error)
            throw error
        }
        if (!data) {
            return null  // explicitly return null to trigger 404 in route
        }

        return data
    },

    async createShipper(shipper : Shipper) : Promise<Shipper | null> {
        const {data, error} = await supabase
            .from('shippers')
            .insert({
                id: shipper.id,
                hub_id: shipper.hub_id,
            })
            .select()
            .maybeSingle();

        if (error || !data) {
            console.error('Error creating Shipper:', error);
            return null;
        }

        return data;
    },

    async deleteShipper(id : string): Promise<boolean>{
        const { error } = await supabase
            .from('shippers')
            .delete()
            .eq('id', id)
        
        if (error) {
            console.error(`Error deleting shipper ${id}:`, error)
            return false
        }
        
        return true
    }
}