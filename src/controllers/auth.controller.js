const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const Role = require("../models/Role.js");
const Dashboard = require("../models/Dashboard.js");
const Employees = require("../models/Employees.js");
const Company = require("../models/Company.js");
const Signature = require("../models/Signatures.js");
const PushToken = require("../models/PushToken.js");
const nodemailer = require('nodemailer');
console.log("ENV:", process.env.FIREBASE_CREDENTIALS_JSON ? "✅ cargada" : "❌ no encontrada");

// Getting all Users/////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getUsers = async (req, res) => {
  const { CompanyId } = req.params;
  const { simple } = req.query;

  if (CompanyId.length !== 24) {
    return;
  }

  const company = await Company.find({
    _id: { $in: CompanyId },
  });

  if (!company) {
    return;
  }

  let users;

  if (simple === 'true') {
    users = await User.find({ company: { $in: CompanyId } })
      .select('username email employee roles rolesAxiom signature')
      .populate({
        path: 'employee',
        match: { active: true }, // <-- 1. Agregamos el match aquí
        select: 'name lastName numberEmployee department position active',
        populate: [
          { path: "department", select: 'name' },
          { path: "position", select: 'name' }
        ]
      })
      .populate({ path: "roles", select: 'name' })
      .populate({ path: "rolesAxiom", select: 'name' })
      .populate({ path: 'signature', select: 'signature' });
  } else {
    users = await User.find({ company: { $in: CompanyId } })
      .populate({
        path: 'employee',
        match: { active: true }, // <-- 1. Y también lo agregamos aquí
        populate: [
          { path: "department", select: 'name' },
          { path: "position", select: 'name' }
        ]
      })
      .populate({ path: "roles", select: 'name' })
      .populate({ path: "rolesAxiom", select: 'name' })
      .populate({ path: "companyAccess" })
      .populate({ path: 'signature', select: 'signature' });
  }

  users = users.filter(user => user.employee && user.employee.length > 0);

  res.json({ status: "200", message: "Users Loaded", body: users });
};

