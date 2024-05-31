const Laptops = require("../models/Laptops.js");
const Employees = require("../models/Employees.js");
const Company = require("../models/Company.js");
const GenericAccount = require("../models/GenericAccount.js");
const Deparment = require("../models/Deparment.js");
const User = require("../models/User.js");
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const Lines = require("../models/Lines.js");
const Cellphones = require("../models/Cellphones.js");
const Accounts = require("../models/Accounts.js");
dotenv.config({ path: "C:\\api-paperless-apg\\src\\.env" });

AWS.config.update({
    region: process.env.S3_BUCKET_REGION,
    apiVersion: 'latest',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
})

const s3 = new AWS.S3();

//create deviation request//////////////////////////////////////////////////////////////////////////////////////
const createNewLaptop = async (req, res) => {
    const { CompanyId } = req.params;

    const {
        laptopName,
        responsible,
        location,
        monitor,
        ram,
        osName,
        model,
        system,
        processor,
        serialNo,
        macAddress,
        initialCost,
        purchaseDate,
        status,
        responsibeLetter,
        modifiedBy,
        modified,
        version
    } = req.body;

    const newLaptop = new Laptops({
        laptopName,
        location,
        monitor,
        ram,
        osName,
        model,
        system,
        processor,
        serialNo,
        macAddress,
        initialCost,
        purchaseDate,
        status,
        responsibeLetter,
        modified,
        version
    });

    newLaptop.responsibleAlt = "";

    if (modifiedBy) {
        const foundUsers = await User.find({
            username: { $in: modifiedBy },
        });
        newLaptop.modifiedBy = foundUsers.map((user) => user._id);
    }

    if (responsible) {
        const foundEmployee = await Employees.find({
            numberEmployee: { $in: responsible },
        });
        newLaptop.responsible = foundEmployee.map((employee) => employee._id);
    }

    if (newLaptop.responsible.length === 0) {
        const foundAccounts = await GenericAccount.find({
            groupName: { $in: responsible },
        });
        newLaptop.responsibleGroup = foundAccounts.map((account) => account._id);
    }

    if ((newLaptop.responsible.length === 0) && (newLaptop.responsibleGroup.length === 0)) {
        newLaptop.responsibleAlt = responsible;
    }

    if (CompanyId) {
        const foundCompany = await Company.find({
            _id: { $in: CompanyId },
        });
        newLaptop.company = foundCompany.map((company) => company._id);
    }

    const saveLaptop = await newLaptop.save();

    if (!saveLaptop) {
        res
            .status(403)
            .json({ status: "403", message: "Laptop not Saved", body: "" });
    }

    return res
        .status(200)
        .json({ status: "200", message: "Laptop Saved" })
};

// Getting all requisitions request/////////////////////////////////////////////////////////////////////////////////////////////////////
const getAllLaptops = async (req, res) => {

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
    const laptops = await Laptops.find({
        company: { $in: CompanyId },
    }).sort({ createdAt: -1 })
        .populate({ path: 'responsible', select: "name lastName numberEmployee", populate: { path: "department position", select: "name" } })
        .populate({ path: 'responsibleGroup', select: "groupName", populate: { path: "department members", select: "name lastName numberEmployee" } })
        .populate({ path: "modifiedBy", select: "username" })
    res.json({ status: "200", message: "Requisitions Loaded", body: laptops });
};

