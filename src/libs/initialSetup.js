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
const { dataMachine } = require("./MachineRawData.js");
const dataDevicesAutomation = require("./DevicesRawData.js");
const AutomationDevice = require("../models/AutomationDevice.js");
const Panel = require("../models/Panel.js");
const AccessGroup = require("../models/AccessGroups.js");
const AccessCredential = require("../models/Credential.js");



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

// Crear Paneles y Puertas iniciales/////////////////////////////////////////////////////////////////////////
const createPanel = async () => {
  try {
    const count = await Panel.estimatedDocumentCount();

    // Si ya existen registros en la base de datos, no vuelve a crearlos
    if (count > 0) return;

    await Panel.insertMany([
      {
        nombre: 'Site',
        serial: 'AJR8182960327',
        ip: '192.168.200.191',
        puerto: 4370,
        puertas: [
          { nombre: 'Recepcion', numeroRelevador: 1, activa: true },
          { nombre: 'Salida a Planta PB', numeroRelevador: 2, activa: true },
          { nombre: 'Oficina Gerencia General', numeroRelevador: 3, activa: true },
          { nombre: 'Puerta Cristal', numeroRelevador: 4, activa: true }
        ]
      },
      {
        nombre: 'Segundo Piso',
        serial: 'AJR8182960378',
        ip: '192.168.200.192',
        puerto: 4370,
        puertas: [
          { nombre: 'Salida a Planta PA', numeroRelevador: 1, activa: true },
          { nombre: 'Comedor', numeroRelevador: 2, activa: true },
          { nombre: 'Entrada Personal', numeroRelevador: 3, activa: true },
          { nombre: 'Sin uso', numeroRelevador: 4, activa: false }
        ]
      },
      {
        nombre: 'Cortina Recepcion',
        serial: 'AJR8194660302',
        ip: '192.168.200.193',
        puerto: 4370,
        puertas: [
          { nombre: 'Cortina Recepcion', numeroRelevador: 1, activa: true },
          { nombre: 'Laboratorio Calidad', numeroRelevador: 2, activa: true },
          { nombre: 'Sin uso2', numeroRelevador: 3, activa: false },
          { nombre: 'Sin uso3', numeroRelevador: 4, activa: false }
        ]
      },
      {
        nombre: 'Puerta Principal',
        serial: 'AJR8194660334',
        ip: '192.168.200.194',
        puerto: 4370,
        puertas: [
          { nombre: 'Puerta Cocina', numeroRelevador: 1, activa: true },
          { nombre: 'Sala de Juegos', numeroRelevador: 2, activa: true },
          { nombre: 'Puerta Principal', numeroRelevador: 3, activa: true },
          { nombre: 'Sin uso4', numeroRelevador: 4, activa: false }
        ]
      },
      {
        nombre: 'Oficinas Planta Alta',
        serial: 'ZPH5241300016',
        ip: '192.168.200.195',
        puerto: 4370,
        puertas: [
          { nombre: 'Customer Service', numeroRelevador: 1, activa: true },
          { nombre: 'Gerencia ventas', numeroRelevador: 2, activa: true },
          { nombre: 'Gerencia Finanzas', numeroRelevador: 3, activa: true },
          { nombre: 'Sin uso5', numeroRelevador: 4, activa: false }
        ]
      },
      {
        nombre: 'Panel Site',
        serial: 'AJR8194660335',
        ip: '192.168.200.196',
        puerto: 4370,
        puertas: [
          { nombre: 'Recursos Humanos', numeroRelevador: 1, activa: true },
          { nombre: 'Cuarto Limpieza', numeroRelevador: 2, activa: true },
          { nombre: 'Site', numeroRelevador: 3, activa: true },
          { nombre: 'Enfermeria', numeroRelevador: 4, activa: true }
        ]
      },
      {
        nombre: 'Planta Cortinas',
        serial: 'AJR8194660303',
        ip: '192.168.200.197',
        puerto: 4370,
        puertas: [
          { nombre: 'Subida a Chiller', numeroRelevador: 1, activa: true },
          { nombre: 'Se desconoce', numeroRelevador: 2, activa: false },
          { nombre: 'Cuarentena', numeroRelevador: 3, activa: true },
          { nombre: 'Cuarto Electrico', numeroRelevador: 4, activa: true }
        ]
      }
    ]);

    console.log("Paneles y puertas iniciales cargados en MongoDB.");
  } catch (error) {
    console.error("Error al crear paneles iniciales:", error);
  }
};
const seedAccessGroups = async () => {
    try {
        // 1. Verificamos si los grupos ya existen para no duplicarlos cada vez que inicie la API
        const count = await AccessGroup.countDocuments();
        if (count > 0) {
            console.log('✅ [Paperless Setup] Los grupos de acceso ya están inicializados.');
            return;
        }

        console.log('⏳ [Paperless Setup] Creando grupos de acceso por defecto...');

        // 2. Definimos los grupos extraídos de tu configuración
        const initialGroups = [
            {
                name: 'General',
                timeZone: {
                    idZKTeco: 1, 
                    description: '24-Hour Access'
                },
                doors: [
                    // Del Panel: Segundo Piso (192.168.200.192)
                    { panelIp: '192.168.200.192', numeroRelevador: 2, doorName: 'Comedor' },
                    { panelIp: '192.168.200.192', numeroRelevador: 3, doorName: 'Entrada Personal' }
                ]
            },
            {
                name: 'IT',
                timeZone: { idZKTeco: 1, description: '24-Hour Access' },
                doors: [
                    { panelIp: '192.168.200.196', numeroRelevador: 3, doorName: 'Site' },
                    { panelIp: '192.168.200.194', numeroRelevador: 2, doorName: 'Sala de Juegos' },
                    { panelIp: '192.168.200.194', numeroRelevador: 3, doorName: 'Puerta Principal' },
                    { panelIp: '192.168.200.193', numeroRelevador: 1, doorName: 'Cortina Recepcion' },
                    { panelIp: '192.168.200.192', numeroRelevador: 1, doorName: 'Salida a Planta PA' },
                    { panelIp: '192.168.200.191', numeroRelevador: 2, doorName: 'Salida a Planta PB' },
                    { panelIp: '192.168.200.191', numeroRelevador: 4, doorName: 'Puerta Cristal' },
                    { panelIp: '192.168.200.191', numeroRelevador: 1, doorName: 'Recepcion' }
                ]
            },
            {
                name: 'Gerencia Finanzas',
                timeZone: { idZKTeco: 1, description: '24-Hour Access' },
                doors: [
                    { panelIp: '192.168.200.195', numeroRelevador: 3, doorName: 'Gerencia Finanzas' },
                    { panelIp: '192.168.200.194', numeroRelevador: 2, doorName: 'Sala de Juegos' },
                    { panelIp: '192.168.200.194', numeroRelevador: 3, doorName: 'Puerta Principal' },
                    { panelIp: '192.168.200.193', numeroRelevador: 1, doorName: 'Cortina Recepcion' },
                    { panelIp: '192.168.200.192', numeroRelevador: 1, doorName: 'Salida a Planta PA' },
                    { panelIp: '192.168.200.191', numeroRelevador: 1, doorName: 'Recepcion' },
                    { panelIp: '192.168.200.191', numeroRelevador: 2, doorName: 'Salida a Planta PB' },
                    { panelIp: '192.168.200.191', numeroRelevador: 4, doorName: 'Puerta Cristal' }
                ]
            },
            {
                name: 'Gerencia General',
                timeZone: { idZKTeco: 1, description: '24-Hour Access' },
                doors: [
                    { panelIp: '192.168.200.194', numeroRelevador: 2, doorName: 'Sala de Juegos' },
                    { panelIp: '192.168.200.194', numeroRelevador: 3, doorName: 'Puerta Principal' },
                    { panelIp: '192.168.200.193', numeroRelevador: 1, doorName: 'Cortina Recepcion' },
                    { panelIp: '192.168.200.192', numeroRelevador: 1, doorName: 'Salida a Planta PA' },
                    { panelIp: '192.168.200.191', numeroRelevador: 3, doorName: 'Oficina Gerencia General' },
                    { panelIp: '192.168.200.191', numeroRelevador: 1, doorName: 'Recepcion' },
                    { panelIp: '192.168.200.191', numeroRelevador: 2, doorName: 'Salida a Planta PB' },
                    { panelIp: '192.168.200.191', numeroRelevador: 4, doorName: 'Puerta Cristal' }
                ]
            },
            {
                name: 'Seguridad',
                timeZone: { idZKTeco: 1, description: '24-Hour Access' },
                doors: [
                    { panelIp: '192.168.200.197', numeroRelevador: 1, doorName: 'Subida a Chiller' },
                    { panelIp: '192.168.200.196', numeroRelevador: 4, doorName: 'Enfermeria' },
                    { panelIp: '192.168.200.196', numeroRelevador: 1, doorName: 'Recursos Humanos' },
                    { panelIp: '192.168.200.195', numeroRelevador: 2, doorName: 'Gerencia ventas' },
                    { panelIp: '192.168.200.194', numeroRelevador: 1, doorName: 'Puerta Cocina' },
                    { panelIp: '192.168.200.194', numeroRelevador: 2, doorName: 'Sala de Juegos' },
                    { panelIp: '192.168.200.194', numeroRelevador: 3, doorName: 'Puerta Principal' },
                    { panelIp: '192.168.200.193', numeroRelevador: 1, doorName: 'Cortina Recepcion' },
                    { panelIp: '192.168.200.193', numeroRelevador: 2, doorName: 'Laboratorio Calidad' },
                    { panelIp: '192.168.200.192', numeroRelevador: 1, doorName: 'Salida a Planta PA' },
                    { panelIp: '192.168.200.191', numeroRelevador: 1, doorName: 'Recepcion' },
                    { panelIp: '192.168.200.191', numeroRelevador: 2, doorName: 'Salida a Planta PB' },
                    { panelIp: '192.168.200.191', numeroRelevador: 4, doorName: 'Puerta Cristal' }
                ]
            },
            {
                name: 'Mantenimiento',
                timeZone: { idZKTeco: 1, description: '24-Hour Access' },
                doors: [
                    { panelIp: '192.168.200.197', numeroRelevador: 1, doorName: 'Subida a Chiller' },
                    { panelIp: '192.168.200.197', numeroRelevador: 4, doorName: 'Cuarto Electrico' },
                    { panelIp: '192.168.200.196', numeroRelevador: 1, doorName: 'Recursos Humanos' },
                    { panelIp: '192.168.200.196', numeroRelevador: 2, doorName: 'Cuarto Limpieza' },
                    { panelIp: '192.168.200.195', numeroRelevador: 2, doorName: 'Gerencia ventas' },
                    { panelIp: '192.168.200.195', numeroRelevador: 3, doorName: 'Gerencia Finanzas' },
                    { panelIp: '192.168.200.195', numeroRelevador: 1, doorName: 'Customer Service' },
                    { panelIp: '192.168.200.194', numeroRelevador: 1, doorName: 'Puerta Cocina' },
                    { panelIp: '192.168.200.194', numeroRelevador: 2, doorName: 'Sala de Juegos' },
                    { panelIp: '192.168.200.194', numeroRelevador: 3, doorName: 'Puerta Principal' },
                    { panelIp: '192.168.200.193', numeroRelevador: 1, doorName: 'Cortina Recepcion' },
                    { panelIp: '192.168.200.193', numeroRelevador: 2, doorName: 'Laboratorio Calidad' },
                    { panelIp: '192.168.200.192', numeroRelevador: 1, doorName: 'Salida a Planta PA' }
                ]
            },
            {
                name: 'Laboratorio',
                timeZone: { idZKTeco: 1, description: '24-Hour Access' },
                doors: [
                    { panelIp: '192.168.200.193', numeroRelevador: 2, doorName: 'Laboratorio Calidad' }
                ]
            },
            {
                name: 'RH',
                timeZone: { idZKTeco: 1, description: '24-Hour Access' },
                doors: [
                    { panelIp: '192.168.200.196', numeroRelevador: 1, doorName: 'Recursos Humanos' }
                ]
            },
            {
                name: 'Limpieza',
                timeZone: { idZKTeco: 1, description: '24-Hour Access' },
                doors: [
                    { panelIp: '192.168.200.196', numeroRelevador: 2, doorName: 'Cuarto Limpieza' },
                    { panelIp: '192.168.200.196', numeroRelevador: 1, doorName: 'Recursos Humanos' },
                    { panelIp: '192.168.200.195', numeroRelevador: 2, doorName: 'Gerencia ventas' },
                    { panelIp: '192.168.200.195', numeroRelevador: 3, doorName: 'Gerencia Finanzas' },
                    { panelIp: '192.168.200.195', numeroRelevador: 1, doorName: 'Customer Service' },
                    { panelIp: '192.168.200.194', numeroRelevador: 1, doorName: 'Puerta Cocina' },
                    { panelIp: '192.168.200.194', numeroRelevador: 2, doorName: 'Sala de Juegos' },
                    { panelIp: '192.168.200.194', numeroRelevador: 3, doorName: 'Puerta Principal' },
                    { panelIp: '192.168.200.193', numeroRelevador: 1, doorName: 'Cortina Recepcion' },
                    { panelIp: '192.168.200.193', numeroRelevador: 2, doorName: 'Laboratorio Calidad' },
                    { panelIp: '192.168.200.192', numeroRelevador: 1, doorName: 'Salida a Planta PA' },
                    { panelIp: '192.168.200.191', numeroRelevador: 1, doorName: 'Recepcion' },
                    { panelIp: '192.168.200.191', numeroRelevador: 2, doorName: 'Salida a Planta PB' },
                    { panelIp: '192.168.200.191', numeroRelevador: 3, doorName: 'Oficina Gerencia General' },
                    { panelIp: '192.168.200.191', numeroRelevador: 4, doorName: 'Puerta Cristal' }
                ]
            },
            {
                name: 'Oficinas',
                timeZone: { idZKTeco: 1, description: '24-Hour Access' },
                doors: [
                    { panelIp: '192.168.200.193', numeroRelevador: 1, doorName: 'Cortina Recepcion' },
                    { panelIp: '192.168.200.192', numeroRelevador: 1, doorName: 'Salida a Planta PA' },
                    { panelIp: '192.168.200.191', numeroRelevador: 1, doorName: 'Recepcion' },
                    { panelIp: '192.168.200.191', numeroRelevador: 2, doorName: 'Salida a Planta PB' },
                    { panelIp: '192.168.200.191', numeroRelevador: 4, doorName: 'Puerta Cristal' }
                ]
            },
            {
                name: 'Sala de Juegos',
                timeZone: { idZKTeco: 1, description: '24-Hour Access' },
                doors: [
                    { panelIp: '192.168.200.194', numeroRelevador: 2, doorName: 'Sala de Juegos' }
                ]
            },
            {
                name: 'Oficinas D',
                timeZone: {
                    idZKTeco: 2, // ID numérico que enviaremos al hardware para este horario
                    description: 'Dia Entre Semana (06:00 a 19:00)'
                },
                doors: [
                    // Del Panel: Segundo Piso (192.168.200.192)
                    { panelIp: '192.168.200.192', numeroRelevador: 1, doorName: 'Salida a Planta PA' },
                    // Del Panel: Site (192.168.200.191)
                    { panelIp: '192.168.200.191', numeroRelevador: 1, doorName: 'Recepcion' },
                    { panelIp: '192.168.200.191', numeroRelevador: 2, doorName: 'Salida a Planta PB' },
                    { panelIp: '192.168.200.191', numeroRelevador: 4, doorName: 'Puerta Cristal' }
                ]
            },
           {
                name: 'Comedor',
                timeZone: { idZKTeco: 1, description: '24-Hour Access' },
                doors: [
                    { panelIp: '192.168.200.194', numeroRelevador: 1, doorName: 'Puerta Cocina' }
                ]
            },
            {
                name: 'Customer Service',
                timeZone: { idZKTeco: 1, description: '24-Hour Access' },
                doors: [
                    { panelIp: '192.168.200.195', numeroRelevador: 1, doorName: 'Customer Service' }
                ]
            },
            {
                name: 'Account Manager',
                timeZone: { idZKTeco: 1, description: '24-Hour Access' },
                doors: [
                    { panelIp: '192.168.200.195', numeroRelevador: 2, doorName: 'Gerencia ventas' }
                ]
            }

        ];

        // 3. Insertamos en MongoDB
        await AccessGroup.insertMany(initialGroups);
        console.log('🚀 [Paperless Setup] Grupos de acceso (General, Oficinas D) creados con éxito.');

    } catch (error) {
        console.error('🔴 [Paperless Setup] Error inicializando los grupos de acceso:', error);
    }
};

