/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth Mehta
 *
 * Date created      : 11/08/2021
 *
 * Purpose           : export the config files for PROD enviornment
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
 **********************************************************************
 */

export { default as CRYPTOCONFIG } from "../prod/crypto.js";
export { default as TLSCONFIG } from "../prod/tls.js";
export { default as JWKCONFIG } from "../prod/jwk.js";
export { default as JWSCONFIG } from "../prod/jws.js";
export { default as JWTCONFIG } from "../prod/jwt.js";
export { default as LOGCONFIG } from "../prod/logger.js";
export { default as SERVERCONFIG } from "../prod/server.js";
export { default as DBCONFIG } from "../prod/database.js";