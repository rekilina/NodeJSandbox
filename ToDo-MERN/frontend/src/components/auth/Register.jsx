import React from 'react';
import classes from './AuthForm.module.scss';

function Register() {
  return (
	<div className={classes.register}>
		<h1 className={classes.title}>Login</h1>
		<form className={classes.authForm}>
			<label htmlFor="name">
				Name
				<input type="text" name="name" placeholder="name" required />
			</label>
			<label htmlFor="email">
				Email
				<input type="email" name="email" placeholder="email" required />
			</label>
			<label htmlFor="password">
				Password
				<input type="password" name="password" placeholder="password" required />
			</label>
		</form>
	</div>
  )
}

export default Register;