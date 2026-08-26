const Laptops = require("../models/Laptops.js");
const Employees = require("../models/Employees.js");
const Company = require("../models/Company.js");
const GenericAccount = require("../models/GenericAccount.js");
const Deparment = require("../models/Deparment.js");
const User = require("../models/User.js");
const Lines = require("../models/Lines.js");
const Cellphones = require("../models/Cellphones.js");
const Accounts = require("../models/Accounts.js");
const Monitors = require("../models/Monitors.js");
const LabelPrinters = require("../models/LabelPrinters.js");
const Chromebooks = require("../models/Chromebooks.js");
const Scanners = require("../models/Scanners.js");
const ScheduledService = require("../models/ScheduledService.js");
const ResponsibilitySignatures = require("../models/ResponsibilitySignatures.js");
const { differenceInMonths } = require('date-fns');
const mongoose = require('mongoose');

//Actualizacion de sdk de aws v3
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = new S3Client({
    region: process.env.S3_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
});

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
        principalDisk,
        secondaryDisk,
        initialCost,
        purchaseDate,
        status,
        responsibeLetter,
        modifiedBy,
        modified,
        version,
        cato,
        netCard
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
        principalDisk,
        secondaryDisk,
        initialCost,
        purchaseDate,
        status,
        responsibeLetter,
        modified,
        version,
        cato,netCard
    });

    newLaptop.responsibleAlt = "";

    if (modifiedBy) {
        const foundUsers = await User.find({
            username: { $in: modifiedBy },
        });
        newLaptop.modifiedBy = foundUsers.map((user) => user._id);
    }

    if (mongoose.Types.ObjectId.isValid(responsible)) {

        const foundEmployee = await Employees.find({ _id: responsible });

        if (foundEmployee.length > 0) {
            newLaptop.responsible = foundEmployee.map((employee) => employee._id);
        } else {
            const foundAccounts = await GenericAccount.find({ _id: responsible });
            if (foundAccounts.length > 0) {
                newLaptop.responsibleGroup = foundAccounts.map((account) => account._id);
            }
        }
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
        .populate({ path: "responsiveLetterSigned", select: "status signatureImg" })
    res.json({ status: "200", message: "Requisitions Loaded", body: laptops });
};

