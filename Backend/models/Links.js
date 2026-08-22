import mongoose, {Schema} from "mongoose";
import { LINK_EXPIRY_SECONDS } from "../constants.js";

const linkSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            index: true
        },
        longUrl: {
            type: String,
            required: true,
            trim: true,
        },
        expireAt: {
            type: Date,
            default: () => new Date(Date.now() +LINK_EXPIRY_SECONDS*1000),
            index: {expireAfterSeconds: 0}
        }
    },
    {
        timestamps: true
    }
)

export const Link = mongoose.model("Link",linkSchema)