const Employees = require("../models/Employees.js");

const Deparment = require("../models/Deparment.js");

const Company = require("../models/Company.js");

const Department = require("../models/Deparment.js");

const Position = require("../models/Position.js");

const AWS = require('aws-sdk');

const dotenv = require('dotenv');

dotenv.config({
  path: "C:\\api-paperless-apg\\src\\.env"
}); //Variables para acceder a s3 bucket///

AWS.config.update({
  region: process.env.S3_BUCKET_REGION,
  apiVersion: 'latest',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  }
});
const s3 = new AWS.S3(); //nuevo empleado//////////////////////////////////////////////////////////////////////////////////////////////////

const signEmployee = async (req, res) => {
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
    company
  } = req.body; //Retreiving the data for each picture Image and adding to the schema

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
    user
  }); //Buscar compañia y agregar id al empleado

  if (company) {
    const foundCompany = await Company.find({
      _id: {
        $in: company
      }
    });
    newEmployee.company = foundCompany.map(company => company._id);
  } //buscar departamento y agregar id al empleado


  if (department) {
    const foundDepartments = await Department.find({
      name: {
        $in: department
      }
    });
    newEmployee.department = foundDepartments.map(department => department._id);
  } else {
    const department = await Deparment.findOne({
      name: "GENERAL"
    });
    newEmployee.department = [department._id];
  } //buscar posicion y agregar id al empleado


  if (position) {
    const foundPositions = await Position.find({
      name: {
        $in: position
      }
    });
    newEmployee.position = foundPositions.map(position => position._id);
  } else {
    const position = await Position.findOne({
      name: "Supervisor"
    });
    newEmployee.position = [position._id];
  } //guardar empleado


  newEmployee.save((error, newEmployee) => {
    if (error) return res.status(400).json({
      status: "400",
      message: error
    });

    if (newEmployee) {
      res.json({
        status: "200",
        message: "Employee created",
        body: newEmployee
      });
    }
  });
}; // Getting all positions////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const getPositions = async (req, res) => {
  const positions = await Position.find().sort({
    name: 1
  });
  res.json({
    status: "200",
    message: "Position Loaded",
    body: positions
  });
}; // Getting all positions///////////////////////////////////////////////////////////////////////////////////////////////////////////////


const getDepartments = async (req, res) => {
  const departments = await Deparment.find().sort({
    name: 1
  });
  res.json({
    status: "200",
    message: "Department Loaded",
    body: departments
  });
}; // Getting all employees///////////////////////////////////////////////////////////////////////////////////////////////////////////////


