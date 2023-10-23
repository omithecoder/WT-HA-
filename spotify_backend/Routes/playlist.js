const express = require("express");
const passport = require("passport");
const router = express.Router();
const Playlist = require("../Models/Playlist");
const User = require("../Models/User_Model");
const Song = require("../Models/Song");

// Route1 : create a Playlist

router.post(
	"/create",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		const currentUser = req.user;
		const { name, thumbnail, songs } = req.body;
		if (!name || !thumbnail || !songs) {
			return res.status(301).json({ err: "Insufficient Data" });
		}
		const playlistData = {
			name,
			thumbnail,
			songs,
			owner: currentUser._id,
			collaborators: [],
		};
		const playlist = await Playlist.create(playlistData);
		return res.status(200).json(playlist);
	}
);

// now we are making route to get playlist by it's ID
// We will get the playlist ID as a route parameter and we will return the playlist that id

// Here we use ":" in the route semicolone have specific meaning that the playlistId after that semicolon will be any dam thing but still the user can hit that API
// if we donot give that semicolon then we know the path or routes must exists but here route name after get continuously changing so it not hit to required api or route
// so By using semicolon
// /playlist/get/"any thing " --> still it hit the required api

router.get(
	"/get/playlist/:playlistId",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		const playlistId = req.params.playlistId;
		// req.params is use to take input in get request since we know we cannot use req.body in get request instead of that we use req.params
		const playlist = await Playlist.findOne({ _id: playlistId }).populate({
			path: "song",
			populate: {
				path: "artist",
			},
		});
		// console.log(playlist);
		if (playlist == null) {
			return res.status(301).json({ err: "Invalide ID" });
		}

		return res.status(200).json(playlist);
	}
);

// get all the playlist of me (logged in user)
router.get(
	"/get/me",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		// const artistId = req.params.artistId;
		// // error occurs when artist with given Id not exist or a no playlist is created by a specific artist with that artistID
		// const artist = await User.findOne({_id: artistId});
		// 	return res.status(304).json({err: "Invalide Artist ID"});
		// }
		const artistId = req.user._id;

		const playlists = await Playlist.find({ owner: artistId }).populate(
			"owner"
		);
		return res.status(200).json({ data: playlists });
	}
);

//get a playlist by artist name

router.get(
	"/get/artist/:artistId",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		// const artistId = req.params.artistId;
		// // error occurs when artist with given Id not exist or a no playlist is created by a specific artist with that artistID
		// const artist = await User.findOne({_id: artistId});
		// 	return res.status(304).json({err: "Invalide Artist ID"});
		// }
		const artistId = req.params.artistId;
		const artist = await User.findOne({ _id: artistId });
		if (!artist) {
			return res.status(301).json({ err: "Artist does not exixt" });
		}

		const playlists = await Playlist.findOne({ owner: artistId });
		return res.status(200).json({ data: playlists });
	}
);

// Add a song into playlist

router.post(
	"/add/song",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		const currentUser = req.user;
		const { playlistId, songId } = req.body;
		// step 0 : first check the required playlist is exist or not
		const playlist = await Playlist.findOne({ _id: playlistId });
		if (!playlist) {
			return res.status(304).json({ err: "The Playlist does not exist" });
		}
		// step 1:Check current user own's playlist or it is the collaborator
		if (
			!playlist.owner.equals(currentUser._id) &&
			!playlist.collaborators.includes(currentUser._id)
		) {
			return res
				.status(400)
				.json({ err: "Artist is not Owner as well as Collaborator" });
		}

		// step 2: Check if the song is a valid song
		const song = await Song.findOne({ _id: songId });
		if (!song) {
			return res.status(304).json({ err: "Song does not exist" });
		}

		// Step 3:we can now simply add the song to the playlist
		playlist.song.push(songId);
		await playlist.save();

		return res.status(200).json(playlist);
	}
);
module.exports = router;
