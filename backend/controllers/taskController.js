const Task = require('../models/Task');


//@desc get all tasks {admin:all , user:only assigned tasks }
//@route GET /api/tasks
//@access private

const getTasks = async(req, res)=>{
  try{
    const {status} = req.query;
    let filter = {};
    if(status){
     filter.status = status;
    }
    let tasks;
    if(req.user.role === "admin"){
     tasks = await Task.find(filter).populate("assignedTo", "name email profileImageUrl")
    }
    else{
     tasks = await Task.find({...filter ,assignedTo:req.user.id,}).populate("assignedTo", "name email profileImageUrl")
    }


   tasks = await Promise.all(tasks.map(async(task)=>{
     const completedCount = task.todoChecklist.filter(
       (item) =>item.completed
     ).length;
     return{...task._doc, completedTodoCount:completedCount}

   }))
   const allTasks = await Task.countDocuments(
     req.user.role ==="admin" ? {} : {assignedTo:req.user.id}

   )
   const pendingTasks = await Task.countDocuments(
   {...filter,
   status:"pending",
   ...(req.user.role !=="admin" && {assignedTo:req.user.id})
   }
   )
   const inProgressTasks = await Task.countDocuments(
      {
       ...filter,
      status:"inProgress",
      ...(req.user.role!=="admin" && {assignedTo:req.user.id})
      }
   )
   const completedTasks = await Task.countDocuments(
     {
     ...filter,
     status:"completed",
     ...(req.user.role!=="admin" && {assignedTo:req.user.id})
     }
   )
   res.json({
     tasks,
     statusSummary:{
       all:
       allTasks,
       pendingTasks,
       inProgressTasks,
       completedTasks,

     },
   })

 }
   catch(error){
     res.status(500).json({message:"server error ",message:error.message})
   }
}

//@desc get task by id
//@route GET /api/tasks/:id
//@access private
const getTaskById = async(req, res)=>{
  try{
    const task = await Task.findById(req.params.id).populate("assignedTo", "name email profileImageUrl")
    if(!task){
      return res.status(404).json({message:"Task not found"})
    }
    res.status(200).json(task)
  }
  catch(error){
    res.status(500).json({message:"server error ",message:error.message})
  }
}

//@desc create a new  task (Admin only)
//@route POST /api/tasks
//@access private
const createTask = async(req, res)=>{
   try{
    const {title, description, dueDate, priority, assignedTo,attachments, todoChecklist} = req.body;
    if(!Array.isArray(assignedTo)){
      return res.status(400).json({message:"assignedTo must be an array of user IDs"})

    }
    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      attachments,
      todoChecklist,
      createdBy:req.user.id

    })
    res.status(201).json({message:"Task created successfully" , task})
   }
   catch(error){
    res.status(500).json({message:"server error ",message:error.message})
   }
}
//@desc update a task
//@route PUT /api/tasks/:id
//@access private
const updateTask = async(req , res)=>{
try{
  const task = await Task.findById(req.params.id);
  if(!task){
    return res.status(404).json({message:"Task not found"})
  }
    task.title = req.body.title || req.title;
    task.description =req.body.description || req.description;
    task.priority = req.body.priority|| req.priority;
    task.dueDate = req.body.dueDate || req.dueDate;
    task.attachments = req.body.attachments || req.attachments;
    task.todoChecklist = req.body.todoChecklist || req.todoChecklist;

    if(req.body.assignedTo){
      if(!Array.isArray(req.body.assignedTo)){
        return res.status(400).json({message:"assignedTo must be an array of user IDs"})
      }
      task.assignedTo = req.body.assignedTo;
    }
    const updatedTask = await task.save();
    res.status(200).json({message:"Task updated successfully", updatedTask})
}
catch(error){
  res.status(500).json({message:"server error ",message:error.message})
}
}
//@desc delete a task (admin only)
//@route DELETE /api/tasks/:id
//@access private admin
const deleteTask = async(req, res)=>{
  try{}
  catch(error){
    res.status(500).json({message:"server error ",message:error.message})
  }
}
//@desc update a task status
//@route PUT /api/tasks/:id/status
//@access private
const updateTaskStatus = async(req, res)=>{
 try{}
 catch(error){
  res.status(500).json({message:"server error ",message:error.message})
 }
}

//@desc update a task checklist
//@route PUT /api/tasks/:id/todo
//@access private
const updateTaskChecklist = async(req, res)=>{
  try{}
  catch(error){
    res.status(500).json({message:"server error ",message:error.message})
  }
}
//@desc get dashboard data (Admin only)
//@route GET /api/tasks/dashboard-data
//@access private (Admin)
const getDashboardData = async (req, res)=>{
  try{}
  catch(error){
    res.status(500).json({message:"server error ",message:error.message})
  }
}
//@desc get user dashboard data (user only)
//@route GET /api/tasks/user-dashboard-data
//@access private
const getUserDashboardData = async (req, res)=>{
  try{}
  catch(error){
    res.status(500).json({message:"server error ",message:error.message})
  }
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData

}
