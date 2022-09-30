import { Router } from "express";
import * as machineControler from "../../controllers/Forms/Setup/machineFiles.controler.js";
const router = Router();


// Route to get Files
router.get(
    "/MachineFiles",
    machineControler.readFiles,
  );


  export default router;