// import React, { useEffect, useState } from 'react';
// import { toast } from 'sonner'; // Menggunakan toast dari Sonner
// import './Dashboard.scss';
//
// export const Dashboard = () => {
//     const [userData, setUserData] = useState(null);
//     const [attendanceId, setAttendanceId] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [currentTime, setCurrentTime] = useState(new Date()); // Menyimpan waktu saat ini
//     const [userCoordinates, setUserCoordinates] = useState(null); // State untuk menyimpan koordinat pengguna
//     const apiUrl = import.meta.env.VITE_API_URL; // Mengambil URL dari .env
//
//     useEffect(() => {
//         // Meminta izin akses lokasi
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserCoordinates([latitude, longitude]);
//                 toast.success('Location access granted.');
//             },
//             (error) => {
//                 console.error('Error getting location', error);
//                 toast.error('Location access denied.');
//             }
//         );
//
//         const fetchUserData = async () => {
//             const storedUserData = JSON.parse(localStorage.getItem('userData'));
//             if (storedUserData && storedUserData.id) {
//                 try {
//                     const response = await fetch(`${apiUrl}/api/employees/${storedUserData.id}`);
//                     if (response.ok) {
//                         const data = await response.json();
//                         setUserData(data);
//
//                         // Fetch attendance by employee ID
//                         const attendanceResponse = await fetch(`${apiUrl}/api/attendance/employee/${storedUserData.id}`);
//                         const attendanceData = await attendanceResponse.json();
//                         if (attendanceData.length > 0) {
//                             setAttendanceId(attendanceData[0]._id); // Simpan attendanceId yang didapatkan
//                         }
//                     } else {
//                         console.error('Error fetching user data');
//                     }
//                 } catch (error) {
//                     console.error('Error fetching user data', error);
//                 }
//             }
//             setLoading(false);
//         };
//
//         fetchUserData();
//     }, [apiUrl]); // Tambahkan apiUrl ke dalam array dependencies
//
//     // Mengupdate waktu setiap detik
//     useEffect(() => {
//         const timer = setInterval(() => {
//             setCurrentTime(new Date());
//         }, 1000); // Mengupdate setiap 1 detik (1000 ms)
//
//         return () => clearInterval(timer); // Membersihkan interval saat komponen di-unmount
//     }, []);
//
//     const fetchLocation = async () => {
//         try {
//             const response = await fetch(`${apiUrl}/api/locations`);
//             if (response.ok) {
//                 return await response.json(); // Kembalikan data lokasi
//             } else {
//                 console.error('Error fetching locations');
//             }
//         } catch (error) {
//             console.error('Error fetching locations', error);
//         }
//     };
//
//     const handlePresent = async () => {
//         if (!userData) return;
//
//         const locations = await fetchLocation();
//         if (locations && locations.length > 0) {
//             const targetCoordinates = locations[0].coordinates;
//
//             const distance = calculateDistance(userCoordinates, targetCoordinates);
//             if (distance <= 1.6) { // 200 meter
//                 try {
//                     const response = await fetch(`${apiUrl}/api/attendance/checkin`, {
//                         method: 'POST',
//                         headers: {
//                             'Content-Type': 'application/json',
//                         },
//                         body: JSON.stringify({ employeeId: userData._id }),
//                     });
//
//                     const responseData = await response.json();
//                     if (response.ok) {
//                         toast.success(responseData.message || 'Check-in successful');
//                     } else {
//                         toast.error(responseData.message || 'Check-in error');
//                     }
//                 } catch (error) {
//                     toast.error('Error during check-in.');
//                 }
//             } else {
//                 toast.error('You are too far from the location.');
//             }
//         }
//     };
//     
//
//
//
//     const handleCheckout = async () => {
//         if (!attendanceId) return;
//
//         try {
//             const response = await fetch(`${apiUrl}/api/attendance/checkout`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ attendanceId }),
//             });
//
//             const responseData = await response.json();
//             if (response.ok) {
//                 toast.success(responseData.message || 'Check-out successful');
//             } else {
//                 toast.error(responseData.message || 'Check-out error');
//             }
//         } catch (error) {
//             toast.error('Error during check-out.');
//         }
//     };
//
//     const getUserCoordinates = () => {
//         return new Promise((resolve, reject) => {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const { latitude, longitude } = position.coords;
//                     resolve([latitude, longitude]);
//                 },
//                 (error) => reject(error)
//             );
//         });
//     };
//
//     const calculateDistance = (coords1, coords2) => {
//         const R = 6371; // Radius bumi dalam kilometer
//         const dLat = (coords2[0] - coords1[0]) * (Math.PI / 180);
//         const dLon = (coords2[1] - coords1[1]) * (Math.PI / 180);
//         const a =
//             Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.cos(coords1[0] * (Math.PI / 180)) * Math.cos(coords2[0] * (Math.PI / 180)) *
//             Math.sin(dLon / 2) * Math.sin(dLon / 2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//         return R * c; // Kembalikan jarak dalam kilometer
//     };
//
//     const handleLogout = () => {
//         localStorage.removeItem('userData'); // Menghapus data dari localStorage
//         window.location.href = '/'; // Mengarahkan ke halaman login
//     };
//
//     if (loading) {
//         return <p>Loading...</p>;
//     }
//
//     if (!userData) {
//         return <p>User not found.</p>;
//     }
//
//     return (
//         <div className="container">
//             <div className="navbar">
//                 <div className="title">
//                     <div>Attendance</div>
//                 </div>
//                 <div className="logout" onClick={handleLogout} >
//                     {/* <p>{userData.fullName}</p> */}
//                     <i className='bx bx-log-out'></i>
//                 </div>
//             </div>
//
//             <div className="profile">
//                 <div className="info">
//                     <div className="name">{userData.fullName}</div>
//                     <div className="nik">{userData.shift.shiftName}</div>
//                 </div>
//                 <div className="role">
//                     <div className="role">{userData.role.role}</div>
//                     <div className="salary">Salary Rp {userData.role.salary.toLocaleString()}</div>
//                 </div>
//             </div>
//
//             <div className="action-container">
//                 <div className="present" onClick={handlePresent} >
//                     <div className="left">
//                         <div className="icon">
//                             <i className='bx bx-expand-horizontal'></i>
//                         </div>
//                         <div className="title">
//                             <p className="header">Present</p>
//                             <p className="subheader">
//                                 {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
//                             </p>
//                         </div>
//                     </div>
//                     <div className="right">
//                         <p className="header">{userData.shift.startTime} - {userData.shift.endTime}</p>
//                         <p className="subheader">Click To Present</p>
//                     </div>
//                 </div>
//
//                 <div className="other-action" >
//                     <div className="left" onClick={handleCheckout} >
//                         <div className="icon">
//                             <i className='bx bx-collapse-horizontal'></i>
//                         </div>
//                         <div className="info">
//                             <p className="header">Close</p>
//                             <p className="subheader">
//                                 {userData.shift.endTime}
//                             </p>
//                         </div>
//                     </div>
//                     <div className="right">
//                         <div className="icon">
//                             <i className='bx bxs-hand'></i>
//                         </div>
//                         <div className="info">
//                             <p className="header">Request</p>
//                             <p className="subheader">Create Request</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default Dashboard;
//
// import React, { useEffect, useState } from 'react';
// import { toast } from 'sonner'; // Menggunakan toast dari Sonner
// import './Dashboard.scss';
//
// export const Dashboard = () => {
//     const [userData, setUserData] = useState(null);
//     const [attendanceId, setAttendanceId] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [currentTime, setCurrentTime] = useState(new Date()); // Menyimpan waktu saat ini
//     const apiUrl = import.meta.env.VITE_API_URL; // Mengambil URL dari .env
//
//     useEffect(() => {
//         const fetchUserData = async () => {
//             const storedUserData = JSON.parse(localStorage.getItem('userData'));
//             if (storedUserData && storedUserData.id) {
//                 try {
//                     const response = await fetch(`${apiUrl}/api/employees/${storedUserData.id}`);
//                     if (response.ok) {
//                         const data = await response.json();
//                         setUserData(data);
//
//                         // Fetch attendance by employee ID
//                         const attendanceResponse = await fetch(`${apiUrl}/api/attendance/employee/${storedUserData.id}`);
//                         const attendanceData = await attendanceResponse.json();
//                         if (attendanceData.length > 0) {
//                             setAttendanceId(attendanceData[0]._id); // Simpan attendanceId yang didapatkan
//                         }
//                     } else {
//                         console.error('Error fetching user data');
//                     }
//                 } catch (error) {
//                     console.error('Error fetching user data', error);
//                 }
//             }
//             setLoading(false);
//         };
//
//         fetchUserData();
//     }, [apiUrl]);
//
//     // Mengupdate waktu setiap detik
//     useEffect(() => {
//         const timer = setInterval(() => {
//             setCurrentTime(new Date());
//         }, 1000); // Mengupdate setiap 1 detik (1000 ms)
//
//         return () => clearInterval(timer); // Membersihkan interval saat komponen di-unmount
//     }, []);
//
//     const handlePresent = async () => {
//         if (!userData) return;
//
//         try {
//             const response = await fetch(`${apiUrl}/api/attendance/checkin`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ employeeId: userData._id }),
//             });
//
//             const responseData = await response.json();
//             if (response.ok) {
//                 toast.success(responseData.message || 'Check-in successful');
//             } else {
//                 toast.error(responseData.message || 'Check-in error');
//             }
//         } catch (error) {
//             toast.error('Error during check-in.');
//         }
//     };
//
//     const handleCheckout = async () => {
//         if (!attendanceId) return;
//
//         try {
//             const response = await fetch(`${apiUrl}/api/attendance/checkout`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ attendanceId }),
//             });
//
//             const responseData = await response.json();
//             if (response.ok) {
//                 toast.success(responseData.message || 'Check-out successful');
//             } else {
//                 toast.error(responseData.message || 'Check-out error');
//             }
//         } catch (error) {
//             toast.error('Error during check-out.');
//         }
//     };
//
//     const handleLogout = () => {
//         localStorage.removeItem('userData'); // Menghapus data dari localStorage
//         window.location.href = '/'; // Mengarahkan ke halaman login
//     };
//
//     if (loading) {
//         return <p>Loading...</p>;
//     }
//
//     if (!userData) {
//         return <p>User not found.</p>;
//     }
//
//     return (
//         <div className="container">
//             <div className="navbar">
//                 <div className="title">
//                     <div>Attendance</div>
//                 </div>
//                 <div className="logout" onClick={handleLogout} >
//                     <i className='bx bx-log-out'></i>
//                 </div>
//             </div>
//
//             <div className="profile">
//                 <div className="info">
//                     <div className="name">{userData.fullName}</div>
//                     <div className="nik">{userData.shift.shiftName}</div>
//                 </div>
//                 <div className="role">
//                     <div className="role">{userData.role.role}</div>
//                     <div className="salary">Salary Rp {userData.role.salary.toLocaleString()}</div>
//                 </div>
//             </div>
//
//             <div className="action-container">
//                 <div className="present" onClick={handlePresent} >
//                     <div className="left">
//                         <div className="icon">
//                             <i className='bx bx-expand-horizontal'></i>
//                         </div>
//                         <div className="title">
//                             <p className="header">Present</p>
//                             <p className="subheader">
//                                 {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
//                             </p>
//                         </div>
//                     </div>
//                     <div className="right">
//                         <p className="header">{userData.shift.startTime} - {userData.shift.endTime}</p>
//                         <p className="subheader">Click To Present</p>
//                     </div>
//                 </div>
//
//                 <div className="other-action" >
//                     <div className="left" onClick={handleCheckout} >
//                         <div className="icon">
//                             <i className='bx bx-collapse-horizontal'></i>
//                         </div>
//                         <div className="info">
//                             <p className="header">Close</p>
//                             <p className="subheader">
//                                 {userData.shift.endTime}
//                             </p>
//                         </div>
//                     </div>
//                     <div className="right">
//                         <div className="icon">
//                             <i className='bx bxs-hand'></i>
//                         </div>
//                         <div className="info">
//                             <p className="header">Request</p>
//                             <p className="subheader">Create Request</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//
//             <div className="list-attendance">
//             </div>
//         </div>
//     );
// }
//
// export default Dashboard;
//
//
// import React, { useEffect, useState } from 'react';
// import { toast } from 'sonner'; // Menggunakan toast dari Sonner
// import './Dashboard.scss';
//
// export const Dashboard = () => {
//     const [userData, setUserData] = useState(null);
//     const [attendanceId, setAttendanceId] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [currentTime, setCurrentTime] = useState(new Date());
//     const [showRequestForm, setShowRequestForm] = useState(false); // State untuk popup
//     const [requestReason, setRequestReason] = useState(''); // State untuk alasan permintaan
//     const apiUrl = import.meta.env.VITE_API_URL;
//
//     useEffect(() => {
//         const fetchUserData = async () => {
//             const storedUserData = JSON.parse(localStorage.getItem('userData'));
//             if (storedUserData && storedUserData.id) {
//                 try {
//                     const response = await fetch(`${apiUrl}/api/employees/${storedUserData.id}`);
//                     if (response.ok) {
//                         const data = await response.json();
//                         setUserData(data);
//                         const attendanceResponse = await fetch(`${apiUrl}/api/attendance/employee/${storedUserData.id}`);
//                         const attendanceData = await attendanceResponse.json();
//                         if (attendanceData.length > 0) {
//                             setAttendanceId(attendanceData[0]._id);
//                         }
//                     } else {
//                         console.error('Error fetching user data');
//                     }
//                 } catch (error) {
//                     console.error('Error fetching user data', error);
//                 }
//             }
//             setLoading(false);
//         };
//
//         fetchUserData();
//     }, [apiUrl]);
//
//     useEffect(() => {
//         const timer = setInterval(() => {
//             setCurrentTime(new Date());
//         }, 1000);
//
//         return () => clearInterval(timer);
//     }, []);
//
//     const handlePresent = async () => {
//         if (!userData) return;
//
//         try {
//             const response = await fetch(`${apiUrl}/api/attendance/checkin`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ employeeId: userData._id }),
//             });
//
//             const responseData = await response.json();
//             if (response.ok) {
//                 toast.success(responseData.message || 'Check-in successful');
//             } else {
//                 toast.error(responseData.message || 'Check-in error');
//             }
//         } catch (error) {
//             toast.error('Error during check-in.');
//         }
//     };
//
//     const handleCheckout = async () => {
//         if (!attendanceId) return;
//
//         try {
//             const response = await fetch(`${apiUrl}/api/attendance/checkout`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ attendanceId }),
//             });
//
//             const responseData = await response.json();
//             if (response.ok) {
//                 toast.success(responseData.message || 'Check-out successful');
//             } else {
//                 toast.error(responseData.message || 'Check-out error');
//             }
//         } catch (error) {
//             toast.error('Error during check-out.');
//         }
//     };
//
//     const handleLogout = () => {
//         localStorage.removeItem('userData');
//         window.location.href = '/';
//     };
//
//     // Fungsi untuk membuka dan menutup popup
//     const toggleRequestForm = () => {
//         setShowRequestForm(!showRequestForm);
//     };
//
//     const handleSubmitRequest = async (e) => {
//         e.preventDefault();
//         if (!requestReason) return;
//
//         try {
//             const response = await fetch(`${apiUrl}/api/attendance/leave`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     employeeId: userData._id,
//                     reason: requestReason,
//                 }),
//             });
//
//             const responseData = await response.json();
//             if (response.ok) {
//                 toast.success(responseData.message || 'Request submitted successfully');
//                 setRequestReason(''); // Reset alasan
//                 toggleRequestForm(); // Tutup popup
//             } else {
//                 toast.error(responseData.message || 'Request submission error');
//             }
//         } catch (error) {
//             toast.error('Error during request submission.');
//         }
//     };
//
//     if (loading) {
//         return <p>Loading...</p>;
//     }
//
//     if (!userData) {
//         return <p>User not found.</p>;
//     }
//
//     return (
//         <div className="container">
//             <div className="navbar">
//                 <div className="title">
//                     <div>Attendance</div>
//                 </div>
//                 <div className="logout" onClick={handleLogout}>
//                     <i className='bx bx-log-out'></i>
//                 </div>
//             </div>
//
//             <div className="profile">
//                 <div className="info">
//                     <div className="name">{userData.fullName}</div>
//                     <div className="nik">{userData.shift.shiftName}</div>
//                 </div>
//                 <div className="role">
//                     <div className="role">{userData.role.role}</div>
//                     <div className="salary">Salary Rp {userData.role.salary.toLocaleString()}</div>
//                 </div>
//             </div>
//
//             <div className="action-container">
//                 <div className="present" onClick={handlePresent}>
//                     <div className="left">
//                         <div className="icon">
//                             <i className='bx bx-expand-horizontal'></i>
//                         </div>
//                         <div className="title">
//                             <p className="header">Present</p>
//                             <p className="subheader">
//                                 {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
//                             </p>
//                         </div>
//                     </div>
//                     <div className="right">
//                         <p className="header">{userData.shift.startTime} - {userData.shift.endTime}</p>
//                         <p className="subheader">Click To Present</p>
//                     </div>
//                 </div>
//
//                 <div className="other-action">
//                     <div className="left" onClick={handleCheckout}>
//                         <div className="icon">
//                             <i className='bx bx-collapse-horizontal'></i>
//                         </div>
//                         <div className="info">
//                             <p className="header">Close</p>
//                             <p className="subheader">
//                                 {userData.shift.endTime}
//                             </p>
//                         </div>
//                     </div>
//                     <div className="right" onClick={toggleRequestForm}>
//                         <div className="icon">
//                             <i className='bx bxs-hand'></i>
//                         </div>
//                         <div className="info">
//                             <p className="header">Request</p>
//                             <p className="subheader">Create Request</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//
//             <div className="list-attendance">
//             </div>
//
//             {/* Popup Form Request */}
//             {showRequestForm && (
//                 <div className="popup">
//                     <div className="popup-content">
//                         <h2>Request Leave</h2>
//                         <form onSubmit={handleSubmitRequest}>
//                             <div className="form-group">
//                                 <label htmlFor="reason">Reason</label>
//                                 <textarea
//                                     id="reason"
//                                     value={requestReason}
//                                     onChange={(e) => setRequestReason(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                             <button type="submit">Submit Request</button>
//                             <button type="button" onClick={toggleRequestForm}>Cancel</button>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
//
// export default Dashboard;
//
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner'; // Menggunakan toast dari Sonner
import './Dashboard.scss';

