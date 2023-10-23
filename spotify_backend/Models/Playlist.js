const mongoose = require("mongoose");
// importing the mongoose
// User model means what are different type of data fields we want to store in data base like name , surname , mobile no, email , etc....
// How to create Models
//1) Import Mongoose
//2) Create Mongoose Schema (structure of any song)
//3) Create a model

const playlist = new mongoose.Schema({
    // This are the following fields we want to store about any song
	name:
    {
        type :String,
        required:true,
    },
    thumbnail:
    {
        type:String,
        required:true
    },

    // here also we take owner data form "user" model
    owner:
    {
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true,
    },
    // As playlist contain list of song which data is taken from "song" Model
    song:[
    {
        type:mongoose.Types.ObjectId,
        ref:"Song",
        required:true
    }],

    //As collaborators of the playlist can be user so we donot make a different model for that we take data or objectID from "user" Model
    collaborators:[
        {
            type:mongoose.Types.ObjectId,
            ref:"User"
        }
    ]


    
});
// Now we create a model using model function model("Model-Name", "Schema-Name")
// const PlaylistModel = mongoose.model("Playlist", "playlist");
// module.exports = PlaylistModel;
module.exports = mongoose.model("Playlist", playlist);
