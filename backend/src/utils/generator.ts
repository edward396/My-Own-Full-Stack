/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

//this file could be group of generator of different thing, right now only UUID, if no more function created, will rename to UUIDgenerator.ts instead
import { v4 as uuidv4 } from 'uuid';

export default function generateUUID(): string {
  return uuidv4();// Example output: "20443f8f-e508-4d64-b702-b98aa04c12a0"
}