const seedCredentials = async () => {
    try {
        const count = await AccessCredential.countDocuments();
        if (count > 0) {
            console.log('✅ [Paperless Setup] Las credenciales ya están inicializadas.');
            return;
        }

        console.log('⏳ [Paperless Setup] Procesando credenciales por defecto...');

        // Datos extraídos exactamente de tu configuración en ZKBio
        const rawCredentials = [
          {
                personnelId: "11513",
                firstName: "Victor",
                lastName: "Ibarra",
                cardNumber: "6478759",
                groupName: "Oficinas"
            },
            {
                personnelId: "1119456",
                firstName: "Prestamo",
                lastName: "Producción",
                cardNumber: "5608526",
                groupName: "Seguridad"
            },
            {
                personnelId: "124358",
                firstName: "Vishnu",
                lastName: "Vidyadharan",
                cardNumber: "5668059",
                groupName: "Oficinas"
            },
            {
                personnelId: "10329",
                firstName: "Fabian",
                lastName: "Ramos",
                cardNumber: "6700872",
                groupName: "IT"
            },
            {
                personnelId: "11677",
                firstName: "Itzel",
                lastName: "Bustamante",
                cardNumber: "5927288",
                groupName: "IT"
            },
            {
                personnelId: "11651",
                firstName: "Daniel",
                lastName: "Gonzalez",
                cardNumber: "6700861",
                groupName: "Oficinas D"
            },
            {
                personnelId: "124357",
                firstName: "Marilu",
                lastName: "",
                cardNumber: "7045658",
                groupName: "Limpieza"
            },
            {
                personnelId: "10952",
                firstName: "Caleb",
                lastName: "Sanchez",
                cardNumber: "5667996",
                groupName: "Oficinas"
            },
            {
                personnelId: "11429",
                firstName: "Gilberto",
                lastName: "Medina",
                cardNumber: "7045593",
                groupName: "Oficinas"
            },
            {
                personnelId: "10455",
                firstName: "Jose",
                lastName: "Barrera",
                cardNumber: "5668093",
                groupName: "Oficinas"
            },
            {
                personnelId: "10175",
                firstName: "Leonardo",
                lastName: "Mateos",
                cardNumber: "1992745",
                groupName: "Oficinas"
            },
            {
                personnelId: "10654",
                firstName: "Guadalupe",
                lastName: "Sanchez",
                cardNumber: "5891639",
                groupName: "Oficinas D"
            },
            {
                personnelId: "10822",
                firstName: "Alejandro",
                lastName: "Mata",
                cardNumber: "5668176",
                groupName: "Oficinas D"
            },
            {
                personnelId: "10624",
                firstName: "Beatriz",
                lastName: "Nolazco",
                cardNumber: "1992821",
                groupName: "Laboratorio"
            },
            {
                personnelId: "11392",
                firstName: "Eligio",
                lastName: "Santiago",
                cardNumber: "5891287",
                groupName: "Laboratorio"
            },
            {
                personnelId: "11376",
                firstName: "Alberto",
                lastName: "Enrriquez",
                cardNumber: "5608540",
                groupName: "Laboratorio"
            },
            {
                personnelId: "10329",
                firstName: "Fabian",
                lastName: "Ramos",
                cardNumber: "6700872",
                groupName: "IT"
            },
            {
                personnelId: "10329",
                firstName: "Fabian",
                lastName: "Ramos",
                cardNumber: "6700872",
                groupName: "IT"
            },
            {
                personnelId: "10329",
                firstName: "Fabian",
                lastName: "Ramos",
                cardNumber: "6700872",
                groupName: "IT"
            },
            {
                personnelId: "10329",
                firstName: "Fabian",
                lastName: "Ramos",
                cardNumber: "6700872",
                groupName: "IT"
            },
            {
                personnelId: "10329",
                firstName: "Fabian",
                lastName: "Ramos",
                cardNumber: "6700872",
                groupName: "IT"
            },
            {
                personnelId: "10329",
                firstName: "Fabian",
                lastName: "Ramos",
                cardNumber: "6700872",
                groupName: "IT"
            },
            
        ];

        for (const raw of rawCredentials) {
            // 1. Buscar el Grupo de Acceso
            const group = await AccessGroup.findOne({ name: raw.groupName });
            if (!group) {
                console.warn(`⚠️ No se encontró el grupo '${raw.groupName}' para la tarjeta ${raw.cardNumber}. Saltando...`);
                continue;
            }

            // 2. Buscar si existe el Empleado en la base de datos
            const employeeRecord = await Employees.findOne({ numberEmployee: raw.personnelId });

            // 3. Preparar el documento de la credencial
            const newCredential = new AccessCredential({
                personnelId: raw.personnelId,
                cardNumber: raw.cardNumber,
                accessGroup: group._id,
                // Lógica condicional: Si existe el empleado lo ligamos, si no, guardamos el nombre genérico
                employee: employeeRecord ? employeeRecord._id : null,
                guestName: !employeeRecord ? `${raw.firstName} ${raw.lastName}` : null
            });

            await newCredential.save();
            console.log(`✔️ Credencial registrada: ${raw.cardNumber} (${employeeRecord ? 'Empleado' : 'Préstamo'})`);
        }

        console.log('🚀 [Paperless Setup] Carga de credenciales finalizada con éxito.');

    } catch (error) {
        console.error('🔴 [Paperless Setup] Error inicializando credenciales:', error);
    }
};

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
  updateEmployeesData,
  createDevicesAutomation,
  createPanel,
  seedAccessGroups,
  seedCredentials
}

