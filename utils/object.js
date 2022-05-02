
/**********************************************************************
 * Changelog                                        
 * All notable changes to this project will be documented in this file.    
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 29/07/2021
 *
 * Purpose           : User collection operations Utilities
 *
 * Revision History  :
 *
 * Date            Author            Jira          Functionality 
 **********************************************************************
 */

// IMPORTS
import { createHashVal } from "./crypto.js";
import { CONFIGS } from "../configs/configExport.js";
const { SERVERCONFIG } = CONFIGS;

/**
 * Configure User object for insertion 
 * @param {*} req - request object
 * @returns 
 */
export const insertUserObj = async (req) => {
    return {
        accountType: req.body.accountType,
        userName: req.body.userName,
        email: req.body.email,
        password: await createHashVal(req.body.password),
        country: req.body.country,
        contactNo: req.body.contactNo,
        companyName: req.body.companyName
    };
}

/**
 * Configure Token object for insertion 
 * @param {*} userId - id of User 
 * @param {*} hashToken - token in hash format 
 * @returns 
 */
export const insertTokenObj = (userId, hashToken) => {
    return {
        _userId: userId,
        token: hashToken
    };
}

/**
 * Configure Verification link 
 * @param {*} userId - id of User 
 * @param {*} verificationToken - token in hash format 
 * @returns 
 */
export const configureVerificationLink = (userId, verificationToken) => {
    return SERVERCONFIG.url + "user/" + userId + "/verifyEmail/" + verificationToken;
}

/**
 * Configure Forget password link 
 * @param {*} userId - id of User 
 * @param {*} verificationToken - token in hash format 
 * @returns 
 */
export const configureForgetPasswordLink = (userId, verificationToken) => {
    return SERVERCONFIG.url + "user/" + userId + "/forgetPassword/" + verificationToken;
}

/**
 * Configure new password 
 * @param {*} exobj - id of User 
 * @param {*} password - token in hash format 
 * @returns 
 */
export const updatePasswordObj = async (exObj, password) => {
    let hashPass = await createHashVal(password);
    let obj = {
        password: hashPass,
    }
    return obj;
}

/**
 * Configure update loginAttempts object
 * @param {*} exobj - id of User 
 * @param {*} loginAttempts - count of invalid login
 * @returns 
 */
export const updatloginAttempts = async (exObj, loginAttempts) => {
    let obj = {
        loginAttempts: loginAttempts,
    }
    return obj;
}

/**
 * Successful login object
 * @param {*} exObj 
 * @returns 
 */
export const successfulLogin = async (exObj) => {
    let obj = {
        userName: exObj.userName,
        companyName: exObj.companyName,
        email: exObj.email,
        contactNo: exObj.contactNo,
        country: exObj.country,
        accountType: exObj.accountType
    }
    return obj;
}
/**
 * lock account date time
 * @param {*} recentDate 
 * @returns 
 */
export const lockDate = async (currentDate, loginAttempt) => {
    let obj = {
        lockUntil: currentDate,
        loginAttempts: loginAttempt
    }
    return obj;
}