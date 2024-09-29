import React from 'react'
import './Dashboard.scss'

export const Dashboard = () => {
    return (
        <>
            <div className="container">
                <div className="navbar">
                    <div className="title">
                        <p>Attendance</p>
                    </div>
                    <div className="logout">
                        <p>Azhar</p>
                        <i class='bx bx-log-out'></i>
                    </div>
                </div>
                <hr></hr>
            </div>
        </>
    )
}

export default Dashboard