//create deviation request//////////////////////////////////////////////////////////////////////////////////////
const updateLaptop = async (req, res) => {
    const { laptopId } = req.params;
    let responsible;
    let responsibleAlt = "";
    let responsibleGroup;
    let modifiedBy;

    const {
        laptopName,
        location,
        monitor,
        ram,
        osName,
        model,
        system,
        processor,
        serialNo,
        macAddress,
        initialCost,
        purchaseDate,
        status,
        modified
    } = req.body;

    if (req.body.modifiedBy) {
        const foundUsers = await User.find({
            username: { $in: req.body.modifiedBy },
        });
        modifiedBy = foundUsers.map((user) => user._id);
    }

    if (req.body.responsible) {
        const foundEmployee = await Employees.find({
            numberEmployee: { $in: req.body.responsible },
        });
        responsible = foundEmployee.map((employee) => employee._id);
    }

    if (responsible.length === 0) {
        const foundAccounts = await GenericAccount.find({
            groupName: { $in: req.body.responsible },
        });
        responsibleGroup = foundAccounts.map((account) => account._id);
    }

    if ((responsible.length === 0) && (responsibleGroup.length === 0)) {
        responsibleAlt = req.body.responsible;
    }

    const updatedLaptopDevice = await Laptops.updateOne(
        { _id: laptopId },
        {
            $set: {
                laptopName,
                location,
                monitor,
                ram,
                osName,
                model,
                system,
                processor,
                serialNo,
                macAddress,
                initialCost,
                purchaseDate,
                status,
                responsible,
                responsibleAlt,
                responsibleGroup,
                modifiedBy,
                modified
            },
        }
    );

    if (!updatedLaptopDevice) {
        res
            .status(403)
            .json({ status: "403", message: "Laptop not Updated", body: "" });
    }

    res.status(200).json({
        status: "200",
        message: "Laptop Updated ",
        body: updatedLaptopDevice,
    });
};

//subir carta responsiba////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const uploadLaptopLetter = async (req, res) => {
    const { laptopId } = req.params;
    //Getting Previous document
    const foundPrevLaptop = await Laptops.findById(laptopId);
    // Deleting Images from Folder
    const prevLaptopLetter = foundPrevLaptop.responsibeLetter;
    console.log(prevLaptopLetter)
    // Validating if there are Images in the Field
    if (prevLaptopLetter !== "") {
        // Delete File from Folder
        const params = {
            Bucket: process.env.S3_BUCKET_NAME + "/Uploads/LaptopResposibeLetter",
            Key: prevLaptopLetter
        };
        try {
            s3.deleteObject(params, function (err, data) {
                if (err) console.log(err);
            });
        } catch (error) {
            console.log("error" + error)
            res.status(403).json({
                status: "403",
                message: error,
                body: "",
            });
        }
    }


    // Setting the Fields Empty in the DB
    //// const updateClearFileLaptop = await Laptops.updateOne(
    //      { _id: laptopId },
    //     {
    //          $set: {
    //              responsibeLetter: ""
    //          }
    //      }
    //  );

    //  if (!updateClearFileLaptop) {
    //       res.status(403).json({
    //         status: "403",
    //          message: "Laptop not Updated - updateClearFileLaptop",
    //         body: "",
    //     });
    // }

    //Retreiving the data for each profile Image and adding to the schema
    let responsibeLetter = "";

    if (req.file) {
        responsibeLetter = req.file.key;
    }

    let modified = req.body.modified

    // Updating the new Img Names in the fields from the DB
    const updateFileLaptop = await Laptops.updateOne(
        { _id: laptopId },
        {
            $set: {
                modified,
                responsibeLetter
            }
        }
    );

    if ((!updateFileLaptop)) {
        res.status(403).json({
            status: "403",
            message: "Laptop not Updated - updateFileLaptop",
            body: "",
        });
    }
    const foundLaptopNew = await Laptops.findById(laptopId);

    res.status(200).json({
        status: "200",
        message: "Laptop Updated",
        body: foundLaptopNew,
    });
};

