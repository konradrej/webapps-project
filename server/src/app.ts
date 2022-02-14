import Express from "express";
import cors from "cors";
import { userRouter } from "./router/user.router";
import { postRouter } from "./router/post.router";
import path from "path";

export const app : Express.Express = Express();

app.use(Express.static(path.join(__dirname, "../../client/build")));

app.get("/", (req : Express.Request, res : Express.Response) => {
  res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
})

app.use(Express.json());
app.use(cors());
app.use("/user", userRouter());
app.use("/post", postRouter());