// @ts-nocheck
/**
 * @file_purpose  log route
 * @author Jyoti Prakash
 * @Date_Created
 * @Date_Modified
 */

const appConfig = require("../../config/appConfig");
const multer = require('multer');
const path = require('path')
let requestIpLogger = (req, res, next) => {
	const remoteIP =  req.connection.remoteAddress + '://' + req.connection.remotePort
	 console.log(`${req.method} mathod ${req.originalUrl} Routes ${remoteIP} Remote Ip Adress`)
	
	
	if(req.method === 'OPTIONS'){
	 const headers = {}
	 headers['Access-Control-Allow-Origin'] = '*'
	 headers['Access-Control-Allow-Headers'] = 'Content-Type, Content-Length, Host, Accept-Encoding, Keep-Alive, Authorization'
	 headers['Access-Control-Allow-Credential'] = 'false'
	 headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE'
	 headers['Access-Control-Max-Age'] = '86400'

	 res.writeHead(200, headers)
	 res.end()
	}else{
	 res.setHeader('Access-Control-Allow-Origin', '*')
	 res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Host, Accept-Encoding, Keep-Alive, Authorization')
	 res.setHeader('Access-Control-Allow-Credential', 'true')
	 res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
	 next()
	}
}; 

 const storage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, 'uploads/'); // Specify the folder to save uploaded files
	},
	filename: (req, file, cb) => {
	  cb(null, Date.now() + path.extname(file.originalname)); // Use a timestamp for the file name
	},
  });

  
  const upload = multer({ storage: storage });
module.exports = {
	logIp: requestIpLogger,
	upload: upload
};