//create generic account//////////////////////////////////////////////////////////////////////////////////////
const createNewGenericAccount = async (req, res) => {
    const { CompanyId } = req.params;

    const {
        groupName,
        members,
        department,
        email,
        version
    } = req.body;

    const newGenericAccount = new GenericAccount({
        groupName,
        email,
        version
    });

    if (members) {
        for (let i = 0; i < members.length; i++) {
            const foundEmployee = await Employees.find({
                numberEmployee: { $in: members[i] },
            });
            newGenericAccount.members.push(foundEmployee.map((employee) => employee._id));
        }
    }

    if (department) {
        const foundDepartments = await Deparment.find({
            name: { $in: department },
        });
        newGenericAccount.department = foundDepartments.map((department) => department._id);
    }

    if (CompanyId) {
        const foundCompany = await Company.find({
            _id: { $in: CompanyId },
        });
        newGenericAccount.company = foundCompany.map((company) => company._id);
    }

    const saveGenericAccount = await newGenericAccount.save();

    if (!saveGenericAccount) {
        res
            .status(403)
            .json({ status: "403", message: "Generic Account not Saved", body: "" });
    }

    return res
        .status(200)
        .json({ status: "200", message: "Generic Account Saved" })
};

// Getting all requisitions request/////////////////////////////////////////////////////////////////////////////////////////////////////
const getAllGenericAccounts = async (req, res) => {

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
    const genericAccounts = await GenericAccount.find({
        company: { $in: CompanyId },
    }).sort({ createdAt: -1 })
        .populate({ path: 'members', select: "name lastName numberEmployee", populate: { path: "department position", select: "name" } })
        .populate({ path: "department", select: "name" })
    res.json({ status: "200", message: "Requisitions Loaded", body: genericAccounts });
};

//update gheneric account//////////////////////////////////////////////////////////////////////////////////////
const updateGenericAccount = async (req, res) => {
    const { accountId } = req.params;
    const { CompanyId } = req.params
    let members = [];
    let department = [];

    const {
        groupName,
        email,
        modified
    } = req.body;

    if (req.body.members) {
        for (let i = 0; i < req.body.members.length; i++) {
            const foundEmployee = await Employees.find({
                numberEmployee: { $in: req.body.members[i] },
            });
            members.push(foundEmployee.map((employee) => employee._id));
        }
    }

    if (req.body.department) {
        const foundDepartments = await Deparment.find({
            name: { $in: req.body.department },
        });
        department = foundDepartments.map((department) => department._id);
    }

    if (modified) {
        const updateLaptop = await Laptops.updateOne(
            { responsibleGroup: accountId },
            {
                $set: {
                    modified
                },
            }
        );
    }

    if (modified) {
        const updateCellphone = await Cellphones.updateOne(
            { responsibleGroup: accountId },
            {
                $set: {
                    modified
                },
            }
        );
    }

    const updatedGenericAccount = await GenericAccount.updateOne(
        { _id: accountId },
        {
            $set: {
                groupName,
                email,
                members,
                department
            },
        }
    );

    if (!updatedGenericAccount) {
        res
            .status(403)
            .json({ status: "403", message: "Account not Updated", body: "" });
    }

    res.status(200).json({
        status: "200",
        message: "Account Updated ",
        body: updatedGenericAccount,
    });
};


//create new line//////////////////////////////////////////////////////////////////////////////////////
const createNewLine = async (req, res) => {
    const { CompanyId } = req.params;

    const {
        number,
        iccid,
        planName,
        status,
        startDate,
        endDate,
        modifiedBy,
        modified,
        version
    } = req.body;

    const newLine = new Lines({
        number,
        iccid,
        planName,
        status,
        startDate,
        endDate,
        modified,
        version
    });

    if (modifiedBy) {
        const foundUsers = await User.find({
            username: { $in: modifiedBy },
        });
        newLine.modifiedBy = foundUsers.map((user) => user._id);
    }

    if (CompanyId) {
        const foundCompany = await Company.find({
            _id: { $in: CompanyId },
        });
        newLine.company = foundCompany.map((company) => company._id);
    }

    const saveLine = await newLine.save();

    if (!saveLine) {
        res
            .status(403)
            .json({ status: "403", message: "Line not Saved", body: "" });
    }

    return res
        .status(200)
        .json({ status: "200", message: "Line Saved" })
};

