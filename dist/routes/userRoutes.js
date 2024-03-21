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
const express_1 = require("express");
const users_1 = require("../models/users");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware_1 = require("../middleware");
const userRouter = (0, express_1.Router)();
userRouter.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = Object.assign(Object.assign({}, req.body), { password: bcrypt_1.default.hashSync(req.body.password, 10) });
        const user = yield users_1.User.create(userData);
        console.log(user);
        res.status(201).send({
            message: "The user was created successfully",
        });
    }
    catch (err) {
        console.log(err.message);
        res.status(400).send({
            message: "Something wrong happened",
        });
    }
}));
userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw Error("Name and password must extst");
        }
        const user = yield users_1.User.findOne({ email });
        if (!user) {
            throw Error("User does not exist");
        }
        if (!bcrypt_1.default.compareSync(password, user.password)) {
            throw Error("The password is wrong");
        }
        user.lastLogin = new Date();
        const token = jsonwebtoken_1.default.sign({
            userId: user._id,
            last_login: user.lastLogin.toISOString(),
        }, process.env.JWT_SECRET, { expiresIn: "1h" });
        user.save();
        res.status(200).send({
            message: "User Logged in successfully",
            accessToken: token,
            data: {
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (err) {
        console.log(err.message);
        res.status(400).send({
            message: "Something wrong happened",
        });
    }
}));
userRouter.get("/info", middleware_1.userMiddleware, (req, res) => {
    try {
        res.status(200).send({
            message: "Successful",
            data: req.user,
        });
    }
    catch (err) {
        console.log(err.message);
        res.status(400).send({
            message: "Something wrong happened",
        });
    }
});
exports.default = userRouter;
