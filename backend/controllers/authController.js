const User = require('../models/User');
const bcrypt = require("bcryptjs")
const jwt =require("jsonwebtoken")


//Generate tokken
const generatToken = (userId) =>{
  return jwt.sign({id:userId}, process.env.JWT_SECRET, {expiresIn:"7d"})
}

const registerUser = async (req,res) =>{
  try{
    const {name, email, password , profileImageUrl, adminInviteToken} = req.body;
    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({message:"User already exists"})
    }
    let role = "member" ;
    if(adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN){
      role = "admin"
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    const user = await User.create({
      name,
      email,
      password:hashedPassword,
      profileImageUrl,
      role,
    });
    res.status(201).json({
      _id:user._id,
      name:user.name,
      email:user.email,
      profileImageUrl:user.profileImageUrl,
      role:user.role,
      token:generatToken(user._id),
    });
  }
  catch(error){
    console.log(error)
    res.status(500).json({message:"Internal server error" ,error:error.message})

  }


}

const loginUser = async(req ,res)=>{
  try{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message:"Invalid emai or password "})
       }
       const isMatch = await bcrypt.compare(password,user.password);
       if(!isMatch){
        return res.status(400).json({message:"Invalid emai or password "})
       }
       res.json({
        _id:user._id,
        name:user.name,
        email:user.email,
        profileImageUrl:user.profileImageUrl,
        role:user.role,
        token:generatToken(user._id),
       })

  }
  catch(error){
    console.log(error)
    res.status(500).json({message:"Internal server error" ,error:error.message})

  }


}

const getUserProfile = async(req , res) =>{
  try{
    const user = await User.findById(req.user.id).select("-password");
    if(!user){
      return res.status(404).json({message:"User not found"})
    }
    res.json(user);
  }
  catch(error){
    console.log(error)
    res.status(500).json({message:"Internal server error" ,error:error.message})

  }


};

const updateUserProfile = async(req,res) =>{
  try{
    const user = await User.findById(req.user.id);
    if(!user){
      return res.status(404).json({message:"User not found"})

    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if(req.body.password){
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password,salt);
    }
   const updatedUser = await user.save();
   res.json({
    _id:updatedUser._id,
    name:updatedUser.name,
    email:updatedUser.email,
    profileImageUrl:updatedUser.profileImageUrl,
    role:updatedUser.role,
    token:generatToken(updatedUser._id),
   })
  }
  catch(error){
    console.log(error)
    res.status(500).json({message:"Internal server error" ,error:error.message})

  }


}

module.exports = {registerUser,loginUser,getUserProfile,updateUserProfile};
