const Employees = require("../models/Employees.js");
const Deparment = require("../models/Deparment.js");
const Company = require("../models/Company.js");
const Department = require("../models/Deparment.js");
const Position = require("../models/Position.js");
const AWS = require('aws-sdk');

//Variables para acceder a s3 bucket///
AWS.config.update({
  region: process.env.S3_BUCKET_REGION,
  apiVersion: 'latest',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  }
})

const s3 = new AWS.S3();

// CREAR NUEVO EMPLEADO //////////////////////////////////////////////////////////////////////////////////////////////////
const createEmployee = async (req, res) => {
  try {
    const {
      name,
      lastName,
      numberEmployee,
      department,
      position,
      active,
      group,
      visualWeakness,
      user,
      startDate,
      company,
    } = req.body;

    let picture = "";
    if (req.file) {
      picture = req.file.key;
    }

    const newEmployee = new Employees({
      name,
      lastName,
      numberEmployee,
      active,
      picture,
      group,
      visualWeakness,
      user,
      startDate
    });

    if (company) {
      const foundCompany = await Company.findById(company);
      if (!foundCompany) {
        return res.status(404).json({ status: "404", message: "La compañía especificada no existe." });
      }
      newEmployee.company = foundCompany._id;
    }

    if (department) {
      const foundDepartment = await Department.findById(department);
      if (!foundDepartment) {
        return res.status(404).json({ status: "404", message: `El departamento no fue encontrado.` });
      }
      newEmployee.department = foundDepartment._id;
    }

    if (position) {
      const foundPosition = await Position.findById(position);
      if (!foundPosition) {
        return res.status(404).json({ status: "404", message: "La posición especificada no fue encontrada." });
      }
      newEmployee.position = foundPosition._id;
    }

    const savedEmployee = await newEmployee.save();

    return res.status(200).json({
      status: "200",
      message: "Employee created successfully",
      body: savedEmployee
    });

  } catch (error) {
    if (error.code === 11000) {
      const duplicatedField = Object.keys(error.keyValue)[0];
      const duplicatedValue = error.keyValue[duplicatedField];

      return res.status(400).json({
        status: "400",
        message: `El número de empleado ${duplicatedValue} ya está en uso.`
      });
    }

    console.error("Error en createEmployee:", error);
    return res.status(500).json({
      status: "500",
      message: "Ocurrió un error en el servidor al intentar guardar el empleado.",
      error: error.message
    });
  }
};

// Getting all positions////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getPositions = async (req, res) => {
  const positions = await Position.find().sort({ name: 1 }).populate({ path: 'department', select: "name" });
  res.json({ status: "200", message: "Position Loaded", body: positions });
};
// Getting all positions///////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getDepartments = async (req, res) => {
  const departments = await Deparment.find().sort({ name: 1 });
  res.json({ status: "200", message: "Department Loaded", body: departments });
};


// Getting all employees///////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getEmployees = async (req, res) => {
  const { filter, order } = req.body;
  const { employeeStatus, CompanyId } = req.params;
  const { simple } = req.query; 

  if (CompanyId.length !== 24) {
    return res.status(400).json({ status: "400", message: "Invalid Company ID" });
  }

  const company = await Company.exists({ _id: CompanyId });
  if (!company) {
    return res.status(404).json({ status: "404", message: "Company not found" });
  }

  const sortOptions = {};
  if (filter) {
    const sortField = filter === "employeeNo" ? "numberEmployee" : filter;
    const sortDirection = order === "acend" ? 1 : -1;
    sortOptions[sortField] = sortDirection;
  } else {
    sortOptions['name'] = 1;
  }

  try {
    let employees;

    if (simple === 'true') {
      employees = await Employees.find({
        company: { $in: CompanyId },
        active: { $in: employeeStatus },
      })
        .sort(sortOptions)
        .select('name lastName numberEmployee active picture department position')
        .populate({ path: 'department', select: 'name' })
        .populate({ path: 'position', select: 'name' });
    } else {
      employees = await Employees.find({
        company: { $in: CompanyId },
        active: { $in: employeeStatus },
      })
        .sort(sortOptions)
        .populate({ path: 'department', select: 'name' })
        .populate({ path: 'position', select: 'name' });
    }

    res.json({ status: "200", message: "Employees Loaded", body: employees });

  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ status: "500", message: "Error fetching employees" });
  }
};

