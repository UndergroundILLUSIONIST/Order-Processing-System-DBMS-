import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Filter } from 'lucide-react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const approveOrder = async (id) => {
        try {
            await api.put(`/orders/${id}/approve`);
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message || 'Error approving order');
        }
    };

    const filteredOrders = orders.filter(o => {
        if (filter === 'ALL') return true;
        return (o.STATUS || o.status) === filter;
    });

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex-between">
                <div>
                    <h1>Orders Management</h1>
                    <p style={{color: 'var(--text-muted)', margin: 0}}>Review and process customer orders.</p>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <Filter size={18} color="var(--text-muted)" />
                    <select 
                        className="form-control" 
                        style={{width: 'auto', padding: '0.4rem 1rem'}}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="ALL">All Orders</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                    </select>
                </div>
            </div>
            
            <div className="glass-panel table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer ID</th>
                            <th>Status</th>
                            <th>Total Amount</th>
                            {user?.role === 'ADMIN' && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(o => {
                            const status = o.STATUS || o.status;
                            return (
                                <tr key={o.ORDER_ID || o.order_id}>
                                    <td style={{color: 'var(--text-muted)'}}>#{o.ORDER_ID || o.order_id}</td>
                                    <td>{o.CUSTOMER_ID || o.customer_id}</td>
                                    <td>
                                        <span className={`badge ${status === 'PENDING' ? 'badge-warning' : 'badge-success'}`}>
                                            {status}
                                        </span>
                                    </td>
                                    <td style={{fontWeight: 600}}>${o.TOTAL_AMOUNT || o.total_amount}</td>
                                    {user?.role === 'ADMIN' && (
                                        <td>
                                            {status === 'PENDING' ? (
                                                <button 
                                                    className="btn" 
                                                    style={{padding: '0.4rem 0.8rem', fontSize: '0.75rem'}}
                                                    onClick={() => approveOrder(o.ORDER_ID || o.order_id)}
                                                >
                                                    <CheckCircle size={14} /> Approve
                                                </button>
                                            ) : (
                                                <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>Processed</span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                        {filteredOrders.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No orders found matching filter</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;
