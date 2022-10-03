const fs = require("fs");
const Employees = require( "../models/Employees.js");
const Deparment = require( "../models/Deparment.js");
const Company = require( "../models/Company.js");
const Department = require( "../models/Deparment.js");
const Position = require( "../models/Position.js");
// import Employees from "../models/Employees.js";
// import Deparment from "../models/Deparment.js";
// import Company from "../models/Company.js";
// import Department from "../models/Deparment.js";
// import Position from "../models/Position.js";
// import User from "../models/User.js";
// import jwt from "jsonwebtoken";
// import config from "../config.js";
// import Role from "../models/Role.js";
// import Dashboard from "../models/Dashboard.js";

// import fs from "fs";

//nuevo empleado
const signEmployee = async (req, res) => {
    const{ 
        name, 
        lastName,
        numberEmployee,
        department,
        position,
        active,
        user,
        company,
    } = req.body;

//Retreiving the data for each picture Image and adding to the schema

let picture = "";

if (req.file) {
    picture = req.file.filename;
}



    const newEmployee = new Employees ({
        name, 
        lastName, 
        numberEmployee, 
        active,
        picture,
        user, 
    });
    
    if (company) {
      const foundCompany = await Company.find({
        _id: { $in: company},
      });
      newEmployee.company = foundCompany.map((company) => company._id);
    }
  
    if(department){
        const foundDepartments = await Department.find({
            name: { $in: department},
        });
        newEmployee.department = foundDepartments.map((department) => department._id);
    } else{
        const department =await Deparment.findOne({name: "GENERAL"});
        newEmployee.department = [department._id];
    }
    
  if (position) {
    const foundPositions = await Position.find({
      name: { $in: position },
    });
    newEmployee.position = foundPositions.map((position) => position._id);
  } else {
    const position = await Position.findOne({ name: "Supervisor" });
    newEmployee.position = [position._id];
  }


  newEmployee.save((error, newEmployee) => {
    if (error) return res.status(400).json({ status: "400", message: error });
    if (newEmployee) {
      res.json({ status: "200", message: "Employee created", body: newEmployee });
    }
  });

    // const savedEmployee = await newEmployee.save();
    // // const token = jwt.sign({id: savedEmployee._id}, config.SECRET,{
    // //     expiresIn: 86400, //se expira en 24 horas
    // // })
    
    // res.json({status: "200", message: "Employee created", savedEmployee   });
    // res.status(200).json({token});
};
// Getting all positions
const getPositions = async (req, res) => {
    const positions = await Position.find().sort({name: 1});
    res.json({ status: "200", message: "Position Loaded", body: positions });
  };

  // Getting all positions
const getDepartments = async (req, res) => {
  const departments = await Deparment.find().sort({name: 1});
  res.json({ status: "200", message: "Department Loaded", body: departments });
};
  // Getting all employees
const getEmployees = async (req, res) => {
    const {CompanyId} = req.params
    if(CompanyId.length !== 24){
      return;
    }
    const company = await Company.find({
      _id: { $in: CompanyId },
    })
    if(!company){
      return;
    }
    const employees = await Employees.find({
      company: { $in: CompanyId },
    }).sort({name: 1}).populate({ path: 'department', select:"name"}).populate({ path: 'position', select:"name"});
    res.json({ status: "200", message: "Employees Loaded", body: employees });
    
  };
 // Updating the employee user
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
 // Updating employee
const updateEmployee = async (req, res) => {
  const newDepartment=req.body.department
  const newPosition=req.body.position
  const { employeeId } = req.params;
  const empUpd = [];

  empUpd.name=req.body.name;
  empUpd.lastName=req.body.lastName;
  empUpd.numberEmployee=req.body.numberEmployee;

  const employee = await Employees.findOne({numberEmployee: req.body.numberEmployee})
  if (employee){
    if(employee._id.toString()!==employeeId) return res.status(400).json({message :'The number employee already exists'})
  }
 


  empUpd.active=req.body.active;

  //Verify department
   if(newDepartment){
    const foundDepartments = await Department.find({
        name: { $in: newDepartment},
    });
    empUpd.department  = foundDepartments.map((department) => department._id);
    

}
//verify position
   if (newPosition) {
    const foundPositions = await Position.find({
      name: { $in: newPosition },
    });
    empUpd.position = foundPositions.map((position) => position._id);
  }


  const { 
    name,
    lastName,
    numberEmployee,
    department,
    position,
    active,
   } = empUpd;

  const updatedEmployee = await Employees.updateOne(
    { _id: employeeId },
    {
      $set: {
        name,
        lastName,
        numberEmployee,
        department,
        position,
        active,
      },
    }
  );

  if (!updatedEmployee) {
    res
      .status(403)
      .json({ status: "403", message: "Employee not Updated", body: "" });
  }

  res.status(200).json({
    status: "200",
    message: "Employee Updated",
    body: updatedEmployee,
  });
};

// Function to modify the Image from a employee
const modifyProfileImg = async (req, res) => {
  const { employeeId } = req.params;

  //Getting Previous Images
  const foundPrevEmployee = await Employees.findById(employeeId);

  const path =
    "C:\\Paperless\\PAPERLESS-APG\\public\\Uploads\\Employees\\";
    // "E:\\Paperless\\PAPERLESS-APG\\build\\Uploads\\Employees\\";

  // Deleting Images from Folder
  const prevEmployeeImg = foundPrevEmployee.picture;
  if (prevEmployeeImg) {
    // Validating if there are Images in the Field
        // Delete File from Folder
        try {
          fs.unlink(path + prevEmployeeImg, (err) => {
            if (err) {
              res.status(403).json({
                status: "403",
                message: "Error al eliminar Archivo: " + err,
                body: "",
              });
            }
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
    { $set: { picture: ""} }
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
      picture = req.file.filename;
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


module.exports ={
  signEmployee,
  getPositions,
  getDepartments,
  getEmployees,
  updateEmployee,
  updateEmployeeUser,
  modifyProfileImg
};