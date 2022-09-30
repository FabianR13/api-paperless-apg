// Controlador para el Kaizen
import { json } from "body-parser";
import { nextTick } from "process";
import Kaizen from "../../../models/Others/Kaizen.js";
import Company from "../../../models/Company.js";
const fs = require("fs");

export const  createKaizen = async (req, res) => {
  const {
    kaizenName,
    date,
    createdBy,
    area,
    implementArea,
    implementDate,
    takenPlant,
    teamKaizen,
    money,
    space,
    security,
    ergonomy,
    fiveS,
    environment,
    process,
    motivation,
    other,
    beforeKaizen,
    afterKaizen,
    status,
    montlyRank,
    observations,
    lastModifyBy,
    implementationCost,
    company,
  } = req.body;

  //Retreiving the data for each Before Kaizen Image and adding to the schema

  let kaizenImagesB = [];

  if (req.files["kaizenImagesB"]) {
    if (req.files["kaizenImagesB"].length > 0) {
      kaizenImagesB = req.files["kaizenImagesB"].map((file) => {
        return { img: file.filename };
      });
    }
  }
  //Retreiving the data for each Before Kaizen Image and adding to the schema

  let kaizenImagesA = [];

  if (req.files["kaizenImagesA"]) {
    if (req.files["kaizenImagesA"].length > 0) {
      kaizenImagesA = req.files["kaizenImagesA"].map((file) => {
        return { img: file.filename };
      });
    }
  }

  const kaizen = new Kaizen({
    kaizenName,
    date,
    createdBy,
    area,
    implementArea,
    implementDate,
    takenPlant,
    teamKaizen,
    money,
    space,
    security,
    ergonomy,
    fiveS,
    environment,
    process,
    motivation,
    other,
    beforeKaizen,
    afterKaizen,
    status,
    montlyRank,
    observations,
    lastModifyBy,
    implementationCost,
    kaizenImagesB,
    kaizenImagesA,
  });
  if (company) {
    const foundCompany = await Company.find({
      _id: { $in: company},
    });
    kaizen.company = foundCompany.map((company) => company._id);
  }
  
  const kaizens = await Kaizen.find({
    company: { $in: req.body.company },
  }).sort({ consecutive: -1 }).limit(1);

  if(kaizens.length === 0){
    kaizen.consecutive = 1;
  }else{
    kaizen.consecutive = kaizens[0].consecutive + 1
  }

  
 
  kaizen.save((error, kaizen) => {
    if (error) return res.status(400).json({ status: "400", message: error });
    if (kaizen) {
      res.json({ status: "200", message: "Kaizen Created", body: kaizen });
    }
  });
/////////////////////////////////////////
  // res.status(200).json({
  //   KaizenB: req.files["kaizenImagesB"],
  //   KaizenA: req.files["kaizenImagesA"],
  //   body: req.body,
  // });
};

// Getting all Kaizens
export const getKaizens = async (req, res) => {
  const {CompanyId} = req.params
  if(CompanyId.length !== 24){
    return;
  }
  const company = await Company.find({
    _id: { $in: CompanyId },
  })
  if(!company){
    return;
  }
  const kaizens = await Kaizen.find({
    company: { $in: CompanyId },
  }).sort({ consecutive: -1 });
  res.json({ status: "200", message: "Kaizens Loaded", body: kaizens });
};

// Getting Kaizen by Id
export const getKaizenById = async (req, res) => {
  const foundKaizen = await Kaizen.findById(req.params.kaizenId);
  if (!foundKaizen) {
    res
      .status(403)
      .json({ status: "403", message: "Kaizen not Founded", body: "" });
  }

  res
    .status(200)
    .json({ status: "200", message: "Kaizen Founded", body: foundKaizen });
};

