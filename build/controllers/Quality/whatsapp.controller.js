const {
  whatsapp
} = require("../middlewares/whatsapp");

const QRCode = require("qrcode");

const whatsappAutoAlert = require("../models/whatsappAutoAlert.js");

const loginWhatsapp = (req, res, next) => {
  whatsapp.on('qr', qr => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
    QRCode.toDataURL(qr).then(url => {
      console.log(url);
      res.status(200).json({
        status: "200",
        message: "Whatsapp qr generated",
        body: url
      });
    }).catch(err => {
      console.error(err);
      res.status(200).json({
        status: "200",
        message: "Whatsapp qr error",
        body: err
      });
    });
  });
  whatsapp.on('ready', () => {
    console.log('Client is ready!'); // res
    //      .status(200)
    //     .json({ status: "200", message: "Whatsapp sesion is active", body: "" });
  });
}; //Crear nuevo rol//////////////////////////////////////////////////////////////////////////////////////////////////////////


const sendMessage = async (req, res) => {
  const whatsappAutoAlertData = await whatsappAutoAlert.find();
  console.log(whatsappAutoAlertData[0].message);
  console.log(whatsappAutoAlertData[0].receivers);
  const date = new Date();
  const diaActual = date.getDay();
  const horaActual = date.getHours();
  const minutosActual = date.getMinutes();
  console.log(horaActual);
  console.log(minutosActual); // const celulares = ['+5214191280540', '+5214191364747']
  //const message = "*Mensaje autogenerado* \nMensaje de prueba"

  const celulares = whatsappAutoAlertData[0].receivers;
  const message = "*MENSAJE GENERADO AUTOMATICAMENTE NO RESPONDER*\n" + whatsappAutoAlertData[0].message;

  for (let i = 0; i < celulares.length; i++) {
    const chatId = celulares[i].substring(1) + '@c.us';
    const number_details = await whatsapp.getNumberId(chatId);

    if (diaActual === 5 && horaActual === 14 && minutosActual === 18) {
      if (number_details) {
        await whatsapp.sendMessage(chatId, message);
        console.log("Mensaje enviado");
      } else {
        console.log("Mensaje no enviado");
      }
    } else console.log("Fuera de tiempo");
  }

  console.log("Envio de mensajes terminado");
};

const logoutWhatsapp = async (req, res) => {
  whatsapp.logout();
  res.status(200).json({
    status: "200",
    message: "Whatsapp sesion end",
    body: ""
  });
}; //////////////////////////////////////////////////////////////////////////////////////////////


const autoSendMessage = async (req, res) => {
  const whatsappAutoAlertData = await whatsappAutoAlert.find();
  console.log(whatsappAutoAlertData[0].message);
  console.log(whatsappAutoAlertData[0].receivers);
  const date = new Date();
  const diaActual = date.getDay();
  const horaActual = date.getHours();
  const minutosActual = date.getMinutes();
  console.log(horaActual);
  console.log(minutosActual); // const celulares = ['+5214191280540', '+5214191364747']
  //const message = "*Mensaje autogenerado* \nMensaje de prueba"

  const celulares = whatsappAutoAlertData[0].receivers;
  const message = whatsappAutoAlertData[0].message;

  for (let i = 0; i < celulares.length; i++) {
    const chatId = celulares[i].substring(1) + '@c.us';
    const number_details = await whatsapp.getNumberId(chatId);

    if (diaActual === 5 && horaActual === 14 && minutosActual === 55) {
      if (number_details) {
        await whatsapp.sendMessage(chatId, message);
        console.log("Mensaje enviado");
      } else {
        console.log("Mensaje no enviado");
      }
    } else console.log("Fuera de tiempo");
  }

  console.log("Envio de mensajes terminado");
}; // Forms that are shown in the Dashboard//////////////////////////////////////////////////////////////////////////////////////////


const createAutoAlertData = async (req, res) => {
  const {
    message,
    receivers
  } = req.body;
  const newAutoAlertData = new whatsappAutoAlert({
    message,
    receivers
  });
  const autoAlertDataSaved = await newAutoAlertData.save();
  res.status(201).json(autoAlertDataSaved);
};

module.exports = {
  sendMessage,
  loginWhatsapp,
  logoutWhatsapp,
  autoSendMessage,
  createAutoAlertData
};