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
            path: "owner",
            select: "employee username",
            populate: { path: "employee", select: "name lastName" }
        })
    res.json({ status: "200", message: "Tareas Loaded", body: tasks });
}

//Metodo para crear una tarea
const createNewTask = async (req, res) => {
    try {
        const { MinutaId, CompanyId } = req.params;

        const {
            task,
            owner,
            priority,
            startDate,
            dueDate,
            notes,
            createdBy,
            version,
        } = req.body;

        const newTask = new Tasks({
            task,
            priority,
            startDate,
            dueDate,
            notes,
            status: "In Progress",
            expired: "On Time",
            complete: 0,
            version,
        });

        newTask.originalDueDate = dueDate;

        if (createdBy.length > 0) {
            const foundUsers = await User.find({
                username: { $in: createdBy },
            });
            newTask.createdBy = foundUsers.map((user) => user._id);
        }

        if (owner.length > 0) {
            const foundUsers = await User.find({
                username: { $in: owner },
            });
            newTask.owner = foundUsers.map((user) => user._id);
        }

        if (CompanyId) {
            const foundCompany = await Company.find({
                _id: { $in: CompanyId },
            });
            newTask.company = foundCompany.map((company) => company._id);
        }

        // Obtener la minuta y vincularla
        const foundMinuta = await Minuta.find({
            consecutive: { $in: MinutaId },
        });

        if (foundMinuta.length === 0) {
            return res.status(404).json({ status: "404", message: "Minuta no encontrada" });
        }

        const minutaId = foundMinuta[0]._id;
        newTask.minuta = [minutaId];

        // Calcular el valor de item según las tareas ya existentes para esta minuta
        const tareasRelacionadas = await Tasks.find({ minuta: minutaId }).sort({ item: -1 }).limit(1);

        newTask.item = tareasRelacionadas.length > 0 ? tareasRelacionadas[0].item + 1 : 1;

        await newTask.save()

        res.status(200).json({ status: "200", message: 'Tarea guardada' });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al guardar minuta", error: error.message });
    }
}

// Método para actualizar una tarea
const updateTaskById = async (req, res) => {
    try {
        const { TaskId} = req.params;
        const {
            task,
            owner,
            priority,
            realDate,
            dueDate,
            notes,
            complete,
            status,
            updatedBy,
        } = req.body;

        const existingTask = await Tasks.findById(TaskId);
        if (!existingTask) {
            return res.status(404).json({ status: "404", message: "Tarea no encontrada" });
        }

        // Buscar usuarios
        if (updatedBy?.length > 0) {
            const foundUsers = await User.find({
                username: { $in: updatedBy },
            });
            existingTask.updatedBy = foundUsers.map((u) => u._id);
        }

        if (owner?.length > 0) {
            const foundOwners = await User.find({
                username: { $in: owner },
            });
            existingTask.owner = foundOwners.map((u) => u._id);
        }

        // Actualizar campos
        existingTask.task = task;
        existingTask.priority = priority;
        existingTask.realDate = realDate;
        existingTask.dueDate = dueDate;
        existingTask.notes = notes;
        existingTask.complete = complete;
        existingTask.status = status;

        await existingTask.save();

        res.status(200).json({ status: "200", message: "Tarea actualizada correctamente" });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al actualizar tarea",
            error: error.message,
        });
    }
};


module.exports = {
    getAllTasks,
    createNewTask,
    updateTaskById
}