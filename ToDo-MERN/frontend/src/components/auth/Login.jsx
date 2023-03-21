import React from 'react';
import axios from 'axios';
import classes from './AuthForm.module.scss';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Login() {
	const navigate = useNavigate();

	const login = async (e) => {
		e.preventDefault();
		const user = {
			email: e.target.email.value,
			password: e.target.password.value,
		}
		console.log(user);
		try {
			await axios.post('/api/auth/login', user);
			navigate('/');
			toast.success('Login success');
		} catch (err) {
			console.log('login function: ', err);
			toast.error('Login failed');
		}
	}
	return (
		<div className={classes.register}>
			<h1 className={classes.title}>Login</h1>
			<form className={classes.authForm} onSubmit={login}>
				<label htmlFor="email">
					Email
					<input type="email" name="email" placeholder="email" required />
				</label>
				<label htmlFor="password">
					Password
					<input type="password" name="password" placeholder="password" required />
				</label>
				<button type="submit">Login</button>
			</form>
		</div>
	)
}

export default Login