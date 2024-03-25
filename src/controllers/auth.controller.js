const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const config = require("../config.js");
const Role = require("../models/Role.js");
const Dashboard = require("../models/Dashboard.js");
const Employees = require("../models/Employees.js");
const Company = require("../models/Company.js");
const dotenv = require('dotenv')
dotenv.config({ path: '../.env' });

//Crear un nuevo usuario///////////////////////////////////////////////////////////////////////////////////////////////////////////
const signUp = async (req, res) => {
  const { username, email, password, signature, roles, rolesAxiom, employee, companyAccess, company } = req.body;
  const newUser = new User({
    username,
    email,
    password: await User.encryptPassword(password),
    signature,
  });
  //Buscar roles en db y asignar a roles apg
  if (roles) {
    const foundRoles = await Role.find({ name: { $in: roles } });
    newUser.roles = foundRoles.map((role) => role._id);
  }
  //Buscar roles en db y asignar a roles axiom
  if (rolesAxiom) {
    const foundRoles = await Role.find({ name: { $in: rolesAxiom } });
    newUser.rolesAxiom = foundRoles.map((role) => role._id);
  }
  //buscar empleado y asisnar id de empleado a user
  if (employee) {
    const foundEmployees = await Employees.find({
      numberEmployee: { $in: employee },
    });
    newUser.employee = foundEmployees.map((employee) => employee._id);
  }
  //compañia a la que puede tener acceso el usuario
  if (companyAccess) {
    const foundCompany = await Company.find({
      name: { $in: companyAccess },
    });
    newUser.companyAccess = foundCompany.map((company) => company._id);
  }
  //compañia a la que pertenece el usuario
  if (company) {
    const foundCompany = await Company.find({
      _id: { $in: company },
    });
    newUser.company = foundCompany.map((company) => company._id);
  }

  const savedUser = await newUser.save();

  const token = jwt.sign({ id: savedUser._id }, process.env.SECRET, {
    expiresIn: 86400, // 24 Horas
    // expiresIn: 5,
  });

  res.json({ status: "200", message: "User created" });
  // res.status(200).json({ token });
};
//Crear nuevo rol//////////////////////////////////////////////////////////////////////////////////////////////////////////
const newRole = async (req, res) => {
  const { name, description, category } = req.body;

  const newRole = new Role({
    name,
    description,
    category,
  });

  const savedRole = await newRole.save();

  res.json({ status: "200", message: "Role created" });
};
//Login de usuario existente//////////////////////////////////////////////////////////////////////////////////////////////
const signIn = async (req, res) => {
  const userFound = await User.findOne({
    username: req.body.username,
  })
    .populate({ path: "roles", select: "name" })
    .populate({ path: "companyAccess" })
    .populate({ path: "company" })
    .populate({ path: "employee" });

  //comparar si existe el usuario
  if (!userFound)
    return res
      .status(404)
      .json({ token: null, message: "User not found", status: "404" });

  const matchPassword = await User.comparePassword(
    req.body.password,
    userFound.password
  );
  //Verificar que el usuario no este deshabilitado
  if (userFound.employee[0].active === false)
    return res
      .status(404)
      .json({ token: null, message: "User disabled", status: "404" });
  //Verificar que la contraseña sea correcta
  if (!matchPassword)
    return res
      .status(404)
      .json({ token: null, message: "Invalid password", status: "404" });

  const token = jwt.sign({ id: userFound._id }, process.env.SECRET, {
    expiresIn: 86400,
    // expiresIn: 5,
  });

  const roles = await Role.find({ _id: { $in: userFound.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: userFound.rolesAxiom } });

  let apg = "";
  let axg = "";

  //Validar a que compañia tiene acceso
  for (let i = 0; i < userFound.companyAccess.length; i++) {
    if (userFound.companyAccess[i].name === "Axiom") {
      axg = userFound.companyAccess[i]._id
    }
    if (userFound.companyAccess[i].name === "APG Mexico") {
      apg = userFound.companyAccess[i]._id
    }
  }
  let userData = userFound.employee[0].name + "|" + userFound.employee[0].lastName + "|" + userFound.username + "|" + userFound.employee[0].picture + "|" + apg + "|" + axg + "|" + userFound.company[0]._id;
  let userAccessApg = [
    "false", "false", "false", "false", "false", "false", "false", "false", "false", "false",
    "false", "false", "false", "false", "false", "false", "false", "false", "false", "false",
    "false", "false", "false", "false", "false", "false", "false", "false", "false", "false"];
  let userAccessAXG = [
    "false", "false", "false", "false", "false", "false", "false", "false", "false", "false",
    "false", "false", "false", "false", "false", "false", "false", "false", "false", "false",
    "false", "false", "false", "false", "false", "false", "false", "false", "false", "false"];
  //Crear variable con los roles que tiene en apg
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === "admin") {
      userAccessApg[0] = "true";
    }
    if (roles[i].name === "moderador" || roles[i].name === "admin") {
      userAccessApg[1] = "true";
    }
    if (roles[i].name === "KaizenRW" || roles[i].name === "admin") {
      userAccessApg[2] = "true";
    }
    if (roles[i].name === "KaizenApproval") {
      userAccessApg[3] = "true";
    }
    if (roles[i].name === "KaizenR" || roles[i].name === "admin" || roles[i].name === "KaizenApproval" || roles[i].name === "KaizenRW") {
      userAccessApg[4] = "true";
    }
    if (roles[i].name === "QualityASIns" || roles[i].name === "QualityASEng" || roles[i].name === "QualityASGer" || roles[i].name === "SeniorManagement") {
      userAccessApg[5] = "true";
    }
    if (roles[i].name === "QualityASEng" || roles[i].name === "QualityASGer") {
      userAccessApg[6] = "true";
    }
    if (roles[i].name === "QualityASGer") {
      userAccessApg[7] = "true";
    }
    if (roles[i].name === "SeniorManagement") {
      userAccessApg[8] = "true";
    }
    if (roles[i].name === "QualityR") {
      userAccessApg[9] = "true";
    }
    if (roles[i].name === "QualityRW" || roles[i].name === "admin") {
      userAccessApg[10] = "true";
    }
    if (roles[i].name === "DeviationR" || roles[i].name === "admin") {
      userAccessApg[11] = "true";
    }
    if (roles[i].name === "ProductionSign") {
      userAccessApg[12] = "true";
    }
    if (roles[i].name === "ProcessSign") {
      userAccessApg[13] = "true";
    }
    if (roles[i].name === "AutomationSign") {
      userAccessApg[14] = "true";
    }
    if (roles[i].name === "CloseDeviation") {
      userAccessApg[15] = "true";
    }
    if (roles[i].name === "ValidationCheckR" || roles[i].name === "admin") {
      userAccessApg[16] = "true";
    }
    if (roles[i].name === "ValidationCheckQ") {
      userAccessApg[17] = "true";
    }
    if (roles[i].name === "ValidationCheckT") {
      userAccessApg[18] = "true";
    }
    if (roles[i].name === "ValidationCheckP") {
      userAccessApg[19] = "true";
    }
    if (roles[i].name === "TrainingR" || roles[i].name === "admin") {
      userAccessApg[20] = "true";
    }
    if (roles[i].name === "TrainingT" || roles[i].name === "admin") {
      userAccessApg[21] = "true";
    }
    if (roles[i].name === "TrainingL" || roles[i].name === "admin") {
      userAccessApg[22] = "true";
    }
    if (roles[i].name === "PersonalReqR" || roles[i].name === "PersonalReqC" || roles[i].name === "PersonalReqE" || roles[i].name === "PersonalReqS" || roles[i].name === "PersonalReqSRH" || roles[i].name === "admin") {
      userAccessApg[23] = "true";
    }
  }
  //Crear variable con los roles que tiene en axiom
  for (let i = 0; i < rolesAxiom.length; i++) {
    if (rolesAxiom[i].name === "admin") {
      userAccessAXG[0] = "true";
    }
    if (rolesAxiom[i].name === "moderador" || rolesAxiom[i].name === "admin") {
      userAccessAXG[1] = "true";
    }
    if (rolesAxiom[i].name === "KaizenRW" || rolesAxiom[i].name === "admin") {
      userAccessAXG[2] = "true";
    }
    if (rolesAxiom[i].name === "KaizenApproval") {
      userAccessAXG[3] = "true";
    }
    if (rolesAxiom[i].name === "KaizenR" || rolesAxiom[i].name === "admin" || rolesAxiom[i].name === "KaizenApproval" || rolesAxiom[i].name === "KaizenRW") {
      userAccessAXG[4] = "true";
    }
    if (rolesAxiom[i].name === "QualityASIns" || rolesAxiom[i].name === "QualityASEng" || rolesAxiom[i].name === "QualityASGer" || rolesAxiom[i].name === "SeniorManagement") {
      userAccessAXG[5] = "true";
    }
    if (rolesAxiom[i].name === "QualityASEng" || rolesAxiom[i].name === "QualityASGer") {
      userAccessAXG[6] = "true";
    }
    if (rolesAxiom[i].name === "QualityASGer") {
      userAccessAXG[7] = "true";
    }
    if (rolesAxiom[i].name === "SeniorManagement") {
      userAccessAXG[8] = "true";
    }
    if (rolesAxiom[i].name === "QualityR") {
      userAccessAXG[9] = "true";
    }
    if (rolesAxiom[i].name === "QualityRW" || rolesAxiom[i].name === "admin") {
      userAccessAXG[10] = "true";
    }
    if (rolesAxiom[i].name === "DeviationR" || rolesAxiom[i].name === "admin") {
      userAccessAXG[11] = "true";
    }
    if (rolesAxiom[i].name === "ProductionSign") {
      userAccessAXG[12] = "true";
    }
    if (rolesAxiom[i].name === "ProcessSign") {
      userAccessAXG[13] = "true";
    }
    if (rolesAxiom[i].name === "AutomationSign") {
      userAccessAXG[14] = "true";
    }
    if (rolesAxiom[i].name === "CloseDeviation") {
      userAccessAXG[15] = "true";
    }
    if (rolesAxiom[i].name === "ValidationCheckR" || rolesAxiom[i].name === "admin") {
      userAccessAXG[16] = "true";
    }
    if (rolesAxiom[i].name === "ValidationCheckQ") {
      userAccessAXG[17] = "true";
    }
    if (rolesAxiom[i].name === "ValidationCheckT") {
      userAccessAXG[18] = "true";
    }
    if (rolesAxiom[i].name === "ValidationCheckP") {
      userAccessAXG[19] = "true";
    }
    if (rolesAxiom[i].name === "TrainingR" || rolesAxiom[i].name === "admin") {
      userAccessAXG[20] = "true";
    }
    if (rolesAxiom[i].name === "TrainingT" || rolesAxiom[i].name === "admin") {
      userAccessAXG[21] = "true";
    }
    if (rolesAxiom[i].name === "TrainingL" || rolesAxiom[i].name === "admin") {
      userAccessAXG[22] = "true";
    }
    if (rolesAxiom[i].name === "PersonalReqR" || rolesAxiom[i].name === "PersonalReqC" || rolesAxiom[i].name === "PersonalReqE" || rolesAxiom[i].name === "PersonalReqS" || rolesAxiom[i].name === "PersonalReqSRH" || rolesAxiom[i].name === "admin") {
      userAccessAXG[23] = "true";
    }
  }

  res.json({
    token,
    status: "200",
    message: "login complete",
    userData: userData,
    userAccessApg: userAccessApg,
    userAccessAXG: userAccessAXG,
  });
};
//Tener tarjetas de dashboard///////////////////////////////////////////////////////////////////////////////////////////////////
const getDashboardCards = async (req, res) => {
  const cardsFound = await Dashboard.find().sort({ pos: 1 });
  res.json({ status: "200", message: "Dashboard Loaded", body: cardsFound });
};
// Getting all Users/////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getUsers = async (req, res) => {
  const { CompanyId } = req.params
  if (CompanyId.length !== 24) {
    return;
  }
  const company = await Company.find({
    _id: { $in: CompanyId },
  })
  if (!company) {
    return;
  }
  const users = await User.find({
    company: { $in: CompanyId },
  }).populate({ path: 'employee', populate: [{ path: "department" }, { path: "position" }] }).populate({ path: "roles" }).populate({ path: "rolesAxiom" }).populate({ path: "companyAccess" });
  res.json({ status: "200", message: "Users Loaded", body: users });
};
// Getting all Roles//////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getRoles = async (req, res) => {
  const roles = await Role.find();
  res.json({ status: "200", message: "Roles Loaded", body: roles });
};
// Updating user///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const userFound = await User.findOne({
    _id: userId,
  });
  const userUpd = [];
  const foundRoles = await Role.find({ name: { $in: req.body.roles } });
  userUpd.roles = foundRoles.map((role) => role._id);
  const foundRolesAxiom = await Role.find({ name: { $in: req.body.rolesAxiom } });
  userUpd.rolesAxiom = foundRolesAxiom.map((role) => role._id);
  const foundCompanyAccess = await Company.find({ name: { $in: req.body.companyAccess } });
  userUpd.companyAccess = foundCompanyAccess.map((company) => company._id);
  userUpd.username = req.body.username;
  userUpd.email = req.body.email;
  userUpd.signature = req.body.signature;
  if (userFound.password !== req.body.password) {
    userUpd.password = await User.encryptPassword(req.body.password)
  } else {
    userUpd.password = req.body.password;
  }

  const { username, email, password, roles, rolesAxiom, companyAccess, signature } = userUpd;

  const updatedUser = await User.updateOne(
    { _id: userId },
    {
      $set: {
        username,
        email,
        password,
        roles,
        rolesAxiom,
        companyAccess,
        signature,
      },
    }
  );

  if (!updatedUser) {
    res
      .status(403)
      .json({ status: "403", message: "User not Updated", body: "" });
  }

  res
    .status(200)
    .json({ status: "200", message: "User Updated ", body: updatedUser });
};
// Updating user password/////////////////////////////////////////////////////////////////////////////////////////////////////
const updatePassword = async (req, res) => {
  const { userId } = req.params;
  const userFound = await User.findOne({
    _id: userId,
  });
  const userUpd = [];
  const matchPassword = await User.comparePassword(
    req.body.password,
    userFound.password
  );

  if (!matchPassword)
    return res
      .status(404)
      .json({ token: null, message: "Invalid current password", status: "404" });

  userUpd.password = await User.encryptPassword(req.body.newpassword)

  const { password } = userUpd;

  const updatedPassword = await User.updateOne(
    { _id: userId },
    {
      $set: {
        password,
      },
    }
  );

  if (!updatedPassword) {
    res
      .status(403)
      .json({ status: "403", message: "Password not Updated", body: "" });
  }

  res
    .status(200)
    .json({ status: "200", message: "Password Updated ", body: updatedPassword });
};
// Updating user signature////////////////////////////////////////////////////////////////////////////////////////////////////
const updateUserSign = async (req, res) => {
  //const updatedKaizen = await K
  const { userId } = req.params;
  const { signature } = req.body;
  const updatedUser = await User.updateOne(
    { _id: userId },
    {
      $set: {
        signature,
      },
    }
  );

  if (!updatedUser) {
    res
      .status(403)
      .json({ status: "403", message: "User not Updated", body: "" });
  }

  res
    .status(200)
    .json({ status: "200", message: "User signature Updated ", body: updatedUser });
};
//get company//////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getCompany = async (req, res) => {
  const companies = await Company.find();
  res.json({ status: "200", message: "Companies Loaded", body: companies });
};
//get access to directory/////////////////////////////////////////////////////////////////////////////////////////////////
const getAccess = async (req, res) => {
  if (req.body.password != "DirectoryAccess")
    return res
      .status(403)
      .json({ message: "Access Denied", status: "403" });

  res.json({ status: "200", message: "Access" });
};

module.exports = {
  signUp,
  newRole,
  signIn,
  getDashboardCards,
  getUsers,
  getRoles,
  updateUser,
  updatePassword,
  updateUserSign,
  getCompany,
  getAccess
};