const PartsInfo = require("../models/PartsInfo.js");

//Create new part info///////////////////////////////////////////////////////////////////////////////////////////////////
const signPartsInfo = async (req, res) => {
    const {
        machine,
        numberCavities,
        shotWeight,
        totalShotWeight,
        avgPartWeight,
        cycleTime,
        partsPerHour,
        company,
        partnumber,
        cushion,
        recovery,
        fillTime,
        peakPress,
        status,
    } = req.body;
    const newPartInfo = new PartsInfo({
        machine,
        numberCavities,
        shotWeight,
        totalShotWeight,
        avgPartWeight,
        cycleTime,
        partsPerHour,
        company,
        partnumber,
        cushion,
        recovery,
        fillTime,
        peakPress,
        status,
    });
    const savedPartsInfos = await newPartInfo.save();
    res.json({ status: "200", message: "part info created", savedPartsInfos });
};
//Update part info///////////////////////////////////////////////////////////////////////////////////////////////////////
const updatePartInfo = async (req, res) => {
    const { partInfoId } = req.params;
    const {
        machine,
        numberCavities,
        shotWeight,
        totalShotWeight,
        avgPartWeight,
        cycleTime,
        partsPerHour,
        company,
        partnumber,
        cushion,
        recovery,
        fillTime,
        peakPress,
        status,
    } = req.body;
    const updatedPartInfo = await PartsInfo.updateOne(
        { _id: partInfoId },
        {
            $set: {
                machine,
                numberCavities,
                shotWeight,
                totalShotWeight,
                avgPartWeight,
                cycleTime,
                partsPerHour,
                company,
                partnumber,
                cushion,
                recovery,
                fillTime,
                peakPress,
                status,
            },
        }
    );

    if (!updatedPartInfo) {
        res.status(403).json({ status: "403", message: "part info not updated", body: "" });
    }
    res.status(200).json({ stauts: "200", message: "part info updated", body: updatedPartInfo });
}

module.exports = {
    signPartsInfo,
    updatePartInfo
};