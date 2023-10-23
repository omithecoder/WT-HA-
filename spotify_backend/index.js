// npm init : pakage.json is created since this is node project
// npm i express : expressJS package installation 
// using express 


// CREATING API ON LOCAL HOST 

const express = require("express"); //Importing ExpressJS
// express variable have all functionality of expressJS
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

//here "app" use to call express as function 
// Checking Dotenv working or not Dotenv Due to help of that it we make .env file which use to set the value explicitly to the certain veriable which we do not want to show in our code like Password of database etc.
require('dotenv').config() // importing dotenv module
// console.log(process.env) // remove this after you've confirmed it is working
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
    // importing passport-jwt into ExtractJwt 
    // passport is the package in JS which provide us the authentication related services like userID password Login etc here it sends the data from front end -> backend in encrypted way
    // Importing Passport
    const passport = require("passport");
    const User = require("./Models/User_Model");//this require to serach user for authentication method on line 48
    // importing authentication routes js file
    const authroutes = require("./Routes/authenti");
    // importing song routes 
    const songroutes = require("./Routes/song");
    //importing playlist routes
    const playlistroutes = require("./Routes/playlist");


const port =8080;
    
app.use(cors());
app.use(express.json());


// Connecting mongodb to node app 
// mongoose.connect("URL of database",{})

mongoose.connect("mongodb+srv://omkar:omkar123@cluster0.2jrifma.mongodb.net/?retryWrites=true&w=majority", {
    
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("App Connected to Mongo!\n");
})
.catch((error) => {
    console.error("Error While Connecting to Mongo:", error);
});


    


// Setup passport-jwt
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "thisKeyIsSupposedToBeSecret";

passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        User.findOne({_id: jwt_payload.identifier})
            .then(user => {
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            })
            .catch(err => {
                return done(err, false);
            });
    })
);


// passport.use(
//     new JwtStrategy(opts, async (jwt_payload, done) => {
//       try {
//         const user = await User.findById(jwt_payload.sub);
//         if (user) {
//           return done(null, user);
//         } else {
//           return done(null, false);
//         }
//       } catch (err) {
//         return done(err, false);
//       }
//     })
//   );









// database

// const database = (module.exports = ()=> {
//     const connectionParams = {
//         userNewUrlPaser: true,
//         userUnifiedTopology: true,
//     };

//     try{
//         mongoose.connect("mongodb+srv://omkarkhanvilkar22:ULhrBEUaz25n6t9y@cluster0.2jrifma.mongodb.net/?retryWrites=true&w=majority",
//         connectionParams
//         );
//         console.log("Connection Successfull");
//     } catch(error)
//     {
//         console.log(error);
//         console.log("Database connection failed");
//     }
// });


// database();


// // API : GET type :/: return text "hello World"
app.get("/",(req,res)=> {
// as we want to make get type of API so we use app.get which contain 2 arguments 1st is character on which api get triggered or 2nd contain what data to diaplay

// req contains all data for the request
// res contains all data for the response

    res.send("Hello World!");
});

app.use("/auth",authroutes);
app.use("/song",songroutes);
app.use("/playlist",playlistroutes);

// Now we want to tell express that our server will run on localhost:8000

app.listen(port,()=>{
    console.log("App is running on port "+port);

});






