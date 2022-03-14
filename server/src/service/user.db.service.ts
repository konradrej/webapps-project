/**
 * Service to handle user related features such as login,
 * logout, register etc. Works with mongoose and database.
 */

import {User} from "../model/user.interface";
import * as bcrypt from "bcrypt";
import {userModel} from "../db/user.model";
import mongoose from "mongoose";

const SALTROUNDS: number = 5;

export interface IUserService {
  findById(id: number): Promise<User | null>

  findByUsername(username: string): Promise<User | null>

  login(username: string, password: string): Promise<User | null>

  register(username: string, password: string, email: string): Promise<User>

  update(id: number, updateObject: IUpdateObject): Promise<boolean>

  setPassword(id: number, password: string): Promise<boolean>
}

export interface IUpdateObject {
  email?: string,
  description?: string,
  profileImageUrl?: string
}

export class UserService implements IUserService {
  private readonly userModel : mongoose.Model<User>;


  constructor(userModel :  mongoose.Model<User>) {
    this.userModel = userModel;
  }

  async findById(id: number): Promise<User | null> {
    return this.userModel.findOne({id: id}).exec();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({username: username}).exec();
  }

  async login(username: string, password: string): Promise<User | null> {
    const user: User | null = await this.findByUsername(username);

    if (!user || !bcrypt.compareSync(password, user.password))
      return null;

    return user;
  }

  async register(username: string, password: string, email: string): Promise<User> {
    if (await this.findByUsername(username))
      throw Error("Username must be unique")

    return this.userModel.create({
      id: Date.now(),
      username: username,
      password: bcrypt.hashSync(password, SALTROUNDS),
      email: email,
      createdAt: new Date,
      description: "",
      profileImageUrl: ""
    });
  }

  async update(id: number, obj: IUpdateObject): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) return false

    return await this.updateUser(user.id, obj);
  }

  async setPassword(id: number, password: string): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) return false

    user.password = bcrypt.hashSync(password, SALTROUNDS);
    return await this.updateUser(user.id, user);
  }

  private async updateUser(id: number, user: Partial<User>){
    let result = await this.userModel.updateOne({id: id}, user).exec();
    return result.acknowledged;
  }
}

export function makeUserDBService(){
  return new UserService(userModel);
}