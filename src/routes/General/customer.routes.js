import Router from "express";

const router = Router();

import * as customerController from "../../controllers/Forms/General/customers.controller.js";

router.post(
    "/NewCustomer",
    customerController.signCustomer
);
router.get("/Customers",
customerController.getCustomers
);



export default router;