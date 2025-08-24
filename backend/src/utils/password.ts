/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

import * as bcrypt from 'bcrypt';

const saltRounds = 10;

export function comparePassword(password: string, hash: string): boolean {
    try {
        const isMatch = bcrypt.compareSync(password, hash);
        return isMatch;
    } catch (error) {
        console.error("Error comparing password:", error);
        throw error;
    }
}

export function hashPassword(password: string): string {
    try {
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error;
    }
}