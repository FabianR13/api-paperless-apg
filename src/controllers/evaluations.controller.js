const Company = require("../models/Company");
const Employees = require("../models/Employees");
const Checklist = require("../models/Checklist");
const ErrorProofing = require("../models/ErrorProofing");
const TrialEvaluations = require("../models/TrialEvaluations");
const User = require("../models/User");

// Getting all deviations request/////////////////////////////////////////////////////////////////////////////////////////////////////
const getTrialEvaluations = async (req, res) => {
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
    const trialEvaluations = await TrialEvaluations.find({
        company: { $in: CompanyId },
    }).sort({ createdAt: -1 })
        .populate({
            path: "safetyResponsible",
            select: "employee username signature",
            populate: [
                {
                    path: "employee",
                    select: "name lastName"
                },
                {
                    path: "signature",
                    select: "signature"
                }
            ]
        })
        .populate({
            path: "trainingResponsible",
            select: "employee username signature",
            populate: [
                {
                    path: "employee",
                    select: "name lastName"
                },
                {
                    path: "signature",
                    select: "signature"
                }
            ]
        })
        .populate({
            path: "humanResourcesResponsible",
            select: "employee username signature",
            populate: [
                {
                    path: "employee",
                    select: "name lastName"
                },
                {
                    path: "signature",
                    select: "signature"
                }
            ]
        })
        .populate({
            path: "humanResources",
            select: "employee username signature",
            populate: [
                {
                    path: "employee",
                    select: "name lastName"
                },
                {
                    path: "signature",
                    select: "signature"
                }
            ]
        })
        .populate({
            path: "cmcap",
            select: "employee username signature",
            populate: [
                {
                    path: "employee",
                    select: "name lastName"
                },
                {
                    path: "signature",
                    select: "signature"
                }
            ]
        })
        .populate({
            path: "directManager",
            select: "employee username signature",
            populate: [
                {
                    path: "employee",
                    select: "name lastName"
                },
                {
                    path: "signature",
                    select: "signature"
                }
            ]
        })
        .populate({
            path: "employee",
            select: "name lastName numberEmployee startDate department",
            populate: { path: "department", select: "name" }
        })
    res.json({ status: "200", message: "Trial Evaluations Loaded", body: trialEvaluations });
};

const createNewTrialEvaluation = async (req, res) => {
    try {
        const { CompanyId } = req.params;

        const {
            trialEvaluationName,
            evaluationDate,
            employee,
            knowledge,
            performance,
            approvals,
            directManager,
            version
        } = req.body;

        const newTrialEvaluation = new TrialEvaluations({
            trialEvaluationName,
            evaluationDate,
            knowledge,
            performance,
            approvals,
            version
        });

        if (employee.length > 0) {
            const foundEmployee = await Employees.findOne({
                numberEmployee: { $in: employee },
            });
            if (!foundEmployee) {
                return res.status(404).json({ message: "Empleado no encontrado" });
            }
            newTrialEvaluation.employee = foundEmployee._id;
        }

        if (directManager.length > 0) {
            const foundUser = await User.findOne({
                username: { $in: directManager },
            });
            if (!foundUser) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            newTrialEvaluation.directManager = foundUser._id;
        }

        if (CompanyId) {
            const foundCompany = await Company.findById(CompanyId);
            if (!foundCompany) {
                return res.status(404).json({ message: "Compañía no encontrada" });
            }
            newTrialEvaluation.company = foundCompany._id;
        }

        const count = await TrialEvaluations.estimatedDocumentCount();

        if (count > 1) {
            const trialEvaluations = await TrialEvaluations.find().sort({ consecutive: -1 }).limit(1);
            newTrialEvaluation.consecutive = trialEvaluations[0].consecutive + 1;
        } else {
            newTrialEvaluation.consecutive = 1
        }

        await newTrialEvaluation.save()
        console.log("aqui")
        res.status(200).json({ status: "200", message: 'Guardado con exito' });

    } catch (error) {
        console.error("Error al crear la evaluación:", error); // Para ti, en el servidor
        res.status(500).json({ message: "Ocurrió un error interno al guardar la evaluación." }); // Para el cliente
    }
}

