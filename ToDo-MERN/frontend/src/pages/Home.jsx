import React from 'react'
import Layout from '../components/Layout'
import Navbar from '../components/navigation/Navbar'
import TaskList from '../components/tasks/TaskList'

export default function Home() {
  return (
    <Layout>
      <Navbar />
      <TaskList />
    </Layout>
  )
}
