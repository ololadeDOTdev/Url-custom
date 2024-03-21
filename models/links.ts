import mongoose from "mongoose";
import shortid from "shortid";

interface ILink {
  shortenedLink: string;
  fullLink: string;
  userId: mongoose.Types.ObjectId;
  clickCount: number;
}

const linkSchema = new mongoose.Schema<ILink>({
  shortenedLink: {
    required: true,
    type: String,
    default: shortid.generate,
    unique: true,
  },
  fullLink: {
    required: true,
    type: String,
  },
  userId: {
    required: true,
    type: mongoose.Schema.ObjectId,
  },
  clickCount: {
    type: Number,
    default: 0,
  },
});

const Link = mongoose.model("Links", linkSchema);

export { Link };
