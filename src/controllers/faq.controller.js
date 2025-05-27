// Controlador para el Kaizen
const Kaizen = require("../../../models/Others/Kaizen.js");
const Company = require("../../../models/Company.js");
const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.S3_BUCKET_REGION,
  apiVersion: 'latest',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  }
})

const s3 = new AWS.S3();

//Create new kaizen/////////////////////////////////////////////////////////////////////////////////////////////////////////
const createKaizen = async (req, res) => {
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
        return { img: file.key };
      });
    }
  }
  //Retreiving the data for each Before Kaizen Image and adding to the schema
  let kaizenImagesA = [];

  if (req.files["kaizenImagesA"]) {
    if (req.files["kaizenImagesA"].length > 0) {
      kaizenImagesA = req.files["kaizenImagesA"].map((file) => {
        return { img: file.key };
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
      _id: { $in: company },
    });
    kaizen.company = foundCompany.map((company) => company._id);
  }

  const kaizens = await Kaizen.find({
    company: { $in: req.body.company },
  }).sort({ consecutive: -1 }).limit(1);

  if (kaizens.length === 0) {
    kaizen.consecutive = 1;
  } else {
    kaizen.consecutive = kaizens[0].consecutive + 1
  }

  kaizen.save((error, kaizen) => {
    if (error) return res.status(400).json({ status: "400", message: error });
    if (kaizen) {
      res.json({ status: "200", message: "Kaizen Created", body: kaizen });
    }
  });
};