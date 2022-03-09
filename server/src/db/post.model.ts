import { Schema } from "mongoose";
import { Post } from "../model/post.interface";
import { conn } from "./conn";

export const PostSchema : Schema = new Schema({
  id : {
    type : Number,
    required : true,
    unique : true,
  },
  title : {
    type : String,
    required : true,
  },
  description : {
    type : String,
  },
  imageUrl : {
    type : String,
    required : true,
  },
  creator : {
    type : Number,
    required : true
  }
}, {
  timestamps: true
})

export const postModel = conn.model<Post>("Post", PostSchema)