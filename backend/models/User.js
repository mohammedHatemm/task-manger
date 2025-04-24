const mongoose =require('mongoose');
const UserShema = new mongoose.Schema(
  {
  name:{type:String,required:true},
email:{type:String , require:true , unique:true},
password:{type:String,require:true},
profileImageUrl:{type:String , default:null},
role:{type:String,enum:['member','admin'],default:'member'},
},
{timestamps:true},
);

module.exports = mongoose.model('User',UserShema);
