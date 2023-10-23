const express = require("express");
const passport = require("passport");
const router = express.Router();
const Song = require("../Models/Song");
const User = require("../Models/User_Model");


router.post("/create",passport.authenticate("jwt", {session: false}), async (req,res)=>
//here session is false it means our website always check about authentication not takes the authentication one time remember the user it means it delete the session as soon as the user get out from that page 
{
    // before hiting the create song it first check that user authentication is done or not this field is mostly use to check some conditions which are important to check before runing the main function


    // this takes all required fields you write in Song model to create a song in database 
    const{name,thumbnail,track} = req.body;
    // if one of above field is missing then print the error
    if(!name || !thumbnail || !track)
    {
        return res.status(301).json({err:"Insufficient Details to Create a Song "});
    } 
    // we take artist data from User model which is authentication route it directly taken since before opening this route first authentication happens 
    const artist = req.user._id;
    const songDetails = {name,thumbnail,track,artist};
    // new song is created in the database
    const createdSong = await Song.create(songDetails);
    // returning the json file of created song 
    return res.status(200).json(createdSong);


});

//Now making the get all song route which user have published

router.get("/get/mysongs", passport.authenticate("jwt", {session: false}),async (req,res)=>
{
    // const currentUser= req.user;
    const songs = await Song.find({artist:req.user._id}).populate("artist");
    // searching the song of artist 
    return res.status(200).json({data:songs});

}
);


// get all songs published by a particular artist 
// User Search any of the artist name and he/she got all the songs which are published by that artist

router.get("/get/artist/:artistId",passport.authenticate("jwt",{session:false}), async(req,res)=>
{
    const artistId =req.params.artistId;
    const artist =await User.findOne({_id: artistId});
    if(!artist)
    {
        return res.status(301).json({err:"Artist does not exixt"});
    }
    const songs = await Song.find({artist:artistId});
    return res.status(200).json({data:songs});
});





//get song by the name 
router.get("/get/songname/:songName",passport.authenticate("jwt",{session:false}), async (req,res)=>
{
    const songName =req.params.songName;
    const songs =await Song.find({name:songName}).populate("artist");
    return res.status(200).json({data:songs});
});


module.exports = router;



// const express = require("express");
// const passport = require("passport");
// const router = express.Router();
// const Song = require("../Models/Song");


// Passport configuration for JWT strategy (assuming you've set it up properly)
// const JwtStrategy = require("passport-jwt").Strategy;
// const ExtractJwt = require("passport-jwt").ExtractJwt;
// const opts = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: "your_jwt_secret", // Replace this with your actual JWT secret
// };
// passport.use(new JwtStrategy(opts, (payload, done) => {
//   // Implement user lookup logic here (fetch user by ID from your database)
//   // Example: User.findById(payload.userId, (err, user) => {
//   //   if (err) return done(err, false);
//   //   if (user) return done(null, user);
//   //   return done(null, false);
//   // });
// }));

// Middleware for authenticating the user using Passport
// const authenticateUser = passport.authenticate("jwt", { session: false });

// router.post("/create", authenticateUser, async (req, res) => {
//   // The user is already authenticated if this route handler is reached
//   const { name, thumbnail, track } = req.body;
//   if (!name || !thumbnail || !track) {
//     return res.status(400).json({ err: "Insufficient Details to Create a Song" });
//   }

//   const artist = req.user._id; // Assuming the authenticated user ID is set in req.user._id
//   const songDetails = { name, thumbnail, track, artist };

//   try {
//     // Create the song in the database
//     const createdSong = await Song.create(songDetails);
//     return res.status(201).json(createdSong); // Use 201 for resource created
//   } catch (error) {
//     return res.status(500).json({ err: "Failed to create the song" });
//   }
// });

// router.get("/get/mysongs", authenticateUser, async (req, res) => {
//   // Fetch all songs belonging to the authenticated artist (user)
//   try {
//     const songs = await Song.find({ artist: req.user._id });
//     return res.status(200).json({ data: songs });
//   } catch (error) {
//     return res.status(500).json({ err: "Failed to fetch songs" });
//   }
// });

// module.exports = router;
