/**********************************************************************
 * Changelog                                        
 * All notable changes to this project will be documented in this file.    
 **********************************************************************
 *
 * Author            : Parth
 *
 * Date created      : 11/08/2021
 *
 * Purpose           : Auth related APIs
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality 
 * 
  **********************************************************************
 */

import express from "express";
var router = express.Router();
import { errorResponse } from "../../../utils/response.js";
import { ERROR_MESSAGE, HTTP_STATUS_CODE } from "../../../utils/constants.js";
import { generateToken, validateToken } from "../../../controllers/v1/auth.js";

/**
 *  Generate Auth Token
 */
router.route("/generateToken")
    .post(generateToken)
    .all((req, res) => {
        return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOW).json(errorResponse(ERROR_MESSAGE.METHOD_NOT_ALLOWED))
    });

/**
 *  Validate Auth Token
 */
router.route("/validateToken")
    .post(validateToken)
    .all((req, res) => {
        return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOW).json(errorResponse(ERROR_MESSAGE.METHOD_NOT_ALLOWED))
    });

export default router;