// Getting all Lines/////////////////////////////////////////////////////////////////////////////////////////////////////
const getAllLines = async (req, res) => {

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
    const lines = await Lines.find({
        company: { $in: CompanyId },
    }).sort({ createdAt: -1 })
        .populate({ path: "modifiedBy", select: "username" })
    res.json({ status: "200", message: "Lines Loaded", body: lines });
};

//update line//////////////////////////////////////////////////////////////////////////////////////
const updateLine = async (req, res) => {
    const { lineId } = req.params;
    let modifiedBy;

    const {
        number,
        iccid,
        planName,
        status,
        startDate,
        endDate,
        modified,
    } = req.body;

    if (req.body.modifiedBy) {
        const foundUsers = await User.find({
            username: { $in: req.body.modifiedBy },
        });
        modifiedBy = foundUsers.map((user) => user._id);
    }

    const updatedLine = await Lines.updateOne(
        { _id: lineId },
        {
            $set: {
                number,
                iccid,
                planName,
                status,
                startDate,
                endDate,
                modified,
                modifiedBy
            },
        }
    );

    if (!updatedLine) {
        res
            .status(403)
            .json({ status: "403", message: "Line not Updated", body: "" });
    }

    res.status(200).json({
        status: "200",
        message: "Line Updated ",
        body: updatedLine,
    });
};

//create deviation request//////////////////////////////////////////////////////////////////////////////////////
const createNewCellphone = async (req, res) => {
    const { CompanyId } = req.params;

    const {
        cellphoneName,
        responsible,
        location,
        marca,
        model,
        serialNo,
        imei,
        macAddress,
        initialCost,
        number,
        protection,
        status,
        responsibeLetter,
        modifiedBy,
        modified,
        version
    } = req.body;

    const newCellphone = new Cellphones({
        cellphoneName,
        responsible,
        location,
        marca,
        model,
        serialNo,
        imei,
        macAddress,
        initialCost,
        protection,
        status,
        responsibeLetter,
        modified,
        version
    });

    newCellphone.responsibleAlt = "";

    if (modifiedBy) {
        const foundUsers = await User.find({
            username: { $in: modifiedBy },
        });
        newCellphone.modifiedBy = foundUsers.map((user) => user._id);
    }

    if (number) {
        const foundLine = await Lines.find({
            number: { $in: number },
        });
        newCellphone.number = foundLine.map((line) => line._id);
    }

    if (responsible) {
        const foundEmployee = await Employees.find({
            numberEmployee: { $in: responsible },
        });
        newCellphone.responsible = foundEmployee.map((employee) => employee._id);
    }

    if (newCellphone.responsible.length === 0) {
        const foundAccounts = await GenericAccount.find({
            groupName: { $in: responsible },
        });
        newCellphone.responsibleGroup = foundAccounts.map((account) => account._id);
    }

    if ((newCellphone.responsible.length === 0) && (newCellphone.responsibleGroup.length === 0)) {
        newCellphone.responsibleAlt = responsible;
    }

    if (CompanyId) {
        const foundCompany = await Company.find({
            _id: { $in: CompanyId },
        });
        newCellphone.company = foundCompany.map((company) => company._id);
    }

    const saveCellphone = await newCellphone.save();

    if (!saveCellphone) {
        res
            .status(403)
            .json({ status: "403", message: "Cellphone not Saved", body: "" });
    }

    return res
        .status(200)
        .json({ status: "200", message: "Cellphone Saved" })
};

// Getting all Lines/////////////////////////////////////////////////////////////////////////////////////////////////////
const getAllCellphones = async (req, res) => {

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
    const cellphones = await Cellphones.find({
        company: { $in: CompanyId },
    }).sort({ createdAt: -1 })
        .populate({ path: 'responsible', select: "name lastName numberEmployee", populate: { path: "department position", select: "name" } })
        .populate({ path: 'responsibleGroup', select: "groupName", populate: { path: "department members", select: "name lastName numberEmployee" } })
        .populate({ path: "modifiedBy", select: "username" })
        .populate({ path: "number" })
    res.json({ status: "200", message: "Cellphones Loaded", body: cellphones });
};

