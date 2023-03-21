import React from 'react';
import classes from './Layout.module.scss'

export default function Layout({children}) {
  return (
	<main className={classes.container}>{children}</main>
  )
}
