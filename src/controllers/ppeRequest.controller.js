const Company = require("../models/Company");
const Employees = require("../models/Employees");
const PpeRequest = require("../models/PpeRequest");
const User = require("../models/User");

const getPPERequest = async (req, res) => {
    const { CompanyId } = req.params;

    if (CompanyId.length !== 24) {
        return res.status(400).json({ status: "400", message: "Invalid Company ID" });
    }

    try {
        const ppeRequest = await PpeRequest.find({
            company: CompanyId
        })
            .sort({ createdAt: -1 })
            .populate({
                path: 'issuerId',
                select: 'employee',
                populate: {
                    path: "employee",
                    select: 'name lastName'
                }
            })
            .populate({
                path: 'requesterId',
                select: 'employee',
                populate: {
                    path: "employee",
                    select: 'name lastName'
                }
            })
            .populate({
                path: 'employeeId',
                select: 'numberEmployee name lastName department position',
                populate: [
                    { path: "department", select: 'name' },
                    { path: "position", select: 'name' }
                ]
            })

        res.json({ status: "200", message: "PPE Request Loaded", body: ppeRequest });
    } catch (error) {
        console.error("Error fetching EPP Requisitions:", error);
        res.status(500).json({ status: "500", message: "Error fetching EPP Requisitions" });
    }
};

const createPPERequest = async (req, res) => {
    const { CompanyId } = req.params;
    const user = await User.findById(req.userId)

    if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

    const foundCompany = await Company.findById(CompanyId);
    if (!foundCompany) return res.status(404).json({ status: "error", message: "Company not found" });

    try {
        const {
            employeeId, reason, glovesSize,
            needsGlases, needsEarplugs, needsSideShields, delivered
        } = req.body;

        const foundEmployee = await Employees.findById(employeeId);

        if (!foundEmployee) {
            return res.status(404).json({ status: "error", message: "Empleado no encontrado" });
        }

        let images = [];
        if (req.file) {
            images = images.push({ img: req.file.key });
        }

        const anioActual = new Date().getFullYear();
        const lastRequest = await PpeRequest.findOne({
            createdAt: {
                $gte: new Date(`${anioActual}-01-01T00:00:00.000Z`),
                $lt: new Date(`${anioActual + 1}-01-01T00:00:00.000Z`)
            }
        }).sort({ consecutive: -1 });

        const nextConsecutive = lastRequest ? lastRequest.consecutive + 1 : 1;
        const generatedNumber = `APG-PPE-${anioActual}-${String(nextConsecutive).padStart(4, "0")}`;

        // 3. Guardar en la base de datos (Mongoose)
        const newRequest = new PpeRequest({
            requestId: generatedNumber,
            consecutive: nextConsecutive,
            version: 1,
            requesterId: user._id,
            requesterDate: new Date(),
            employeeId,
            reason,
            glovesSize,
            needsGlases,
            needsEarplugs,
            needsSideShields,
            delivered,
            images,
            company: CompanyId
        });

        await newRequest.save();

        res.status(201).json({ status: "200", message: "PPE Request Created", body: newRequest });

    } catch (error) {
        console.error("Error en createPPERequest:", error);
        res.status(500).json({ status: "500", message: "Internal Server Error" });
    }
};

module.exports = {
    getPPERequest,
    createPPERequest
}