const Minuta = require("../../../models/General/Minuta.js");

const Tasks = require("../../../models/General/Tasks.js");

const User = require("../../../models/User.js");

const Company = require("../../../models/Company.js");

const {
  createNewTasks
} = require("./tasks.controller.js");

const createNewMinuta = async (req, res) => {
  try {
    const {
      CompanyId
    } = req.params;
    const {
      consecutive,
      createdBy,
      theme,
      date,
      asistentes,
      ausentes,
      retardos,
      lugar,
      nextMinuta,
      resumen,
      version
    } = req.body;
    const newMinuta = new Minuta({
      consecutive,
      theme,
      date,
      lugar,
      resumen,
      version
    });

    if (createdBy.length > 0) {
      const foundUsers = await User.find({
        username: {
          $in: createdBy
        }
      });
      newMinuta.createdBy = foundUsers.map(user => user._id);
    }

    if (asistentes.length > 0) {
      const foundUsers = await User.find({
        username: {
          $in: asistentes
        }
      });
      newMinuta.asistentes = foundUsers.map(user => user._id);
    }

    if (ausentes.length > 0) {
      const foundUsers = await User.find({
        username: {
          $in: ausentes
        }
      });
      newMinuta.ausentes = foundUsers.map(user => user._id);
    }

    if (retardos.length > 0) {
      const foundUsers = await User.find({
        username: {
          $in: retardos
        }
      });
      newMinuta.retardos = foundUsers.map(user => user._id);
    }

    if (nextMinuta) {
      const foundUsers = await User.find({
        username: {
          $in: nextMinuta
        }
      });
      newMinuta.nextMinuta = foundUsers.map(user => user._id);
    }

    if (CompanyId) {
      const foundCompany = await Company.find({
        _id: {
          $in: CompanyId
        }
      });
      newMinuta.company = foundCompany.map(company => company._id);
    }

    await newMinuta.save(); // for (let i = 0; i < tasks.length; i++) {
    //     const {
    //         status,
    //         task,
    //         updates,
    //         when,
    //         version
    //     } = tasks[i];
    //     const newTask = new Tasks({
    //         status,
    //         task,
    //         updates,
    //         when,
    //         version
    //     });
    //     const foundMinuta = await Minuta.find({
    //         consecutive: { $in: consecutive },
    //     });
    //     newTask.minuta = foundMinuta.map((minuta) => minuta._id);
    //     const tasksdb = await Tasks.find({
    //         company: { $in: CompanyId },
    //     }).sort({ item: -1 }).limit(1);
    //     if (tasksdb.length === 0) {
    //         newTask.item = 1;
    //     } else {
    //         newTask.item = tasksdb[0].item + 1
    //     }
    //     console.log(tasks[i])
    //     if (tasks[i].who) {
    //         console.log(tasks[i].who)
    //         const foundUser = await User.find({
    //             username: { $in: tasks[i].who },
    //         });
    //         newTask.who = foundUser.map((user) => user._id);
    //     }
    //     if (CompanyId) {
    //         const foundCompany = await Company.find({
    //             _id: { $in: CompanyId },
    //         });
    //         newTask.company = foundCompany.map((company) => company._id);
    //     }
    //     await newTask.save()
    // }

    res.status(200).json({
      status: "200",
      message: 'Minuta guardada'
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al guardar minuta",
      error: error.message
    });
  }
}; //Metodo para tener las minutas


const getAllMinutas = async (req, res) => {
  const {
    CompanyId
  } = req.params;

  if (CompanyId.length !== 24) {
    return;
  }

  const company = await Company.find({
    _id: {
      $in: CompanyId
    }
  });

  if (!company) {
    return;
  }

  const minutas = await Minuta.find({
    company: {
      $in: CompanyId
    }
  }).sort({
    consecutive: -1
  }).populate({
    path: "createdBy",
    select: "employee username",
    populate: {
      path: "employee",
      select: "name lastName"
    }
  }).populate({
    path: "asistentes",
    select: "employee username",
    populate: {
      path: "employee",
      select: "name lastName"
    }
  }).populate({
    path: "ausentes",
    select: "employee username",
    populate: {
      path: "employee",
      select: "name lastName"
    }
  }).populate({
    path: "retardos",
    select: "employee username",
    populate: {
      path: "employee",
      select: "name lastName"
    }
  }).populate({
    path: "nextMinuta",
    select: "employee username",
    populate: {
      path: "employee",
      select: "name lastName"
    }
  });
  res.json({
    status: "200",
    message: "Minutas Loaded",
    body: minutas
  });
}; //Actualizar minuta


const updateMinuta = async (req, res) => {
  try {
    const {
      MinutaId,
      CompanyId
    } = req.params;
    const {
      theme,
      asistentes,
      ausentes,
      retardos,
      lugar,
      nextMinuta,
      resumen
    } = req.body;
    const minuta = await Minuta.findById(MinutaId);

    if (!minuta) {
      return res.status(404).json({
        status: "404",
        message: "Minuta no encontrada"
      });
    } // Actualizar campos simples


    minuta.theme = theme || minuta.theme;
    minuta.lugar = lugar || minuta.lugar;
    minuta.resumen = resumen || minuta.resumen; // Asistentes

    if (asistentes?.length > 0) {
      const foundUsers = await User.find({
        username: {
          $in: asistentes
        }
      });
      minuta.asistentes = foundUsers.map(u => u._id);
    } else {
      minuta.asistentes = [];
    } // Ausentes


    if (ausentes?.length > 0) {
      const foundUsers = await User.find({
        username: {
          $in: ausentes
        }
      });
      minuta.ausentes = foundUsers.map(u => u._id);
    } else {
      minuta.ausentes = [];
    } // Retardos


    if (retardos?.length > 0) {
      const foundUsers = await User.find({
        username: {
          $in: retardos
        }
      });
      minuta.retardos = foundUsers.map(u => u._id);
    } else {
      minuta.retardos = [];
    } // Next Minuta


    if (nextMinuta) {
      const foundUsers = await User.find({
        username: {
          $in: nextMinuta
        }
      });
      minuta.nextMinuta = foundUsers.map(u => u._id);
    } else {
      minuta.nextMinuta = [];
    }

    await minuta.save();
    res.status(200).json({
      status: "200",
      message: "Minuta actualizada correctamente"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error al actualizar la minuta",
      error: error.message
    });
  }
};

module.exports = {
  createNewMinuta,
  getAllMinutas,
  updateMinuta
};