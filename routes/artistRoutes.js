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

route.put('/updateSong',jwtAuthMiddleware,async (req, res) => {
    const userId=req.user.id;
    const user=await User.findById(userId);
    if (user.role==='listener') {
        return res.status(403).json({error:"You are not authorized to update a song" });
    }
    try{
        const {currentname,newname}=req.body;
        if(!currentname||!newname){
            return res.status(400).json({error:'Both currentname and newname are required'});
        }
        const song=await Song.findOne({songName:currentname});
        if(!song){
            return res.status(404).json({error:'Song not found'});
        }
        song.songName=newname;
        await song.save();
        res.status(200).json({message:"Song updated"});
    } catch (err) {
        console.error("Error updating song:", err);
        res.status(500).json({error:"Internal server error"});
    }
});

route.delete('/deleteSong',jwtAuthMiddleware,async (req, res) => {
    const userId=req.user.id;
    const user=await User.findById(userId);
    if(user.role==='listener'){
        return res.status(403).json({error:"You are not authorized to delete a song"});
    }
    try{
        const {songName}=req.body;
        if(!songName){
            return res.status(400).json({error:'songName is required'});
        }
        const song = await Song.findOne({ name: songName });

        if(!song){
            return res.status(404).json({error:'Song not found'});
        }
        await Song.deleteOne({ _id: song._id });
        res.status(200).json({message:"Song deleted"});
    }catch(err){
        console.error("Error deleting song:",err);
        res.status(500).json({error:"Internal server error"});
    }
});

module.exports = route;

