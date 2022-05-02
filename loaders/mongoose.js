/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 12/08/2021
 *
 * Purpose           : mongoose loader
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
 **********************************************************************
 */

import mongoose from "mongoose";
import { CONFIGS } from "../configs/configExport.js";
const { DBCONFIG } = CONFIGS;

/**
 *  Initialize mongodb 
 */
export default async () => {
    const mongoUri = "mongodb://" +
        DBCONFIG.HOST + ":" +
        DBCONFIG.PORT + "/" +
        DBCONFIG.AUTH_DB_NAME;
    // Connect MongoDB
    const connection = await mongoose.connect(mongoUri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
    global['mongoConn'] = connection.connection;
    return connection.connection.db;
}