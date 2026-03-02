const Company = require('../models/Company.js');

const Report = require('../models/reports.js');

const User = require('../models/User.js'); // CREAR NUEVO TEMPLATE DE REPORTE ////////////////////////////////////////////////////////////////////////////////////////////////////


const saveTemplate = async (req, res) => {
  const {
    CompanyId
  } = req.params;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({
    status: "error",
    message: "Error al buscar usuario"
  });

  try {
    const {
      category,
      reportMeta,
      widgets
    } = req.body; // Validations

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required."
      });
    }

    const foundCompany = await Company.findById(CompanyId);
    if (!foundCompany) return res.status(404).json({
      status: "error",
      message: "Compañia no encontrada"
    }); // Create new template instance

    const newTemplate = new Report({
      category,
      reportMeta,
      widgets,
      createdBy: user._id,
      company: CompanyId
    });
    const savedTemplate = await newTemplate.save();
    return res.status(200).json({
      status: "200",
      message: 'Template saved successfully',
      body: savedTemplate
    });
  } catch (error) {
    console.error("Error saving template:", error);
    return res.status(500).json({
      success: false,
      message: 'Server error while saving template',
      error: error.message
    });
  }
}; // OBTENER TODOS LOS TEMPLATES DE REPORTES /////////////////////////////////////////////////////////////////////////////////////////////////////


const getReports = async (req, res) => {
  const {
    CompanyId
  } = req.params; // Validación básica de ID

  if (!CompanyId || CompanyId.length !== 24) {
    return res.status(400).json({
      status: "error",
      message: "Invalid Company ID"
    });
  }

  try {
    const company = await Company.find({
      _id: {
        $in: CompanyId
      }
    });

    if (!company || company.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Company not found"
      });
    }

    const reports = await Report.find({
      company: {
        $in: CompanyId
      }
    }).sort({
      createdAt: -1
    }).populate({
      path: 'createdBy',
      // Quien creó la desviación
      populate: [{
        path: 'signature',
        model: 'Signature'
      }, {
        path: 'employee',
        model: 'Employees',
        populate: {
          path: 'department',
          model: 'Department'
        }
      }]
    });
    res.json({
      status: "200",
      message: "Reports Loaded",
      body: reports
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error loading deviations"
    });
  }
};

module.exports = {
  saveTemplate,
  getReports
};