import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const messageSchema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text: {
            type: String
        },
        mediaFile: {
            type: Object
        }
    },
    {timestamps: true}
);

messageSchema.plugin(mongooseAggregatePaginate);

export const Message = mongoose.model("Message", messageSchema);