const express=require('express');
const route=express.Router();
const User=require('./../models/user')
const {jwtAuthMiddleware,generateToken}=require('./../jwt')
route.post('/signup',async(req,res)=>{
    try{
        const data=req.body
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with the same email already exists' });
        }
        const newUser=new User(data);
        const response=await newUser.save()
        console.log("data saved")
        const payload={
            id:response.id,
            username:response.username
        }
        console.log(JSON.stringify(payload))
        const token=generateToken(payload);
        console.log("Token is :", token);
        res.status(200).json({response:response,token:token})
    }catch(err){
        console.log(err)
        res.status(500).json({err:"data not saved"})
    }
  })




route.post('/login',async(req,res)=>{
    try{
        const {username,password}=req.body;
        if(!username||!password){
            return res.status(400).json({error:'username and password are required' });
        }
        const user=await User.findOne({username:username})
        if(!user||!(await user.comparePassword(password))){
            return res.status(401).json({error:"invalid data"})
        }
        const payload={
            id:user.id,
            username:user.username
        }
        const token=generateToken(payload)
        res.json(token);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"});
    }       
})


route.put('/profile/password',jwtAuthMiddleware,async(req,res)=>{
    try{
        const userId=req.user.id;
        const {currentPassword,newPassword}=req.body;
        if (!currentPassword||!newPassword) {
            return res.status(400).json({error:'Both currentPassword and newPassword are required' });
        }
        const user=await User.findById(userId);
        if(!user||!(await user.comparePassword(currentPassword))){
            return res.status(401).json({error:"invalid data"})
        }
        user.password=newPassword;
        user.save();
        console.log("password updated");
        res.status(200).json({message:"password updated"});
    }catch(err){
        console.log(err)
        res.status(500).json({err:"internal server error"})
    }
})



route.get('/profile',jwtAuthMiddleware,async(req,res)=>{
    try{
        const userData=req.user
        const userId=userData.id
        const user=await User.findById(userId)
        res.status(200).json({user})
    }catch(err){
        console.log(err);
        res.status(500).json({ err: "internal server error" });
    }

})

module.exports=route