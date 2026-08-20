const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const credentialSchema = new Schema(
    {
        personnelId: { 
            type: String, 
            required: true, 
            unique: true 
        }, 
        cardNumber: { 
            type: String, 
            required: true, 
            unique: true 
        },
        employee: { 
            type: Schema.Types.ObjectId, 
            ref: "Employees",
            default: null 
        }, 
        guestName: { 
            type: String 
        }, 
        accessGroup: { 
            type: Schema.Types.ObjectId, 
            ref: "AccessGroup", 
            required: true 
        },
        active: { 
            type: Boolean, 
            default: true 
        }
    },
    { timestamps: true }
);

module.exports = model("AccessCredential", credentialSchema);