// Updating the employee user////////////////////////////////////////////////////////////////////////////////////////////////////////////
const updateEmployeeUser = async (req, res) => {
  const { employeeId } = req.params;
  const { user } = req.body;

  const updatedEmployeeUser = await Employees.updateOne(
    { _id: employeeId },
    {
      $set: {
        user
      },
    }
  );
  if (!updatedEmployeeUser) {
    res
      .status(403)
      .json({ status: "403", message: "Employee not Updated", body: "" });
  }
  res.status(200).json({
    status: "200",
    message: "Employee Status Updated ",
    body: updatedEmployeeUser,
  });
};
// Updating employee//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const updateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const {
      name,
      lastName,
      numberEmployee,
      department: newDepartment,
      position: newPosition,
      active,
      group,
      visualWeakness,
      startDate
    } = req.body;

    const updateData = {
      name,
      lastName,
      numberEmployee,
      active,
      group,
      visualWeakness,
      startDate
    };

    if (numberEmployee) {
      const existingEmployee = await Employees.findOne({ numberEmployee });
      if (existingEmployee && existingEmployee._id.toString() !== employeeId) {
        return res.status(400).json({
          status: "400",
          message: `El número de empleado ${numberEmployee} ya está en uso por otro empleado.`
        });
      }
    }

    if (newDepartment) {
      const foundDepartment = await Department.findById(newDepartment);
      if (!foundDepartment) {
        return res.status(404).json({
          status: "404",
          message: `El departamento no fue encontrado.`
        });
      }
      updateData.department = foundDepartment._id;
    }

    // 4. Verificar posición (por ID) y asignar solo un ID (ya no un arreglo)
    if (newPosition) {
      const foundPosition = await Position.findById(newPosition);
      if (!foundPosition) {
        return res.status(404).json({
          status: "404",
          message: "La posición especificada no fue encontrada."
        });
      }
      updateData.position = foundPosition._id;
    }

    const updatedEmployee = await Employees.findByIdAndUpdate(
      employeeId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        status: "404",
        message: "Empleado no encontrado o no pudo ser actualizado."
      });
    }

    return res.status(200).json({
      status: "200",
      message: "Employee Updated successfully",
      body: updatedEmployee,
    });

  } catch (error) {
    if (error.code === 11000) {
      const duplicatedField = Object.keys(error.keyValue)[0];
      const duplicatedValue = error.keyValue[duplicatedField];
      return res.status(400).json({
        status: "400",
        message: `El valor '${duplicatedValue}' ya está en uso en el campo ${duplicatedField}.`
      });
    }

    console.error("Error en updateEmployee:", error);
    return res.status(500).json({
      status: "500",
      message: "Ocurrió un error en el servidor al intentar actualizar el empleado.",
      error: error.message
    });
  }
};
// Function to modify the Image from a employee///////////////////////////////////////////////////////////////////////////////////////
const modifyProfileImg = async (req, res) => {
  const { employeeId } = req.params;
  //Getting Previous Images
  const foundPrevEmployee = await Employees.findById(employeeId);

  // Deleting Images from Folder
  const prevEmployeeImg = foundPrevEmployee.picture;
  if (prevEmployeeImg) {
    // Validating if there are Images in the Field
    // Delete File from Folder
    const params = {
      Bucket: process.env.S3_BUCKET_NAME + "/Uploads/Employees",
      Key: prevEmployeeImg
    };
    try {
      s3.deleteObject(params, function (err, data) {
        if (err) console.log(err);
      });
    } catch (error) {
      res.status(403).json({
        status: "403",
        message: error,
        body: "",
      });
    }
  }

  // Setting the Fields Empty in the DB
  const updateClearImgEmployee = await Employees.updateOne(
    { _id: employeeId },
    { $set: { picture: "" } }
  );

  if (!updateClearImgEmployee) {
    res.status(403).json({
      status: "403",
      message: "EMPLOYEE not Updated - updateClearImgEmployee",
      body: "",
    });
  }

  //Retreiving the data for each profile Image and adding to the schema
  let picture = "";

  if (req.file) {
    picture = req.file.key;
  }

  // Updating the new Img Names in the fields from the DB
  const updateImgEmployee = await Employees.updateOne(
    { _id: employeeId },
    { $set: { picture } }
  );

  if (!updateImgEmployee) {
    res.status(403).json({
      status: "403",
      message: "Employee not Updated - updateImgEmployee",
      body: "",
    });
  }

  const foundEmployeeNew = await Employees.findById(employeeId);

  res.status(200).json({
    status: "200",
    message: "Employee Updated",
    body: foundEmployeeNew,
  });
};


module.exports = {
  createEmployee,
  getPositions,
  getDepartments,
  getEmployees,
  updateEmployee,
  updateEmployeeUser,
  modifyProfileImg
};