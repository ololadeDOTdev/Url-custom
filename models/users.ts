import mongoose from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
  dateCreated: Date;
  lastLogin: Date;
}
const userSchema = new mongoose.Schema<IUser>({
  name: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  password: {
    required: true,
    type: String,
  },
  dateCreated: {
    required: true,
    default: Date.now,
    type: Date,
  },
  lastLogin: {
    type: Date,
  },
});

const User = mongoose.model("Users", userSchema);

export { User, IUser };
