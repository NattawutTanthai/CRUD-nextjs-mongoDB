import React from 'react'
import Nav from './Nav'

function Layout(props:any) {
  return (
    <div>
      <Nav />
      {props.children}
    </div>
  )
}

export default Layout