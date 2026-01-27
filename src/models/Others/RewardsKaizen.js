const mongoose = require("mongoose");
const { Schema } = mongoose;

const RewardsKaizenSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String }, // Se guardará la Key de S3
  
  // Categorías de la S a la E
  category: { 
    type: String, 
    required: true, 
    enum: ['S', 'A', 'B', 'C', 'D', 'E'] 
  },
  
  consecutive: { type: Number }, // El número (ej: 1)
  fullId: { type: String },      // El visual (ej: S1)
  
  stock: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },

  // Control de usuarios (Usernames)
  createdBy: { type: String }, 
  modifiedBy: { type: String } 

}, {
  timestamps: true
});

module.exports = mongoose.model("RewardsKaizen", RewardsKaizenSchema);