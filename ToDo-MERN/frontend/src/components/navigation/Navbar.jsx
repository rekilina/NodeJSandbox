import classes from './Navbar.module.scss'
import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserAlt } from 'react-icons/fa';

function Navbar() {
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

	useEffect(() => {
		getUser();
	}, []);

	const navigation = useNavigate();

	const logoutHandler = async (event) => {
		event.preventDefault();
		try {
			const { data } = await axios.get('/api/auth/logout');
			console.log('logout status: ', data);
			setUser(iniState);
			navigation('/auth');
			toast.success('LogOut success');
		} catch (err) {
			console.log('logout error: ', err);
			toast.error('Smth went wrong');
		}
	}

	return (
		<header>
			<div className={classes.userInfo}>
				<FaUserAlt className={classes.userIcon} />
				<div>
					<h1 className={classes.name}>{user.name}</h1>
					<h3 className={classes.email}>{user.email}</h3>
					<Link to="edit-profile" className={classes.editBtn}>Edit</Link>
				</div>
				<nav>
					<button className={classes.logout} onClick={logoutHandler}>Logout</button>
				</nav>
			</div>
		</header>
	)
}

export default Navbar

