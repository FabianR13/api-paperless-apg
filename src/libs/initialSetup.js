const { Role } = require("../models/Role.js");
const Deparment = require("../models/Deparment.js");
const Position = require("../models/Position.js");
const User = require("../models/User.js");
const Dashboard = require("../models/Dashboard.js");
const Employees = require("../models/Employees.js");
const Forms = require("../models/Forms.js");
const { dataEmployees } = require("./EmployeeRawData.js");
const { dataForms } = require("./FormsRawData.js");
const Customer = require("../models/Customer.js");
const Parts = require("../models/Parts.js");
const { dataParts } = require("./PartsRawData.js");
const Kaizen = require("../models/Kaizen.js");
const Company = require("../models/Company.js");
const { dataPartsInfo } = require("./PartsInfoRawData.js");
const PartsInfo = require("../models/PartsInfo.js");
const { dataMachine } = require("./MachineRawData.js");
const Machine = require("../models/Machine.js");
const  dataDevicesAutomation  = require("./DevicesRawData.js");
const AutomationDevice = require("../models/AutomationDevice.js")

//crear compañias/////////////////////////////////////////////////////////////////////////////////////////////
const createCompanys = async () => {
  try {
    const count = await Company.estimatedDocumentCount();

    if (count > 0) return;

    const values = await Promise.all([
      new Company({ name: 'APG Mexico', description: '', direction: "", location: "" }).save(),
      new Company({ name: 'Axiom', description: '', direction: "", location: "" }).save(),
    ]);
  } catch (error) {
    console.error(error);
  }
};
// crear dashboard////////////////////////////////////////////////////////////////////////////////////////////
const createDashboard = async () => {
  try {
    const count = await Dashboard.estimatedDocumentCount();

    if (count > 0) return;

    const values = await Promise.all([
      new Dashboard({
        name: "General",
        description: "Dashboard General Card",
        icon: "icon-general.png",
        back: "img-general.jpeg",
        pos: "1",
      }).save(),
      new Dashboard({
        name: "Setup",
        description: "Dashboard Setup Card",
        icon: "icon-setup.png",
        back: "img-setup.jpeg",
        pos: "2",
      }).save(),
      new Dashboard({
        name: "Quality",
        description: "Dashboard Quality Card",
        pos: "3",
        icon: "icon-quality.png",
        back: "img-quality.jpeg",
      }).save(),
      new Dashboard({
        name: "Production",
        description: "Dashboard Production Card",
        pos: "4",
        icon: "icon-production.png",
        back: "img-production.jpeg",
      }).save(),
      new Dashboard({
        name: "Other",
        description: "Dashboard Other Card",
        pos: "5",
        icon: "icon-other.png",
        back: "img-other.jpeg",
      }).save(),
    ]);
  } catch (error) {
    console.error(error);
  }
};
// Crear roles/////////////////////////////////////////////////////////////////////////////////////////////////////////
const createRoles = async () => {
  try {
    const count = await Role.estimatedDocumentCount();

    if (count > 0) return;

    const values = await Promise.all([
      new Role({ name: "user", description: "Basic user role", category: "Dashboard Roles" }).save(),
      new Role({ name: "moderador", description: "Moderador role", category: "Dashboard Roles" }).save(),
      new Role({ name: "admin", description: "Admin role", category: "Dashboard Roles" }).save(),
      new Role({ name: "GeneralR", description: "The user can open and read General dashboard", category: "Dashboard Roles" }).save(),
      new Role({ name: "GeneralRW", description: "The user can open, read and write General dashboard", category: "Dashboard Roles" }).save(),
      new Role({ name: "SetupR", description: "The user can open and read Setup dashboard", category: "Dashboard Roles" }).save(),
      new Role({ name: "SetupRW", description: "The user can open, read and write Setup dashboard", category: "Dashboard Roles" }).save(),
      new Role({ name: "QualityR", description: "The user can open and read Quality dashboard", category: "Dashboard Roles" }).save(),
      new Role({ name: "QualityRW", description: "The user can open, read and write Quality dashboard", category: "Dashboard Roles" }).save(),
      new Role({ name: "ProductionR", description: "The user can open and read Production dashboard", category: "Dashboard Roles" }).save(),
      new Role({ name: "ProductionRW", description: "The user can open, read and write Production dashboard", category: "Dashboard Roles" }).save(),
      new Role({ name: "OtherR", description: "The user can open and read Other dashboard", category: "Dashboard Roles" }).save(),
      new Role({ name: "OtherRW", description: "The user can open, read and write Other dashboard", category: "Dashboard Roles" }).save(),
      new Role({ name: "KaizenR", description: "The user can open and read Kaizens", category: "Kaizen Roles" }).save(),
      new Role({ name: "KaizenRW", description: "The user can modify Kaizens", category: "Kaizen Roles" }).save(),
      new Role({ name: "KaizenApproval", description: "The user can approve Kaizens", category: "Kaizen Roles" }).save(),
    ]);
  } catch (error) {
    console.error(error);
  }
};
// Crear departamentos/////////////////////////////////////////////////////////////////////////////////////////////////
const createDepartments = async () => {
  try {
    const count = await Deparment.estimatedDocumentCount();

    if (count > 0) return;

    const values = await Promise.all([
      new Deparment({ name: 'Production', description: 'Production' }).save(),
      new Deparment({ name: 'Process', description: 'Process' }).save(),
      new Deparment({ name: 'Logistics', description: 'Logistics' }).save(),
      new Deparment({ name: 'Cleaning', description: 'Cleaning' }).save(),
      new Deparment({ name: 'Human Resources', description: 'Human Resources' }).save(),
      new Deparment({ name: 'Direction', description: 'Direction' }).save(),
      new Deparment({ name: 'Maintenance', description: 'Maintenance' }).save(),
      new Deparment({ name: 'Quality', description: 'Quality' }).save(),
      new Deparment({ name: 'Administration', description: 'Administration' }).save(),
      new Deparment({ name: 'Warehouse', description: 'Warehouse' }).save(),
      new Deparment({ name: 'Finance', description: 'Finance' }).save(),
      new Deparment({ name: 'Automation', description: 'Automation' }).save(),
      new Deparment({ name: 'ToolRoom', description: 'ToolRoom' }).save(),
      new Deparment({ name: 'IT', description: 'IT' }).save(),
      new Deparment({ name: 'Management', description: 'Management' }).save(),
    ]);
  } catch (error) {
    console.error(error);
  }
};
// Crear posiciones////////////////////////////////////////////////////////////////////////////////////////////////////
const createPositions = async () => {
  try {
    const count = await Position.estimatedDocumentCount();

    if (count > 0) return;

    const values = await Promise.all([
      new Position({
        name: "Administrator",
        description: "Administrator",
      }).save(),
      new Position({ name: 'Visual Quality Inspector', description: ' Visual Quality Inspector ' }).save(),
      new Position({ name: 'Quality Engineer', description: ' Quality Engineer ' }).save(),
      new Position({ name: 'General Counter', description: ' General Counter ' }).save(),
      new Position({ name: 'Production Planner', description: ' Production Planner ' }).save(),
      new Position({ name: 'Storer', description: ' Storer ' }).save(),
      new Position({ name: 'Production Operator', description: ' Production Operator ' }).save(),
      new Position({ name: 'Quality Inspector', description: ' Quality Inspector ' }).save(),
      new Position({ name: 'EDI Coordinator', description: ' EDI Coordinator ' }).save(),
      new Position({ name: 'Junior Technician', description: ' Junior Technician ' }).save(),
      new Position({ name: 'Automation Assistant', description: ' Automation Assistant ' }).save(),
      new Position({ name: 'Foreign Trade Specialist', description: ' Foreign Trade Specialist ' }).save(),
      new Position({ name: 'Shipping Analyst', description: ' Shipping Analyst ' }).save(),
      new Position({ name: 'Ehs Assistant', description: ' Ehs Assistant ' }).save(),
      new Position({ name: 'It Analyst', description: 'It Analyst' }).save(),
      new Position({ name: 'It Assistant', description: 'It Analyst' }).save(),
      new Position({ name: 'Junior Accountant', description: ' Junior Accountant ' }).save(),
      new Position({ name: 'Plastic Injection Supervisor', description: ' Plastic Injection Supervisor ' }).save(),
      new Position({ name: 'Head Of EHS', description: ' Head Of EHS ' }).save(),
      new Position({ name: 'Cleaning Assistant', description: ' Cleaning Assistant ' }).save(),
      new Position({ name: 'Resiner', description: ' Resiner ' }).save(),
      new Position({ name: 'Head Of Operational Training', description: ' Head Of Operational Training ' }).save(),
      new Position({ name: 'Material and Packaging Planner', description: ' Material and Packaging Planner ' }).save(),
      new Position({ name: 'Maintenance Assistant', description: ' Maintenance Assistant ' }).save(),
      new Position({ name: 'Internal Customer Coordinator', description: ' Internal Customer Coordinator ' }).save(),
      new Position({ name: 'Building Maintenance', description: ' Building Maintenance ' }).save(),
      new Position({ name: 'Cycle Counter', description: ' Cycle Counter ' }).save(),
      new Position({ name: 'Tool Room Supervisor', description: ' Tool Room Supervisor ' }).save(),
      new Position({ name: 'Automation Engineer', description: ' Automation Engineer ' }).save(),
      new Position({ name: 'Tool Specialist', description: ' Tool Specialist ' }).save(),
      new Position({ name: 'Program Manager', description: ' Program Manager ' }).save(),
      new Position({ name: 'Export and Transport Analyst', description: ' Export and Transport Analyst ' }).save(),
      new Position({ name: 'Process Manager', description: ' Process Manager ' }).save(),
      new Position({ name: 'Production and Logistics Manager', description: ' Production and Logistics Manager ' }).save(),
      new Position({ name: 'Injection Technician', description: ' Injection Technician ' }).save(),
      new Position({ name: 'Cleaning Leader', description: ' Cleaning Leader ' }).save(),
      new Position({ name: 'Human Resources Assistant', description: ' Human Resources Assistant ' }).save(),
      new Position({ name: 'Buyer', description: ' Buyer ' }).save(),
      new Position({ name: 'General Manager', description: ' General Manager ' }).save(),
      new Position({ name: 'Maintenance Technician', description: ' Maintenance Technician ' }).save(),
      new Position({ name: 'Laboratory and Metrology Manager', description: ' Laboratory and Metrology Manager ' }).save(),
      new Position({ name: 'Administrative Assistant', description: ' Administrative Assistant ' }).save(),
      new Position({ name: 'Inspector Leader', description: ' Inspector Leader ' }).save(),
      new Position({ name: 'Trainer', description: ' Trainer ' }).save(),
      new Position({ name: 'Leader', description: ' Leader ' }).save(),
      new Position({ name: 'Human Resources Manager', description: ' Human Resources Assistant ' }).save(),
      new Position({ name: 'Nurse', description: ' Nurse ' }).save(),
      new Position({ name: 'Quality Assistant', description: ' Quality Assistant ' }).save(),
      new Position({ name: 'Robot Specialist', description: ' Robot Specialist ' }).save(),
      new Position({ name: 'Warehouse Supervisor', description: ' Warehouse Supervisor ' }).save(),
      new Position({ name: 'Tool Helper', description: ' Tool Helper ' }).save(),
      new Position({ name: 'Receipt Analyst', description: ' Receipt Analyst ' }).save(),
      new Position({ name: 'Warehouse Assistant', description: ' Warehouse Assistant ' }).save(),
      new Position({ name: 'Production Supervisor', description: ' Production Supervisor ' }).save(),
      new Position({ name: 'Responsible For Quality Management System', description: ' Responsible For Quality Management System ' }).save(),
      new Position({ name: 'Quality Manager', description: ' Quality Manager ' }).save(),
      new Position({ name: 'Payroll Administrator', description: 'Payroll Administrator' }).save(),
      new Position({ name: 'IT Manager', description: 'IT Manager' }).save(),
      new Position({ name: 'Intern', description: 'Intern' }).save(),
      new Position({ name: 'Customer Service Jr', description: 'Intern' }).save(),
    ]);
  } catch (error) {
    console.error(error);
  }
};
// Crear customer////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const createCustomers = async () => {
  try {
    const count = await Customer.estimatedDocumentCount();

    if (count > 0) return;

    const values = await Promise.all([
      new Customer({ name: 'Stant' }).save(),
      new Customer({ name: 'Martinrea' }).save(),
      new Customer({ name: 'Aptiv' }).save(),
      new Customer({ name: 'Brose' }).save(),
      new Customer({ name: 'VW' }).save(),
      new Customer({ name: 'Tesla' }).save(),
      new Customer({ name: 'CIE' }).save(),
      new Customer({ name: 'Stellantis' }).save(),
    ]);
  } catch (error) {
    console.error(error);
  }
};
// Create Forms////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const createForms = async () => {
  let forms = dataForms;
  try {
    const count = await Forms.estimatedDocumentCount();

    if (count > 0) return;

    for (let i = 0; i < forms.length; i++) {
      let newForm = new Forms({
        name: forms[i].name,
        description: forms[i].description,
        back: forms[i].back,
      });
      const foundDashboard = await Dashboard.find({
        name: { $in: forms[i].dashboard },
      });
      newForm.dashboard = foundDashboard.map(
        (dashboard) => dashboard._id
      );
      let savedForm = await newForm.save();
    }
  } catch (error) {
    console.log(error);
  }
}
// Crear empleado/////////////////////////////////////////////////////////////////////////////////////////////////////////////
const createEmployees = async () => {
  let employees = dataEmployees;
  const foundCompany = await Company.find({
    name: { $in: "APG Mexico" },
  });
  const company = foundCompany.map((company) => company._id);
  try {
    const count = await Employees.estimatedDocumentCount();

    if (count > 0) return;

    for (let i = 0; i < employees.length; i++) {
      let newEmployee = new Employees({
        name: employees[i].name,
        lastName: employees[i].lastName,
        numberEmployee: employees[i].numberEmployee,
        active: employees[i].active,
        picture: employees[i].picture,
        user: employees[i].user,
        company: company,
      });

      const foundDepartment = await Deparment.find({
        name: { $in: employees[i].department },
      });

      newEmployee.department = foundDepartment.map(
        (department) => department._id
      );

      const foundPositions = await Position.find({
        name: { $in: employees[i].position },
      });

      newEmployee.position = foundPositions.map((position) => position._id);

      let savedEmployee = await newEmployee.save();

    }
  } catch (error) {
    console.log(error);
  }
}
// Create parts////////////////////////////////////////////////////////////////////////////////////////////////////
const createParts = async () => {
  let parts = dataParts;
  const status = true;
  const foundCompany = await Company.find({
    name: { $in: "APG Mexico" },
  });
  const company = foundCompany.map((company) => company._id);
  try {

    const count = await Parts.estimatedDocumentCount();

    if (count > 0) return;
    console.log(dataParts)
    for (let i = 0; i < parts.length; i++) {
      let newPart = new Parts({
        partnumber: parts[i].partnumber,
        partName: parts[i].partName,
        partEcl: parts[i].partEcl,
        mould: parts[i].mould,
        status: status,
        company: company,
      });
      const foundCustomer = await Customer.find({
        name: { $in: parts[i].customer },
      });
      newPart.customer = foundCustomer.map(
        (customer) => customer._id
      );

      let savedPart = await newPart.save();
    }
  } catch (error) {
    console.log(error);
  }
};
//create parts info///////////////////////////////////////////////////////////////////////////////////////////////
const createPartsInfo = async () => {
  let partsinfo = dataPartsInfo;
  let status = true;
  const foundCompany = await Company.find({
    name: { $in: "APG Mexico" },
  });
  const company = foundCompany.map((company) => company._id);
  try {
    const count = await PartsInfo.estimatedDocumentCount();
    if (count > 0) return;
    for (let i = 0; i < partsinfo.length; i++) {
      let newPartinfo = new PartsInfo({
        machine: partsinfo[i].machine,
        numberCavities: partsinfo[i].numberCavities,
        shotWeight: partsinfo[i].shotWeight,
        totalShotWeight: partsinfo[i].totalShotWeight,
        avgPartWeight: partsinfo[i].avgPartWeight,
        cycleTime: partsinfo[i].cycleTime,
        partsPerHour: partsinfo[i].partsPerHour,
        company: company,
        cushion: partsinfo[i].cushion,
        recovery: partsinfo[i].recovery,
        fillTime: partsinfo[i].fillTime,
        peakPress: partsinfo[i].peakPress,
        status: status,
      });
      const foundParts = await Parts.find({
        partnumber: { $in: partsinfo[i].partnumber },
      });
      newPartinfo.partnumber = foundParts.map(
        (parts) => parts._id
      );
      let savedPartInfo = await newPartinfo.save();
    }
  } catch (error) {
    console.log(error);
  }
}
//create machines//////////////////////////////////////////////////////////////////////////////////////////////////
const createMachine = async () => {
  console.log(dataMachine)
  let machines = dataMachine;
  const foundCompany = await Company.find({
    name: { $in: "APG Mexico" },
  });
  const company = foundCompany.map((company) => company._id);
  try {
    const count = await Machine.estimatedDocumentCount();
    if (count > 0) return;

    for (let i = 0; i < machines.length; i++) {
      let newMachine = new Machine({
        machineNumber: machines[i].machine,
        machineZise: machines[i].machineZise,
        nozzleOrifice: machines[i].nozzleOrifice,
        nozzleRadius: machines[i].nozzleRadius,
        nozzleType: machines[i].nozzleType,
        company: company,
      });
      const foundPartsInfo = await PartsInfo.find({
        machine: { $in: machines[i].partInfo },
      });
      newMachine.partInfo = foundPartsInfo.map(
        (partInfo) => partInfo._id
      );
      let savedMachine = await newMachine.save();
    }
  } catch (error) {
    console.log(error);
  }
}

