import {Schema, model} from "mongoose";

const employeesSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        numberEmployee: {
            type: String,
            required: true,
            unique: true,
        },
        department: [
            {
                ref: "Department",
                type: Schema.Types.ObjectId,
            },
        ],
        position: [
            {
                ref: "Position",
                type: Schema.Types.ObjectId,
            },
        ],
        active:{
            type: Boolean,

        },
        picture:{
            type:String
        },
        user:{
            type: Boolean
        },
        company:[
            {
                ref: "Company",
                type: Schema.Types.ObjectId,
            }
        ],
        
    }
);
    export default model ("Employees", employeesSchema);