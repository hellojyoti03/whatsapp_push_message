const responceLib = require("../libs/responseLib");

const passwordLib = require("../libs/passwordLib");
const mongoose = require("mongoose");
const tokenLib = require("../libs/tokenLib");
const Users = mongoose.model("Users");



const generateLoginToken = async (user) => {
	if (user && user instanceof Users) {
		let currentUser = user.toObject();
	
		delete currentUser?.password;
		delete user?.phone_id;
		delete currentUser.createdAt;
		delete currentUser.updatedAt;
		delete currentUser.__v;
		return await tokenLib.Generate(currentUser);
	} else {
	
		delete user?.phone_id;
		
		delete user?.password;
		
		delete user?.createdAt;
		delete user?.updatedAt;
		delete user?.__v;
		return await tokenLib.Generate(user);
	}
};
const createUserDoc = (req, res) => {
	return new Promise((resolve, reject) => {
		passwordLib
			.Hash(req.body.password)
			.then((hashedPassword) => {
				const newUser = new Users({
					email: req.body.email,
					password: hashedPassword,
					role: "admin",
				});

				return newUser.save();
			})
			.then(() => {
				resolve();
			})
			.catch((error) => {
				console.error("Error creating user:", error);
				reject(error);
			});
	});
};

const adminRegister = async (req, res) => {
	try {
		const existingEmail = await Users.findOne({
			email: req.body.email,
		}).exec();
console.log(existingEmail)
		if (existingEmail) {
			throw new Error("Email Already Registered");
		}

		
		await createUserDoc(req, res);

		const apiResponse = responceLib.Generate(
			false,
			"User registered successfully",
			{}
		);
		res.status(200).send(apiResponse);
	} catch (error) {
		console.log("User registration failed:", error);
		const message = error.message || "User registration failed";
		const apiResponse = responceLib.Generate(true, message, null);
		res.status(400).send(apiResponse);
	}
};

const adminLogin = async (req, res) => {
	try {


		const existingUser = await Users.findOne({ email: req.body.email }).lean();

		if (!existingUser) {
			throw new Error("User Not Found, Please Register !!");
		}
console.log(existingUser)
		let passwordVerify = await passwordLib.Verify(
			req.body.password,
			existingUser.password
		);
		if (!passwordVerify) {
			throw new Error("Invalid Password");
		}

		let token = await generateLoginToken(existingUser);

		const apiResponse = responceLib.Generate(false, "Sign in Successfully", token);
		res.status(200);
		res.send(apiResponse);
	} catch (e) {
		const message = e?.message || "admin signin failed";
		const apiResponse = responceLib.Generate(true, message, null);
		res.status(400);
		res.send(apiResponse);
	}
};
const getUsers = async (req, res) => {
	try {
	  const { limit = 10, page = 1, name = '' } = req.query;
  

	  // Convert limit and page to numbers (they are strings by default)
	  const limitNum = parseInt(limit);
	  const pageNum = parseInt(page);
  
	  // Build the search condition for the name field
	  const searchCondition = name
		? { name: { $regex: name, $options: 'i' } , role: 'user'} // 'i' for case-insensitive search
		: {role: 'user'};
  console.log(searchCondition)
	  // Fetch paginated data with optional search from the database
	  const users = await Users.find(searchCondition)
		.skip((pageNum - 1) * limitNum) // Skip records for previous pages
		.limit(limitNum); // Limit the number of records fetched per page
  
	  // Get the total count of users matching the search condition
	  const totalUsers = await Users.countDocuments(searchCondition);
  
	  // Prepare the response
	  const apiResponse = responceLib.Generate(false, 'Users fetched successfully', {
		users,
		page: pageNum,
		limit: limitNum,
		totalPages: Math.ceil(totalUsers / limitNum),
		totalUsers,
	  });
  
	  res.status(200);
	  res.send(apiResponse);
	} catch (e) {
	  const message = e?.message || 'Unable to fetch users';
	  const apiResponse = responceLib.Generate(true, message, null);
	  res.status(400);
	  res.send(apiResponse);
	}
  };
  
