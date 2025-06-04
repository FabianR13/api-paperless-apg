// Controlador para el Kaizen
const Company = require("../models/Company.js");
const AWS = require('aws-sdk');
const Dashboard = require("../models/Dashboard.js");
const Forms = require("../models/Forms.js");
const Faq = require("../models/IT/Faq.js");
const User = require("../models/User.js");

AWS.config.update({
  region: process.env.S3_BUCKET_REGION,
  apiVersion: 'latest',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  }
})

const s3 = new AWS.S3();

//Create new kaizen/////////////////////////////////////////////////////////////////////////////////////////////////////////
const createFaq = async (req, res) => {
  const { CompanyId } = req.params;

  const {
    category,
    subCategory,
    title,
    subtitle,
    createdBy,
    modifiedBy,
    version,
    steps,
  } = req.body;

  //Retreiving the data for each Before Kaizen Image and adding to the schema
  let images = [];

  if (req.files && req.files.length > 0) {
    images = req.files.map((file, index) => {
      const stepIdFieldName = `images[${index}][stepId]`;
      const stepId = req.body[stepIdFieldName]; // Obtener el stepId del body
      return {
        img: file.key, // Clave de S3
        stepId: stepId   // ID del paso al que pertenece esta imagen
      };
    });
  }

  if (steps) {
    try {
      parsedSteps = JSON.parse(steps);
      if (!Array.isArray(parsedSteps)) {
        console.warn("El campo 'steps' parseado no es un array. Se guardará como array vacío o se manejará el error.");
      }
    } catch (error) {
      console.error("Error al parsear 'steps' JSON:", error);
      return res.status(400).json({ status: "400", message: "Error al procesar los pasos (formato JSON inválido)." });
    }
  }

  const newFaq = new Faq({
    title,
    subtitle,
    version,
    steps: parsedSteps,
    images
  });

  if (category) {
    const foundUsers = await Dashboard.find({
      _id: { $in: category },
    });
    newFaq.category = foundUsers.map((user) => user._id);
  }

  if (subCategory) {
    const foundUsers = await Forms.find({
      _id: { $in: subCategory },
    });
    newFaq.subCategory = foundUsers.map((user) => user._id);
  }

  if (modifiedBy) {
    const foundUsers = await User.find({
      username: { $in: modifiedBy },
    });
    newFaq.modifiedBy = foundUsers.map((user) => user._id);
  }

  if (createdBy) {
    const foundUsers = await User.find({
      username: { $in: createdBy },
    });
    newFaq.createdBy = foundUsers.map((user) => user._id);
  }

  if (CompanyId) {
    const foundCompany = await Company.find({
      _id: { $in: CompanyId },
    });
    newFaq.company = foundCompany.map((company) => company._id);
  }

  newFaq.save((error, newFaq) => {
    if (error) return res.status(400).json({ status: "400", message: error });
    if (newFaq) {
      res.json({ status: "200", message: "Faq Created", body: newFaq });
    }
  });
};

// Getting all faqs/////////////////////////////////////////////////////////////////////////////////////////////////////
const getAllFaqs = async (req, res) => {

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
  const faqs = await Faq.find({
    company: { $in: CompanyId },
  }).sort({ createdAt: -1 })
  res.json({ status: "200", message: "Faqs Loaded", body: faqs });
};

module.exports = {
  createFaq,
  getAllFaqs
}