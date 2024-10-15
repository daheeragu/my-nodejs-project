const Task = require("../model/Task");

const taskController = {};

taskController.createTask = async (req, res) => {
  try {
    const { task, isCompleted } = req.body;
    const newTask = new Task({ task, isCompleted });
    await newTask.save();
    res.status(200).json({ status: "OK", data: newTask });
  } catch (err) {
    res.status(400).json({ status: "FAIL", error: err });
  }
};

taskController.getTask = async (req, res) => {
  try {
    const taskList = await Task.find({}).select("-__v");
    res.status(200).json({ status: "OK", data: taskList });
  } catch (err) {
    res.status(400).json({ status: "FAIL", error: err });
  }
};

taskController.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      throw new Error("App can not find the task");
    }
    const fields = Object.keys(req.body);
    fields.map((item) => (task[item] = req.body[item]));
    await task.save();
    res.status(200).json({ status: "OK", data: task });
  } catch (err) {
    res.status(400).json({ status: "FAIL", error: err });
  }
};

taskController.deleteTask = async (req, res) => {
  try {
    const deletedItem = await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: "OK", data: deletedItem });
  } catch (err) {
    res.status(400).json({ status: "FAIL", error: err });
  }
};
module.exports = taskController;
