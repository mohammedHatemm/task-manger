const User = require('../models/User');
const Task = require('../models/Task')
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("-password");
    //add tasks count
    const userWithTasksCount = await Promise.all(users.map(async (user) => {
      const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "pending" });
      const isProcssingTasks = await Task.countDocuments({ assignedTo: user._id, status: "processing" });
      const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: "completed" });
      return {
        ...user._doc || user,
        pendingTasks,
        isProcssingTasks,
        completedTasks
      };
    }))
    res.json(userWithTasksCount)

  }
  catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal server error", error: error.message })
  }
}

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
   }
  catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal server error", error: error.message })
  }
}



module.exports = {
  getUsers,
  getUserById

}
