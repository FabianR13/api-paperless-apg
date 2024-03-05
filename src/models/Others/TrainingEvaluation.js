const mongoose = require('mongoose')

const trainingEvaluationSchema = new mongoose.Schema(
    {
        evaluationStatus: {
            type: String,
        },
        evaluationDate: {
            type: Date,
        },
        evaluationType: {
            type: String,
        },
        operationType: {
            type: String,
        },
        qualification: {
            type: Number,
        },
        qualifiedBy: [
            {
                ref: "User",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        trainer: [
            {
                ref: "User",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        partNumber: [
            {
                ref: "Parts",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        numberEmployee: [
            {
                ref: "Employees",
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        question1: {
            answer: {
                type: String
            },
            status: {
                type: String
            }
        },
        question2: {
            answer: {
                type: String
            },
            status: {
                type: String
            }
        },
        question3: {
            answer: {
                type: String
            },
            status: {
                type: String
            }
        },
        question4: {
            answer: {
                type: String
            },
            status: {
                type: String
            }
        },
        question5: {
            answer: {
                type: String
            },
            status: {
                type: String
            }
        },
        question6: {
            answer: {
                type: String
            },
            status: {
                type: String
            }
        },
        question7: {
            answer: {
                type: String
            },
            status: {
                type: String
            }
        },
        question8: {
            answer: {
                type: String
            },
            status: {
                type: String
            }
        },
        question9: {
            answer: {
                type: String
            },
            status: {
                type: String
            }
        },
        question10: {
            answer: {
                type: String
            },
            status: {
                type: String
            }
        },
        question11: {
            answer: {
                type: String
            },
            status: {
                type: String
            }
        },
        question12: {
            answer: {
                type: String
            },
            status: {
                type: String
            }
        },
        question13: {
            answer: {
                type: String
            },
            status: {
                type: String
            }
        },
        company: [
            {
                ref: "Company",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("TrainingEvaluation", trainingEvaluationSchema);





