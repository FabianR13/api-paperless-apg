const Customer = require("../../../models/General/Customer.js");
const Parts = require("../../../models/Quality/Parts.js");
const DeviationRequest = require("../../../models/General/DeviationRequest.js");
const User = require("../../../models/User.js");
const DeviationRiskAssessment = require("../../../models/General/DeviationRiskAssessment.js");
const Company = require("../../../models/Company.js");
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const { sendEmailMiddlewareResponse } = require("../../../middlewares/mailer.js");
dotenv.config({ path: "C:\\api-paperless-apg\\src\\.env" });

AWS.config.update({
  region: process.env.S3_BUCKET_REGION,
  apiVersion: 'latest',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  }
})

const s3 = new AWS.S3();

//create deviation request//////////////////////////////////////////////////////////////////////////////////////
const createDeviationRequest = async (req, res, next) => {
  const {
    deviationNumber,
    deviationDate,
    deviationType,
    supplier,
    customer,
    requestBy,
    implementationDate,
    implementationTime,
    parts,
    applyTo,
    machineNo,
    sectionTwo,
    termDevRequest,
    quantity,
    timePeriodStart,
    timePeriodEnd,
    other,
    deviationGranted,
    otherGranted,
    qualitySign,
    dateQualitySign,
    seniorSign,
    dateSeniorSign,
    customerSign,
    dateCustomerSign,
    comments,
    severity,
    qualitySignStatus,
    seniorSignStatus,
    customerSignStatus,
    deviationStatus,
    deviationRisk,
    company,
  } = req.body;
  const newDeviationReq = new DeviationRequest({
    deviationNumber,
    deviationDate,
    deviationType,
    supplier,
    requestBy,
    implementationDate,
    implementationTime,
    applyTo,
    machineNo,
    sectionTwo,
    termDevRequest,
    quantity,
    timePeriodStart,
    timePeriodEnd,
    other,
    deviationGranted,
    otherGranted,
    qualitySign,
    dateQualitySign,
    seniorSign,
    dateSeniorSign,
    customerSign,
    dateCustomerSign,
    comments,
    severity,
    qualitySignStatus,
    seniorSignStatus,
    customerSignStatus,
    deviationStatus,
    deviationRisk,
  });
  if (requestBy) {
    const foundUsers = await User.find({
      username: { $in: requestBy },
    });
    newDeviationReq.requestBy = foundUsers.map((user) => user._id);
  }
  if (customer) {
    const foundCustomers = await Customer.find({
      name: { $in: customer },
    });
    newDeviationReq.customer = foundCustomers.map((customer) => customer._id);
  }
  if (parts) {
    const foundParts = await Parts.find({
      partnumber: { $in: parts },
    });
    newDeviationReq.parts = foundParts.map((parts) => parts._id);
  }
  if (company) {
    const foundCompany = await Company.find({
      _id: { $in: company },
    });
    newDeviationReq.company = foundCompany.map((company) => company._id);
  }
  if (!requestBy || !customer || !parts || !company) {
    return res
      .status(403)
      .json({ message: "Deviation not saved", status: "403" });
  }

  //var count = 1
  //const date = new Date();
  //const yearactual = date.getFullYear()

  //const foundDeviations = await DeviationRequest.find();

  //foundDeviations.map((deviationC) => {
  //  if (deviationC.deviationDate.getFullYear() === yearactual) {
  //    count = count + 1
  //  }
  //})

  const count = await DeviationRequest.estimatedDocumentCount();

  if (count > 1) {
    const deviations = await DeviationRequest.find().sort({ consecutive: -1 }).limit(1);
    newDeviationReq.consecutive = deviations[0].consecutive + 1
  } else {
    newDeviationReq.consecutive = 1
  }

  // newDeviationReq.deviationNumber = "APG-" + yearactual + "-" + `${Number(newDeviationReq.consecutive)}`.padStart(3, "0")`
  // newDeviationReq.deviationNumber = "APG-" + yearactual + "-" + `${count}`.padStart(3, "0")

  const savedDeviationRequest = await newDeviationReq.save();
  if (!savedDeviationRequest) {
    res
      .status(403)
      .json({ status: "403", message: "Deviation not Saved", body: "" });
  }
  next();
  //res.json({ status: "200", message: "Deviation request created", savedDeviationRequest });
};
// Getting all deviations request/////////////////////////////////////////////////////////////////////////////////////////////////////
const getDeviationRequest = async (req, res) => {
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
  const deviations = await DeviationRequest.find({
    company: { $in: CompanyId },
  }).sort({ consecutive: -1 })
    .populate({ path: 'customer' })
    .populate({ path: 'requestBy', populate: { path: "signature", model: "Signature" }, populate: { path: "employee", model: "Employees", populate: { path: "department", model: "Department" } } })
    .populate({ path: 'parts' });
  res.json({ status: "200", message: "Deviations Loaded", body: deviations });
};
// Getting deviation by Id ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getDeviationById = async (req, res) => {
  const foundDeviation = await DeviationRequest.findById(req.params.deviationId)
    .populate({ path: 'customer' })
    .populate({ path: 'requestBy', populate: [{ path: "signature", model: "Signature" }, { path: "employee", model: "Employees", populate: { path: "department", model: "Department" } }] })
    .populate({ path: 'parts' });


  if (!foundDeviation) {
    res
      .status(403)
      .json({ status: "403", message: "Deviation not Founded", body: "" });
  }
  res
    .status(200)
    .json({ status: "200", message: "Deviation Founded", body: foundDeviation });
};
// Updating deviation status//////////////////////////////////////////////////////////////////////////////////////////////////////////
const updateDeviation = async (req, res) => {
  const { deviationId } = req.params;
  const {
    deviationGranted,
    qualitySign,
    dateQualitySign,
    qualitySignStatus,
    seniorSign,
    dateSeniorSign,
    seniorSignStatus,
  } = req.body;
  const updatedDeviation = await DeviationRequest.updateOne(
    { _id: deviationId },
    {
      $set: {
        deviationGranted,
        qualitySign,
        dateQualitySign,
        qualitySignStatus,
        seniorSign,
        dateSeniorSign,
        seniorSignStatus,
      },
    }
  );

  if (!updatedDeviation) {
    res
      .status(403)
      .json({ status: "403", message: "Deviation not Updated", body: "" });
  }

  res.status(200).json({
    status: "200",
    message: "Deviation Status Updated ",
    body: updatedDeviation,
  });
};
//method to update deviation request //////////////////////////////////////////////////////////////////////////////////////
const updateDeviationReq = async (req, res) => {
  const { deviationId } = req.params;
  const newCustomer = req.body.customer;
  const newParts = req.body.parts;
  const newDeviation = [];

  newDeviation.deviationDate = req.body.deviationDate;
  newDeviation.deviationType = req.body.deviationType;
  newDeviation.supplier = req.body.supplier;
  newDeviation.implementationDate = req.body.implementationDate;
  newDeviation.implementationTime = req.body.implementationTime;
  newDeviation.applyTo = req.body.applyTo;
  newDeviation.machineNo = req.body.machineNo;
  newDeviation.sectionTwo = req.body.sectionTwo;
  newDeviation.termDevRequest = req.body.termDevRequest;
  newDeviation.quantity = req.body.quantity;
  newDeviation.timePeriodStart = req.body.timePeriodStart;
  newDeviation.timePeriodEnd = req.body.timePeriodEnd;
  newDeviation.other = req.body.other;
  newDeviation.qualitySign = req.body.qualitySign;
  newDeviation.seniorSign = req.body.seniorSign;
  newDeviation.customerSign = req.body.customerSign;
  newDeviation.comments = req.body.comments;
  newDeviation.severity = req.body.severity;
  newDeviation.qualitySignStatus = req.body.qualitySignStatus;
  newDeviation.seniorSignStatus = req.body.seniorSignStatus;
  newDeviation.customerSignStatus = req.body.customerSignStatus;

  if (newCustomer) {
    const foundCustomers = await Customer.find({
      name: { $in: newCustomer },
    });
    newDeviation.customer = foundCustomers.map((customer) => customer._id);
  }

  if (newParts) {
    const foundParts = await Parts.find({
      partnumber: { $in: newParts },
    });
    newDeviation.parts = foundParts.map((part) => part._id);
  }

  const {
    deviationDate,
    deviationType,
    customer,
    supplier,
    implementationDate,
    implementationTime,
    parts,
    applyTo,
    machineNo,
    sectionTwo,
    termDevRequest,
    quantity,
    timePeriodStart,
    timePeriodEnd,
    other,
    qualitySign,
    seniorSign,
    customerSign,
    comments,
    severity,
    qualitySignStatus,
    seniorSignStatus,
    customerSignStatus,
  } = newDeviation;

  const updatedDeviationRequest = await DeviationRequest.updateOne(
    { _id: deviationId },
    {
      $set: {
        deviationDate,
        deviationType,
        supplier,
        customer,
        implementationDate,
        implementationTime,
        parts,
        applyTo,
        machineNo,
        sectionTwo,
        termDevRequest,
        quantity,
        timePeriodStart,
        timePeriodEnd,
        other,
        qualitySign,
        seniorSign,
        customerSign,
        comments,
        severity,
        qualitySignStatus,
        seniorSignStatus,
        customerSignStatus,
      },
    }
  );

  if (!updatedDeviationRequest) {
    res
      .status(403)
      .json({ status: "403", message: "Deviation not Updated", body: "" });
  }

  res.status(200).json({
    status: "200",
    message: "Deviation Status Updated ",
    body: updatedDeviationRequest,
  });
};
//Update deviation risk status//////////////////////////////////////////////////////////////////////////////////
const updateRiskStatus = async (req, res) => {
  const newDeviationNumber = req.body.deviationNumber;
  const { deviationId } = req.params;
  const update = [];
  if (newDeviationNumber) {
    const foundDevRisk = await DeviationRiskAssessment.find({
      deviationNumber: { $in: newDeviationNumber },
    });
    update.deviationRisk = foundDevRisk.map((devRisk) => devRisk._id);
  }
  const deviationRisk = update.deviationRisk.toString();
  const updatedDeviationRequest = await DeviationRequest.updateOne(
    { _id: deviationId },
    {
      $set: {
        deviationRisk,
      },
    }
  );

  if (!updatedDeviationRequest) {
    res
      .status(403)
      .json({ status: "403", message: "Deviation not Updated", body: "" });
  }
  res.json({ status: "200", message: "Deviation risk assessment is created", updatedDeviationRequest });
};
//close deviation////////////////////////////////////////////////////////////////////////////////////////////////////////
const updateDeviationStatus = async (req, res) => {
  const { deviationId } = req.params;
  const {
    effectiveness,
    user,
    approvedByDate,
    deviationRiskID,
  } = req.body;

  //Getting Previous Images
  const foundPrevDeviation = await DeviationRequest.findById(deviationId);
  // Deleting Images from Folder
  const prevClosingFile = foundPrevDeviation.deviationStatus;
  // Validating if there are Images in the Field
  if (prevClosingFile !== "Open") {
    // Delete File from Folder
    const params = {
      Bucket: process.env.S3_BUCKET_NAME + "/Uploads/DeviationClosingFile",
      Key: prevClosingFile
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
  const updateClearFileDeviation = await DeviationRequest.updateOne(
    { _id: deviationId },
    {
      $set: {
        deviationStatus: ""
      }
    }
  );

  if (!updateClearFileDeviation) {
    res.status(403).json({
      status: "403",
      message: "Deviation not Updated - updateClearFileDeviation",
      body: "",
    });
  }

  //Retreiving the data for each profile Image and adding to the schema
  let deviationStatus = "";

  if (req.file) {
    deviationStatus = req.file.key;
  }

  // Updating the new Img Names in the fields from the DB
  const updateFileDeviation = await DeviationRequest.updateOne(
    { _id: deviationId },
    {
      $set: {
        deviationStatus
      }
    }
  );

  let approvedBy = "";



  if (user) {
    const foundUsers = await User.find({
      username: { $in: user },
    });
    approvedBy = foundUsers.map((user) => user._id);
  }


  // Updating the deviation risk assessment
  const updateDeviationRiskClose = await DeviationRiskAssessment.updateOne(
    { _id: deviationRiskID },
    {
      $set: {
        effectiveness,
        approvedByDate,
        approvedBy
      }
    }
  );

  if ((!updateFileDeviation) || (!updateDeviationRiskClose)) {
    res.status(403).json({
      status: "403",
      message: "Deviation not Updated - updateFileDeviation",
      body: "",
    });
  }

  const foundDeviationNew = await DeviationRequest.findById(deviationId);

  res.status(200).json({
    status: "200",
    message: "Deviation Updated",
    body: foundDeviationNew,
  });
};



//close deviation////////////////////////////////////////////////////////////////////////////////////////////////////////
const deleteDeviation = async (req, res) => {
  const { deviationId } = req.params;


  //console.log("deviation")

  //Getting Previous Images
  const foundPrevDeviation = await DeviationRequest.findById(deviationId);
  // Deleting Images from Folder
  const prevClosingFile = foundPrevDeviation.deviationStatus;
  // Validating if there are Images in the Field
  if (prevClosingFile !== "Open") {
    // Delete File from Folder
    const params = {
      Bucket: process.env.S3_BUCKET_NAME + "/Uploads/DeviationClosingFile",
      Key: prevClosingFile
    };
    try {
      s3.deleteObject(params, function (err, data) {
        if (err) console.log(err);
      });
    } catch (error) {
      //console.log("error")
      res.status(403).json({
        status: "403",
        message: error,
        body: "",
      });
    }
  }

  const deviationRiskID = foundPrevDeviation.deviationRisk

  // delete the deviation risk assessment
  console.log(deviationRiskID)
  if (deviationRiskID !== "No") {
    DeviationRiskAssessment.findById(deviationRiskID, function (err, deviationRisk) {
      if (err) {
        res.status(503).json({
          status: "403",
          message: err,
        });
        return;
      }
      deviationRisk.remove();
    });
  }
  DeviationRequest.findById(deviationId, function (err, deviation) {
    if (err) {
      res.status(503).json({
        status: "403",
        message: err,
      });
      return;
    }
    deviation.remove(
      res.status(200).json({
        status: "200",
        message: 'The deviation has been deleted',
      }));
  });
};


module.exports = {
  createDeviationRequest,
  getDeviationRequest,
  getDeviationById,
  updateDeviation,
  updateDeviationReq,
  updateRiskStatus,
  updateDeviationStatus,
  deleteDeviation
};