import { Router } from "express";
import { User } from "../models/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRequest, userMiddleware } from "../middleware";

const userRouter = Router();

userRouter.post("/create", async (req, res) => {
  try {
    const userData = {
      ...req.body,
      password: bcrypt.hashSync(req.body.password, 10),
    };
    const user = await User.create(userData);
    console.log(user);
    res.status(201).send({
      message: "The user was created successfully",
    });
  } catch (err: unknown) {
    console.log((err as Error).message);
    res.status(400).send({
      message: "Something wrong happened",
    });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw Error("Name and password must extst");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw Error("User does not exist");
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw Error("The password is wrong");
    }

    user.lastLogin = new Date();

    const token = jwt.sign(
      {
        userId: user._id,
        last_login: user.lastLogin.toISOString(),
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    user.save();

    res.status(200).send({
      message: "User Logged in successfully",
      accessToken: token,
      data: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err: unknown) {
    console.log((err as Error).message);
    res.status(400).send({
      message: "Something wrong happened",
    });
  }
});

userRouter.get("/info", userMiddleware, (req: AuthRequest, res) => {
  try {
    res.status(200).send({
      message: "Successful",
      data: req.user,
    });
  } catch (err: unknown) {
    console.log((err as Error).message);
    res.status(400).send({
      message: "Something wrong happened",
    });
  }
});
export default userRouter;
