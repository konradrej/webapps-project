/**
 * Handles type definition for server side session.
 */

import {User} from "../model/user.interface";

// https://stackoverflow.com/a/65696437
declare module 'express-session' {
  interface Session {
    currentUser: User | null
  }
}
