import mongoose from "mongoose";

interface ILinkClickHistory {
  referrer: string;
  timestamp: Date;
  linkId: mongoose.Types.ObjectId;
}

const linkClickHistorySchema = new mongoose.Schema<ILinkClickHistory>({
  referrer: {
    type: String,
    default: () => "Unknown",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  linkId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
});

const LinkClickHistory = mongoose.model(
  "LinkClickHistory",
  linkClickHistorySchema
);

export { LinkClickHistory };
