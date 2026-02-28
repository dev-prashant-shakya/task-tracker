import { useEffect, useState } from "react";
import classes from '../CssModules/List.module.css';
import UpdateTaskModal from "./Modals/UpdateTaskModal";
import { useDispatch, useSelector } from "react-redux";
import { openUpdateTodoModal, openDeleteTodoModal } from '../redux/profileSlice';
import { Link, useSearchParams, useLocation } from "react-router-dom";
import DeleteTaskModal from "./Modals/DeleteTaskModal";

function List() {
    const [tasks, setTasks] = useState([]);
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const [selectedTask, setSelectedTask] = useState([]);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const isUpdateTodoModalOpen = useSelector((state => {
        return state.todoApp.isUpdateTodoModalOpen;
    }));

    const isDeleteTodoModalOpen = useSelector((state => {
        return state.todoApp.isDeleteTodoModalOpen;
    }));

    const openUpdateTaskModal = (taskId) => {
        searchParams.set('taskId', taskId);
        setSearchParams(searchParams);
        dispatch(openUpdateTodoModal(true));
    }

    const fetchTasks = async () => {
        try {
            let list = await fetch("http://localhost:3200/tasks", {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                credentials: 'include'
            });
            
            if (!list.ok) {
                throw new Error(`HTTP error! status: ${list.status}`);
            }
            
            list = await list.json();
            setTasks(list.result);
            console.log(list.result);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setTasks([]);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTasks();
    }, [location.state?.refresh]);

    const deleteTaskHandler = async (id) => {
        dispatch(openDeleteTodoModal(true));
        let result = await fetch(`http://localhost:3200/delete/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        result = await result.json();

        if (result.success) {
           dispatch(openDeleteTodoModal(false));
            const updatedTasks = tasks.filter((task) => task._id !== id);
            setTasks(updatedTasks);
        } else {
            alert("Failed to delete task. Please try again.");
        }
    };

    const selectAll = (e) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            let items = tasks.map((item) => item._id);
            setSelectedTask(items);
        } else {
            setSelectedTask([]);
        }
    }

    const updateSelectedCheckbox = (itemId) => {
        if (selectedTask.includes(itemId)) {
            setSelectedTask(selectedTask.filter(id => id !== itemId));
        } else {
            setSelectedTask([...selectedTask, itemId]);
        }
    }

    const markAsCompleted = async (id) => {
        let result = await fetch(`http://localhost:3200/completed/${id}`, {
            method: 'PUT',
            credentials: 'include',
        });
        result = await result.json();

        if (result.success) {
            fetchTasks();
        } else {
            alert("Failed to update task. Please try again.");
        }
    }

    const deleteMultiple = async () => {
        try {
            console.log("Selected tasks to delete:", selectedTask);
            
            const res = await fetch("http://localhost:3200/delete-multiple", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ids: selectedTask }),
                credentials: 'include',
            });

            console.log("Response status:", res.status);
            const data = await res.json();
            console.log("Delete multiple response:", data);

            if (data.success) {
                console.log(`Successfully deleted ${data.deletedCount} tasks`);
                // Refetch tasks from the database to ensure sync
                await fetchTasks();
                setSelectedTask([]);
            } else {
                console.error("Delete failed:", data.message);
            }
        } catch (error) {
            console.error("Error deleting multiple tasks:", error);
        }
    };

    return (
        <>
            {tasks.length > 0 ?
                <div className={classes.allTodos}>

                    {/* Select All */}
                    <div className={classes.selectAllWrapper}>
                        {tasks.length > 1 && <label className={classes.selectAllLabel}>
                            <input
                                className={classes.selectAllCheckbox}
                                type="checkbox"
                                onChange={selectAll}
                                checked={tasks.length > 0 && selectedTask.length === tasks.length}
                            />
                            {selectedTask.length > 1 ? `Deselect All` : `Select All`}
                        </label>}

                        {selectedTask.length > 1 && <button onClick={deleteMultiple} className={classes.deleteSelectedButton}>Delete Selected</button>}
                    </div>

                    <div className={classes.todoCardGrid}>
                        {tasks.map((item) => (
                            <div key={item._id} className={item.completed ? classes.todoCardCompleted : classes.todoCard}>

                                <div className={classes.cardHeader}>
                                    <label className={classes.customCheckbox}>
                                        <input
                                            type="checkbox"
                                            checked={selectedTask.includes(item._id)}
                                            onChange={() => updateSelectedCheckbox(item._id)}
                                        />
                                        <span className={classes.checkmark}></span>
                                    </label>
                                    <span className={classes.serialNo}>{item.dateTime}</span>
                                </div>

                                <div className={classes.cardBody}>
                                    <h3 className={classes.title}>{item.title}</h3>
                                    <p className={classes.description}>{item.description}</p>
                                </div>

                                <div className={classes.cardActions}>
                                    <button className={classes.completeButton} type="button" onClick={() => markAsCompleted(item._id)}>
                                        {item.completed ? '✅ Completed' : '✅ Mark as Done'}
                                    </button>
                                    <div className={classes.actionButtons} >
                                        <button
                                            onClick={() => openUpdateTaskModal(item._id)}
                                            className={classes.editButton}
                                            type="button"
                                            disabled={item.completed}
                                        >
                                            ✏️
                                        </button>

                                        <button
                                            onClick={() => {
                                                setTaskToDelete(item?._id);
                                                dispatch(openDeleteTodoModal(true));
                                            }}
                                            className={classes.deleteButton}
                                            type="button"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>

                    {isUpdateTodoModalOpen && (
                        <UpdateTaskModal
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}
                            refetchTasks={fetchTasks}
                        />
                    )}

                    {isDeleteTodoModalOpen && taskToDelete && (
                        <DeleteTaskModal
                            deleteTaskHandler={() => deleteTaskHandler(taskToDelete)}
                            closeDeleteModal={() => dispatch(openDeleteTodoModal(false))}
                        />
                    )}
                </div>
                :
                <div className={classes.noTodoContainer}>
                    <p className={classes.noTodos}>Add Your Todos Today!</p>
                    <Link className={classes.addTodoLink} to={"/add-task"}>Add Todo</Link>
                </div>
            }</>
    )
}

export default List;