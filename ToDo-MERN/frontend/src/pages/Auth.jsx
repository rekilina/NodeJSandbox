
import React, { useEffect } from 'react'
import Register from '../components/auth/Register'
import Login from '../components/auth/Login'
import Layout from '../components/Layout'
import classes from './Auth.module.scss'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Auth() {
  const auth = useAuth();
  const navigation = useNavigate();
  useEffect(() => {
    if (auth) {
      navigation('/');
    }
  }, [auth, navigation]);
  return (
    <Layout>
      <div className={classes.form_container}>
        <Login />
        <Register />
      </div>
    </Layout>
  )
}
