const {Router} = require("express");
const router = Router();
const {
    signCustomer,
    getCustomers
} = require("../../controllers/Forms/General/customers.controller.js");
// import Router from "express";
// import * as customerController from "../../controllers/Forms/General/customers.controller.js";

router.post(
    "/NewCustomer",
    signCustomer
);
router.get("/Customers",
getCustomers
);



module.exports = router;