import {User} from "../model/user.interface";

export interface IUserService {
    findById(id: number): Promise<User | null>

    findByUsername(username: string): Promise<User | null>

    login(username: string, password: string): Promise<User | null>

    register(username: string, password: string, email: string): Promise<User>

    update(user: User, updateObject: IUpdateObject): Promise<boolean>

    setPassword(user: User, password: string): Promise<boolean>
}

interface IUpdateObject {
    email?: string,
    description?: string,
    profileImageUrl?: string
}

export class UserService implements IUserService {
    private users: { [key: number]: User } = {};
    private userIdCounter: number = 0;

    constructor(users: { [key: number]: User }) {
        this.users = users;
        let keys = Object.keys(users);
        this.userIdCounter = parseInt(keys[keys.length - 1]);
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

        // Todo: Change to use password hashing
        if (!user || user.password !== password)
            return null;

        return user;
    }

    // Todo: password hashing
    /**
     * Registers users
     * @param username username
     * @param password password
     * @param email email
     */
    async register(username: string, password: string, email: string): Promise<User> {

        if (!/^[a-zA-Z0-9-_]+$/.test(username))
            throw Error("Username can only contain alphanumeric characters and '-' '_'");

        if (await this.findByUsername(username))
            throw Error("Username must be unique")

        // This email validation must change to something better
        if (!/^\S+@((\S+)\.)?(\S+\.\S+)$/.test(email))
            throw Error("Invalid Email")

        const user: User = {
            id: this.userIdCounter + 1,
            username: username,
            password: password,
            email: email,
            createdAt: new Date,
            posts: [],
            description: "",
            profileImageUrl: ""
        };
        this.users[user.id] = user;

        return user;
    }

    /**
     * More dynamic update function
     * @param user
     * @param obj
     */
    async update(user: User, obj: IUpdateObject): Promise<boolean> {
        let userCopy = Object.assign({}, user)
        const validator: { [prop: string]: RegExp } = {}

        Object.keys(obj).forEach((prop) => {
            let val = obj[prop as keyof IUpdateObject];

            if (val && (!validator[prop] || validator[prop].test(val))) {
                userCopy[prop as keyof IUpdateObject] = val;
            } else {
                throw Error(`${prop} failed validation`)
            }
        })

        if (!this.users[user.id]) return false

        this.users[user.id] = userCopy;
        return true;
    }

    async setPassword(user: User, password: string): Promise<boolean> {
        user.password = password;
        return true;
    }
}