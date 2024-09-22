// @ts-nocheck
/**
 * @file_purpose  Start Server From This File
 * @author Jyoti Prakash
 * @Date_Created
 * @Date_Modified
 **/


const path = require('path'); // Ensure this line is included

const dotenv = require("dotenv");
const multer = require('multer');

dotenv.config();
// if (config.error) {
// 	console.log("ERROR", config.error)
// 	throw config.error;
// }
const express = require("express");


const {
	globalRouteMiddleware,
	globalErrorMiddleware,
} = require("./src/middleware/appErrorHandler");
const appConfig = require("./config/appConfig");
const routerLogger = require("./src/middleware/routeLogger");
const fs = require("fs");
const database = require("./www/db/db");
const app = express();

app.use(express.json());
app.use(routerLogger.logIp);
app.use(express.static('uploads'));
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, 'uploads/'); // Specify the folder to save uploaded files
	},
	filename: (req, file, cb) => {
	  cb(null, Date.now() + path.extname(file.originalname)); // Use a timestamp for the file name
	},
  });




app.all(appConfig.allowedCorsOrigin, (req, res, next) => {
	res.header("Access-Control-Allow-Origin", appConfig.allowedCorsOrigin);
	res.header(
		"Access-Control-Allow-Headers",
		"Accept-Encoding, Connection,Origin, X-Requested-With, Content-Type, Accept,Authorization"
	);
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS,PATCH");
	next();
});
const upload = multer({ storage: storage });


// Middleware to serve static files

//NOTE - Dynamically Model Load
const schemaPath = "./src/model";
fs.readdirSync(schemaPath).forEach((file) => {
	if (~file.indexOf(".js")) require(schemaPath + "/" + file);
});
//NOTE - Dynamically Route Load
const routes = "./src/routes";
fs.readdirSync(routes).forEach((file) => {
	if (~file.indexOf(".js")) {
		const routePath = require(routes + "/" + file);
		routePath.setRouter(app);
	}
});

app.post('/upload', upload.single('image'), (req, res) => {
	if (!req.file) {
	  return res.status(400).send('No file uploaded.');
	}

	// Construct the URL for the uploaded file
	const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
	console.log('h')
	res.json({ message: 'File uploaded successfully', fileUrl });
  });
  

app.use(globalErrorMiddleware);
app.use(globalRouteMiddleware);


database.startDB(app);
