import Express, {NextFunction} from "express";

export function isLoggedIn(req: Express.Request, res: Express.Response, next : NextFunction) {
  if(req.session.currentUser){
    next()
  }else{
    res.status(403).send();
  }
}

export function NotLoggedIn(req: Express.Request, res: Express.Response, next : NextFunction) {
  if(!req.session.currentUser){
    next()
  }else{
    res.status(403).send();
  }
}