//create deviation request//////////////////////////////////////////////////////////////////////////////////////
const updateLaptop = async (req, res) => {
    const { laptopId } = req.params;
    let responsible;
    let responsibleAlt;
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
        principalDisk,
        secondaryDisk,
        initialCost,
        purchaseDate,
        status,
        modified,
        cato,
        netCard
    } = req.body;

    if (req.body.modifiedBy) {
        const foundUsers = await User.find({
            username: { $in: req.body.modifiedBy },
        });
        modifiedBy = foundUsers.map((user) => user._id);
    }

    if (req.body.responsible) {
        responsible = [];
        responsibleGroup = [];
        responsibleAlt = "";

        if (mongoose.Types.ObjectId.isValid(req.body.responsible)) {

            const foundEmployee = await Employees.find({ _id: req.body.responsible });

            if (foundEmployee.length > 0) {
                responsible = foundEmployee.map((employee) => employee._id);
            } else {
                const foundAccounts = await GenericAccount.find({ _id: req.body.responsible });
                if (foundAccounts.length > 0) {
                    responsibleGroup = foundAccounts.map((account) => account._id);
                }
            }
        }

        if ((responsible.length === 0) && (responsibleGroup.length === 0)) {
            responsibleAlt = req.body.responsible;
        }
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
                principalDisk,
                secondaryDisk,
                initialCost,
                purchaseDate,
                status,
                responsible,
                responsibleAlt,
                responsibleGroup,
                modifiedBy,
                modified,
                cato,
                netCard
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
    //console.log(prevLaptopLetter)
    // Validating if there are Images in the Field
    if (prevLaptopLetter !== "") {
        // Delete File from Folder
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: "Uploads/LaptopResposibeLetter/" + prevLaptopLetter
        };

        const command = new DeleteObjectCommand(params);
        s3.send(command)
            .then(() => console.log("Deleted from S3:", prevLaptopLetter))
            .catch(err => console.error("Error deleting from S3:", err));
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
        responsibeLetter = req.file.key.split('/').pop();
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

    if (members && members.length > 0) {
        const foundEmployees = await Employees.find({
            numberEmployee: { $in: members },
        });
        newGenericAccount.members = foundEmployees.map((employee) => employee._id);
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
        const foundEmployees = await Employees.find({
            numberEmployee: { $in: req.body.members },
        });
        members = foundEmployees.map((employee) => employee._id);
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

    if (mongoose.Types.ObjectId.isValid(responsible)) {

        const foundEmployee = await Employees.find({ _id: responsible });

        if (foundEmployee.length > 0) {
            newCellphone.responsible = foundEmployee.map((employee) => employee._id);
        } else {
            const foundAccounts = await GenericAccount.find({ _id: responsible });
            if (foundAccounts.length > 0) {
                newCellphone.responsibleGroup = foundAccounts.map((account) => account._id);
            }
        }
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
        .populate({ path: "responsiveLetterSigned", select: "status signatureImg" })
    res.json({ status: "200", message: "Cellphones Loaded", body: cellphones });
};

//create deviation request//////////////////////////////////////////////////////////////////////////////////////
const updateCellphone = async (req, res) => {
    const { cellphoneId } = req.params;
    let responsible;
    let responsibleAlt;
    let number = [];
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
        responsible = [];
        responsibleGroup = [];
        responsibleAlt = "";

        if (mongoose.Types.ObjectId.isValid(req.body.responsible)) {

            const foundEmployee = await Employees.find({ _id: req.body.responsible });

            if (foundEmployee.length > 0) {
                responsible = foundEmployee.map((employee) => employee._id);
            } else {
                const foundAccounts = await GenericAccount.find({ _id: req.body.responsible });
                if (foundAccounts.length > 0) {
                    responsibleGroup = foundAccounts.map((account) => account._id);
                }
            }
        }

        if ((responsible.length === 0) && (responsibleGroup.length === 0)) {
            responsibleAlt = req.body.responsible;
        }
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
                number,
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
            Bucket: process.env.S3_BUCKET_NAME,
            Key: "Uploads/CellphonesResposibeLetter/" + prevCellphoneLetter
        };

        const command = new DeleteObjectCommand(params);
        s3.send(command)
            .then(() => console.log("Deleted from S3:", prevCellphoneLetter))
            .catch(err => console.error("Error deleting from S3:", err));
    }

    //Retreiving the data for each profile Image and adding to the schema
    let responsibeLetter = "";

    if (req.file) {
        responsibeLetter = req.file.key.split('/').pop();
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
        version, cato
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
        version,
        cato
    });

    newAccounts.responsibleAlt = "";

    if (modifiedBy) {
        const foundUsers = await User.find({
            username: { $in: modifiedBy },
        });
        newAccounts.modifiedBy = foundUsers.map((user) => user._id);
    }

    if (mongoose.Types.ObjectId.isValid(responsible)) {

        const foundEmployee = await Employees.find({ _id: responsible });

        if (foundEmployee.length > 0) {
            newAccounts.responsible = foundEmployee.map((employee) => employee._id);
        } else {
            const foundAccounts = await GenericAccount.find({ _id: responsible });
            if (foundAccounts.length > 0) {
                newAccounts.responsibleGroup = foundAccounts.map((account) => account._id);
            }
        }
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
        .populate({ path: "responsiveLetterSigned", select: "status signatureImg" })
    res.json({ status: "200", message: "Accounts Loaded", body: accounts });
};

