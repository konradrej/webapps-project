import {User} from "../model/user.interface";
import * as bcrypt from "bcrypt";
import {Lifecycle, registry} from "tsyringe";

const SALTROUNDS: number = 5;

export interface UserSelf extends Omit<User, "password"> {
}

export interface SafeUser extends Omit<UserSelf, "email"> {
}


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

@registry([{
  token: "UserService",
  useClass: UserService,
  options: {lifecycle: Lifecycle.Singleton} // Tsyringe has problem with default parameter, registering singleton without injectable
}])
export class UserService implements IUserService {
  private users: { [key: number]: User } = {};
  private userIdCounter: number = 0;

  constructor(users: { [key: number]: User } = {}) {
    this.users = users;
    let keys = Object.keys(users);
    if (keys.length > 0)
      this.userIdCounter = parseInt(keys[keys.length - 1]) ?? 0;
  }

  /**
   * Find user with specified id
   * @param id
   */
  async findById(id: number): Promise<User | null> {
    return this.users[id] ?? null;
  }

  /**
   * Find user with specified username
   * @param username
   */
  async findByUsername(username: string): Promise<User | null> {
    return Object.values(this.users).find((user: User) => user.username === username) ?? null
  }

  /**
   * Login as user
   * @param username username
   * @param password user's password
   * @return user logged in user or if it fails null
   */
  async login(username: string, password: string): Promise<User | null> {
    const user: User | null = await this.findByUsername(username);

    if (!user || !bcrypt.compareSync(password, user.password))
      return null;

    return user;
  }

  /**
   * Registers users
   * @param username username
   * @param password password
   * @param email email
   */
  async register(username: string, password: string, email: string): Promise<User> {
    /* Todo: Remove this check */
    if (await this.findByUsername(username))
      throw Error("Username must be unique")

    const user: User = {
      id: ++this.userIdCounter,
      username: username,
      password: bcrypt.hashSync(password, SALTROUNDS),
      email: email,
      createdAt: new Date,
      description: "",
      profileImageUrl: ""
    };
    this.users[user.id] = user;

    return user;
  }

  /**
   * More dynamic update function
   * @param id
   * @param obj
   */
  async update(id: number, obj: IUpdateObject): Promise<boolean> {
    const user = this.users[id];
    if (!user) return false

    let userCopy = Object.assign({}, user)
    Object.keys(obj).forEach((prop) => {
      let val = obj[prop as keyof IUpdateObject];

      if (val) {
        userCopy[prop as keyof IUpdateObject] = val;
      }
    })

    this.users[user.id] = userCopy;
    return true;
  }

  async setPassword(id: number, password: string): Promise<boolean> {
    const user = this.users[id];
    if (!user) return false

    user.password = bcrypt.hashSync(password, SALTROUNDS);
    return true;
  }
}