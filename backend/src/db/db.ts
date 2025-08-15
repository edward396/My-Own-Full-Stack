/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

//if needed for Json
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json }
    | Json[]

// ----- Database schema -----
// Define schema once so all CRUD calls infer Row/Insert/Update types automatically
// so later if create new table, could use this for easier coding
// how db right now looks like
export interface Database {
    public: {
        Tables: {
            users: {
                // .select() for table 'users'
                Row: {
                    id: string // using uuid to create this
                    email: string // for login using authen of supabase
                    password: string
                    username: string
                    profile_picture: string
                    role: string
                }
                // .insert() for table 'users'
                Insert: {
                    id: string // using uuid to create this
                    email: string // for login using authen of supabase
                    password: string
                    username: string
                    profile_picture: string
                    role: string
                }
                // .update() in table 'users'
                Update: {
                    password: string
                    profile_picture: string                    
                }
            }

            distribution_hubs: {
                Row: {
                    id: string 
                    name: string
                    address: string
                }
                Insert: {
                    id: string 
                    name: string
                    address: string
                }
                Update: {
                    name: string
                    address: string
                }
            }

            vendors: {
                Row: {
                    id: string // from users id
                    business_name: string
                    business_address: string
                }
                Insert: {
                    id: string // from users id
                    businessname: string
                    business_address: string
                }
                Update: {
                    businessname: string
                    business_address: string
                }
            }

            customers: {
                Row: {
                    id: string // from users id
                    address: string
                    name: string
                }
                Insert: {
                    id: string // from users id
                    address: string
                    name: string
                }
                Update: {
                    address: string
                    name: string
                }
            }

            shippers: {
                Row: {
                    id: string // from users id
                    hub_id: string
                }
                Insert: {
                    id: string // from users id
                    hub_id: string
                }
                Update: {
                    hub_id: string
                }
            }

            products: {
                Row: {
                    id: string 
                    vendor_id: string // from vendor->id
                    name: string
                    price: number
                    description: string
                    image: string
                    category: string
                    instock: boolean
                }
                Insert: {
                    id: string 
                    vendor_id: string // from vendor->id
                    name: string
                    price: number
                    description: string
                    image: string
                    category: string
                    instock: boolean
                }
                Update: {
                    name: string
                    price: number
                    description: string
                    image: string
                    category: string
                    instock: boolean
                }
            }

            shopping_cart: { // this will store for not items not bought and in cart
                Row: {
                    id: string
                    customer_id: string // from customer
                    product_id: string // from product
                    quantity: number
                }
                Insert: {
                    id: string
                    customer_id: string // from customer
                    product_id: string // from product
                    quantity: number
                }
                Update: {
                    quantity: number
                }
            }

            orders: {
                Row: {
                    id: string 
                    customer_id: string
                    hub_id: string
                    status: string
                    total_price: number
                }
                Insert: {
                    id: string 
                    customer_id: string
                    hub_id: string
                    status: string
                    total_price: number
                }
                Update: {
                    status: string
                }
            }

            order_items: {
                Row: {
                    id: string
                    order_id: string
                    product_id: string
                    quantity: string
                    price_at_order_time: number
                }
                Insert: {
                    id: string
                    order_id: string
                    product_id: string
                    quantity: string
                    price_at_order_time: number
                }
                Update: { // might not be used since order has been made, cant change items
                    id: string
                    order_id: string
                    product_id: string
                    quantity: string
                    price_at_order_time: number
                }
            }
        }
        Views: {}
        Functions: {}
        Enums: {}
    }
}

import dotenv from 'dotenv'
dotenv.config()

// Client
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SECRET_KEY!
const supabaseClientKey = process.env.VITE_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey || !supabaseClientKey) {
    console.error('Supabase URL or Anon Key or Secret Key is missing from environment variables!')
}

//this is for login through auth
export const supabaseClient: SupabaseClient<Database> = createClient<Database>(
    supabaseUrl,
    supabaseClientKey
)

//this is for querying database
export const supabase: SupabaseClient<Database> = createClient<Database>(
    supabaseUrl,
    supabaseKey
)

export async function signInUser(email: string, password: string):
    Promise<null | { user: any; access_token: string; refresh_token: string }> {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error('Error signing in:', error.message)
        return null
    }
    return data.session
}

export async function signUpUser(email: string, password: string):
    Promise<null | { user: any; access_token: string; refresh_token: string }> {
    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
    });

    if (error) {
        console.error('Error signing up:', error.message);
        return null;
    }

    return data.session;
}

//for delete user in authentication table
export async function deleteAuthenUser(userId: string) {
  try {
    const { data, error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.error('Error deleting user:', error.message);
      return { success: false, message: error.message };
    }

    console.log('User deleted successfully:', data);
    return { success: true, data };
  } catch (err) {
    console.error('An unexpected error occurred:', err);
    return { success: false, message: 'An unexpected error occurred' };
  }
}

export async function changePassword(newPassword: string): Promise<boolean> {
    const { error } = await supabaseClient.auth.updateUser({
        password: newPassword,
    });

    if (error) {
        console.error('Error changing password:', error.message);
        return false;
    }

    return true;
}

export async function uploadImage(file: File, userId: string): Promise<string | null> {
    const filePath = `${userId}/${Date.now()}-${file.name}`

    const { data, error } = await supabase.storage
        .from('images') // bucket name
        .upload(filePath, file)

    if (error) {
        console.error('Error uploading image:', error.message)
        return null
    }

    return filePath // store this in users.profile_picture or products.image
}

export function getPublicImageUrl(filePath: string): string {
    const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

    return data.publicUrl
}

export async function deleteImage(filePath: string): Promise<boolean> {
    const { error } = await supabase.storage
        .from('images')
        .remove([filePath])

    if (error) {
        console.error('Error deleting image:', error.message)
        return false
    }

    return true
}