const getEmployees = async (req, res) => {
  const {
    filter,
    order
  } = req.body;
  const {
    employeeStatus
  } = req.params;
  const {
    CompanyId
  } = req.params;

  if (CompanyId.length !== 24) {
    return;
  }

  const company = await Company.find({
    _id: {
      $in: CompanyId
    }
  });

  if (!company) {
    return;
  }

  if (filter === "name") {
    if (order === "acend") {
      const employees = await Employees.find({
        company: {
          $in: CompanyId
        },
        active: {
          $in: employeeStatus
        }
      }).sort({
        name: 1
      }).populate({
        path: 'department',
        select: "name"
      }).populate({
        path: 'position',
        select: "name"
      });
      res.json({
        status: "200",
        message: "Employees Loaded",
        body: employees
      });
    } else {
      const employees = await Employees.find({
        company: {
          $in: CompanyId
        },
        active: {
          $in: employeeStatus
        }
      }).sort({
        name: -1
      }).populate({
        path: 'department',
        select: "name"
      }).populate({
        path: 'position',
        select: "name"
      });
      res.json({
        status: "200",
        message: "Employees Loaded",
        body: employees
      });
    }
  }

  if (filter === "lastName") {
    if (order === "acend") {
      const employees = await Employees.find({
        company: {
          $in: CompanyId
        },
        active: {
          $in: employeeStatus
        }
      }).sort({
        lastName: 1
      }).populate({
        path: 'department',
        select: "name"
      }).populate({
        path: 'position',
        select: "name"
      });
      res.json({
        status: "200",
        message: "Employees Loaded",
        body: employees
      });
    } else {
      const employees = await Employees.find({
        company: {
          $in: CompanyId
        },
        active: {
          $in: employeeStatus
        }
      }).sort({
        lastName: -1
      }).populate({
        path: 'department',
        select: "name"
      }).populate({
        path: 'position',
        select: "name"
      });
      res.json({
        status: "200",
        message: "Employees Loaded",
        body: employees
      });
    }
  }

  if (filter === "employeeNo") {
    if (order === "acend") {
      const employees = await Employees.find({
        company: {
          $in: CompanyId
        },
        active: {
          $in: employeeStatus
        }
      }).sort({
        numberEmployee: 1
      }).populate({
        path: 'department',
        select: "name"
      }).populate({
        path: 'position',
        select: "name"
      });
      res.json({
        status: "200",
        message: "Employees Loaded",
        body: employees
      });
    } else {
      const employees = await Employees.find({
        company: {
          $in: CompanyId
        },
        active: {
          $in: employeeStatus
        }
      }).sort({
        numberEmployee: -1
      }).populate({
        path: 'department',
        select: "name"
      }).populate({
        path: 'position',
        select: "name"
      });
      res.json({
        status: "200",
        message: "Employees Loaded",
        body: employees
      });
    }
  }

  if (filter === "department") {
    if (order === "acend") {
      const employees = await Employees.find({
        company: {
          $in: CompanyId
        },
        active: {
          $in: employeeStatus
        }
      }).sort({
        department: 1
      }).populate({
        path: 'department',
        select: "name"
      }).populate({
        path: 'position',
        select: "name"
      });
      res.json({
        status: "200",
        message: "Employees Loaded",
        body: employees
      });
    } else {
      const employees = await Employees.find({
        company: {
          $in: CompanyId
        },
        active: {
          $in: employeeStatus
        }
      }).sort({
        department: -1
      }).populate({
        path: 'department',
        select: "name"
      }).populate({
        path: 'position',
        select: "name"
      });
      res.json({
        status: "200",
        message: "Employees Loaded",
        body: employees
      });
    }
  }

  if (filter === "position") {
    if (order === "acend") {
      const employees = await Employees.find({
        company: {
          $in: CompanyId
        },
        active: {
          $in: employeeStatus
        }
      }).sort({
        position: 1
      }).populate({
        path: 'department',
        select: "name"
      }).populate({
        path: 'position',
        select: "name"
      });
      res.json({
        status: "200",
        message: "Employees Loaded",
        body: employees
      });
    } else {
      const employees = await Employees.find({
        company: {
          $in: CompanyId
        },
        active: {
          $in: employeeStatus
        }
      }).sort({
        position: -1
      }).populate({
        path: 'department',
        select: "name"
      }).populate({
        path: 'position',
        select: "name"
      });
      res.json({
        status: "200",
        message: "Employees Loaded",
        body: employees
      });
    }
  }

  if (filter === "group") {
    if (order === "acend") {
      const employees = await Employees.find({
        company: {
          $in: CompanyId
        },
        active: {
          $in: employeeStatus
        }
      }).sort({
        group: 1
      }).populate({
        path: 'department',
        select: "name"
      }).populate({
        path: 'position',
        select: "name"
      });
      res.json({
        status: "200",
        message: "Employees Loaded",
        body: employees
      });
    } else {
      const employees = await Employees.find({
        company: {
          $in: CompanyId
        },
        active: {
          $in: employeeStatus
        }
      }).sort({
        group: -1
      }).populate({
        path: 'department',
        select: "name"
      }).populate({
        path: 'position',
        select: "name"
      });
      res.json({
        status: "200",
        message: "Employees Loaded",
        body: employees
      });
    }
  }
}; // Updating the employee user////////////////////////////////////////////////////////////////////////////////////////////////////////////


