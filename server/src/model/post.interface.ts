import {User} from "../model/user.interface";

export interface Post {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  modifiedAt: Date;
  creator: User;
}