//Crear un nuevo usuario///////////////////////////////////////////////////////////////////////////////////////////////////////////
const signUp = async (req, res) => {
  const { CompanyId } = req.params;

  const foundCompany = await Company.findById(CompanyId);
  if (!foundCompany) return res.status(404).json({ status: "error", message: "Company not found" });

  try {
    const { username, email, password, signature, roles, rolesAxiom, employee, companyAccess, language } = req.body;

    //guardar firma
    const newSignature = new Signature({
      username,
      signature
    });

    const savedSignature = await newSignature.save();

    const newUser = new User({
      username,
      email,
      password: await User.encryptPassword(password),
      language,
      company: CompanyId
    });

    if (savedSignature) {
      const foundSignature = await Signature.find({ username: { $in: username } });
      newUser.signature = foundSignature.map((signature) => signature._id);
    }

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

    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.SECRET, {
      expiresIn: 86400, // 24 Horas
      // expiresIn: 20,
    });

    res.json({ status: "200", message: "User created" });
    // res.status(200).json({ token });
  } catch (error) {
    console.error("Error saving template:", error);
    return res.status(500).json({
      success: false,
      message: 'Server error while saving template',
      error: error.message
    });
  }
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
  const userFound = await User.findOne({ username: req.body.username })
    .populate({ path: "roles", select: "name" })
    .populate({ path: "companyAccess" })
    .populate({ path: "company" })
    .populate({ path: "employee" });

  // 1. Validaciones iniciales
  if (!userFound) {
    return res.status(404).json({ token: null, message: "User not found", status: "404" });
  }

  const matchPassword = await User.comparePassword(req.body.password, userFound.password);

  if (userFound.employee[0].active === false) {
    return res.status(404).json({ token: null, message: "User disabled", status: "404" });
  }

  if (!matchPassword) {
    return res.status(404).json({ token: null, message: "Invalid password", status: "404" });
  }

  // 2. Generación del Token
  const token = jwt.sign(
    { id: userFound._id },
    process.env.SECRET,
    userFound.username !== 'SupplierAPG' ? { expiresIn: 86400 } : {}
  );

  // 3. Extracción de IDs de compañía usando .find()
  const apgAccess = userFound.companyAccess.find(c => c.name === "APG Mexico");
  const axgAccess = userFound.companyAccess.find(c => c.name === "Axiom");
  const apg = apgAccess ? apgAccess._id : "";
  const axg = axgAccess ? axgAccess._id : "";

  // 4. Construcción de userData usando Template Literals
  const emp = userFound.employee[0];
  const userData = `${emp.name}|${emp.lastName}|${userFound.username}|${emp.picture}|${apg}|${axg}|${userFound.company[0]._id}|${emp.numberEmployee}|${userFound.language}|${userFound.email}`;

  // 5. Inicialización de arrays de accesos
  let userAccessApg = Array(70).fill("false");
  let userAccessAXG = Array(50).fill("false");

  // 6. Configuración de Mapeo de Roles APG
  const apgRoleMap = {
    admin: [0],
    moderador: [1],
    GeneralR: [2],
    SetupR: [3],
    QualityR: [4],
    ProductionR: [5],
    LogisticR: [6],
    OtherR: [7],
    ManagementR: [8],
    ReportsR: [9],
    // KAIZEN ROLES
    KaizenR: [10],
    KaizenRW: [11],
    KaizenApproval: [12],
    KaizenAdviser: [13],
    // DEVIATION ROLES
    DeviationR: [14],
    QualityASIns: [15],
    QualityASEng: [16],
    QualityASGer: [17],
    SeniorManagement: [18],
    ProductionSign: [19],
    ProcessSign: [20],
    AutomationSign: [21],
    CloseDeviation: [22],
    // TRAINING ROLES
    TrainingR: [23],
    TrainingT: [24],
    TrainingL: [25],
    // SUPERMARKET ROLES
    SMCreator: [26],
    SMSupplier: [27],
    SMReader: [28],
    SMAdministrator: [29],
    SMCoordinator: [30],
    // MINUTAS ROLES
    CreateMinuta: [31],
    // ERROR PROOFING ROLES
    ErrorPCreator: [32],
    ErrorPValidatorA: [33],
    ErrorPReader: [34],
    DeviceAdministrator: [35],
    // DAILY AUDITS ROLES
    DailyAuditCreate: [36],
    DailyAuditAdministrator: [37],
    // PPE ROLES
    PPERequester: [38],
    PPEIssuer: [39],
    // VALIDATION CHECKLIST ROLES
    ValidationCheckR: [40],
    ValidationCheckT: [41],
    ValidationCheckQ: [42],
    ValidationCheckP: [43],
    // QUARANTINE ROLES
    QuarantineR: [44],
    QuarantineC: [45],
    // ACCESS PANELS ROLES
    AccessPanelsM: [46],
    //Roles EHS 
    EHSManager: [47],
    //Roles PT Inspection
    PTInspectionR: [48],
    PTQuality: [49],
    PTWarehouse: [50],
  };

  // 7. Configuración de Mapeo de Roles Axiom (Afecta tanto a AXG como a APG)
  const axgRoleMap = {
    admin: [0],
    moderador: [1],
    GeneralR: [2],
    SetupR: [3],
    QualityR: [4],
    ProductionR: [5],
    LogisticR: [6],
    OtherR: [7],
    ManagementR: [8],
    ReportsR: [9],
    // KAIZEN ROLES
    KaizenR: [10],
    KaizenRW: [11],
    KaizenApproval: [12],
    KaizenAdviser: [13],
    // DEVIATION ROLES
    DeviationR: [14],
    QualityASIns: [15],
    QualityASEng: [16],
    QualityASGer: [17],
    SeniorManagement: [18],
    ProductionSign: [19],
    ProcessSign: [20],
    AutomationSign: [21],
    CloseDeviation: [22],
    // TRAINING ROLES
    TrainingR: [23],
    TrainingT: [24],
    TrainingL: [25],
    // SUPERMARKET ROLES
    SMCreator: [26],
    SMSupplier: [27],
    SMReader: [28],
    SMAdministrator: [29],
    SMCoordinator: [30],
    // MINUTAS ROLES
    CreateMinuta: [31],
    // ERROR PROOFING ROLES
    ErrorPCreator: [32],
    ErrorPValidatorA: [33],
    ErrorPReader: [34],
    DeviceAdministrator: [35],
    // DAILY AUDITS ROLES
    DailyAuditCreate: [36],
    DailyAuditAdministrator: [37],
    // PPE ROLES
    PPERequester: [38],
    PPEIssuer: [39],
    // VALIDATION CHECKLIST ROLES
    ValidationCheckR: [40],
    ValidationCheckT: [41],
    ValidationCheckQ: [42],
    ValidationCheckP: [43],
    // QUARANTINE ROLES
    QuarantineR: [44],
    QuarantineC: [45],
    // ACCESS PANELS ROLES
    AccessPanelsM: [46],
    //Roles EHS 
    EHSManager: [47],
     //Roles PT Inspection
    PTInspectionR: [48],
    PTQuality: [49],
    PTWarehouse: [50],
  };

  // 8. Aplicar accesos buscando asíncronamente los roles a la DB
  const [roles, rolesAxiom] = await Promise.all([
    Role.find({ _id: { $in: userFound.roles } }),
    Role.find({ _id: { $in: userFound.rolesAxiom } })
  ]);

  roles.forEach(role => {
    const indices = apgRoleMap[role.name] || [];
    indices.forEach(idx => userAccessApg[idx] = "true");
  });

  rolesAxiom.forEach(role => {
    const indices = axgRoleMap[role.name] || [];
    indices.forEach(idx => userAccessAXG[idx] = "true");
  });

  // 9. Respuesta
  res.json({
    token,
    status: "200",
    message: "login complete",
    userData,
    userAccessApg,
    userAccessAXG,
  });
};

