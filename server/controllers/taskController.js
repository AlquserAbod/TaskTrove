const { Colors,default: Task } = require('../Models/task');

const createTask = async (req, res) => {
  try {
    const taskData = {
      title: req.body.title,
      color: req.body.color,
      isCompleted: req.body.isCompleted,
      userId: req.user._id
    }
    const newTask = await new Task(taskData).save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createTasks = async (req, res) => {
  try {
    const { tasks } = req.body;
    const createdTasks = [];

    for (const taskData of tasks) {
      const newTask = await new Task({
        "title": taskData.title,
        "isCompleted":taskData.isCompleted,
        "color": taskData.color,
        "userId": req.user._id
      }).save();
      createdTasks.push(newTask);
    }

    res.status(201).json(createdTasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllTasks = async (req, res) => {
  const userId = req.user._id;
  const { colors, title, isCompleted } = req.query;
  const filters = { userId};

  if (Array.isArray(colors) && colors.length > 0) {
    console.log("colors :", colors);
    const validColors = colors.filter(color => Colors[color.toUpperCase()]);
    console.log("validColors :", validColors);

    if (validColors.length > 0) {
      filters.color = { $in: validColors };
    }
  }

  if (title !== undefined) {
    filters.title = { $regex: title, $options: 'i' }; 
  }

  if (isCompleted !== undefined) {
    filters.isCompleted = isCompleted;
  }

  try {
    const tasks = await Task.find(filters);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTaskById = async (req, res) => {
  try {
    const newTaskData = { ...req.body };

    delete newTaskData._id;

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, newTaskData, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTaskById = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  createTasks
};
