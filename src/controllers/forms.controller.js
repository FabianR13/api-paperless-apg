const Dashboard = require("../models/Dashboard.js");
const Forms = require("../models/Forms.js");

// Forms that are shown in the Dashboard//////////////////////////////////////////////////////////////////////////////////////////
const createForms = async (req, res) => {
  const { name, description, back, dashboard } = req.body;

  const newForm = new Forms({ name, description, back });

  //Buscar dashboar y agregar el id al form
  if (dashboard) {
    const foundDashboard = await Dashboard.find({ name: { $in: dashboard } });
    newForm.dashboard = foundDashboard.map((dashboard) => dashboard._id);
  }

  const formSaved = await newForm.save().sort({ pos: 1 });

  res.status(201).json(formSaved);
};
///Metodo para obtener forms//////////////////////////////////////////////////////////////////////////////////////////////////////
const getForms = async (req, res) => {
  const forms = await Forms.find();
  res.json(forms);
};
// Get Dashboard Cards by Category///////////////////////////////////////////////////////////////////////////////////////////////
const getDashboardById = async (req, res) => {
  const foundForms = await Forms.find({ dashboard: { $in: req.params.formsId } }).populate({ path: "dashboard", select: "name" })
  res.status(200).json({ status: "200", message: "Forms Loaded", body: foundForms });
};
//Mostrar forms de general //////////////////////////////////////////////////////////////////////////////////////////////////////
const getFormsbyGeneral = async (req, res) => {
  const { dashboardId } = req.body;

  const foundDashboard = await Dashboard.find({ name: { $in: "General" } });
  const [result] = foundDashboard;

  const foundForms = await Forms.find({
    dashboard: { $in: result._id },
  }).populate({ path: "dashboard", select: "name" });
  res.json(foundForms);
};

module.exports = {
  createForms,
  getForms,
  getDashboardById,
  getFormsbyGeneral
};