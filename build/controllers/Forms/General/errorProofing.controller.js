const AutomationDevice = require("../../../models/Automation/AutomationDevice");

const Company = require("../../../models/Company");

const Checklist = require("../../../models/General/Checklist");

const ErrorProofing = require("../../../models/General/ErrorProofing");

const User = require("../../../models/User"); // Getting all deviations request/////////////////////////////////////////////////////////////////////////////////////////////////////


const getErrorProofings = async (req, res) => {
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

  const errorProofings = await ErrorProofing.find({
    company: {
      $in: CompanyId
    }
  }).sort({
    createdAt: -1
  }) // .populate({ path: 'customer' })
  // .populate({
  //     path: 'requestBy',
  //     populate: [
  //         {
  //             path: 'signature',
  //             model: 'Signature'
  //         },
  //         {
  //             path: 'employee',
  //             model: 'Employees',
  //             populate: {
  //                 path: 'department',
  //                 model: 'Department'
  //             }
  //         }
  //     ]
  // })
  .populate({
    path: "startTechnician",
    select: "employee username",
    populate: {
      path: "employee",
      select: "name lastName"
    }
  }).populate({
    path: "endTechnician",
    select: "employee username",
    populate: {
      path: "employee",
      select: "name lastName"
    }
  }).populate({
    path: "device"
  }) // .populate({
  //     path: "qualityResponsible",
  //     select: "employee username",
  //     populate: { path: "employee", select: "name lastName" }
  // })
  // .populate({
  //     path: "productionResponsible",
  //     select: "employee username",
  //     populate: { path: "employee", select: "name lastName" }
  // })
  .populate({
    path: 'checklists',
    model: 'Checklist',
    populate: [// <--- Convertido a un array
    {
      // --- Primer populate (el que ya tenías) ---
      path: 'createdBy',
      model: 'User',
      select: 'username employee',
      populate: {
        path: 'employee',
        select: 'name lastName'
      }
    }, {
      // --- Segundo populate (el que quieres agregar) ---
      path: 'automationResponsible',
      // <--- El nuevo campo
      model: 'User',
      select: 'username employee',
      populate: {
        path: 'employee',
        select: 'name lastName'
      }
    }]
  }); // .populate({ path: 'deviationRisk', model: "DeviationRiskAssessment" });

  res.json({
    status: "200",
    message: "Error Proofings Loaded",
    body: errorProofings
  });
};

const createNewErrorProofing = async (req, res) => {
  try {
    const {
      CompanyId
    } = req.params;
    const {
      errorProofingName,
      device,
      startDate,
      startShift,
      startTechnician,
      version
    } = req.body;
    const newErrorProfing = new ErrorProofing({
      errorProofingName,
      startDate,
      startShift,
      errorProofingStatus: "Open",
      version
    });

    if (startTechnician.length > 0) {
      const foundUsers = await User.find({
        username: {
          $in: startTechnician
        }
      });
      newErrorProfing.startTechnician = foundUsers.map(user => user._id);
    }

    if (device) {
      const foundDevices = await AutomationDevice.find({
        _id: {
          $in: device
        }
      });
      newErrorProfing.device = foundDevices.map(option => option._id);
    }

    if (CompanyId) {
      const foundCompany = await Company.find({
        _id: {
          $in: CompanyId
        }
      });
      newErrorProfing.company = foundCompany.map(company => company._id);
    }

    const count = await ErrorProofing.estimatedDocumentCount();

    if (count > 1) {
      const errorProofings = await ErrorProofing.find().sort({
        consecutive: -1
      }).limit(1);
      newErrorProfing.consecutive = errorProofings[0].consecutive + 1;
    } else {
      newErrorProfing.consecutive = 1;
    }

    await newErrorProfing.save();
    res.status(200).json({
      status: "200",
      message: 'Error Profing guardada'
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al guardar Error Profing",
      error: error.message
    });
  }
}; //Actualizar error proofing


const updateErrorProofing = async (req, res) => {
  const {
    ErrorProofingId
  } = req.params;
  const {
    endDate,
    endShift,
    endTechnician
  } = req.body;
  let newEndTechnician = null;
  let errorProofingStatus = "Open";

  if (endDate) {
    errorProofingStatus = "Closed"; // Buscar Usuario en la base de datos

    if (endTechnician) {
      const foundUsers = await User.find({
        username: endTechnician
      });

      if (foundUsers.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "Usuario no encontrado"
        });
      }

      newEndTechnician = foundUsers.map(e => e._id);
    }
  }

  const updatedErrorProofing = await ErrorProofing.updateOne({
    _id: ErrorProofingId
  }, {
    $set: {
      endDate,
      endShift,
      endTechnician: newEndTechnician,
      errorProofingStatus
    }
  });

  if (!updatedErrorProofing) {
    res.status(403).json({
      status: "403",
      message: "Error Proofing not Updated",
      body: ""
    });
  }

  res.status(200).json({
    status: "200",
    message: "Error Proofing Updated ",
    body: updatedErrorProofing
  });
}; //Generar un nuevo checklist en un archivo de error proofing existente
// Función de utilidad para transformar los ítems del array de sensores


