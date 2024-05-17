import React, { useContext, useEffect, useState } from 'react'
import styles from './styles.module.css';
import NewTaskModal from '@/components/NewTaskModal/NewTaskModal';
import FilterSection from './FilterSection/FilterSection';
import StickyNote from '@/components/StickyNote/StickyNote';
import { AuthContext } from '@/Context/AuthContext';
import { TasksContext } from '@/Context/TasksContext';
import Head from 'next/head';

  
function todos() {
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const {loggedIn} = useContext(AuthContext);
    const { fetchTasks } = useContext(TasksContext);
    
    const [tasks, setTasks] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const tasks = await getTasks();
        }

        fetchData();
    },[])

    const getTasks =  async ()  => {
        const tasks = await fetchTasks()
        setTasks(tasks)
        return tasks;
    }

    const handleShowModal = (task = null) => {
      setSelectedTask(task);
      setShowModal(true);
    };
    
    const handleCloseModal = () => {
      setSelectedTask(null);
      setShowModal(false);
    };
    
    const handleSaveTask = (taskData) => {
        console.log('Saving task:', taskData);
  
        setShowModal(false);

        window.location.reload();
    };
    

    return (
        <div className={`${styles.container} container`}>
            <Head>
                {/* Title */}
                <title>TaskTrove</title>

                {/* Meta tags */}
                <meta name="description" 
                content="Effortlessly manage your tasks on TaskTrove's Todos page. View, update, and mark tasks as completed or not. Stay organized and in control of your to-do list with our intuitive task management solution." />

            </Head>
            <FilterSection setTasks={setTasks} />

            <div className={`d-grid gap-2 col-6 mx-auto ${styles.addTask}`}>
                <button type="button" className="btn btn-outline-success" onClick={() => handleShowModal()}>Add New Task</button>
            </div>
            
            
            <div>
                {tasks && tasks.length > 0 ? (
                    <div className={styles.stickyNotesContainer}>
                    {tasks.map((task, index) => (
                            <StickyNote key={index} task={task} onEdit={() => handleShowModal(task)} />

                    ))}
                    </div>
                ) : (
                    <div className={styles.noTasksAvilable}>
                        No tasks available.
                    </div>
                )}
            </div>

            <NewTaskModal
                show={showModal}
                onSave={handleSaveTask}
                taskData={selectedTask}
                onClose={handleCloseModal}
            />
        </div>

    )
}

export default todos