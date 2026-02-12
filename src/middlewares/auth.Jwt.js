const jwt = require("jsonwebtoken");
const config = require("../config.js");
const User = require("../models/User.js");
const Role = require("../models/Role.js");
const Company = require("../models/Company.js");
const dotenv = require('dotenv')
dotenv.config({ path: '../.env' });

///Verify the token provided in the Header/////////////////////////////////////////////////////////////////////////
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token)
      return res
        .status(403)
        .json({ message: "No token provided", status: "403" });

    const decoded = jwt.verify(token, process.env.SECRET);
    req.userId = decoded.id;

    const user = await User.findById(req.userId, { password: 0 });

    console.log(user.username)

    if (!user)
      return res.status(404).json({ message: "User not found", status: "404" });

    next();
  } catch (error) {
    return res.status(401).json({ message: "nO Unauthorized", status: "401" });

  }
};
//Verify Moderador Role (moderador role)////////////////////////////////////////////////////////////////////////////
const isModerator = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "moderador") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "moderador") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Moderator Role Required", status: "403" });
};
// Verify admin Role (admin role)///////////////////////////////////////////////////////////////////////////////////
const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Admin Role Required", status: "403" });
};
// Verify GeneralR Role (Read and Write)////////////////////////////////////////////////////////////////////////////
const isGeneralR = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "GeneralRW") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "GeneralR") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "GeneralRW") {
        next();
        return;
      }
      if (roles[i].name === "GeneralR") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "General Read Role Required", status: "403" });
};
// Verify GeneralRW Role (Read and Write)////////////////////////////////////////////////////////////////////////////////
const isGeneralRW = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "GeneralRW") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "GeneralRW") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "General Write Role Required", status: "403" });
};
// Verify OtherRW Role (Read and Write)///////////////////////////////////////////////////////////////////////////////////
const isOtherRW = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "OtherRW") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "OtherRW") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Other Write Role Required", status: "403" });
};
// Verify OtherR Role (Read)///////////////////////////////////////////////////////////////////////////////////////////////
const isOtherR = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "OtherRW") {
        next();
        return;
      }
      if (roles[i].name === "OtherR") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "OtherRW") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "OtherR") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Other Read Role Required", status: "403", roles });
};
// Verify SetupR Role (Read)///////////////////////////////////////////////////////////////////////////////////////////////////
const isSetupR = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "SetupRW") {
        next();
        return;
      }
      if (roles[i].name === "SetupR") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "SetupRW") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "SetupR") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Setup Read Role Required", status: "403" });
};
// Verify SetupRW Role (Read adn Write)////////////////////////////////////////////////////////////////////////////////////
const isSetupRW = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "SetupRW") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "SetupRW") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Setup Write Role Required", status: "403" });
};
// Verify KaizenR Role (Read)//////////////////////////////////////////////////////////////////////////////////////////////
const isKaizenR = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "KaizenRW") {
        next();
        return;
      }
      if (roles[i].name === "KaizenR") {
        next();
        return;
      }
      if (roles[i].name === "KaizenApproval") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "KaizenRW") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "KaizenR") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "KaizenApproval") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Kaizen Read Role Required", status: "403" });
};
// Verify KaizenRW Role (Read and Write)//////////////////////////////////////////////////////////////////////////////////////
const isKaizenRW = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "KaizenRW") {
        next();
        return;
      }
      if (roles[i].name === "KaizenApproval") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "KaizenRW") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Kaizen Write Role Required", status: "403" });
};
// Verify KaizenRW Role (Read and Write) Just to modify Status///////////////////////////////////////////////////////////////////////
const isKaizenAprroval = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "KaizenApproval") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "KaizenApproval") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Kaizen Approval Role Required", status: "403" });
};
// Verify KaizenR Role (Read)///////////////////////////////////////////////////////////////////////////////////////////////////////
const isQualityR = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "QualityRW") {
        next();
        return;
      }
      if (roles[i].name === "QualityR") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "QualityRW") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "QualityR") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Quality Read Role Required", status: "403" });
};
// Verify KaizenRW Role (Read and Write)/////////////////////////////////////////////////////////////////////////////////////////
const isQualityRW = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "QualityRW") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "QualityRW") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Quality Write Role Required", status: "403" });
};
// Verify ProductionR Role (Read)////////////////////////////////////////////////////////////////////////////////////////////////////
const isProductionR = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "ProductionRW") {
        next();
        return;
      }
      if (roles[i].name === "ProductionR") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "ProductionRW") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "ProductionR") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Production Read Role Required", status: "403" });
};
// Verify ProductionR Role (Read)////////////////////////////////////////////////////////////////////////////////////////////////////
const isLogisticR = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "LogisticRW") {
        next();
        return;
      }
      if (roles[i].name === "LogisticR") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "LogisticRW") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "LogisticR") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Logistic Read Role Required", status: "403" });
};
// Verify ProductionRW Role (Read and Write)///////////////////////////////////////////////////////////////////////////////
const isProductionRW = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "ProductionRW") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "ProductionRW") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Production Write Role Required", status: "403" });
};
// Verify Accesss to company///////////////////////////////////////////////////////////////////////////////////////////////
const isAutorized = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });
  const companyAccess = await Company.find({ _id: { $in: user.companyAccess } });
  for (let i = 0; i < companyAccess.length; i++) {
    if (companyAccess[i].name === Access.company[0].name) {
      next();
      return;
    }
  }
  return res
    .status(403)
    .json({ message: "Unauthorized access", status: "403" });
};
// Verify DeviationR Role (Create)///////////////////////////////////////////////////////////////////////////////////////////
const isDeviationR = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "DeviationR") {
        next();
        return;
      }
      if (roles[i].name === "QualityASEng") {
        next();
        return;
      }
      if (roles[i].name === "QualityASIns") {
        next();
        return;
      }
      if (roles[i].name === "QualityASGer") {
        next();
        return;
      }
      if (roles[i].name === "SeniorManagement") {
        next();
        return;
      }
      if (roles[i].name === "ProductionSign") {
        next();
        return;
      }
      if (roles[i].name === "ProcessSign") {
        next();
        return;
      }
      if (roles[i].name === "AutomationSign") {
        next();
        return;
      }
      if (roles[i].name === "CloseDeviation") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "DeviationR") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Deviation Role Required", status: "403" });
};
//Validar que tenbga permisos para aprovar
const isDeviationValidator = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "QualityASEng") {
        next();
        return;
      }
      if (roles[i].name === "QualityASIns") {
        next();
        return;
      }
      if (roles[i].name === "QualityASGer") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "DeviationR") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "You are not authorized to validate or reject a deviation", status: "403" });
};

