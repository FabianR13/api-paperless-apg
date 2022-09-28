import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    signature:{
      type:String,
    },
    roles: [
      {
        ref: "Role",
        type: Schema.Types.ObjectId,
      },
    ],
    rolesAxiom: [
      {
        ref: "Role",
        type: Schema.Types.ObjectId,
      },
    ],
    employee: [
      {
        ref: "Employees",
        type: Schema.Types.ObjectId,
      },
      
    ],
    companyAccess:[
      {
          ref: "Company",
          type: Schema.Types.ObjectId,
      }
  ],
    company:[
      {
          ref: "Company",
          type: Schema.Types.ObjectId,
      }
  ],
    
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

//Metodo para cifrar el dato y comparar contraseñas encryptPassword y Compare Password son nombre que asignamos manualmente
userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};



userSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword);
};

export default model("User", userSchema);
