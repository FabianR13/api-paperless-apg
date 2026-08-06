const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const credentialSchema = new Schema(
    {
        personnelId: { 
            type: String, 
            required: true, 
            unique: true 
        }, // Ej. "10329" o "1119456". ZKTeco lo requiere estrictamente.
        cardNumber: { 
            type: String, 
            required: true, 
            unique: true 
        },
        employee: { 
            type: Schema.Types.ObjectId, 
            ref: "Employees",
            default: null // Será nulo si es un préstamo/visitante
        }, 
        guestName: { 
            type: String // Ej. "Prestamo Producción". Solo se usa si employee es nulo.
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