//create deviation request//////////////////////////////////////////////////////////////////////////////////////
const updateCellphone = async (req, res) => {
    const { cellphoneId } = req.params;
    let responsible;
    let responsibleAlt = "";
    let number;
    let responsibleGroup;
    let modifiedBy;

    const {
        cellphoneName,
        location,
        marca,
        model,
        serialNo,
        imei,
        macAddress,
        initialCost,
        protection,
        status,
        modified
    } = req.body;

    if (req.body.modifiedBy) {
        const foundUsers = await User.find({
            username: { $in: req.body.modifiedBy },
        });
        modifiedBy = foundUsers.map((user) => user._id);
    }

    if (req.body.number) {
        const foundLine = await Lines.find({
            number: { $in: req.body.number },
        });
        number = foundLine.map((line) => line._id);
    }

    if (req.body.responsible) {
        const foundEmployee = await Employees.find({
            numberEmployee: { $in: req.body.responsible },
        });
        responsible = foundEmployee.map((employee) => employee._id);
    }

    if (responsible.length === 0) {
        const foundAccounts = await GenericAccount.find({
            groupName: { $in: req.body.responsible },
        });
        responsibleGroup = foundAccounts.map((account) => account._id);
    }

    if ((responsible.length === 0) && (responsibleGroup.length === 0)) {
        responsibleAlt = req.body.responsible;
    }

    const updatedCellphoneDevice = await Cellphones.updateOne(
        { _id: cellphoneId },
        {
            $set: {
                cellphoneName,
                location,
                marca,
                model,
                serialNo,
                imei,
                macAddress,
                initialCost,
                protection,
                status,
                responsible,
                responsibleAlt,
                responsibleGroup,
                modifiedBy,
                modified
            },
        }
    );

    if (!updatedCellphoneDevice) {
        res
            .status(403)
            .json({ status: "403", message: "Cellphone not Updated", body: "" });
    }

    res.status(200).json({
        status: "200",
        message: "Cellphone Updated ",
        body: updatedCellphoneDevice,
    });
};

//subir carta responsiba cellphone////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const uploadCellphoneLetter = async (req, res) => {
    const { cellphoneId } = req.params;
    //Getting Previous document
    const foundPrevCellphone = await Cellphones.findById(cellphoneId);
    // Deleting Images from Folder
    const prevCellphoneLetter = foundPrevCellphone.responsibeLetter;
    // Validating if there are Images in the Field
    if (prevCellphoneLetter !== "") {
        // Delete File from Folder
        const params = {
            Bucket: process.env.S3_BUCKET_NAME + "/Uploads/CellphonesResposibeLetter",
            Key: prevCellphoneLetter
        };
        try {
            s3.deleteObject(params, function (err, data) {
                if (err) console.log(err);
            });
        } catch (error) {
            console.log("error" + error)
            res.status(403).json({
                status: "403",
                message: error,
                body: "",
            });
        }
    }

    //Retreiving the data for each profile Image and adding to the schema
    let responsibeLetter = "";

    if (req.file) {
        responsibeLetter = req.file.key;
    }

    let modified = req.body.modified

    // Updating the new Img Names in the fields from the DB
    const updateFileCellphone = await Cellphones.updateOne(
        { _id: cellphoneId },
        {
            $set: {
                modified,
                responsibeLetter
            }
        }
    );

    if ((!updateFileCellphone)) {
        res.status(403).json({
            status: "403",
            message: "Cellphone not Updated - updateFileCellphone",
            body: "",
        });
    }
    const foundCellphoneNew = await Cellphones.findById(cellphoneId);

    res.status(200).json({
        status: "200",
        message: "Cellphone Updated",
        body: foundCellphoneNew,
    });
};

