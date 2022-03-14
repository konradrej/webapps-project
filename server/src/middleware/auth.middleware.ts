/**
 * Provides middleware to check if user is/is not authenticated.
 */

import Express, { NextFunction } from "express";

export function isLoggedIn(req: Express.Request, res: Express.Response, next: NextFunction) {
  if (req.session.currentUserId) {
    next()
  } else {
    res.status(403).send({ status: "Forbidden", reason: "Not logged in" });
  }
}

export function NotLoggedIn(req: Express.Request, res: Express.Response, next: NextFunction) {
  if (!req.session.currentUserId) {
    next()
  } else {
    res.status(403).send({ status: "Forbidden", reason: "Already logged in" });
  }
}