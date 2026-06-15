import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Orders = () => {
    const [orders, setOrders] = useState([]);
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

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1>Orders Management</h1>
                <button className="btn">Create New Order</button>
            </div>
            
            <div className="card">
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
                        {orders.map(o => (
                            <tr key={o.ORDER_ID || o.order_id}>
                                <td>{o.ORDER_ID || o.order_id}</td>
                                <td>{o.CUSTOMER_ID || o.customer_id}</td>
                                <td>
                                    <span style={{
                                        padding: '4px 8px', 
                                        borderRadius: '4px',
                                        backgroundColor: (o.STATUS || o.status) === 'PENDING' ? '#ffc107' : '#28a745',
                                        color: (o.STATUS || o.status) === 'PENDING' ? '#000' : '#fff',
                                        fontSize: '0.8rem'
                                    }}>
                                        {o.STATUS || o.status}
                                    </span>
                                </td>
                                <td>${o.TOTAL_AMOUNT || o.total_amount}</td>
                                {user?.role === 'ADMIN' && (
                                    <td>
                                        {(o.STATUS || o.status) === 'PENDING' && (
                                            <button 
                                                className="btn" 
                                                style={{padding: '0.25rem 0.5rem', fontSize: '0.8rem'}}
                                                onClick={() => approveOrder(o.ORDER_ID || o.order_id)}
                                            >
                                                Approve
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{textAlign: 'center'}}>No orders found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;
