import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TrendingUp, ShoppingBag, PackageOpen, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const revenueData = [
  { name: 'Mon', revenue: 400 },
  { name: 'Tue', revenue: 300 },
  { name: 'Wed', revenue: 550 },
  { name: 'Thu', revenue: 200 },
  { name: 'Fri', revenue: 700 },
  { name: 'Sat', revenue: 900 },
  { name: 'Sun', revenue: 650 },
];

const orderStatusData = [
  { name: 'Pending', value: 4, color: '#fde047' },
  { name: 'Approved', value: 8, color: '#4ade80' },
];

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>
            <div className="flex-between">
                <div>
                    <h1>Dashboard Overview</h1>
                    <p style={{color: 'var(--text-muted)', margin: 0}}>Welcome back, {user?.username}!</p>
                </div>
                <div className="badge badge-success">Active Session</div>
            </div>

            <div className="stats-grid">
                <div className="glass-panel card stat-card">
                    <div className="stat-icon"><TrendingUp size={24} /></div>
                    <div className="stat-details">
                        <h3>Total Revenue</h3>
                        <p className="stat-value">$3,700.00</p>
                    </div>
                </div>
                
                <div className="glass-panel card stat-card">
                    <div className="stat-icon"><ShoppingBag size={24} /></div>
                    <div className="stat-details">
                        <h3>Active Orders</h3>
                        <p className="stat-value">12</p>
                    </div>
                </div>

                <div className="glass-panel card stat-card">
                    <div className="stat-icon"><PackageOpen size={24} /></div>
                    <div className="stat-details">
                        <h3>Low Stock Items</h3>
                        <p className="stat-value" style={{color: 'var(--status-danger-text)'}}>3</p>
                    </div>
                </div>

                <div className="glass-panel card stat-card">
                    <div className="stat-icon"><Users size={24} /></div>
                    <div className="stat-details">
                        <h3>Registered Users</h3>
                        <p className="stat-value">48</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="glass-panel card">
                    <h2>Weekly Revenue</h2>
                    <div style={{ height: '300px', marginTop: '1rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="var(--text-muted)" />
                                <YAxis stroke="var(--text-muted)" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'var(--bg-dark)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="revenue" fill="var(--primary-accent)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel card">
                    <h2>Order Status</h2>
                    <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={orderStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {orderStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'var(--bg-dark)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <span style={{color: '#fde047', fontSize: '0.8rem'}}>● Pending (4)</span>
                        <span style={{color: '#4ade80', fontSize: '0.8rem'}}>● Approved (8)</span>
                    </div>
                </div>
            </div>

            <div className="glass-panel card">
                <h2>Recent Activity</h2>
                <p style={{color: 'var(--text-muted)'}}>No new notifications at this time. All systems are operating normally.</p>
            </div>
        </div>
    );
};

export default Dashboard;