//create accounts//////////////////////////////////////////////////////////////////////////////////////
const createNewAccounts = async (req, res) => {
    const { CompanyId } = req.params;

    const {
        responsible,
        prismUser,
        email,
        windowsUser,
        paperlessUser,
        printerUser,
        ext,
        status,
        responsibeLetter,
        modifiedBy,
        modified,
        version
    } = req.body;

    const newAccounts = new Accounts({
        prismUser,
        email,
        windowsUser,
        paperlessUser,
        printerUser,
        ext,
        status,
        responsibeLetter,
        modifiedBy,
        modified,
        version
    });

    newAccounts.responsibleAlt = "";

    if (modifiedBy) {
        const foundUsers = await User.find({
            username: { $in: modifiedBy },
        });
        newAccounts.modifiedBy = foundUsers.map((user) => user._id);
    }

    if (responsible) {
        const foundEmployee = await Employees.find({
            numberEmployee: { $in: responsible },
        });
        newAccounts.responsible = foundEmployee.map((employee) => employee._id);
    }

    if (newAccounts.responsible.length === 0) {
        const foundAccounts = await GenericAccount.find({
            groupName: { $in: responsible },
        });
        newAccounts.responsibleGroup = foundAccounts.map((account) => account._id);
    }

    if ((newAccounts.responsible.length === 0) && (newAccounts.responsibleGroup.length === 0)) {
        newAccounts.responsibleAlt = responsible;
    }

    if (CompanyId) {
        const foundCompany = await Company.find({
            _id: { $in: CompanyId },
        });
        newAccounts.company = foundCompany.map((company) => company._id);
    }

    const saveAccounts = await newAccounts.save();

    if (!saveAccounts) {
        res
            .status(403)
            .json({ status: "403", message: "Acccounts not Saved", body: "" });
    }

    return res
        .status(200)
        .json({ status: "200", message: "Acccounts Saved" })
};

// Getting all Accounts/////////////////////////////////////////////////////////////////////////////////////////////////////
const getAllAccounts = async (req, res) => {
    const { accountStatus } = req.params
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
    const accounts = await Accounts.find({
        company: { $in: CompanyId },
        status: { $in: accountStatus },
    }).sort({ responsible: -1 })
        .populate({ path: 'responsible', select: "name lastName numberEmployee", populate: { path: "department position", select: "name" } })
        .populate({ path: 'responsibleGroup', select: "groupName", populate: { path: "department members", select: "name lastName numberEmployee" } })
        .populate({ path: "modifiedBy", select: "username" })
    res.json({ status: "200", message: "Accounts Loaded", body: accounts });
};

//create deviation request//////////////////////////////////////////////////////////////////////////////////////
const updateAccounts = async (req, res) => {
    const { accountsId } = req.params;
    let responsible;
    let responsibleAlt = "";
    let responsibleGroup;
    let modifiedBy;

    const {
        prismUser,
        email,
        windowsUser,
        paperlessUser,
        printerUser,
        ext,
        status,
        modified
    } = req.body;

    if (req.body.modifiedBy) {
        const foundUsers = await User.find({
            username: { $in: req.body.modifiedBy },
        });
        modifiedBy = foundUsers.map((user) => user._id);
    }

    if (req.body.responsible) {
        const foundEmployee = await Employees.find({
            numberEmployee: { $in: req.body.responsible },
        });
        responsible = foundEmployee.map((employee) => employee._id);
    }

    if (responsible.length === 0) {
        const foundAccounts = await GenericAccount.find({
            groupName: { $in: req.body.responsible },
        });
        responsibleGroup = foundAccounts.map((account) => account._id);
    }

    if ((responsible.length === 0) && (responsibleGroup.length === 0)) {
        responsibleAlt = req.body.responsible;
    }

    const updatedAccounts = await Accounts.updateOne(
        { _id: accountsId },
        {
            $set: {
                prismUser,
                email,
                windowsUser,
                paperlessUser,
                printerUser,
                ext,
                status,
                responsible,
                responsibleAlt,
                responsibleGroup,
                modifiedBy,
                modified
            },
        }
    );

    if (!updatedAccounts) {
        res
            .status(403)
            .json({ status: "403", message: "Accounts not Updated", body: "" });
    }

    res.status(200).json({
        status: "200",
        message: "Accounts Updated ",
        body: updatedAccounts,
    });
};

