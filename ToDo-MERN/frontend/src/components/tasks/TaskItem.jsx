import React, { useState } from 'react'
import classes from './TaskItem.module.scss'
import { AiOutlineDelete } from 'react-icons/ai'
import axios from 'axios';
import toast from 'react-hot-toast'

function TaskItem({ task, onDelete }) {
	const [isComplete, setIsComplete] = useState(task.complete);
	const [isLoading, setIsLoading] = useState(false);

	const deleteHandler = async () => {
		onDelete(task._id);
	}

	const checkBoxHandler = async () => {
		const taskStatus = () => { return isComplete };
		try {
			setIsLoading(true);
			await axios.put('/api/tasks/' + task._id, {
				name: task.name,
				complete: !taskStatus()
			});
			setIsComplete(!taskStatus());
		} catch (err) {
			console.log('Update task failed: ', err);
			toast.error('Update task failed.');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<tr className={classes.task_item}>
			<td className={classes.task_name}>
				<div className={classes.checkbox} role='checkbox' aria-checked
					onChange={checkBoxHandler} disabled={isLoading}>
					<input
						type="checkbox"
						checked={isComplete}
						tabIndex={-1}
						readOnly
						disabled={isLoading}
					/>
				</div>
				<p>{task.name}</p>
			</td>
			<td>{isComplete ? 'Complete' : 'Incomplete'}</td>
			<td>
				<button type='button' className={classes.deleteBtn} onClick={deleteHandler}>
					<AiOutlineDelete />
				</button>
			</td>
		</tr>
	)
}

export default TaskItem