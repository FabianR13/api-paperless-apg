const mongoose = require('mongoose');

const itemsSchema = new mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  class: {
    type: String
  },
  uom: {
    type: String
  },
  qty: {
    type: Number
  },
  itemGroup: {
    valor: {
      type: String
    },
    // Aquí guardamos el valor de valor2
    descripcion: {
      type: String
    } // Aquí guardamos la descripción de valor2

  },
  selectedBy: [Number],
  version: {
    type: Number
  },
  company: [{
    ref: "Company",
    type: mongoose.Schema.Types.ObjectId
  }]
}, {
  timestamps: true
});
module.exports = mongoose.model("Items", itemsSchema);