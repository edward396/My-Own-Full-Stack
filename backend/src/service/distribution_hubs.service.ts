/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Nguyen Vo Truong Toan
# ID: s3979056 */

import { supabase, Database } from "../db/db";

export type DistributionHub = Database["public"]["Tables"]["distribution_hubs"]["Row"];

export type Pagination = { page: number; size: number };

export const DistributionHubService = {
    /** Fetch all distribution hubs*/
    async getAllDistributionHubs({ page, size }: Pagination): Promise<DistributionHub[] | null> {
        const offset = (page - 1) * size;

        const { data, error } = await supabase
            .from('distribution_hubs')
            .select('*')
            .order('id', { ascending: false })
            .range(offset, offset + size - 1);

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
};