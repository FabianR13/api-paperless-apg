const PersonalRequisition = require("../../../models/General/PersonalRequisition.js");
const User = require("../../../models/User.js");
const Employees = require("../../../models/Employees.js");
const Company = require("../../../models/Company.js");
const dotenv = require('dotenv');
dotenv.config({ path: "C:\\api-paperless-apg\\src\\.env" });

//create deviation request//////////////////////////////////////////////////////////////////////////////////////
const createPersonalRequisition = async (req, res, next) => {
    const { CompanyId } = req.params;

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
        autorizedBy,
        hrSignature,
        status,
        recluiter,
        tentativeCoverageDate,
        closingDate,
        comments
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
        comments
    });

    if (requestBy) {
        const foundUsers = await User.find({
            username: { $in: requestBy },
        });
        newPersonalRequisition.requestBy = foundUsers.map((user) => user._id);
    }

    if (internalPromotion) {
        for (let i = 0; i < internalPromotion.length; i++) {
            const foundEmployee = await Employees.find({
                numberEmployee: { $in: internalPromotion[i] },
            });
            newPersonalRequisition.internalPromotion.push(foundEmployee.map((employee) => employee._id));
        }
    }

    if (employeeCopy) {
        const foundEmployee = await Employees.find({
            numberEmployee: { $in: employeeCopy },
        });
        newPersonalRequisition.employeeCopy = foundEmployee.map((employee) => employee._id);
    }

    if (peopleInvolved) {
        for (let i = 0; i < peopleInvolved.length; i++) {
            const foundEmployee = await Employees.find({
                numberEmployee: { $in: peopleInvolved[i] },
            });
            newPersonalRequisition.peopleInvolved.push(foundEmployee.map((employee) => employee._id));
        }
    }

    if (autorizedBy) {
        const foundUsers = await User.find({
            username: { $in: autorizedBy },
        });
        newPersonalRequisition.autorizedBy = foundUsers.map((user) => user._id);
    }

    if (hrSignature) {
        const foundUsers = await User.find({
            username: { $in: hrSignature },
        });
        newPersonalRequisition.hrSignature = foundUsers.map((user) => user._id);
    }

    if (recluiter) {
        const foundUsers = await User.find({
            username: { $in: recluiter },
        });
        newPersonalRequisition.recluiter = foundUsers.map((user) => user._id);
    }

    if (CompanyId) {
        const foundCompany = await Company.find({
            _id: { $in: CompanyId },
        });
        newPersonalRequisition.company = foundCompany.map((company) => company._id);
    }

    const savePersonalRequisition = await newPersonalRequisition.save();

    if (!savePersonalRequisition) {
        res
            .status(403)
            .json({ status: "403", message: "Requsition not Saved", body: "" });
    }

    next();
};

// Getting all requisitions request/////////////////////////////////////////////////////////////////////////////////////////////////////
const getAllPersonalRequisitions = async (req, res) => {
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
    const personalRequisitions = await PersonalRequisition.find({
        company: { $in: CompanyId },
    }).sort({ createdAt: -1 })
    .populate({ path: 'requestBy', select: "username signature", populate: { path: "employee", select: ("name lastName numberEmployee"), populate: { path: "department position", select: "name" } } })
    .populate({ path: 'internalPromotion', populate: { path: "department position", select: "name" } })
    .populate({ path: 'employeeCopy', populate: { path: "department position", select: "name" } })
    .populate({ path: 'peopleInvolved', populate: { path: "department position", select: "name" } })
    .populate({ path: 'autorizedBy', select: "username signature", populate: { path: "employee", select: ("name lastName numberEmployee"), populate: { path: "department", select: "name" } } })
    .populate({ path: 'hrSignature', select: "username signature", populate: { path: "employee", select: ("name lastName numberEmployee"), populate: { path: "department", select: "name" } } });
    res.json({ status: "200", message: "Requisitions Loaded", body: personalRequisitions });
};

// Getting requisition by Id ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getRequisitionById = async (req, res) => {
    const foundRequisition = await PersonalRequisition.findById(req.params.requisitionId)
    .populate({ path: 'requestBy', select: "username signature", populate: { path: "employee", select: ("name lastName numberEmployee"), populate: { path: "department position", select: "name" } } })
    .populate({ path: 'internalPromotion', populate: { path: "department position", select: "name" } })
    .populate({ path: 'employeeCopy', populate: { path: "department position", select: "name" } })
    .populate({ path: 'peopleInvolved', populate: { path: "department position", select: "name" } })
    .populate({ path: 'autorizedBy', select: "username signature", populate: { path: "employee", select: ("name lastName numberEmployee"), populate: { path: "department", select: "name" } } })
    .populate({ path: 'hrSignature', select: "username signature", populate: { path: "employee", select: ("name lastName numberEmployee"), populate: { path: "department", select: "name" } } });
    if (!foundRequisition) {
      res
        .status(403)
        .json({ status: "403", message: "Requisition not Founded", body: "" });
    }
    res
      .status(200)
      .json({ status: "200", message: "Requisition Founded", body: foundRequisition });
  };

module.exports = {
    createPersonalRequisition,
    getAllPersonalRequisitions,
    getRequisitionById
};