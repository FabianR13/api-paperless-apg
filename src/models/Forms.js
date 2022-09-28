import { Schema, model } from "mongoose";

const formsSchema = new Schema(
  {
    name: String,
    description: String,
    back: String,
    dashboard: [
      {
        ref: "Dashboard",
        type: Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Forms", formsSchema);
