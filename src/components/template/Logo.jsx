import './Logo.css'
import logo from '../../assets/imgs/truckpad-logo.svg'
import React from 'react'
import { Link } from 'react-router-dom'

export default props =>
    <div className="logo p-2 ">
        <Link to="/" className="">
            <img src={logo} alt="logo" />
        </Link>
    </div>