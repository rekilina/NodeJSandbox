import { useEffect, useState } from 'react'
import axios from 'axios';

export default () => {
	const [auth, setAuth] = useState();

	const verifyAuth = async () => {
		try {
			const res = await axios.get('/api/auth/is_logged_in');
			console.log(res.data);
			return res;
		} catch (err) {
			console.log('useAuth err: ', err);
			return false;
		}
	};

	useEffect(() => {
		const fetchAuthData = async () => {
			const isAuth = await verifyAuth();
			setAuth(isAuth);
		}
		fetchAuthData();
	});

	return { auth };
}