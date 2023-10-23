const mongoose = require("mongoose");
// importing the mongoose
// User model means what are different type of data fields we want to store in data base like name , surname , mobile no, email , etc....
// How to create Models
//1) Import Mongoose
//2) Create Mongoose Schema (structure of any user)
//3) Create a model

const user = new mongoose.Schema({
    // This are the following fields we want to store about any user
	firstName: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
		private: true,
	},
	lastName: {
		type: String,
		required: false,
	},
	email: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	LikedSong: {
		// We will change this to array letter
		type: String,
		default: "",
	},
	LikedPlaylist: {
		// We will change this to array letter
		type: String,
		default: "",
	},
	SubscribedArtist: {
		// We will change this to array letter
		type: String,
		default: "",
	},
});
// Now we create a model using model function model("Model-Name", "Schema-Name")
module.exports = mongoose.model('User', user)
// const UserModel = mongoose.model("User", "user");
// module.exports = UserModel;
