"use strict";
/* RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Truong Ba An
# ID: s3999568 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const db_1 = require("../db/db");
const customer_service_1 = require("./customer.service");
const shipper_service_1 = require("./shipper.service");
const vendor_service_1 = require("./vendor.service");
exports.UserService = {
    /** Fetch all users*/
    async getAllUsers() {
        const { data, error } = await db_1.supabase
            .from('users')
            .select('*')
            .order('id', { ascending: false });
        //DEBUG, will be remove
        console.log('📊 Raw Supabase response:');
        console.log('  - Data:', data);
        console.log('  - Error:', error);
        console.log('  - Data length:', data?.length);
        //
        if (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
        console.log(data);
        if (!data) {
            return null; // explicitly return null to trigger 404 in route
        }
        return data;
    },
    /** Fetch a single user by id */
    //also get data for authen
    async getUserById(id) {
        const { data, error } = await db_1.supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        console.log(data);
        if (error) {
            console.error(`Error fetching user ${id}:`, error);
            throw error;
        }
        if (!data || !data.role) {
            return null; // explicitly return null to trigger 404 in route
        }
        switch (data.role) {
            case "customer":
                const customer_data = await customer_service_1.CustomerService.getCustomerById(data.id);
                return { ...data, ...customer_data };
            case "shipper":
                const shipper_data = await shipper_service_1.ShipperService.getShipperById(data.id);
                return { ...data, ...shipper_data };
            case "vendor":
                const vendor_data = await vendor_service_1.VendorService.getVendorById(data.id);
                return { ...data, ...vendor_data };
        }
        return null;
    },
    async createUser(user) {
        const { data, error } = await db_1.supabase
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
    async deleteUser(id) {
        const { error } = await db_1.supabase
            .from('users')
            .delete()
            .eq('id', id);
        if (error) {
            console.error(`Error deleting user ${id}:`, error);
            return false;
        }
        return true;
    }
};
