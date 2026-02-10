const mongoose = require('mongoose')

const partSchema = new mongoose.Schema(
    {
        partnumber: [{ type: String },],
        partName: [{ type: String},],
        partEcl: {
            type: String,
        },
        customer: [
            {
                ref: "Customer",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
        assemblyPartNumber: [{ type: String },],
        assemblyPartDesc: [{ type: String},],
        company: [
            {
                ref: "Company",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
        mould: {
            type: String,
        },
        status: {
            type: Boolean,
        },
    }
);

module.exports = mongoose.model("Parts", partSchema);