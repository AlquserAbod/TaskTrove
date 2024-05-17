// NewTaskModal.js
import { useContext, useEffect, useRef, useState } from 'react';
import ColorSelect, { Colors } from '../form/colorSelect/colorSelect';
import Checkbox from '../form/checkbox/checkbox';
import { TasksContext } from '@/Context/TasksContext';
import styles from './styles.module.css'

const NewTaskModal = ({ show, taskData,onSave, onClose }) => {

  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const titleRef = useRef();
  const isCompletedRef = useRef();
  const {  addTask, deleteTask, fetchTasks, updateTask } = useContext(TasksContext);
  let [errors, setErrors] = useState([]);


  useEffect(() => {
    // If taskData is provided, set the form values for editing
    if (taskData) {
      titleRef.current.value = taskData.title;
      isCompletedRef.current.checked = taskData.isCompleted;
      setIsCompleted(taskData.isCompleted);
      setSelectedColor(taskData.color);

    } else {
      // If taskData is not provided, reset the form for adding a new task
      titleRef.current.value = '';
      isCompletedRef.current.checked = false;
      setIsCompleted(false);
      setSelectedColor(null)
    }
  }, [taskData]);

  const validationForm = () => {
    const formErrors = []
    if(titleRef.current.value.trim() == '') formErrors.push('task title is required') 
    if(selectedColor == null) formErrors.push('task color is required') 

    return formErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    //validtion
    const formErrors = validationForm();
    if (formErrors.length > 0) {
      setErrors(formErrors);
      return; // Stop form submission if there are errors
    }

    const data = {
      title: titleRef.current.value,
      isCompleted: isCompletedRef.current.checked,
      color: selectedColor,
      
    };

    try {
      if (taskData) {
        await updateTask(taskData._id, data);
      } else {
        await addTask(data);
      }

      const tasks = await fetchTasks();

      onSave(tasks);

    } catch (error) {
      console.error('Error handling task:', error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(taskData._id)

      onSave()
    }catch (error) {
      console.error('Error handling task:', error);
    }
  }
  const handleUpdateIsCompleted = async () => {
    try {
      const updatedTask = { ...taskData, isCompleted: !taskData.isCompleted };
      await updateTask(taskData._id,updatedTask)

      onSave()
    }catch (error) {
      console.error('Error handling task:', error);
    }
  }

  return (
    <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{taskData != null ? 'Update Task' : 'Add Task'}</h5>
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="taskName">Task Name</label>
                <input
                  type="text"
                  className="form-control"
                  ref={titleRef}
                  required={true}
                  id="taskName"
                />
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="taskColor">Task Color</label>
                <ColorSelect
                  value={Colors.find((c) => c.value == selectedColor)}
                  onChange= {(selectedOption) => setSelectedColor(selectedOption.value)}
                  required={true}/>
              </div>
              <br />
              <div className="form-ogroup">
                <Checkbox 
                  id="TaskMdalIsComplated" 
                  label="isCompleted"
                  checked={isCompleted}
                  ref={isCompletedRef}
                  onChange={(e) => setIsCompleted(e.target.checked)}/>
              </div>
              
            </form>
            {
              errors.length > 0 ? (
                <div className={`alert alert-danger ${styles.errors}`}>
                  {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                  ))}
                </div>
              ) : <></>
            }
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            {taskData ?
                <button type="button" className="btn btn-danger" onClick={handleDeleteTask}>
                  Delete task
                </button>

              : <></>
            }
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              {taskData ? 'Update Task' : 'Create Task'}
            </button>
            
            <br />
            {taskData ?
              <button type="button" 
              className={`btn ${taskData.isCompleted == false ? "btn-success" : "btn-warning"}`} 
              onClick={handleUpdateIsCompleted}>
              {taskData.isCompleted == false ? "You have completed this task" : "You did not complete this task"}
            </button>
             : <></>}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTaskModal;
