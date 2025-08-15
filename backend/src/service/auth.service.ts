/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

import {deleteAuthenUser} from '../db/db'
import { Router, Request, Response } from 'express';
import { signUpUser } from '../db/db';
import { ErrorJsonResponse, SuccessJsonResponse } from '../utils/json_mes';
import { User, UserService } from './user.service';
import { Customer, CustomerService } from './customer.service';
import { Shipper, ShipperService } from './shipper.service';
import { Vendor, VendorService } from './vendor.service';

//đang bị duplicate code, cần refactor later

export const AuthService = {
    async registerCustomer(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body
                    
            // Validate input
            if (!email || !password) {
                return ErrorJsonResponse(res, 400, 'Email and password are required')
            }
            //try signup
            const session = await signUpUser(email, password)
            
            if (!session) {
                return ErrorJsonResponse(res, 400, 'Error creating user, or user already exists.')
            }
            //how to check for all field need before create the temp_user to add?
            
            const temp_user : User = {
                id: session.user.id,
                email: req.body.email,
                password: req.body.password,
                username: req.body.username,
                profile_picture: req.body.profile_picture,
                role: "customer"
            }

            //create in user table
            const user = await UserService.createUser(temp_user)
            let user_data = null // init

            if(!user){
                //remove user in the authen if cant create the user in the db
                await deleteAuthenUser(session.user.id)
                return ErrorJsonResponse(res, 400, 'Error creating user in db users')
            }

            const temp_customer : Customer = {
                id: session.user.id,
                address: req.body.address,
                name: req.body.name,
            }

            //create in customer table
            const customer = await CustomerService.createCustomer(temp_customer)
            if(!customer){
                //remove created user in authen and in user table
                await deleteAuthenUser(session.user.id)
                await UserService.deleteUser(session.user.id)
                return ErrorJsonResponse(res, 400, "Fail to create customer at db customer")
            }

            user_data = { ...user, ...customer}//get all data of that user
                
            addCookie(res, session)
            return SuccessJsonResponse(res, 200, {
                        data: {
                            access_token: session.access_token,
                            refresh_token: session.refresh_token,
                            user: user_data
                        }
                    })
        } catch (error) {
            return ErrorJsonResponse(res, 500, 'Internal server error')
        }
    },

    async registerShipper(req: Request, res: Response): Promise<Response>{
        try {
            const { email, password } = req.body
                    
            // Validate input
            if (!email || !password) {
                return ErrorJsonResponse(res, 400, 'Email and password are required')
            }
            //try signup
            const session = await signUpUser(email, password)
            
            if (!session) {
                return ErrorJsonResponse(res, 400, 'Error creating user, or user already exists.')
            }
            //how to check for all field need before create the temp_user to add?
            
            const temp_user : User = {
                id: session.user.id,
                email: req.body.email,
                password: req.body.password,
                username: req.body.username,
                profile_picture: req.body.profile_picture,
                role: "shipper"
            }

            //create in user table
            const user = await UserService.createUser(temp_user)
            let user_data = null // init

            if(!user){
                await deleteAuthenUser(session.user.id)
                return ErrorJsonResponse(res, 400, 'Error creating user in db users')
            }

            const temp_shipper : Shipper = {
                id: session.user.id,
                hub_id: req.body.hub_id,
            }

            //create in customer table
            const shipper = await ShipperService.createShipper(temp_shipper)
            if(!shipper){
                await deleteAuthenUser(session.user.id)
                await UserService.deleteUser(session.user.id)
                return ErrorJsonResponse(res, 400, "Fail to create shipper at db shipper")
            }

            user_data = { ...user, ...shipper}//get all data of that user
                
            addCookie(res, session)
            
            return SuccessJsonResponse(res, 200, {
                data: {
                    access_token: session.access_token,
                    refresh_token: session.refresh_token,
                    user: user_data
                }
            })
        } catch (error) {
            return ErrorJsonResponse(res, 500, 'Internal server error')
        }
    },

    async registerVendor(req: Request, res: Response): Promise<Response>{
        try {
            const { email, password } = req.body
            
            // Validate input
            if (!email || !password) {
                return ErrorJsonResponse(res, 400, 'Email and password are required')
            }
            //try signup
            const session = await signUpUser(email, password)
            
            if (!session) {
                return ErrorJsonResponse(res, 400, 'Error creating user, or user already exists.')
            }
            //how to check for all field need before create the temp_user to add?
            
            const temp_user : User = {
                id: session.user.id,
                email: req.body.email,
                password: req.body.password,
                username: req.body.username,
                profile_picture: req.body.profile_picture,
                role: "vendor"
            }
    
            //create in user table
            const user = await UserService.createUser(temp_user)
            let user_data = null // init
    
            if(!user){
                await deleteAuthenUser(session.user.id)
                return ErrorJsonResponse(res, 400, 'Error creating user in db users')
            }
    
            const temp_vendor : Vendor = {
                id: session.user.id,
                business_name: req.body.business_name,
                business_address: req.body.business_address
            }
    
            //create in customer table
            const vendor = await VendorService.createVendor(temp_vendor)
            if(!vendor){
                await deleteAuthenUser(session.user.id)
                await UserService.deleteUser(session.user.id)
                return ErrorJsonResponse(res, 400, "Fail to create vendor at db vendor")
            }
    
            user_data = { ...user, ...vendor}//get all data of that user
                
            //add cookie
            addCookie(res, session)
            
            return SuccessJsonResponse(res, 200, {
                data: {
                    access_token: session.access_token,
                    refresh_token: session.refresh_token,
                    user: user_data
                }
            })
            
        } catch (error) {
            return ErrorJsonResponse(res, 500, 'Internal server error')
        }
    }
}

//for adding of all cookies when signUp or signIn
function addCookie(res : Response, session : any){
    res.cookie('access_token', session.access_token, {
            httpOnly: true,
            secure: process.env.PRODUCTION_SITE === 'true', // http or https
            path: '/',
    })
    
    res.cookie('refresh_token', session.refresh_token, {
        httpOnly: true,
        secure: process.env.PRODUCTION_SITE === 'true', // http or https
        path: '/',
    })
}