//Validar que tenbga permisos para firmar
const isDeviationManager = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "QualityASGer") {
        next();
        return;
      }
      if (roles[i].name === "ProductionSign") {
        next();
        return;
      }
      if (roles[i].name === "AutomationSign") {
        next();
        return;
      }
      if (roles[i].name === "SeniorManagement") {
        next();
        return;
      }
      if (roles[i].name === "ProcessSign") {
        next();
        return;
      }
    }
  }
  // if (Access.company[0].name === "Axiom") {
  //   for (let i = 0; i < rolesAxiom.length; i++) {
  //     if (rolesAxiom[i].name === "admin") {
  //       next();
  //       return;
  //     }
  //     if (rolesAxiom[i].name === "DeviationR") {
  //       next();
  //       return;
  //     }
  //   }
  // }
  return res
    .status(403)
    .json({ message: "You are not authorized to sign a deviation", status: "403" });
};
// Verify TraininT (Create)///////////////////////////////////////////////////////////////////////////////////////////
const isTrainingT = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "TrainingT") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "TrainingT") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Trainer Role Required", status: "403" });
};

// Verify TraininR (Read)///////////////////////////////////////////////////////////////////////////////////////////
const isTrainingR = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if ((roles[i].name === "TrainingR") || (roles[i].name === "TrainingT") || (roles[i].name === "TrainingL")) {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if ((rolesAxiom[i].name === "TrainingR") || (rolesAxiom[i].name === "TrainingT") || (rolesAxiom[i].name === "TrainingL")) {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Training Read Role Required", status: "403" });
};

// Verify TraininL (permiso para calificar)///////////////////////////////////////////////////////////////////////////////////////////
const isTrainingL = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if ((roles[i].name === "TrainingL") || (roles[i].name === "TrainingT")) {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "TrainingL") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Training Read Role Required", status: "403" });
};

// Verify PersonalReqC (permiso para crear requisiciones de personal)///////////////////////////////////////////////////////////////////////////////////////////
const isPersonalReqC = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "PersonalReqC") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "PersonalReqC") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Personal Requisition Create Role Required", status: "403" });
};

// Verify PersonalReqR (permiso para crear requisiciones de personal)///////////////////////////////////////////////////////////////////////////////////////////
const isPersonalReqR = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if ((roles[i].name === "PersonalReqR") || (roles[i].name === "PersonalReqC") || (roles[i].name === "PersonalReqE") || (roles[i].name === "PersonalReqS") || (roles[i].name === "PersonalReqSRH") || (roles[i].name === "PersonalReqReclu")) {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if ((rolesAxiom[i].name === "PersonalReqR") || (rolesAxiom[i].name === "PersonalReqC") || (rolesAxiom[i].name === "PersonalReqE") || (rolesAxiom[i].name === "PersonalReqS") || (rolesAxiom[i].name === "PersonalReqSRH") || (rolesAxiom[i].name === "PersonalReqReclu")) {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Personal Requisition Read Role Required", status: "403" });
};

// Verify PersonalReqR (permiso para crear requisiciones de personal)///////////////////////////////////////////////////////////////////////////////////////////
const isPersonalReqS = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if ((roles[i].name === "PersonalReqS") || (roles[i].name === "PersonalReqSRH")) {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if ((rolesAxiom[i].name === "PersonalReqS") || (rolesAxiom[i].name === "PersonalReqSRH")) {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Personal Requisition Read Role Required", status: "403" });
};

// Verify PersonalReqR (permiso para crear requisiciones de personal)///////////////////////////////////////////////////////////////////////////////////////////
const isPersonalReqE = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "PersonalReqE") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "PersonalReqE") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Personal Requisition Edit Role Required", status: "403" });
};

