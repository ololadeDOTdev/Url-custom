"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Link = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const shortid_1 = __importDefault(require("shortid"));
const linkSchema = new mongoose_1.default.Schema({
    shortenedLink: {
        required: true,
        type: String,
        default: shortid_1.default.generate,
        unique: true,
    },
    fullLink: {
        required: true,
        type: String,
    },
    userId: {
        required: true,
        type: mongoose_1.default.Schema.ObjectId,
    },
    clickCount: {
        type: Number,
        default: 0,
    },
});
const Link = mongoose_1.default.model("Links", linkSchema);
exports.Link = Link;
