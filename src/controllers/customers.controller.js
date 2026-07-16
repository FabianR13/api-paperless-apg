const Customer = require("../models/Customer.js");

// Getting all customers//////////////////////////////////////////////////////////////////////////////////
const getCustomers = async (req, res) => {
    const customers = await Customer.find().sort({ name: 1 });
    res.json({ status: "200", message: "Customers loaded", body: customers });
}

module.exports = {
    getCustomers
};