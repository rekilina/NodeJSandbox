import React, { useState, useEffect } from 'react';
import classes from './EditProfileForm.module.scss';
import { Link } from 'react-router-dom';
import { BsArrowLeftShort } from 'react-icons/bs';
import axios from 'axios';
import toast from 'react-hot-toast';

function EditProfileForm() {

	const iniState = {
		name: "",
		email: ""
	}

	const [user, setUser] = useState(iniState);

	// if (!user) return null;

	const getUser = async () => {
		try {
			const { data } = await axios.get('/api/users/me');
			setUser(data);
		} catch (err) {
			console.log('getUser error: ', err);
			toast.error('Smth went wrong');
		}
	}

	const submitProfileHandler = async (e) => {
		e.preventDefault();
		try {
			await axios.post('/api/users/me', user);
			toast.success('Profile updated');
		} catch (err) {
			console.log('getUser error: ', err);
			toast.error('Smth went wrong');
		}
	}

	const inputHandler = (e) => {
		setUser({
			...user,
			[e.target.name]: e.target.value
		})
	}

	useEffect(() => {
		getUser();
	}, []);

	return (
		<div>
			<Link to="/" className={classes.backBtn}>
				<BsArrowLeftShort /> Home
			</Link>
			<div>
				<h1>Edit profile</h1>
				<form className={classes.editForm} onSubmit={submitProfileHandler}>
					<label htmlFor="name">Name: </label>
					<input type="text" name="name" placeholder="name"
						value={user.name} onChange={inputHandler} />
					<label htmlFor="email">Email: </label>
					<input type="email" name="email" placeholder="email"
						value={user.email} onChange={inputHandler} />
					<button type="submit">Submit</button>
				</form>
			</div>
		</div>
	)
}

export default EditProfileForm