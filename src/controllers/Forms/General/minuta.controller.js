const Minuta = require("../../../models/General/Minuta.js")
const Tasks = require("../../../models/General/Tasks.js");
const User = require("../../../models/User.js")
const Company = require("../../../models/Company.js")
const {
    createNewTasks,
} = require("./tasks.controller.js")

const createNewMinuta = async (req, res) => {
    try {
        const { CompanyId } = req.params;

        const {
            consecutive,
            theme,
            date,
            asistentes,
            ausentes,
            lugar,
            nextMinuta,
            resumen,
            version,
            tasks
        } = req.body;

        const newMinuta = new Minuta({
            consecutive,
            theme,
            date,
            lugar,
            resumen,
            version,
        });

        if (asistentes.length > 0) {
            const foundUsers = await User.find({
                username: { $in: asistentes },
            });
            newMinuta.asistentes = foundUsers.map((user) => user._id);
        }

        if (ausentes.length > 0) {
            const foundUsers = await User.find({
                username: { $in: ausentes },
            });
            newMinuta.ausentes = foundUsers.map((user) => user._id);
        }

        if (nextMinuta) {
            const foundUsers = await User.find({
                username: { $in: nextMinuta },
            });
            newMinuta.nextMinuta = foundUsers.map((user) => user._id);
        }

        if (CompanyId) {
            const foundCompany = await Company.find({
                _id: { $in: CompanyId },
            });
            newMinuta.company = foundCompany.map((company) => company._id);
        }

        await newMinuta.save()

        for (let i = 0; i < tasks.length; i++) {
            const {
                status,
                task,
                updates,
                when,
                version
            } = tasks[i];

            const newTask = new Tasks({
                status,
                task,
                updates,
                when,
                version
            });

            const foundMinuta = await Minuta.find({
                consecutive: { $in: consecutive },
            });
            newTask.minuta = foundMinuta.map((minuta) => minuta._id);

            const tasksdb = await Tasks.find({
                company: { $in: CompanyId },
            }).sort({ item: -1 }).limit(1);

            if (tasksdb.length === 0) {
                newTask.item = 1;
            } else {
                newTask.item = tasksdb[0].item + 1
            }

            console.log(tasks[i])

            if (tasks[i].who) {
                console.log(tasks[i].who)
                const foundUser = await User.find({
                    username: { $in: tasks[i].who },
                });
                newTask.who = foundUser.map((user) => user._id);
            }

            if (CompanyId) {
                const foundCompany = await Company.find({
                    _id: { $in: CompanyId },
                });
                newTask.company = foundCompany.map((company) => company._id);
            }

            await newTask.save()
        }

        res.status(200).json({ status: "200", message: 'Minuta y tareas guardadas' });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al guardar minuta", error: error.message });
    }
}

//Metodo para tener las minutas
const getAllMinutas = async (req, res) => {
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

    const minutas = await Minuta.find({
        company: { $in: CompanyId },
    }).sort({ consecutive: -1 })
        .populate({
            path: "asistentes",
            select: "employee",
            populate: { path: "employee", select: "name lastName" }
        })
        .populate({
            path: "ausentes",
            select: "employee",
            populate: { path: "employee", select: "name lastName" }
        })
        .populate({
            path: "nextMinuta",
            select: "employee",
            populate: { path: "employee", select: "name lastName" }
        })
    res.json({ status: "200", message: "Minutas Loaded", body: minutas });
}

module.exports = {
    createNewMinuta,
    getAllMinutas
}