//create deviation request//////////////////////////////////////////////////////////////////////////////////////
const updateAccounts = async (req, res) => {
    const { accountsId } = req.params;
    let modifiedBy;

    const {
        prismUser,
        email,
        windowsUser,
        paperlessUser,
        printerUser,
        ext,
        status,
        modified, cato
    } = req.body;

    if (req.body.modifiedBy) {
        const foundUsers = await User.find({
            username: { $in: req.body.modifiedBy },
        });
        modifiedBy = foundUsers.map((user) => user._id);
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
                modifiedBy,
                modified,
                cato
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
            Bucket: process.env.S3_BUCKET_NAME,
            Key: "Uploads/AccountsResposibeLetter/" + prevAccountsLetter
        };

        const command = new DeleteObjectCommand(params);
        s3.send(command)
            .then(() => console.log("Deleted from S3:", prevAccountsLetter))
            .catch(err => console.error("Error deleting from S3:", err));
    }

    //Retreiving the data for each profile Image and adding to the schema
    let responsibeLetter = "";

    if (req.file) {
        responsibeLetter = req.file.key.split('/').pop();
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
    const { CompanyId } = req.params;

    if (CompanyId.length !== 24) {
        return res.status(400).json({ status: "400", message: "ID de compañía inválido" });
    }

    const company = await Company.findById(CompanyId).lean();
    if (!company) {
        return res.status(404).json({ status: "404", message: "Compañía no encontrada" });
    }

    const [cellphones, accounts] = await Promise.all([
        Cellphones.find({
            company: CompanyId,
            // Como 'number' es un arreglo, esto asegura que no esté vacío
            number: { $exists: true, $not: { $size: 0 } }
        })
            .sort({ createdAt: -1 })
            .select("cellphoneName responsibleAlt") // Agregamos responsibleAlt por si es "Stock"
            .populate({ path: 'responsible', select: "name lastName numberEmployee", populate: { path: "department position", select: "name" } })
            .populate({ path: 'responsibleGroup', select: "groupName", populate: { path: "department members", select: "name lastName numberEmployee" } })
            .populate({ path: "number" })
            .lean(),

        Accounts.find({
            company: CompanyId,
            status: "Active",
            email: { $ne: "" }
        })
            .sort({ email: 1 })
            .select("ext email responsibleAlt")
            .populate({ path: 'responsible', select: "name lastName numberEmployee", populate: { path: "department position", select: "name" } })
            .populate({ path: 'responsibleGroup', select: "groupName", populate: { path: "department members", select: "name lastName numberEmployee" } })
            .lean()
    ]);

    const directoryMap = new Map();

    // Función para obtener un ID único de agrupación, extrayendo el primer elemento del arreglo
    const getEntityId = (item) => {
        if (item.responsible && item.responsible.length > 0) return item.responsible[0]._id.toString();
        if (item.responsibleGroup && item.responsibleGroup.length > 0) return item.responsibleGroup[0]._id.toString();
        if (item.responsibleAlt) return item.responsibleAlt; // Agrupa por "Stock" u otros textos
        return item._id.toString(); // Fallback
    };

    // Función para extraer los datos limpios del responsable para el frontend
    const getResponsibleData = (item) => {
        if (item.responsible && item.responsible.length > 0) return item.responsible[0];
        if (item.responsibleGroup && item.responsibleGroup.length > 0) return item.responsibleGroup[0];
        return { isAlt: true, name: item.responsibleAlt || "Sin asignar" };
    };

    // 2. Procesar Cellphones
    cellphones.forEach(phone => {
        const phoneNumberInfo = phone.number && phone.number.length > 0 ? phone.number[0] : null;

        if (phoneNumberInfo && String(phoneNumberInfo.number).startsWith('5')) {
            return;
        }

        const entityId = getEntityId(phone);

        if (!directoryMap.has(entityId)) {
            directoryMap.set(entityId, {
                responsible: getResponsibleData(phone),
                accounts: [],
                cellphones: []
            });
        }

        directoryMap.get(entityId).cellphones.push({
            _id: phone._id,
            cellphoneName: phone.cellphoneName,
            numberData: phoneNumberInfo
        });
    });


    // 1. Procesar Accounts
    accounts.forEach(account => {
        const entityId = getEntityId(account);

        if (!directoryMap.has(entityId)) {
            directoryMap.set(entityId, {
                responsible: getResponsibleData(account),
                accounts: [],
                cellphones: []
            });
        }

        directoryMap.get(entityId).accounts.push({
            _id: account._id,
            email: account.email,
            ext: account.ext
        });
    });


    const unifiedDirectory = Array.from(directoryMap.values());

    res.json({ status: "200", message: "Directorio cargado correctamente", body: unifiedDirectory });
};

//create deviation request//////////////////////////////////////////////////////////////////////////////////////
const createNewMonitor = async (req, res) => {
    const { CompanyId } = req.params;

    const {
        monitorName,
        responsible,
        location,
        marca,
        model,
        serialNo,
        status,
        modifiedBy,
        modified,
        version
    } = req.body;

    const newMonitor = new Monitors({
        monitorName,
        responsible,
        location,
        marca,
        model,
        serialNo,
        status,
        modified,
        version
    });

    newMonitor.responsibleAlt = "";

    if (modifiedBy) {
        const foundUsers = await User.find({
            username: { $in: modifiedBy },
        });
        newMonitor.modifiedBy = foundUsers.map((user) => user._id);
    }

    if (mongoose.Types.ObjectId.isValid(responsible)) {

        const foundEmployee = await Employees.find({ _id: responsible });

        if (foundEmployee.length > 0) {
            newMonitor.responsible = foundEmployee.map((employee) => employee._id);
        } else {
            const foundAccounts = await GenericAccount.find({ _id: responsible });
            if (foundAccounts.length > 0) {
                newMonitor.responsibleGroup = foundAccounts.map((account) => account._id);
            }
        }
    }

    if ((newMonitor.responsible.length === 0) && (newMonitor.responsibleGroup.length === 0)) {
        newMonitor.responsibleAlt = responsible;
    }

    if (CompanyId) {
        const foundCompany = await Company.find({
            _id: { $in: CompanyId },
        });
        newMonitor.company = foundCompany.map((company) => company._id);
    }

    const saveMonitor = await newMonitor.save();

    if (!saveMonitor) {
        res
            .status(403)
            .json({ status: "403", message: "Monitor not Saved", body: "" });
    }

    return res
        .status(200)
        .json({ status: "200", message: "Monitor Saved" })
};


