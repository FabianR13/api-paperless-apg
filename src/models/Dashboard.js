import { Schema, model } from "mongoose";

const dashboardSchema = new Schema(
  {
    name: {
      type: String,
    },

    description: {
      type: String,
    },
    icon: {
      type: String,
    },
    back: {
      type: String,
    },
    pos: {
      type: Number,
    },
  },
  { timestamps: true, versionKey: false }
);

export default model("Dashboard", dashboardSchema);
