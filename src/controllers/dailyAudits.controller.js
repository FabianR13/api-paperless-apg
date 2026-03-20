const Company = require("../models/Company");
const DailyAudits = require("../models/DailyAudits");
const User = require("../models/User");
const { sendAuditCompletionEmail } = require('../utils/emailNotifier');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config({ path: "C:\\api-paperless-apg\\src\\.env" });

AWS.config.update({
    region: process.env.S3_BUCKET_REGION,
    apiVersion: 'latest',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
});

const s3 = new AWS.S3();

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
                const userIndexA = (userIndex + 1) % userslist.length;

                auditsToCreate.push({
                    auditDay: new Date(currentDate),
                    assignedToD: userslist[userIndex],
                    auditStatusD: 'Assigned',
                    assignedToA: userslist[userIndexA],
                    auditStatusA: 'Assigned',
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
                path: 'assignedToD',
                populate: [
                    {
                        path: 'employee',
                        model: 'Employees',
                        populate: { path: 'department', model: 'Department' }
                    }
                ]
            })
            .populate({
                path: 'assignedToA',
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

// CAMBIAR DATA DE AUDITORIA //
const updateDailyAuditData = async (req, res) => {
    const { DailyAuditId } = req.params;

    try {
        let {
            generalCommentsD, generalCommentsA,
            auditStatusD, auditStatusA,
            assignedToD, assignedToA,
            observations,
            imagesToDeleteD, imagesToDeleteA
        } = req.body;

        const parsedObservations = observations ? JSON.parse(observations) : [];

        const cleanObservations = parsedObservations.map(obs => {
            if (obs.partNumber === "") {
                obs.partNumber = null;
            }
            return obs;
        });

        const parsedDeletesD = imagesToDeleteD ? JSON.parse(imagesToDeleteD) : [];
        const parsedDeletesA = imagesToDeleteA ? JSON.parse(imagesToDeleteA) : [];

        let newImagesD = [];
        let newImagesA = [];

        if (req.files) {
            if (req.files['imagesD']) {
                newImagesD = req.files['imagesD'].map(file => file.key);
            }
            if (req.files['imagesA']) {
                newImagesA = req.files['imagesA'].map(file => file.key);
            }
        }

        const oldAudit = await DailyAudits.findById(DailyAuditId);
        if (!oldAudit) return res.status(404).json({ status: "error", message: "Audit not found" });

        const isNewlyCompletedD = oldAudit.auditStatusD !== 'Completed' && auditStatusD === 'Completed';
        const isNewlyCompletedA = oldAudit.auditStatusA !== 'Completed' && auditStatusA === 'Completed';

        const updateFields = {
            generalCommentsD, generalCommentsA,
            auditStatusD, auditStatusA,
            assignedToD, assignedToA,
            observations: cleanObservations
        };

        if (auditStatusD === 'Completed') updateFields.completedTimeD = new Date().toLocaleTimeString('es-MX', { hour12: false });
        if (auditStatusA === 'Completed') updateFields.completedTimeA = new Date().toLocaleTimeString('es-MX', { hour12: false });

        if (parsedDeletesD.length > 0 || parsedDeletesA.length > 0) {
            await DailyAudits.updateOne(
                { _id: DailyAuditId },
                {
                    $pull: {
                        imagesD: { $in: parsedDeletesD },
                        imagesA: { $in: parsedDeletesA }
                    }
                }
            );
        }

        const updatedDailyAudit = await DailyAudits.findByIdAndUpdate(
            { _id: DailyAuditId },
            {
                $set: updateFields,
                $push: {
                    imagesD: { $each: newImagesD },
                    imagesA: { $each: newImagesA }
                },
            },
            { new: true }
        )
            .populate({
                path: 'assignedToD assignedToA',
                populate: { path: 'employee' }
            })
            .populate('observations.partNumber');

        if (!updatedDailyAudit) {
            return res.status(403).json({ status: "403", message: "Daily Audit not Updated" });
        }

        const allKeysToDelete = [...parsedDeletesD, ...parsedDeletesA];

        if (allKeysToDelete.length > 0) {
            const folderPath = "Uploads/DailyAuditsImgs/";

            const deleteParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Delete: {
                    Objects: allKeysToDelete.map(key => ({ Key: folderPath + key }))
                }
            };

            s3.deleteObjects(deleteParams, (err, data) => {
                if (err) console.error("Error borrando objetos huérfanos en S3:", err);
                else console.log("Objetos borrados de S3 exitosamente:", data);
            });
        }

        if (isNewlyCompletedD) {
            sendAuditCompletionEmail(updatedDailyAudit, 'Shift 1');
        }
        if (isNewlyCompletedA) {
            sendAuditCompletionEmail(updatedDailyAudit, 'Shift 2');
        }

        return res.status(200).json({ status: "200", message: "Daily Audit Updated", body: updatedDailyAudit });
    } catch (error) {
        console.error("Error updating data of daily audit", error);
        return res.status(500).json({ status: "error", message: error.message });
    }
};

// CAMBIAR STATUS A RETRASADO //
const updateDailyAuditStatus = async (req, res) => {
    const { DailyAuditId } = req.params;

    try {
        // Ahora el frontend nos manda exactamente qué turno está Overdue
        // (ya que puede que el Turno D esté Overdue pero el Turno A siga "Assigned")
        const { auditStatusD, auditStatusA } = req.body;

        const updatedDailyAudit = await DailyAudits.findByIdAndUpdate(
            { _id: DailyAuditId },
            {
                $set: {
                    auditStatusD: auditStatusD,
                    auditStatusA: auditStatusA
                }
            },
            { new: true }
        );

        if (!updatedDailyAudit) {
            return res.status(403).json({ status: "403", message: "Daily Audit not Updated", body: "" });
        }

        return res.status(200).json({ status: "200", message: "Daily Audit Updated", body: updatedDailyAudit });
    } catch (error) {
        console.error("Error updating status of daily audits", error);
        return res.status(500).json({ status: "error", message: error.message });
    }
};

module.exports = {
    scheduleAudits,
    getDailyAudits,
    updateDailyAuditStatus,
    updateDailyAuditData
}