const updateEmployeeUser = async (req, res) => {
  const {
    employeeId
  } = req.params;
  const {
    user
  } = req.body;
  const updatedEmployeeUser = await Employees.updateOne({
    _id: employeeId
  }, {
    $set: {
      user
    }
  });

  if (!updatedEmployeeUser) {
    res.status(403).json({
      status: "403",
      message: "Employee not Updated",
      body: ""
    });
  }

  res.status(200).json({
    status: "200",
    message: "Employee Status Updated ",
    body: updatedEmployeeUser
  });
}; // Updating employee//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const updateEmployee = async (req, res) => {
  const newDepartment = req.body.department;
  const newPosition = req.body.position;
  const {
    employeeId
  } = req.params;
  const empUpd = [];
  empUpd.name = req.body.name;
  empUpd.lastName = req.body.lastName;
  empUpd.numberEmployee = req.body.numberEmployee;
  empUpd.group = req.body.group;
  empUpd.visualWeakness = req.body.visualWeakness;
  empUpd.numberEmployee = req.body.numberEmployee;
  const employee = await Employees.findOne({
    numberEmployee: req.body.numberEmployee
  });

  if (employee) {
    if (employee._id.toString() !== employeeId) return res.status(400).json({
      message: 'The number employee already exists'
    });
  }

  empUpd.active = req.body.active; //Verify department

  if (newDepartment) {
    const foundDepartments = await Department.find({
      name: {
        $in: newDepartment
      }
    });
    empUpd.department = foundDepartments.map(department => department._id);
  } //verify position


  if (newPosition) {
    const foundPositions = await Position.find({
      name: {
        $in: newPosition
      }
    });
    empUpd.position = foundPositions.map(position => position._id);
  }

  const {
    name,
    lastName,
    numberEmployee,
    department,
    position,
    active,
    group,
    visualWeakness
  } = empUpd;
  const updatedEmployee = await Employees.updateOne({
    _id: employeeId
  }, {
    $set: {
      name,
      lastName,
      numberEmployee,
      department,
      position,
      active,
      group,
      visualWeakness
    }
  });

  if (!updatedEmployee) {
    res.status(403).json({
      status: "403",
      message: "Employee not Updated",
      body: ""
    });
  }

  res.status(200).json({
    status: "200",
    message: "Employee Updated",
    body: updatedEmployee
  });
}; // Function to modify the Image from a employee///////////////////////////////////////////////////////////////////////////////////////


const modifyProfileImg = async (req, res) => {
  const {
    employeeId
  } = req.params; //Getting Previous Images

  const foundPrevEmployee = await Employees.findById(employeeId); // Deleting Images from Folder

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
        body: ""
      });
    }
  } // Setting the Fields Empty in the DB


  const updateClearImgEmployee = await Employees.updateOne({
    _id: employeeId
  }, {
    $set: {
      picture: ""
    }
  });

  if (!updateClearImgEmployee) {
    res.status(403).json({
      status: "403",
      message: "EMPLOYEE not Updated - updateClearImgEmployee",
      body: ""
    });
  } //Retreiving the data for each profile Image and adding to the schema


  let picture = "";

  if (req.file) {
    picture = req.file.key;
  } // Updating the new Img Names in the fields from the DB


  const updateImgEmployee = await Employees.updateOne({
    _id: employeeId
  }, {
    $set: {
      picture
    }
  });

  if (!updateImgEmployee) {
    res.status(403).json({
      status: "403",
      message: "Employee not Updated - updateImgEmployee",
      body: ""
    });
  }

  const foundEmployeeNew = await Employees.findById(employeeId);
  res.status(200).json({
    status: "200",
    message: "Employee Updated",
    body: foundEmployeeNew
  });
};

module.exports = {
  signEmployee,
  getPositions,
  getDepartments,
  getEmployees,
  updateEmployee,
  updateEmployeeUser,
  modifyProfileImg
};