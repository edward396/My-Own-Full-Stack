/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

import { supabase, Database } from "../db/db"
import { Pagination } from "../types/general.type"

export type Shipper = Database['public']['Tables']['shippers']['Row']
type ShipperUpdate = Database['public']['Tables']['shippers']['Update'] & { id: string }
type FullShipper = {
    id: string,
    hub_id: string,
    username: string,
    email: string,
    profile_picture: string,
}
export const ShipperService = {

    async getShippers({ page, size }: Pagination): Promise<FullShipper[] | null> {
        const listAll = page === -1 || size === -1;

        let query = supabase
            .from("shippers")
            .select(`
                    *,
                    users (
                        email,
                        username,
                        profile_picture
                    )
                `)
            .order("id", { ascending: false });

        if (!listAll) {
            const offset = (page - 1) * size;
            query = query.range(offset, offset + size - 1);
        }

        const { data, error } = await query;

        // DEBUG, will be remove
        console.log('📊 Raw Supabase response:')
        console.log('  - Data:', data)
        console.log('  - Error:', error)
        console.log('  - Data length:', data?.length)
        //

        if (error) {
            console.error("Error fetching users:", error);
            throw error;
        }

        if (!data) return null;
        //flatten data
        return data.map(Shipper => {
            const { users, ...restOfShipper } = Shipper;

            return {
                ...restOfShipper,
                ...users
            };
        });
    },

    /** Fetch a single Shipper by id */
    async getShipperById(id: string): Promise<Shipper | null> {
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

    async createShipper(shipper: Shipper): Promise<Shipper | null> {
        const { data, error } = await supabase
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

    async updateShipper({ id, hub_id }: ShipperUpdate): Promise<boolean> {
        const { error } = await supabase
            .from('shippers')
            .update(hub_id)
            .eq('id', id);
        if (error) {
            console.error(`Error updating shipper ${id}:`, error);
            return false;
        }
        return true;
    }
}