//Tener tarjetas de dashboard///////////////////////////////////////////////////////////////////////////////////////////////////
const getDashboardCards = async (req, res) => {
  const cardsFound = await Dashboard.find().sort({ pos: 1 });
  res.json({ status: "200", message: "Dashboard Loaded", body: cardsFound });
};





// Getting all Roles//////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getRoles = async (req, res) => {
  const origin = req.headers.origin;
  //console.log(origin)
  //res.header('Access-Control-Allow-Origin', origin);
  //res.header('Access-Control-Allow-Origin', ['https://www.axiompaperless.com', 'https://axiompaperless.com']);
  //res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  //res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  //res.header('Access-Control-Allow-Credentials', 'true');
  const roles = await Role.find();
  res.json({ status: "200", message: "Roles Loaded", body: roles });
};

// Updating user///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

  try {
    const userUpd = [];
    const foundRoles = await Role.find({ name: { $in: req.body.roles } });
    userUpd.roles = foundRoles.map((role) => role._id);
    const foundRolesAxiom = await Role.find({ name: { $in: req.body.rolesAxiom } });
    userUpd.rolesAxiom = foundRolesAxiom.map((role) => role._id);
    const foundCompanyAccess = await Company.find({ name: { $in: req.body.companyAccess } });
    userUpd.companyAccess = foundCompanyAccess.map((company) => company._id);
    userUpd.username = req.body.username;
    userUpd.email = req.body.email;
    userUpd.language = req.body.language;
    if (user.password !== req.body.password) {
      userUpd.password = await User.encryptPassword(req.body.password)
    } else {
      userUpd.password = req.body.password;
    }

    const signature = req.body.signature;

    const updatedSignature = await Signature.updateOne(
      { username: req.body.username },
      {
        $set: {
          signature,
        },
      }
    );

    const { username, email, password, roles, rolesAxiom, companyAccess, language } = userUpd;

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
          language
        },
      }
    );

    if (!updatedUser) {
      res
        .status(403)
        .json({ status: "403", message: "User not Updated" });
    }

    res
      .status(200)
      .json({ status: "200", message: "User Updated" });
  } catch (error) {
    console.error("Error saving template:", error);
    return res.status(500).json({
      success: false,
      message: 'Server error while saving template',
      error: error.message
    });
  }
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

