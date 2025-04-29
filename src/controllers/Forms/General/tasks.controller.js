const Tasks = require("../../../models/General/Tasks.js");
const User = require("../../../models/User.js")
const Company = require("../../../models/Company.js");
const Minuta = require("../../../models/General/Minuta.js");

//Metodo para tener las tareas
const getAllTasks = async (req, res) => {
    const { CompanyId } = req.params

    if (CompanyId.length !== 24) {
        return;
    }
    const company = await Company.find({
        _id: { $in: CompanyId },
    })

    if (!company) {
        return;
    }

    const tasks = await Tasks.find({
        company: { $in: CompanyId },
    }).sort({ item: -1 })
        .populate({
            path: "minuta",
            select: "consecutive"
        })
        .populate({
            path: "who",
            select: "employee",
            populate: { path: "employee", select: "name lastName" }
        })
    res.json({ status: "200", message: "Tareas Loaded", body: tasks });
}

module.exports = {
    getAllTasks,
}