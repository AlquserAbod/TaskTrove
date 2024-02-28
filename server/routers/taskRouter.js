const express = require('express');
const router = express.Router();
const validateTask = require('../validators/taskValidator');
const controller = require('../controllers/taskController.js');
const auth = require('../middleware/auth');

router.post('/',auth, validateTask, controller.createTask);
router.post('/createTasks',auth, controller.createTasks);
router.get('/',auth, controller.getAllTasks);
router.get('/:id',auth, controller.getTaskById);
router.put('/:id',auth, controller.updateTaskById);
router.delete('/:id',auth, controller.deleteTaskById);

module.exports = router;