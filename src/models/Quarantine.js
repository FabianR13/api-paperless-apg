const mongoose = require("mongoose");

const QuarantineSchema = new mongoose.Schema({
    moveID: {type: String, required: true },
    user: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    },
    quarantineDate: {type: Date},
    itemID: {
        ref: "Items",
        type: mongoose.Schema.Types.ObjectId,
    },
    seriales: [{
        serial:{type: String}, 
        cantidad: {type: Number}
    }],
    batch: {type: String},
    status: {type: String}, 
    reason: {type: String},
    //consecutive: {type: Number},
    modifiedby: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    },
    version: {type: Number, default: 1},
    company: {
        ref: "Company",
        type: mongoose.Schema.Types.ObjectId,
    }
    
}, {
    timestamps: true
});
module.exports = mongoose.model("Quarantine", QuarantineSchema);

