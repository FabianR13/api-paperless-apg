const mongoose = require('mongoose');

const ItemsSchema = new mongoose.Schema(
    {
        consecutive: {
            type: Number,
        },
        name:{
            type:String,
        },
        itemNo:{
            type:String,
        },
        description:{
            type:String,
        },
        
        status: {
            type: String,
        },
        version: {
            type: Number,
        },
        company: [
            {
                ref: "Company",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Laptops", laptopsSchema);