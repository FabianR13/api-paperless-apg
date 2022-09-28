// Validator

import { ROLES } from "../models/Role";
import User from "../models/User";
import Employees from "../models/Employees";
import Role from "../models/Role";

export const checkDuplicateUsernameorEmail = async (req, res, next) => {
    
    const user = await User.findOne({username: req.body.username})
    if(user) return res.status(400).json({message :'The user already exists'})

    const email = await User.findOne({email: req.body.email})
    if(email) return res.status(400).json({message :'The email already exists'})

    next();

}

export const checkDuplicateEmployeeNo = async (req, res, next) => {
    
  const employee = await Employees.findOne({numberEmployee: req.body.numberEmployee})
  if(employee) return res.status(400).json({message :'The number employee already exists'})

  next();

}

export const checkDuplicateRole = async (req, res, next) => {
    
  const role = await Role.findOne({name: req.body.name})
  if(role) return res.status(400).json({message :'The role already exists'})

  next();

}

export const checkRolesExisted = (req, res, next) => {
  console.log(req.body)
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(400).json({
          message: `Role ${req.body.roles[i]} does not exists`,
        });
      }
    }
  }

  next();
};
