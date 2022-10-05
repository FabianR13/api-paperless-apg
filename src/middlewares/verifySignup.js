const Role = require("../models/Role.js");
const User = require("../models/User.js");
const Employees = require("../models/Employees.js");

//Metodo para verificar emails duplicados/////////////////////////////////////////////////////////////////////////////////////////
const checkDuplicateUsernameorEmail = async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username })
  if (user) return res.status(400).json({ message: 'The user already exists' })

  const email = await User.findOne({ email: req.body.email })
  if (email) return res.status(400).json({ message: 'The email already exists' })

  next();
}
//Metodo para verificar numeros de empleado duplicados////////////////////////////////////////////////////////////////////////////
const checkDuplicateEmployeeNo = async (req, res, next) => {
  const employee = await Employees.findOne({ numberEmployee: req.body.numberEmployee })
  if (employee) return res.status(400).json({ message: 'The number employee already exists' })

  next();
}
//Metodo para verificar si el rol no esta duplicado//////////////////////////////////////////////////////////////////////////////
const checkDuplicateRole = async (req, res, next) => {
  const role = await Role.findOne({ name: req.body.name })
  if (role) return res.status(400).json({ message: 'The role already exists' })

  next();
}

module.exports = {
  checkDuplicateUsernameorEmail,
  checkDuplicateEmployeeNo,
  checkDuplicateRole
};