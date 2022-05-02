/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Parth
 *
 * Date created      : 29/07/2021
 *
 * Purpose           : User Collection
 *
 * Revision History  :
 *
 * Date            Author            Jira            Functionality
 *
  **********************************************************************
 * 04/08/2021     Parth              CG-
 */

// IMPORTS
import mongoose from "mongoose";

var userSchema = new mongoose.Schema({
  userName: { type: String, required: false },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  isVerified: { type: Boolean, default: false },
  deviceId: { type: String },
  signUpType: { type: String, enum: ['MOBILE', 'EMAIL'] },
  isEmailVerified:  { type: Boolean, default: false },
  isMobileVerified:  { type: Boolean, default: false },
  settings: {
    notification: {
      isNotice: { type: Boolean, default: true },
      isNews: { type: Boolean, default: true },
      isWork: { type: Boolean, default: true },
      isLikeFollowComment: { type: Boolean, default: true },
      isAssetChange: { type: Boolean, default: true }
    },
    language: { type: String, default: "en" },
    currency: { type: String, default: "usd" },
    twoFactorEnabled: { type: Boolean, default: false },
    isPassCodeEnabled: { type: Boolean, default: false },
  },
  password: { type: String, required: true },
  passCode: { type: String, required: false },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Date },
  country: { type: String },
  contactNo: { type: String },
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
});

//Exporting User Model
const User = mongoose.model("user", userSchema);
export default User;