// Getting all Monitors/////////////////////////////////////////////////////////////////////////////////////////////////////
const getAllMonitors = async (req, res) => {

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
    const monitors = await Monitors.find({
        company: { $in: CompanyId },
    }).sort({ createdAt: -1 })
        .populate({ path: 'responsible', select: "name lastName numberEmployee", populate: { path: "department position", select: "name" } })
        .populate({ path: 'responsibleGroup', select: "groupName", populate: { path: "department members", select: "name lastName numberEmployee" } })
        .populate({ path: "modifiedBy", select: "username" })
    res.json({ status: "200", message: "Cellphones Loaded", body: monitors });
};

//update monitor data//////////////////////////////////////////////////////////////////////////////////////
const updateMonitor = async (req, res) => {
    const { monitorId } = req.params;
    let responsible;
    let responsibleAlt;
    let responsibleGroup;
    let modifiedBy;

    const {
        monitorName,
        location,
        marca,
        model,
        serialNo,
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
        responsible = [];
        responsibleGroup = [];
        responsibleAlt = "";

        if (mongoose.Types.ObjectId.isValid(req.body.responsible)) {

            const foundEmployee = await Employees.find({ _id: req.body.responsible });

            if (foundEmployee.length > 0) {
                responsible = foundEmployee.map((employee) => employee._id);
            } else {
                const foundAccounts = await GenericAccount.find({ _id: req.body.responsible });
                if (foundAccounts.length > 0) {
                    responsibleGroup = foundAccounts.map((account) => account._id);
                }
            }
        }

        if ((responsible.length === 0) && (responsibleGroup.length === 0)) {
            responsibleAlt = req.body.responsible;
        }
    }

    const updatedMonitorDevice = await Monitors.updateOne(
        { _id: monitorId },
        {
            $set: {
                monitorName,
                location,
                marca,
                model,
                serialNo,
                status,
                responsible,
                responsibleAlt,
                responsibleGroup,
                modifiedBy,
                modified
            },
        }
    );

    if (!updatedMonitorDevice) {
        res
            .status(403)
            .json({ status: "403", message: "Monitor not Updated", body: "" });
    }

    res.status(200).json({
        status: "200",
        message: "Monitor Updated ",
        body: updatedMonitorDevice,
    });
};

//create new label printer//////////////////////////////////////////////////////////////////////////////////////
const createNewLabelPrinter = async (req, res) => {
    const { CompanyId } = req.params;

    const {
        printerName,
        location,
        marca,
        model,
        serialNo,
        macAddress,
        ipAddress,
        status,
        printerCondition,
        comments,
        modifiedBy,
        version
    } = req.body;

    const newLabelPrinter = new LabelPrinters({
        printerName,
        location,
        marca,
        model,
        serialNo,
        macAddress,
        ipAddress,
        status,
        printerCondition,
        comments,
        version
    });


    if (modifiedBy) {
        const foundUsers = await User.find({
            username: { $in: modifiedBy },
        });
        newLabelPrinter.modifiedBy = foundUsers.map((user) => user._id);
    }

    if (CompanyId) {
        const foundCompany = await Company.find({
            _id: { $in: CompanyId },
        });
        newLabelPrinter.company = foundCompany.map((company) => company._id);
    }

    const saveLabelPrinter = await newLabelPrinter.save();

    if (!saveLabelPrinter) {
        res
            .status(403)
            .json({ status: "403", message: "Label Printer not Saved", body: "" });
    }

    return res
        .status(200)
        .json({ status: "200", message: "Label Printer Saved" })
};

// Getting all Label Printer/////////////////////////////////////////////////////////////////////////////////////////////////////
const getAllLabelPrinters = async (req, res) => {

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
    const labelPrinters = await LabelPrinters.find({
        company: { $in: CompanyId },
    }).sort({ createdAt: -1 })
        .populate({ path: "modifiedBy", select: "username" })
    res.json({ status: "200", message: "Cellphones Loaded", body: labelPrinters });
};

