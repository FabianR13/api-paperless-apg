const PersonalRequisition = require("../../../models/General/PersonalRequisition.js");

const User = require("../../../models/User.js");

const Employees = require("../../../models/Employees.js");

const Company = require("../../../models/Company.js"); //create deviation request//////////////////////////////////////////////////////////////////////////////////////


const createPersonalRequisition = async (req, res, next) => {
  const {
    CompanyId
  } = req.params;
  const {
    requisitionDate,
    requestBy,
    positionRequested,
    department,
    reportTo,
    startDate,
    vancancies,
    salary,
    priority,
    hiring,
    hiringType,
    reasonVacancy,
    reasonVacancySpecification,
    requiredCompetencies,
    scholarship,
    minimunExperience,
    experienceDetail,
    internalPromotion,
    electronicDevices,
    software,
    permissions,
    employeeCopy,
    peopleInvolved,
    autorizedByGeneral,
    autorizedByFinance,
    hrSignature,
    status,
    recruiter,
    tentativeCoverageDate,
    closingDate,
    comments,
    version
  } = req.body;
  const newPersonalRequisition = new PersonalRequisition({
    requisitionDate,
    positionRequested,
    department,
    reportTo,
    startDate,
    vancancies,
    salary,
    priority,
    hiring,
    hiringType,
    reasonVacancy,
    reasonVacancySpecification,
    requiredCompetencies,
    scholarship,
    minimunExperience,
    experienceDetail,
    electronicDevices,
    software,
    permissions,
    status,
    tentativeCoverageDate,
    closingDate,
    comments,
    version
  });

  if (requestBy) {
    const foundUsers = await User.find({
      username: {
        $in: requestBy
      }
    });
    newPersonalRequisition.requestBy = foundUsers.map(user => user._id);
  }

  if (internalPromotion) {
    for (let i = 0; i < internalPromotion.length; i++) {
      const foundEmployee = await Employees.find({
        numberEmployee: {
          $in: internalPromotion[i]
        }
      });
      newPersonalRequisition.internalPromotion.push(foundEmployee.map(employee => employee._id));
    }
  }

  if (employeeCopy) {
    const foundEmployee = await Employees.find({
      numberEmployee: {
        $in: employeeCopy
      }
    });
    newPersonalRequisition.employeeCopy = foundEmployee.map(employee => employee._id);
  }

  if (peopleInvolved) {
    for (let i = 0; i < peopleInvolved.length; i++) {
      const foundEmployee = await Employees.find({
        numberEmployee: {
          $in: peopleInvolved[i]
        }
      });
      newPersonalRequisition.peopleInvolved.push(foundEmployee.map(employee => employee._id));
    }
  }

  if (autorizedByGeneral) {
    const foundUsers = await User.find({
      username: {
        $in: autorizedByGeneral
      }
    });
    newPersonalRequisition.autorizedByGeneral = foundUsers.map(user => user._id);
  }

  if (autorizedByFinance) {
    const foundUsers = await User.find({
      username: {
        $in: autorizedByFinance
      }
    });
    newPersonalRequisition.autorizedByFinance = foundUsers.map(user => user._id);
  }

  if (hrSignature) {
    const foundUsers = await User.find({
      username: {
        $in: hrSignature
      }
    });
    newPersonalRequisition.hrSignature = foundUsers.map(user => user._id);
  }

  if (recruiter) {
    const foundUsers = await User.find({
      username: {
        $in: recruiter
      }
    });
    newPersonalRequisition.recruiter = foundUsers.map(user => user._id);
  }

  if (CompanyId) {
    const foundCompany = await Company.find({
      _id: {
        $in: CompanyId
      }
    });
    newPersonalRequisition.company = foundCompany.map(company => company._id);
  }

  const savePersonalRequisition = await newPersonalRequisition.save();

  if (!savePersonalRequisition) {
    res.status(403).json({
      status: "403",
      message: "Requsition not Saved",
      body: ""
    });
  }

  next();
}; // Getting all requisitions request/////////////////////////////////////////////////////////////////////////////////////////////////////


