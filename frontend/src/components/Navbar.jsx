import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, LogOut, Hexagon, ShoppingBag, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="sidebar glass-panel">
            <Link to="/" className="sidebar-logo">
                <Hexagon size={28} strokeWidth={2.5} />
                <span>Order Flow</span>
            </Link>

            <div className="nav-links">
                <Link to="/" className={`nav-item ${isActive('/')}`}>
                    <LayoutDashboard /> Dashboard
                </Link>
                <Link to="/products" className={`nav-item ${isActive('/products')}`}>
                    <Package /> Products
                </Link>
                <Link to="/cart" className={`nav-item ${isActive('/cart')}`} style={{justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                        <ShoppingBag /> Cart
                    </div>
                    {cartCount > 0 && (
                        <span className="badge badge-success">{cartCount}</span>
                    )}
                </Link>
                <Link to="/orders" className={`nav-item ${isActive('/orders')}`}>
                    <ShoppingCart /> Orders
                </Link>
                {user?.role === 'ADMIN' && (
                    <Link to="/reports" className={`nav-item ${isActive('/reports')}`}>
                        <BarChart3 /> Reports
                    </Link>
                )}
                <Link to="/settings" className={`nav-item ${isActive('/settings')}`}>
                    <User /> Settings
                </Link>
            </div>

            <div className="logout-btn-container" style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <button className="btn btn-danger" onClick={handleLogout} style={{width: '100%', justifyContent: 'center', backgroundColor: 'var(--status-danger)', color: 'white'}}>
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
