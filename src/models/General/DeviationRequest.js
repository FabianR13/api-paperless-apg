const {Schema, model} = require("mongoose");
// import {Schema, model} from "mongoose";

const deviationRequestSchema = new Schema(
    {
        deviationDate: {
            type: Date,
        },
        deviationNumber: {
            type: String,
        },
        deviationType: {
            type: String,
        },
        
        customer:[
            {
                ref: "Customer",
                type: Schema.Types.ObjectId,
            },
        ],
        supplier:{
            type: String,
        },
        requestBy: [
            {
                ref:"User",
                type:Schema.Types.ObjectId, 
            },
        ],
        implementationDate: {
            type: Date,
        },
        implementationTime: {
            type: String,
        },
        parts: [
            {
                ref: "Parts",
                type: Schema.Types.ObjectId,
            },
        ],
        sectionTwo:{
            type: String,
        },
        termDevRequest: {
            type: String,
        },
        quantity: {
            type: String,
        },
        timePeriodStart:{
            type: Date,
        },
        timePeriodEnd:{
            type: Date,
        },
        other: {
            type: String,
        },
        deviationGranted:{
            type:String,
        },
       
        otherGranted:{
            type: String,
        },
        qualitySign:{
            type: String,
        },
        dateQualitySign:{
            type: Date,
        },
        seniorSign:{
            type: String,
        },
        dateSeniorSign:{
            type:Date,
        },
        customerSign: {
            type: String,
        },
        dateCustomerSign:{
            type: Date,
        },
        comments:{
            type: String,
        }, 
        consecutive: {
            type:Number,
        },
        priority:{
            type: String,
        }, 
        qualitySignStatus:{
            type: String,
        }, 
        seniorSignStatus:{
            type: String,
        }, 
        customerSignStatus:{
            type: String,
        }, 
        deviationStatus:{
            type: String,
        }, 
        deviationRisk:{
            type: String,
        }, 
        company:[
            {
                ref: "Company",
                type: Schema.Types.ObjectId,
            }
        ],

    },
    {
        timestamps: true,
      }
);

export default model ("DeviationRequest", deviationRequestSchema);






