const { Client, RemoteAuth, LocalAuth } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config({ path: "C:\\api-paperless-apg\\src\\.env" });
const QRCode = require("qrcode")
const whatsappAutoAlert = require("../models/whatsappAutoAlert.js");
const { whatsapp } = require("../middlewares/whatsapp.js");
const User = require('../models/User.js');

const loginWhatsapp = (req, res, next) => {
    // const { Client, RemoteAuth } = require('whatsapp-web.js');
    // const { MongoStore } = require('wwebjs-mongo');
    // const mongoose = require('mongoose');
    // let store

    // store = new MongoStore({ mongoose: mongoose })

    // const whatsapp = new Client({
    //     authStrategy: new RemoteAuth({
    //         store: store,
    //         backupSyncIntervalMs: 300000
    //     })
    // });

    // const whatsapp = new Client({
    //     authStrategy: new LocalAuth()
    // });

    whatsapp.on('qr', (qr) => {
        // Generate and scan this code with your phone
        console.log('QR RECEIVED', qr);

        QRCode.toDataURL(qr)
            .then(url => {
                console.log(url)
                res
                    .status(200)
                    .json({ status: "200", message: "Whatsapp qr generated", body: url });
            })
            .catch(err => {
                console.error(err)
                res
                    .status(200)
                    .json({ status: "200", message: "Whatsapp qr error", body: err });
            })
    });

    whatsapp.on('ready', () => {
        console.log('Client is ready!');
    });

    // whatsapp.on('autheticated', () => {
    //     console.log('Client is Autheticated');
    // });

    // whatsapp.on('remote_session_saved', () => {
    //     console.log("Sesion guardada")
    // });

    whatsapp.on('loading_screen', (percent, message) => {
        console.log('LOADING SCREEN', percent, message);
    });

    whatsapp.initialize()
}

const getSessionWhatsapp = (id) => {
    console.log("Sesion")

    const { Client, LocalAuth, RemoteAuth } = require('whatsapp-web.js');
    const { MongoStore } = require('wwebjs-mongo');
    const mongoose = require('mongoose');
    let store

    store = new MongoStore({ mongoose: mongoose })

    // const whatsapp = new Client({
    //     authStrategy: new RemoteAuth({
    //         clientId: id,
    //         store: store,
    //         backupSyncIntervalMs: 300000
    //     })
    // });

    const whatsapp = new Client({
        authStrategy: new LocalAuth({
            clientId: id
        })
    });

    console.log(whatsapp)

    whatsapp.on('ready', () => {
        console.log('Client is ready!');
    });

    whatsapp.on('autheticated', () => {
        console.log('Client is Autheticated');
    });

    whatsapp.on('loading_screen', (percent, message) => {
        console.log('LOADING SCREEN', percent, message);
    });



    whatsapp.initialize();
}


