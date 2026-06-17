import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Reports from './pages/Reports';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) return <div>Loading...</div>;
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    if (requireAdmin && user.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }
    
    return children;
};

const Layout = ({ children }) => {
    return (
        <div className="app-container">
            <Navbar />
            <div className="main-content">
                {children}
            </div>
        </div>
    );
};

import Cart from './pages/Cart';
import Settings from './pages/Settings';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
                <Route path="/products" element={<ProtectedRoute><Layout><Products /></Layout></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><Layout><Cart /></Layout></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Layout><Orders /></Layout></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute requireAdmin={true}><Layout><Reports /></Layout></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
