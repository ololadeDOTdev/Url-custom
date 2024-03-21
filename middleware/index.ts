import { User, IUser } from "../models/users";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Document, Types } from "mongoose";
import { Link } from "../models/links";
import { LinkClickHistory } from "../models/linkClickHistory";

interface AuthRequest extends Request {
  user?: Document<unknown, unknown, IUser> &
    IUser & {
      _id: Types.ObjectId;
    };
  userId?: string;
}

async function userMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = (req.headers["authorization"] || "").replace("Bearer ", "");

    if (!token) {
      return res.status(400).send({ message: "No token was provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      last_login: string;
    };

    const user = await User.findById(decoded.userId).select("-password -_id");
    if (!user) {
      return res.status(400).send({ message: "This is an invalid token" });
    }

    req.user = user;
    req.userId = decoded.userId;
    next();
  } catch (err: unknown) {
    console.log((err as Error).message);
    res.status(400).send({ message: "Something is wrong" });
  }
}

async function rerouteMiddleware(req: Request, res: Response) {
  try {
    const { shortened } = req.params;
    const { referer } = req.headers;

    const link = await Link.findOne({ shortenedLink: shortened });
    if (!link) {
      return res.status(404).send("<h1>Page not found</h1>");
    }

    res.redirect("http://" + link.fullLink);

    link.clickCount++;
    link.save();

    LinkClickHistory.create({
      linkId: link._id,
      referrer: referer,
    });
  } catch (err: unknown) {
    console.log((err as Error).message);
    res.status(400).send({ message: "Something went wrong" });
  }
}
export { userMiddleware, AuthRequest, rerouteMiddleware };
