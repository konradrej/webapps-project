import Express from "express";
import cors from "cors";
import { userRouter } from "./router/user.router";
import { postRouter } from "./router/post.router";
import path from "path";
import session from "express-session";

export const app : Express.Express = Express();

app.use(Express.static(path.join(__dirname, "../../client/build")));

app.use(session({
  secret: 'random-secret-here', // Secret should be a env var
  cookie: {
    httpOnly: true,
    sameSite: "strict"
  }
}))

app.get("/", (req : Express.Request, res : Express.Response) => {
  res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
})

app.use(Express.json());
app.use(cors());
app.use("/user", userRouter());
app.use("/post", postRouter());