//Crear nuevo rol//////////////////////////////////////////////////////////////////////////////////////////////////////////
const sendMessage = async (req, res) => {

    const whatsappAutoAlertData = await whatsappAutoAlert.find();

    // console.log(whatsappAutoAlertData[0].message)
    // console.log(whatsappAutoAlertData[0].receivers)

    const date = new Date();
    const diaActual = date.getDay()
    const horaActual = date.getHours()

    //const celulares = ['+5214191280540', '+5214191364747']
    //const message = "*Mensaje autogenerado* \nMensaje de prueba"
    const celulares = whatsappAutoAlertData[0].receivers
    const message = whatsappAutoAlertData[0].message + "\n\n*MENSAJE GENERADO AUTOMATICAMENTE*\n*NO RESPONDER*"

    if (whatsappAutoAlertData[0].alertStatus === "Active") {
        for (let i = 0; i < celulares.length; i++) {
            const chatId = celulares[i].substring(1) + '@c.us';
            const number_details = await whatsapp.getNumberId(chatId);

            if (number_details) {
                await whatsapp.sendMessage(chatId, message);
                console.log("Mensaje enviado")
            } else {
                console.log("Mensaje no enviado")
            }
        }
        console.log("Envio de mensajes terminado")
    }else{
        console.log("Auto alert disabled")
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////
const logoutWhatsapp = async (req, res) => {
    whatsapp.logout()

    res
        .status(200)
        .json({ status: "200", message: "Whatsapp sesion end", body: "" });
};

//////////////////////////////////////////////////////////////////////////////////////////////
const autoSendMessage = async (req, res) => {
    const whatsappAutoAlertData = await whatsappAutoAlert.find();

    console.log(whatsappAutoAlertData[0].message)
    console.log(whatsappAutoAlertData[0].receivers)

    // const celulares = ['+5214191280540', '+5214191364747']
    //const message = "*Mensaje autogenerado* \nMensaje de prueba"
    const date = new Date();
    const diaActual = date.getDay()
    const horaActual = date.getHours()
    const celulares = whatsappAutoAlertData[0].receivers
    const message = whatsappAutoAlertData[0].message + "\n\n*MENSAJE GENERADO AUTOMATICAMENTE*\n*NO RESPONDER*"
    const days = whatsappAutoAlertData[0].notificationDays
    const hours = whatsappAutoAlertData[0].timeAlert

    if (whatsappAutoAlertData[0].alertStatus === "Active") {
        for (let i = 0; i < days.length; i++) {
            if (diaActual === days[i]) {
                for (let j = 0; j < hours.length; j++) {
                    if (horaActual === hours[j]) {
                        for (let c = 0; c < celulares.length; c++) {
                            const chatId = celulares[c].substring(1) + '@c.us';
                            const number_details = await whatsapp.getNumberId(chatId);

                            if (number_details) {
                                await whatsapp.sendMessage(chatId, message);
                                console.log("Mensaje enviado")
                            } else {
                                console.log("Mensaje no enviado")
                            }
                        }
                    }
                }
            }
            console.log("Envio de mensajes terminado")
        }
    }
};

// Forms that are shown in the Dashboard//////////////////////////////////////////////////////////////////////////////////////////
const createAutoAlertData = async (req, res) => {
    const { message, receivers } = req.body;

    const newAutoAlertData = new whatsappAutoAlert({ message, receivers });

    const autoAlertDataSaved = await newAutoAlertData.save();

    res.status(201).json(autoAlertDataSaved);
};

const getAutoAlertData = async (req, res) => {
    const Alerts = await whatsappAutoAlert.find().populate({ path: 'createdBy', populate: { path: "employee", model: "Employees" } });
    res.json({ status: "200", message: "Alerts Loaded", body: Alerts });
};

const updateAutoAlertData = async (req, res) => {
    const { alertId } = req.params;
    const UpdAlert = [];
    console.log(req.body)

    UpdAlert.modifiedDate = req.body.modifiedDate;
    UpdAlert.alertStatus = req.body.alertStatus;
    UpdAlert.message = req.body.message;
    UpdAlert.receivers = req.body.receivers;
    UpdAlert.notificationDays = req.body.notificationDays;
    UpdAlert.timeAlert = req.body.timeAlert;
    let newCreatedBy = req.body.createdBy;

    if (newCreatedBy) {
        const foundUser = await User.find({
            username: { $in: newCreatedBy },
        });
        UpdAlert.createdBy = foundUser.map((user) => user._id);
    }

    const {
        createdBy,
        modifiedDate,
        alertStatus,
        message,
        receivers,
        notificationDays,
        timeAlert
    } = UpdAlert;

    const updatedAlert = await whatsappAutoAlert.updateOne(
        { _id: alertId },
        {
            $set: {
                createdBy,
                modifiedDate,
                alertStatus,
                message,
                receivers,
                notificationDays,
                timeAlert
            },
        }
    );

    console.log(updatedAlert)

    if (!updatedAlert) {
        res
            .status(403)
            .json({ status: "403", message: "Alert not Updated", body: "" });
    }
    res.status(200).json({
        status: "200",
        message: "Alert Updated",
        body: updatedAlert,
    });
};

module.exports = {
    sendMessage,
    loginWhatsapp,
    logoutWhatsapp,
    autoSendMessage,
    createAutoAlertData,
    getSessionWhatsapp,
    getAutoAlertData,
    updateAutoAlertData
};