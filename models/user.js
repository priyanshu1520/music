const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    role:{
        type:String,
        enum:['listner','artist'],
        default:'listner'
    },
});


userSchema.pre('save',async function(next){
    const user=this;
    if(!user.isModified('password')){
        return next();
    }
    try{
        const salt= await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(user.password,salt);
        user.password=hashPassword;
        next();
    }catch(err){
        return next(err);
    }
})

userSchema.methods.comparePassword=async function(password){
    try{
        const ismatch=await bcrypt.compare(password,this.password);
        return ismatch;
    }catch(err){
        res.status(500).json({error:"internal server error"});
    }
}



const User=mongoose.model('User',userSchema);
module.exports=User;