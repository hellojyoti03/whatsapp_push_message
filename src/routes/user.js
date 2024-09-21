// @ts-nocheck
/**
 * @file_purpose  auth Routes Define Here
 * @author Jyoti Prakash
 * @Date_Created
 * @Date_Modified
 * @Updated_log sendOtp and Reset Password
 */

const appConfig = require("../../config/appConfig");
const controller = require("../controllers/admin");
const userController = require("../controllers/user");

const validator = require("../middleware/Validator");
const auth = require("../middleware/auth");

module.exports.setRouter = (app) => {
	const { apiVersion } = appConfig;
	app.post(`${apiVersion}/auth/admin/register`, validator.adminRegister, controller.adminRegister);
	app.post(`${apiVersion}/auth/admin/login`, validator.adminLogin, controller.adminLogin);
	app.post(`${apiVersion}/auth/user/register`, validator.userRegister, userController.userRegister);
	app.get(`${apiVersion}/auth/admin/get-users`,  controller.getUsers);
	// app.post(`${apiVersion}/auth/admin/get-users`, validator.userLogin, controller.userLogin);
	// app.post(`${apiVersion}/auth/admin/forget-password`, validator.forgetPassword, controller.forgetPassword)

	// app.post(`${apiVersion}/auth/user/get-current-user-profile`, controller.getCurrentUserProfile);
	// app.post(`${apiVersion}/auth/user/init-log-in`, auth.whoAmI);
	// app.post(`${apiVersion}/auth/user/edit-profile`, auth.isAuthorized, validator.userEditProfile, controller.userEditProfile);
	
	
};
