const fs = require('fs');
// import fs from "fs";


const readFiles = async (req,res)=>{
    const path=
    "//192.168.200.10\\Public\\Anuncios\\Documents";
    
    fs.readdir(path,(err,files)=>{
        if(err){
            res.status(403).json({
                status: "403",
                message: "Error al leerr Archivo: " + err,
                body: "",
              });
        }
        res.status(200).json({
            status: "200",
            message: "Files reader",
            body: files,
          });
        console.log(files)
    });
}

module.exports = readFiles;