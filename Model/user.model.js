import mongoose from "mongoose";
import { userSchema } from "../Schema/user.schema";

export const UserModel = mongoose.model("User", userSchema);