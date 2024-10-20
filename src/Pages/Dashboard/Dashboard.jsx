import React, { useEffect, useState } from 'react';
import { toast } from 'sonner'; // Menggunakan toast dari Sonner
import './Dashboard.scss';

export const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [attendanceId, setAttendanceId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date()); // Menyimpan waktu saat ini
    const apiUrl = import.meta.env.VITE_API_URL; // Mengambil URL dari .env

    useEffect(() => {
        const fetchUserData = async () => {
            const storedUserData = JSON.parse(localStorage.getItem('userData'));
            if (storedUserData && storedUserData.id) {
                try {
                    const response = await fetch(`${apiUrl}/api/employees/${storedUserData.id}`);
                    if (response.ok) {
                        const data = await response.json();
                        setUserData(data);

                        // Fetch attendance by employee ID
                        const attendanceResponse = await fetch(`${apiUrl}/api/attendance/employee/${storedUserData.id}`);
                        const attendanceData = await attendanceResponse.json();
                        if (attendanceData.length > 0) {
                            setAttendanceId(attendanceData[0]._id); // Simpan attendanceId yang didapatkan
                        }
                    } else {
                        console.error('Error fetching user data');
                    }
                } catch (error) {
                    console.error('Error fetching user data', error);
                }
            }
            setLoading(false);
        };

        fetchUserData();
    }, [apiUrl]); // Tambahkan apiUrl ke dalam array dependencies

    // Mengupdate waktu setiap detik
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Mengupdate setiap 1 detik (1000 ms)

        return () => clearInterval(timer); // Membersihkan interval saat komponen di-unmount
    }, []);

    const fetchLocation = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/locations`);
            if (response.ok) {
                return await response.json(); // Kembalikan data lokasi
            } else {
                console.error('Error fetching locations');
            }
        } catch (error) {
            console.error('Error fetching locations', error);
        }
    };

    const handlePresent = async () => {
        if (!userData) return;

        const locations = await fetchLocation();
        if (locations && locations.length > 0) {
            const userCoordinates = await getUserCoordinates();
            const targetCoordinates = locations[0].coordinates;

            const distance = calculateDistance(userCoordinates, targetCoordinates);
            if (distance <= 1.6) { // 200 meter
                try {
                    const response = await fetch(`${apiUrl}/api/attendance/checkin`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ employeeId: userData._id }),
                    });

                    const responseData = await response.json();
                    if (response.ok) {
                        toast.success(responseData.message || 'Check-in Succes');
                    } else {
                        toast.error(responseData.message || 'Check-in Error');
                    }
                } catch (error) {
                    toast.error('Error check-in.');
                }
            } else {
                toast.error('Error Check-in');
            }
        }
    };

    const handleCheckout = async () => {
        if (!attendanceId) return;

        try {
            const response = await fetch(`${apiUrl}/api/attendance/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ attendanceId }),
            });

            const responseData = await response.json();
            if (response.ok) {
                toast.success(responseData.message || 'Check-out succes');
            } else {
                toast.error(responseData.message || 'Check-out error');
            }
        } catch (error) {
            toast.error('Error check-out.');
        }
    };

    const getUserCoordinates = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    resolve([latitude, longitude]);
                },
                (error) => reject(error)
            );
        });
    };

    const calculateDistance = (coords1, coords2) => {
        const R = 6371; // Radius bumi dalam kilometer
        const dLat = (coords2[0] - coords1[0]) * (Math.PI / 180);
        const dLon = (coords2[1] - coords1[1]) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(coords1[0] * (Math.PI / 180)) * Math.cos(coords2[0] * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Kembalikan jarak dalam kilometer
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!userData) {
        return <p>User not found.</p>;
    }
    const handleLogout = () => {
    localStorage.removeItem('userData'); // Menghapus data dari localStorage
    window.location.href = '/'; // Mengarahkan ke halaman login
};


    return (
        <div className="container">
            <div className="navbar">
                <div className="title">
                    <p>Attendance</p>
                </div>
                <div className="logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                    <p>{userData.fullName}</p>
                    <i className='bx bx-log-out'></i>
                </div>
            </div>

            <div className="profile">
                <div className="info">
                    <div className="name">{userData.fullName}</div>
                    <div className="nik">{userData.shift.shiftName}</div>
                </div>
                <div className="role">
                    <div className="role">{userData.role.role}</div>
                    <div className="salary">Salary Rp {userData.role.salary.toLocaleString()}</div>
                </div>
            </div>

            <div className="action-container">
                <div className="present" onClick={handlePresent} style={{ cursor: 'pointer' }}>
                    <div className="left">
                        <div className="icon">
                            <i className='bx bx-expand-horizontal'></i>
                        </div>
                        <div className="title">
                            <p className="header">Present</p>
                            <p className="subheader">
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                            </p>

                        </div>
                    </div>
                    <div className="right">
                        <p className="header">{userData.shift.startTime} - {userData.shift.endTime}</p>
                        <p className="subheader">Click To Present</p>
                    </div>
                </div>

                <div className="other-action" onClick={handleCheckout} style={{ cursor: 'pointer' }}>
                    <div className="left">
                        <div className="icon">
                            <i className='bx bx-collapse-horizontal'></i>
                        </div>
                        <div className="info">
                            <p className="header">Close</p>
                            <p className="subheader">
                                {userData.shift.endTime}
                                {/* {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })} */}
                            </p>

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
    );
}

export default Dashboard;

