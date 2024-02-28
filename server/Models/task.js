const mongoose = require('mongoose');

// Enum for colors
const Colors = Object.freeze({
  RED: 'red',
  BLUE: 'blue',
  GREEN: 'green',
  YELLOW: 'yellow',
  ORANGE: 'orange',
  PURPLE: 'purple',
  CYAN: 'cyan',
  MAGENTA: 'magenta',
  TEAL: 'teal',
  PINK: 'pink',
});

// Define Task schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  color: {
    type: String,
    enum: Object.values(Colors),
    default: Colors.RED
  }
},{versionKey: false });

// Create Task model
const Task = mongoose.model('Task', taskSchema);

// Export Task model
module.exports = {
  default: Task,
  Colors
};