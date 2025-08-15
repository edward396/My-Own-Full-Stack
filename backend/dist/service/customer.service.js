"use strict";
/* RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Truong Ba An
# ID: s3999568 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const db_1 = require("../db/db");
exports.CustomerService = {
    /** Fetch all Customers*/
    async getAllCustomers() {
        const { data, error } = await db_1.supabase
            .from('customers')
            .select('*')
            .order('id', { ascending: false });
        //DEBUG, will be remove
        console.log('📊 Raw Supabase response:');
        console.log('  - Data:', data);
        console.log('  - Error:', error);
        console.log('  - Data length:', data?.length);
        //
        if (error) {
            console.error('Error fetching Customer:', error);
            throw error;
        }
        console.log(data);
        if (!data) {
            return null; // explicitly return null to trigger 404 in route
        }
        return data;
    },
    /** Fetch a single Customer by id */
    async getCustomerById(id) {
        const { data, error } = await db_1.supabase
            .from('customers')
            .select('*')
            .eq('id', id.trim().toLocaleLowerCase())
            .maybeSingle();
        console.log(data);
        if (error) {
            console.error(`Error fetching Customer ${id}:`, error);
            throw error;
        }
        if (!data) {
            return null; // explicitly return null to trigger 404 in route
        }
        return data;
    },
    async createCustomer(customer) {
        console.log("Customer data in createCustomer", customer);
        const { data, error } = await db_1.supabase
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
    async deleteCustomer(id) {
        const { error } = await db_1.supabase
            .from('customers')
            .delete()
            .eq('id', id);
        if (error) {
            console.error(`Error deleting customer ${id}:`, error);
            return false;
        }
        return true;
    }
};
