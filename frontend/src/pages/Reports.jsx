import { useState, useEffect } from 'react';
import api from '../services/api';

const Reports = () => {
    const [sales, setSales] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('sales');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const [salesRes, invRes] = await Promise.all([
                    api.get('/reports/sales'),
                    api.get('/reports/inventory')
                ]);
                setSales(salesRes.data);
                setInventory(invRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Reports</h1>
            
            <div style={{marginBottom: '1rem', display: 'flex', gap: '1rem'}}>
                <button 
                    className="btn" 
                    style={{backgroundColor: activeTab === 'sales' ? '#646cff' : '#444'}}
                    onClick={() => setActiveTab('sales')}
                >
                    Sales Report
                </button>
                <button 
                    className="btn"
                    style={{backgroundColor: activeTab === 'inventory' ? '#646cff' : '#444'}}
                    onClick={() => setActiveTab('inventory')}
                >
                    Inventory Status
                </button>
            </div>

            {activeTab === 'sales' && (
                <div className="card">
                    <h2>Sales Report</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Subtotal</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map((s, i) => (
                                <tr key={i}>
                                    <td>{s.ORDER_ID || s.order_id}</td>
                                    <td>{s.CUSTOMER_NAME || s.customer_name}</td>
                                    <td>{s.PRODUCT_NAME || s.product_name}</td>
                                    <td>{s.QUANTITY || s.quantity}</td>
                                    <td>${s.SUBTOTAL || s.subtotal}</td>
                                    <td>{s.STATUS || s.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'inventory' && (
                <div className="card">
                    <h2>Inventory Status</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Supplier</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((inv, i) => (
                                <tr key={i}>
                                    <td>{inv.PRODUCT_NAME || inv.product_name}</td>
                                    <td>{inv.SUPPLIER_NAME || inv.supplier_name}</td>
                                    <td>${inv.PRICE || inv.price}</td>
                                    <td>{inv.STOCK_QUANTITY || inv.stock_quantity}</td>
                                    <td>
                                        <span style={{
                                            color: (inv.STOCK_STATUS || inv.stock_status) === 'IN STOCK' ? '#28a745' : '#ff4d4f',
                                            fontWeight: 'bold'
                                        }}>
                                            {inv.STOCK_STATUS || inv.stock_status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Reports;
