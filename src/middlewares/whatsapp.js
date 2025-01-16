//Sesión Local////////////////////////////////////////////////////////
const { Client, NoAuth } = require('whatsapp-web.js');

const whatsapp = new Client({
    authStrategy: new NoAuth(),
    puppeteer: { headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']}
});

whatsapp.on('loading_screen', (percent, message) => {
   // console.log('LOADING SCREEN', percent, message);
});


 module.exports = { whatsapp };

// whatsapp.on('ready', () => {
//     console.log('Whatsapp Client is ready!');
// });


//Autenticacion con s3

// const { Client, RemoteAuth } = require('whatsapp-web.js');
// const dotenv = require('dotenv')
// dotenv.config({ path: "C:\\api-paperless-apg\\src\\.env" });

// const { AwsS3Store } = require('wwebjs-aws-s3');
// const {
//     S3Client,
//     PutObjectCommand,
//     HeadObjectCommand,
//     GetObjectCommand,
//     DeleteObjectCommand
// } = require('@aws-sdk/client-s3');

// const s3 = new S3Client({
//     region: process.env.S3_BUCKET_REGION,
//     credentials: {
//         accessKeyId: process.env.S3_ACCESS_KEY,
//         secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
//     }
// });

// const putObjectCommand = PutObjectCommand;
// const headObjectCommand = HeadObjectCommand;
// const getObjectCommand = GetObjectCommand;
// const deleteObjectCommand = DeleteObjectCommand;

// const store = new AwsS3Store({
//     bucketName: process.env.S3_BUCKET_NAME,
//     remoteDataPath: 'WhatsappSession/',
//     s3Client: s3,
//     putObjectCommand,
//     headObjectCommand,
//     getObjectCommand,
//     deleteObjectCommand
// });

// const whatsapp = new Client({
//     authStrategy: new RemoteAuth({
//         clientId: 'SessionPaperless',
//         dataPath: './.wwebjs_auth',
//         store: store,
//         backupSyncIntervalMs: 600000
//     })
// });

// //await store.sessionExists({session: 'SessionPaperless'});

// whatsapp.on('remote_session_saved', () => {
//     console.log("Sesion guardada en aws")
// });

// whatsapp.on('ready', () => {
//     console.log('Whatsapp Client is ready!');
// });

// whatsapp.on('loading_screen', (percent, message) => {
//     console.log('LOADING SCREEN', percent, message);
// });

//Autenticacion con Mongo //////////
// const { Client, RemoteAuth } = require('whatsapp-web.js');
// const dotenv = require('dotenv')
// dotenv.config({ path: "C:\\api-paperless-apg\\src\\.env" });

// // Require database
// const { MongoStore } = require('wwebjs-mongo');
// const mongoose = require('mongoose');

// // Load the session data



// mongoose.connect(process.env.MONGODB_WHATSAPP_URL).then(() => {

//     console.log("store")
// });

// const store = new MongoStore({ mongoose: mongoose });
// const whatsapp = new Client({
//     authStrategy: new RemoteAuth({
//         store: store,
//         backupSyncIntervalMs: 300000
//     })
// });

// whatsapp.on('ready', () => {
//     console.log('Whatsapp Client is ready!');
// });

// whatsapp.on('loading_screen', (percent, message) => {
//     console.log('LOADING SCREEN', percent, message);
// });

// whatsapp.on('remote_session_saved', () => {
//     console.log("Sesion guardada en aws")
// });

// whatsapp.initialize();


// module.exports = { whatsapp };


// const { Client, RemoteAuth } = require('whatsapp-web.js');
// const { MongoStore } = require('wwebjs-mongo');
// const mongoose = require('mongoose');
// let storeW

// storeW = new MongoStore({ mongoose: mongoose })
// let whatsapp;
// console.log(storeW.db)

// if (storeW.db) {
//     console.log("si")

//     whatsapp = new Client({
//         puppeteer: {
//             headless: false
//         },
//         authStrategy: new RemoteAuth({
//             clientId: 'SessionPaperless',
//             store: storeW,
//             backupSyncIntervalMs: 300000
//         })
//     });

//     whatsapp.on('remote_session_saved', () => {
//         console.log("Sesion guardada en aws")
//     });

//     whatsapp.on('autheticated', () => {
//         console.log('Client is Autheticated');
//     });

//     whatsapp.on('loading_screen', (percent, message) => {
//         console.log('LOADING SCREEN', percent, message);
//     });

//     whatsapp.on('ready', () => {
//         console.log('Client is ready!');
//     });

//     whatsapp.initialize()
// }


