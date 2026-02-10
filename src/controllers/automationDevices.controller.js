const AutomationDevice = require("../models/AutomationDevice.js")
const Company = require("../models/Company.js");
const Customer = require("../models/Customer.js");
const Parts = require("../models/Parts.js");

//Metodo para obtener los dospositivos 
const getAutomationDevices = async (req, res) => {
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
    const automationDevices = await AutomationDevice.find({
        company: { $in: CompanyId }
    }).sort({ cretaedAt: -1 })
        .populate({ path: "customer" });

    res.json({ status: "200", message: "Automation Devices Loaded", body: automationDevices });
}

//Crear dispositivo
const createAutomationDevice = async (req, res) => {
    try {
        const { CompanyId } = req.params;
        const { deviceId, name, customer, partNumber } = req.body;

        if (!deviceId || !name || !customer || !partNumber) {
            return res.status(400).json({
                message: "Faltan campos obligatorios (Device ID, Name, Customer, Part Number)."
            });
        }

        const existingDevice = await AutomationDevice.findOne({ deviceId: deviceId });
        if (existingDevice) {
            return res.status(400).json({
                message: `El Device ID '${deviceId}' ya existe. Por favor usa uno diferente.`
            });
        }

        if (CompanyId) {
            const foundCompany = await Company.findById(CompanyId);
            if (!foundCompany) return res.status(404).json({ message: "La compañía especificada no existe." });
        }

        if (customer) {
            const foundCustomer = await Customer.findById(customer);
            if (!foundCustomer) return res.status(404).json({ message: "El cliente especificado no existe." });
        }

        if (partNumber) {
            const foundPart = await Parts.findById(partNumber);
            if (!foundPart) return res.status(404).json({ message: "El número de parte especificado no existe." });

            if (foundPart.customer.toString() !== customer) {
                return res.status(400).json({ message: "La parte no pertenece al cliente seleccionado." });
            }
        }

        const newDevice = new AutomationDevice({
            ...req.body,
            company: CompanyId,
            customer: customer,
            partNumber: partNumber
        });

        const savedDevice = await newDevice.save();

        if (!savedDevice) {
            return res.status(403).json({ status: "403", message: "Device not Saved" });
        }

        res.json({
            status: "200",
            message: "New Device created successfully",
            savedDevice
        });

    } catch (error) {
        console.error("Error creating device:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "El Device ID ya existe en la base de datos." });
        }
        res.status(500).json({ message: "Error interno del servidor al crear el dispositivo." });
    }
};

const updateAutomationDevice = async (req, res) => {
    try {
        const { automationDeviceId } = req.params;
        const updates = req.body;

        if (updates.deviceId) {
            const conflictingDevice = await AutomationDevice.findOne({
                deviceId: updates.deviceId,
                _id: { $ne: automationDeviceId }
            });
            if (conflictingDevice) {
                return res.status(400).json({ message: `El Device ID '${updates.deviceId}' ya está en uso.` });
            }
        }

        if (updates.customer) {
            const foundCustomer = await Customer.findById(updates.customer);
            if (!foundCustomer) return res.status(404).json({ message: "Cliente no encontrado." });
        }

        if (updates.partNumber) {
            const foundPart = await Parts.findById(updates.partNumber);
            if (!foundPart) return res.status(404).json({ message: "Número de parte no encontrado." });
        }

        const updatedDevice = await AutomationDevice.findByIdAndUpdate(
            automationDeviceId,
            updates,
            { new: true, runValidators: true }
        )
            .populate("customer", "name")
            .populate("partNumber", "partnumber name");

        if (!updatedDevice) {
            return res.status(404).json({ message: "Dispositivo no encontrado." });
        }

        res.json({
            status: "200",
            message: "Device updated successfully",
            updatedDevice
        });

    } catch (error) {
        console.error("Error updating device:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

module.exports = {
    getAutomationDevices,
    createAutomationDevice,
    updateAutomationDevice
}