import Company from "../../../models/Company.js";
import AssemblyStartProduction from "../../../models/General/AssemblyStartProduction.js";
import User from "../../../models/User.js";
//mehtod to post 
export const createAssemblyStartProduction =  async (req,res) => {
    const{
        trainOperator,
        materialsRemoved,
        comments,
        packingComponents,
        workStation,
        containerScrap,
        docEstation,
        correctComponent,
        workCell,
        aditionalComments,
        employee,
        status,
        noCheckValidation,
        company,
    }= req.body;
     const newAssemblyStartProduction = new AssemblyStartProduction({
        trainOperator,
        materialsRemoved,
        comments,
        packingComponents,
        workStation,
        containerScrap,
        docEstation,
        correctComponent,
        workCell,
        aditionalComments,
        status,
        noCheckValidation,
    
       
     });
     if (employee) {
        const foundEmployees = await User.find({
          username: { $in: employee },
        });
        newAssemblyStartProduction.employee = foundEmployees.map((employee) => employee._id);
      }
      if (company) {
        const foundCompany = await Company.find({
          _id: { $in: company },
        });
        newAssemblyStartProduction.company = foundCompany.map((company) => company._id);
      }


     const savedAssemblyStartProduction = await newAssemblyStartProduction.save();
    console.log(savedAssemblyStartProduction);
     res.json({status:"200", message:"assembly production created",savedAssemblyStartProduction});
}
//method to update 
export const updateAssemblyStartProduction = async (req, res) => {
    const {assemblyStartProductionId} = req.params;
  
   
    if(!req.body.employee) {
      return res.json({status:"403", message:"the employee is empty", body:""});
    }
   
    const foundEmployees = await User.find({
        username:{$in: req.body.employee},
    });
    console.log(foundEmployees.length);
    if(foundEmployees.length === 0){
        return res.json({status:"403", message:"not employee founded", body:""});
    }
  const employee = foundEmployees.map((employee) => employee._id);
    const {
        trainOperator,
        materialsRemoved,
        comments,
        packingComponents,
        workStation,
        containerScrap,
        docEstation,
        correctComponent,
        workCell,
        aditionalComments,       
             
        status,
        noCheckValidation,
       
    } = req.body;
        
    const updatedAssemblyStartProduction = await AssemblyStartProduction.updateOne(
        {_id: assemblyStartProductionId},
        {$set:{
            trainOperator,
            materialsRemoved,
            comments,
            packingComponents,
            workStation,
            containerScrap,
            docEstation,
            correctComponent,
            workCell,
            aditionalComments,           
            employee,           
            status,
            noCheckValidation,
           
        },
    }
    );
    if(!updatedAssemblyStartProduction){
        res.status(403).json({status:"403", message:"assembly production not updated", body:""});
    }
    res.status(200).json({status:"200", message:"assembly production updated", body: updatedAssemblyStartProduction});
}

//method to get 
export const getAssemblyStartProduction = async (req,res) => {
    const assemblyStartProduction = await AssemblyStartProduction.find().sort({
        trainOperator:1,
    });
    res.json({status:"200", message:"assembly production loaded", body:assemblyStartProduction});
}