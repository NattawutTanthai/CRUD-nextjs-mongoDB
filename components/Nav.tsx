import React from 'react'
import styles from './styles/Nav.module.css'
function Nav() {
  return (
    <nav className={styles.navbar}>
        <div className={styles.navItems}>
            <ul>
                <li><a href="/">My posts</a></li>
                <li><a href="/posts">Add posts</a></li>
            </ul>
        </div>
    </nav>
  )
}

export default Nav