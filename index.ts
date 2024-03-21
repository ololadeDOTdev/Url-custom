import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRouter from "./routes/userRoutes";
import dotenv from "dotenv";
import linksRouter from "./routes/linkRoutes";
import { rerouteMiddleware } from "./middleware";
import cors from "cors";

dotenv.config();

mongoose
  .connect("mongodb://127.0.0.1:27017/url-custom")
  .then(() => console.log("Connected successfully"));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors());

app.use("/user", userRouter);
app.use("/link", linksRouter);
app.use("/:shortened", rerouteMiddleware);

app.listen(4000, () => {
  console.log("The app has started");
});
