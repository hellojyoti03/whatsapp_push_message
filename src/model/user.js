// @ts-nocheck
/**
 * @file_purpose  user document Filed
 * @author Jyoti Prakash
 * @Date_Created
 * @Date_Modified
 * @Updated_log
 */

const { Schema, model } = require("mongoose");

const userSchema = new Schema(
	{
		phone_no: { type: String },
  type: {
    type: String,
    enum: ['whatsapp', 'ideal']
  },
  iso_code: {
    type: String,
  },
  calling_code: {
    type: String,
  },

		name: { type: String },

		email: { type: String },
		password: { type: String },
		language: { type: String },
		profile_picture: { type: String },

		role: {
			type: String,
			enum: ["admin", "user"],
			required: true,
		}
	},
	{
		timestamps: true,
	}
);


userSchema.index({ full_name: "text" });
model("Users", userSchema);
