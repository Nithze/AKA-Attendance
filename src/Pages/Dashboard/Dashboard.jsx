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
                {/* navbar end */}
                {/* <hr></hr> */}

                <div className="profile">
                    <div className="info">
                        <div className="name">Aldi Yusronazhar</div>
                        <div className="nik">Morning Shift</div>
                    </div>
                    <div className="role">
                        <div className="role">Barista</div>
                        <div className="salary">Salary Rp 3.000.000</div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Dashboard

