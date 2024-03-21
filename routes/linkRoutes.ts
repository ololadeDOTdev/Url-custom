import { AuthRequest, userMiddleware } from "../middleware";
import { Link } from "../models/links";
import { LinkClickHistory } from "../models/linkClickHistory";
import { Router } from "express";
import mongoose from "mongoose";

const linksRouter = Router();

linksRouter.post("/create", userMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const { shortenedLink, fullLink } = req.body;

    if (!fullLink) {
      return res.status(422).send({ message: "The data is incomplete" });
    }
    const link = await Link.create({
      userId,
      fullLink,
      shortenedLink,
    });

    res.status(201).send({
      message: "Link created successfully",
      data: link,
    });
  } catch (err: unknown) {
    res.status(400).send({
      message: "Something went wronf",
    });
  }
});

linksRouter.get("/all", userMiddleware, async (req: AuthRequest, res) => {
  try {
    const links = await Link.find({ userId: req.userId }).select("-userId");
    res.status(200).send({
      message: "Link fetched successfully",
      data: links,
    });
  } catch (err: unknown) {
    res.status(400).send({
      message: "Something went wrong",
    });
  }
});

linksRouter.get(
  "/aggregate/:id",
  userMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const link = await Link.findById(id)
      if (!link) {
        return res.status(404).send({
          message: "Link not found",
        });
      }

      const historyAggregated = await LinkClickHistory.aggregate([
        {
          $match: {
            linkId: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $group: {
            _id: "$referrer",
            count: {
              $count: {},
            },
          },
        },
      ]);
      res.status(200).send({
        message: "Link fetched successfully",
        data: {historyAggregated, link},
      });
    } catch (err: unknown) {
      res.status(400).send({
        message: "Something went wrong",
      });
    }
  }
);

export default linksRouter;
