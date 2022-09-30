const Customer = require( "../../../models/General/Customer.js");
// import { LexModelBuildingService } from "aws-sdk";
// import Customer from "../../../models/General/Customer.js";

const signCustomer =async (req, res) => {
    const {
        name,
    } = req.body;
    const newCustomer =new Customer ({
        name,
    });

    const savedCustomer = await newCustomer.save();
    // console.log(savedCustomer);

    res.json({status: "200", message: "Customer created", savedCustomer});
};
// Getting all customers
const getCustomers = async (req, res) => {
    const customers = await Customer.find().sort({name: 1});
    res.json({status: "200", message: "Customers loaded", body: customers});
  }

  module.exports = {
    signCustomer,
    getCustomers
  };