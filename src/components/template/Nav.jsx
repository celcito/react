import './Nav.css'
import React from 'react'
//import { Link } from 'react-router-dom'

export default props =>
    <nav className="navbar menu row-fluid navbar-expand-lg ">
  <ul className="nav  col-lg-12 justify-content-center">
    <li className="nav-item">
      <a className="nav-link" href="/">Home</a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="/users">Motoristas</a>
    </li>
  </ul>
</nav>