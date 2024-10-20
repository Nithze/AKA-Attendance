// import React from 'react';
// import './Login.scss'; 
//
// const Login = () => {
//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <h2>Login</h2>
//         <p>Enter your Phone Number and password to login.</p>
//         <form>
//           <div className="form-group">
//             <label htmlFor="username">NIK or Username</label>
//             <input
//               type="text"
//               id="username"
//               name="username"
//               placeholder="Enter phone number"
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               placeholder="Enter password"
//               required
//             />
//           </div>
//           <div className="login-btn-container">
//             <button type="submit" className="login-btn">Login</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
//
// export default Login;
// import React, { useState } from 'react';
// import { toast } from 'sonner'; // Menggunakan toast dari Sonner
// import { useNavigate } from 'react-router-dom'; // Untuk redirect
// import './Login.scss';
//
// const Login = () => {
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [password, setPassword] = useState('');
//     const navigate = useNavigate();
//
//     const handleLogin = async (e) => {
//         e.preventDefault();
//
//         const loginData = {
//             phoneNumber,
//             password,
//         };
//
//         try {
//             const response = await fetch('http://localhost:5000/api/employees/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(loginData),
//             });
//
//             if (response.ok) {
//                 const data = await response.json();
//
//                 // Simpan hanya ID karyawan di localStorage
//                 localStorage.setItem('userData', JSON.stringify({ id: data.id }));
//
//                 // Tampilkan toast sukses
//                 toast.success('Login berhasil!');
//
//                 // Redirect ke dashboard
//                 navigate('/dashboard');
//             } else {
//                 // Tampilkan toast error
//                 toast.error('Login gagal. Cek kembali kredensial Anda.');
//             }
//         } catch (error) {
//             toast.error('Terjadi kesalahan. Coba lagi.');
//         }
//     };
//
//
//     return (
//         <div className="login-container">
//             <div className="login-card">
//                 <h2>Login</h2>
//                 <p>Masukkan nomor telepon dan password Anda untuk login.</p>
//                 <form onSubmit={handleLogin}>
//                     <div className="form-group">
//                         <label htmlFor="username">Nomor Telepon</label>
//                         <input
//                             type="text"
//                             id="username"
//                             name="phoneNumber"
//                             placeholder="Masukkan nomor telepon"
//                             value={phoneNumber}
//                             onChange={(e) => setPhoneNumber(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="password">Password</label>
//                         <input
//                             type="password"
//                             id="password"
//                             name="password"
//                             placeholder="Masukkan password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="login-btn-container">
//                         <button type="submit" className="login-btn">Login</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// export default Login;
//

import React, { useState } from 'react';
import { toast } from 'sonner'; // Menggunakan toast dari Sonner
import { useNavigate } from 'react-router-dom'; // Untuk redirect
import './Login.scss';

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL; // Mengambil URL dari .env

    const handleLogin = async (e) => {
        e.preventDefault();

        const loginData = {
            phoneNumber,
            password,
        };

        try {
            const response = await fetch(`${apiUrl}/api/employees/login`, { // Menggunakan apiUrl
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                const data = await response.json();

                // Simpan hanya ID karyawan di localStorage
                localStorage.setItem('userData', JSON.stringify({ id: data.id }));

                // Tampilkan toast sukses
                toast.success('Login succes redirect to dashboard');

                // Redirect ke dashboard
                navigate('/dashboard');
            } else {
                // Tampilkan toast error
                toast.error('Login Error check our credential');
            }
        } catch (error) {
            toast.error('Error.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                <p>Masukkan nomor telepon dan password Anda untuk login.</p>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">Nomor Telepon</label>
                        <input
                            type="text"
                            id="username"
                            name="phoneNumber"
                            placeholder="Masukkan nomor telepon"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Masukkan password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="login-btn-container">
                        <button type="submit" className="login-btn">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;

