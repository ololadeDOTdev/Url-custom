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
exports.rerouteMiddleware = exports.userMiddleware = void 0;
const users_1 = require("../models/users");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const links_1 = require("../models/links");
const linkClickHistory_1 = require("../models/linkClickHistory");
function userMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = (req.headers["authorization"] || "").replace("Bearer ", "");
            if (!token) {
                return res.status(400).send({ message: "No token was provided" });
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = yield users_1.User.findById(decoded.userId).select("-password -_id");
            if (!user) {
                return res.status(400).send({ message: "This is an invalid token" });
            }
            req.user = user;
            req.userId = decoded.userId;
            next();
        }
        catch (err) {
            console.log(err.message);
            res.status(400).send({ message: "Something is wrong" });
        }
    });
}
exports.userMiddleware = userMiddleware;
function rerouteMiddleware(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { shortened } = req.params;
            const { referer } = req.headers;
            const link = yield links_1.Link.findOne({ shortenedLink: shortened });
            if (!link) {
                return res.status(404).send("<h1>Page not found</h1>");
            }
            res.redirect("http://" + link.fullLink);
            link.clickCount++;
            link.save();
            linkClickHistory_1.LinkClickHistory.create({
                linkId: link._id,
                referrer: referer,
            });
        }
        catch (err) {
            console.log(err.message);
            res.status(400).send({ message: "Something went wrong" });
        }
    });
}
exports.rerouteMiddleware = rerouteMiddleware;
