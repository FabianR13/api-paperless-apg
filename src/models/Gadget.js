const mongoose = require("mongoose");

const GadgetSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // o "Employees" según tu colección
        required: true
    },
    employeeName: {
        type: String,
        required: true
    },
    gadgetType: {
        type: String,
        required: true
    },
    gadgetName: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        enum: ["Nuevo", "Usado"],
        default: "Nuevo"
    },
    deliveryDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["Asignado", "Devuelto", "Dañado / Defectuoso", "Perdido"],
        default: "Asignado"
    },
    notes: {
        type: String,
        default: ""
    },
    createdBy: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Gadget", GadgetSchema);