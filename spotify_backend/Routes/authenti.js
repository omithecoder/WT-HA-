const express = require("express");
const passport = require("passport");
const router = express.Router(); //This only include the required fucntions like get() , Post() etc instead of that if we require express here then for the router we are including extra unnecessary functions like listen() etc which are not use in router

// STEP 1
// importing User Model an creating routeAPI
const User = require("../Models/User_Model");
// importing bcrpyt
const bcrypt = require("bcrypt");
// importing the getToken function from utils/helper
const {getToken} = require("../utils/helper");

// This POST route help to register the user
router.post("/register", async (req, res) => {
	// STEP 2
	// this code is run when /register API is called as a POST request  
	// My req.body will be of format {email,firstName,password,lastname,username};
	const { email, password, firstName, lastName, username } = req.body;

	// if user email is already exist
	const user = await User.findOne({ email: email });
	if (user) {
		// return the error that user already exists
		return res.status(403).json({ error: "A user emailID already Exist" });
	}

	// STEP 3
	// the request is valide let's create a new user
	// creating new user
	// here we donot store the password entered by user directly into database because of security issue so first we apply hashing on it and after hashing the password is converted to into plain long text and we store this text as password
	// while checking the password is correct or not the hashing of entered password takes place and matched with the hashed value present in database if it is matched then the password is correct
	// for this we using some hashing functions like "bcrpyt"
	const hashpass = await bcrypt.hash(password, 10); // here 10 is the sequrity level more the value more the security lesser the speed
	const newUserData = {
		email,
		password: hashpass,
		firstName,
		lastName,
		username,
	};
	const newUser = await User.create(newUserData);




    //Step 4:
    // here we create the token which this API going to return after the execution of this API if the new user is form it do not return the complete info of that new user instead of that it returns one token which represent that user

    const token = await getToken(email,newUser);

	
    // Step 5:
    // Return the result to the user 
    const userToReturn = {...newUser.toJSON(),token};
    // to avoide returning the hashed password to user we delete that password if the hashed password is reache to user it compare with the entered password and decode the hashing function this will also cause the sequirty issue
	console.log(userToReturn);
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
});

router.post("/login", async (req, res) => {
    // Step 1: Get email and password sent by user from req.body
    const {email, password} = req.body;

    // Step 2: Check if a user with the given email exists. If not, the credentials are invalid.
    const user = await User.findOne({email: email});
    if (!user) {
        return res.status(403).json({err: "Invalid credentials"});
    }

    console.log(user);

    // Step 3: If the user exists, check if the password is correct. If not, the credentials are invalid.
    // This is a tricky step. Why? Because we have stored the original password in a hashed form, which we cannot use to get back the password.
    // I cannot do : if(password === user.password)
    // bcrypt.compare enabled us to compare 1 password in plaintext(password from req.body) to a hashed password(the one in our db) securely.
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // This will be true or false.
    if (!isPasswordValid) {
        return res.status(403).json({err: "Invalid credentials"});
    }

    // Step 4: If the credentials are correct, return a token to the user.
    const token = await getToken(user.email, user);
    const userToReturn = {...user.toJSON(), token};
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
});


module.exports = router;