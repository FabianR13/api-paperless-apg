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

// Actualizar Cantidad Física (Fase 1 - Detalle)
const updatePhysicalQty = async (req, res) => {
    const { id } = req.params;
    const { totalInventoryPhysical } = req.body;

    try {
        const inspection = await PTInspection.findByIdAndUpdate(
            id,
            { totalInventoryPhysical },
            { new: true }
        );

        if (!inspection) return res.status(404).json({ status: "error", message: "Inspection not found" });

        res.json({ status: "200", message: "Cantidad física actualizada", body: inspection });
    } catch (error) {
        console.error("Error updating physical qty:", error);
        res.status(500).json({ status: "error", message: "Error al actualizar cantidad física" });
    }
};

// Agregar Registro de Turno (Fase 2)
const addRow = async (req, res) => {
    const { id } = req.params;
    const { shift, deliveryDate, supervisorId, deliveredQty, deliveredUnit } = req.body;

    try {
        const inspection = await PTInspection.findById(id);
        if (!inspection) return res.status(404).json({ status: "error", message: "Inspection not found" });

        // Agregamos el nuevo registro al arreglo
        inspection.inspectionDetails.push({
            shift,
            deliveryDate,
            supervisorId,
            deliveredQty,
            deliveredUnit
        });

        await inspection.save();
        res.json({ status: "200", message: "Fila agregada correctamente", body: inspection });
    } catch (error) {
        console.error("Error adding row:", error);
        res.status(500).json({ status: "error", message: "Error al agregar fila" });
    }
};

// Actualizar Registro Existente (Para Fase 3 y Fase 4)
const updateRow = async (req, res) => {
    const { id, rowIndex } = req.params;
    const updateData = req.body; // Contendrá los datos de la Fase 3 o Fase 4 dependiendo de quién llame

    try {
        const inspection = await PTInspection.findById(id);
        if (!inspection) return res.status(404).json({ status: "error", message: "Inspection not found" });

        if (rowIndex < 0 || rowIndex >= inspection.inspectionDetails.length) {
            return res.status(400).json({ status: "error", message: "Índice de fila inválido" });
        }

        // Combinamos los datos existentes de esa fila con los nuevos datos que llegan
        const currentRow = inspection.inspectionDetails[rowIndex];
        Object.assign(currentRow, updateData);

        await inspection.save();
        res.json({ status: "200", message: "Datos de la fila guardados", body: inspection });
    } catch (error) {
        console.error("Error updating row:", error);
        res.status(500).json({ status: "error", message: "Error al actualizar la fila" });
    }
};

// Completar la Inspección (Finalizar)
const completeInspection = async (req, res) => {
    const { id } = req.params;

    try {
        const dateMX = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" }));
        
        const inspection = await PTInspection.findByIdAndUpdate(
            id,
            { 
                status: 'Completed', 
                completedDate: dateMX 
            },
            { new: true }
        );

        if (!inspection) return res.status(404).json({ status: "error", message: "Inspection not found" });

        res.json({ status: "200", message: "Inspección completada exitosamente", body: inspection });
    } catch (error) {
        console.error("Error completing inspection:", error);
        res.status(500).json({ status: "error", message: "Error al completar inspección" });
    }
};

module.exports = {
    getptInspections,
    createptInspection,
    updatePhysicalQty,
    addRow,
    updateRow,
    completeInspection
}