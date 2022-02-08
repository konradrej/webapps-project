import Express from "express";
import { userRouter } from "./router/user.router";
import { postRouter } from "./router/post.router";

export const app : Express.Express = Express();

app.use(Express.json());
app.use("/user", userRouter());
app.use("/post", postRouter());