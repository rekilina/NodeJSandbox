import React from 'react'
import { Outlet, Navigate } from 'react-router-dom';

function PrivateRoutes() {
	const auth = false;
	
	if (auth === undefined) return <>loading...</>;

  return (
	auth === true ? <Outlet/> : <Navigate to='/auth'/>
	)
}

export default PrivateRoutes;