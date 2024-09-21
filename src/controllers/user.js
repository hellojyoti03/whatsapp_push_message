const responceLib = require("../libs/responseLib");
const mongoose = require("mongoose");

const Users = mongoose.model("Users");
const axios = require('axios');


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
    


console.log(req.body, "POST USER REGISTER")
	await createUserDoc(req)
		const data = {
			from: '14157386102',
			to: req.body.calling_code.replace('+','') + req.body.phone_no ,
			message_type: 'text',
			text: req.body?.message || 'hello',
			channel: 'whatsapp'
		};

		const responce = await axios.post(process.env.SANDBOX_URL, data, {
			auth: {
				username: process.env.SANDBOX_USERNAME,
				password: process.env.SANDBOX_PASSWORD
			},
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		})
    
		

		
		// await createUserDoc(req, res);

		const apiResponse = responceLib.Generate(
			false,
			"User registered successfully",
			responce.data
		);
		res.status(200).send(apiResponse);
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
