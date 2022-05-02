/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth
 *
 * Date created      : 13/08/2021
 *
 * Purpose           : Auth related APIs
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
  **********************************************************************
 */

import { successResponse, errorResponse } from "../../utils/response.js";
import { ERROR_MESSAGE, HTTP_STATUS_CODE } from "../../utils/constants.js";
import { logger } from "../../utils/logger.js";
import validator from 'express-validator';
const { validationResult } = validator;
import { CONFIGS } from "../../configs/configExport.js";
const { JWKCONFIG } = CONFIGS;
const { JWSCONFIG } = CONFIGS;
import fs from "fs";
import jose from "node-jose";
import jwt from "jsonwebtoken";
import User from "../../model/user.js";
import { fetchRecord } from "../../services/database/dbCollection.js";
import { compareHash } from "../../utils/crypto.js";
import mongoose from "mongoose";

/**
 * Generate Token
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const generateToken = async (req, res) => {
    try {
        // find existing user detail
        let user = await mongoose.model("user").findOne({ [req.body.data.loginType]: req.body.data.emailOrPhoneNo, isDeleted : false });
        let isValidUserCred = false;
        if(!user){
            logger.error("generateToken: Access Denied: ");
            return res
                .status(HTTP_STATUS_CODE.OK)
                .json(errorResponse('Access Denied', { status : HTTP_STATUS_CODE.UNAUTHORIZED }))
        }
        if(req.body.data?.isPassCodeLogin){
            isValidUserCred = !!await compareHash(req.body.data.password.toString(), user.passCode)
        }else {
            isValidUserCred = !!await compareHash(req.body.data.password, user.password)
        }
        if (!isValidUserCred) {
            logger.error("generateToken: Invalid credentials: ");
            return res
                .status(HTTP_STATUS_CODE.OK)
                .json(errorResponse('Access Denied', { status : HTTP_STATUS_CODE.UNAUTHORIZED }))
        }
        // PREPARE JWK
        let jwkPublicKey;
        let jwkPrivateKey;
        let jwk;
        try {
            jwkPublicKey = fs.readFileSync(JWKCONFIG.PATH + "/public-key.pem", "utf-8");
            jwkPrivateKey = fs.readFileSync(JWKCONFIG.PATH + "/private-key.pem", "utf-8");
            jwk = await jose.JWK.asKey(jwkPrivateKey, "pem");
        } catch (err) {
            logger.error("generateToken: Public and Private Key Value Pair doesn't exist: " + err.message);
            // create directory
            fs.mkdirSync(JWKCONFIG.PATH, { recursive: true });
            // GENERATE KEYS IF THEY DON'T EXIST
            jwk = await jose.JWK.createKey(
                JWKCONFIG.NAME,
                JWKCONFIG.SIZE,
                {
                    alg: JWKCONFIG.ALGORITHM
                }
            );
            jwkPublicKey = jwk.toPEM();
            jwkPrivateKey = jwk.toPEM(true);
            // SAVE KEYS
            fs.writeFileSync(JWKCONFIG.PATH + "/public-key.pem", jwkPublicKey);
            fs.writeFileSync(JWKCONFIG.PATH + "/private-key.pem", jwkPrivateKey);
        }
        // JWE
        const jwe =
            await jose.JWE
                .createEncrypt(jwk)
                .update(JSON.stringify({ [req.body.data.loginType]: req.body.data.loginType === "email" ? user.email : user.contactNo, role: user.role, userId: user._id,
                    deviceToken: req.body.data.deviceToken, loginType : req.body.data.loginType, deviceId: req.body.data?.deviceId, language : user?.settings?.language || 'en' }))
                .final();
        const bufferJwe = await jose.util.asBuffer(JSON.stringify(jwe));
        const encodedJwe = await jose.util.base64url.encode(bufferJwe);

        // PREPARE JWS
        let jws = jwt.sign(
            { encodedJwe },
            jwkPrivateKey,
            {
                expiresIn: JWSCONFIG.EXPIRY_TIME,
                algorithm: JWSCONFIG.SIGN_ALGORITHM
            });

        // SUCCESS
        const data = {
            token: jws,
        }
        return res
            .status(HTTP_STATUS_CODE.OK)
            .json(successResponse("Token Generated", data));
    }
    catch (err) {
        logger.error("generateToken: Something went wrong while generating Token: " + err.message);
        return res
            .status(HTTP_STATUS_CODE.OK)
            .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR, { status : HTTP_STATUS_CODE.INTERNAL_SERVER }))
    }

}

/**
 * Validate Auth token
 *
 * @param {object} request The request object
 * @param {object} response The response object
 * @param {object} next The next object
 **/