// Verify PersonalReqR (permiso para crear requisiciones de personal)///////////////////////////////////////////////////////////////////////////////////////////
const isPersonalReqReclu = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "PersonalReqE" || roles[i].name === "PersonalReqReclu") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "PersonalReqE" || rolesAxiom[i].name === "PersonalReqReclu") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Personal Requisition Edit Role Required", status: "403" });
};

//Verificar que el usuario tenga permiso de lectura para supermarket
const isSMReader = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "SMReader" || roles[i].name === "SMCreator" || roles[i].name === "SMSupplier" || roles[i].name === "SMAdministrator" || roles[i].name === "SMCoordinator") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "SMReader" || rolesAxiom[i].name === "SMCreator" || rolesAxiom[i].name === "SMSupplier" || rolesAxiom[i].name === "SMAdministrator") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Rol SMReader requerido", status: "403" });
};

//Verificar que el usuario tenga permiso de administrar los items en supermarket
const isSMAdministrator = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "SMAdministrator") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "SMAdministrator") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Rol SMReader requerido", status: "403" });
};

//Verificar que el usuario tenga permiso de crear nuevos pedidos en supermarket
const isSMCreator = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "SMCreator") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "SMCreator") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Rol SMReader requerido", status: "403" });
};

//Verificar que el usuario tenga permiso de surtir los pedidos de supermarkett
const isSMSupplier = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "SMSupplier") {
        next();
        return;
      }
      if (roles[i].name === "SMCoordinator") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "SMSupplier") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Rol SMReader requerido", status: "403" });
};

//Verificar que el usuario tenga permiso de crear Minutas
const isCreateMinuta = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "CreateMinuta") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "CreateMinuta") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Rol SMReader requerido", status: "403" });
};

//Verificar que el usuario tenga permiso para acceder a pmanagement
const isManagementR = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "ManagementR") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "ManagementR") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Rol ManagementR requerido", status: "403" });
};

//Verificar que el usuario tenga permiso para modificar dispositivos de automatizacion
const isDeviceAdministrator = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "DeviceAdministrator") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "DeviceAdministrator") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Rol DeviceAdministrator requerido", status: "403" });
};

//Verificar que el usuario tenga permiso para verel apartado de Error Proofing
const isEPReader = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "ErrorPReader") {
        next();
        return;
      }
      if (roles[i].name === "ErrorPCreator") {
        next();
        return;
      }
      if (roles[i].name === "ErrorPValidatorA") {
        next();
        return;
      }
      if (roles[i].name === "ErrorPValidatorP") {
        next();
        return;
      }
      if (roles[i].name === "DeviceAdministrator") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "DeviceAdministrator") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Rol DeviceAdministrator requerido", status: "403" });
};

// VERIFICAR QUE EL USUARIO PUEDA CREAR ERROR PROOFING //
const isEPCreator = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const rolesAxiom = await Role.find({ _id: { $in: user.rolesAxiom } });
  const Access = [];
  const { CompanyId } = req.params;
  Access.company = await Company.find({ _id: { $in: CompanyId } });

  if (Access.company[0].name === "APG Mexico") {
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
      if (roles[i].name === "ErrorPCreator") {
        next();
        return;
      }
      if (roles[i].name === "ErrorPValidatorA") {
        next();
        return;
      }
      if (roles[i].name === "ErrorPValidatorP") {
        next();
        return;
      }
      if (roles[i].name === "DeviceAdministrator") {
        next();
        return;
      }
    }
  }
  if (Access.company[0].name === "Axiom") {
    for (let i = 0; i < rolesAxiom.length; i++) {
      if (rolesAxiom[i].name === "admin") {
        next();
        return;
      }
      if (rolesAxiom[i].name === "DeviceAdministrator") {
        next();
        return;
      }
    }
  }
  return res
    .status(403)
    .json({ message: "Rol DeviceAdministrator requerido", status: "403" });
};

module.exports = {
  verifyToken,
  isModerator,
  isAdmin,
  isGeneralR,
  isGeneralRW,
  isOtherRW,
  isOtherR,
  isSetupR,
  isSetupRW,
  isKaizenR,
  isKaizenRW,
  isKaizenAprroval,
  isQualityR,
  isQualityRW,
  isProductionR,
  isProductionRW,
  isAutorized,
  isDeviationR,
  isTrainingT,
  isTrainingR,
  isTrainingL,
  isPersonalReqC,
  isPersonalReqR,
  isPersonalReqS,
  isPersonalReqE,
  isPersonalReqReclu,
  isLogisticR,
  isSMReader,
  isSMAdministrator,
  isSMCreator,
  isSMSupplier,
  isCreateMinuta,
  isManagementR,
  isDeviationValidator,
  isDeviationManager,
  isDeviceAdministrator,
  isEPReader,
  isEPCreator
};