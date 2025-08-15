/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

//using to check if the req.body has any unknown field
type RequestBody = {
    [key: string]: any;
};

export function hasUnknownFields(allowedFields: string[], reqBody: RequestBody): boolean {
    const allowedFieldsSet = new Set(allowedFields);

    for (const key in reqBody) {
        if (Object.prototype.hasOwnProperty.call(reqBody, key)) {
            if (!allowedFieldsSet.has(key)) {
                return true; // Found an unknown field, so return true immediately
            }
        }
    }
    
    return false; // No unknown fields were found
}