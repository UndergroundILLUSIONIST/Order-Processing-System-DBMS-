import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <h2><Link to="/" style={{color: 'inherit', textDecoration: 'none'}}>Order System</Link></h2>
            </div>
            <div className="nav-links">
                {user ? (
                    <>
                        <Link to="/">Dashboard</Link>
                        <Link to="/products">Products</Link>
                        <Link to="/orders">Orders</Link>
                        {user.role === 'ADMIN' && <Link to="/reports">Reports</Link>}
                        <button className="btn" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
