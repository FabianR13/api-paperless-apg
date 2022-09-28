import { Schema, model } from "mongoose";


const companySchema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    direction: {
      type: String,
    },
    location: {
      type: String,
    },
   
  }
);

export default model("Company", companySchema);
