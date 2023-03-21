import React, { useState } from 'react'
import classes from './TaskItem.module.scss'
import { AiOutlineDelete } from 'react-icons/ai'

function TaskItem({ task, onDelete }) {
	const [isComplete, setIsComplete] = useState(task.complete);

	const deleteHandler = async () => {
		onDelete(task._id);
	}

	return (
		<tr className={classes.task_item}>
			<td className={classes.task_name}>
				<div className={classes.checkbox}>
					<input type="checkbox" checked={isComplete} tabIndex={-1} />
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