//update label printer data//////////////////////////////////////////////////////////////////////////////////////
const updateLabelPrinter = async (req, res) => {
    const { labelPrinterId } = req.params;
    let modifiedBy;

    const {
        printerName,
        location,
        marca,
        model,
        serialNo,
        macAddress,
        ipAddress,
        status,
        printerCondition,
        comments
    } = req.body;

    if (req.body.modifiedBy) {
        const foundUsers = await User.find({
            username: { $in: req.body.modifiedBy },
        });
        modifiedBy = foundUsers.map((user) => user._id);
    }

    const updatedLabelPrinterDevice = await LabelPrinters.updateOne(
        { _id: labelPrinterId },
        {
            $set: {
                printerName,
                location,
                marca,
                model,
                serialNo,
                macAddress,
                ipAddress,
                status,
                printerCondition,
                comments,
                modifiedBy,
            },
        }
    );

    if (!updatedLabelPrinterDevice) {
        res
            .status(403)
            .json({ status: "403", message: "Label printer not Updated", body: "" });
    }

    res.status(200).json({
        status: "200",
        message: "Label printer Updated ",
        body: updatedLabelPrinterDevice,
    });
};

//create new chromebook//////////////////////////////////////////////////////////////////////////////////////
const createNewChromebook = async (req, res) => {
    const { CompanyId } = req.params;

    const {
        chromebookName,
        location,
        model,
        serialNo,
        macAddressWifi,
        macAddressAdaptador,
        status,
        chromebookCondition,
        comments,
        modifiedBy,
        version
    } = req.body;

    const newChromebook = new Chromebooks({
        chromebookName,
        location,
        model,
        serialNo,
        macAddressWifi,
        macAddressAdaptador,
        status,
        chromebookCondition,
        comments,
        version
    });


    if (modifiedBy) {
        const foundUsers = await User.find({
            username: { $in: modifiedBy },
        });
        newChromebook.modifiedBy = foundUsers.map((user) => user._id);
    }

    if (CompanyId) {
        const foundCompany = await Company.find({
            _id: { $in: CompanyId },
        });
        newChromebook.company = foundCompany.map((company) => company._id);
    }

    const saveChromebook = await newChromebook.save();

    if (!saveChromebook) {
        res
            .status(403)
            .json({ status: "403", message: "Chromebook not Saved", body: "" });
    }

    return res
        .status(200)
        .json({ status: "200", message: "Chromebook Saved" })
};

// Getting all Chromebooks/////////////////////////////////////////////////////////////////////////////////////////////////////
const getAllChromebooks = async (req, res) => {

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
    const chromebooks = await Chromebooks.find({
        company: { $in: CompanyId },
    }).sort({ createdAt: -1 })
        .populate({ path: "modifiedBy", select: "username" })
    res.json({ status: "200", message: "Chromebooks Loaded", body: chromebooks });
};

//update label printer data//////////////////////////////////////////////////////////////////////////////////////
const updateChromebook = async (req, res) => {
    const { chromebookId } = req.params;
    let modifiedBy;

    const {
        chromebookName,
        location,
        model,
        serialNo,
        macAddressWifi,
        macAddressAdaptador,
        status,
        chromebookCondition,
        comments
    } = req.body;

    if (req.body.modifiedBy) {
        const foundUsers = await User.find({
            username: { $in: req.body.modifiedBy },
        });
        modifiedBy = foundUsers.map((user) => user._id);
    }

    const updatedChromebook = await Chromebooks.updateOne(
        { _id: chromebookId },
        {
            $set: {
                chromebookName,
                location,
                model,
                serialNo,
                macAddressWifi,
                macAddressAdaptador,
                status,
                chromebookCondition,
                comments,
                modifiedBy,
            },
        }
    );

    if (!updatedChromebook) {
        res
            .status(403)
            .json({ status: "403", message: "Chromebook not Updated", body: "" });
    }

    res.status(200).json({
        status: "200",
        message: "Chromebook Updated ",
        body: updatedChromebook,
    });
};

//create new scanner//////////////////////////////////////////////////////////////////////////////////////
const createNewScanner = async (req, res) => {
    const { CompanyId } = req.params;

    const {
        scannerName,
        location,
        model,
        serialNoScanner,
        serialNoBase,
        pairCode,
        status,
        scannerCondition,
        comments,
        modifiedBy,
        version
    } = req.body;

    const newScanner = new Scanners({
        scannerName,
        location,
        model,
        serialNoScanner,
        serialNoBase,
        pairCode,
        status,
        scannerCondition,
        comments,
        version
    });


    if (modifiedBy) {
        const foundUsers = await User.find({
            username: { $in: modifiedBy },
        });
        newScanner.modifiedBy = foundUsers.map((user) => user._id);
    }

    if (CompanyId) {
        const foundCompany = await Company.find({
            _id: { $in: CompanyId },
        });
        newScanner.company = foundCompany.map((company) => company._id);
    }

    const saveScanner = await newScanner.save();

    if (!saveScanner) {
        res
            .status(403)
            .json({ status: "403", message: "Scanner not Saved", body: "" });
    }

    return res
        .status(200)
        .json({ status: "200", message: "Scanner Saved" })
};

