
import React from 'react'
import Register from '../components/auth/Register'
import Login from '../components/auth/Login'
import Layout from '../components/Layout'
import classes from './Auth.module.scss'

export default function Auth() {
  return (
    <Layout>
      <div className={classes.form_container}>
        <Login/>
        <Register/>
      </div>
    </Layout>
  )
}