export const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [attendanceId, setAttendanceId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showRequestForm, setShowRequestForm] = useState(false); // State untuk popup
    const [requestReason, setRequestReason] = useState(''); // State untuk alasan permintaan
    const apiUrl = import.meta.env.VITE_API_URL;
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const storedUserData = JSON.parse(localStorage.getItem('userData'));
            if (storedUserData && storedUserData.id) {
                try {
                    const response = await fetch(`${apiUrl}/api/employees/${storedUserData.id}`);
                    if (response.ok) {
                        const data = await response.json();
                        setUserData(data);
                        const attendanceResponse = await fetch(`${apiUrl}/api/attendance/employee/${storedUserData.id}`);
                        const attendanceData = await attendanceResponse.json();
                        if (attendanceData.length > 0) {
                            setAttendanceId(attendanceData[0]._id);
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
    }, [apiUrl]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handlePresent = async () => {
        if (!userData) return;

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
                toast.success(responseData.message || 'Check-in successful');
            } else {
                toast.error(responseData.message || 'Check-in error');
            }
        } catch (error) {
            toast.error('Error during check-in.');
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
                toast.success(responseData.message || 'Check-out successful');
            } else {
                toast.error(responseData.message || 'Check-out error');
            }
        } catch (error) {
            toast.error('Error during check-out.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userData');
        window.location.href = '/';
    };

    // Fungsi untuk membuka dan menutup popup
    // const toggleRequestForm = () => {
    //     setShowRequestForm(!showRequestForm);
    //     if (showRequestForm) {
    //         setRequestReason(''); // Clear input when closing the popup
    //     }
    // };
    const toggleRequestForm = () => {
        if (showRequestForm) {
            setIsClosing(true);
            setTimeout(() => {
                setShowRequestForm(false);
                setRequestReason(''); // Clear input when closing the popup
                setIsClosing(false);
            }, 300); // Sesuaikan dengan durasi animasi fade-out
        } else {
            setShowRequestForm(true);
        }
    };

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        if (!requestReason) return;

        try {
            const response = await fetch(`${apiUrl}/api/attendance/leave`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    employeeId: userData._id,
                    reason: requestReason,
                }),
            });

            const responseData = await response.json();
            if (response.ok) {
                toast.success(responseData.message || 'Request submitted successfully');
                setRequestReason(''); // Reset alasan
                toggleRequestForm(); // Tutup popup
            } else {
                toast.error(responseData.message || 'Request submission error');
            }
        } catch (error) {
            toast.error('Error during request submission.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!userData) {
        return <p>User not found.</p>;
    }

    return (
        <div className="container">
            <div className="navbar">
                <div className="title">
                    <div>Attendance</div>
                </div>
                <div className="logout" onClick={handleLogout}>
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
                <div className="present" onClick={handlePresent}>
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

                <div className="other-action">
                    <div className="left" onClick={handleCheckout}>
                        <div className="icon">
                            <i className='bx bx-collapse-horizontal'></i>
                        </div>
                        <div className="info">
                            <p className="header">Close</p>
                            <p className="subheader">
                                {userData.shift.endTime}
                            </p>
                        </div>
                    </div>
                    <div className="right" onClick={toggleRequestForm}>
                        <div className="icon">
                            {/* <i className='bx bxs-hand'></i> */}
                            <i className='bx bx-expand-vertical'></i>

                        </div>
                        <div className="info">
                            <p className="header">Request</p>
                            <p className="subheader">Create Request</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="list-attendance">
            </div>

            {showRequestForm && (
                <div className={`popup ${isClosing ? 'fade-out' : ''}`}>
                    <div className="popup-content">
                        <h2>Request Absence</h2>
                        <form onSubmit={handleSubmitRequest}>
                            <div className="form-group">
                                <label htmlFor="reason">Reason and explanation of absence</label>
                                <textarea
                                    id="reason"
                                    value={requestReason}
                                    onChange={(e) => setRequestReason(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="action">
                                <button type="button" onClick={toggleRequestForm}>Cancel</button>
                                <button type="submit">Submit Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Dashboard;

