"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkClickHistory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const linkClickHistorySchema = new mongoose_1.default.Schema({
    referrer: {
        type: String,
        default: () => "Unknown",
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    linkId: {
        type: mongoose_1.default.Schema.ObjectId,
        required: true,
    },
});
const LinkClickHistory = mongoose_1.default.model("LinkClickHistory", linkClickHistorySchema);
exports.LinkClickHistory = LinkClickHistory;