//subir carta responsiba cellphone////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const uploadAccountsLetter = async (req, res) => {
    const { accountsId } = req.params;
    //Getting Previous document
    const foundPrevAccounts = await Accounts.findById(accountsId);
    // Deleting Images from Folder
    const prevAccountsLetter = foundPrevAccounts.responsibeLetter;
    // Validating if there are Images in the Field
    if (prevAccountsLetter !== "") {
        // Delete File from Folder
        const params = {
            Bucket: process.env.S3_BUCKET_NAME + "/Uploads/AccountsResposibeLetter",
            Key: prevAccountsLetter
        };
        try {
            s3.deleteObject(params, function (err, data) {
                if (err) console.log(err);
            });
        } catch (error) {
            console.log("error" + error)
            res.status(403).json({
                status: "403",
                message: error,
                body: "",
            });
        }
    }

    //Retreiving the data for each profile Image and adding to the schema
    let responsibeLetter = "";

    if (req.file) {
        responsibeLetter = req.file.key;
    }

    let modified = req.body.modified

    // Updating the new Img Names in the fields from the DB
    const updateFileAccounts = await Accounts.updateOne(
        { _id: accountsId },
        {
            $set: {
                modified,
                responsibeLetter
            }
        }
    );

    if ((!updateFileAccounts)) {
        res.status(403).json({
            status: "403",
            message: "Accounts not Updated - updateFileCellphone",
            body: "",
        });
    }
    const foundAccountsNew = await Accounts.findById(accountsId);

    res.status(200).json({
        status: "200",
        message: "Accounts Updated",
        body: foundAccountsNew,
    });
};

// Getting all Accounts/////////////////////////////////////////////////////////////////////////////////////////////////////
const getDirectory = async (req, res) => {
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

    const cellphones = await Cellphones.find({
        company: { $in: CompanyId },
        number: { $ne: null }
    }).sort({ createdAt: -1 })
        .select("cellphoneName")
        .populate({ path: 'responsible', select: "name lastName numberEmployee", populate: { path: "department position", select: "name" } })
        .populate({ path: 'responsibleGroup', select: "groupName", populate: { path: "department members", select: "name lastName numberEmployee" } })
        .populate({ path: "number" })
    //res.json({ status: "200", message: "Cellphones Loaded", body: cellphones });


    const Directory = await Accounts.find({
        company: { $in: CompanyId },
        email: { $ne: "" }
    }).sort({ email: 1 })
        .select("ext email")
        .populate({ path: 'responsible', select: "name lastName numberEmployee", populate: { path: "department position", select: "name" } })
        .populate({ path: 'responsibleGroup', select: "groupName", populate: { path: "department members", select: "name lastName numberEmployee" } })

    Directory.push(cellphones)

    res.json({ status: "200", message: "Accounts Loaded", body: Directory });
};

module.exports = {
    createNewLaptop,
    getAllLaptops,
    updateLaptop,
    uploadLaptopLetter,
    createNewGenericAccount,
    getAllGenericAccounts,
    updateGenericAccount,
    createNewLine,
    getAllLines,
    updateLine,
    createNewCellphone,
    getAllCellphones,
    updateCellphone,
    uploadCellphoneLetter,
    createNewAccounts,
    getAllAccounts,
    updateAccounts,
    uploadAccountsLetter,
    getDirectory
};