export const validateToken = async (request, response, next) => {
    try {
        const token = request.body.headers.auth;

        var decodedToken;
        var jwkPrivateKey;
        if (!token) {
            return response
                .status(HTTP_STATUS_CODE.OK)
                .json(errorResponse(ERROR_MESSAGE.REQUIRE_TOKEN, { status : HTTP_STATUS_CODE.UNAUTHORIZED }))
        }
        // CHECK PRIVATE KEY
        try {
            jwkPrivateKey = fs.readFileSync(JWKCONFIG.PATH + "/private-key.pem", "utf-8");
        } catch (err) {
            logger.error("Error Fetching JWK Private Key in Auth Middleware: " + err.message);
            return response
                .status(HTTP_STATUS_CODE.OK)
                .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR, { status : HTTP_STATUS_CODE.INTERNAL_SERVER }))
        }

        // PREPARE JWK
        const jwk = await jose.JWK.asKey(jwkPrivateKey, "pem");

        // VERIFY TOKEN
        try {
            decodedToken = jwt.verify(
                token,
                jwkPrivateKey,
                {
                    algorithms: JWSCONFIG.SIGN_ALGORITHM
                }
            )
        } catch (err) {
            logger.error("Error Decoding Token in Auth Middleware," +
                " Expired or Wrong Token: " + err.message)
            if (err.message === 'jwt malformed') {
                return response
                    .status(HTTP_STATUS_CODE.OK)
                    .json(errorResponse(ERROR_MESSAGE.INVALID_TOKEN, {status: HTTP_STATUS_CODE.UNAUTHORIZED}))
            }
            return response
                .status(HTTP_STATUS_CODE.OK)
                .json(errorResponse(ERROR_MESSAGE.SESSION_EXPIRED, { status : HTTP_STATUS_CODE.UNAUTHORIZED, sessionExpired : true  }))
        }

        // DECODE & DECRYPT JWE
        const jwe = await jose.util.base64url.decode(decodedToken.encodedJwe);
        const decryptedJwe =
            await jose.JWE
                .createDecrypt(jwk)
                .decrypt(JSON.parse(jwe.toString()));

        let data = JSON.parse(decryptedJwe.plaintext.toString());
        let user = await mongoose.model("user").findOne({ _id: data.userId }, { deviceId : 1, _id : 0 });
        if(data.deviceId && data.deviceId !== user.deviceId){
            return response
                .status(HTTP_STATUS_CODE.OK)
                .json(errorResponse(ERROR_MESSAGE.SESSION_EXPIRED, { status : HTTP_STATUS_CODE.UNAUTHORIZED, sessionExpired : true  }))
        }
        return response
            .status(HTTP_STATUS_CODE.OK)
            .json(successResponse("Token validate successfully", data));
    }
    catch (err) {
        logger.error("User Authentication Error in Authentication Middleware: " + err.message)
        return response
            .status(HTTP_STATUS_CODE.OK)
            .json(errorResponse(ERROR_MESSAGE.GENERIC_AUTHENTICATION_CHECK_ERROR, { status : HTTP_STATUS_CODE.BAD_REQUEST }))
    }
}
