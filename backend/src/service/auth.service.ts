/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

import { signUpUser } from '../db/db';
import { deleteAuthenUser } from '../db/db'
import { hashPassword } from '../utils/password';
import { User, UserService } from './user.service';
import { Vendor, VendorService } from './vendor.service';
import { Shipper, ShipperService } from './shipper.service';
import { Customer, CustomerService } from './customer.service';

//return result
interface AuthResult {
    success: boolean;
    data?: {
        access_token: string;
        refresh_token: string;
        user: any;
    };
    error?: string;
}
type UserRole = 'customer' | 'shipper' | 'vendor';
//remove id field and role field from the required form
type NewUser = Omit<User, 'id' | 'role'>;
type NewCustomer = Omit<Customer, 'id'>;
type NewShipper = Omit<Shipper, 'id'>;
type NewVendor = Omit<Vendor, 'id'>;

// Role-specific data types using existing types
interface RoleSpecificData {
    customer: NewCustomer;
    shipper: NewShipper;
    vendor: NewVendor;
}

// mapping
const ROLE_CREATORS = {
    customer: (userId: string, data: RoleSpecificData['customer']) =>
        CustomerService.createCustomer({
            id: userId,
            ...data
        }),

    shipper: (userId: string, data: RoleSpecificData['shipper']) =>
        ShipperService.createShipper({
            id: userId,
            ...data
        }),

    vendor: (userId: string, data: RoleSpecificData['vendor']) =>
        VendorService.createVendor({
            id: userId,
            ...data
        })
} as const;

export const AuthService = {
    // Generic registration method that handles all user types
    async registerUser<T extends UserRole>(userData: NewUser, role: T, roleSpecificData: RoleSpecificData[T]): Promise<AuthResult> {
        try {
            // Create authentication user
            const session = await signUpUser(userData.email, userData.password);

            if (!session) {//fail
                return {
                    success: false,
                    error: 'Error creating user, or user already exists.'
                };
            }

            //hash pass before saving
            userData.password = hashPassword(userData.password)

            //user form
            const user: User = {
                id: session.user.id,
                ...userData,
                role: role
            };

            // Create user in db
            const createdUser = await UserService.createUser(user);
            
            if (!createdUser) {//fail
                await deleteAuthenUser(session.user.id);
                return {
                    success: false,
                    error: 'Error creating user in database'
                };
            }

            // Create role-specific using the mapping
            let roleRecord: any;
            try {
                roleRecord = await ROLE_CREATORS[role](session.user.id, roleSpecificData as any);
            } catch (error) {
                await deleteAuthenUser(session.user.id);
                await UserService.deleteUser(session.user.id);
                return {
                    success: false,
                    error: `Failed to create ${role} record`
                };
            }

            const userData_complete = { ...createdUser, ...roleRecord };

            return {
                success: true,
                data: {
                    access_token: session.access_token,
                    refresh_token: session.refresh_token,
                    user: userData_complete
                }
            };
        } catch (error) {
            return {
                success: false,
                error: `Internal server error during ${role} registration`
            };
        }
    },
    
    // Convenience methods that accept combined data from req.body
    async registerCustomer(data: NewUser & NewCustomer): Promise<AuthResult> {
        const { email, password, username, profile_picture, ...roleData } = data;
        const userData = { email, password, username, profile_picture };
        return this.registerUser(userData, 'customer', roleData);
    },
    
    async registerShipper(data: NewUser & NewShipper): Promise<AuthResult> {
        const { email, password, username, profile_picture, ...roleData } = data;
        const userData = { email, password, username, profile_picture };
        return this.registerUser(userData, 'shipper', roleData);
    },
    
    async registerVendor(data: NewUser & NewVendor): Promise<AuthResult> {
        const { email, password, username, profile_picture, ...roleData } = data;
        const userData = { email, password, username, profile_picture };
        return this.registerUser(userData, 'vendor', roleData);
    }
};