const getAllPersonalRequisitions = async (req, res) => {
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

  const personalRequisitions = await PersonalRequisition.find({
    company: {
      $in: CompanyId
    }
  }).sort({
    createdAt: -1
  }).populate({
    path: 'requestBy',
    select: "username",
    populate: [{
      path: "signature",
      select: "signature"
    }, {
      path: "employee",
      select: "name lastName numberEmployee",
      populate: {
        path: "department position",
        select: "name"
      }
    }]
  }).populate({
    path: 'recruiter',
    select: "username signature email",
    populate: {
      path: "employee",
      select: "name lastName numberEmployee",
      populate: {
        path: "department position",
        select: "name"
      }
    }
  }).populate({
    path: 'internalPromotion',
    populate: {
      path: "department position",
      select: "name"
    }
  }).populate({
    path: 'employeeCopy',
    populate: {
      path: "department position",
      select: "name"
    }
  }).populate({
    path: 'peopleInvolved',
    populate: {
      path: "department position",
      select: "name"
    }
  }).populate({
    path: 'autorizedByFinance',
    select: "username",
    populate: [{
      path: "signature",
      select: "signature"
    }, {
      path: "employee",
      select: "name lastName numberEmployee",
      populate: {
        path: "department",
        select: "name"
      }
    }]
  }).populate({
    path: 'autorizedByGeneral',
    select: "username",
    populate: [{
      path: "signature",
      select: "signature"
    }, {
      path: "employee",
      select: "name lastName numberEmployee",
      populate: {
        path: "department",
        select: "name"
      }
    }]
  }).populate({
    path: 'hrSignature',
    select: "username",
    populate: [{
      path: "signature",
      select: "signature"
    }, {
      path: "employee",
      select: "name lastName numberEmployee",
      populate: {
        path: "department",
        select: "name"
      }
    }]
  });
  res.json({
    status: "200",
    message: "Requisitions Loaded",
    body: personalRequisitions
  });
}; // Getting requisition by Id ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const getRequisitionById = async (req, res) => {
  const foundRequisition = await PersonalRequisition.findById(req.params.requisitionId).populate({
    path: 'requestBy',
    select: "username email",
    populate: [{
      path: "signature",
      select: "signature"
    }, {
      path: "employee",
      select: "name lastName numberEmployee",
      populate: {
        path: "department position",
        select: "name"
      }
    }]
  }).populate({
    path: 'recruiter',
    select: "username email",
    populate: [{
      path: "signature",
      select: "signature"
    }, {
      path: "employee",
      select: "name lastName numberEmployee",
      populate: {
        path: "department position",
        select: "name"
      }
    }]
  }).populate({
    path: 'internalPromotion',
    populate: {
      path: "department position",
      select: "name"
    }
  }).populate({
    path: 'employeeCopy',
    populate: {
      path: "department position",
      select: "name"
    }
  }).populate({
    path: 'peopleInvolved',
    populate: {
      path: "department position",
      select: "name"
    }
  }).populate({
    path: 'autorizedByFinance',
    select: "username",
    populate: [{
      path: "signature",
      select: "signature"
    }, {
      path: "employee",
      select: "name lastName numberEmployee",
      populate: {
        path: "department",
        select: "name"
      }
    }]
  }).populate({
    path: 'autorizedByGeneral',
    select: "username",
    populate: [{
      path: "signature",
      select: "signature"
    }, {
      path: "employee",
      select: "name lastName numberEmployee",
      populate: {
        path: "department",
        select: "name"
      }
    }]
  }).populate({
    path: 'hrSignature',
    select: "username",
    populate: [{
      path: "signature",
      select: "signature"
    }, {
      path: "employee",
      select: "name lastName numberEmployee",
      populate: {
        path: "department",
        select: "name"
      }
    }]
  });

  if (!foundRequisition) {
    res.status(403).json({
      status: "403",
      message: "Requisition not Founded",
      body: ""
    });
  }

  res.status(200).json({
    status: "200",
    message: "Requisition Founded",
    body: foundRequisition
  });
}; //method to update deviation request //////////////////////////////////////////////////////////////////////////////////////


const UpdateRequisitionSignature = async (req, res, next) => {
  const {
    requisitionId
  } = req.params;
  const newAutorizedByFinance = req.body.autorizedByFinance;
  const newAutorizedByGeneral = req.body.autorizedByGeneral;
  const newHrSignature = req.body.hrSignature;
  const status = req.body.status;
  let autorizedByFinance = [];
  let autorizedByGeneral = [];
  let hrSignature = [];

  if (newAutorizedByFinance) {
    const foundUser = await User.find({
      username: {
        $in: newAutorizedByFinance
      }
    });
    autorizedByFinance = foundUser.map(user => user._id);
  }

  if (newAutorizedByGeneral) {
    const foundUser = await User.find({
      username: {
        $in: newAutorizedByGeneral
      }
    });
    autorizedByGeneral = foundUser.map(user => user._id);
  }

  if (newHrSignature) {
    const foundUser = await User.find({
      username: {
        $in: newHrSignature
      }
    });
    hrSignature = foundUser.map(user => user._id);
  }

  const updatedPersonalRequisition = await PersonalRequisition.updateOne({
    _id: requisitionId
  }, {
    $set: {
      autorizedByFinance,
      autorizedByGeneral,
      hrSignature,
      status
    }
  });

  if (!updatedPersonalRequisition) {
    res.status(403).json({
      status: "403",
      message: "Personal requisition not Updated",
      body: ""
    });
  }

  next();
}; //method to update deviation request //////////////////////////////////////////////////////////////////////////////////////


