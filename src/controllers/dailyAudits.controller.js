const Company = require("../models/Company");
const DailyAudits = require("../models/DailyAudits");
const User = require("../models/User");


// CREAR DAILY AUDITS AIGNANDO EL DIA AL EMPLEADO ////////////////////////////////////////////////////////////////////////////////////////////
const scheduleAudits = async (req, res) => {
    const { CompanyId } = req.params;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

    const foundCompany = await Company.findById(CompanyId);
    if (!foundCompany) return res.status(404).json({ status: "error", message: "Company not found" });

    try {
        const { startDate, endDate, userslist } = req.body

        if (!startDate || !endDate || !userslist || userslist.length === 0) {
            return res.status(400).json({ message: "Missing required fields or empty user list" });
        }

        const usersFound = await User.find({ _id: { $in: userslist } });

        if (usersFound.length !== userslist.length) {
            return res.status(404).json({ message: "One or more user IDs do not exist in the database." });
        }

        const excludedDates = ['2026-03-16', '2026-05-01', '2026-09-16', '2026-11-16'];

        let currentDate = new Date(`${startDate}T00:00:00Z`);
        const finalDate = new Date(`${endDate}T00:00:00Z`);

        const auditsToCreate = [];
        let userIndex = 0;

        while (currentDate <= finalDate) {
            const dayOfWeek = currentDate.getUTCDay();

            const dateString = currentDate.toISOString().split('T')[0];

            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const isExcluded = excludedDates.includes(dateString);

            if (!isWeekend && !isExcluded) {
                auditsToCreate.push({
                    auditDay: new Date(currentDate),
                    assignedTo: userslist[userIndex],
                    auditStatus: 'Assigned',
                    comments: '',
                    company: CompanyId
                });

                userIndex++;
                if (userIndex >= userslist.length) {
                    userIndex = 0;
                }
            }

            currentDate.setUTCDate(currentDate.getUTCDate() + 1);
        }

        if (auditsToCreate.length === 0) {
            return res.status(400).json({ message: "No valid working days found in the selected range." });
        }

        await DailyAudits.insertMany(auditsToCreate);

        return res.status(200).json({
            status: "200",
            message: "Daily Audits scheduled successfully",
            totalScheduled: auditsToCreate.length
        });
    } catch (error) {
        console.error("Error saving template:", error);
        return res.status(500).json({
            success: false,
            message: 'Server error while saving template',
            error: error.message
        });
    }
};

// OBTENER TODOS LOS DAILY AUDITS //
const getDailyAudits = async (req, res) => {
    const { CompanyId } = req.params;

    // Validación básica de ID
    if (!CompanyId || CompanyId.length !== 24) {
        return res.status(400).json({ status: "error", message: "Invalid Company ID" });
    }

    try {
        const company = await Company.findById(CompanyId);
        if (!company) return res.status(404).json({ status: "error", message: "Company not found" });

        const dailyAudits = await DailyAudits.find({
            company: { $in: CompanyId }
        }).sort({ auditDay: -1 })
            .populate({
                path: 'assignedTo',
                populate: [
                    {
                        path: 'employee',
                        model: 'Employees',
                        populate: { path: 'department', model: 'Department' }
                    }
                ]
            })

        res.json({ status: "200", message: "Daily Audits Loaded", body: dailyAudits })
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error loading deviations" });
    }
};

// CAMBIAR DATA DE AUDITORTIA //
const updateDailyAuditData = async (req, res) => {
    const { DailyAuditId } = req.params;

    try {
        const { comments, auditStatus, assignedTo } = req.body;

        const user = await User.findById(assignedTo);
        if (!user) return res.status(404).json({ status: "error", message: "Error al buscar usuario" });

        let currentStatus = auditStatus;

        if (comments !== "" && auditStatus !== 'Completed') {
            currentStatus = "In Process"
        }

        const updatedDailyAudit = await DailyAudits.findByIdAndUpdate(
            { _id: DailyAuditId },
            {
                $set: {
                    auditStatus: currentStatus,
                    comments,
                    assignedTo
                }
            }
        )

        if (!updatedDailyAudit) {
            res
                .status(403)
                .json({ status: "403", message: "Daily Audit not Updated", body: "" });
        }

        res
            .status(200)
            .json({ status: "200", message: "Daily Audit Updated", body: updatedDailyAudit });
    } catch (error) {
        console.error("Error updating status of daily audits", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

// CAMBIAR STATUS A RETRAZADO //
const updateDailyAuditStatus = async (req, res) => {
    const { DailyAuditId } = req.params;

    try {

        const updatedDailyAudit = await DailyAudits.findByIdAndUpdate(
            { _id: DailyAuditId },
            { $set: { auditStatus: "Overdue" } }
        )

        if (!updatedDailyAudit) {
            res
                .status(403)
                .json({ status: "403", message: "Daily Audit not Updated", body: "" });
        }

        res
            .status(200)
            .json({ status: "200", message: "Daily Audit Updated", body: updatedDailyAudit });
    } catch (error) {
        console.error("Error updating status of daily audits", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

module.exports = {
    scheduleAudits,
    getDailyAudits,
    updateDailyAuditStatus,
    updateDailyAuditData
}