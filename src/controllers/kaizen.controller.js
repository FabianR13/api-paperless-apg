// Controlador para el Kaizen
const Kaizen = require("../models/Kaizen.js");
const Company = require("../models/Company.js");
const AWS = require('aws-sdk');
const Employees = require("../models/Employees.js");
const Deparment = require("../models/Deparment.js");
const Suggestion = require("../models/Suggestion.js");
const KaizenPoints = require("../models/KaizenPoints");
const User = require("../models/User.js");
const RewardsKaizen = require("../models/RewardsKaizen.js");
const KaizenPointsRedeem = require("../models/KaizenPointsRedeem.js");
const KaizenInvestigations = require("../models/KaizenInvestigations.js")
AWS.config.update({
  region: process.env.S3_BUCKET_REGION,
  apiVersion: 'latest',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  }
})

const s3 = new AWS.S3();
const nodemailer = require("nodemailer");

// CREAR NUEVA SUGERENCIA ////////////////////////////////////////////////////////////////////////////////////////////////////////
const createSuggestion = async (req, res) => {
  const { CompanyId } = req.params;

  try {
    const {
      suggestionTitle,
      currentMethod,
      proposedMethod,
      benefits,
      partNumber,
      createdBy,
      area,
      createdDate,
    } = req.body;

    // Procesar la firma
    let signatureImgKey = "";
    if (req.files && req.files["signatureImage"] && req.files["signatureImage"].length > 0) {
      signatureImgKey = req.files["signatureImage"][0].key;
    }

    // Crear objeto Suggestion
    const suggestion = new Suggestion({
      suggestionTitle,
      currentMethod,
      proposedMethod,
      benefits,
      area,
      partNumber,
      createdDate,
      signatureImg: signatureImgKey
    });

    // Vincular Relaciones en el objeto Suggestion
    if (createdBy) {
      const foundEmployee = await Employees.find({ _id: { $in: createdBy } });
      suggestion.createdBy = foundEmployee.map((e) => e._id);
    }

    if (CompanyId) {
      const foundCompany = await Company.find({ _id: { $in: CompanyId } });
      suggestion.company = foundCompany.map((c) => c._id);
    }

    // Generar Consecutivo (APG-SUG-X)
    const lastSuggestion = await Suggestion.find({
      company: { $in: CompanyId },
    }).sort({ consecutive: -1 }).limit(1);

    if (lastSuggestion.length === 0) {
      suggestion.consecutive = 1;
      suggestion.idSuggestion = "APG-SUG-1";
    } else {
      const nextConsecutive = lastSuggestion[0].consecutive + 1;
      suggestion.consecutive = nextConsecutive;
      suggestion.idSuggestion = "APG-SUG-" + nextConsecutive;
    }

    //  Guardar la Sugerencia en BD
    await suggestion.save();

    // LOGICA KAIZEN POINTS
    if (createdBy) {
      await KaizenPoints.findOneAndUpdate(
        { employee: createdBy },
        {
          $inc: { totalPoints: 20 },
          $push: {
            history: {
              activity: "Sugerencia generada",
              reference: suggestion.idSuggestion,
              points: 20,
              date: new Date()
            }
          },
          $setOnInsert: { company: CompanyId }
        },
        {
          upsert: true,
          new: true
        }
      );
    }

    res.status(200).json({
      status: "200",
      message: "Sugerencia guardada correctamente y puntos asignados",
      body: suggestion
    });

  } catch (error) {
    console.error("Error creating suggestion:", error);
    res.status(500).json({
      status: "error",
      message: "Error al guardar la sugerencia",
      error: error.message
    });
  }
};

// OBTENER SUGERENCIAS //////////////////////////////////////////////////////////////////////////////////////////////////////
const getSuggestions = async (req, res) => {
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
  const suggestions = await Suggestion.find({
    company: { $in: CompanyId },
  }).sort({ consecutive: -1 })
    .populate({ path: 'createdBy', select: "name lastName numberEmployee picture", populate: { path: "department position", select: "name" } })
    .populate({ path: 'modifiedBy', select: "name lastName numberEmployee", populate: { path: "department position", select: "name" } })
    .populate({
      path: "investigationId", 
      select: "-suggestionId", 
      populate: {
        path: "q14_advisors", 
        select: "username employee", 
        populate: {
          path: "employee",
          select: "name lastName" 
        }
      }
    });
  res.json({ status: "200", message: "Suggestions Loaded", body: suggestions });
};

