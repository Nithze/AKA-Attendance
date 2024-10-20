import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  // Ambil userData dari localStorage dan parse sebagai objek
  const userData = JSON.parse(localStorage.getItem('userData')); // Ganti 'employeeId' dengan 'userData'

  // Cek apakah userData ada dan memiliki ID
  if (!userData || !userData.id) {
    // Jika tidak ada, redirect ke halaman login
    return <Navigate to="/" />;
  }

  // Jika ada, render komponen yang diminta
  return element;
};

export default ProtectedRoute;

