const { Router } = require("express");
const router = Router();
const {
    getCustomers
} = require("../controllers/customers.controller.js");

///Route to get customers////
router.get("/Customers",
    getCustomers
);

module.exports = router;