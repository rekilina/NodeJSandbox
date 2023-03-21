import React, { useEffect, useState } from 'react'
import classes from './TaskList.module.scss'
import TaskItem from './TaskItem'
import axios from 'axios';
import toast from 'react-hot-toast';

function TaskList() {
	const [taskList, setTaskList] = useState([]);

	const fetchTasks = async () => {
		try {
			const response = await axios.get('/api/tasks');
			const tasks = response.data.sort((a, b) => {
				new Date(b.createdAt) > new Date(a.createdAt)
			});
			// console.log('tasks: ', tasks);
			setTaskList(tasks);
		} catch (err) {
			console.log('get tasks error: ', err);
		}
	}

	useEffect(() => {
		fetchTasks();
	}, []);

	const deleteHandler = async (taskId) => {
		try {
			const { data } = await axios.delete('api/tasks/delete/' + taskId.toString());
			toast.success('Task delete success.');
			fetchTasks();
		} catch (err) {
			console.log('Task delete failed: ', err);
			toast.error('Task delete failed.');
		}
	}

	return (
		<div>
			<div className={classes.topBar}>
				<button type="button" className={classes.addNew}>Add new</button>
			</div>
			<table className={classes.taskList_table}>
				<tbody>
					{
						taskList.map(task => {
							return <TaskItem key={task._id} task={task} onDelete={deleteHandler} />
						})
					}
				</tbody>
			</table>
		</div>
	)
}

export default TaskList