const UpdatePersonalRequisition = async (req, res, next) => {
  const {
    requisitionId
  } = req.params;
  const newRecruiter = req.body.recruiter;
  const salary = req.body.salary;
  const priority = req.body.priority;
  const status = req.body.status;
  const tentativeCoverageDate = req.body.tentativeCoverageDate;
  const closingDate = req.body.closingDate;
  const comments = req.body.comments;
  let recruiter = [];

  if (newRecruiter) {
    const foundUser = await User.find({
      username: {
        $in: newRecruiter
      }
    });
    recruiter = foundUser.map(user => user._id);
  }

  const updatedPersonalRequisition = await PersonalRequisition.updateOne({
    _id: requisitionId
  }, {
    $set: {
      recruiter,
      salary,
      priority,
      status,
      tentativeCoverageDate,
      closingDate,
      comments
    }
  });

  if (!updatedPersonalRequisition) {
    res.status(403).json({
      status: "403",
      message: "Personal requisition not Updated",
      body: ""
    });
  }

  if (!req.body.receivers) {
    return res.status(200).json({
      status: "200",
      message: "Personal requisition Updated"
    });
  }

  next();
}; //method to update deviation request All data //////////////////////////////////////////////////////////////////////////////////////


const UpdatePersonalRequisitionAllData = async (req, res, next) => {
  const {
    requisitionId
  } = req.params;
  const {
    positionRequested,
    department,
    reportTo,
    startDate,
    vancancies,
    salary,
    priority,
    hiring,
    hiringType,
    reasonVacancy,
    reasonVacancySpecification,
    requiredCompetencies,
    scholarship,
    minimunExperience,
    experienceDetail,
    electronicDevices,
    software,
    permissions,
    status,
    tentativeCoverageDate,
    closingDate,
    comments
  } = req.body;
  const newhrSignature = req.body.hrSignature;
  const newautorizedByFinance = req.body.autorizedByFinance;
  const newautorizedByGeneral = req.body.autorizedByGeneral;
  const newpeopleInvolved = req.body.peopleInvolved;
  const newEmployeeCopy = req.body.employeeCopyM;
  const newInternalPromotion = req.body.internalPromotion;
  const newRecruiter = req.body.recruiter;
  let recruiter = [];
  let internalPromotion = [];
  let employeeCopy = [];
  let peopleInvolved = [];
  let autorizedByGeneral = [];
  let autorizedByFinance = [];
  let hrSignature = [];

  if (newhrSignature) {
    const foundUsers = await User.find({
      username: {
        $in: newhrSignature
      }
    });
    hrSignature = foundUsers.map(user => user._id);
  }

  if (newautorizedByFinance) {
    const foundUsers = await User.find({
      username: {
        $in: newautorizedByFinance
      }
    });
    autorizedByFinance = foundUsers.map(user => user._id);
  }

  if (newautorizedByGeneral) {
    const foundUsers = await User.find({
      username: {
        $in: newautorizedByGeneral
      }
    });
    autorizedByGeneral = foundUsers.map(user => user._id);
  }

  if (newpeopleInvolved) {
    for (let i = 0; i < newpeopleInvolved.length; i++) {
      const foundEmployee = await Employees.find({
        numberEmployee: {
          $in: newpeopleInvolved[i]
        }
      });
      peopleInvolved.push(foundEmployee.map(employee => employee._id));
    }
  }

  if (newEmployeeCopy) {
    const foundEmployee = await Employees.find({
      numberEmployee: {
        $in: newEmployeeCopy
      }
    });
    employeeCopy = foundEmployee.map(employee => employee._id);
  }

  if (newInternalPromotion) {
    for (let i = 0; i < newInternalPromotion.length; i++) {
      const foundEmployee = await Employees.find({
        numberEmployee: {
          $in: newInternalPromotion[i]
        }
      });
      internalPromotion.push(foundEmployee.map(employee => employee._id));
    }
  }

  if (newRecruiter) {
    const foundUser = await User.find({
      username: {
        $in: newRecruiter
      }
    });
    recruiter = foundUser.map(user => user._id);
  }

  const updatedPersonalRequisition = await PersonalRequisition.updateOne({
    _id: requisitionId
  }, {
    $set: {
      positionRequested,
      department,
      reportTo,
      startDate,
      vancancies,
      salary,
      priority,
      hiring,
      hiringType,
      reasonVacancy,
      reasonVacancySpecification,
      requiredCompetencies,
      scholarship,
      minimunExperience,
      experienceDetail,
      internalPromotion,
      electronicDevices,
      software,
      permissions,
      employeeCopy,
      peopleInvolved,
      autorizedByFinance,
      autorizedByGeneral,
      hrSignature,
      status,
      recruiter,
      tentativeCoverageDate,
      closingDate,
      comments
    }
  });

  if (!updatedPersonalRequisition) {
    res.status(403).json({
      status: "403",
      message: "Personal requisition not Updated",
      body: ""
    });
  }

  next();
};

module.exports = {
  createPersonalRequisition,
  getAllPersonalRequisitions,
  getRequisitionById,
  UpdateRequisitionSignature,
  UpdatePersonalRequisition,
  UpdatePersonalRequisitionAllData
};