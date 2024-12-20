const DeviationRiskAssesment = require("../../../models/General/DeviationRiskAssessment.js");

const Company = require("../../../models/Company.js"); //create new devition risk//////////////////////////////////////////////////////////////////////////////////////////////


const createDeviationRisk = async (req, res, next) => {
  const {
    deviationNumber,
    reason,
    consequence,
    productRisk,
    productMitigate,
    productPerson,
    productDueDate1,
    productDueDate2,
    productDueDate3,
    productDueDate4,
    processRisk,
    processMitigate,
    processPerson,
    processDueDate1,
    processDueDate2,
    processDueDate3,
    processDueDate4,
    correctiveEliminate,
    correctivePerson,
    correctiveDueDate1,
    correctiveDueDate2,
    correctiveDueDate3,
    correctiveDueDate4,
    preventiveEliminate,
    preventivePerson,
    preventiveDueDate1,
    preventiveDueDate2,
    preventiveDueDate3,
    preventiveDueDate4,
    deviationGranted,
    otherGranted,
    qualitySign,
    dateQualitySign,
    qualitySignStatus,
    productionSign,
    dateProductionSign,
    productionSignStatus,
    processSign,
    dateProcessSign,
    processSignStatus,
    automationSign,
    dateAutomationSign,
    automationSignStatus,
    seniorSign,
    dateSeniorSign,
    seniorSignStatus,
    customerSign,
    dateCustomerSign,
    customerSignStatus,
    correctiveResults,
    correctivePersonFollow,
    correctiveDateFollow1,
    correctiveDateFollow2,
    correctiveDateFollow3,
    correctiveDateFollow4,
    preventiveResults,
    preventivePersonFollow,
    preventiveDateFollow1,
    preventiveDateFollow2,
    preventiveDateFollow3,
    preventiveDateFollow4,
    effectiveness,
    approvedByDate,
    company
  } = req.body;
  const deviationriskassessment = new DeviationRiskAssesment({
    deviationNumber,
    reason,
    consequence,
    productRisk,
    productMitigate,
    productPerson,
    productDueDate1,
    productDueDate2,
    productDueDate3,
    productDueDate4,
    processRisk,
    processMitigate,
    processPerson,
    processDueDate1,
    processDueDate2,
    processDueDate3,
    processDueDate4,
    correctiveEliminate,
    correctivePerson,
    correctiveDueDate1,
    correctiveDueDate2,
    correctiveDueDate3,
    correctiveDueDate4,
    preventiveEliminate,
    preventivePerson,
    preventiveDueDate1,
    preventiveDueDate2,
    preventiveDueDate3,
    preventiveDueDate4,
    deviationGranted,
    otherGranted,
    qualitySign,
    dateQualitySign,
    qualitySignStatus,
    productionSign,
    dateProductionSign,
    productionSignStatus,
    processSign,
    dateProcessSign,
    processSignStatus,
    automationSign,
    dateAutomationSign,
    automationSignStatus,
    seniorSign,
    dateSeniorSign,
    seniorSignStatus,
    customerSign,
    dateCustomerSign,
    customerSignStatus,
    correctiveResults,
    correctivePersonFollow,
    correctiveDateFollow1,
    correctiveDateFollow2,
    correctiveDateFollow3,
    correctiveDateFollow4,
    preventiveResults,
    preventivePersonFollow,
    preventiveDateFollow1,
    preventiveDateFollow2,
    preventiveDateFollow3,
    preventiveDateFollow4,
    effectiveness,
    approvedByDate
  });

  if (company) {
    const foundCompany = await Company.find({
      _id: {
        $in: company
      }
    });
    deviationriskassessment.company = foundCompany.map(company => company._id);
  }

  const savedDeviationRisk = await deviationriskassessment.save();

  if (!savedDeviationRisk) {
    res.status(403).json({
      status: "403",
      message: "Deviation not Saved",
      body: ""
    });
  }

  next(); //res.json({ status: "200", message: "Deviation risk assesmen is created", savedDeviationRisk });
}; //update all data deviation risk assessment/////////////////////////////////////////////////////////////////////////////////////////


