
import AssemblyStartTechnical from "../../../models/General/AssemblyStartTechnical";
import Company from "../../../models/Company";
import User from "../../../models/User";
//method to post
export const createAssemblyStartTechnial = async(req, res) => {
    const{
        parameterSetting,
        revisionDate,
        repairMold,
        labelColor,
        ifRepair,
        orderJob,
        resinVerifiedDried,
        numberDryer,
        switchConected,
        comments,
        purgeMachine,
        containerRed,
        alarmsProgramed,
        moldWather,
        temperatures,
        transportBand,
        counterMachine,
        settingRobot,
        formatEmp,
        employee, 
        noCheckValidation,
        status,
        company,       
    } = req.body;
    const newAssemblyStartTechnical = new AssemblyStartTechnical({
        parameterSetting,
        revisionDate,
        repairMold,
        labelColor,
        ifRepair,
        orderJob,
        resinVerifiedDried,
        numberDryer,
        switchConected,
        comments,
        purgeMachine,
        containerRed,
        alarmsProgramed,
        moldWather,
        temperatures,
        transportBand,
        counterMachine,
        settingRobot,
        formatEmp,     
        noCheckValidation,
        status,       
    });
    if(employee){
        const foundEmployees = await User.find({
            username:{$in: employee},
        });
        newAssemblyStartTechnical.employee = foundEmployees.map((employee) => employee._id);
    }
    if(company) {
        const foundCompany = await Company.find({
            _id:{$in: company},
        });
        newAssemblyStartTechnical.company = foundCompany.map((company) => company._id);
    }

    const savedAssemblyStartTechnical = await newAssemblyStartTechnical.save();
    console.log(savedAssemblyStartTechnical);
    res.json({status:"200", message:"assembly start Technical created", savedAssemblyStartTechnical});
}
//method to update 
export const updateAssemblyStartTechnical = async (req,res) => {
    const {assemblyStartTechnicalId} = req.params;


    if(!req.body.employee){
        return res.json({status:"403", message:"the employee is empty", body:""});
    }
    console.log(req.body.employee);
    const foundEmployees = await User.find({
        username:{$in: req.body.employee},
    });
   
    if(foundEmployees.length === 0){
        return res.json({status:"403", message:"not employee founded", body:""});
    }

    const employee = foundEmployees.map((employee) => employee._id);
    const{
        parameterSetting,
        revisionDate,
        repairMold,
        labelColor,
        ifRepair,
        orderJob,
        resinVerifiedDried,
        numberDryer,
        switchConected,
        comments,
        purgeMachine,
        containerRed,
        alarmsProgramed,
        moldWather,
        temperatures,
        transportBand,
        counterMachine,
        settingRobot,
        formatEmp,     
        noCheckValidation,
        status,   
    } = req.body;
    const updatedAssemblyStartTechnical = await AssemblyStartTechnical.updateOne(
        {_id: assemblyStartTechnicalId},
        {$set:{
            parameterSetting,
            revisionDate,
            repairMold,
            labelColor,
            ifRepair,
            orderJob,
            resinVerifiedDried,
            numberDryer,
            switchConected,
            comments,
            purgeMachine,
            containerRed,
            alarmsProgramed,
            moldWather,
            temperatures,
            transportBand,
            counterMachine,
            settingRobot,
            formatEmp,
            employee, 
            noCheckValidation,
            status,
          
        },
    }
       
    );
    if(!updatedAssemblyStartTechnical){
        res.status(403).json({status:"403", message:"assembly start not updated", body:""});
    }
    res.status(200).json({status:"200",message:"assembly start updated", body:updatedAssemblyStartTechnical});
}
//method to get 
export const getAssemblyStartTechnical = async (req,res) => {
    const assemblyStartTechnical = await AssemblyStartTechnical.find().sort({
        parameterSetting:1,
    });
    res.json({status:"200",message:"assemblyStart", body: assemblyStartTechnical});
}