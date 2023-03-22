import React, { useEffect, useState } from 'react'
import classes from './TaskList.module.scss'
import TaskItem from './TaskItem'
import axios from 'axios';
import toast from 'react-hot-toast';

function TaskList() {
	const [taskList, setTaskList] = useState([]);
	const [isAdding, setIsAdding] = useState(false);
	const [newTask, setNewTask] = useState('');

	const fetchTasks = async () => {
		try {
			const response = await axios.get('/api/tasks');
			const tasks = response.data.sort((a, b) => {
				return new Date(b.createdAt) > new Date(a.createdAt)
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
			// fetchTasks();
			setTaskList(taskList.filter(task => task._id != taskId));
		} catch (err) {
			console.log('Task delete failed: ', err);
			toast.error('Task delete failed.');
		}
	}

	const newTaskInputHandler = (e) => {
		setNewTask(e.target.value);
	}

	const isAddingHandler = (e) => {
		const currStatus = () => { return isAdding };
		setIsAdding(!currStatus());
	}

	const addNewTask = async (e) => {
		e.preventDefault();
		const task = {
			name: newTask
		}
		try {
			const { data } = await axios.post('api/tasks/new/', task);
			toast.success('New task successfully added.');
			fetchTasks();
			setNewTask('');
			setIsAdding(false);
		} catch (err) {
			console.log('New task failed: ', err);
			toast.error('New task failed.');
		}
	}

	return (
		<div>
			<div className={classes.topBar}>
				<button type="button"
					className={classes.addNew}
					onClick={isAddingHandler}
				>Add new</button>
			</div>
			{isAdding && (
				<form className={classes.addNewForm}
					onSubmit={addNewTask}>
					<input type="text" value={newTask} onChange={newTaskInputHandler} />
					<button type="submits"
						className={classes.addNew}>Add</button>
				</form>
			)}
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