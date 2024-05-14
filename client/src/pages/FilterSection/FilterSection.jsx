import { useContext, useRef, useState } from 'react';
import ColorSelect from '@/components/form/colorSelect/colorSelect';
import Checkbox from '@/components/form/checkbox/checkbox';
import styles from './FilterSection.module.css';
import { AuthContext } from '@/Context/AuthContext';
import { TasksContext } from '@/Context/TasksContext';

const FilterSection = ({ setTasks }) => {
    const [isCompleted, setIsCompleted] = useState(true);
    const [notCompleted, setnotCompleted] = useState(true);
    const titleRef = useRef();
    const isComplatedRef = useRef();
    const colorSelectRef = useRef();
    const notCompletedRef = useRef();
    

    const { fetchTasks }  = useContext(TasksContext);
    const {loggedIn} = useContext(AuthContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const filterQuery = {}

            // Check and add title to filterQuery if it's not empty
            const titleValue = titleRef.current.value.trim();
            if (titleValue !== '') {
                filterQuery.title = titleValue;
            }

        if (isComplatedRef.current.checked && !notCompletedRef.current.checked) {
            filterQuery.isCompleted = true;
        } else if (!isComplatedRef.current.checked && notCompletedRef.current.checked) {
            filterQuery.isCompleted = false;
        }

        const colorValue = colorSelectRef.current.value;
        if (colorValue != "null") {
            filterQuery.colors = [colorValue];
        }



        try {
          const tasks = await fetchTasks(filterQuery);
  
          setTasks(tasks);
        } catch (error) {
          console.error('Error adding task:', error);
        }
      };

    return (
        <form onSubmit={handleSubmit} className={styles.filterSection}>
            <div className={styles.filterItem}>
                <label htmlFor="titleSearch">Title Search:</label>
                <input
                    type="text"
                    id="titleSearch"
                    className={styles.inputText}
                    ref={titleRef}
                />
            </div>
            <div className={styles.filterItem}>
                <label htmlFor="color">Color:</label>
                <ColorSelect 
                    id="color"
                    null_disabled={false}
                    ref={colorSelectRef}/>
            </div>
            <div className={styles.complatedFilter}>
                <div className={styles.filterItem}>
                    <Checkbox
                        id="FilterIsComplated"
                        label="is Completed"
                        checked={isCompleted}
                        ref={isComplatedRef}
                        onChange={(e) => setIsCompleted(e.target.checked)}
                    />
                </div>
                <div className={styles.filterItem}>
                    <Checkbox
                        id="FilterNotComplated"
                        label="Not Completed"
                        checked={notCompleted}
                        ref={notCompletedRef}
                        onChange={(e) => setnotCompleted(e.target.checked)}
                    />
                </div>

            </div>

            <button type="submit" className={styles.submitButton}>
                Submit
            </button>
        </form>
    );
};

export default FilterSection;