const updateDeviationRisk = async (req, res) => {
  const {
    deviationRiskId
  } = req.params;
  const {
    reason,
    consequence,
    productRisk,
    productMitigate,
    productPerson,
    productDueDate1,
    productDueDate2,
    productDueDate3,
    productDueDate4,
    processRisk,
    processMitigate,
    processPerson,
    processDueDate1,
    processDueDate2,
    processDueDate3,
    processDueDate4,
    correctiveEliminate,
    correctivePerson,
    correctiveDueDate1,
    correctiveDueDate2,
    correctiveDueDate3,
    correctiveDueDate4,
    preventiveEliminate,
    preventivePerson,
    preventiveDueDate1,
    preventiveDueDate2,
    preventiveDueDate3,
    preventiveDueDate4,
    qualitySign,
    qualitySignStatus,
    productionSign,
    productionSignStatus,
    processSign,
    processSignStatus,
    automationSign,
    automationSignStatus,
    seniorSign,
    seniorSignStatus,
    customerSign,
    customerSignStatus,
    correctiveResults,
    correctivePersonFollow,
    correctiveDateFollow1,
    correctiveDateFollow2,
    correctiveDateFollow3,
    correctiveDateFollow4,
    preventiveResults,
    preventivePersonFollow,
    preventiveDateFollow1,
    preventiveDateFollow2,
    preventiveDateFollow3,
    preventiveDateFollow4
  } = req.body;
  const updatedDeviationRisk = await DeviationRiskAssesment.updateOne({
    _id: deviationRiskId
  }, {
    $set: {
      reason,
      consequence,
      productRisk,
      productMitigate,
      productPerson,
      productDueDate1,
      productDueDate2,
      productDueDate3,
      productDueDate4,
      processRisk,
      processMitigate,
      processPerson,
      processDueDate1,
      processDueDate2,
      processDueDate3,
      processDueDate4,
      correctiveEliminate,
      correctivePerson,
      correctiveDueDate1,
      correctiveDueDate2,
      correctiveDueDate3,
      correctiveDueDate4,
      preventiveEliminate,
      preventivePerson,
      preventiveDueDate1,
      preventiveDueDate2,
      preventiveDueDate3,
      preventiveDueDate4,
      qualitySign,
      qualitySignStatus,
      productionSign,
      productionSignStatus,
      processSign,
      processSignStatus,
      automationSign,
      automationSignStatus,
      seniorSign,
      seniorSignStatus,
      customerSign,
      customerSignStatus,
      correctiveResults,
      correctivePersonFollow,
      correctiveDateFollow1,
      correctiveDateFollow2,
      correctiveDateFollow3,
      correctiveDateFollow4,
      preventiveResults,
      preventivePersonFollow,
      preventiveDateFollow1,
      preventiveDateFollow2,
      preventiveDateFollow3,
      preventiveDateFollow4
    }
  });

  if (!updatedDeviationRisk) {
    res.status(403).json({
      status: "403",
      message: "Deviation Risk not updated",
      body: ""
    });
  }

  res.status(200).json({
    status: "200",
    message: "Deviation Risk updated",
    body: updatedDeviationRisk
  });
}; // Updating deviation status//////////////////////////////////////////////////////////////////////////////////////////////////////////


const updateDeviationRiskSignature = async (req, res) => {
  const {
    deviationRiskId
  } = req.params;
  const {
    deviationGranted,
    otherGranted,
    qualitySign,
    qualitySignStatus,
    dateQualitySign,
    productionSign,
    productionSignStatus,
    dateProductionSign,
    processSign,
    processSignStatus,
    dateProcessSign,
    automationSign,
    automationSignStatus,
    dateAutomationSign,
    seniorSign,
    seniorSignStatus,
    dateSeniorSign
  } = req.body;
  const updatedDeviationRisk = await DeviationRiskAssesment.updateOne({
    _id: deviationRiskId
  }, {
    $set: {
      deviationGranted,
      otherGranted,
      qualitySign,
      qualitySignStatus,
      dateQualitySign,
      productionSign,
      productionSignStatus,
      dateProductionSign,
      processSign,
      processSignStatus,
      dateProcessSign,
      automationSign,
      automationSignStatus,
      dateAutomationSign,
      seniorSign,
      seniorSignStatus,
      dateSeniorSign
    }
  });

  if (!updatedDeviationRisk) {
    res.status(403).json({
      status: "403",
      message: "Deviation not Updated",
      body: ""
    });
  }

  res.status(200).json({
    status: "200",
    message: "Deviation Risk Status Updated ",
    body: updatedDeviationRisk
  });
}; // Getting deviation risk by Id ///////////////////////////////////////////////////////////////////////////////////////////////////////////


const getDeviationRiskById = async (req, res) => {
  const foundDeviationRisk = await DeviationRiskAssesment.findById(req.params.deviationRiskId);

  if (!foundDeviationRisk) {
    res.status(403).json({
      status: "403",
      message: "Deviation not Founded",
      body: ""
    });
  }

  res.status(200).json({
    status: "200",
    message: "Deviation Founded",
    body: foundDeviationRisk
  });
};

module.exports = {
  createDeviationRisk,
  updateDeviationRisk,
  getDeviationRiskById,
  updateDeviationRiskSignature
};