// Getting all Scanners/////////////////////////////////////////////////////////////////////////////////////////////////////
const getAllScanners = async (req, res) => {

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
    const scanners = await Scanners.find({
        company: { $in: CompanyId },
    }).sort({ createdAt: -1 })
        .populate({ path: "modifiedBy", select: "username" })
    res.json({ status: "200", message: "Scanners Loaded", body: scanners });
};

//update scanner data//////////////////////////////////////////////////////////////////////////////////////
const updateScanner = async (req, res) => {
    const { scannerId } = req.params;
    let modifiedBy;

    const {
        scannerName,
        location,
        model,
        serialNoScanner,
        serialNoBase,
        pairCode,
        status,
        scannerCondition,
        comments
    } = req.body;

    if (req.body.modifiedBy) {
        const foundUsers = await User.find({
            username: { $in: req.body.modifiedBy },
        });
        modifiedBy = foundUsers.map((user) => user._id);
    }

    const updatedScanner = await Scanners.updateOne(
        { _id: scannerId },
        {
            $set: {
                scannerName,
                location,
                model,
                serialNoScanner,
                serialNoBase,
                pairCode,
                status,
                scannerCondition,
                comments,
                modifiedBy,
            },
        }
    );

    if (!updatedScanner) {
        res
            .status(403)
            .json({ status: "403", message: "Scanner not Updated", body: "" });
    }

    res.status(200).json({
        status: "200",
        message: "Scanner Updated ",
        body: updatedScanner,
    });
};



const createNewServiceDay = async (req, res) => {
    const { CompanyId } = req.params;

    const {
        selectedDate, // Fecha del nuevo servicio solicitado
        employeeNumber,
        observations
    } = req.body;

    if (employeeNumber) {
        const foundEmployee = await Employees.findOne({
            numberEmployee: employeeNumber,
        });

        if (!foundEmployee) {
            return res
                .status(404)
                .json({ status: "404", message: "Employee not found", body: "" });
        }

        // --- NUEVO BLOQUE DE VALIDACIÓN DE FECHA ---
        // 1. Buscar el último servicio programado para este empleado
        const lastService = await ScheduledService.findOne({
            employee: foundEmployee._id
        }).sort({ selectedDate: -1 }); // Ordena por fecha descendente para obtener el más reciente

        // 2. Si existe un servicio previo, calcular la diferencia
        if (lastService) {
            const monthDifference = differenceInMonths(
                new Date(selectedDate),      // Fecha nueva
                lastService.selectedDate     // Fecha del último servicio en la DB
            );

            // 3. Si la diferencia es menor a 2 meses, bloquear la solicitud
            if (monthDifference < 2) {
                return res
                    .status(409) // 409 Conflict es un buen código de estado para esto
                    .json({ status: "409", message: "This employee already has a service scheduled less than 2 months ago." });
            }
        }
        // --- FIN DEL BLOQUE DE VALIDACIÓN ---

        // Si la validación pasa, el código continúa...
        const newServiceDay = new ScheduledService({
            selectedDate,
            serviceStatus: "Open",
            employee: foundEmployee._id, // Asignar el empleado aquí
            observations: observations || "",
        });

        if (CompanyId) {
            const foundCompany = await Company.findOne({
                _id: CompanyId,
            });
            if (!foundCompany) { // Buena práctica: validar también la compañía
                return res.status(404).json({ status: "404", message: "Company not found" });
            }
            newServiceDay.company = foundCompany._id;
        }

        const savedService = await newServiceDay.save();

        if (!savedService) {
            return res
                .status(403)
                .json({ status: "403", message: "Service not Saved", body: "" });
        }

        return res
            .status(200)
            .json({ status: "200", message: "Service Saved", body: savedService });

    } else {
        // Manejar el caso si no se envía un número de empleado
        return res.status(400).json({ status: "400", message: "Employee number is required." });
    }
};

