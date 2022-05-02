/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 12/08/2021
 *
 * Purpose           : Express loader
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
 **********************************************************************
 */

import { logger } from "../utils/logger.js";
import authRoute from "../routes/api/v1/auth.js";
import cors from "cors";
import express from "express";
import { CONFIGS } from "../configs/configExport.js";
const { SERVERCONFIG } = CONFIGS;

/**
 *  Initialize https 
 */
export default async () => {
    const app = express();
    // Certificate
    const options = {
        rejectUnauthorized: false
    };

    // app.use(helmet());
    app.use(express.json());
    app.use(cors());
    //Define the API Routes
    app.use('/auth', authRoute);
    app.listen(SERVERCONFIG.port, () => {
        logger.info(`App listening at ` + SERVERCONFIG.url)
    })
}