// const userEditProfile = async (req, res) => {
// 	try {
// 		let _newPhoneDoc;
// 		console.log(req._user._id, "current log in user");
// 		const existingUser = await Users.findOne({
// 			_id: req._user._id,
// 		});

// 		if (!existingUser) {
// 			throw new Error("User Not Found !!");
// 		}
// 		const existingPhone = await Phone.findOne({
// 			phone_no: req.body.phone_no,
// 			iso_code: req.body.iso_code,
// 		});

// 		if (existingPhone) {
// 			existingPhone.phone_no = req.body.phone_no;
// 			existingPhone.iso_code = req.body.iso_code;
// 			existingPhone.calling_code = req.body.calling_code;
// 			await existingPhone.save();
// 		} else {
// 			_newPhoneDoc = await new Phone({
// 				phone_no: req.body.phone_no,
// 				type: req.body?.type || "home",
// 				iso_code: req.body?.iso_code,
// 				calling_code: req.body?.calling_code,
// 			}).save();
// 		}

// 		existingUser.username = req.body.user_name;
// 		existingUser.email = req.body.email;
// 		existingUser.iso_code = req.body.iso_code;
// 		existingUser.calling_code = req.body.calling_code;
// 		existingUser.gender = req.body.gender;
// 		await existingUser.save();

// 		const apiResponse = responceLib.Generate(false, "User Profile Updated !!", {});
// 		res.status(200).send(apiResponse);
// 	} catch (error) {
// 		console.log("User Edit Profile failed:", error);
// 		const message = error.message || "User Edit Profile failed";
// 		const apiResponse = responceLib.Generate(true, message, null);
// 		res.status(400).send(apiResponse);
// 	}
// };
// const updateUserKey = async (req, res) => {
// 	try {
// 		const existingUser = await Users.findOne({
// 			_id: req._user._id,
// 		});

// 		if (!existingUser) {
// 			throw new Error("User Not Found !!");
// 		}

// 		if (req.body.ip) {
// 			existingUser.ip = req.body.ip;
// 		}

// 		if (req.body.phone_no && req.body.iso_code && req.body.calling_code) {
// 			let existingPhone = await Phone.findOne({
// 				phone_no: req.body.phone_no,
// 				iso_code: req.body.iso_code,
// 			});

// 			if (existingPhone) {
// 				existingPhone.phone_no = req.body.phone_no;
// 				existingPhone.iso_code = req.body.iso_code;
// 				existingPhone.calling_code = req.body.calling_code;
// 				await existingPhone.save();
// 			} else {
// 				// Create new Phone document
// 				existingPhone = await new Phone({
// 					phone_no: req.body.phone_no,
// 					iso_code: req.body.iso_code,
// 					calling_code: req.body.calling_code,
// 				}).save();
// 			}

// 			// Assign phone_id to existingUser
// 			existingUser.phone_id = existingPhone._id;
// 		}

// 		if (req.body.full_name) {
// 			existingUser.full_name = req.body.full_name;
// 		}
// 		if (req.body.fast_name) {
// 			existingUser.fast_name = req.body.fast_name;
// 		}
// 		if (req.body.last_name) {
// 			existingUser.last_name = req.body.last_name;
// 		}
// 		if (req.body.middle_name) {
// 			existingUser.middle_name = req.body.middle_name;
// 		}
// 		if (req.body.user_name) {
// 			existingUser.user_name = req.body.user_name;
// 		}
// 		if (req.body.email) {
// 			existingUser.email = req.body.email;
// 		}

