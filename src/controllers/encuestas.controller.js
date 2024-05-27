const Company = require("../models/Company");
const EncuestaComedor = require("../models/EncuestaComedor");


//create deviation request//////////////////////////////////////////////////////////////////////////////////////
const createNewEncuestaComedor = async (req, res) => {
    const { CompanyId } = req.params;

    const {
        encuestaDate,
        qualification,
        comments,
        version
    } = req.body;

    const newEncuestaComedor = new EncuestaComedor({
        encuestaDate,
        qualification,
        comments,
        version
    });

    if (CompanyId) {
        const foundCompany = await Company.find({
            _id: { $in: CompanyId },
        });
        newEncuestaComedor.company = foundCompany.map((company) => company._id);
    }

    const saveEncuestaComedor = await newEncuestaComedor.save();

    if (!saveEncuestaComedor) {
        res
            .status(403)
            .json({ status: "403", message: "Encuesta not Saved", body: "" });
    }

    return res
        .status(200)
        .json({ status: "200", message: "Encuesta Guardada" })
};

module.exports = {
    createNewEncuestaComedor
};