// OBTENER PUNTOS DE UN EMPLEADO //////////////////////////////////////////////////////////////////////////////////////////////////////
const getEmployeePoints = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const pointsRecord = await KaizenPoints.findOne({ employee: employeeId });

    if (!pointsRecord) {
      return res.status(404).json({ status: "404", message: "No points found" });
    }

    res.status(200).json({ status: "200", body: pointsRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// FUNCION PARA OBTENER TODOS LOS PUNTOS KAIZEN ////////////////////////////////////////////////////////////////////////////////////////////////////////
const getKaizenPoints = async (req, res) => {
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
  const kaizenPoints = await KaizenPoints.find({
    company: { $in: CompanyId },
  }).sort({ totalPoints: -1 })
    .populate({ path: 'employee', select: "name lastName numberEmployee picture", populate: { path: "department position", select: "name" } })
  res.json({ status: "200", message: "Kaizen Points Loaded", body: kaizenPoints });
};

// FUNCION PARA CREAR UN NUEVO REGISTRO DE PUNTOS KAIZEN //////////////////////////////////////////////////////////////////////////////////////////////////////////
const createNewRegister = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const { CompanyId } = req.params;
    const {
      activity,
      reference,
      points,
      employee
    } = req.body;

    const foundCompany = await Company.findById(CompanyId);
    const foundEmployee = await Employees.findById(employee);

    if (!foundCompany) {
      return res.status(404).json({ status: "error", message: "Compañia no encontrada" });
    }
    if (!foundEmployee) {
      return res.status(404).json({ status: "error", message: "Empleado no encontrado" });
    }

    await KaizenPoints.findOneAndUpdate(
      { employee: employee },
      {
        $inc: { totalPoints: points },
        $push: {
          history: {
            activity: activity,
            reference: reference,
            points: points,
            date: new Date(),
            registeredBy: user._id
          }
        },
        $setOnInsert: { company: CompanyId }
      },
      {
        upsert: true,
        new: true
      }
    );

    res.status(200).json({ status: "200", message: 'Nuevo Registro Creado' });

  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al Crear registro", error: error.message });
  }
}

// FUNCION PARA MODIFICAR PUNTOS MANUALMENTE ///////////////////////////////////////////////////////////////////////////////////////////////////////////
const manualPointsUpdate = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const { CompanyId } = req.params;
    const { RegisterId } = req.params;
    const {
      activity,
      reference,
      points,
      action
    } = req.body;

    if (!reference || !points || !action) {
      return res.status(400).json({ status: "error", message: "Faltan datos requeridos (employeeId, points, action)" });
    }

    const absolutePoints = Math.abs(parseInt(points));

    const finalPoints = action === 'subtract' ? -absolutePoints : absolutePoints;

    const updatedRecord = await KaizenPoints.findOneAndUpdate(
      { _id: RegisterId },
      {
        $inc: { totalPoints: finalPoints },
        $push: {
          history: {
            activity: activity,
            reference: reference,
            points: finalPoints,
            date: new Date(),
            registeredBy: user._id
          }
        },
        $setOnInsert: { company: CompanyId }
      },
      {
        new: true
      }
    );

    res.status(200).json({
      status: "200",
      message: action === 'add' ? "Puntos agregados correctamente" : "Puntos descontados correctamente",
      body: updatedRecord
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Error al actualizar puntos manuales", error: error.message });
  }
};

