import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, Key } from 'lucide-react';

const Settings = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>
            <div className="flex-between">
                <div>
                    <h1>Profile Settings</h1>
                    <p style={{color: 'var(--text-muted)', margin: 0}}>Manage your account preferences and security.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="glass-panel card">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <User size={20} color="var(--primary-accent)" /> Personal Information
                    </h2>
                    
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" className="form-control" defaultValue={user?.username} disabled />
                        <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'block'}}>Your username cannot be changed.</span>
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="email" className="form-control" defaultValue={`${user?.username}@example.com`} style={{ paddingLeft: '2.5rem' }} />
                        </div>
                    </div>

                    <button className="btn">Save Changes</button>
                </div>

                <div className="glass-panel card">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <Shield size={20} color="var(--primary-accent)" /> Security
                    </h2>

                    <div className="form-group">
                        <label>Current Role</label>
                        <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className={`badge ${user?.role === 'ADMIN' ? 'badge-danger' : 'badge-success'}`}>
                                {user?.role}
                            </span>
                            <span style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>
                                {user?.role === 'ADMIN' ? 'Full system access' : 'Standard shopping access'}
                            </span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>New Password</label>
                        <div style={{ position: 'relative' }}>
                            <Key size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="password" className="form-control" placeholder="Enter new password" style={{ paddingLeft: '2.5rem' }} />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <Key size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="password" className="form-control" placeholder="Confirm new password" style={{ paddingLeft: '2.5rem' }} />
                        </div>
                    </div>

                    <button className="btn btn-secondary">Update Password</button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
