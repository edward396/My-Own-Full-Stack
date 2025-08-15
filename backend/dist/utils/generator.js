"use strict";
/* RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Truong Ba An
# ID: s3999568 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateUUID;
//this file could be group of generator of different thing, right now only UUID, if no more function created, will rename to UUIDgenerator.ts instead
const uuid_1 = require("uuid");
function generateUUID() {
    return (0, uuid_1.v4)(); // Example output: "20443f8f-e508-4d64-b702-b98aa04c12a0"
}