// FUNCION PARA INICIAR CAMBIO DE PUNTOS KAIZEN /////////////////////////////////////////////////////////////////////////////////////////////////////////////
const createNewRedeem = async (req, res) => {
  try {
    const { CompanyId } = req.params;
    const {
      employee,
      reward,
      points
    } = req.body;
    const currentDate = new Date();
    const pointsValue = Number(points);
    if (isNaN(pointsValue)) {
      return res.status(400).json({ status: "error", message: "El valor de puntos no es válido" });
    }

    const foundCompany = await Company.findById(CompanyId);
    const foundEmployee = await Employees.findById(employee);
    const foundReward = await RewardsKaizen.findById(reward);

    if (!foundCompany) return res.status(404).json({ status: "error", message: "Compañia no encontrada" });
    if (!foundEmployee) return res.status(404).json({ status: "error", message: "Empleado no encontrado" });
    if (!foundReward) return res.status(404).json({ status: "error", message: "Premio no encontrado" });
    if (foundReward.stock <= 0) return res.status(400).json({ status: "error", message: "Premio agotado" });

    const newRedeem = new KaizenPointsRedeem({
      employee,
      reward,
      company: CompanyId,
      registerDate: currentDate,
      redeemStatus: "New"
    });

    await newRedeem.save();

    await KaizenPoints.findOneAndUpdate(
      { employee: employee },
      {
        $inc: { totalPoints: -Math.abs(pointsValue) },
        $push: {
          history: {
            activity: "Cambio de Puntos",
            reference: "En proceso",
            points: -Math.abs(pointsValue),
            date: currentDate
          }
        },
        $setOnInsert: { company: CompanyId }
      },
      {
        upsert: true,
        new: true
      }
    );

    foundReward.stock = foundReward.stock - 1;
    await foundReward.save();

    // Envio de correo para notificar //
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_AUTH_USER,
          pass: process.env.MAIL_AUTH_PASS
        }
      });

      // Formato de fecha legible para el correo
      const dateString = currentDate.toLocaleDateString('es-MX', {
        timeZone: 'America/Mexico_City',
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });

      const mailOptions = {
        from: '"Sistema Kaizen APG" <paperless@apgmexico.mx>', // Remitente
        to: "fabian.ramos@apgmexico.mx", // Destinatario fijo
        subject: `📢 Nuevo Canje de Puntos - ${foundEmployee.name} ${foundEmployee.lastName}`,
        html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #401875;">Solicitud de Canje de Puntos</h2>
                    <p>Se ha registrado una nueva solicitud de canje en el sistema Paperless.</p>
                    <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
                        <tr style="background-color: #f2f2f2;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Empleado:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${foundEmployee.name} ${foundEmployee.lastName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Número Empleado:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${foundEmployee.numberEmployee}</td>
                        </tr>
                        <tr style="background-color: #f2f2f2;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Premio Solicitado:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${foundReward.name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Puntos Canjeados:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${points} pts</td>
                        </tr>
                        <tr style="background-color: #f2f2f2;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Fecha:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${dateString}</td>
                        </tr>
                    </table>
                    <p style="margin-top: 20px;">Por favor, verificar stock físico y proceder con la entrega.</p>
                </div>
            `
      };

      // Enviar el correo
      await transporter.sendMail(mailOptions);
      console.log("Correo de canje enviado");

    } catch (emailError) {
      // Si falla el correo
      console.error("Error enviando correo de canje:", emailError);
    }

    res.status(200).json({ status: "200", message: 'Cambio de puntos en proceso' });

  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al Crear registro", error: error.message });
    console.log(error.message)
  }
}

// FUNCION PARA OBTENR LOS CANJES DE PUNTOS KAIZEN /////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getRedemptions = async (req, res) => {
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
  const redemptions = await KaizenPointsRedeem.find({
    company: { $in: CompanyId },
  }).sort({ totalPoints: -1 })
    .populate({ path: 'employee', select: "name lastName numberEmployee picture", populate: { path: "department position", select: "name" } })
    .populate({ path: 'reward' })
    .populate({ path: "processedBy", select: "employee username", populate: { path: "employee", select: "name lastName" } })
  res.json({ status: "200", message: "Redemptions Loaded", body: redemptions });
};

// FUNCION PARA ACEPTAR O RECHAZAR CANJE DE PUNTOS //////////////////////////////////////////////////////////////////////////////////////////////////////////////
const completeRedeem = async (req, res) => {
  try {
    const { RedemptionId } = req.params;
    const user = await User.findById(req.userId);
    const {
      redeemStatus,
      points,
    } = req.body;
    const currentDate = new Date();
    let pointsToAdd = 0;
    let activityText = "";
    let referenceText = "";
    let updateStock = false;

    // Procesar la firma
    let signatureImgKey = "";
    if (req.files && req.files["signatureImage"] && req.files["signatureImage"].length > 0) {
      signatureImgKey = req.files["signatureImage"][0].key;
    }

    const foundRedemption = await KaizenPointsRedeem.findById(RedemptionId);
    if (!foundRedemption) return res.status(404).json({ status: "error", message: "Rejistro de canje no encontrado" });

    const foundReward = await RewardsKaizen.findById(foundRedemption.reward);
    if (!foundReward) return res.status(404).json({ status: "error", message: "Premio no encontrado" });

    let updateData = {
      $set: {
        redeemStatus: redeemStatus,
        signatureImage: signatureImgKey,
        processedBy: user._id,
      }
    };

    if (redeemStatus === "Rejected") {
      updateData.$set.cancelDate = currentDate;
    } else {
      updateData.$set.redeemDate = currentDate;
    }

    await KaizenPointsRedeem.findOneAndUpdate(
      { _id: RedemptionId },
      updateData,
      {
        new: true
      }
    );

    if (redeemStatus === "Rejected") {
      pointsToAdd = Math.abs(points);
      activityText = "Premio Rechazado";
      referenceText = "Reemboso de puntos";
      updateStock = true;
    } else {
      pointsToAdd = 0;
      activityText = "Cambio Completado";
      referenceText = foundReward.name;
      updateStock = false;
    }

    await KaizenPoints.findOneAndUpdate(
      { employee: foundRedemption.employee._id },
      {
        $inc: { totalPoints: pointsToAdd },
        $push: {
          history: {
            activity: activityText,
            reference: referenceText,
            points: pointsToAdd,
            date: currentDate,
          }
        },
      },
      { new: true }
    );

    if (updateStock) {
      foundReward.stock = foundReward.stock + 1;
      await foundReward.save();
    }

    res.status(200).json({ status: "200", message: 'Cambio de puntos completado' });

  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al Crear registro", error: error.message });
  }
}

// SUBIR UNA INVESTIGACION DE UNA SUGERENCIA ////////////////////////////////////////////////////////////////////////////////////////////////////////
const createInvestigation = async (req, res) => {
  try {
    const { suggestionId } = req.params;
    const body = req.body;

    const existingSuggestion = await Suggestion.findById(suggestionId);

    if (!existingSuggestion) {
      return res.status(404).json({
        status: "404",
        message: "No se encontró la sugerencia especificada. No se puede crear la investigación."
      });
    }

    const files = req.files || {};

    const processSignatureData = (rolePrefix, fileFieldName) => {
      const uploadedFiles = files[fileFieldName];
      const hasFile = uploadedFiles && uploadedFiles.length > 0;

      let data = {
        [`${rolePrefix}Name`]: body[`${rolePrefix}Name`] || null,
      };

      if (hasFile) {
        data[`${rolePrefix}SignatureUrl`] = uploadedFiles[0].key;
        data[`${rolePrefix}Date`] = new Date();
      } else {
        data[`${rolePrefix}SignatureUrl`] = null;
        data[`${rolePrefix}Date`] = null;
      }

      return data;
    };

    const advisorSigData = processSignatureData('advisor', 'advisorSignature');
    const managerSigData = processSignatureData('manager', 'managerSignature');
    const topManagerSigData = processSignatureData('topManager', 'topManagerSignature');

    let parsedAdvisors = [];

    if (body.q14_advisors) {
      if (Array.isArray(body.q14_advisors)) {
        parsedAdvisors = body.q14_advisors;
      } else if (typeof body.q14_advisors === 'string') {
        parsedAdvisors = body.q14_advisors.split(',').map(id => id.trim()).filter(id => id !== '');
      }
    }

    if (parsedAdvisors.length > 0) {
      const foundUsers = await User.find({
        _id: { $in: parsedAdvisors },
      });
      parsedAdvisors = foundUsers.map((user) => user._id);
    }

    const investigationData = {
      ...body,
      suggestionId: suggestionId,
      investigationStatus: body.investigationStatus || "Pending",
      q14_advisors: parsedAdvisors,
      ...advisorSigData,
      ...managerSigData,
      ...topManagerSigData
    };

    const newInvestigation = new KaizenInvestigations(investigationData);
    const savedInvestigation = await newInvestigation.save();

    existingSuggestion.investigationId = savedInvestigation._id;
    await existingSuggestion.save();

    return res.status(200).json({
      status: "200",
      message: "Investigación creada exitosamente",
      data: savedInvestigation
    });

  } catch (error) {
    console.error("Error createInvestigation:", error);
    return res.status(500).json({
      status: "500",
      message: "Error interno",
      error: error.message
    });
  }
};




















//Create new kaizen/////////////////////////////////////////////////////////////////////////////////////////////////////////
const createKaizen = async (req, res) => {
  const { CompanyId } = req.params;

  try {
    const {
      kaizenName,
      createdBy,
      teamKaizen,
      createdDate,
      implementDate,
      implementationCost,
      area,
      implementArea,
      takenPlant,
      savedMoney,
      savedSpace,
      savingsUnmeasured,
      beforeKaizen,
      afterKaizen,
      rpnBefore,
      rpnAfter
    } = req.body;

    //Retreiving the data for each Before Kaizen Image and adding to the schema
    let kaizenImagesB = [];

    if (req.files["kaizenImagesB"]) {
      if (req.files["kaizenImagesB"].length > 0) {
        kaizenImagesB = req.files["kaizenImagesB"].map((file) => {
          return { img: file.key };
        });
      }
    }
    //Retreiving the data for each Before Kaizen Image and adding to the schema
    let kaizenImagesA = [];

    if (req.files["kaizenImagesA"]) {
      if (req.files["kaizenImagesA"].length > 0) {
        kaizenImagesA = req.files["kaizenImagesA"].map((file) => {
          return { img: file.key };
        });
      }
    }

    const parsedSavingsUnmeasured = savingsUnmeasured.split(',')
      .map(item => item.trim())
      .filter(item => item !== '');

    const kaizen = new Kaizen({
      kaizenName,
      teamKaizen,
      createdDate,
      implementDate,
      implementationCost,
      implementArea,
      takenPlant,
      savedMoney,
      savedSpace,
      savingsUnmeasured: parsedSavingsUnmeasured,
      beforeKaizen,
      afterKaizen,
      kaizenImagesB,
      kaizenImagesA,
      rpnBefore,
      rpnAfter
    });

    if (createdBy) {
      const foundEmployee = await Employees.find({
        _id: { $in: createdBy },
      });
      kaizen.createdBy = foundEmployee.map((employee) => employee._id);
      kaizen.modifiedBy = foundEmployee.map((employee) => employee._id);
    }

    if (area) {
      const foundDepartments = await Deparment.find({
        _id: { $in: area },
      });
      kaizen.area = foundDepartments.map((department) => department._id);
    }

    if (CompanyId) {
      const foundCompany = await Company.find({
        _id: { $in: CompanyId },
      });
      kaizen.company = foundCompany.map((company) => company._id);
    }

    const kaizens = await Kaizen.find({
      company: { $in: CompanyId },
    }).sort({ consecutive: -1 }).limit(1);

    if (kaizens.length === 0) {
      kaizen.consecutive = 1;
    } else {
      kaizen.consecutive = kaizens[0].consecutive + 1;
      kaizen.idKaizen = "APG-KZ" + (kaizens[0].consecutive + 1);
    }

    kaizen.status = "New";
    kaizen.montlyRank = "Pending";
    kaizen.observations = "";
    kaizen.version = 2;

    await kaizen.save();

    res.status(200).json({ status: "200", message: "Kaizen guardado exitosamente", body: kaizen });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Error al guardar el kaizen", error: error.message });
  }
};
// Getting all Kaizens//////////////////////////////////////////////////////////////////////////////////////////////////////
const getKaizens = async (req, res) => {
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
  const kaizens = await Kaizen.find({
    company: { $in: CompanyId },
  }).sort({ consecutive: -1 })
    .populate({ path: 'createdBy', select: "name lastName numberEmployee picture", populate: { path: "department position", select: "name" } })
    .populate({ path: 'modifiedBy', select: "name lastName numberEmployee", populate: { path: "department position", select: "name" } })
    .populate({ path: "area", select: "name" });
  res.json({ status: "200", message: "Kaizens Loaded", body: kaizens });
};
// Getting Kaizen by Id////////////////////////////////////////////////////////////////////////////////////////////////////////
const getKaizenById = async (req, res) => {
  const foundKaizen = await Kaizen.findById(req.params.kaizenId);
  if (!foundKaizen) {
    res
      .status(403)
      .json({ status: "403", message: "Kaizen not Founded", body: "" });
  }

  res
    .status(200)
    .json({ status: "200", message: "Kaizen Founded", body: foundKaizen });
};
// Getting Kaizens Filtered///////////////////////////////////////////////////////////////////////////////////////////////////
const getKaizensFiltered = async (req, res) => {
  const { start, end, area, status, createdBy, montlyRank, company } = req.body
  let options = {};

  //Date range filter
  if (req.body.start && req.body.end) {
    if (!options["date"]) options["date"] = {};

    options["date"]["$gte"] = new Date(start);
    options["date"]["$lte"] = new Date(end);
  }
  // Filter by Area
  if (area) {
    options["area"] = area;
  }
  // Filter by Status
  if (status) {
    options["status"] = status
  }
  // Filter Created By
  if (createdBy) {
    options["createdBy"] = createdBy
  }
  // Filter MontlyRank
  if (montlyRank) {
    options["montlyRank"] = montlyRank
  }
  // Filter Company
  if (company) {
    options["company"] = company
  }

  const kaizens = await Kaizen.find(options).sort({ date: -1 });
  res.json({ status: "200", message: "Kaizens Loaded New", body: kaizens });
};
// Updating the Kaizen All data//////////////////////////////////////////////////////////////////////////////////////////////
const updateKaizen = async (req, res) => {
  const { kaizenId } = req.params;
  const {
    kaizenName,
    area,
    implementArea,
    implementDate,
    takenPlant,
    teamKaizen,
    savedMoney,
    savedSpace,
    savingsUnmeasured,
    beforeKaizen,
    afterKaizen,
    status,
    implementationCost,
    modifiedBy,
    observations,
    rpnBefore,
    rpnAfter
  } = req.body;

  let newArea = "";
  let newModifiedBy = "";

  if (area) {
    const foundDepartments = await Deparment.find({
      _id: { $in: area },
    });
    newArea = foundDepartments.map((department) => department._id);
  }

  if (modifiedBy) {
    const foundEmployee = await Employees.find({
      numberEmployee: { $in: modifiedBy },
    });
    newModifiedBy = foundEmployee.map((employee) => employee._id);
  }

  const updatedKaizen = await Kaizen.updateOne(
    { _id: kaizenId },
    {
      $set: {
        kaizenName,
        area: newArea,
        implementArea,
        implementDate,
        takenPlant,
        teamKaizen,
        savedMoney,
        savedSpace,
        savingsUnmeasured,
        beforeKaizen,
        afterKaizen,
        status,
        implementationCost,
        modifiedBy: newModifiedBy,
        observations,
        rpnBefore,
        rpnAfter
      },
    }
  );

  if (!updatedKaizen) {
    res
      .status(403)
      .json({ status: "403", message: "Kaizen not Updated", body: "" });
  }

  res
    .status(200)
    .json({ status: "200", message: "Kaizen Updated ", body: updatedKaizen });
};
// Updating the Kaizen status/////////////////////////////////////////////////////////////////////////////////
const updateKaizenStatus = async (req, res) => {
  const { kaizenId } = req.params;
  const { status, observations, montlyRank, lastModifyBy } = req.body;

  const updatedKaizenStatus = await Kaizen.updateOne(
    { _id: kaizenId },
    {
      $set: {
        status,
        observations,
        montlyRank,
        lastModifyBy,
      },
    }
  );

  if (!updatedKaizenStatus) {
    res
      .status(403)
      .json({ status: "403", message: "Kaizen Status not Updated", body: "" });
  }

  res.status(200).json({
    status: "200",
    message: "Kaizen Status Updated ",
    body: updatedKaizenStatus,
  });
};
// Function to modify the Images from a Kaizen/////////////////////////////////////////////////////////////////////
const modifyKaizenImg = async (req, res) => {
  const { kaizenId } = req.params;
  //Getting Previous Images
  const foundPrevKaizen = await Kaizen.findById(kaizenId);

  const rawExistingImagesB = req.body.existingKaizenImagesB;
  const rawExistingImagesA = req.body.existingKaizenImagesA;

  let processedExistingImagesB = [];
  let processedExistingImagesA = [];

  // console.log("Tipo de existingKaizenImagesB recibido:", typeof rawExistingImagesB);
  // console.log("Valor de existingKaizenImagesB recibido:", rawExistingImagesB);

  // Procesar existingKaizenImagesB
  if (typeof rawExistingImagesB === 'string' && rawExistingImagesB.trim() !== '') {
    processedExistingImagesB = rawExistingImagesB.split(',')
      .map(filename => filename.trim())
      .filter(filename => filename !== '');
  } else if (Array.isArray(rawExistingImagesB)) {
    processedExistingImagesB = rawExistingImagesB
      .filter(item => typeof item === 'string')
      .map(filename => filename.trim())
      .filter(filename => filename !== '');
  }

  // Procesar existingKaizenImagesA
  if (typeof rawExistingImagesA === 'string' && rawExistingImagesA.trim() !== '') {
    processedExistingImagesA = rawExistingImagesA.split(',')
      .map(filename => filename.trim())
      .filter(filename => filename !== '');
  } else if (Array.isArray(rawExistingImagesA)) {
    processedExistingImagesA = rawExistingImagesA
      .filter(item => typeof item === 'string')
      .map(filename => filename.trim())
      .filter(filename => filename !== '');
  }

  // console.log("Imágenes Existentes B (procesadas en API):", processedExistingImagesB);
  // console.log("Imágenes Existentes A (procesadas en API):", processedExistingImagesA);

  let updatedKaizenImagesB = [];
  let updatedKaizenImagesA = [];

  if (foundPrevKaizen && Array.isArray(foundPrevKaizen.kaizenImagesB)) {
    foundPrevKaizen.kaizenImagesB.forEach(dbImageObject => {
      if (dbImageObject && typeof dbImageObject.img === 'string') {
        const dbImageFilename = dbImageObject.img;
        if (processedExistingImagesB.includes(dbImageFilename)) {
          // console.log(`CONSERVAR (B): La imagen '${dbImageFilename}' coincide y se conserva.`);
          updatedKaizenImagesB.push({ img: dbImageFilename });
        } else {
          // console.log(`ELIMINAR (B): La imagen '${dbImageFilename}' fue eliminada por el usuario.`);
          const params = {
            Bucket: process.env.S3_BUCKET_NAME + "/Uploads/KaizenImgs",
            Key: dbImageFilename
          };
          try {
            s3.deleteObject(params, function (err, data) {
              if (err) console.log(err);
            });
          } catch (error) {
            res.status(403).json({
              status: "403",
              message: error,
              body: "",
            });
          }
        }
      }
    });
  }

  if (foundPrevKaizen && Array.isArray(foundPrevKaizen.kaizenImagesA)) {
    foundPrevKaizen.kaizenImagesA.forEach(dbImageObject => {
      if (dbImageObject && typeof dbImageObject.img === 'string') {
        const dbImageFilename = dbImageObject.img;
        if (processedExistingImagesA.includes(dbImageFilename)) {
          // console.log(`CONSERVAR (B): La imagen '${dbImageFilename}' coincide y se conserva.`);
          updatedKaizenImagesA.push({ img: dbImageFilename });
        } else {
          // console.log(`ELIMINAR (B): La imagen '${dbImageFilename}' fue eliminada por el usuario.`);
          const params = {
            Bucket: process.env.S3_BUCKET_NAME + "/Uploads/KaizenImgs",
            Key: dbImageFilename
          };
          try {
            s3.deleteObject(params, function (err, data) {
              if (err) console.log(err);
            });
          } catch (error) {
            res.status(403).json({
              status: "403",
              message: error,
              body: "",
            });
          }
        }
      }
    });
  }

  // Deleting Images from Folder for KaizenB
  // const prevKaizenImagesB = foundPrevKaizen.kaizenImagesB;
  // if (prevKaizenImagesB) {
  //   // Validating if there are Images in the Field
  //   if (prevKaizenImagesB.length > 0) {
  //     prevKaizenImagesB.map((file) => {
  //       // Delete File from Folder
  //       const params = {
  //         Bucket: process.env.S3_BUCKET_NAME + "/Uploads/KaizenImgs",
  //         Key: file.img
  //       };
  //       try {
  //         s3.deleteObject(params, function (err, data) {
  //           if (err) console.log(err);
  //         });
  //       } catch (error) {
  //         res.status(403).json({
  //           status: "403",
  //           message: error,
  //           body: "",
  //         });
  //       }
  //     });
  //   }
  // }
  // Deleting Images from Folder for KaizenA
  // const prevKaizenImagesA = foundPrevKaizen.kaizenImagesA;
  // if (prevKaizenImagesA) {
  //   // Validating if there are Images in the Field
  //   if (prevKaizenImagesA.length > 0) {
  //     prevKaizenImagesA.map((file) => {
  //       // Delete File from Folder
  //       const params = {
  //         Bucket: process.env.S3_BUCKET_NAME + "/Uploads/KaizenImgs",
  //         Key: file.img
  //       };
  //       try {
  //         s3.deleteObject(params, function (err, data) {
  //           if (err) console.log(err);
  //         });
  //       } catch (error) {
  //         res.status(403).json({
  //           status: "403",
  //           message: error,
  //           body: "",
  //         });
  //       }
  //     });
  //   }
  // }
  // Setting the Fields Empty in the DB
  // const updateClearImgKaizen = await Kaizen.updateOne(
  //   { _id: kaizenId },
  //   { $set: { kaizenImagesB: [], kaizenImagesA: [] } }
  // );

  // if (!updateClearImgKaizen) {
  //   res.status(403).json({
  //     status: "403",
  //     message: "Kaizen not Updated - updateClearImgKaizen",
  //     body: "",
  //   });
  // }
  //Retreiving the data for each Before Kaizen Image and adding to the schema

  if (req.files["kaizenImagesB"]) {
    if (req.files["kaizenImagesB"].length > 0) {
      const newUploadedImagesB = req.files["kaizenImagesB"].map((file) => {
        return { img: file.key };
      });
      updatedKaizenImagesB = updatedKaizenImagesB.concat(newUploadedImagesB);
    }
  }
  //Retreiving the data for each Before Kaizen Image and adding to the schema

  if (req.files["kaizenImagesA"]) {
    if (req.files["kaizenImagesA"].length > 0) {
      const newUploadedImagesA = req.files["kaizenImagesA"].map((file) => {
        return { img: file.key };
      });
      updatedKaizenImagesA = updatedKaizenImagesA.concat(newUploadedImagesA);
    }
  }
  // Updating the new Img Names in the fields from the DB
  const updateImgKaizen = await Kaizen.updateOne(
    { _id: kaizenId },
    {
      $set: {
        kaizenImagesB: updatedKaizenImagesB,
        kaizenImagesA: updatedKaizenImagesA
      }
    }
  );

  if (!updateImgKaizen) {
    res.status(403).json({
      status: "403",
      message: "Kaizen not Updated - updateImgKaizen",
      body: "",
    });
  }

  const foundKaizenNew = await Kaizen.findById(kaizenId);

  res.status(200).json({
    status: "200",
    message: "Kaizen Updated",
    body: foundKaizenNew,
  });
};
//delete kaizen/////////////////////////////////////////////////////////////////////////////////////////////////////
const deleteKaizen = async (req, res) => {
  const { kaizenId } = req.params;
  const foundPrevKaizen = await Kaizen.findById(kaizenId);

  // Deleting Images from Folder for KaizenB
  const prevKaizenImagesB = foundPrevKaizen.kaizenImagesB;
  if (prevKaizenImagesB) {
    // Validating if there are Images in the Field
    if (prevKaizenImagesB.length > 0) {
      prevKaizenImagesB.map((file) => {
        // Delete File from Folder
        const params = {
          Bucket: process.env.S3_BUCKET_NAME + "/Uploads/KaizenImgs",
          Key: file.img
        };
        try {
          s3.deleteObject(params, function (err, data) {
            if (err) console.log(err);
          });
        } catch (error) {
          res.status(403).json({
            status: "403",
            message: error,
            body: "",
          });
        }
      });
    }
  }
  // Deleting Images from Folder for KaizenA
  const prevKaizenImagesA = foundPrevKaizen.kaizenImagesA;
  if (prevKaizenImagesA) {
    // Validating if there are Images in the Field
    if (prevKaizenImagesA.length > 0) {
      prevKaizenImagesA.map((file) => {
        // Delete File from Folder
        const params = {
          Bucket: process.env.S3_BUCKET_NAME + "/Uploads/KaizenImgs",
          Key: file.img
        };
        try {
          s3.deleteObject(params, function (err, data) {
            if (err) console.log(err);
          });
        } catch (error) {
          res.status(403).json({
            status: "403",
            message: error,
            body: "",
          });
        }
      });
    }
  }

  Kaizen.findById(kaizenId, function (err, kaizen) {
    if (err) {
      res.status(503).json({
        status: "403",
        message: err,
      });
      return;
    }
    kaizen.remove(
      res.status(200).json({
        status: "200",
        message: 'The kaizen has been deleted',
      }));
  });
};



















module.exports = {
  createKaizen,
  getKaizens,
  getKaizenById,
  getKaizensFiltered,
  updateKaizen,
  updateKaizenStatus,
  modifyKaizenImg,
  deleteKaizen,
  createSuggestion,
  getEmployeePoints,
  getSuggestions,
  getKaizenPoints,
  createNewRegister,
  manualPointsUpdate,
  createNewRedeem,
  getRedemptions,
  completeRedeem,
  createInvestigation
};