const mongoose = require('mongoose')

const pesonalRequisitionSchema = new mongoose.Schema(
    {
        requisitionDate: {
            type: Date,
        },
        requestBy: [
            {
                ref: "User",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        positionRequested: {
            type: String,
        },
        department: {
            type: String,
        },
        reportTo: {
            type: String,
        },
        startDate: {
            type: Date,
        },
        vancancies: {
            type: Number,
        },
        salary: {
            type: Number,
        },
        priority: {
            type: String,
        },
        hiring: {
            type: String,
        },
        hiring: {
            type: String,
        },
        hiringType: {
            type: String,
        },
        reasonVacancy: {
            type: String,
        },
        reasonVacancySpecification: {
            type: String,
        },
        requiredCompetencies: {
            Analysis: {
                type: Boolean
            },
            Leadership: {
                type: Boolean
            },
            Teamwork: {
                type: Boolean
            },
            ContinuousImprovement: {
                type: Boolean
            },
            Communication: {
                type: Boolean
            },
            Negotiation: {
                type: Boolean
            },
            CustomerService: {
                type: Boolean
            },
            DecisionMaking: {
                type: Boolean
            },
            TechnicalSkills: {
                type: Boolean
            }
        },
        scholarship: {
            type: String
        },
        minimunExperience: {
            type: String
        },
        experienceDetail: {
            type: String
        },
        internalPromotion: [
            {
                ref: "Employees",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        electronicDevices: {
            Laptop: {
                type: Boolean
            },
            Cellphone: {
                type: Boolean
            },
            TelephoneExtension: {
                type: Boolean
            }
        },
        software: {
            Office: {
                type: Boolean
            },
            Other: {
                type: Boolean
            },
            OtherSoftware: {
                type: String
            }
        },
        permissions: {
            PublicFolders: {
                type: Boolean
            },
            SharedFolders: {
                type: Boolean
            },
            Prism: {
                type: Boolean
            }
        },
        employeeCopy: [
            {
                ref: "Employees",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        peopleInvolved: [
            {
                ref: "Employees",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        autorizedByGeneral: [
            {
                ref: "User",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        autorizedByFinance: [
            {
                ref: "User",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        hrSignature: [
            {
                ref: "User",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        status: {
            type: String
        },
        recruiter: [
            {
                ref: "User",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        tentativeCoverageDate: {
            type: Date,
        },
        closingDate: {
            type: Date,
        },
        comments: {
            type: String
        },
        company: [
            {
                ref: "Company",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
        version: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("PesonalRequisition", pesonalRequisitionSchema);





