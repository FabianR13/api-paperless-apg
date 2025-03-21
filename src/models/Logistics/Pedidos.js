const mongoose = require("mongoose");

const PedidoSchema = new mongoose.Schema({
    idPedido: { type: String, required: true, unique: true },
    usuario: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    },
    maquina: { type: String, required: true },
    items: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: "Items", required: true }, // ID del material
            serial: { type: [String], default: [] },  // Array vacío por defecto
            quantityReq: { type: Number },
            quantitySur: { type: [Number], default: [] } // Array vacío por defecto
        }
    ],
    surtidor: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    pStatus: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Pedido", PedidoSchema);
