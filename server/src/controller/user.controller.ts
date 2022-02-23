export class UserController {
  static validateSignup = async (username: string, password: string, email: string): Promise<void> => {
    if (!/^[a-zA-Z0-9-_]+$/.test(username))
      throw Error("Username can only contain alphanumeric characters and '-' '_'");

    // This email validation must change to something better
    if (!/^\S+@((\S+)\.)?(\S+\.\S+)$/.test(email))
      throw Error("Invalid Email")
  }
}