// 		if (req.body.currency_code) {
// 			existingUser.currency_code = req.body.currency_code;
// 		}
// 		// if (req.body.country_flag) {
// 		// 		existingUser.country_flag = req.body.country_flag;
// 		// }
// 		if (req.body.language) {
// 			existingUser.language = req.body.language;
// 		}
// 		// if (req.body.profile_picture) {
// 		// 		existingUser.profile_picture = req.body.profile_picture;
// 		// }
// 		if (req.body.gender) {
// 			existingUser.gender = req.body.gender;
// 		}
// 		// if (req.body.sign_in_mode) {
// 		// 		existingUser.sign_in_mode = req.body.sign_in_mode;
// 		// }
// 		if (req.body.location) {
// 			existingUser.location = req.body.location;
// 		}

// 		await existingUser.save();

// 		const apiResponse = responceLib.Generate(false, "User Profile Updated !!", {});
// 		res.status(200).send(apiResponse);
// 	} catch (error) {
// 		console.log("User Edit Profile failed:", error);
// 		const message = error.message || "User Edit Profile failed";
// 		const apiResponse = responceLib.Generate(true, message, null);
// 		res.status(400).send(apiResponse);
// 	}
// };

// const getCurrentUserProfile = async (req, res) => {
// 	try {
// 		const existingUser = await Users.findOne({
// 			_id: req.user_id,
// 		});

// 		if (!existingUser) {
// 			throw new Error("User Not Found !!");
// 		}

// 		if (req.body.ip) {
// 			existingUser.ip = req.body.ip;
// 		}

// 		if (req.body.phone_no && req.body.iso_code && req.body.calling_code) {
// 			let existingPhone = await Phone.findOne({
// 				phone_no: req.body.phone_no,
// 				iso_code: req.body.iso_code,
// 			});

// 			if (existingPhone) {
// 				existingPhone.phone_no = req.body.phone_no;
// 				existingPhone.iso_code = req.body.iso_code;
// 				existingPhone.calling_code = req.body.calling_code;
// 				await existingPhone.save();
// 			} else {
// 				// Create new Phone document
// 				existingPhone = await new Phone({
// 					phone_no: req.body.phone_no,
// 					iso_code: req.body.iso_code,
// 					calling_code: req.body.calling_code,
// 				}).save();
// 			}

// 			// Assign phone_id to existingUser
// 			existingUser.phone_id = existingPhone._id;
// 		}

// 		if (req.body.full_name) {
// 			existingUser.full_name = req.body.full_name;
// 		}
// 		if (req.body.fast_name) {
// 			existingUser.fast_name = req.body.fast_name;
// 		}
// 		if (req.body.last_name) {
// 			existingUser.last_name = req.body.last_name;
// 		}
// 		if (req.body.middle_name) {
// 			existingUser.middle_name = req.body.middle_name;
// 		}
// 		if (req.body.user_name) {
// 			existingUser.user_name = req.body.user_name;
// 		}
// 		if (req.body.email) {
// 			existingUser.email = req.body.email;
// 		}

// 		if (req.body.currency_code) {
// 			existingUser.currency_code = req.body.currency_code;
// 		}
// 		// if (req.body.country_flag) {
// 		// 		existingUser.country_flag = req.body.country_flag;
// 		// }
// 		if (req.body.language) {
// 			existingUser.language = req.body.language;
// 		}
// 		// if (req.body.profile_picture) {
// 		// 		existingUser.profile_picture = req.body.profile_picture;
// 		// }
// 		if (req.body.gender) {
// 			existingUser.gender = req.body.gender;
// 		}
// 		// if (req.body.sign_in_mode) {
// 		// 		existingUser.sign_in_mode = req.body.sign_in_mode;
// 		// }
// 		if (req.body.location) {
// 			existingUser.location = req.body.location;
// 		}

// 		await existingUser.save();

// 		const apiResponse = responceLib.Generate(false, "User Profile Updated !!", {});
// 		res.status(200).send(apiResponse);
// 	} catch (error) {
// 		console.log("User Edit Profile failed:", error);
// 		const message = error.message || "User Edit Profile failed";
// 		const apiResponse = responceLib.Generate(true, message, null);
// 		res.status(400).send(apiResponse);
// 	}
// };


module.exports = {
	adminLogin: adminLogin,
	adminRegister: adminRegister,
	getUsers : getUsers
};