// Guardar tokens para Notificaciones
const saveTokenPush = async (req, res) => {
  try {
    const { username, tokenPush, isSupplier, isErrorProofingInteres, isCoordinator, isIssuer } = req.body;

    if (!username || !tokenPush) {
      return res.status(400).json({ message: "User y FCM token son obligatorios" });
    }

    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado en la base de datos." });
    }

    const updateData = { token: tokenPush };

    if (isSupplier !== undefined) updateData.isSupplier = isSupplier;
    if (isErrorProofingInteres !== undefined) updateData.isErrorProofingInteres = isErrorProofingInteres;
    if (isCoordinator !== undefined) updateData.isCoordinator = isCoordinator;
    if (isIssuer !== undefined) updateData.isIssuer = isIssuer;

    // 1. SOLUCIÓN: Eliminar este token si le pertenece a otro usuario (ej. si compartieron dispositivo)
    await PushToken.deleteMany({
      token: tokenPush,
      userId: { $ne: user._id } // Eliminar donde el token sea igual, pero el usuario sea distinto
    });

    // 2. Ahora sí, actualizamos o insertamos de forma segura para el usuario actual
    const updatedToken = await PushToken.findOneAndUpdate(
      { userId: user._id },       // Filtro: buscar al usuario
      { $set: updateData },       // Actualización: reemplazar token y roles
      { upsert: true, new: true }
    );

    return res.sendStatus(204);

  } catch (error) {
    console.error("Error saving FCM token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS_JSON);

// Inicializar solo una vez (por si se importa en otros módulos)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

//Enviar notificacion/////////////////////////////////////////////////////////////////////////////////////////////////
const enviarNotificacionPush = async (req, res) => {
  try {
    const { targetAudience, targetUserId, title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: "Faltan title o body." });
    }

    // 1. Buscar solo tokens que tengan un userId asignado
    let query = { userId: { $exists: true, $ne: null } };

    if (targetUserId) {
      query.userId = targetUserId;
    } else if (targetAudience === 'supplier') {
      query.isSupplier = true;
    } else if (targetAudience === 'coordinator') {
      query.isCoordinator = true;
    } else if (targetAudience === 'errorProofing') {
      query.isErrorProofingInteres = true;
    } else if (targetAudience === 'ppe') {
      query.isIssuer = true;
    }

    const usersToNotify = await PushToken.find(query);
    const tokens = usersToNotify.map(u => u.token).filter(Boolean);

    if (tokens.length === 0) {
      return res.status(200).json({ message: "No hay usuarios válidos para notificar." });
    }

    // 2. Enviar notificaciones
    const message = {
      notification: { title, body },
      tokens: tokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    // 3. LIMPIEZA AUTOMÁTICA DE TOKENS INVÁLIDOS
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errorCode = resp.error.code;
          // Si Firebase dice que el token ya no existe o es inválido, lo separamos
          if (errorCode === 'messaging/invalid-registration-token' ||
            errorCode === 'messaging/registration-token-not-registered') {
            failedTokens.push(tokens[idx]);
          }
        }
      });

      // Borramos de MongoDB los tokens que Firebase reportó como muertos
      if (failedTokens.length > 0) {
        await PushToken.deleteMany({ token: { $in: failedTokens } });
        console.log(`🗑️ Se limpiaron ${failedTokens.length} tokens inválidos de la base de datos.`);
      }
    }

    return res.status(200).json({
      message: "Notificaciones procesadas.",
      success: response.successCount
    });

  } catch (error) {
    console.error("Error al enviar notificaciones masivas:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};






// const getTokensPush = async (req, res) => {
//   const tokens = await PushToken.find();
//   res.json({ status: "200", message: "Tokens Loaded", body: tokens });
// };

// // Leer desde la variable de entorno
// const admin = require("firebase-admin");
// const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS_JSON);

// // Inicializar solo una vez (por si se importa en otros módulos)
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// // Función para enviar a un solo token
// // const sendPushToToken = async (token) => {
// //   const message = {
// //     token,
// //     notification: {
// //       title: "Nuevo pedido creado",
// //       body: "Se ha generado un nuevo pedido en la plataforma.",
// //     },
// //   };

// //   try {
// //     const response = await admin.messaging().send(message);
// //     console.log("✅ Notificación enviada a:", token);
// //   } catch (error) {
// //     console.error("❌ Error al enviar a:", token, error.message);
// //   }
// // };

// const sendPushToToken = async (token, title, body) => {
//   const message = {
//     token,
//     notification: {
//       title: title,
//       body: body,
//     },
//   };

//   try {
//     const response = await admin.messaging().send(message);
//     console.log("✅ Notificación enviada a:", token);
//   } catch (error) {
//     console.error("❌ Error al enviar a:", token, error.message);
//   }
// };

// // --- NUEVO ENDPOINT GENÉRICO ---
// // Ruta sugerida: /auth/enviarNotificacionPush
// const enviarNotificacionPush = async (req, res) => {
//   // Ahora esperamos "tokens" (array de strings), "title" y "body"
//   const { tokens, title, body } = req.body;

//   if (!Array.isArray(tokens) || tokens.length === 0) {
//     // No devolvemos error 400 si no hay tokens, simplemente no hacemos nada (es válido que no haya destinatarios)
//     return res.status(200).json({ message: "No hay tokens destinatarios." });
//   }

//   if (!title || !body) {
//     return res.status(400).json({ message: "Faltan title o body." });
//   }

//   console.log(`📨 Enviando notificación '${title}' a ${tokens.length} dispositivos.`);

//   // Enviamos mensaje a la lista de tokens recibida
//   await Promise.all(tokens.map(tokenString =>
//     sendPushToToken(tokenString, title, body)
//   ));

//   return res.status(200).json({ message: "Notificaciones enviadas." });
// };
// //Devolucion iniciada notificacion
// const notificarInicioDevolucion = async (req, res) => {
//   const { pushTokens } = req.body;
//   if (!Array.isArray(pushTokens)) return res.status(400).json({ message: "pushTokens debe ser un array" });

//   const supplierTokens = pushTokens.filter(p => p.isSupplier && p.token);

//   // Enviamos mensaje de DEVOLUCIÓN INICIADA
//   await Promise.all(supplierTokens.map(p =>
//     sendPushToToken(p.token, "Devolución Iniciada 🟡", "Se ha iniciado una devolución. Pendiente de confirmación.")
//   ));

//   return res.sendStatus(204);
// };

// //Notificaciion de confirmacion de devolucion
// const notificarConfirmacionDevolucion = async (req, res) => {
//   const { pushTokens } = req.body;
//   if (!Array.isArray(pushTokens)) return res.status(400).json({ message: "pushTokens debe ser un array" });

//   const supplierTokens = pushTokens.filter(p => p.isSupplier && p.token);

//   // Enviamos mensaje de DEVOLUCIÓN CONFIRMADA
//   await Promise.all(supplierTokens.map(p =>
//     sendPushToToken(p.token, "Devolución Confirmada 🟠", "Se ha confirmado una devolución. Requiere validación.")
//   ));

//   return res.sendStatus(204);
// };

// // Función para enviar a un solo token
// const sendPushToTokenCancel = async (token) => {
//   const message = {
//     token,
//     notification: {
//       title: "Han cancelado un pedido",
//       body: "Se ha cancelado un pedido en la plataforma.",
//     },
//   };

//   try {
//     const response = await admin.messaging().send(message);
//     console.log("✅ Notificación enviada a:", token);
//   } catch (error) {
//     console.error("❌ Error al enviar a:", token, error.message);
//   }
// };

// // Endpoint que filtra y envía solo a los proveedores (isSupplier === true)
// const notificarCancelacion = async (req, res) => {
//   const { pushTokens } = req.body;

//   if (!Array.isArray(pushTokens)) {
//     return res.status(400).json({ message: "pushTokens debe ser un array" });
//   }

//   // 🔍 Filtrar proveedores
//   const supplierTokens = pushTokens.filter(p => p.isSupplier && p.token);

//   // 🔁 Enviar notificaciones
//   await Promise.all(supplierTokens.map(p => sendPushToTokenCancel(p.token)));

//   return res.sendStatus(204);
// };

// // Generic function to send a notification (remains the same)
// const sendPushNotification = async (token, title, body) => {
//   const message = {
//     token,
//     notification: {
//       title, // Will use the title you pass
//       body,  // Will use the body you pass
//     },
//   };

//   try {
//     const response = await admin.messaging().send(message);
//     console.log("✅ Notification sent to:", token);
//   } catch (error) {
//     console.error("❌ Error sending to:", token, error.message);
//   }
// };
// // Controller updated with English notifications
// const notifyInteresErrorProofing = async (req, res) => {
//   const { TypeNotification, ErrorProofing } = req.params;
//   const { pushTokens } = req.body;

//   if (!Array.isArray(pushTokens)) {
//     return res.status(400).json({ message: "pushTokens must be an array" });
//   }

//   let title;
//   let body;

//   if (TypeNotification === 'ErrorProofing') {
//     title = "New Error Proofing File Created";
//     body = "A new file has been created. Please review it on the platform.";
//   }
//   else if (TypeNotification === 'Checklist') {
//     title = "New Checklist Added";
//     body = `A new checklist has been added to the file: ${ErrorProofing}. Please review it.`;
//   }
//   else {
//     return res.status(400).json({ message: "Invalid notification type. Use 'ErrorProofing' or 'Checklist'." });
//   }

//   const errorProofingInteresTokens = pushTokens.filter(p => p.isErrorProofingInteres && p.token);

//   if (errorProofingInteresTokens.length === 0) {
//     console.log("No interested users to notify.");
//     return res.sendStatus(204);
//   }

//   await Promise.all(
//     errorProofingInteresTokens.map(p => sendPushNotification(p.token, title, body))
//   );

//   return res.sendStatus(204);
// };

// Obtener firma de un usuario específico (ej. gerente IT) ////////////////////////////////////////////
const getUserSignature = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate({ path: 'signature', select: 'signature' });
    if (!user) {
      return res.status(404).json({ status: "404", message: "Usuario no encontrado" });
    }
    return res.status(200).json({
      status: "200",
      body: { signature: user.signature?.[0]?.signature || null }
    });
  } catch (error) {
    console.error("Error al obtener firma del usuario:", error);
    return res.status(500).json({ status: "500", message: "Error al obtener firma" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Validar que el usuario exista
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    }).populate('employee');

    if (!user) {
      return res.status(404).json({ message: "No se encontró un usuario con ese correo." });
    }

    // 2. Validar que tenga un empleado asociado
    if (!user.employee || user.employee.length === 0) {
      return res.status(400).json({ message: "Este usuario no tiene un perfil de empleado asociado." });
    }

    // 3. Validar si el empleado está activo (como employee es un array en tu modelo, tomamos el índice 0)
    const employeeData = user.employee[0];

    if (employeeData.active !== true) {
      return res.status(403).json({ message: "El usuario está inactivo. No tienes permisos para restablecer la contraseña." });
    }

    // 2. Generar código de 6 dígitos aleatorio
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Guardar el código y expiración (5 minutos) en el modelo
    user.resetPasswordCode = code;
    user.resetPasswordExpires = Date.now() + 5 * 60 * 1000; // 5 minutos en milisegundos
    await user.save();

    // 4. Configurar Nodemailer y enviar correo
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASS,
      },
      secureConnection: false,
      tls: { ciphers: "SSLv3" },
    });

    const mailOptions = {
      from: `"Paperless" <${process.env.MAIL_AUTH_USER}>`,
      to: user.email,
      subject: "Código de verificación cuenta paperless",
      html: `
        <p>Hola <b>${user.username}</b>,</p>
        <p>Utiliza el siguiente código: <b style="font-size: 24px; color: #441E75;">${code}</b>, para cambiar la contraseña de tu usuario.</p>
        <p>Este código expira en 5 minutos.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    // 5. Enviar respuesta exitosa con el username
    return res.status(200).json({
      message: "Código enviado correctamente",
      username: user.username
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor al enviar el correo" });
  }
};

const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    // 1. Buscar al usuario por correo
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No se encontró un usuario con ese correo." });
    }

    // 2. Validar que el código coincida
    if (user.resetPasswordCode !== code) {
      return res.status(400).json({ message: "El código ingresado es incorrecto." });
    }

    // 3. Validar que el código no haya expirado (5 minutos)
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: "El código ha expirado. Por favor, solicita uno nuevo." });
    }

    // Si todo está bien, enviamos respuesta exitosa
    return res.status(200).json({ message: "Código verificado correctamente." });

  } catch (error) {
    console.error("Error al verificar código:", error);
    return res.status(500).json({ message: "Error en el servidor al verificar el código." });
  }
};

const resetPassword = async (req, res) => {
  try {
    // Ya no pedimos "confirmPassword", el frontend ya lo validó
    const { email, code, password } = req.body;

    // 1. Buscar al usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No se encontró un usuario con ese correo." });
    }

    // 2. Validar que el código sea correcto y no haya expirado
    if (user.resetPasswordCode !== code || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: "Código inválido o expirado. No se puede cambiar la contraseña." });
    }

    // 3. Encriptar la nueva contraseña usando el método que ya tienes en tu modelo
    user.password = await User.encryptPassword(password);

    // 4. Limpiar los campos temporales del código
    user.resetPasswordCode = null;
    user.resetPasswordExpires = null;

    // 5. Guardar los cambios en la base de datos
    await user.save();

    return res.status(200).json({ message: "Contraseña actualizada exitosamente." });

  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    return res.status(500).json({ message: "Error en el servidor al cambiar la contraseña." });
  }
};

const requestEmailChange = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Validar que el usuario existe y coincide el correo actual
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

    // 2. Verificar que el NUEVO correo no esté en uso por nadie más
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return res.status(400).json({ message: "Este email ya está en uso. Por favor ingresa otro." });
    }

    // 3. Generar código y guardarlo en los campos temporales del modelo
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordCode = code; // Usamos el mismo campo temporal para no alterar el modelo
    user.resetPasswordExpires = Date.now() + 5 * 60 * 1000; // 5 minutos
    await user.save();

    // 4. Enviar código al NUEVO correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Paperless" <${process.env.EMAIL_USER}>`,
      to: newEmail,
      subject: "Código de verificación para cambio de correo",
      html: `
                <p>Hola <b>${user.username}</b>,</p>
                <p>Has solicitado cambiar tu correo electrónico.</p>
                <p>Ingresa el siguiente código para confirmar este correo: <b style="font-size: 24px; color: #441E75;">${code}</b></p>
                <p>Este código expira en 5 minutos.</p>
            `
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Código enviado al nuevo correo." });

  } catch (error) {
    console.error("Error al solicitar cambio de email:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

const verifyEmailChange = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newEmail, code } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

    // 1. Validar el código y la fecha de expiración
    if (user.resetPasswordCode !== code || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: "Código inválido o expirado." });
    }

    // 2. Aplicar el cambio de correo y limpiar el código
    user.email = newEmail;
    user.resetPasswordCode = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({ message: "Correo electrónico actualizado exitosamente." });

  } catch (error) {
    console.error("Error al verificar código de email:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
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
  getAccess,
  saveTokenPush,
  enviarNotificacionPush,
  // getTokensPush,
  // sendPushToToken,
  // notificarCancelacion,
  // notifyInteresErrorProofing,
  // notificarInicioDevolucion,
  // notificarConfirmacionDevolucion,
  getUserSignature,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  requestEmailChange,
  verifyEmailChange
};