// Getting Kaizens Filtered
export const getKaizensFiltered = async (req, res) => {
  const {start, end, area, status, createdBy, montlyRank,company} = req.body
  let options = {};

  //Date range filter
  if (req.body.start && req.body.end) {
    if (!options["date"]) options["date"] = {};

    options["date"]["$gte"] = new Date(start);
    options["date"]["$lte"] = new Date(end);
  }

  // Filter by Area
  if (area) {
    options["area"] = area;
  }

  // Filter by Status
  if(status) {
    options["status"] = status
  }

  // Filter Created By
  if(createdBy) {
    options["createdBy"] = createdBy
  }
  // Filter MontlyRank
  if(montlyRank) {
    options["montlyRank"] = montlyRank
  }
  // Filter Company
  if(company) {
    options["company"] = company
  }

  console.log(options);

  const kaizens = await Kaizen.find(options).sort({ date: -1 });
  res.json({ status: "200", message: "Kaizens Loaded New", body: kaizens });
};

// Updating the Kaizen All data
export const updateKaizen = async (req, res) => {
  //const updatedKaizen = await K
  const { kaizenId } = req.params;
  const {
    kaizenName,
    createdBy,
    area,
    implementArea,
    implementDate,
    takenPlant,
    teamKaizen,
    money,
    space,
    security,
    ergonomy,
    fiveS,
    environment,
    process,
    motivation,
    other,
    beforeKaizen,
    afterKaizen,
    status,
    lastModifyBy,
    implementationCost,
  } = req.body;

  const updatedKaizen = await Kaizen.updateOne(
    { _id: kaizenId },
    {
      $set: {
        kaizenName,
        createdBy,
        area,
        implementArea,
        implementDate,
        takenPlant,
        teamKaizen,
        money,
        space,
        security,
        ergonomy,
        fiveS,
        environment,
        process,
        motivation,
        other,
        beforeKaizen,
        afterKaizen,
        status,
        lastModifyBy,
        implementationCost,
      },
    }
  );

  if (!updatedKaizen) {
    res
      .status(403)
      .json({ status: "403", message: "Kaizen not Updated", body: "" });
  }

  res
    .status(200)
    .json({ status: "200", message: "Kaizen Updated ", body: updatedKaizen });
};

// Updating the Kaizen All data
export const updateKaizenStatus = async (req, res) => {
  //const updatedKaizen = await K
  const { kaizenId } = req.params;
  const { status, observations,montlyRank,lastModifyBy } = req.body;

  const updatedKaizenStatus = await Kaizen.updateOne(
    { _id: kaizenId },
    {
      $set: {
        status,
        observations,
        montlyRank,
        lastModifyBy,
      },
    }
  );

  if (!updatedKaizenStatus) {
    res
      .status(403)
      .json({ status: "403", message: "Kaizen Status not Updated", body: "" });
  }

  res.status(200).json({
    status: "200",
    message: "Kaizen Status Updated ",
    body: updatedKaizenStatus,
  });
};

