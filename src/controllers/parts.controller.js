const Parts = require("../models/Parts.js");
const Customer = require("../models/Customer.js");
const Company = require("../models/Company.js");

//Create new part number////////////////////////////////////////////////////////////////////////////////////////////
const createPart = async (req, res) => {
  const { CompanyId } = req.params;
  const {
    partnumber,
    partName,
    partEcl,
    customer,
    assemblyPartNumber,
    assemblyPartDesc,
    mould,
    status,
    operations,
    countOperations,
    showInTraining
  } = req.body;
  const newPart = new Parts({
    partnumber,
    partName,
    partEcl,
    assemblyPartNumber,
    assemblyPartDesc,
    mould,
    status,
    operations,
    countOperations,
    showInTraining
  });
  // console.log(req.params)
  // console.log(CompanyId)
  if (customer) {
    const foundCustomers = await Customer.find({
      name: { $in: customer },
    });
    newPart.customer = foundCustomers.map((customer) => customer._id);
  }
  if (CompanyId) {
    const foundCompany = await Company.find({
      _id: { $in: CompanyId },
    });
    newPart.company = foundCompany.map((company) => company._id);
  }

  newPart.save((error, newPart) => {
    if (error) return res.status(400).json({ status: "400", message: error });
    if (newPart) {
      res.json({ status: "200", message: "Part Created", body: newPart });
    }
  });
};
//update parts//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const udpateParts = async (req, res) => {
  const { partId } = req.params;
  const UpdPart = [];
  UpdPart.partnumber = req.body.partnumber;
  UpdPart.partName = req.body.partName;
  UpdPart.partEcl = req.body.partEcl;
  UpdPart.assemblyPartNumber = req.body.assemblyPartNumber;
  UpdPart.assemblyPartDesc = req.body.assemblyPartDesc;
  UpdPart.mould = req.body.mould;
  UpdPart.status = req.body.status;
  UpdPart.operations = req.body.operations;
  UpdPart.countOperations = req.body.countOperations;
  UpdPart.showInTraining = req.body.showInTraining;
  let newCustomer = req.body.customer;

  if (newCustomer) {
    const foundCustomers = await Customer.find({
      name: { $in: newCustomer },
    });
    UpdPart.customer = foundCustomers.map((customer) => customer._id);
  }
  const {
    partnumber,
    partName,
    partEcl,
    customer,
    assemblyPartNumber,
    assemblyPartDesc,
    mould,
    status,
    operations,
    countOperations,
    showInTraining
  } = UpdPart;
  const updatedPart = await Parts.updateOne(
    { _id: partId },
    {
      $set: {
        partnumber,
        partName,
        partEcl,
        customer,
        assemblyPartNumber,
        assemblyPartDesc,
        mould,
        status,
        operations,
        countOperations,
        showInTraining
      },
    }
  );
  if (!updatedPart) {
    res.status(403).json({ status: "403", message: "part not updated", body: "" });
  }
  res.status(200).json({ status: "200", message: "part updated", body: updatedPart });
}
//Getting all parts///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getParts = async (req, res) => {
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
  const parts = await Parts.find({
    company: { $in: CompanyId },
  }).populate({ path: "customer" }).sort({ "partnumber": 1 });
  res.json({ status: "200", message: "Parts loaded", body: parts });
}

// OBTENER PARTES ACTIVAS /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getActiveParts = async (req, res) => {
  const { CompanyId } = req.params;

  if (CompanyId.length !== 24) {
    return res.status(400).json({ status: "400", message: "Invalid Company ID" });
  }

  try {
    const company = await Company.findById(CompanyId);
    if (!company) {
      return res.status(404).json({ status: "404", message: "Company not found" });
    }
    const parts = await Parts.find({
      company: CompanyId,
      status: true
    })
      .populate({ path: "customer" })
      .sort({ "partnumber": 1 });

    res.json({
      status: "200",
      message: "Active parts loaded",
      body: parts
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "500", message: "Internal server error" });
  }
};

module.exports = {
  createPart,
  udpateParts,
  getParts,
  getActiveParts
};