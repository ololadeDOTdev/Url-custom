"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const linkRoutes_1 = __importDefault(require("./routes/linkRoutes"));
const middleware_1 = require("./middleware");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
mongoose_1.default
    .connect("mongodb+srv://bookeyadmin:TSbOVi2OZCen1O8h@cluster0.ef0ubfv.mongodb.net/url-custom?retryWrites=true&w=majority")
    .then(() => console.log("Connected successfully"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded());
app.use((0, cors_1.default)());
app.use("/user", userRoutes_1.default);
app.use("/link", linkRoutes_1.default);
app.use("/:shortened", middleware_1.rerouteMiddleware);
app.listen(4000, () => {
    console.log("The app has started");
});