const transformSensorItems = rawSensors => {
  if (!Array.isArray(rawSensors)) return [];
  return rawSensors.map(row => ({
    label: row.label,
    quantityOk: parseInt(row.quantityOk, 10) || 0,
    quantityNotOk: parseInt(row.quantityNotOk, 10) || 0,
    totalQuantity: parseInt(row.totalQuantity, 10) || 0,
    comments: row.comments || ''
  }));
}; // Función de utilidad para transformar los ítems de clamping, nidos y visual


const transformStatusItems = rawItems => {
  if (!Array.isArray(rawItems)) return [];
  return rawItems.map(row => ({
    label: row.label,
    status: row.status || '',
    // Deja este vacío si no hay valor para que el default del Schema funcione
    comments: row.comments || '' // <-- Aquí la corrección también

  }));
};

const createNewChecklist = async (req, res) => {
  try {
    const {
      ErrorProofingId
    } = req.params; // El frontend ahora envía los arrays ya pre-filtrados y con la nueva estructura
    // console.log(req.body)

    const {
      sensors,
      clamping,
      nidos,
      visual,
      createdBy,
      generalComments
    } = req.body;

    if (!ErrorProofingId) {
      return res.status(400).json({
        message: "El campo 'idErrorProofing' es requerido."
      });
    }

    const updatedErrorProofing = await ErrorProofing.findByIdAndUpdate(ErrorProofingId, {
      $inc: {
        checklistCounter: 1
      }
    }, {
      new: true
    });

    if (!updatedErrorProofing) {
      return res.status(404).json({
        message: "El documento ErrorProofing con el ID proporcionado no existe."
      });
    }

    const consecutivo = updatedErrorProofing.checklistCounter; // Utilizamos las nuevas funciones de transformación para procesar los datos

    const cleanSensors = transformSensorItems(sensors);
    const cleanClamping = transformStatusItems(clamping);
    const cleanNidos = transformStatusItems(nidos);
    const cleanVisual = transformStatusItems(visual); // Creamos el nuevo checklist con la estructura de datos actualizada

    const newChecklist = new Checklist({
      sensors: cleanSensors,
      clamping: cleanClamping,
      nidos: cleanNidos,
      visual: cleanVisual,
      consecutive: consecutivo,
      generalComments: generalComments || '' // Añade el campo de comentarios generales

    });

    if (createdBy) {
      const foundUser = await User.findOne({
        username: createdBy
      });

      if (foundUser) {
        newChecklist.createdBy = foundUser._id;
      }
    }

    const savedChecklist = await newChecklist.save();
    updatedErrorProofing.checklists.push(savedChecklist._id);
    await updatedErrorProofing.save();
    res.status(200).json({
      status: "200",
      message: "Checklist creado y referenciado exitosamente.",
      data: savedChecklist
    });
  } catch (error) {
    console.error("Error al crear checklist:", error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        message: "El 'ErrorProofingId' proporcionado no es un ID válido."
      });
    }

    res.status(500).json({
      message: "Error interno del servidor.",
      error: error.message
    });
  }
};

const validateChecklist = async (req, res) => {
  const {
    ChecklistId
  } = req.params;
  const {
    automationResponsible
  } = req.body;
  let newAutomationResponsible = null;
  let newAutomationValidationDate = null; // Buscar Usuario en la base de datos

  if (automationResponsible) {
    const foundUsers = await User.find({
      username: automationResponsible
    });

    if (foundUsers.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado"
      });
    }

    newAutomationResponsible = foundUsers.map(e => e._id);
    newAutomationValidationDate = new Date();
  }

  const updatedChecklist = await Checklist.updateOne({
    _id: ChecklistId
  }, {
    $set: {
      automationResponsible: newAutomationResponsible,
      automationValidationDate: newAutomationValidationDate
    }
  });

  if (!updatedChecklist) {
    res.status(403).json({
      status: "403",
      message: "Checklist not Updated",
      body: ""
    });
  }

  res.status(200).json({
    status: "200",
    message: "Checklist updated",
    body: updatedChecklist
  });
};

module.exports = {
  getErrorProofings,
  createNewErrorProofing,
  updateErrorProofing,
  createNewChecklist,
  validateChecklist
};