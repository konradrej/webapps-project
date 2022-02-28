import Express from "express";
import cors from "cors";
import "reflect-metadata";

import {makeUserRouter} from "./router/user.router";
import {makePostRouter} from "./router/post.router";

import path from "path";
import session from "express-session";

export const app: Express.Express = Express();

app.use(Express.static(path.join(__dirname, "../../client/build")));

app.use(session({
  secret: 'random-secret-here', // Secret should be a env var
  cookie: {
    httpOnly: true,
    sameSite: "strict",
  }
}))

app.get("/", (req: Express.Request, res: Express.Response) => {
  res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
})

app.use(Express.json());
app.use(cors(process.env?.TS_NODE_DEV ? {
  "origin": "http://localhost:3000",
  "credentials": true,
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
} : {}));

app.use("/user", makeUserRouter());
app.use("/post", makePostRouter());

