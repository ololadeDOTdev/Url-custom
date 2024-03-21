"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middleware_1 = require("../middleware");
const links_1 = require("../models/links");
const linkClickHistory_1 = require("../models/linkClickHistory");
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const linksRouter = (0, express_1.Router)();
linksRouter.post("/create", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { shortenedLink, fullLink } = req.body;
        if (!fullLink) {
            return res.status(422).send({ message: "The data is incomplete" });
        }
        const link = yield links_1.Link.create({
            userId,
            fullLink,
            shortenedLink,
        });
        res.status(201).send({
            message: "Link created successfully",
            data: link,
        });
    }
    catch (err) {
        res.status(400).send({
            message: "Something went wronf",
        });
    }
}));
linksRouter.get("/all", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const links = yield links_1.Link.find({ userId: req.userId }).select("-userId");
        res.status(200).send({
            message: "Link fetched successfully",
            data: links,
        });
    }
    catch (err) {
        res.status(400).send({
            message: "Something went wrong",
        });
    }
}));
linksRouter.get("/aggregate/:id", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const link = yield links_1.Link.findById(id);
        if (!link) {
            return res.status(404).send({
                message: "Link not found",
            });
        }
        const historyAggregated = yield linkClickHistory_1.LinkClickHistory.aggregate([
            {
                $match: {
                    linkId: new mongoose_1.default.Types.ObjectId(id),
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
            data: { historyAggregated, link },
        });
    }
    catch (err) {
        res.status(400).send({
            message: "Something went wrong",
        });
    }
}));
exports.default = linksRouter;
