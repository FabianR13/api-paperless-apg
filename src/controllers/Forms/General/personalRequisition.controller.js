const PersonalRequisition = require("../../../models/General/PersonalRequisition.js");
const User = require("../../../models/User.js");
const Employees = require("../../../models/Employees.js");
const Company = require("../../../models/Company.js");
const dotenv = require('dotenv');
dotenv.config({ path: "C:\\api-paperless-apg\\src\\.env" });

//create deviation request//////////////////////////////////////////////////////////////////////////////////////
const createPersonalRequisition = async (req, res) => {
    const { CompanyId } = req.params;

    const {
        evaluationStatus,
        evaluationDate,
        evaluationType,
        operationType,
        qualification,
        qualifiedBy,
        trainer,
        partNumber,
        numberEmployee,
        question1,
        question2,
        question3,
        question4,
        question5,
        question6,
        question7,
        question8,
        question9,
        question10,
        question11,
        question12,
        question13
    } = req.body;
    const newPersonalRequisition = new PersonalRequisition({
        evaluationStatus,
        evaluationDate,
        evaluationType,
        operationType,
        qualification,
        question1,
        question2,
        question3,
        question4,
        question5,
        question6,
        question7,
        question8,
        question9,
        question10,
        question11,
        question12,
        question13
    });

    if (qualifiedBy) {
        const foundUsers = await User.find({
            username: { $in: qualifiedBy },
        });
        newPersonalRequisition.qualifiedBy = foundUsers.map((user) => user._id);
    }

    if (trainer) {
        const foundUsers = await User.find({
            username: { $in: trainer },
        });
        newPersonalRequisition.trainer = foundUsers.map((user) => user._id);
    }

    if (partNumber) {
        const foundParts = await Parts.find({
            partnumber: { $in: partNumber },
        });
        newPersonalRequisition.partNumber = foundParts.map((parts) => parts._id);
    }

    if (numberEmployee) {
        const foundEmployee = await Employees.find({
            numberEmployee: { $in: numberEmployee },
        });
        newPersonalRequisition.numberEmployee = foundEmployee.map((employee) => employee._id);
    }

    if (CompanyId) {
        const foundCompany = await Company.find({
            _id: { $in: CompanyId },
        });
        newPersonalRequisition.company = foundCompany.map((company) => company._id);
    }

    newPersonalRequisition.save((error, newPersonalRequisition) => {
        if (error) return res.status(400).json({ status: "400", message: error });
        if (newPersonalRequisition) {
            res.json({ status: "200", message: "Requisition Created", body: newPersonalRequisition });
        }
    });
};

module.exports = {
    createPersonalRequisition
};