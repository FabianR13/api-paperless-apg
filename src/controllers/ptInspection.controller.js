const Company = require("../models/Company");
const Parts = require("../models/Parts");
const PTInspection = require("../models/PtInspection");
const User = require("../models/User");

const getptInspections = async (req, res) => {
    const { CompanyId } = req.params;

    if (!CompanyId || CompanyId.length !== 24) {
        return res.status(400).json({ status: "error", message: "Invalid Company ID" });
    }

    try {
        const company = await Company.find({ _id: { $in: CompanyId } });
        if (!company) {
            return res.status(404).json({ status: "error", message: "Company not found" });
        }

        const ptInspections = await PTInspection.find({
            companyId: { $in: CompanyId }
        }).sort({ createdAt: -1 })
            .populate('partId')
            .populate({
                path: 'inspectionDetails.supervisorId',
                select: 'name lastName'
            })

        res.json({ status: "200", message: "Inspections Loaded", body: ptInspections });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error loading Inspections" });
    }
};

const createptInspection = async (req, res) => {
    const { CompanyId } = req.params;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ status: "error", message: "User not found" });

    const foundCompany = await Company.findById(CompanyId);
    if (!foundCompany) return res.status(404).json({ status: "error", message: "Company not found" });

    const {
        partId, partPosition, batchInicial, batchFinal,
        instruction, problemDescription, totalInventorySystem
    } = req.body;

    try {
        const foundPartNumber = await Parts.findById(partId);
        if (!foundPartNumber) return res.status(404).json({ status: "error", message: "Part Number not found" });

        const dateMX = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" }));

        await PTInspection.create({
            inspectionDate:dateMX,
            companyId:CompanyId,
            partId,
            partPosition,
            batchInicial,
            batchFinal,
            instruction,
            problemDescription,
            totalInventorySystem
        })

        res.json({ status: "200", message: "Solicitud de inspeccion creada" });
    } catch (error) {
        console.error("Error creating deviation:", error);
        res.status(500).json({
            status: "error",
            message: "Error al guardar desviacion",
            error: error.message
        });
    }
};

module.exports = {
    getptInspections,
    createptInspection
}