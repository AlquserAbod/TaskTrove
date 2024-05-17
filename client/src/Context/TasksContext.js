import axios from 'axios';
import { createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from './AuthContext';

const TasksContext = createContext();

const TasksProvider = ({ children }) => {
  const { loggedIn, getToken } = useContext(AuthContext);

  const updateLocalStorageTasks = (updatedTasks) => 
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

  const generateUniqueId = () => uuidv4();

  const fetchTasks = async (data = {}) => {
    try {
      if (!loggedIn) {
        const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

        // filter tasks from local storage befoare return 
        const filteredTasks = storedTasks.filter(task => {
            if (data.title && !task.title.includes(data.title)) {
              return false;
            }
    
            // Check if isCompleted matches the filter (if provided)
            if (data.hasOwnProperty('isCompleted') && task.isCompleted !== data.isCompleted) {
              return false;
            }
    
            // Check if color matches the filter (if provided)
            if(data.colors) {
              if (!data.colors.includes(task.color)) {
                return false;
              }

            }
    
            // Add more conditions based on your filters
    
            return true;
        });

        return filteredTasks;

      } else {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
          params: data,
        });
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  };

  const addTask = async (newTask) => {

    try {
        if (!loggedIn) {
            newTask._id = generateUniqueId();
            const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const updatedTasks = [...storedTasks, newTask];
            updateLocalStorageTasks(updatedTasks);
            return updatedTasks;
        } else {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tasks`,newTask);
            return response.data;
        }
    } catch (error) {
        console.error('Error adding task:', error);
        throw error;
    }
  };

  const updateTask = async (taskId, updatedTask) => {
      
    try {
        if (!loggedIn) {
            // add _id to task object
            if (!updatedTask._id) {
                const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
                const existingTask = storedTasks.find((task) => task._id === taskId);
            
                // Use the existing task's ID or generate a new one
                updatedTask._id = existingTask ? existingTask._id : generateUniqueId();
            }

            const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const updatedTasks = storedTasks.map((task) =>
             task._id === taskId ? { ...task, ...updatedTask } : task
            );
            updateLocalStorageTasks(updatedTasks);
            return updatedTasks;
        } else {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,updatedTask);

            return response.data
        }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };
  
  const deleteTask = async (taskId) => {
    try {
      if (!loggedIn) {
        const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = storedTasks.filter((task) => task._id !== taskId);
        updateLocalStorageTasks(updatedTasks);
        return updatedTasks;
      } else {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`);

        return response.data
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };
  


  return (
    <TasksContext.Provider value={{ 
        fetchTasks,
        addTask,
        updateTask,
        deleteTask
    }}>
      {children}
    </TasksContext.Provider>
  );
};

export { TasksContext, TasksProvider }; // Exporting AuthContext separately
