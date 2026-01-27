const RewardsKaizen = require("../../models/Others/RewardsKaizen");

// Función auxiliar para obtener el siguiente consecutivo
const getNextConsecutive = async (category) => {
  const lastReward = await RewardsKaizen.findOne({ category: category })
    .sort({ consecutive: -1 })
    .limit(1);

  const nextNum = lastReward ? lastReward.consecutive + 1 : 1;
  return { num: nextNum, full: `${category}${nextNum}` };
};

const createReward = async (req, res) => {
  try {
    const { name, description, category, stock, username } = req.body; // username viene del front (usuario logueado)

    // 1. Imagen
    let imageKey = "";
    if (req.files && req.files["rewardImage"] && req.files["rewardImage"].length > 0) {
      imageKey = req.files["rewardImage"][0].key;
    }

    // 2. Calcular Consecutivo
    const { num, full } = await getNextConsecutive(category);

    const newReward = new RewardsKaizen({
      name,
      description,
      category,
      consecutive: num,
      fullId: full,
      stock,
      image: imageKey,
      createdBy: username,
      modifiedBy: username
    });

    await newReward.save();
    res.status(200).json({ status: "200", message: "Premio creado", body: newReward });

  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const getRewards = async (req, res) => {
  try {
    // Traemos todos (puedes filtrar por isActive: true si prefieres)
    const rewards = await RewardsKaizen.find({});
    res.status(200).json({ status: "200", body: rewards });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const updateReward = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, stock, isActive, username } = req.body;

    const rewardToUpdate = await RewardsKaizen.findById(id);
    if (!rewardToUpdate) return res.status(404).json({ message: "No encontrado" });

    // Si cambió la categoría, recalcular consecutivo
    if (rewardToUpdate.category !== category) {
       const { num, full } = await getNextConsecutive(category);
       rewardToUpdate.category = category;
       rewardToUpdate.consecutive = num;
       rewardToUpdate.fullId = full;
    }

    // Actualizar imagen si viene una nueva
    if (req.files && req.files["rewardImage"] && req.files["rewardImage"].length > 0) {
      rewardToUpdate.image = req.files["rewardImage"][0].key;
    }

    rewardToUpdate.name = name;
    rewardToUpdate.description = description;
    rewardToUpdate.stock = stock;
    rewardToUpdate.isActive = isActive;
    rewardToUpdate.modifiedBy = username;

    await rewardToUpdate.save();
    res.status(200).json({ status: "200", message: "Actualizado", body: rewardToUpdate });

  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = { createReward, getRewards, updateReward };