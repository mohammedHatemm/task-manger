const mongoose = require('mongoose');
const todoSchema = new mongoose.Schema(
  {text:{type:String ,require:true},
  completed:{type:Boolean ,default:false},


  }
)
const tasksSchema =new mongoose.Schema(
  {
    title:{type:String,require:true},
    description:{type:String},
    priority:{type:String,enum:['low','medium','high'],default:'medium'},
    dueDate:{type:Date ,require:true},
    status:{type:String,enum:["pending" , "isProssing" , "completed"],default:"pending"},
    assignedTo:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    cratedBy:{type:mongoose.Schema.Types.ObjectId , ref:"User"},
    attachments:[{type:String}],
    todoChecklist:[todoSchema],
 Progress:{type:Number,default:0},
  }
  ,
 {timestamps:true},
)
module.exports = mongoose.model('Task',tasksSchema);
