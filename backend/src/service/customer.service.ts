/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

import { supabase, Database } from "../db/db"

export type Customer = Database['public']['Tables']['customers']['Row']

export const CustomerService = {
    /** Fetch all Customers*/
    async getAllCustomers(): Promise<Customer[] | null> {
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .order('id', { ascending: false })

        //DEBUG, will be remove
        console.log('📊 Raw Supabase response:')
        console.log('  - Data:', data)
        console.log('  - Error:', error)
        console.log('  - Data length:', data?.length)
        //

        if (error) {
            console.error('Error fetching Customer:', error)
            throw error
        }
        console.log(data)

        if (!data) {
            return null  // explicitly return null to trigger 404 in route
        }
        return data
    },

    /** Fetch a single Customer by id */
    async getCustomerById(id: string): Promise<Customer | null> {
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .eq('id', id.trim().toLocaleLowerCase())
            .maybeSingle()

        console.log(data)

        if (error) {
            console.error(`Error fetching Customer ${id}:`, error)
            throw error
        }
        if (!data) {
            return null  // explicitly return null to trigger 404 in route
        }

        return data
    },

    async createCustomer(customer: Customer): Promise<Customer | null> {
        console.log("Customer data in createCustomer", customer)
        const { data, error } = await supabase
            .from('customers')
            .insert({
                id: customer.id,
                name: customer.name,
                address: customer.address
            })
            .select()
            .maybeSingle();

        if (error || !data) {
            console.error('Error creating customer:', error);
            return null;
        }

        return data;
    },

    async deleteCustomer(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('customers')
            .delete()
            .eq('id', id)

        if (error) {
            console.error(`Error deleting customer ${id}:`, error)
            return false
        }

        return true
    }
}