// Getting all ScheduledService/////////////////////////////////////////////////////////////////////////////////////////////////////
const getScheduledService = async (req, res) => {

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
    const scheduledService = await ScheduledService.find({
        company: { $in: CompanyId },
    }).sort({ createdAt: -1 })
        .populate({ path: "employee", select: "name lastName" })
    res.json({ status: "200", message: "ScheduledService Loaded", body: scheduledService });
};

//update scanner data//////////////////////////////////////////////////////////////////////////////////////
const updateServiceDay = async (req, res) => {
    const { ServiceDayId } = req.params;
    let modifiedBy;

    const {
        serviceStatus,
        observations
    } = req.body;

    if (req.body.username) {
        const foundUser = await User.findOne({
            username: { $in: req.body.username },
        });
        modifiedBy = foundUser._id;
    }

    const updatedeServiceDay = await ScheduledService.updateOne(
        { _id: ServiceDayId },
        {
            $set: {
                serviceStatus,
                observations,
                modifiedBy,
            },
        }
    );

    if (!updatedeServiceDay) {
        res
            .status(403)
            .json({ status: "403", message: "Service not Updated", body: "" });
    }

    res.status(200).json({
        status: "200",
        message: "Service Updated ",
        body: updatedeServiceDay,
    });
};

const generateSignatureDoc = async (req, res) => {
    const { assetId, assetType, employeeId, genericGroupId } = req.body;
    const { CompanyId } = req.params;

    try {
        let newDocData = {
            assetType,
            assetId,
            company: [CompanyId],
            status: "Pending"
        };

        if (genericGroupId) {
            // Caso: Cuenta Genérica -> buscar miembros y crear un renglón por cada uno
            const genericGroup = await GenericAccount.findById(genericGroupId);
            if (!genericGroup || !genericGroup.members || genericGroup.members.length === 0) {
                return res.status(400).json({ status: "400", message: "La cuenta genérica no tiene miembros asignados." });
            }

            newDocData.employee = null;
            newDocData.signers = genericGroup.members.map((memberId) => ({
                employee: memberId,
                signatureImg: null,
                status: "Pending"
            }));
        } else if (employeeId) {
            // Caso: Empleado individual (comportamiento actual, sin cambios)
            newDocData.employee = employeeId;
        } else {
            return res.status(400).json({ status: "400", message: "Se requiere employeeId o genericGroupId." });
        }

        const newDoc = new ResponsibilitySignatures(newDocData);
        await newDoc.save();

        // Vincular el ID del nuevo documento al equipo correspondiente
        if (assetType === "Laptop") {
            await Laptops.findByIdAndUpdate(assetId, { responsiveLetterSigned: newDoc._id });
        } else if (assetType === "Cellphone") {
            await Cellphones.findByIdAndUpdate(assetId, { responsiveLetterSigned: newDoc._id });
        } else if (assetType === "Account") {
            await Accounts.findByIdAndUpdate(assetId, { responsiveLetterSigned: newDoc._id });
        }

        return res.status(200).json({
            status: "200",
            message: "Documento de firma generado. Aparecerá en pendientes.",
            body: newDoc
        });
    } catch (error) {
        console.error("Error al generar doc de firma:", error);
        return res.status(500).json({ status: "500", message: "Error al generar documento" });
    }
};

const getPendingSignatures = async (req, res) => {
    try {
        const companyId = req.params.companyId || req.params.CompanyId || req.params.company;

        if (!companyId) {
            return res.status(400).json({
                status: "400",
                message: "Parámetro companyId no proporcionado."
            });
        }

        const showAll = req.query.all === "true";
        const filter = showAll
            ? { company: companyId }
            : { company: companyId, status: "Pending" };

        const pendingSignatures = await ResponsibilitySignatures.find(filter)
            .populate("employee", "name lastName numberEmployee")
            .populate("signers.employee", "name lastName numberEmployee");

        // Populate manual del asset (Laptop o Cellphone) según assetType
        const populatedSignatures = await Promise.all(
            pendingSignatures.map(async (doc) => {
                let Model;
                if (doc.assetType === "Laptop") Model = Laptops;
                else if (doc.assetType === "Cellphone") Model = Cellphones;
                else if (doc.assetType === "Account") Model = Accounts;

                const asset = await Model.findById(doc.assetId)
                    .select("laptopName cellphoneName system monitor ram processor serialNo initialCost status marca model imei number prismUser email windowsUser paperlessUser printerUser responsible responsibleGroup modifiedBy responsiveLetterSigned")
                    .populate({ path: "responsible", select: "name lastName" })
                    .populate({ path: "responsibleGroup", select: "groupName members", populate: { path: "members", select: "name lastName" } })
                    .populate({ path: "modifiedBy", select: "username" })
                    .populate({ path: "responsiveLetterSigned", select: "status signatureImg" });
                return { ...doc.toObject(), assetId: asset };
            })
        );

        return res.status(200).json({
            status: "200",
            body: populatedSignatures
        });
    } catch (error) {
        console.error("Error en getPendingSignatures:", error);
        return res.status(500).json({
            status: "500",
            message: "Error al obtener firmas pendientes",
            error: error.message
        });
    }
};