const updateTrialEvaluation = async (req, res) => {
    const findUserIds = async (usernames) => {
        if (!usernames) {
            return null;
        }
        const foundUsers = await User.find({ username: { $in: usernames } });
        if (foundUsers.length < 0) {
            throw new Error("User not found");
        }
        return foundUsers.map(user => user._id);
    };

    try {
        const { TrialEvaluationID } = req.params;
        const { body } = req;

        const fieldsToUpdate = {};
        console.log(body)
        const simpleFields = ['approvals', 'safety', 'training', 'disciplinaryActions', 'attendanceRecord'];
        for (const field of simpleFields) {
            if (body[field] !== undefined) {
                fieldsToUpdate[field] = body[field];
            }
        }
        console.log(body.safetyResponsible)
        if (body.safetyResponsible) {
            fieldsToUpdate.safetyResponsible = await findUserIds(body.safetyResponsible);
        }
        if (body.trainingResponsible) {
            fieldsToUpdate.trainingResponsible = await findUserIds(body.trainingResponsible);
        }
        if (body.humanResourcesResponsible) {
            fieldsToUpdate.humanResourcesResponsible = await findUserIds(body.humanResourcesResponsible);
        }
        if (body.humanResources) {
            fieldsToUpdate.humanResources = await findUserIds(body.humanResources);
        }
        if (body.cmcap) {
            fieldsToUpdate.cmcap = await findUserIds(body.cmcap);
        }

        Object.keys(fieldsToUpdate).forEach(key => {
            if (fieldsToUpdate[key] === null) {
                delete fieldsToUpdate[key];
            }
        });

        if (Object.keys(fieldsToUpdate).length > 0) {
            await TrialEvaluations.updateOne(
                { _id: TrialEvaluationID },
                { $set: fieldsToUpdate }
            );
            res.status(200).json({ status: "200", message: "Evaluación actualizada correctamente." });
        } else {
            res.status(200).json({ status: "200", message: "No se enviaron campos para actualizar." });
        }

    } catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({ status: "error", message: "Uno o más usuarios no fueron encontrados." });
        }
        res.status(500).json({ status: "error", message: error.message });
    }
};

const updateEmployeeSignature = async (req, res) => {
  const { TrialEvaluationID } = req.params;
  //Getting Previous Images
  const foundPrevEvaluation = await TrialEvaluations.findById(TrialEvaluationID);

  // Deleting Images from Folder
  const prevEmployeeSign = foundPrevEvaluation.employeeSignature;
  if (prevEmployeeSign) {
    // Validating if there are Images in the Field
    // Delete File from Folder
    const params = {
      Bucket: process.env.S3_BUCKET_NAME + "/Uploads/EvaluationSignatures",
      Key: prevEmployeeSign
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

  // Setting the Fields Empty in the DB
  const updateClearSignEmployee = await TrialEvaluations.updateOne(
    { _id: TrialEvaluationID },
    { $set: { employeeSignature: "" } }
  );

  if (!updateClearSignEmployee) {
    res.status(403).json({
      status: "403",
      message: "La firma no se guardo corectamente",
      body: "",
    });
  }

  //Retreiving the data for each profile Image and adding to the schema
  let employeeSignature = "";

  if (req.file) {
    employeeSignature = req.file.key;
  }

  // Updating the new Img Names in the fields from the DB
  const updateSignEmployee = await TrialEvaluations.updateOne(
    { _id: TrialEvaluationID },
    { $set: { employeeSignature } }
  );

  if (!updateSignEmployee) {
    res.status(403).json({
      status: "403",
      message: "Firma no actualizada",
      body: "",
    });
  }

  const foundEvaluationNew = await TrialEvaluations.findById(TrialEvaluationID);

  res.status(200).json({
    status: "200",
    message: "Signature Updated",
    body: foundEvaluationNew,
  });
};

module.exports = {
    getTrialEvaluations,
    createNewTrialEvaluation,
    updateTrialEvaluation,
    updateEmployeeSignature
};