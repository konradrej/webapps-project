import { User } from "../model/user.interface";

export class UserService {
  // userlist
  private const users : { [key : number] : User } = {};

  // login
  const login = async (username : string, password : string) : Promise<boolean> => {
    const user : User = Object.values(users).find( (user: User) => user.username === username);

    if(! user) return false;

    return user.password === password;
  }

  // TODO VALIDATION
  // register (createUser)
  const register = async (username: string, password: string, email: string) : Promise<User> => {
    const user : User = new User();

    user.id = users.length + 1;
    user.username = username;
    user.password = password;
    user.email = email;
    user.createdAt = Date.now();

    users[user.id] = user;

    return user;
  }

  // TODO VALIDATION
  // set password
  const updatePassword = async (id : number, password : string) : Promise<boolean> => {
    const user : User = users[id];

    if(! user) return false;

    user.password = password;
    users[id] = user;

    return true;
  }

  // TODO VALIDATION
  // set email
  const updateEmail = async (id : number, email : string) : Promise<boolean> => {
    const user : User = users[id];

    if(! user) return false;

    user.email = email;
    users[id] = user;

    return true;
  }

  // TODO VALIDATION
  // set description
  const updateDescription = async (id : number, description : string) : Promise<boolean> => {
    const user : User = users[id];

    if(! user) return false;

    user.description = description;
    users[id] = user;

    return true;
  }


// TODO LATER
// set profile picture
/*
  const updateProfilePicture = async (id : number) : Promise<boolean> => {
    const user : User = users[id];

    if(! user) return false;

    user.profileImageUrl =
  }*/
}