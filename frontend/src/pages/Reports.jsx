import { useState, useEffect } from 'react';
import api from '../services/api';
import { DownloadCloud } from 'lucide-react';

const Reports = () => {
    const [salesReport, setSalesReport] = useState([]);
    const [inventoryReport, setInventoryReport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('sales');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const [salesRes, invRes] = await Promise.all([
                api.get('/reports/sales'),
                api.get('/reports/inventory')
            ]);
            setSalesReport(salesRes.data);
            setInventoryReport(invRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex-between">
                <div>
                    <h1>Business Reports</h1>
                    <p style={{color: 'var(--text-muted)', margin: 0}}>Analytics and insights across the system.</p>
                </div>
                <button className="btn"><DownloadCloud size={18} /> Export Data</button>
            </div>

            <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
                <button 
                    className={`btn ${activeTab === 'sales' ? '' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('sales')}
                >
                    Sales Report
                </button>
                <button 
                    className={`btn ${activeTab === 'inventory' ? '' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('inventory')}
                >
                    Inventory Status
                </button>
            </div>
            
            {activeTab === 'sales' && (
                <div className="glass-panel table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer Name</th>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesReport.map((r, i) => {
                                const status = r.STATUS || r.status;
                                return (
                                    <tr key={i}>
                                        <td style={{color: 'var(--text-muted)'}}>#{r.ORDER_ID || r.order_id}</td>
                                        <td>{r.CUSTOMER_NAME || r.customer_name}</td>
                                        <td>{r.PRODUCT_NAME || r.product_name}</td>
                                        <td>{r.QUANTITY || r.quantity}</td>
                                        <td style={{fontWeight: 600}}>${r.SUBTOTAL || r.subtotal}</td>
                                        <td>
                                            <span className={`badge ${status === 'PENDING' ? 'badge-warning' : 'badge-success'}`}>
                                                {status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {salesReport.length === 0 && (
                                <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No sales data</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'inventory' && (
                <div className="glass-panel table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Supplier</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventoryReport.map((r, i) => {
                                const status = r.STOCK_STATUS || r.stock_status;
                                return (
                                    <tr key={i}>
                                        <td style={{fontWeight: 500}}>{r.PRODUCT_NAME || r.product_name}</td>
                                        <td style={{color: 'var(--text-muted)'}}>{r.SUPPLIER_NAME || r.supplier_name || 'N/A'}</td>
                                        <td>${r.PRICE || r.price}</td>
                                        <td>{r.STOCK_QUANTITY || r.stock_quantity}</td>
                                        <td>
                                            <span className={`badge ${status === 'LOW STOCK' ? 'badge-danger' : 'badge-success'}`}>
                                                {status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {inventoryReport.length === 0 && (
                                <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No inventory data</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Reports;
