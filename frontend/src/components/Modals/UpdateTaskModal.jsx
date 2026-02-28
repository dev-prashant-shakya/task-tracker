import classes from '../../CssModules/UpdateTask.module.css';
import { useDispatch } from 'react-redux';
import {openUpdateTodoModal } from '../../redux/profileSlice';
import { useEffect, useState } from 'react';

function UpdateTaskModal({ searchParams, setSearchParams, refetchTasks }) {
    const dispatch = useDispatch();
    const taskId = searchParams.get('taskId');
    const [singleTask, setSingleTask] = useState(null);
    const [originalTask, setOriginalTask] = useState(null);
    const [errors, setErrors] = useState({ title: '', description: '' });

    const closeUpdateTaskModal = () => {
        searchParams.delete('taskId');
        setSearchParams(searchParams);
        dispatch(openUpdateTodoModal(false));
    }
    
    const singleTaskId = async taskId => {
        let task = await fetch(`http://localhost:3200/task/${taskId}`, {
            credentials: 'include',
        });
        task = await task.json();
        return task.result;
    };

    const validateFields = (name, value) => {
        let error = '';
        
        if (name === 'title') {
            if (!value || value.trim() === '') {
                error = 'Title is required';
            } else if (value.length < 5) {
                error = 'Title must be at least 5 characters long';
            }
        } else if (name === 'description') {
            if (!value || value.trim() === '') {
                error = 'Description is required';
            } else if (value.length < 10) {
                error = 'Description must be at least 10 characters long';
            }
        }
        
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSingleTask({ ...singleTask, [name]: value });
        validateFields(name, value);
    };

    const updteTaskHandler = async () => {
        // Check if any changes were made
        if (originalTask && 
            singleTask.title === originalTask.title && 
            singleTask.description === originalTask.description) {
            alert("No changes detected. Please modify the task before updating.");
            return;
        }

        // Check if fields are empty
        if (!singleTask.title || !singleTask.description) {
            alert("Please fill all the fields");
            return;
        }
        
        // Check minimum length requirements
        if (singleTask.title.length < 5 || singleTask.description.length < 10) {
            alert("Title must be at least 5 characters and Description at least 10 characters long");
            return;
        }

        // Check if there are any validation errors
        if (errors.title || errors.description) {
            alert("Please fix all errors before updating");
            return;
        }

        let task = await fetch(`http://localhost:3200/update-task`, {
            method: 'PUT',
            body: JSON.stringify(singleTask),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        task = await task.json();
        if (task.success) {
            await refetchTasks();
            closeUpdateTaskModal();
        }
    }

    useEffect(() => {
        // Fetch task details using taskId if needed
        singleTaskId(taskId).then(task => {
           setSingleTask(task);
           setOriginalTask(task); // Store original task for comparison
        });
    }, [taskId]);


    return (
        <div className={classes.overlay}>
            <div className={classes.modalWrapper}>
                <div className={classes.formWrapper}>
                    <h2 className={classes.modalHeading}>Update Task</h2>
                    <div className={classes.addTaskForm}>
                        <div className={classes.labelWrapper}>
                            <label className={classes.label}>Title <sup>*</sup></label>
                        </div>
                        <input 
                            type="text" 
                            name="title" 
                            placeholder="Enter Todo Title" 
                            value={singleTask?.title || ''}
                            onChange={handleInputChange}
                        />
                        {errors.title && <span style={{color: 'red', fontSize: '12px'}}>{errors.title}</span>}
                        <div className={classes.labelWrapper}>
                            <label className={classes.label}>Description <sup>*</sup></label>
                        </div>
                        <textarea 
                            name="description" 
                            placeholder="Enter Todo Description" 
                            value={singleTask?.description || ''}
                            onChange={handleInputChange}
                        ></textarea>
                        {errors.description && <span style={{color: 'red', fontSize: '12px'}}>{errors.description}</span>}
                        <div className={classes.buttonWrapper}>
                            <button onClick={updteTaskHandler} className={classes.update}>Update</button>
                            <button onClick={closeUpdateTaskModal} className={classes.submit}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateTaskModal;