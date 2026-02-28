import { useState } from 'react';
import classes from '../CssModules/AddTask.module.css';
import { useNavigate } from 'react-router-dom';

function AddTask() {
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState({title: '', description: '', completed: false});
    const addTaskHandler = async (e) => {
        e.preventDefault();
        
        // Check if fields are empty
        if (!taskData.title || !taskData.description) {
            alert("Please fill all the fields");
            return;
        }
        
        // Check minimum length requirements
        if (taskData.title.length < 5 || taskData.description.length < 10) {
            alert("Title must be at least 5 characters and Description at least 10 characters long");
            return;
        }
        const dateTime = new Date().toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }).replace(/\//g, ".");
        const taskDataWithDate = {...taskData, dateTime};   
        let result = await fetch("http://localhost:3200/add-task", {
            method: 'POST',
            body: JSON.stringify(taskDataWithDate), 
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        result = await result.json();
        if (result.success) {
            console.log("Task added successfully");
            setTaskData({date: '', title: '', description: ''});
            navigate('/', { state: { refresh: Date.now() } });
        } else {
            alert("Failed to add task. Please try again.");
        }
    }

  return (
    <div className={classes.container}>
        <div className={classes.formWrapper}>
            <h1 className={classes.heading}>Add Todo 🤘</h1>
            <div className={classes.addTaskForm}>
                <div className={classes.labelWrapper}> 
                    <label className={classes.label}>Title <sup>*</sup></label>
                </div>
                <input type="text" name="title" placeholder="Enter Todo Title" value={taskData.title} onChange={(e) => setTaskData({...taskData, title: e.target.value})}/>
                <div className={classes.labelWrapper}> 
                    <label className={classes.label}>Description <sup>*</sup></label>
                </div>
                <textarea name="description" placeholder="Enter Todo Description" value={taskData.description} onChange={(e) => setTaskData({...taskData, description: e.target.value})}></textarea>
                <div className={classes.buttonWrapper}>
                    <button onClick={addTaskHandler} className={classes.submit}>Add Todo</button>
                </div>
            </div>
        </div>
    </div>
  );
}
export default AddTask;