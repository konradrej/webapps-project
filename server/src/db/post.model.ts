import { Schema, Model } from "mongoose";
import { Post } from "../model/post.interface";
import { conn } from "./conn";

const PostSchema : Schema = new Schema({
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
  createdAt : {
    type : Date,
    required : true,
  },
  modifiedAt : {
    type : Date,
  },
  creator : {
    type : Number,
    required : true
  }
})

export const postModel = conn.model<Post>("Post", PostSchema)