/////////////////////////Modificar empleados
const updateEmployeesData = async () => {

  try {
    for (let i = 11033; i < 11034; i++) {
      const employee = await Employees.findOne({ numberEmployee: i })

      if (employee) {

        const updatedEmployeeData = await Employees.updateOne(
          { numberEmployee: i },
          {
            $set: {
              "group": "A",
              "visualWeakness": "No"
            },
          }
        );
        console.log("Update")
      }
    }
  } catch (error) {
    console.log(error);
  }
  console.log("Terminado")
};

//create Devices Automation//////////////////////////////////////////////////////////////////////////////////////////////////
const createDevicesAutomation = async () => {
  console.log(dataDevicesAutomation)
  let automationDevices = dataDevicesAutomation;
  const foundCompany = await Company.find({
    name: { $in: "APG Mexico" },
  });
  const company = foundCompany.map((company) => company._id);

  try {
    const count = await AutomationDevice.estimatedDocumentCount();
    if (count > 0) return;

    for (let i = 0; i < automationDevices.length; i++) {
      let newAutomationDevice = new AutomationDevice({
        name: automationDevices[i].name,
        sensors: automationDevices[i].sensors,
        clampingType: automationDevices[i].clampingType,
        nestType: automationDevices[i].nestType,
        typeOfVisualAids: automationDevices[i].typeOfVisualAids,
        company: company,
      });
      const foundCustomers = await Customer.find({
        name: { $in: automationDevices[i].customer },
      });
      newAutomationDevice.customer = foundCustomers.map(
        (customer) => customer._id
      );
      let savedAutomationDevice = await newAutomationDevice.save();
    }
  } catch (error) {
    console.log(error);
  }
}


module.exports = {
  createCompanys,
  createDashboard,
  createRoles,
  createDepartments,
  createPositions,
  createCustomers,
  createForms,
  createEmployees,
  createParts,
  createPartsInfo,
  createMachine,
  updateEmployeesData,
  createDevicesAutomation
}

