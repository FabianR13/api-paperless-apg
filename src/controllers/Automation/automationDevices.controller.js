const AutomationDevice = require("../../models/Automation/AutomationDevice.js")
const Company = require("../../models/Company.js")

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

module.exports = {
    getAutomationDevices
}