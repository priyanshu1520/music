const express = require('express');
const route = express.Router();
const User = require('./../models/user');
const { jwtAuthMiddleware } = require('./../jwt');
const Song = require('./../models/song');

route.post('/postSong', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (user.role === 'listner') {
            return res.status(403).json({ error: "You are not authorized to post a song" });
        }
        const songData = req.body;
        if (!songData.name || !songData.songName) {
            return res.status(400).json({ error: "Missing required song data" });
        }
        const newSong = new Song(songData);
        const response = await newSong.save();
        res.status(201).json(response);
    } catch (err) {
        console.error("Error posting song:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});



route.get('/getSong',jwtAuthMiddleware,async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (user.role === 'listner') {
        return res.status(403).json({ error: "You are not authorized to view a song" });
    }
    try {
        const songs = await Song.find();
        res.status(200).json(songs);
    } catch (err) {
        console.error("Error getting songs:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});



module.exports = route;