// Function to modify the Images from a Kaizen
export const modifyKaizenImg = async (req, res) => {
  const { kaizenId } = req.params;

  //Getting Previous Images
  const foundPrevKaizen = await Kaizen.findById(kaizenId);

  const path =
    "C:\\Paperless\\PAPERLESS-APG\\public\\Uploads\\KaizenImgs\\";
    // "E:\\Paperless\\PAPERLESS-APG\\build\\Uploads\\KaizenImgs\\";

  // Deleting Images from Folder for KaizenB
  const prevKaizenImagesB = foundPrevKaizen.kaizenImagesB;
  if (prevKaizenImagesB) {
    // Validating if there are Images in the Field
    if (prevKaizenImagesB.length > 0) {
      prevKaizenImagesB.map((file) => {
        // Delete File from Folder
        try {
          fs.unlink(path + file.img, (err) => {
            if (err) {
              res.status(403).json({
                status: "403",
                message: "Error al eliminar Archivo: " + err,
                body: "",
              });
            }
          });
        } catch (error) {
          res.status(403).json({
            status: "403",
            message: error,
            body: "",
          });
        }
      });
    }
  }

  // Deleting Images from Folder for KaizenA
  const prevKaizenImagesA = foundPrevKaizen.kaizenImagesA;
  if (prevKaizenImagesA) {
    // Validating if there are Images in the Field
    if (prevKaizenImagesA.length > 0) {
      prevKaizenImagesA.map((file) => {
        // Delete File from Folder
        try {
          fs.unlink(path + file.img, (err) => {
            if (err) {
              console.error(err);
              res.status(403).json({
                status: "403",
                message: "Error al eliminar Archivo: " + err,
                body: "",
              });
            }
          });
        } catch (error) {
          res.status(403).json({
            status: "403",
            message: error,
            body: "",
          });
        }
      });
    }
  }

  // Setting the Fields Empty in the DB
  const updateClearImgKaizen = await Kaizen.updateOne(
    { _id: kaizenId },
    { $set: { kaizenImagesB: [], kaizenImagesA: [] } }
  );

  if (!updateClearImgKaizen) {
    res.status(403).json({
      status: "403",
      message: "Kaizen not Updated - updateClearImgKaizen",
      body: "",
    });
  }

  //Retreiving the data for each Before Kaizen Image and adding to the schema
  let kaizenImagesB = [];
  if (req.files["kaizenImagesB"]) {
    if (req.files["kaizenImagesB"].length > 0) {
      kaizenImagesB = req.files["kaizenImagesB"].map((file) => {
        return { img: file.filename };
      });
    }
  }

  //Retreiving the data for each Before Kaizen Image and adding to the schema
  let kaizenImagesA = [];
  if (req.files["kaizenImagesA"]) {
    if (req.files["kaizenImagesA"].length > 0) {
      kaizenImagesA = req.files["kaizenImagesA"].map((file) => {
        return { img: file.filename };
      });
    }
  }

  // Updating the new Img Names in the fields from the DB
  const updateImgKaizen = await Kaizen.updateOne(
    { _id: kaizenId },
    { $set: { kaizenImagesB, kaizenImagesA } }
  );

  if (!updateImgKaizen) {
    res.status(403).json({
      status: "403",
      message: "Kaizen not Updated - updateImgKaizen",
      body: "",
    });
  }

  const foundKaizenNew = await Kaizen.findById(kaizenId);

  res.status(200).json({
    status: "200",
    message: "Images Updated",
    body: foundKaizenNew,
  });
};


//delete kaizen
export const deleteKaizen = async (req, res) => {
  //const updatedKaizen = await K
  const { kaizenId } = req.params;
  const path =
  "C:\\Paperless\\PAPERLESS-APG\\public\\Uploads\\KaizenImgs\\";
  // "E:\\Paperless\\PAPERLESS-APG\\build\\Uploads\\KaizenImgs\\";
  const foundPrevKaizen = await Kaizen.findById(kaizenId);

// Deleting Images from Folder for KaizenB
const prevKaizenImagesB = foundPrevKaizen.kaizenImagesB;
if (prevKaizenImagesB) {
  // Validating if there are Images in the Field
  if (prevKaizenImagesB.length > 0) {
    prevKaizenImagesB.map((file) => {
      // Delete File from Folder
      try {
        fs.unlink(path + file.img, (err) => {
          if (err) {
            res.status(403).json({
              status: "403",
              message: "Error al eliminar Archivo: " + err,
              body: "",
            });
          }
        });
      } catch (error) {
        res.status(403).json({
          status: "403",
          message: error,
          body: "",
        });
      }
    });
  }
}

// Deleting Images from Folder for KaizenA
const prevKaizenImagesA = foundPrevKaizen.kaizenImagesA;
if (prevKaizenImagesA) {
  // Validating if there are Images in the Field
  if (prevKaizenImagesA.length > 0) {
    prevKaizenImagesA.map((file) => {
      // Delete File from Folder
      try {
        fs.unlink(path + file.img, (err) => {
          if (err) {
            console.error(err);
            res.status(403).json({
              status: "403",
              message: "Error al eliminar Archivo: " + err,
              body: "",
            });
          }
        });
      } catch (error) {
        res.status(403).json({
          status: "403",
          message: error,
          body: "",
        });
      }
    });
  }
}

  Kaizen.findById(kaizenId, function(err, kaizen){
		if(err){
			res.status(503).json({
        status: "403",
        message: err,
      });
      return;
		}
				kaizen.remove(
						res.status(200).json({
              status: "200",
              message: 'The kaizen has been deleted',
            }));
		
	});

};