import classes from '../../CssModules/DeleteTaskModal.module.css';

function DeleteTaskModal({
    deleteTaskHandler,
    closeDeleteModal
}) {
    return (
        <div className={classes.overlay}>
            <div className={classes.modalWrapper}>
                <div className={classes.container}>
                    <h2 className={classes.modalHeading}>Delete Task</h2>
                    <p className={classes.modalText}>Are you sure you want to delete this task? This action cannot be undone.</p>
                    <div className={classes.buttonWrapper}>
                        <button className={classes.delete} onClick={deleteTaskHandler}>Delete</button>
                        <button className={classes.cancel} onClick={closeDeleteModal}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default DeleteTaskModal;