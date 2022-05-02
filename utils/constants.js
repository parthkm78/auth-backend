/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author			      : Part Mehta
 *
 * Date created		      : 29/07/2021
 *
 * Purpose			      : Define Constant
 *
 * Revision History	:
 *
 * Date			    Author			Jira			  Functionality
 *
 *********************************************************************
*/

// CONSTANTS
export const HEADER_KEY_TOKEN = "auth"

// ERROR MESSAGE CONSTANTS
export const ERROR_MESSAGE = {
    USERNAME_PASSWORD_INCORRECT: "Username or Password is Incorrect",
    REQUIRED_PARAMETERS_MISSING: "REQUIRED PARAMETERS ARE MISSING",
    INTERNAL_SERVER_ERROR: "Internal server error",
    USER_NOT_EXISTS: "User not exist",
    USER_ALREADY_EXISTS: "User already exists",
    SESSION_EXPIRED: "Session Expired",
    REQUIRE_TOKEN: "No token available, authorization denied!",
    INVALID_TOKEN: "Invalid Token, authorization denied",
    UNPROCESSABLE_ENTITY: "UNPROCESSABLE ENTITY",
    METHOD_NOT_ALLOWED: "Method Not Allowed",
    GENERIC_AUTHENTICATION_CHECK_ERROR: "Failed to Complete the Authentication Check",
}

// HTTP STATUS CODES
export const HTTP_STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    UNPROCESSABLE_ENTITY: 422,
    METHOD_NOT_ALLOW: 405,
    CONFLICT: 409,
    INTERNAL_SERVER: 500,
}
