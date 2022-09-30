const Dashboard = require("../models/Dashboard.js");
const Forms = require("../models/Forms.js");
// import Dashboard from "../models/Dashboard.js";
// import Forms from "../models/Forms.js";
//import Form from "../models/Forms";

// Forms that are shown in the Dashboard
const createForms = async (req, res) => {
  const { name, description,back, dashboard } = req.body;

  const newForm = new Forms({ name, description ,back});

  if (dashboard) {
    const foundDashboard = await Dashboard.find({ name: { $in: dashboard } });
    newForm.dashboard = foundDashboard.map((dashboard) => dashboard._id);
  }

  const formSaved = await newForm.save();

  res.status(201).json(formSaved);
};

const getForms = async (req, res) => {
  const forms = await Forms.find();
  res.json(forms);
};

// Forms by Dashboard Category
// export const getFormsbyCategory = async (req, res) => {
//   const { dashboardId, dashboard } = req.body;

//   console.log(dashboardId);

//   const foundDashboard = await Form.find({
//     dashboard: { $in: dashboardId },
//   }).populate({ path: "dashboard", select: "name" });
//   res.json(foundDashboard);

// };

// Get Dashboard Cards by Category
const getDashboardById = async (req, res) => {
  const foundForms = await Forms.find({dashboard: {$in: req.params.formsId}}).populate({path:"dashboard", select: "name"})
  res.status(200).json({status: "200", message: "Forms Loaded", body: foundForms});
};

const getFormsbyGeneral = async (req, res) => {
  const { dashboardId } = req.body;

  console.log(dashboardId);

  const foundDashboard = await Dashboard.find({ name: { $in: "General" } });
  const [result] = foundDashboard;

  const foundForms = await Forms.find({
    dashboard: { $in: result._id },
  }).populate({ path: "dashboard", select: "name" });
  res.json(foundForms);
};

// export const getFormById = async (req, res) => {
//   const form = await Form.findById(req.params.formId);
//   res.status(200).json(form);
// };

// export const updateFormById = async (req, res) => {
//   const updatedForm = await Form.findByIdAndUpdate(
//     req.params.formId,
//     req.body,
//     {
//       new: true,
//     }
//   );
//   res.status(200).json(updatedForm);
// };

// export const deleteFormById = async (req, res) => {
//   const { formId } = req.params;
//   const deleteForm = await Form.findByIdAndDelete(formId);
//   res.status(204).json();
// };

module.exports ={
  createForms,
  getForms,
  getDashboardById,
  getFormsbyGeneral
};