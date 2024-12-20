const {
  Router
} = require("express");

const router = Router();

const {
  signCustomer,
  getCustomers
} = require("../../controllers/Forms/General/customers.controller.js"); ///Route to create a new customer///


router.post("/NewCustomer", signCustomer); ///Route to get customers////

router.get("/Customers", getCustomers);
module.exports = router;