/**
 * Provides User definition for mongoose and couples
 * the schema with the User model.
 */

import mongoose from "mongoose";
import {conn} from "./conn";
import {User} from "../model/user.interface";

export const UserSchema: mongoose.Schema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  profileImageUrl: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

export const userModel = conn.model<User>("User", UserSchema)
