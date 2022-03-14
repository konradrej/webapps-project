/**
 * Handles type definition for server side session.
 */

// https://stackoverflow.com/a/65696437
export declare module 'express-session' {
  interface Session {
    currentUserId: number | null
  }
}