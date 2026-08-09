import mongoose, {Schema} from "mongoose";

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
    },
    {
        timestamps: true
    }
)

export const Link = mongoose.model("Link",linkSchema)