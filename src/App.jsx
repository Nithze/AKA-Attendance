import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'boxicons/css/boxicons.min.css';
import Login from './Pages/Auth/Login.jsx';
import Dashboard from './Pages/Dashboard/Dashboard.jsx';
import { Toaster } from 'sonner';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Toaster
                toastOptions={{
                    // style: {
                    //     background: '#222',
                    //     color: '#f9f9f9',
                    //     border: '1px solid #444',
                    // },
                    style: {
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        color: '#f9f9f9',
                        border: '1px solid #222',
                        backdropFilter: 'blur(4px)',
                    },
                }}
            />

            <Routes>
                <Route path="/" element={<Login />} />
                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            </Routes>
        </Router>
    );
}

export default App;