const saveSignature = async (req, res) => {
    const signatureDocId = req.params.signatureDocId || req.params.id;
    const { memberId } = req.body; // Si viene, indica que es firma de un miembro dentro de signers[]

    try {
        let signatureImgKey = "";

        if (req.files && req.files["signatureImage"] && req.files["signatureImage"].length > 0) {
            signatureImgKey = req.files["signatureImage"][0].key.split('/').pop();
        } else if (req.file) {
            signatureImgKey = req.file.key.split('/').pop();
        }

        if (!signatureImgKey) {
            return res.status(400).json({ status: "400", message: "No se recibió el archivo de imagen de la firma" });
        }

        const doc = await ResponsibilitySignatures.findById(signatureDocId);
        if (!doc) {
            return res.status(404).json({ status: "404", message: "Documento de firma no encontrado" });
        }

        if (memberId && doc.signers && doc.signers.length > 0) {
            // Caso: firma de un miembro dentro de una cuenta genérica
            const signer = doc.signers.find(s => s.employee.toString() === memberId);
            if (!signer) {
                return res.status(404).json({ status: "404", message: "Miembro no encontrado en la lista de firmantes" });
            }
            signer.signatureImg = signatureImgKey;
            signer.status = "Signed";
            signer.signedAt = new Date();

            // Verificar si TODOS los miembros ya firmaron
            const allSigned = doc.signers.every(s => s.status === "Signed");
            doc.status = allSigned ? "Signed" : "Pending";
        } else {
            // Caso: firma individual (comportamiento actual, sin cambios)
            doc.signatureImg = signatureImgKey;
            doc.status = "Signed";
            doc.signedAt = new Date();
        }

        await doc.save();

        return res.status(200).json({
            status: "200",
            message: "Firma guardada correctamente",
            body: doc
        });
    } catch (error) {
        console.error("Error al guardar la firma:", error);
        return res.status(500).json({ status: "500", message: "Error al guardar la firma" });
    }
};

const getGadgets = async (req, res) => {
    try {
        const { company } = req.params;
        const gadgets = await Gadget.find({ company }).sort({ createdAt: -1 });
        
        return res.status(200).json({
            body: gadgets
        });
    } catch (error) {
        console.error("Error fetching gadgets:", error);
        return res.status(500).json({ message: error.message || "Error al obtener gadgets" });
    }
};

const createGadget = async (req, res) => {
    try {
        const { company } = req.params;
        const {
            employeeId,
            employeeName,
            gadgetType,
            gadgetName,
            condition,
            deliveryDate,
            status,
            notes,
            createdBy
        } = req.body;

        const newGadget = new Gadget({
            company,
            employeeId,
            employeeName,
            gadgetType,
            gadgetName,
            condition,
            deliveryDate: deliveryDate || new Date(),
            status: status || "Asignado",
            notes,
            createdBy
        });

        const savedGadget = await newGadget.save();

        return res.status(201).json({
            message: "Gadget guardado exitosamente",
            body: savedGadget
        });
    } catch (error) {
        console.error("Error creating gadget:", error);
        return res.status(500).json({ message: error.message || "Error al guardar el gadget" });
    }
};

const updateGadget = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedGadget = await Gadget.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        if (!updatedGadget) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        return res.status(200).json({
            message: "Gadget actualizado correctamente",
            body: updatedGadget
        });
    } catch (error) {
        console.error("Error updating gadget:", error);
        return res.status(500).json({ message: error.message || "Error al actualizar el gadget" });
    }
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
    getDirectory,
    createNewMonitor,
    getAllMonitors,
    updateMonitor,
    createNewLabelPrinter,
    getAllLabelPrinters,
    updateLabelPrinter,
    createNewChromebook,
    getAllChromebooks,
    updateChromebook,
    createNewScanner,
    getAllScanners,
    updateScanner,
    createNewServiceDay,
    getScheduledService,
    updateServiceDay,
    generateSignatureDoc,
    getPendingSignatures,
    saveSignature,
    getGadgets,
    createGadget,
    updateGadget
};