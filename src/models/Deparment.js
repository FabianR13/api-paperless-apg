import { Schema, model } from "mongoose";

const departmentSchema = new Schema(
  {
    name: String,
    description: String,
  },

  {
    timestamps: true,

    versionKey: false,
  }
);

export default model("Department", departmentSchema);
