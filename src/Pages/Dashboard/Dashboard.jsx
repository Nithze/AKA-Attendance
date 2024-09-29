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
                        <i className='bx bx-log-out'></i>
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
                {/* end profile */}

                <div className="action-container">
                    <div className="present">
                        <div className="left">
                            <div className="icon">
                                <i className='bx bx-expand-horizontal'></i>
                            </div>
                            <div className="title">
                                <p className="header">Present</p>
                                <p className="subheader">07:00 PM</p>
                            </div>
                        </div>
                        <div className="right">
                            <p className="header">07:00 PM - 12:00 AM</p>
                            <p className="subheader">Click To Present</p>
                        </div>
                    </div>

                    <div className="other-action">
                        <div className="left">
                            <div className="icon">
                                <i className='bx bx-collapse-horizontal'></i>
                            </div>
                            <div className="info">
                                <p className="header">Close</p>
                                <p className="subheader">07:00 PM</p>
                            </div>
                        </div>
                        <div className="right">
                            <div className="icon">
                                <i className='bx bxs-hand'></i>
                            </div>
                            <div className="info">
                                <p className="header">Request</p>
                                <p className="subheader">07:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Dashboard

