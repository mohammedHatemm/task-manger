const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try{
    let token = req.headers.authorization;

    if(token && token.startsWith("Bearer")){

      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    }
    else{
      res.status(401).json({message:"Not authorized"});
    }
  }catch(error)
  {
res.status(401).json({message:"token faild " , error:error.message});
  }
}


//meddleware for addmin only
const adminOnly = async(req , res , next)=>{
  if (req.user && req.user.role==="admin")
    {
    next();
  }
  else{
    res.status(403).json({message:"Not authorized , admin only allowed"});
  }
}
module.exports = {protect,adminOnly};
