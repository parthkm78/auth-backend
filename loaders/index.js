/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 12/08/2021
 *
 * Purpose           : Load all loaders
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
 **********************************************************************
 */

import expressLoader from "./express.js";
import mongooseLoader from "./mongoose.js";
import { logger } from "../utils/logger.js"
/**
 *  Load all loaders
 */
export default async () => {
    // mongodb
    const mongoConnection = await mongooseLoader();
    logger.info('MongoDB Initialized');
    // Express
    await expressLoader();
    logger.info('Express Initialized');
}