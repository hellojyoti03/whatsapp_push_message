const responceLib = require("../libs/responseLib");
const mongoose = require("mongoose");

const Users = mongoose.model("Users");
const axios = require('axios');

var qs = require('qs');
const createUserDoc = (req, res) => {
	console.log('')
	return new Promise((resolve, reject) => {

		 new Users({
			phone_no: req.body.phone_no,
			type: 'whatsapp',
			iso_code: req.body.iso_code,
			calling_code: req.body.calling_code,
			name: req.body.name,
			email: req.body.email,
			password: '',
			language: 'en',
			role: 'user',
			
		}).save().then(()=>{
			resolve()
		}).catch((error) => {
			console.error("Error creating user:", error);
			reject(error);
		});
	});
};

const userRegister = async (req, res) => {
  try {
    
/*
- name
- email
- phone_no
- type
- iso_code
- calling_code
- image 
- question 1
- question 2
- question 3

*/
    


console.log(req.body, "POST USER REGISTER", req.file)
	await createUserDoc(req)
	const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
	// const data = {
		// 	from: '14157386102',
		// 	to: req.body.calling_code.replace('+','') + req.body.phone_no ,
		// 	message_type: 'text',
		// 	text: req.body?.message || 'hello',
		// 	channel: 'whatsapp'
		// };

		// const responce = await axios.post(process.env.SANDBOX_URL, data, {
		// 	auth: {
		// 		username: process.env.SANDBOX_USERNAME,
		// 		password: process.env.SANDBOX_PASSWORD
		// 	},
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		'Accept': 'application/json'
		// 	}
		// })
    
		

		
		// await createUserDoc(req, res);



		var data = qs.stringify({
			"token": "va235sj80rpwp992",
			"to": req.body.phone_no,
			"image":fileUrl,
			"caption": req.body.caption
		});
		
		var config = {
		  method: 'post',
		  url: 'https://api.ultramsg.com/instance95293/messages/image',
		  headers: {  
			'Content-Type': 'application/x-www-form-urlencoded'
		  },
		  data : data
		};
		
		axios(config)
		.then(function (response) {
		  console.log(JSON.stringify(response.data));
		  const apiResponse = responceLib.Generate(
			false,
			"User registered successfully",
			response.data
		);
		res.status(200).send(apiResponse);
		})
		.catch(function (error) {
		  console.log(error);
		  throw new Error(error)
		});
		
	} catch (error) {
		console.log("User registration failed:", error?.message);
		const message = error.message || "User registration failed";
		const apiResponse = responceLib.Generate(true, message, null);
		res.status(400).send(apiResponse);
	}
};



module.exports = {
	userRegister: userRegister,
};
