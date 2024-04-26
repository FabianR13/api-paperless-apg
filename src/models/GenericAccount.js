const mongoose = require('mongoose')

const genericAccounSchema = new mongoose.Schema(
    {
        groupName: {
            type: String,
        },
        members: [
            {
                ref: "Employees",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        department: [
            {
                ref: "Department",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        email: {
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

module.exports = mongoose.model("GenericAccount", genericAccounSchema);





